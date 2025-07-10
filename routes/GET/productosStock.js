const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

// ✅ Obtener productos CON STOCK > 0 en un almacén específico
router.get('/', async (req, res) => {
    const { id_almacen } = req.query;

    if (!id_almacen) {
        return res.status(400).json({ error: 'Falta el parámetro id_almacen' });
    }

    try {
        const [rows] = await db.query(
            `SELECT p.id_producto, p.codigo, p.nombre, p.marca, p.unidad_medida, p.ubicacion, 
                    s.stock
             FROM productos p
             INNER JOIN stock s ON s.id_articulo = p.id_producto
             WHERE s.id_almacen = ? AND s.stock > 0`,
            [id_almacen]
        );

        res.json(rows);
    } catch (err) {
        console.error('❌ Error al obtener productos con stock:', err);
        res.status(500).json({ error: 'Error al obtener productos con stock' });
    }
});

module.exports = router;