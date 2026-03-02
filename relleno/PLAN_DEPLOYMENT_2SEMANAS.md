# 📅 PLAN DE DEPLOYMENT - 2 SEMANAS (4 al 13 de Febrero)

## 🎯 OBJETIVO FINAL
- ✅ BD hosteada en Railway
- ✅ Backend hosteado en Railway
- ✅ APK funcionando con autenticación Google y GitHub
- ✅ Documentación completa

---

## 📋 SEMANA 1: 4 al 10 de Febrero

### **MARTES 4 de Febrero (HOY) - 2-3 horas**
**Objetivo**: Exportar BD actual y probar desde móvil

**Tareas**:
- [X] Exportar BD desde phpMyAdmin (SQL dump)
- [X] Probar acceso a backend desde móvil/red local
- [/] Verificar Expo Go funciona

**Tiempo**: 2-3 horas

---

### **JUEVES 6 de Febrero - 3-4 horas**
**Objetivo**: Railway completamente configurado

**Tareas**:
- [X ] Crear cuenta en Railway.app
- [X ] Crear BD MySQL en Railway (importar dump)
- [X ] Crear proyecto Backend en Railway
- [? ] Deploy backend automático desde GitHub
- [ X] Actualizar `.env` en backend (URLs de BD)
- [? ] Probar endpoints desde Postman

**Tiempo**: 3-4 horas

---

### **SÁBADO 8 de Febrero - 4-5 horas**
**Objetivo**: Frontend conectado a backend hosteado + pruebas móvil

**Tareas**:
- [X ] Actualizar URLs de API en frontend (apuntar a Railway)
- [/] Probar con Expo Go en móvil
- [ ] Probar Google OAuth en móvil (debería funcionar)
- [ ] Probar GitHub OAuth en móvil (debería funcionar)
- [ ] Ajustar responsive si es necesario

**Tiempo**: 4-5 horas

---

### **LUNES 10 de Febrero - 2-3 horas**
**Objetivo**: UI/UX pulido

**Tareas**:
- [ ] Revisar responsive en móvil
- [ ] Ajustar colores, botones, spacing
- [ ] Revisar mensajes de error
- [ ] Probar flujo completo: login → home → habitaciones

**Tiempo**: 2-3 horas

---

## 📋 SEMANA 2: 11 al 13 de Febrero

### **MARTES 11 de Febrero - 4-5 horas**
**Objetivo**: Generar APK y configurar OAuth para APK

**Tareas**:
- [ ] Instalar EAS CLI: `npm install -g eas-cli`
- [ ] Configurar proyecto en Expo
- [ ] Generar APK con EAS
- [ ] Extraer SHA-1 fingerprint del APK
- [ ] Agregar SHA-1 a Google Cloud Console
- [ ] Regenerar APK con nuevo credential de Google
- [ ] Probar APK en teléfono

**Tiempo**: 4-5 horas

---

### **MIÉRCOLES 12 de Febrero - 3-4 horas**
**Objetivo**: Documentación completa

**Tareas**:
- [ ] Crear/actualizar README.md principal
- [ ] Crear GUIA_INSTALACION.md
- [ ] Crear DOCUMENTACION_API.md (todos los endpoints)
- [ ] Crear MANUAL_USUARIO.md
- [ ] Revisión final de código

**Tiempo**: 3-4 horas

---

### **JUEVES 13 de Febrero (ENTREGA) - 1-2 horas**
**Objetivo**: Entrega final

**Tareas**:
- [ ] Verificar APK funciona correctamente
- [ ] Verificar todos los endpoints funcionan
- [ ] Verificar Google OAuth en APK
- [ ] Verificar GitHub OAuth en APK
- [ ] Commit final a GitHub
- [ ] Enviar APK al profesor

**Tiempo**: 1-2 horas

---

## 📊 RESUMEN TIEMPO TOTAL
- **Semana 1**: 11-15 horas
- **Semana 2**: 8-11 horas
- **Total**: 19-26 horas (distribuidas en 10 días)

**Con 2-3 horas cada 2 días = PERFECTAMENTE POSIBLE** ✅

---

## 🔑 PUNTOS CRÍTICOS
1. **Exportar BD correctamente** (sin esto nada funciona)
2. **Railway primero** (luego todo es más fácil)
3. **OAuth en APK** (necesita SHA-1 de Google)
4. **Documentación al final** (pero crítica para entrega)

---

## 💡 TIPS
- Mantén Git actualizado con commits frecuentes
- Prueba cada paso antes de avanzar
- Guarda URLs de Railway para luego
- Documenta problemas que encuentres

---

**EMPEZAMOS EL 4 (HOY): Exportar BD**
