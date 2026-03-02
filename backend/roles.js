require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('Conectado a la base 🚀');

    const adminPassword = await bcrypt.hash('Admin2024!', 10);
    const empleadoPassword = await bcrypt.hash('Empleado2024!', 10);

    // Borrar si existen
    await connection.execute(
      `DELETE FROM usuarios WHERE email IN (?, ?)`,
      ['admin@hotel.com', 'recepcion@hotel.com']
    );

    // Insertar admin
    await connection.execute(
      `INSERT INTO usuarios 
      (nombre, apellido, email, password_hash, auth_provider, rol, activo, verificado)
      VALUES (?, ?, ?, ?, 'local', 'admin', 1, 1)`,
      ['Luciana', 'Ortega', 'admin@hotel.com', adminPassword]
    );

    // Insertar empleado
    await connection.execute(
      `INSERT INTO usuarios 
      (nombre, apellido, email, password_hash, auth_provider, rol, activo, verificado)
      VALUES (?, ?, ?, ?, 'local', 'empleado', 1, 1)`,
      ['Martín', 'Salvatierra', 'recepcion@hotel.com', empleadoPassword]
    );

    console.log('Usuarios creados correctamente 💥');
    console.log('Admin → admin@hotel.com / Admin2024!');
    console.log('Empleado → recepcion@hotel.com / Empleado2024!');

    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

seed();