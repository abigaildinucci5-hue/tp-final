# 🔧 TEST RÁPIDO: Verificar Habitación 102

## 🚀 Ejecuta este comando en una terminal

```bash
cd D:\TP-final\backend
node test-habitaciones.js
```

## 📊 Qué te dirá

Este script verifica automáticamente:

1. ✅ Si los tipos de habitación existen
2. ✅ Si la habitación 102 está en la BD
3. ✅ Si la habitación tiene estado `disponible`
4. ✅ Si la API puede traerla

## 📝 Posibles Resultados

### **Caso 1: Habitación 102 NO existe**
```
❌ Habitación 102 NO existe en la BD
⚠️  Necesitas ejecutar el script: VERIFICAR_E_INSERTAR_HABITACION.sql
```

**Solución:** Ejecuta el SQL en phpMyAdmin:
```
📄 d:\TP-final\VERIFICAR_E_INSERTAR_HABITACION.sql
```

---

### **Caso 2: Habitación existe pero NO está disponible**
```
✅ Habitación encontrada:
   - Estado: ocupada
   - Activo: 0
⚠️ LA API RETORNA 0 HABITACIONES
```

**Solución:** Ejecuta este SQL:
```sql
UPDATE habitaciones 
SET estado='disponible', activo=TRUE 
WHERE numero_habitacion='102';
```

---

### **Caso 3: Todo está bien ✅**
```
✅ Habitación encontrada
✅ Total habitaciones disponibles: 1
✅ Habitaciones que retorna la API: 1
```

**Solución:** Solo recarga el frontend:
```bash
cd frontend
npm start
```

---

## 🎯 Próximos Pasos

1. **Ejecuta el test:**
   ```bash
   cd D:\TP-final\backend
   node test-habitaciones.js
   ```

2. **Copia el resultado completo aquí**

3. **Yo te diré exactamente qué hacer**

---

¡Hazlo ahora! 🚀
