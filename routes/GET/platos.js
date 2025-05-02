const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                p.id_plato AS plato_id,
                p.nombre AS plato_nombre,
                p.descripcion,
                p.precio,
                p.imagen,
                pr.id_producto AS producto_id,
                pr.nombre AS producto_nombre,
                c.cantidad_requerida
            FROM platos p
            LEFT JOIN carta c ON p.id_plato = c.id_plato
            LEFT JOIN productos pr ON c.id_producto = pr.id_producto
            ORDER BY p.id_plato
        `);

        // Estructura anidada
        const platos = {};
        rows.forEach(row => {
            if (!platos[row.plato_id]) {
                platos[row.plato_id] = {
                    id_plato: row.plato_id,
                    nombre: row.plato_nombre,
                    descripcion: row.descripcion,
                    precio: row.precio,
                    imagen: row.imagen,
                    insumos: []
                };
            }

            if (row.producto_id) {
                platos[row.plato_id].insumos.push({
                    id_producto: row.producto_id,
                    nombre_producto: row.producto_nombre,
                    cantidad_requerida: row.cantidad_requerida
                });
            }
        });

        res.json(Object.values(platos));
    } catch (err) {
        console.error('❌ Error al obtener platos con insumos:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;