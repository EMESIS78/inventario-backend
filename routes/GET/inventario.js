const express = require('express');
const db = require('../../db/connection');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { id_almacen } = req.query;
        if (!id_almacen) {
            return res.status(400).json({ error: "El id_almacen es obligatorio" });
        }

        const query = `
            SELECT p.nombre, p.id_producto, s.stock 
            FROM productos p
            JOIN stock s ON p.id_producto = s.id_articulo
            WHERE s.id_almacen = ?;
        `;

        const [productos] = await db.query(query, [id_almacen]);
        res.json(productos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;