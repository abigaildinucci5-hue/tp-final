# Guía de Funcionamiento del Sistema de Puntos - Hotel Luna Serena

## Introducción

El sistema de puntos de Hotel Luna Serena es un programa de recompensas diseñado para incentivar a los huéspedes a realizar reservas y dejar reseñas. Los puntos ganados pueden canjearse como descuentos en futuras reservas, creando un ciclo virtuoso de fidelización.

---

## Fundamentos Básicos

### Qué son los Puntos

Los puntos son créditos virtuales que el usuario acumula mediante acciones específicas dentro del sistema. Cada punto tiene un valor monetario equivalente de cinco centavos de dólar. Es decir, diez puntos equivalen a cincuenta centavos de dólar.

### Cómo se Ganan los Puntos

Los usuarios ganan puntos automáticamente mediante dos acciones principales:

**Por Completar Reservas:**
Cuando un huésped realiza un check-out exitoso (es decir, termina su estadía en el hotel), automáticamente se acreditan cien puntos a su cuenta. Esta acción reconoce la lealtad de hacer una reserva efectiva.

**Por Dejar Reseñas:**
Cuando un usuario publica un comentario o reseña sobre el hotel o una habitación, se acreditan cincuenta puntos inmediatamente. Esta acción incentiva retroalimentación valiosa que mejora el servicio.

### Conversión Monetaria

La conversión es lineal y simple de entender:
- Un punto equivale a cinco centavos de dólar
- Diez puntos equivalen a cincuenta centavos
- Veinte puntos equivalen a un dólar
- Cien puntos equivalen a cinco dólares
- Mil puntos equivalen a cincuenta dólares

---

## Flujo Técnico Detallado

### Ganancias Automáticas

#### Durante Check-Out de Reserva

Cuando el empleado o recepcionista realiza el check-out de un huésped:

Primero: se registra la salida del huésped en la tabla registro_checkin
Segundo: se verifica que la reserva esté completa y válida
Tercero: se calcula que se ganaron cien puntos
Cuarto: se inserta registro en tabla historial_puntos con tipo ganado
Quinto: se actualiza el campo puntos_acumulados en tabla usuarios sumando cien
Sexto: se actualiza el campo total_reservas_completadas en tabla usuarios sumando uno
Séptimo: se retorna confirmación con cantidad de puntos ganados

El código verifica que no haya errores en ningún paso. Si algo falla, se genera un registro de auditoría.

#### Durante Publicación de Reseña

Cuando un usuario publica un comentario o reseña:

Primero: se valida que la reseña contenga contenido válido
Segundo: se inserta el comentario en tabla comentarios
Tercero: se calcula que se ganaron cincuenta puntos
Cuarto: se inserta registro en tabla historial_puntos con tipo ganado
Quinto: se actualiza puntos_acumulados sumando cincuenta
Sexto: se incrementa total_reseñas en tabla usuarios en uno
Séptimo: se retorna la reseña con información de puntos ganados

Si el sistema de puntos falla, se captura el error pero la reseña se publica de todas formas. Esto asegura que los usuarios no pierdan su contribución si hay un problema técnico temporal.

### Historial de Transacciones

Cada acción relacionada con puntos se registra en la tabla historial_puntos. Esta tabla contiene:

**id_usuario:** identificador del usuario
**id_reserva:** identificador de la reserva si aplica
**tipo:** puede ser ganado o canjeado
**cantidad:** número de puntos en la transacción
**concepto:** descripción de por qué se ganaron o canjearon
**fecha:** cuándo ocurrió la transacción

El usuario puede consultar su historial completo ordenado por fecha, viendo exactamente cuándo ganó cada punto y por qué.

### Consulta de Saldo

En cualquier momento, el usuario puede ver:

**Saldo Actual:** número total de puntos acumulados
**Historial Completo:** lista de todas las transacciones
**Equivalencia Monetaria:** cuántos dólares vale su saldo actual basado en cinco centavos por punto
**Próximas Oportunidades:** acciones que puede hacer para ganar más puntos

La información se actualiza en tiempo real cada vez que hay una transacción.

---

## Canje de Puntos

### Cómo Funciona el Canje

El canje ocurre cuando un usuario decide usar sus puntos acumulados como descuento en una nueva reserva.

#### Proceso de Canje:

**Paso Uno:** Usuario selecciona una habitación para reservar
**Paso Dos:** El sistema calcula el precio total de la reserva
**Paso Tres:** Usuario indica cuántos puntos desea usar
**Paso Cuatro:** El sistema valida que tenga suficientes puntos
**Paso Cinco:** Se calcula el descuento multiplicando puntos por cinco centavos
**Paso Seis:** Se resta el descuento del precio total
**Paso Siete:** El usuario completa el pago con el precio reducido
**Paso Ocho:** Se registra el uso de puntos en historial_puntos
**Paso Nueve:** Se actualizan los puntos_acumulados restando los usados

#### Validaciones:

El sistema verifica que:
- El usuario tenga suficientes puntos antes de permitir el canje
- No use más puntos de los que posee
- El descuento no haga que el precio sea negativo
- La transacción se registre correctamente antes de confirmar

### Límites de Canje

No hay límite máximo de puntos que se pueden usar en una sola reserva. Un usuario puede canjear todos sus puntos acumulados en una única transacción si lo desea.

No hay límite mínimo. Se puede usar incluso un solo punto si se desea.

### Ejemplo Práctico

Usuario con quinientos puntos quiere reservar una habitación de cien dólares:

Precio original: cien dólares
Puntos disponibles: quinientos
Decide usar doscientos puntos para descuento
Cálculo de descuento: doscientos puntos multiplicado por cero punto cero cinco dólares igual diez dólares
Nuevo precio: cien dólares menos diez dólares igual noventa dólares
El usuario paga noventa dólares
Saldo de puntos: quinientos menos doscientos igual trescientos puntos

---

## Integración con Sistema de Pagos

### Desglose de Precio

Cuando un usuario realiza una reserva, el sistema retorna un desglose completo que incluye:

**Precio Base:** costo de la habitación por noche multiplicado por número de noches
**Opciones Adicionales:** desayuno, cama extra, servicio de transporte
**Subtotal:** suma de precio base más opciones
**Impuestos:** veintiuno por ciento del subtotal
**Descuento por Puntos:** si se usan puntos, el descuento aquí
**Precio Final:** total que debe pagar el usuario

### Métodos de Pago Disponibles

El sistema soporta cuatro métodos de pago:

**Tarjetas de Crédito:** Visa y Mastercard
**Mercado Pago:** plataforma de pago regional
**PayPal:** sistema de pagos internacional
**Transferencia Bancaria:** transferencia directa a cuenta del hotel

La elección del método de pago es independiente del uso de puntos. Un usuario puede pagar con puntos usando cualquier método de pago disponible.

---

## Tablas de Base de Datos

### Tabla historial_puntos

Almacena cada transacción de puntos:

```
id: identificador único
id_usuario: usuario que realizó la acción
id_reserva: reserva asociada si aplica
tipo: ENUM(ganado, canjeado)
cantidad: puntos en la transacción
concepto: descripción del motivo
fecha: cuándo ocurrió
```

**Índices:** id_usuario para búsquedas rápidas, tipo para filtrar por categoría, fecha para ordenar cronológicamente

### Tabla canje_puntos

Registro separado específico de canjes realizados:

```
id: identificador único
id_usuario: usuario que realizó el canje
id_reserva: reserva donde se aplicó el descuento
puntos_utilizados: cantidad canjeada
estado: ENUM(pendiente, aplicado, cancelado)
fecha_creacion: cuándo se solicitó
fecha_aplicacion: cuándo se confirmó
```

**Propósito:** Separar histórico de canjes del histórico general para reportes específicos

### Actualización en Tabla usuarios

El campo puntos_acumulados se actualiza cada vez que:
- Se completa una reserva: suma cien
- Se publica una reseña: suma cincuenta
- Se canjean puntos: resta la cantidad canjeada

El valor representa el saldo actual disponible para el usuario.

---

## Flujos de Usuario

### Flujo de Ganancia de Puntos - Reserva

Usuario realiza reserva > Usuario hace check-in en recepción > Usuario completa estadía > Empleado hace check-out > Sistema suma cien puntos > Usuario ve confirmación de puntos ganados > Usuario puede consultar nuevo saldo

**Tiempo de Acreditación:** inmediato al hacer check-out

### Flujo de Ganancia de Puntos - Reseña

Usuario completa estadía > Usuario entra a app > Usuario busca opción dejar reseña > Usuario escribe y envía comentario > Sistema suma cincuenta puntos > Reseña se publica > Usuario ve confirmación > Puntos suma al saldo total

**Tiempo de Acreditación:** inmediato al publicar reseña

### Flujo de Canje de Puntos

Usuario ve saldo actual > Usuario selecciona nueva habitación > Usuario indica puntos a canjear > Sistema valida disponibilidad > Sistema calcula descuento > Usuario revisa desglose > Usuario confirma pago > Sistema aplica descuento > Puntos se restan > Reserva se confirma > Usuario recibe confirmación con saldo nuevo

**Tiempo de Acreditación de Descuento:** inmediato al confirmar pago

---

## Reportes y Análisis

### Consultas Disponibles para Usuario

**Saldo Actual:** consulta directa del campo puntos_acumulados
**Historial Completo:** lista de todas las transacciones con fechas
**Últimas Transacciones:** muestra últimas diez transacciones
**Equivalencia Actual:** muestra cuántos dólares vale su saldo

### Consultas Disponibles para Administrador

**Puntos por Usuario:** ver cuántos puntos tiene cada usuario
**Historial de Usuario Específico:** todas las transacciones de un usuario
**Distribución de Ganancias:** cuántos puntos se ganaron por reservas versus reseñas
**Distribución de Canjes:** cuántos puntos se canjearon en total
**Usuarios con Mayor Saldo:** ranking de usuarios más leales
**Reportes por Período:** ganancias y canjes en rangos de fechas

---

## Consideraciones Técnicas

### Atomicidad de Transacciones

Todas las operaciones de puntos se ejecutan dentro de transacciones de base de datos. Esto significa que si algo falla a mitad del proceso, todo se revierte. El usuario no pierde puntos y la acción se puede reintentar.

### Manejo de Errores

Si ocurre un error durante el proceso de ganancia de puntos:
- La acción principal se completa si es posible
- Se registra el fallo en base de datos
- Se notifica al usuario del error
- Se permite reintentar manualmente

### Performance

Todas las consultas de puntos utilizan índices de base de datos para respuesta rápida incluso con muchos usuarios. Las operaciones se completan en milisegundos.

### Seguridad

Solo el usuario autenticado puede ver sus propios puntos. Los administradores pueden ver puntos de otros usuarios solo con autenticación válida. Todos los cambios se registran completamente para auditoría.

---

## Consideraciones Futuras

### Mejoras Potenciales

**Niveles de Membresía:** crear tiers que ganen puntos a diferentes tasas
**Bonificación Temporal:** períodos donde se ganan puntos dobles
**Referidos:** bonificación por recomendar el hotel a otros
**Puntos por Métodos de Pago:** ganancia adicional por usar ciertos métodos
**Canje de Puntos por Experiencias:** usar puntos para servicios del hotel además de descuentos

### Monitoreo Necesario

Revisar regularmente el saldo promedio de puntos de usuarios para ajustar tasas si es necesario. Monitorear canjes para detectar patrones. Detectar posibles fraudes en ganancia o gasto anormal de puntos.
