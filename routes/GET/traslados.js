const express = require('express');
const db = require('../../db/connection');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
    t.id_traslado, 
    t.motivo, 
    t.placa_vehiculo, 
    t.guia,
    t.created_at,
    u.name AS usuario, 
    a1.nombre AS almacen_salida,
    a2.nombre AS almacen_entrada
FROM traslados t
JOIN users u ON t.user_id = u.id
JOIN almacenes a1 ON t.id_almacen_salida = a1.id
JOIN almacenes a2 ON t.id_almacen_entrada = a2.id
ORDER BY t.created_at DESC;
        `);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error al obtener los traslados:', error);
        res.status(500).json({ success: false, message: 'Error al obtener los traslados' });
    }
});

module.exports = router;
