// backend/test-habitaciones.js
// Script para verificar directamente desde Node.js si la habitación existe

require('dotenv').config();
const { ejecutarConsulta } = require('./src/config/baseDatos');

async function testHabitaciones() {
  try {
    console.log('\n🧪 PRUEBA: Verificar Habitación 102\n');
    console.log('='.repeat(50));

    // 1. Verificar que los tipos de habitación existen
    console.log('\n1️⃣  Verificando tipos de habitación...');
    const tipos = await ejecutarConsulta('SELECT * FROM tipos_habitacion');
    console.log(`   ✅ Total tipos: ${tipos.length}`);
    tipos.forEach(t => {
      console.log(`      - ID: ${t.id_tipo}, Nombre: ${t.nombre}, Activo: ${t.activo}`);
    });

    // 2. Verificar que la habitación 102 existe
    console.log('\n2️⃣  Verificando habitación 102...');
    const habitacion102 = await ejecutarConsulta(
      'SELECT * FROM habitaciones WHERE numero_habitacion = "102"'
    );
    
    if (habitacion102.length === 0) {
      console.log('   ❌ Habitación 102 NO existe en la BD');
      console.log('   ⚠️  Necesitas ejecutar el script: VERIFICAR_E_INSERTAR_HABITACION.sql');
    } else {
      const h = habitacion102[0];
      console.log(`   ✅ Habitación encontrada:`);
      console.log(`      - ID: ${h.id_habitacion}`);
      console.log(`      - Número: ${h.numero_habitacion}`);
      console.log(`      - Tipo ID: ${h.id_tipo}`);
      console.log(`      - Estado: ${h.estado}`);
      console.log(`      - Activo: ${h.activo}`);
      console.log(`      - Imagen: ${h.imagen_principal}`);
    }

    // 3. Verificar qué habitaciones retorna la API
    console.log('\n3️⃣  Verificando habitaciones disponibles...');
    const disponibles = await ejecutarConsulta(`
      SELECT 
        h.id_habitacion,
        h.numero_habitacion,
        h.estado,
        h.activo,
        h.imagen_principal,
        t.nombre as tipo
      FROM habitaciones h
      JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
      WHERE h.activo = TRUE AND h.estado = 'disponible'
      LIMIT 10
    `);

    console.log(`   ✅ Total habitaciones disponibles: ${disponibles.length}`);
    disponibles.forEach(h => {
      console.log(`      - ${h.numero_habitacion}: ${h.tipo} (${h.estado})`);
    });

    // 4. Verificar la consulta exacta que usa obtenerHabitacionesPopulares
    console.log('\n4️⃣  Verificando respuesta de API (simulada)...');
    const apiResponse = await ejecutarConsulta(`
      SELECT 
        h.id_habitacion,
        h.numero_habitacion,
        h.descripcion_detallada,
        h.imagen_principal,
        h.galeria_imagenes,
        h.amenidades,
        h.vista,
        h.piso,
        h.estado,
        t.id_tipo,
        t.nombre as tipo_nombre,
        t.descripcion as tipo_descripcion,
        t.capacidad_personas,
        t.precio_base,
        t.precio_empleado,
        t.metros_cuadrados
      FROM habitaciones h
      JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
      WHERE h.activo = TRUE AND h.estado = 'disponible'
      ORDER BY h.id_habitacion DESC
      LIMIT 8
    `);

    console.log(`   ✅ Habitaciones que retorna la API: ${apiResponse.length}`);
    if (apiResponse.length === 0) {
      console.log('   ⚠️  LA API RETORNA 0 HABITACIONES');
      console.log('   ⚠️  Esto explica por qué no aparecen en el frontend');
    } else {
      apiResponse.forEach(h => {
        console.log(`      - ${h.numero_habitacion}: ${h.tipo_nombre}`);
      });
    }

    console.log('\n' + '='.repeat(50));
    console.log('\n📋 RECOMENDACIÓN:');
    
    if (habitacion102.length === 0) {
      console.log('   Ejecuta este script SQL en phpMyAdmin:');
      console.log('   📄 d:\\TP-final\\VERIFICAR_E_INSERTAR_HABITACION.sql');
    } else if (disponibles.length === 0) {
      console.log('   La habitación existe pero NO está disponible.');
      console.log('   Ejecuta este SQL:');
      console.log('   UPDATE habitaciones SET estado="disponible", activo=TRUE');
    } else {
      console.log('   ✅ Todo parece estar bien. Recarga el frontend.');
    }

    console.log('\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  }
}

// Ejecutar
testHabitaciones();
