# 💾 GUÍA: EXPORTAR BD DESDE phpMyAdmin

## ¿Por qué?
Tu BD actual en localhost tiene cambios. Necesitas exportarla antes de hostearla en Railway.

---

## PASO 1: Abrir phpMyAdmin

1. Asegúrate que XAMPP está corriendo
2. Abre navegador: `http://localhost/phpmyadmin`
3. Debería ver la interfaz de phpMyAdmin

---

## PASO 2: Seleccionar la BD

1. **Panel izquierdo** → Busca y haz clic en `hotel_reservas`
2. Se abre la BD completa

---

## PASO 3: Exportar (IMPORTANTE: BIEN)

1. **Arriba de todo** → Pestaña **"Exportar"**

2. **Opciones de exportación**:
   - **Método de exportación**: "SQL" ← IMPORTANTE
   - **Seleccionar todo**: Debe estar seleccionado (todas las tablas)
   - **Formato**: SQL
   - **Opciones SQL**:
     - ✅ "Crear tabla" 
     - ✅ "Agregar sentencias DROP"
     - ✅ "Crear sentencias IF NOT EXISTS"
     - ✅ "Incluir contenido de tabla"

3. **Opción de salida**:
   - ☑ "Guardar como archivo"
   - Nombre: `hotel_reservas_export_2024.sql` ← Así es más claro

4. **Botón azul "Ir"** en la parte inferior

---

## PASO 4: Guardar archivo

1. El navegador descargará: `hotel_reservas_export_2024.sql`
2. **Guárdalo en una carpeta segura** (ej: `d:\TP-final\database\`)
3. **IMPORTANTE**: Abre con notepad para verificar que tiene:
   ```sql
   -- phpMyAdmin SQL Dump
   CREATE TABLE `usuarios` (
   ...
   INSERT INTO `usuarios` VALUES (...)
   ...
   ```

---

## ✅ VERIFICAR QUE TODO ESTÁ

El archivo debe tener:
- [ ] Comentarios de phpMyAdmin al principio
- [ ] `CREATE TABLE` para cada tabla
- [ ] `INSERT INTO` con datos reales
- [ ] Comillas backticks en nombres (`` `tabla` ``)

---

## 📋 ESQUEMA ESPERADO

Tu BD debería tener estas tablas (verifica en phpMyAdmin):
- [ ] `usuarios`
- [ ] `habitaciones`
- [ ] `tipos_habitacion`
- [ ] `reservas`
- [ ] `imagenes_habitacion`
- [ ] `favoritos`
- [ ] `comentarios`
- [ ] `tokens_invalidados`

Si falta alguna, edítala en phpMyAdmin y asegúrate.

---

## 💡 TIPS

1. **Haz backup** del archivo en Dropbox o OneDrive también
2. **No borres nada de la BD local** hasta confirmar que funciona en Railway
3. **Verifica el archivo SQL** sea > 50 KB (si es muy pequeño, falta data)

---

## 🔧 ALTERNATIVA (Si phpMyAdmin no funciona):

En terminal (MySQL CLI):
```bash
mysqldump -u root -p hotel_reservas > hotel_reservas_export.sql
```
Luego ingresa la contraseña (si la hay) y se genera el archivo.

---

**PRÓXIMO PASO**: Cargar este archivo en Railway

**Guarda bien la ruta del archivo**, lo necesitarás en 48 horas.
