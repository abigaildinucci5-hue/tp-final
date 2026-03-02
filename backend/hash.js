const bcrypt = require('bcryptjs');

(async () => {
  const admin = await bcrypt.hash('Admin2024!', 10);
  const empleado = await bcrypt.hash('Empleado2024!', 10);

  console.log('Admin hash:');
  console.log(admin);
  console.log('\nEmpleado hash:');
  console.log(empleado);
})();