const express = require('express');
const db = require('../../db/connection');
const router = express.Router();

router.post('/registrar-salida', async (req, res) => {
    const { p_id_almacen, p_motivo, p_productos, p_user_id } = req.body;

    console.log('📤 Registrando nueva salida:', { p_id_almacen, p_motivo, p_productos, p_user_id });

    if (!p_id_almacen || !p_motivo || !p_productos || !p_user_id) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios: p_id_almacen, p_motivo, p_productos, p_user_id.' });
    }

    const query = 'CALL RegistrarSalida(?, ?, ?, ?)';

    try {
        console.log('🛠 Ejecutando query:', query, 'con parámetros:', [p_id_almacen, p_motivo, JSON.stringify(p_productos), p_user_id]);
        await db.query(query, [p_id_almacen, p_motivo, JSON.stringify(p_productos), p_user_id]);
        console.log('✅ Salida registrada correctamente.');

        // 👉 Obtener nombre del usuario
        const [rows] = await db.query('SELECT name FROM users WHERE id = ?', [p_user_id]);
        const usuario = rows[0]?.name || 'Usuario desconocido';

        // 👉 Emitir evento WebSocket
        const io = req.app.get('io');  // obtener instancia de io
        io.emit('salida-registrada', {
            mensaje: 'SALIDA REGISTRADA',
            fecha: new Date().toISOString(),
            usuario,
            motivo: p_motivo
        });

        res.status(201).json({ message: 'Salida registrada exitosamente.' });

    } catch (error) {
        console.error('❌ Error al registrar la salida:', error);
        res.status(500).json({ error: error.message, detalles: error });
    }
});

module.exports = router;