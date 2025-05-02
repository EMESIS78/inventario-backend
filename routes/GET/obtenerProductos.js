const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/', async (req, res) => {
    const { nombre, codigo } = req.query;

    if (!nombre && !codigo) {
        return res.status(400).json({ error: 'Se requiere nombre o código para buscar.' });
    }

    try {
        let query = '';
        let param = '';

        if (nombre) {
            query = 'SELECT nombre, codigo FROM productos WHERE nombre = ? LIMIT 1';
            param = nombre;
        } else {
            query = 'SELECT nombre, codigo FROM productos WHERE codigo = ? LIMIT 1';
            param = codigo;
        }

        const [rows] = await db.query(query, [param]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('❌ Error al buscar producto:', err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

module.exports = router;