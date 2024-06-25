import express from 'express';
import mariadb from 'mariadb';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// Database Connection Pool
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// --- Helper Functions ---
async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// --- API Endpoints ---
app.post('/api/persona', async (req, res) => {
  try {
    const { CorreoElectronico, Contrasena, Rol, Nombre } = req.body; 
    const hashedPassword = await hashPassword(Contrasena);
    
    const conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO Persona (CorreoElectronico, Contrasena, Nombre, Rol) VALUES (?, ?, ?, ?)',
      [CorreoElectronico, hashedPassword, Nombre, Rol]
    );
    conn.release();
    
    res.json({ message: 'User registered successfully', userId: result.insertId.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/servicios', async (req, res) => {
  try {
    const { TipoServicio, Direccion } = req.body;

    // Verificar si el usuario está en la sesión
    if (!req.session.user || !req.session.user.ID_Persona) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Verificar si el cliente ya tiene un servicio en curso
    const conn = await pool.getConnection();
    const existingService = await conn.query(
      'SELECT * FROM Servicio WHERE ID_Cliente = ? AND Estado != "Completado"',
      [req.session.user.ID_Persona]
    );
    if (existingService.length > 0) {
      conn.release();
      return res.status(400).json({ error: 'No puede solicitar más de un servicio a la vez' });
    }

    if (!TipoServicio || !Direccion.Calle || !Direccion.NumeroExterior || !Direccion.Colonia || !Direccion.Alcaldia || !Direccion.CodigoPostal) {
      conn.release();
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const FechaSolicitud = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const CostoTotal = calculateCostoTotal(TipoServicio);

    const direccionResult = await conn.query(
      'INSERT INTO Direccion (Calle, NumeroExterior, NumeroInterior, Colonia, Alcaldia, CodigoPostal) VALUES (?, ?, ?, ?, ?, ?)',
      [Direccion.Calle, Direccion.NumeroExterior, Direccion.NumeroInterior, Direccion.Colonia, Direccion.Alcaldia, Direccion.CodigoPostal]
    );

    // Buscar un técnico disponible en la misma alcaldía
    let tecnicoResult = await conn.query(
      'SELECT * FROM Persona WHERE Rol = "Tecnico" AND Disponible = 1 AND ID_Persona NOT IN (SELECT ID_Tecnico FROM Servicio WHERE Estado IN ("Aceptado", "En Camino", "En Proceso")) ORDER BY ID_Persona LIMIT 1'
    );

    // Si no se encuentra técnico en la misma alcaldía, buscar en toda la ciudad
    if (tecnicoResult.length === 0) {
      tecnicoResult = await conn.query(
        'SELECT * FROM Persona WHERE Rol = "Tecnico" AND Disponible = 1 AND ID_Persona NOT IN (SELECT ID_Tecnico FROM Servicio WHERE Estado IN ("Aceptado", "En Camino", "En Proceso")) ORDER BY ID_Persona LIMIT 1'
      );
    }

    let tecnicoAsignado = null;
    if (tecnicoResult.length > 0) {
      tecnicoAsignado = tecnicoResult[0].ID_Persona;
      await conn.query(
        'UPDATE Persona SET Disponible = 0 WHERE ID_Persona = ?',
        [tecnicoAsignado]
      );
    }

    await conn.query(
      'INSERT INTO Servicio (TipoServicio, CostoTotal, Estado, ID_Cliente, ID_Tecnico, ID_Direccion, FechaSolicitud) VALUES (?, ?, "Pendiente", ?, ?, ?, ?)',
      [TipoServicio, CostoTotal, req.session.user.ID_Persona, tecnicoAsignado, direccionResult.insertId, FechaSolicitud]
    );
    conn.release();
    
    res.json({ message: 'Servicio added successfully' });
  } catch (err) {
    console.error('Error adding Servicio:', err);
    res.status(500).json({ error: 'Failed to add Servicio' });
  }
});



app.get('/api/servicios', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.Rol !== 'Tecnico') {
      return res.status(401).json({ error: 'User not authenticated or not a technician' });
    }

    const tecnicoId = req.session.user.ID_Persona;
    const conn = await pool.getConnection();
    const rows = await conn.query(`
      SELECT s.*, d.Calle, d.NumeroExterior, d.NumeroInterior, d.Colonia, d.Alcaldia, d.CodigoPostal
      FROM Servicio s
      JOIN Direccion d ON s.ID_Direccion = d.ID_Direccion
      WHERE s.ID_Tecnico = ?
    `, [tecnicoId]);
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});




// Endpoint para actualizar el estado del servicio y calificar al técnico
app.put('/api/servicios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, evidencia, calificacion } = req.body;

    const conn = await pool.getConnection();
    if (estado) {
      await conn.query('UPDATE Servicio SET Estado = ? WHERE ID_Servicio = ?', [estado, id]);
      if (estado === 'Completado') {
        const fechaCompletado = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await conn.query('UPDATE Servicio SET FechaCompletado = ? WHERE ID_Servicio = ?', [fechaCompletado, id]);
        
        const tecnicoIdResult = await conn.query('SELECT ID_Tecnico FROM Servicio WHERE ID_Servicio = ?', [id]);
        const tecnicoId = tecnicoIdResult[0].ID_Tecnico;
        
        await conn.query('UPDATE Persona SET Disponible = 1 WHERE ID_Persona = ?', [tecnicoId]);
      }
    }
    if (evidencia) {
      await conn.query('INSERT INTO Evidencia (Foto, FechaHora, ID_Servicio) VALUES (?, ?, ?)', [evidencia, new Date().toISOString().slice(0, 19).replace('T', ' '), id]);
    }
    if (calificacion) {
      await conn.query('UPDATE Servicio SET Calificacion = ? WHERE ID_Servicio = ?', [calificacion, id]);
    }
    conn.release();

    res.json({ message: 'Servicio updated successfully' });
  } catch (err) {
    console.error('Error updating Servicio:', err);
    res.status(500).json({ error: 'Failed to update Servicio' });
  }
});



// Get all technical people
app.get('/api/tecnicos', async (req, res) => {
  try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM Persona WHERE Rol = "Tecnico"');
      conn.release();
      res.json(rows);
  } catch (err) {
      console.error('Error fetching technicians:', err);
      res.status(500).json({ error: 'Failed to fetch technicians' });
  }
});

// Get all material
app.get('/api/material', async (req, res) => {
  try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM Material');
      conn.release();
      res.json(rows);
  } catch (err) {
      console.error('Error fetching material:', err);
      res.status(500).json({ error: 'Failed to fetch material' });
  }
});

function calculateCostoTotal(tipoServicio) {
    const costosBase = {
      'Mantenimiento preventivo y lavado de tinacos': 500,
      'Reparación de fuga de agua': 800,
      'Instalación de calentador de agua': 1200
    };
  
    const costoBase = costosBase[tipoServicio] || 0;
    const iva = costoBase * 0.16;
    return costoBase + iva;
}

// Endpoint de prueba de conexión a la base de datos
app.get('/api/test-db', async (req, res) => {
  try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT 1 as val');
      conn.release();
      res.json({ message: 'Database connection successful', result: rows });
  } catch (err) {
      console.error('Error connecting to the database:', err);
      res.status(500).json({ error: 'Database connection failed' });
  }
});

// Endpoint para login
app.post('/api/login', async (req, res) => {
  try {
    const { CorreoElectronico, Contrasena } = req.body;
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM Persona WHERE CorreoElectronico = ?', [CorreoElectronico]);
    conn.release();

    if (rows.length > 0) {
      const user = rows[0];
      const isPasswordValid = await bcrypt.compare(Contrasena, user.Contrasena);

      if (isPasswordValid) {
        req.session.user = user;
        res.json({ message: 'Login successful', user });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

// Endpoint para logout
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

app.delete('/api/tecnicos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();

    // Primero eliminar cualquier servicio asignado a este técnico
    await conn.query('DELETE FROM Servicio WHERE ID_Tecnico = ?', [id]);

    // Luego eliminar el técnico de la tabla Persona
    await conn.query('DELETE FROM Persona WHERE ID_Persona = ?', [id]);

    conn.release();
    res.json({ message: 'Técnico eliminado exitosamente' });
  } catch (err) {
    console.error('Error deleting technician:', err);
    res.status(500).json({ error: 'Failed to delete technician' });
  }
});

app.put('/api/material/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    const conn = await pool.getConnection();
    await conn.query('UPDATE Material SET CantidadDisponible = CantidadDisponible + ? WHERE ID_Material = ?', [cantidad, id]);
    conn.release();

    res.json({ message: 'Material updated successfully' });
  } catch (err) {
    console.error('Error updating material:', err);
    res.status(500).json({ error: 'Failed to update material' });
  }
});

// Endpoint to get statistics
app.get('/api/estadisticas', async (req, res) => {
  try {
    const conn = await pool.getConnection();

    // Total de servicios solicitados
    const [totalSolicitados] = await conn.query('SELECT COUNT(*) as total FROM Servicio');
    // Total de servicios completados
    const [totalCompletados] = await conn.query('SELECT COUNT(*) as total FROM Servicio WHERE Estado = "Completado"');
    // Tiempo promedio de respuesta
    const [tiempoPromedioRespuesta] = await conn.query('SELECT AVG(TIMESTAMPDIFF(HOUR, FechaSolicitud, FechaSolicitud)) as promedio FROM Servicio');
    // Tiempo promedio de finalización
    const [tiempoPromedioFinalizacion] = await conn.query('SELECT AVG(TIMESTAMPDIFF(HOUR, FechaSolicitud, FechaCompletado)) as promedio FROM Servicio WHERE Estado = "Completado"');
    // Rendimiento de técnicos
    const rendimientoTecnicos = await conn.query('SELECT Persona.Nombre, COUNT(*) as servicios FROM Persona JOIN Servicio ON Persona.ID_Persona = Servicio.ID_Tecnico WHERE Persona.Rol = "Tecnico" GROUP BY Persona.Nombre');
    // Utilización de materiales
    const utilizacionMateriales = await conn.query('SELECT Material.Nombre, SUM(DetalleServicioMaterial.CantidadUtilizada) as cantidad FROM Material JOIN DetalleServicioMaterial ON Material.ID_Material = DetalleServicioMaterial.ID_Material GROUP BY Material.Nombre');
    // Costos y beneficios
    const [costosYBeneficios] = await conn.query('SELECT SUM(CostoTotal) as ingresos, IFNULL(SUM(Material.CostoUnitario * DetalleServicioMaterial.CantidadUtilizada), 0) as costos FROM Servicio LEFT JOIN DetalleServicioMaterial ON Servicio.ID_Servicio = DetalleServicioMaterial.ID_Servicio LEFT JOIN Material ON DetalleServicioMaterial.ID_Material = Material.ID_Material');
    // Calificaciones de técnicos
    const calificacionesTecnicos = await conn.query('SELECT Persona.Nombre, AVG(Servicio.Calificacion) as calificacion FROM Persona JOIN Servicio ON Persona.ID_Persona = Servicio.ID_Tecnico WHERE Persona.Rol = "Tecnico" AND Servicio.Calificacion IS NOT NULL GROUP BY Persona.Nombre');
    // Estado de los trabajos
    const estadoTrabajos = await conn.query('SELECT Estado, COUNT(*) as cantidad FROM Servicio GROUP BY Estado');
    // Evidencias de trabajos
    const evidencias = await conn.query('SELECT Persona.Nombre, COUNT(Evidencia.ID_Evidencia) as evidencias FROM Persona JOIN Servicio ON Persona.ID_Persona = Servicio.ID_Tecnico JOIN Evidencia ON Servicio.ID_Servicio = Evidencia.ID_Servicio WHERE Persona.Rol = "Tecnico" GROUP BY Persona.Nombre');

    conn.release();

    // Convertir BigInt a Number
    const convertBigIntToNumber = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'bigint') {
          obj[key] = Number(obj[key]);
        }
      }
      return obj;
    };

    res.json({
      totalSolicitados: Number(totalSolicitados[0]?.total || 0),
      totalCompletados: Number(totalCompletados[0]?.total || 0),
      tiempoPromedioRespuesta: Number(tiempoPromedioRespuesta[0]?.promedio || 0),
      tiempoPromedioFinalizacion: Number(tiempoPromedioFinalizacion[0]?.promedio || 0),
      rendimientoTecnicos: rendimientoTecnicos.map(convertBigIntToNumber),
      utilizacionMateriales: utilizacionMateriales.map(convertBigIntToNumber),
      costosYBeneficios: convertBigIntToNumber({
        ingresos: costosYBeneficios.ingresos || 0,
        costos: costosYBeneficios.costos || 0,
        beneficioNeto: (costosYBeneficios.ingresos || 0) - (costosYBeneficios.costos || 0)
      }),
      calificacionesTecnicos: calificacionesTecnicos.map(convertBigIntToNumber),
      estadoTrabajos: estadoTrabajos.map(convertBigIntToNumber),
      evidencias: evidencias.map(convertBigIntToNumber)
    });
  } catch (err) {
    console.error('Error fetching statistics:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});



// Endpoint para actualizar el estado del servicio y calificar al técnico
// Endpoint para obtener servicios de un usuario en particular
app.get('/api/servicios/:id_cliente', async (req, res) => {
  try {
    const { id_cliente } = req.params;
    const conn = await pool.getConnection();
    const services = await conn.query('SELECT * FROM Servicio WHERE ID_Cliente = ? AND Estado != "Completado"', [id_cliente]);
    conn.release();
    res.json(services);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});







app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
