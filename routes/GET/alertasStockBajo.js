const express = require('express');
const db = require('../../db/connection');
const router = express.Router();

router.get('/alertas-stock-bajo', async (req, res) => {
    console.log('Consultando productos con stock bajo...');

    const query = 'CALL sp_generar_alerta_stock_bajo()';

    try {
        console.log('Ejecutando query:', query);

        const [results] = await db.query(query);

        console.log('Resultados de la consulta:', results);

        // Verificar si hay productos con stock bajo
        const alertas = results[0];
        if (alertas.length === 0) {
            console.warn('No hay productos con stock bajo.');
            return res.status(404).json({
                message: 'No hay productos con stock bajo.'
            });
        }

        console.log('Productos con stock bajo:', alertas);
        res.status(200).json({
            alertas
        });
    } catch (error) {
        console.error('Error al obtener alertas de stock bajo:', error);
        res.status(500).json({
            error: 'Ocurrió un error al obtener las alertas de stock bajo.'
        });
    }
});

module.exports = router;