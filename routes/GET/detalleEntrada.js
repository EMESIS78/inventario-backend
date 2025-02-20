const express = require('express');
const db = require('../../db/connection');
const router = express.Router();

router.get('/detalle-entrada', async (req, res) => {
    const { p_documento } = req.query;

    console.log('Parámetro recibido:', { p_documento });

    if (!p_documento) {
        console.error('Falta el parámetro requerido: p_documento');
        return res.status(400).json({
            error: "El parámetro 'p_documento' es requerido."
        });
    }

    const query = 'CALL ObtenerDetalleEntrada(?)';

    try {
        console.log('Ejecutando query:', query, 'con parámetro:', [p_documento]);

        const [results] = await db.query(query, [p_documento]);

        console.log('Resultados de la consulta:', results);

        // Verificar si hay resultados
        const detalles = results[0];
        if (detalles.length === 0) {
            console.warn('No se encontraron detalles para el documento proporcionado.');
            return res.status(404).json({
                message: 'No se encontraron detalles para el documento especificado.'
            });
        }

        console.log('Detalles encontrados:', detalles);
        res.status(200).json({
            detalles
        });
    } catch (error) {
        console.error('Error al consultar los detalles de entrada:', error);
        res.status(500).json({
            error: 'Ocurrió un error al consultar los detalles de entrada.'
        });
    }
});

module.exports = router;