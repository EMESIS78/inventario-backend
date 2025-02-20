const express = require('express');
const db = require('../../db/connection');
const router = express.Router();

router.get('/stock', async (req, res) => {
    const { p_id_almacen, p_id_producto } = req.query;

    console.log('Parametros recibidos:', { p_id_almacen, p_id_producto });

    if (!p_id_almacen || !p_id_producto) {
        console.error('Faltan parámetros requeridos');
        return res.status(400).json({
            error: "Los parámetros 'p_id_almacen' y 'p_id_producto' son requeridos."
        });
    }

    const query = 'CALL ConsultarStock(?, ?)';

    try {
        console.log('Ejecutando query:', query, 'con parámetros:', [p_id_almacen, p_id_producto]);

        const [results] = await db.query(query, [p_id_almacen, p_id_producto]);

        console.log('Resultados de la consulta:', results);

        // Acceder al stock correctamente
        const stockData = results[0]; // Primer conjunto de resultados
        if (stockData.length === 0) {
            console.warn('No se encontró stock para los parámetros proporcionados.');
            return res.status(404).json({
                message: 'No se encontró stock para el producto en el almacén especificado.'
            });
        }

        const stock = stockData[0].stock;

        console.log('Stock encontrado:', stock);
        res.status(200).json({
            stock
        });
    } catch (error) {
        console.error('Error al consultar el stock:', error);
        res.status(500).json({
            error: 'Ocurrió un error al consultar el stock.'
        });
    }
});

module.exports = router;