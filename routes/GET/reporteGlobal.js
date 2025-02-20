const express = require('express');
const db = require('../../db/connection');
const router = express.Router();

router.get('/reporte-global', async (req, res) => {
    console.log('Generando reporte global de inventario...');

    const query = 'CALL sp_generar_reporte_global()';

    try {
        console.log('Ejecutando query:', query);

        const [results] = await db.query(query);

        console.log('Resultados de la consulta:', results);

        // Verificar si hay productos en el reporte
        const reporte = results[0];
        if (reporte.length === 0) {
            console.warn('El reporte global está vacío.');
            return res.status(404).json({
                message: 'No hay datos en el reporte global.'
            });
        }

        console.log('Reporte global generado con éxito:', reporte);
        res.status(200).json({
            reporte
        });
    } catch (error) {
        console.error('Error al generar el reporte global:', error);
        res.status(500).json({
            error: 'Ocurrió un error al generar el reporte global.'
        });
    }
});

module.exports = router;