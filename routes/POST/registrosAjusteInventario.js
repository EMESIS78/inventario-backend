const express = require('express');
const db = require('../../db/connection');
const router = express.Router();

router.post('/registrar-ajuste', async (req, res) => {
    const { p_id_almacen, p_id_articulo, p_cantidad, p_descripcion, p_usuario_id } = req.body;

    console.log('Registrando ajuste de inventario:', { p_id_almacen, p_id_articulo, p_cantidad, p_descripcion, p_usuario_id });

    // Validar que los parámetros obligatorios estén presentes
    if (!p_id_almacen || !p_id_articulo || !p_cantidad || !p_descripcion || !p_usuario_id) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios: p_id_almacen, p_id_articulo, p_cantidad, p_descripcion, p_usuario_id.' });
    }

    const query = 'CALL RegistrarAjusteInventario(?, ?, ?, ?, ?)';

    try {
        console.log('Ejecutando query:', query, 'con parámetros:', [p_id_almacen, p_id_articulo, p_cantidad, p_descripcion, p_usuario_id]);

        await db.query(query, [p_id_almacen, p_id_articulo, p_cantidad, p_descripcion, p_usuario_id]);

        console.log('Ajuste registrado correctamente.');
        res.status(201).json({ message: 'Ajuste de inventario registrado correctamente.' });

    } catch (error) {
        console.error('Error al registrar el ajuste de inventario:', error);
        res.status(500).json({ error: 'Ocurrió un error al registrar el ajuste de inventario.' });
    }
});

module.exports = router;