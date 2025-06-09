const express = require('express');
const db = require('../../db/connection');
const router = express.Router();

router.get('/detalle-salida', async (req, res) => {
    const { p_id_salida } = req.query;

    console.log('Parámetro recibido:', { p_id_salida });

    if (!p_id_salida) {
        console.error('Falta el parámetro requerido: p_id_salida');
        return res.status(400).json({
            error: "El parámetro 'p_id_salida' es requerido."
        });
    }

    const query = 'CALL ObtenerDetalleSalida(?)';

    try {
        console.log('Ejecutando query:', query, 'con parámetro:', [p_id_salida]);

        const [results] = await db.query(query, [p_id_salida]);

        const detalles = results[0];

        if (!detalles || detalles.length === 0) {
            console.warn('No se encontraron detalles para la salida proporcionada.');
            return res.status(404).json({
                message: 'No se encontraron detalles para la salida especificada.'
            });
        }

        console.log('Detalles encontrados:', detalles);
        res.status(200).json({
            detalles
        });
    } catch (error) {
        console.error('Error al consultar los detalles de salida:', error);
        res.status(500).json({
            error: 'Ocurrió un error al consultar los detalles de salida.'
        });
    }
});

module.exports = router;