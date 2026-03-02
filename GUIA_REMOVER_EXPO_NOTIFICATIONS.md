# 🗑️ GUÍA: REMOVER EXPO-NOTIFICATIONS COMPLETAMENTE

## 📌 SITUACIÓN ACTUAL

El usuario indicó que **NO usará notificaciones** en la app, así que debemos remover:
- ✅ El package `expo-notifications` 
- ✅ Toda lógica de notificaciones del código
- ✅ Imports que ya no se necesitan

---

## OPCIÓN A: REMOVER COMPLETAMENTE (Recomendado)

### PASO 1: Remover del Frontend

**1.1 - Limpiar imports en archivos que usan notificaciones:**

Archivos a modificar:
- `frontend/src/redux/slices/notificacionesSlice.js` → ELIMINAR el archivo
- `frontend/src/redux/thunks/reservasThunks.js` → Quitar las líneas que usan notificaciones
- `frontend/src/servicios/servicioNotificaciones.js` → ELIMINAR el archivo

**1.2 - Ver qué llama a notificaciones:**

En `src/redux/thunks/reservasThunks.js`, busca y ELIMINA estas líneas:

```javascript
// ❌ ELIMINAR ESTAS LÍNEAS:
import { servicioNotificacionesService } from '../../servicios/servicioNotificaciones';

// Dentro de los thunks, ELIMINAR todo lo que tenga:
await servicioNotificacionesService.notificarRecordatorioCheckIn(...);
await servicioNotificacionesService.notificarReservaConfirmada(...);
await servicioNotificacionesService.notificarReservaCancelada(...);
await servicioNotificacionesService.notificarRecordatorioCheckOut(...);
```

**1.3 - Remover store/reducers:**

En `frontend/src/redux/store.js`, busca y elimina:

```javascript
// ❌ ELIMINAR:
import notificacionesSlice from './slices/notificacionesSlice';

// Y de la configuración:
notifications: notificacionesSlice.reducer, // ← ELIMINAR ESTA LÍNEA
```

**1.4 - Desinstalar package en Frontend:**

```bash
cd frontend
npm uninstall expo-notifications
npm install
```

### PASO 2: Remover del Backend (Si aplica)

En `backend/package.json`, verifica si aparece `expo-notifications` y elimínalo:

```bash
cd backend
npm uninstall expo-notifications
npm install
```

### PASO 3: Verificar que no quedan imports

Busca en todo el proyecto por "notificaciones" o "servicioNotificaciones":

```powershell
# En PowerShell
Get-ChildItem -Path "frontend/src" -Recurse -Include "*.js" -o "*.ts" | Select-String "servicioNotificaciones|notificacionesSlice" | Select-Object Path,Linenumber,Line
```

**Resultado esperado**: No debe encontrar nada

---

## OPCIÓN B: MANTENER PERO DESACTIVAR (Si quieren agregar después)

Si prefieren mantener la estructura pero desactivarla:

### PASO 1: Deshabilitar notificaciones en servicioNotificaciones.js

```javascript
// frontend/src/servicios/servicioNotificaciones.js

// Envuelve TODO en un try-catch con console.log

const servicioNotificacionesService = {
  notificarRecordatorioCheckIn: async (...) => {
    try {
      console.log('📬 [NOTIFICACIONES DESHABILITADAS] Recordatorio Check-in');
      // return; ← Descomentar cuando se deshabilite
    } catch (error) {
      console.warn('Notificación ignorada:', error);
    }
  },
  // ... igual para otros métodos
};
```

### PASO 2: Mantener package sin usarlo

Simplemente dejar en `package.json` sin llamar a sus métodos.

**Ventaja**: Sin desinstalar, puedes agregar notificaciones después sin reinstalar
**Desventaja**: Agrega 5MB al APK por nada

---

## PASO A PASO: REMOVER COMPLETAMENTE

### Fase 1: Identificar archivos a limpiar

**1. Buscar referencias:**

```bash
# En terminal (DENTRO de frontend/)
cd frontend
grep -r "servicioNotificaciones" src/
grep -r "notificacionesSlice" src/
grep -r "expo-notifications" .
```

**Resultado esperado**:
```
src/redux/thunks/reservasThunks.js:.... servicioNotificaciones
src/servicios/servicioNotificaciones.js: export const ...
src/redux/slices/notificacionesSlice.js: export default
etc.
```

### Fase 2: Editar archivos

**ARCHIVO 1: reservasThunks.js**

Buscar las líneas:
```javascript
// Línea 1: Import
import { servicioNotificacionesService } from '../../servicios/servicioNotificaciones';

// Líneas 25-40 aprox: Dentro de createAsyncThunk
await servicioNotificacionesService.notificarRecordatorioCheckIn();
```

**Acciones**:
1. Eliminar el import
2. Deletear las 4-6 líneas que llaman a notificaciones (buscar `.notificar`)

**ARCHIVO 2: store.js**

Buscar:
```javascript
// Imports
import notificacionesSlice from './slices/notificacionesSlice';

// Dentro de configureStore
{
  reducer: {
    auth: authSlice.reducer,
    habitaciones: habitacionesSlice.reducer,
    notificaciones: notificacionesSlice.reducer, // ← ESTA LÍNEA
  }
}
```

**Acciones**:
1. Eliminar import
2. Eliminar la línea del reducer

**ARCHIVO 3: servicioNotificaciones.js**

**Acciones**:
1. Puedes eliminarlo completamente O
2. Dejar un archivo vacío/comentado junto al README de que está deprecated

**ARCHIVO 4: notificacionesSlice.js**

**Acciones**:
1. Eliminar el archivo completamente

### Fase 3: Desinstalar paquetes

```bash
cd frontend
npm uninstall expo-notifications
npm install
```

Esto actualizará `package.json` y `package-lock.json`

### Fase 4: Verificar no hay errores

```bash
cd frontend
npm run lint  # Si tienen linter
# O simplemente
npx expo start -c
```

Si ves errores tipo `Cannot find module 'servicioNotificaciones'`, significa que hay imports que no encontramos. Buscar el archivo donde el error aparece.

---

## LIMPIEZA DE ARCHIVOS (Una línea cada uno)

```bash
# Desde frontend/
rm src/servicios/servicioNotificaciones.js
rm src/redux/slices/notificacionesSlice.js
```

---

## CHECKLIST FINAL

Antes de considerar que está completo:

- [ ] `npm uninstall expo-notifications` ejecutado
- [ ] `pkg install` ejecutado sin errores
- [ ] No hay imports a `servicioNotificaciones` en el código
- [ ] No hay referencias a `notificacionesSlice` en store.js
- [ ] App inicia con `npx expo start -c` sin errores
- [ ] NPM te avisa cero vulnerabilities después de install
- [ ] Size del APK bajó aprox. 5MB

---

## ARCHIVOS A ELIMINAR

```
frontend/src/servicios/servicioNotificaciones.js
frontend/src/redux/slices/notificacionesSlice.js
```

---

## ALTERNATIVA: Script de búsqueda rápida

Si quieres encontrar TODOS los archivos que usan notificaciones:

```bash
# PowerShell desde frontend/
Get-ChildItem -Path "src" -Recurse -Include "*.js","*.ts" | 
  ForEach-Object {
    $matches = Select-String -Path $_.FullName -Pattern "notificaciones|servicioNotificaciones" -ErrorAction SilentlyContinue
    if($matches) { 
      Write-Host "$($_.FullName): $($matches.Count) matches"
    }
  }
```

---

## ROADMAP DE EJECUCIÓN

```
1. Ejecutar búsqueda de referencias
2. Documentar qué archivos tocar
3. Editar 2 archivos: reservasThunks.js + store.js
4. Eliminar 2 archivos: servicioNotificaciones.js + notificacionesSlice.js
5. npm uninstall expo-notifications
6. npm install
7. npx expo start -c (verificar)
8. ✅ Listo!
```

**Tiempo estimado**: 10-15 minutos

---

## PREGUNTAS COMUNES

**P: ¿Las reservas dejarán de funcionar?**
R: No, las reservas funcionarán igual. Solo se elimina la notificación que se enviaba DESPUÉS de confirmar.

**P: ¿Qué pasa si después quiero agregar notificaciones?**
R: Tendrían que reinstalar `expo-notifications` y recrear la lógica. Por eso Opción B (deshabilitar) es útil si no están seguros.

**P: ¿Cuánto espacio libera?**
R: ~5-8MB en el APK final.

**P: ¿Funcionará en Android/iOS?**
R: Sí, mejor aún porque no tienes importaciones de una librería que no necesitas.

---

**Próximo paso**: Decir cuándo quieres que lo haga, o hacerlo tú siguiendo estos pasos.
