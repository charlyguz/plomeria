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

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    enableArithAbort: true
  }
};

let pool;

(async function initializeDatabaseConnection() {
  try {
    pool = await sql.connect(dbConfig);
    console.log('Database connection established.');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
})();

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

    const result = await pool.request()
      .input('CorreoElectronico', sql.VarChar, CorreoElectronico)
      .input('Contrasena', sql.VarChar, hashedPassword)
      .input('Nombre', sql.VarChar, Nombre)
      .input('Rol', sql.VarChar, Rol)
      .query('INSERT INTO Persona (CorreoElectronico, Contrasena, Nombre, Rol) VALUES (@CorreoElectronico, @Contrasena, @Nombre, @Rol)');

    res.json({ message: 'User registered successfully', userId: result.recordset[0].ID_Persona });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { CorreoElectronico, Contrasena } = req.body;
    console.log('Attempting login for:', CorreoElectronico);

    const rows = await pool.request()
      .input('CorreoElectronico', sql.VarChar, CorreoElectronico)
      .query('SELECT * FROM Persona WHERE CorreoElectronico = @CorreoElectronico');

    console.log('Login query result:', rows.recordset);

    if (rows.recordset.length > 0) {
      const user = rows.recordset[0];
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

app.get('/api/test-db', async (req, res) => {
  try {
    console.log('Connecting to the database...');
    const result = await pool.request().query('SELECT * FROM Persona');
    console.log('Database connection established and data retrieved:', result.recordset);
    //res.json({ message: 'Database connection successful', data: result.recordset });
    res.json({ message: 'Database connection successful' });
  } catch (err) {
    console.error('Error connecting to the database:', err);
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

app.post('/api/servicios', async (req, res) => {
  try {
    const { TipoServicio, Direccion } = req.body;

    if (!req.session.user || !req.session.user.ID_Persona) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

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
  }
});


// Continuación del endpoint para obtener servicios
app.get('/api/servicios', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.Rol !== 'Tecnico') {
      return res.status(401).json({ error: 'User not authenticated or not a technician' });
    }

    const tecnicoId = req.session.user.ID_Persona;
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
  }
});

app.get('/api/servicios/:id/progreso', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.request()
      .input('ID_Servicio', sql.Int, id)
      .query('SELECT recogerMateriales, dirigirseDireccion, concluirTrabajo FROM Servicio WHERE ID_Servicio = @ID_Servicio');
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
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

    const result = await pool.request()
      .input('ID_Servicio', sql.Int, id)
      .query('SELECT recogerMateriales, dirigirseDireccion, concluirTrabajo, Calificacion, FechaCompletado FROM Servicio WHERE ID_Servicio = @ID_Servicio');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    const { recogerMateriales, dirigirseDireccion, concluirTrabajo, Calificacion, FechaCompletado } = result.recordset[0];

    if (estado) {
      await pool.request()
        .input('Estado', sql.VarChar, estado)
        .input('ID_Servicio', sql.Int, id)
        .query('UPDATE Servicio SET Estado = @Estado WHERE ID_Servicio = @ID_Servicio');
      if (estado === 'Esperando Calificación') {
        const tecnicoIdResult = await pool.request()
          .input('ID_Servicio', sql.Int, id)
          .query('SELECT ID_Tecnico FROM Servicio WHERE ID_Servicio = @ID_Servicio');
        const tecnicoId = tecnicoIdResult.recordset[0].ID_Tecnico;

        await pool.request()
          .input('ID_Persona', sql.Int, tecnicoId)
          .query('UPDATE Persona SET Disponible = 1 WHERE ID_Persona = @ID_Persona');
      } else if (estado === 'Completado') {
        const fechaCompletado = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await pool.request()
          .input('FechaCompletado', sql.DateTime, fechaCompletado)
          .input('ID_Servicio', sql.Int, id)
          .query('UPDATE Servicio SET FechaCompletado = @FechaCompletado WHERE ID_Servicio = @ID_Servicio');
      }
    }

    if (calificacion) {
      await pool.request()
        .input('Calificacion', sql.Int, calificacion)
        .input('ID_Servicio', sql.Int, id)
        .query('UPDATE Servicio SET Calificacion = @Calificacion WHERE ID_Servicio = @ID_Servicio');
    }

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
  }
});

// Get all technical people
app.get('/api/tecnicos', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM Persona WHERE Rol = \'Tecnico\'');

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching technicians:', err);
    res.status(500).json({ error: 'Failed to fetch technicians' });
  }
});

// Get all material
app.get('/api/material', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM Material');

    res.json(result.recordset);
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


// Continuación del endpoint para obtener estadísticas
app.get('/api/estadisticas', async (req, res) => {
  try {
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
  }
});

// Endpoint para obtener servicios de un usuario en particular
app.get('/api/servicios/:id_cliente', async (req, res) => {
  try {
    const { id_cliente } = req.params;
    const result = await pool.request()
      .input('ID_Cliente', sql.Int, id_cliente)
      .query(`
        SELECT * FROM Servicio WHERE ID_Cliente = @ID_Cliente AND Estado IN ('Pendiente', 'Aceptado', 'En Camino', 'En Proceso', 'Esperando Calificación')
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Endpoint para obtener la sesión del usuario
app.get('/api/session', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
});

// Endpoint para actualizar materiales en un servicio
app.post('/api/servicios/:id/materiales', async (req, res) => {
  try {
    const { id } = req.params;
    const { materiales } = req.body;

    for (const material of materiales) {
      // Insertar o actualizar el detalle del servicio y material
      await pool.request()
        .input('ID_Servicio', sql.Int, id)
        .input('ID_Material', sql.Int, material.ID_Material)
        .input('CantidadUtilizada', sql.Int, material.CantidadUtilizada)
        .query(`
          INSERT INTO DetalleServicioMaterial (ID_Servicio, ID_Material, CantidadUtilizada) 
          VALUES (@ID_Servicio, @ID_Material, @CantidadUtilizada)
          ON DUPLICATE KEY UPDATE CantidadUtilizada = CantidadUtilizada + @CantidadUtilizada
        `);

      // Actualizar la cantidad disponible de material en el inventario
      await pool.request()
        .input('ID_Material', sql.Int, material.ID_Material)
        .input('CantidadUtilizada', sql.Int, material.CantidadUtilizada)
        .query(`
          UPDATE Material 
          SET CantidadDisponible = CantidadDisponible - @CantidadUtilizada 
          WHERE ID_Material = @ID_Material
        `);
    }

    res.json({ message: 'Materiales actualizados correctamente' });
  } catch (err) {
    console.error('Error actualizando materiales:', err);
    res.status(500).json({ error: 'Failed to update materials' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

