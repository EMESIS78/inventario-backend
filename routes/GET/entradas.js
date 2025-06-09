const express = require('express');
const db = require('../../db/connection');
const router = express.Router();
const verifyToken = require('../../middleware/authMiddleware');

router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Obtener rol y almacen_id del usuario actual
        const [userRows] = await db.query('SELECT rol, almacen_id FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const { rol, almacen_id } = userRows[0];

        let query = `
            SELECT e.id_entrada, e.documento, e.created_at,
                u.name AS usuario, a.nombre AS almacen
            FROM entradas e
            JOIN users u ON e.user_id = u.id
            JOIN almacenes a ON e.id_almacen = a.id
        `;

        const params = [];

        // Si no es admin, filtrar por su almacén
        if (rol !== 'admin') {
            query += ' WHERE e.id_almacen = ?';
            params.push(almacen_id);
        }

        query += ' ORDER BY e.created_at DESC';

        const [rows] = await db.query(query, params);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error al obtener las entradas:', error);
        res.status(500).json({ success: false, message: 'Error al obtener las entradas' });
    }
});

module.exports = router;