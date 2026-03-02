# 🛏️ GUÍA: AGREGAR HABITACIONES VIA RAILWAY (MySQL)

## 📌 CONTEXTO

Tu base de datos está en Railway (MySQL). Tienes 2 opciones para agregar habitaciones:
1. **phpMyAdmin Web** (Más fácil, sin instalar nada)
2. **MySQL Workbench** (Más control, requiere software)

---

## OPCIÓN A: phpMyAdmin Web (Recomendado para principiantes)

### PASO 1: Obtener credenciales de Railway

1. Ve a: **https://railway.app**
2. Inicia sesión con tu GitHub
3. Click en tu proyecto `TP-final`
4. Click en el servicio **MySQL** 
5. Click en la pestaña **"Variables"**

**Copiar estos datos:**
```
MYSQLHOST=us-east-1.proxy.railway.internal (o similar)
MYSQLPORT=3306
MYSQLUSER=root (normalmente)
MYSQLPASSWORD=XXXXXXXXXXXXXXX
MYSQLDATABASE=railway (nombre de tu BD)
```

### PASO 2: Usar phpMyAdmin Online

1. Busca en Google: **"phpMyAdmin free online"**
2. Entra a cualquiera (ej: https://www.phpmyadmin.co/)
3. Llena los campos:
   - **Server**: Tu MYSQLHOST
   - **Username**: root
   - **Password**: Tu MYSQLPASSWORD
   - **Port**: 3306
   - **Database**: railway
4. Click **"Login"**

**Alternativa**: Usa [Adminer](https://www.adminer.org/) que es más simple:
1. https://adminer.org (Select "MySQL")
2. Llena los datos
3. Login

### PASO 3: Navegar a tabla "habitaciones"

Una vez loguead@:
1. En el panel izquierdo, click en **"railway"** (tu BD)
2. Busca tabla **"habitaciones"**
3. Click en **"Browse"** o **"Select"**

Verás todas las habitaciones actuales (ID 1-17)

### PASO 4: Insertar Nueva Habitación

#### OPCIÓN A.1: Interfaz gráfica

1. Click en botón **"Insert"** o **"New Row"**
2. Llenar los campos:

```
id_habitacion      = 18 (o el siguiente)
numero_habitacion  = "105A" (tu número)
id_tipo            = 1 (Ver tabla tipos_habitaciones)
piso               = 2 (piso)
descripcion_detallada = "Tu descripción larga"
imagen_principal   = "https://images.unsplash.com/photo-..."
galeria_imagenes   = '[".../img1","../img2","../img3"]' (formato JSON)
amenidades         = '["WiFi","TV","AC"]' (formato JSON)
vista              = "jardin" (mar|ciudad|jardin|montaña)
estado             = "disponible" (disponible|ocupada|mantenimiento|limpieza)
activo             = 1
```

3. Click **"Save"** o **"Insert"**

#### OPCIÓN A.2: SQL directo (Más rápido)

1. Click en **"SQL"** (pestaña superior)
2. Pega este código y reemplaza los valores:

```sql
INSERT INTO `habitaciones` (
  `id_habitacion`,
  `numero_habitacion`,
  `id_tipo`,
  `piso`,
  `descripcion_detallada`,
  `imagen_principal`,
  `galeria_imagenes`,
  `amenidades`,
  `vista`,
  `estado`,
  `activo`
) VALUES (
  18,
  '105A',
  1,
  2,
  'Hermosa habitación estándar con cama queen. Equipada con TV smart, aire acondicionado, baño con ducha. WiFi incluido.',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  '[\"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80\", \"https://images.unsplash.com/photo-1585399546746-1f4fbef50e9d?w=800&q=80\"]',
  '[\"WiFi Gratis\", \"Smart TV\", \"Aire Acondicionado\", \"Baño Privado\"]',
  'jardin',
  'disponible',
  1
);
```

3. Click **"Execute"** o **"Run"**

---

## OPCIÓN B: MySQL Workbench (Para usuarios avanzados)

### PASO 1: Descargar MySQL Workbench

- Ve a: https://www.mysql.com/products/workbench/
- Descarga version community (gratis)
- Instala normalmente

### PASO 2: Crear conexión a Railway

1. Abre MySQL Workbench
2. Click en **"+"** (New Connection)
3. Llena los campos:
   - **Connection Name**: TP-final-Railway
   - **Connection Method**: Standard (TCP/IP)
   - **Hostname**: Tu MYSQLHOST de Railway
   - **Port**: 3306
   - **Username**: root
   - **Password**: Tu MYSQLPASSWORD (guardar)

4. Click **"Test Connection"** (debe pasar)
5. Click **"OK"**

### PASO 3: Conectar a la BD

1. En la pantalla principal, haz click en tu conexión
2. Verás las bases de datos en el sidebar izquierdo
3. Expande **"railway"**
4. Expande **"Tables"**
5. Busca **"habitaciones"**

### PASO 4: Insertar datos

**OPCIÓN B.1: Interfaz gráfica**

1. Click derecho en **"habitaciones"**
2. **"Select Rows - Limit 1000"**
3. En la tabla que aparece, busca la última fila
4. Click en el botón **"+"** (New Row)
5. Llena los campos

**OPCIÓN B.2: SQL Editor**

1. Click en **"File"** → **"New Query Tab"**
2. O presiona **Ctrl+T**
3. Pega tu SQL de inserción:

```sql
INSERT INTO `habitaciones` (
  `id_habitacion`,
  `numero_habitacion`,
  `id_tipo`,
  `piso`,
  `descripcion_detallada`,
  `imagen_principal`,
  `galeria_imagenes`,
  `amenidades`,
  `vista`,
  `estado`,
  `activo`
) VALUES (
  18,
  '105A',
  1,
  2,
  'Tu descripción aquí',
  'https://images.unsplash.com/photo-XXXXX',
  '[\"url1\", \"url2\"]',
  '[\"WiFi\", \"TV\"]',
  'jardin',
  'disponible',
  1
);
```

4. Click **"Lightning Bolt"** (Execute) o **Ctrl+Enter**

---

## TABLA DE REFERENCIA: TIPOS DE HABITACIÓN

Antes de insertar, necesitas saber el `id_tipo`:

| id_tipo | Nombre | Precio (aprox) |
|---------|--------|----------------|
| 1 | Estándar | $50-80 |
| 2 | Confort | $100-150 |
| 3 | Suite Deluxe | $200-350 |
| 4 | Suite Presidencial | $500+ |

**Verificar tipos en tu BD:**
```sql
SELECT id_tipo, nombre, descripcion FROM tipos_habitaciones;
```

---

## IMÁGENES: DÓNDE OBTENER URLs

### Opción 1: Unsplash (Gratuitas, de calidad)
1. Ve a: https://unsplash.com/
2. Busca "hotel room", "bedroom", etc.
3. Click derecha → "Copy image link"
4. URLs de ejemplo:
```
https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80
https://images.unsplash.com/photo-1585399546746-1f4fbef50e9d?w=800&q=80
```

### Opción 2: Pexels
- https://www.pexels.com (también gratuitas)
- Click derecho → Copy link

### Opción 3: Subir a tu servidor
Si quieres subir las imágenes directamente a un servidor, puedes crear un endpoint en tu backend:
```
POST /api/upload → subir imagen
GET /uploads/imagen-1.jpg → acceder
```

---

## FORMATO JSON CORRECTO

### Para `galeria_imagenes`:

```json
[
  "https://images.unsplash.com/photo-1.jpg",
  "https://images.unsplash.com/photo-2.jpg",
  "https://images.unsplash.com/photo-3.jpg"
]
```

**IMPORTANTE**: En SQL, usar **comillas dobles internas**, **comillas simples externas**:
```sql
'["url1", "url2", "url3"]'
```

### Para `amenidades`:

```json
[
  "WiFi Gratis",
  "Smart TV",
  "Aire Acondicionado",
  "Baño Privado Completo",
  "Minibar",
  "Caja Fuerte",
  "Secador de Cabello"
]
```

---

## EJEMPLO COMPLETO: Agregar Suite Deluxe

```sql
INSERT INTO `habitaciones` (
  `id_habitacion`,
  `numero_habitacion`,
  `id_tipo`,
  `piso`,
  `descripcion_detallada`,
  `imagen_principal`,
  `galeria_imagenes`,
  `amenidades`,
  `vista`,
  `estado`,
  `activo`
) VALUES (
  18,
  '305',
  3,
  3,
  'Suite deluxe con cama king, sala de estar separada, jacuzzi privado y vistas panorámicas. Lujo absoluto con servicio premium.',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  '[
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    "https://images.unsplash.com/photo-1598928506239-c5986d47eb99?w=800&q=80",
    "https://images.unsplash.com/photo-1590080876975-07ee6c41f515?w=800&q=80"
  ]',
  '[
    "WiFi Premium",
    "TV Smart HD",
    "Aire acondicionado",
    "Jacuzzi privado",
    "Terraza",
    "Minibar VIP",
    "Espejo de aumento",
    "Room service 24h"
  ]',
  'mar',
  'disponible',
  1
);
```

---

## VERIFICAR QUE SE AGREGÓ

### En phpMyAdmin:
1. Ir a tabla "habitaciones"
2. Ver última fila
3. Debe estar el id_habitacion = 18

### En tu app:
1. La app debe mostrar la habitación automáticamente (trae de la API)
2. Si no aparece, hacer refresh de la pantalla

### Con SQL:
```sql
SELECT * FROM habitaciones WHERE id_habitacion = 18;
```

---

## DATOS PARA COPIAR Y PEGAR (PLANTILLA)

Usa esto para agregar tu propia habitación:

```sql
INSERT INTO `habitaciones` (
  `id_habitacion`,
  `numero_habitacion`,
  `id_tipo`,
  `piso`,
  `descripcion_detallada`,
  `imagen_principal`,
  `galeria_imagenes`,
  `amenidades`,
  `vista`,
  `estado`,
  `activo`
) VALUES (
  [SIGUIENTE_ID_AQUI],
  '[NUMERO_HABITACION]',
  [ID_TIPO: 1-4],
  [PISO: 1-7],
  '[DESCRIPCION_LARGA]',
  '[URL_IMAGEN_PRINCIPAL]',
  '["URL1", "URL2", "URL3"]',
  '["AMENIDAD1", "AMENIDAD2", "AMENIDAD3"]',
  '[mar|ciudad|jardin|montaña]',
  'disponible',
  1
);
```

---

## CHECKLIST ANTES DE INSERTAR

- [ ] Tengo acceso a Railway con mis credenciales
- [ ] Sé el ID del tipo de habitación (1-4)
- [ ] Tengo URLs de imágenes (mínimo 3)
- [ ] Mi descripción es clara y convincente
- [ ] Las amenidades están en formato JSON
- [ ] El número de habitación no existe ya
- [ ] El ID es mayor al anterior

---

## PROBLEMAS COMUNES

**P: "Connection refused"**
R: Verifica que tu MYSQLHOST esté correcto. Copia exactamente de Railway.

**P: "JSON error in column galeria_imagenes"**
R: Las URLs deben estar con comillas dobles adentro:
```sql
-- ❌ MAL
'[https://..., https://...]'

-- ✅ BIEN
'["https://...", "https://..."]'
```

**P: "Duplicate entry 'XX' for key 'numero_habitacion'"**
R: Ese número ya existe. Usa otro número de habitación.

**P: "Unknown column 'id_tipo'"**
R: Verifica la estructura correcta de tu tabla con:
```sql
DESCRIBE habitaciones;
```

---

## PRÓXIMOS PASOS

1. ✅ Agregar 2-3 habitaciones de prueba
2. ✅ Verificar que aparecen en la app
3. ✅ Ajustar precios si es necesario
4. ✅ Llenar tabla completa (mínimo 20 habitaciones)

---

**¿Necesitas ayuda?** Pregunta el comando específico que no funcione y te ayudaré a debuggearlo.
