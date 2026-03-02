# 🏨 Habitación Ejemplo Agregada - Instrucciones

## 📋 Información de la Habitación

**Nombre:** Habitación Estándar Confort  
**Número:** 102  
**Piso:** 1  
**Capacidad:** 2 personas  
**Precio:** $150/noche  
**Vista:** Jardín  
**Estado:** Disponible  

### Imagen Profesional
Se ha utilizado una imagen de alta calidad de Unsplash:
- **Imagen principal:** Habitación de hotel moderno y elegante
- **Galería:** 3 imágenes adicionales del hotel

### Amenidades Incluidas
✅ WiFi Gratis  
✅ Smart TV 55 Pulgadas  
✅ Aire Acondicionado  
✅ Baño Privado Completo  
✅ Minibar  
✅ Caja Fuerte  
✅ Secador de Cabello  
✅ Servicio de Limpieza Diario  

---

## 🚀 Cómo Ejecutar el Script

### Opción 1: MySQL CLI (Terminal)

```bash
# 1. Accede a tu servidor MySQL
mysql -u root -p

# 2. Selecciona la base de datos
USE hotel_reservas;

# 3. Ejecuta el script
source C:/ruta/a/INSERT_HABITACION_EJEMPLO.sql
```

### Opción 2: phpMyAdmin
1. Abre tu phpMyAdmin
2. Selecciona la BD `hotel_reservas`
3. Haz clic en "SQL"
4. Copia y pega el contenido de `INSERT_HABITACION_EJEMPLO.sql`
5. Haz clic en "Ejecutar"

### Opción 3: Workbench (MySQL Workbench)
1. Abre MySQL Workbench
2. Selecciona tu conexión
3. Abre el archivo `INSERT_HABITACION_EJEMPLO.sql`
4. Haz clic en el icono ⚡ (ejecutar)

---

## ✅ Verificación

Después de ejecutar el script, deberías ver:

```
id_habitacion | numero_habitacion | piso | tipo                          | vista  | estado      | imagen
102           | 102               | 1    | Habitación Estándar Confort   | jardin | disponible  | [URL]
```

---

## 📱 En el Frontend

Una vez ejecutado el script:

1. **La habitación aparecerá automáticamente** en:
   - ✅ Home → Carrusel de Habitaciones
   - ✅ Pestaña Habitaciones (si existe)
   - ✅ Búsqueda y filtros

2. **Los usuarios podrán:**
   - 👁️ Ver la imagen de la habitación
   - ⭐ Marcar como favorito
   - 📅 Reservar
   - 💬 Dejar comentarios

---

## 🎨 Imagen de la Habitación

**URL:** https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80

Esta imagen muestra:
- Cama king size confortable
- TV smart en la pared
- Decoración moderna
- Baño visible al fondo
- Iluminación cálida y acogedora
- Estándar de calidad profesional

---

## 🔄 Para Agregar Más Habitaciones

Simplemente copia el script y modifica:

```sql
-- Cambiar estos valores:
'103',              -- número de habitación
1,                  -- id_tipo (1 = Estándar, 2 = Suite, etc)
1,                  -- piso
'Tu descripción',   -- descripción
'URL-de-imagen',    -- imagen
'otro tipo de vista' -- 'mar', 'ciudad', 'jardin', 'montaña'
```

---

## 💡 Notas

- La imagen viene de Unsplash (sin restricciones de uso)
- Los datos son completamente funcionales
- Puedes modificar amenidades en JSON
- El precio se puede actualizar en cualquier momento
- La habitación está lista para recibir reservas

---

## 📞 Soporte

Si el script no funciona:
1. Verifica que exista la tabla `tipos_habitacion`
2. Verifica que exista la tabla `habitaciones`
3. Revisa que tengas permisos de escritura en la BD
4. Comprueba la conexión a la BD

¡Listo para usar! 🎉
