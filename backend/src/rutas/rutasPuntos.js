const express = require('express');
const router = express.Router();
const { verificarAutenticacion } = require('../middlewares/middlewareAuth');

// Por ahora, una ruta básica para que el archivo no esté vacío
router.get('/', verificarAutenticacion, (req, res) => {
    res.json({ 
        exito: true, 
        mensaje: "Sistema de puntos activo (Próximamente más funciones)" 
    });
});

module.exports = router;