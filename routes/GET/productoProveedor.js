const express = require('express');
const db = require('../../db/connection');
const router = express.Router();

router.get('/proveedores-producto', async (req, res) => {
    const { p_id_articulo } = req.query;

    console.log('Parámetro recibido:', { p_id_articulo });

    if (!p_id_articulo) {
        console.error('Falta el parámetro requerido: p_id_articulo');
        return res.status(400).json({
            error: "El parámetro 'p_id_articulo' es requerido."
        });
    }

    const query = 'CALL ObtenerProveedoresProducto(?)';

    try {
        console.log('Ejecutando query:', query, 'con parámetro:', [p_id_articulo]);

        const [results] = await db.query(query, [p_id_articulo]);

        console.log('Resultados de la consulta:', results);

        // Verificar si hay resultados
        const proveedores = results[0];
        if (proveedores.length === 0) {
            console.warn('No se encontraron proveedores para el artículo proporcionado.');
            return res.status(404).json({
                message: 'No se encontraron proveedores para el artículo especificado.'
            });
        }

        console.log('Proveedores encontrados:', proveedores);
        res.status(200).json({
            proveedores
        });
    } catch (error) {
        console.error('Error al consultar los proveedores del producto:', error);
        res.status(500).json({
            error: 'Ocurrió un error al consultar los proveedores del producto.'
        });
    }
});

module.exports = router;