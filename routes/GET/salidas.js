const express = require('express');
const db = require('../../db/connection');
const router = express.Router();
const verifyToken = require('../../middleware/authMiddleware');

router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Obtener el rol y el id del almacén
        const [userRows] = await db.query('SELECT rol, almacen_id FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const { rol, almacen_id } = userRows[0];

        let query = `
            SELECT s.id_salida, s.motivo, s.created_at,
                u.name AS usuario, a.nombre AS almacen
            FROM salidas s
            JOIN users u ON s.user_id = u.id
            JOIN almacenes a ON s.id_almacen = a.id
        `;

        const params = [];

        if (rol !== 'admin') {
            query += ' WHERE s.id_almacen = ?';
            params.push(almacen_id);
        }

        query += ' ORDER BY s.created_at DESC';

        const [rows] = await db.query(query, params);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error al obtener las salidas:', error);
        res.status(500).json({ success: false, message: 'Error al obtener las salidas' });
    }
});

module.exports = router;