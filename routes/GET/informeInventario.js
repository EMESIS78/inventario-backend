const express = require('express');
const db = require('../../db/connection');
const router = express.Router();

router.get('/informe-inventario', async (req, res) => {
    console.log('Generando informe de inventario...');

    const query = 'CALL sp_generar_informe_inventario()';

    try {
        console.log('Ejecutando query:', query);

        const [results] = await db.query(query);

        console.log('Resultados de la consulta:', results);

        // Verificar si hay productos en el inventario
        const informe = results[0];
        if (informe.length === 0) {
            console.warn('El informe de inventario está vacío.');
            return res.status(404).json({
                message: 'No hay productos en el inventario.'
            });
        }

        console.log('Informe de inventario generado con éxito:', informe);
        res.status(200).json({
            informe
        });
    } catch (error) {
        console.error('Error al generar el informe de inventario:', error);
        res.status(500).json({
            error: 'Ocurrió un error al generar el informe de inventario.'
        });
    }
});

module.exports = router;