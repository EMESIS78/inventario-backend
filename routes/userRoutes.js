const express = require('express');
const db = require('../db/connection');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// 📌 Obtener Datos del Usuario Autenticado
router.get('/perfil', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, email, rol FROM users WHERE id = ?', [req.user.id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;