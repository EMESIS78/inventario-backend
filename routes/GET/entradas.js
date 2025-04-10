const express = require('express');
const db = require('../../db/connection');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT e.id_entrada, e.documento, e.created_at,
                u.name AS usuario, a.nombre AS almacen
            FROM entradas e
            JOIN users u ON e.user_id = u.id
            JOIN almacenes a ON e.id_almacen = a.id
            ORDER BY e.created_at DESC;
        `);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error al obtener las salidas:', error);
        res.status(500).json({ success: false, message: 'Error al obtener las salidas' });
    }
});

module.exports = router;