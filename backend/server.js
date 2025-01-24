const express = require('express');
const mariadb = require('mariadb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Importa el paquete CORS

// Inicializar Express
const app = express();

// Configuración de CORS
// app.use(cors({
//   origin: 'http://localhost:8100', // Origen permitido (tu aplicación Ionic)
//   methods: ['GET', 'POST'],       // Métodos HTTP permitidos
//   allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
// }));

// Middleware para parsear JSON
app.use(express.json());

// Pool de conexión a MariaDB
const pool = mariadb.createPool({
    host: '185.221.20.35', // Cambia si usas un host diferente
    user: 'vlink',         // Cambia al usuario configurado
    password: 'xijojoPo42W8kiloPOvA5OjIvopuXo', // Cambia a tu contraseña
    database: 'vlink',     // Nombre de la base de datos
    connectionLimit: 5,
});

// Función para ejecutar consultas
const query = async (sql, params = []) => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("Creo la conexión con el servidor");
    const rows = await conn.query(sql, params);
    return rows;
  } catch (err) {
    console.error('Error al ejecutar consulta:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

// Registro de usuarios
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log("Te creo el usuario", username, password);

  if (!username || !password) {
    return res.status(400).json({ error: 'Se requieren usuario y contraseña.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await query(`INSERT INTO users (username, password) VALUES (?, ?)`, [
      username,
      hashedPassword,
    ]);
    res.status(201).json({ message: 'Usuario registrado con éxito.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El usuario ya existe.' });
    }
    res.status(500).json({ error: 'Error al registrar el usuario.' });
  }
});

// Login de usuarios
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Se requieren usuario y contraseña.' });
  }

  try {
    const rows = await query(`SELECT * FROM users WHERE username = ?`, [username]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, 'SECRET_KEY', {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Inicio de sesión exitoso.', token });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
