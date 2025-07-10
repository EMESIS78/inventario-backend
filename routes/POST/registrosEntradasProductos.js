const express = require('express');
const db = require('../../db/connection');

module.exports = (io) => {
    const router = express.Router();

    router.post('/registrar-entrada', async (req, res) => {
        const { p_id_almacen, p_documento, p_id_proveedor, p_productos, p_user_id } = req.body;

        console.log('📥 Registrando nueva entrada:', { p_id_almacen, p_documento, p_id_proveedor, p_productos, p_user_id });

        if (!p_id_almacen || !p_documento || !p_id_proveedor || !p_productos || !p_user_id) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        const query = 'CALL RegistrarEntrada(?, ?, ?, ?, ?)';

        try {
            await db.query(query, [p_id_almacen, p_documento, p_id_proveedor, JSON.stringify(p_productos), p_user_id]);

            console.log('✅ Entrada registrada correctamente.');

            const fechaActual = new Date().toISOString();
            io.emit('entrada-registrada', {
                mensaje: 'ENTRADA REGISTRADA',
                fecha: fechaActual,
                usuario: `Usuario ID: ${p_user_id}`,
                documento: p_documento,
            });

            res.status(201).json({ message: 'Entrada registrada exitosamente.' });
        } catch (error) {
            console.error('❌ Error al registrar la entrada:', error);
            res.status(500).json({ error: 'Ocurrió un error al registrar la entrada.' });
        }
    });

    return router; // ✅ MUY IMPORTANTE: ¡Debes retornar el router aquí!
};