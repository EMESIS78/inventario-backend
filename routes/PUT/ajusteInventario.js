const express = require('express');
const db = require('../../db/connection');
const router = express.Router();

router.put('/actualizar-stock', async (req, res) => {
    const { p_id_almacen, p_id_articulo, p_nuevo_stock } = req.body;

    console.log('Actualizando stock manualmente:', { p_id_almacen, p_id_articulo, p_nuevo_stock });

    // Validar que los parámetros obligatorios estén presentes
    if (!p_id_almacen || !p_id_articulo || p_nuevo_stock === undefined) {
        return res.status(400).json({ error: 'Se requieren p_id_almacen, p_id_articulo y p_nuevo_stock.' });
    }

    const query = 'CALL ActualizarStockManual(?, ?, ?)';

    try {
        console.log('Ejecutando query:', query, 'con parámetros:', [p_id_almacen, p_id_articulo, p_nuevo_stock]);

        await db.query(query, [p_id_almacen, p_id_articulo, p_nuevo_stock]);

        console.log('Stock actualizado correctamente.');
        res.status(200).json({ message: 'Stock actualizado correctamente.' });

    } catch (error) {
        console.error('Error al actualizar el stock:', error);
        res.status(500).json({ error: 'Ocurrió un error al actualizar el stock.' });
    }
});

module.exports = router;