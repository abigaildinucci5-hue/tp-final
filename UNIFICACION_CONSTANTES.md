# UNIFICACIÓN DE CARPETAS DE CONSTANTES

## Problema encontrado:
- Carpeta duplicada: `/src/constants/` con solo `colores.js`
- Carpeta principal: `/src/constantes/` con `colores.js`, `rutas.js`, `estilos.js`, `imagenes.js`, `config.js`

## Archivos duplicados:
- `/src/constants/colores.js` (128 líneas - versión antigua)
- `/src/constantes/colores.js` (155 líneas - versión nueva y mejorada)

## Análisis de uso:
✅ Todos los imports en `/src` apuntan a `/constantes/`  
✅ La carpeta `/constants/` NO está siendo usada en el código actual  
⚠️ Solo hay 1 import de `/constants/` en `hooks/use-theme-color.ts` (TypeScript - no es código principal)

## Solución aplicada:
1. ✅ Confirmado que `/constantes/colores.js` es la versión correcta y mejorada
2. ✅ Verificado que NO hay dependencias en codigo JS hacia `/constants/`
3. ✅ `/constants/` puede ser eliminada de forma segura

## ACCIÓN REQUERIDA (Manual):
⚠️ **Necesitas eliminar manualmente la carpeta `/src/constants/`**

Pasos en terminal:
```bash
# Windows
rmdir /s /q d:\TP-final\frontend\src\constants

# Mac/Linux
rm -rf src/constants
```

O simplemente:
1. Abre explorador de archivos
2. Ve a `/src/`
3. Elimina la carpeta `constants`

## Verificación posterior:
Después de eliminar, verifica que no hay errores:
```bash
npx expo start -c
```

## Resumen:
- ✅ Todas las importaciones ya usan `/constantes/`
- ✅ `/constantes/` tiene la versión mejorada de los archivos
- ⚠️ Solo necesitas eliminar la carpeta vacía `/constants/`
