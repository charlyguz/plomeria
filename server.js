import express from 'express';
import sql from 'mssql';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 1433;

// Configuración de la conexión a la base de datos
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Usar esta opción si estás en Azure
    enableArithAbort: true
  }
};

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
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

    if (!CorreoElectronico || !/\S+@\S+\.\S+/.test(CorreoElectronico)) {
      return res.status(400).json({ error: 'Correo electrónico inválido' });
    }
    if (!Contrasena) {
      return res.status(400).json({ error: 'Contraseña es requerida' });
    }
    if (!Nombre) {
      return res.status(400).json({ error: 'Nombre es requerido' });
    }
    const hashedPassword = await hashPassword(Contrasena);

    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('CorreoElectronico', sql.VarChar, CorreoElectronico)
      .input('Contrasena', sql.VarChar, hashedPassword)
      .input('Nombre', sql.VarChar, Nombre)
      .input('Rol', sql.VarChar, Rol)
      .query('INSERT INTO Persona (CorreoElectronico, Contrasena, Nombre, Rol) VALUES (@CorreoElectronico, @Contrasena, @Nombre, @Rol)');
    
    res.json({ message: 'User registered successfully', userId: result.recordset[0].ID_Persona });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  } finally {
    sql.close();
  }
});


app.post('/api/servicios', async (req, res) => {
  try {
    const { TipoServicio, Direccion } = req.body;

    if (!req.session.user || !req.session.user.ID_Persona) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const pool = await sql.connect(dbConfig);
    const existingService = await pool.request()
      .input('ID_Cliente', sql.Int, req.session.user.ID_Persona)
      .query('SELECT * FROM Servicio WHERE ID_Cliente = @ID_Cliente AND Estado != \'Completado\'');
    
    if (existingService.recordset.length > 0) {
      return res.status(400).json({ error: 'No puede solicitar más de un servicio a la vez' });
    }

    if (!TipoServicio || !Direccion.Calle || !Direccion.NumeroExterior || !Direccion.Colonia || !Direccion.Alcaldia || !Direccion.CodigoPostal) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const FechaSolicitud = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const CostoTotal = calculateCostoTotal(TipoServicio);

    const direccionResult = await pool.request()
      .input('Calle', sql.VarChar, Direccion.Calle)
      .input('NumeroExterior', sql.VarChar, Direccion.NumeroExterior)
      .input('NumeroInterior', sql.VarChar, Direccion.NumeroInterior)
      .input('Colonia', sql.VarChar, Direccion.Colonia)
      .input('Alcaldia', sql.VarChar, Direccion.Alcaldia)
      .input('CodigoPostal', sql.VarChar, Direccion.CodigoPostal)
      .query('INSERT INTO Direccion (Calle, NumeroExterior, NumeroInterior, Colonia, Alcaldia, CodigoPostal) OUTPUT INSERTED.ID_Direccion VALUES (@Calle, @NumeroExterior, @NumeroInterior, @Colonia, @Alcaldia, @CodigoPostal)');

    let tecnicoResult = await pool.request()
      .query('SELECT TOP 1 * FROM Persona WHERE Rol = \'Tecnico\' AND Disponible = 1 AND ID_Persona NOT IN (SELECT ID_Tecnico FROM Servicio WHERE Estado IN (\'Aceptado\', \'En Camino\', \'En Proceso\')) ORDER BY ID_Persona');

    let tecnicoAsignado = null;
    if (tecnicoResult.recordset.length > 0) {
      tecnicoAsignado = tecnicoResult.recordset[0].ID_Persona;
      await pool.request()
        .input('ID_Persona', sql.Int, tecnicoAsignado)
        .query('UPDATE Persona SET Disponible = 0 WHERE ID_Persona = @ID_Persona');
    }

    await pool.request()
      .input('TipoServicio', sql.VarChar, TipoServicio)
      .input('CostoTotal', sql.Decimal, CostoTotal)
      .input('Estado', sql.VarChar, 'Pendiente')
      .input('ID_Cliente', sql.Int, req.session.user.ID_Persona)
      .input('ID_Tecnico', sql.Int, tecnicoAsignado)
      .input('ID_Direccion', sql.Int, direccionResult.recordset[0].ID_Direccion)
      .input('FechaSolicitud', sql.DateTime, FechaSolicitud)
      .query('INSERT INTO Servicio (TipoServicio, CostoTotal, Estado, ID_Cliente, ID_Tecnico, ID_Direccion, FechaSolicitud) VALUES (@TipoServicio, @CostoTotal, @Estado, @ID_Cliente, @ID_Tecnico, @ID_Direccion, @FechaSolicitud)');

    res.json({ message: 'Servicio added successfully' });
  } catch (err) {
    console.error('Error adding Servicio:', err);
    res.status(500).json({ error: 'Failed to add Servicio' });
  } finally {
    sql.close();
  }
});



app.get('/api/servicios', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.Rol !== 'Tecnico') {
      return res.status(401).json({ error: 'User not authenticated or not a technician' });
    }

    const tecnicoId = req.session.user.ID_Persona;
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('ID_Tecnico', sql.Int, tecnicoId)
      .query(`
        SELECT s.ID_Servicio, s.TipoServicio, s.CostoTotal, s.Estado, s.ID_Cliente, s.ID_Tecnico, s.ID_Direccion, s.FechaSolicitud, s.FechaCompletado, s.Calificacion,
               s.recogerMateriales, s.dirigirseDireccion, s.concluirTrabajo, 
               d.Calle, d.NumeroExterior, d.NumeroInterior, d.Colonia, d.Alcaldia, d.CodigoPostal
        FROM Servicio s
        JOIN Direccion d ON s.ID_Direccion = d.ID_Direccion
        WHERE s.ID_Tecnico = @ID_Tecnico
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ error: 'Failed to fetch services' });
  } finally {
    sql.close();
  }
});


app.get('/api/servicios/:id/progreso', async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT recogerMateriales, dirigirseDireccion, concluirTrabajo FROM Servicio WHERE ID_Servicio = ?', [id]);
    conn.release();
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Servicio no encontrado' });
    }
  } catch (err) {
    console.error('Error fetching progress:', err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

app.put('/api/servicios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, calificacion } = req.body;

    const conn = await pool.getConnection();

    const [servicio] = await conn.query('SELECT recogerMateriales, dirigirseDireccion, concluirTrabajo, Calificacion, FechaCompletado FROM Servicio WHERE ID_Servicio = ?', [id]);

    if (!servicio) {
      conn.release();
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    const { recogerMateriales, dirigirseDireccion, concluirTrabajo, Calificacion, FechaCompletado } = servicio;

    if (estado) {
      await conn.query('UPDATE Servicio SET Estado = ? WHERE ID_Servicio = ?', [estado, id]);
      if (estado === 'Esperando Calificación') {
        const tecnicoIdResult = await conn.query('SELECT ID_Tecnico FROM Servicio WHERE ID_Servicio = ?', [id]);
        const tecnicoId = tecnicoIdResult[0].ID_Tecnico;

        await conn.query('UPDATE Persona SET Disponible = 1 WHERE ID_Persona = ?', [tecnicoId]);
      } else if (estado === 'Completado') {
        const fechaCompletado = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await conn.query('UPDATE Servicio SET FechaCompletado = ? WHERE ID_Servicio = ?', [fechaCompletado, id]);
      }
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

app.put('/api/servicios/:id/progreso', async (req, res) => {
  try {
    const { id } = req.params;
    const { recogerMateriales, dirigirseDireccion, concluirTrabajo } = req.body;

    const pool = await sql.connect(dbConfig);
    const query = `
      UPDATE Servicio 
      SET recogerMateriales = ISNULL(@recogerMateriales, recogerMateriales), 
          dirigirseDireccion = ISNULL(@dirigirseDireccion, dirigirseDireccion), 
          concluirTrabajo = ISNULL(@concluirTrabajo, concluirTrabajo) 
      WHERE ID_Servicio = @ID_Servicio`;

    await pool.request()
      .input('recogerMateriales', sql.Bit, recogerMateriales)
      .input('dirigirseDireccion', sql.Bit, dirigirseDireccion)
      .input('concluirTrabajo', sql.Bit, concluirTrabajo)
      .input('ID_Servicio', sql.Int, id)
      .query(query);

    res.json({ message: 'Progreso actualizado correctamente' });
  } catch (err) {
    console.error('Error actualizando progreso del servicio:', err);
    res.status(500).json({ error: 'Failed to update progress' });
  } finally {
    sql.close();
  }
});


// Get all technical people
app.get('/api/tecnicos', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM Persona WHERE Rol = \'Tecnico\'');

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching technicians:', err);
    res.status(500).json({ error: 'Failed to fetch technicians' });
  } finally {
    sql.close();
  }
});


// Get all material
app.get('/api/material', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM Material');

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching material:', err);
    res.status(500).json({ error: 'Failed to fetch material' });
  } finally {
    sql.close();
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
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT 1 as val');
    res.json({ message: 'Database connection successful', result: result.recordset });
  } catch (err) {
    console.error('Error connecting to the database:', err);
    res.status(500).json({ error: 'Database connection failed' });
  } finally {
    sql.close();
  }
});



// Endpoint para login
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

// Endpoint para obtener estadísticas
app.get('/api/estadisticas', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const totalSolicitados = await pool.request().query('SELECT COUNT(*) as total FROM Servicio');
    const totalCompletados = await pool.request().query('SELECT COUNT(*) as total FROM Servicio WHERE FechaCompletado IS NOT NULL');
    const tiempoPromedioRespuesta = await pool.request().query('SELECT AVG(DATEDIFF(HOUR, FechaSolicitud, FechaSolicitud)) as promedio FROM Servicio');
    const tiempoPromedioFinalizacion = await pool.request().query('SELECT AVG(DATEDIFF(HOUR, FechaSolicitud, FechaCompletado)) as promedio FROM Servicio WHERE FechaCompletado IS NOT NULL');
    const rendimientoTecnicos = await pool.request().query('SELECT Persona.Nombre, COUNT(*) as servicios FROM Persona JOIN Servicio ON Persona.ID_Persona = Servicio.ID_Tecnico WHERE Persona.Rol = \'Tecnico\' GROUP BY Persona.Nombre');
    const utilizacionMateriales = await pool.request().query('SELECT Material.Nombre, SUM(DetalleServicioMaterial.CantidadUtilizada) as cantidad FROM Material JOIN DetalleServicioMaterial ON Material.ID_Material = DetalleServicioMaterial.ID_Material GROUP BY Material.Nombre');
    const costosYBeneficios = await pool.request().query('SELECT SUM(CostoTotal) as ingresos, ISNULL(SUM(Material.CostoUnitario * DetalleServicioMaterial.CantidadUtilizada), 0) as costos FROM Servicio LEFT JOIN DetalleServicioMaterial ON Servicio.ID_Servicio = DetalleServicioMaterial.ID_Servicio LEFT JOIN Material ON DetalleServicioMaterial.ID_Material = Material.ID_Material');
    const calificacionesTecnicos = await pool.request().query('SELECT Persona.Nombre, AVG(Servicio.Calificacion) as calificacion FROM Persona JOIN Servicio ON Persona.ID_Persona = Servicio.ID_Tecnico WHERE Persona.Rol = \'Tecnico\' AND Servicio.Calificacion IS NOT NULL GROUP BY Persona.Nombre');
    const estadoTrabajos = await pool.request().query('SELECT Estado, COUNT(*) as cantidad FROM Servicio GROUP BY Estado');
    const evidencias = await pool.request().query('SELECT Persona.Nombre, COUNT(Evidencia.ID_Evidencia) as evidencias FROM Persona JOIN Servicio ON Persona.ID_Persona = Servicio.ID_Tecnico JOIN Evidencia ON Servicio.ID_Servicio = Evidencia.ID_Servicio WHERE Persona.Rol = \'Tecnico\' GROUP BY Persona.Nombre');

    const convertBigIntToNumber = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'bigint') {
          obj[key] = Number(obj[key]);
        }
      }
      return obj;
    };

    const response = {
      totalSolicitados: totalSolicitados.recordset[0].total || 0,
      totalCompletados: totalCompletados.recordset[0].total || 0,
      tiempoPromedioRespuesta: tiempoPromedioRespuesta.recordset[0].promedio || 0,
      tiempoPromedioFinalizacion: tiempoPromedioFinalizacion.recordset[0].promedio || 0,
      rendimientoTecnicos: rendimientoTecnicos.recordset.map(convertBigIntToNumber),
      utilizacionMateriales: utilizacionMateriales.recordset.map(convertBigIntToNumber),
      costosYBeneficios: convertBigIntToNumber({
        ingresos: costosYBeneficios.recordset[0].ingresos || 0,
        costos: costosYBeneficios.recordset[0].costos || 0,
        beneficioNeto: (costosYBeneficios.recordset[0].ingresos || 0) - (costosYBeneficios.recordset[0].costos || 0)
      }),
      calificacionesTecnicos: calificacionesTecnicos.recordset.map(convertBigIntToNumber),
      estadoTrabajos: estadoTrabajos.recordset.map(convertBigIntToNumber),
      evidencias: evidencias.recordset.map(convertBigIntToNumber)
    };

    res.json(response);
  } catch (err) {
    console.error('Error fetching statistics:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  } finally {
    sql.close();
  }
});








// Endpoint para obtener servicios de un usuario en particular
app.get('/api/servicios/:id_cliente', async (req, res) => {
  try {
    const { id_cliente } = req.params;
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('ID_Cliente', sql.Int, id_cliente)
      .query(`
        SELECT * FROM Servicio WHERE ID_Cliente = @ID_Cliente AND Estado IN ('Pendiente', 'Aceptado', 'En Camino', 'En Proceso', 'Esperando Calificación')
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ error: 'Failed to fetch services' });
  } finally {
    sql.close();
  }
});


app.get('/api/session', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
});


app.post('/api/servicios/:id/materiales', async (req, res) => {
  try {
    const { id } = req.params;
    const { materiales } = req.body;

    const conn = await pool.getConnection();

    for (const material of materiales) {
      // Insertar o actualizar el detalle del servicio y material
      await conn.query(`
        INSERT INTO detalleserviciomaterial (ID_Servicio, ID_Material, CantidadUtilizada) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE CantidadUtilizada = CantidadUtilizada + ?
      `, [id, material.ID_Material, material.CantidadUtilizada, material.CantidadUtilizada]);

      // Actualizar la cantidad disponible de material en el inventario
      await conn.query(`
        UPDATE material 
        SET CantidadDisponible = CantidadDisponible - ? 
        WHERE ID_Material = ?
      `, [material.CantidadUtilizada, material.ID_Material]);
    }

    conn.release();
    res.json({ message: 'Materiales actualizados correctamente' });
  } catch (err) {
    console.error('Error actualizando materiales:', err);
    res.status(500).json({ error: 'Failed to update materials' });
  }
});



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
