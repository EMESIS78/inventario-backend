const express = require('express');
const db = require('../../db/connection');
const router = express.Router();

router.get('/movimientos', async (req, res) => {
    const { p_id_articulo } = req.query;

    if (!p_id_articulo) {
        console.error('El parámetro p_id_articulo es obligatorio.');
        return res.status(400).json({ error: 'El parámetro p_id_articulo es obligatorio.' });
    }

    console.log(`Ejecutando procedimiento almacenado con p_id_articulo: ${p_id_articulo}`);

    const query = 'CALL ConsultarMovimientosProducto(?)';

    try {
        const [results] = await db.execute(query, [p_id_articulo]);
        console.log('Resultados devueltos por la consulta:', results);

        if (!results || results[0].length === 0) {
            console.warn('No se encontraron movimientos para el producto:', p_id_articulo);
            return res.status(404).json({ message: 'No se encontraron movimientos para este producto.' });
        }

        res.status(200).json({ movimientos: results[0] });
    } catch (err) {
        console.error('Error en la ejecución del procedimiento almacenado:', err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

module.exports = router;