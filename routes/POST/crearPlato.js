const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.post('/', async (req, res) => {
    console.log('✅ POST /api/platos llamado');
    const { nombre, descripcion, precio, insumos } = req.body;
    console.log('📦 Datos recibidos:', { nombre, descripcion, precio, insumos });

    if (!nombre || !descripcion || precio === undefined || !Array.isArray(insumos)) {
        console.log('⚠️ Faltan datos requeridos o insumos no es un array');
        return res.status(400).json({ error: 'Faltan datos requeridos o insumos mal formateados' });
    }

    try {
        const insumosJSON = JSON.stringify(insumos); // Convierte el array a JSON para MySQL
        await db.query('CALL AgregarPlatoConInsumos(?, ?, ?, ?)', [
            nombre,
            descripcion,
            precio,
            insumosJSON
        ]);
        console.log('✅ Plato con insumos agregado con éxito');
        res.status(201).json({ message: 'Plato con insumos agregado correctamente' });
    } catch (err) {
        console.error('❌ Error al agregar plato:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;