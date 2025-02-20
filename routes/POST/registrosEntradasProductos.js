const express = require('express');
const db = require('../../db/connection');
const router = express.Router();

router.post('/registrar-entrada', async (req, res) => {
    const { p_id_almacen, p_documento, p_id_proveedor, p_productos, p_user_id } = req.body;

    console.log('📥 Registrando nueva entrada:', { p_id_almacen, p_documento, p_id_proveedor, p_productos, p_user_id });

    // Validar que los parámetros sean correctos
    if (!p_id_almacen || !p_documento || !p_id_proveedor || !p_productos || !p_user_id) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios: p_id_almacen, p_documento, p_id_proveedor, p_productos, p_user_id.' });
    }

    // ¡¡IMPORTANTE!! Aqui el id del producto se convierte a string para que se pueda insertar en la base de datos si este es nuevo, de lo contrario si ya existe solo colocar el nombre del producto según como esté en la base de datos para evitar crear productos inncecesarios
    const query = 'CALL RegistrarEntrada(?, ?, ?, ?, ?)';

    try {
        console.log('🛠 Ejecutando query:', query, 'con parámetros:', [p_id_almacen, p_documento, p_id_proveedor, JSON.stringify(p_productos), p_user_id]);
        
        await db.query(query, [p_id_almacen, p_documento, p_id_proveedor, JSON.stringify(p_productos), p_user_id]);

        console.log('✅ Entrada registrada correctamente.');
        res.status(201).json({ message: 'Entrada registrada exitosamente.' });

    } catch (error) {
        console.error('❌ Error al registrar la entrada:', error);
        res.status(500).json({ error: 'Ocurrió un error al registrar la entrada.' });
    }
});

module.exports = router;