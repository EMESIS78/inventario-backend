const express = require('express');
const db = require('../../db/connection');
const router = express.Router();

router.post('/registrar-salida', async (req, res) => {
    const { p_id_almacen, p_motivo, p_productos, p_user_id } = req.body;

    console.log('📤 Registrando nueva salida:', { p_id_almacen, p_motivo, p_productos, p_user_id });

    // Validar que los parámetros sean correctos
    if (!p_id_almacen || !p_motivo || !p_productos || !p_user_id) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios: p_id_almacen, p_motivo, p_productos, p_user_id.' });
    }

    //!!!IMPORTANTE!!! Aqui el id del producto se debe llenar con el nombre del producto según como esté en la base de datos de lo contrario no guardara la salida
    const query = 'CALL RegistrarSalida(?, ?, ?, ?)';

    try {
        console.log('🛠 Ejecutando query:', query, 'con parámetros:', [p_id_almacen, p_motivo, JSON.stringify(p_productos), p_user_id]);

        await db.query(query, [p_id_almacen, p_motivo, JSON.stringify(p_productos), p_user_id]);

        console.log('✅ Salida registrada correctamente.');
        res.status(201).json({ message: 'Salida registrada exitosamente.' });

    } catch (error) {
        console.error('❌ Error al registrar la salida:', error);
        res.status(500).json({ error: 'Ocurrió un error al registrar la salida.' });
    }
});

module.exports = router;