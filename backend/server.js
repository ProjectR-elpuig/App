const express = require('express');
const mariadb = require('mariadb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Importa el paquete CORS

const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');
require('dotenv').config();


// Inicializar Express
const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:8100', // Origen permitido (tu aplicación Ionic)
  methods: ['GET', 'POST'],       // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));

// Middleware para parsear JSON
app.use(express.json());

// Confiramos sesiones para manejar la auth de Discord
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Pool de conexión a MariaDB
const pool = mariadb.createPool({
    host: '185.221.20.53', // Cambia si usas un host diferente
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
    console.log("Creo la conexión con la DB");
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

// Configurar la estrategia de Discord
passport.use(new DiscordStrategy(
  {
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'email'], // Puedes agregar "email" u otros permisos si los necesitas
  },
  async (accessToken, refreshToken, profile, done) => {
    // Verificar si el usuario existe en la base de datos
    try {
      console.log("profile", profile); // Verás información como el ID, username, avatar, etc.
      const rows = await query('SELECT * FROM users WHERE discord_id = ?', [profile.id]);
      console.log("rows.length", rows.length)
      // if (rows.length === 0) {
      //   // Si no existe, denegar el acceso
      //   return done(null, false, { message: 'El usuario no está autorizado.' });
      // }
      // Si existe, devolver el perfil
      return done(null, profile);
    } catch (err) {
      console.error('Error en la autenticación de Discord:', err);
      return done(err, null);
    }
  }
));

// Serializar y deserializar usuario
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));


// Ruta para iniciar sesión con Discord
app.get('/auth/discord', passport.authenticate('discord'));

// Callback de Discord
app.get('/auth/discord/callback',
  passport.authenticate('discord', {
    failureRedirect: '/', // Redirigir en caso de fallo
  }),
  (req, res) => {
    // Autenticación exitosa
    res.redirect('/dashboard');
  }
);

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'No autorizado' });
};

// Ejemplo de ruta protegida
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.json({
    message: `Bienvenido, ${req.user.username}`,
    discordId: req.user.id,
  });
});


// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


