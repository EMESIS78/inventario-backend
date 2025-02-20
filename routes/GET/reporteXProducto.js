const express = require('express');
const db = require('../../db/connection');
const router = express.Router();

router.get('/reporte-movimientos', async (req, res) => {
    const { p_id_articulo } = req.query;

    console.log('Generando reporte de movimientos para el artículo ID:', p_id_articulo);

    if (!p_id_articulo) {
        return res.status(400).json({ error: 'El parámetro p_id_articulo es obligatorio.' });
    }

    const query = 'CALL sp_generar_reporte_movimientos_producto(?)';

    try {
        console.log('Ejecutando query:', query, 'con parámetros:', [p_id_articulo]);

        const [results] = await db.query(query, [p_id_articulo]);

        console.log('Resultados de la consulta:', results);

        // Verificar si hay movimientos
        const movimientos = results[0];
        if (movimientos.length === 0) {
            console.warn('No se encontraron movimientos para el producto.');
            return res.status(404).json({
                message: 'No se encontraron movimientos para este producto.'
            });
        }

        console.log('Reporte de movimientos generado con éxito:', movimientos);
        res.status(200).json({ movimientos });

    } catch (error) {
        console.error('Error al generar el reporte de movimientos:', error);
        res.status(500).json({
            error: 'Ocurrió un error al generar el reporte de movimientos.'
        });
    }
});

module.exports = router;