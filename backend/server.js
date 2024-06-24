import express from 'express';
import mariadb from 'mariadb';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv'; // Import dotenv
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
  origin: 'http://localhost:5173', // Replace with your React app's actual origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Session middleware
app.use(session({
  secret: 'yourSecretKey', // Replace with your own secret key
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set secure to true in production
}));

// --- Helper Functions ---

async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// --- API Endpoints ---

app.post('/api/persona', async (req, res) => {
    try {
        const { CorreoElectronico, Contrasena , Rol} = req.body; 
        const hashedPassword = await hashPassword(Contrasena);
        const conn = await pool.getConnection();
        const result = await conn.query(
            'INSERT INTO Persona (CorreoElectronico, Contrasena, Rol) VALUES (?, ?, ?)',
            [CorreoElectronico, hashedPassword, Rol]
        );
        conn.release();
        res.json({ message: 'User registered successfully', userId: result.insertId.toString() });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Endpoint to handle service requests
app.post('/api/servicios', async (req, res) => {
    try {
      const { TipoServicio, Calle, NumeroExterior, NumeroInterior, Colonia, Alcaldia, CodigoPostal } = req.body;
      console.log('Received request body:', req.body);  
      if (!TipoServicio || !Calle || !NumeroExterior || !Colonia || !Alcaldia || !CodigoPostal) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const Fecha = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const Hora = new Date().toLocaleTimeString('en-US', { timeStyle: 'short' }); // HH:MM AM/PM
    
      const CostoTotal = calculateCostoTotal(TipoServicio);
      console.log("entro");
      const Direccion = `${Calle} ${NumeroExterior} ${NumeroInterior}, ${Colonia}, ${Alcaldia}, ${CodigoPostal}`;
    
      const conn = await pool.getConnection();
      await conn.query(
        'INSERT INTO Servicio (TipoServicio, CostoTotal, Estado, Direccion) VALUES (?, ?, "Pendiente", ?)',
        [TipoServicio, CostoTotal, Direccion]
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
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM Servicio');
      conn.release();
      res.json(rows);
  } catch (err) {
      console.error('Error fetching services:', err);
      res.status(500).json({ error: 'Failed to fetch services' });
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
  
    const costoBase = costosBase[tipoServicio] || 0; // Default to 0 if service type not found
    const iva = costoBase * 0.16; // Assuming 16% IVA
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
      const isPasswordValid = Contrasena === user.Contrasena;

      if (isPasswordValid) {
        req.session.user = user;  // Guarda el usuario en la sesión
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
    res.clearCookie('connect.sid'); // Limpia la cookie de la sesión
    res.json({ message: 'Logout successful' });
  });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
