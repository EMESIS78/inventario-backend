const express = require('express');
const db = require('../../db/connection');
const router = express.Router();

router.post('/registrar-traslado', async (req, res) => {
    const { 
        p_id_almacen_salida, 
        p_id_almacen_entrada, 
        p_motivo, 
        p_productos, 
        p_user_id, 
        p_placa_vehiculo, 
        p_guia 
    } = req.body;

    console.log('🚚 Registrando nuevo traslado:', { 
        p_id_almacen_salida, 
        p_id_almacen_entrada, 
        p_motivo, 
        p_productos, 
        p_user_id, 
        p_placa_vehiculo, 
        p_guia 
    });

    // Validar que los parámetros sean correctos
    if (!p_id_almacen_salida || !p_id_almacen_entrada || !p_motivo || !p_productos || !p_user_id || !p_placa_vehiculo || !p_guia) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const query = 'CALL RegistrarTraslado(?, ?, ?, ?, ?, ?, ?)';

    try {
        console.log('🛠 Ejecutando query:', query, 'con parámetros:', [
            p_id_almacen_salida, 
            p_id_almacen_entrada, 
            p_motivo, 
            JSON.stringify(p_productos), 
            p_user_id, 
            p_placa_vehiculo, 
            p_guia
        ]);

        await db.query(query, [
            p_id_almacen_salida, 
            p_id_almacen_entrada, 
            p_motivo, 
            JSON.stringify(p_productos), 
            p_user_id, 
            p_placa_vehiculo, 
            p_guia
        ]);

        console.log('✅ Traslado registrado correctamente.');
        res.status(201).json({ message: 'Traslado registrado exitosamente.' });

    } catch (error) {
        console.error('❌ Error al registrar el traslado:', error);
        res.status(500).json({ error: 'Ocurrió un error al registrar el traslado.' });
    }
});

module.exports = router;