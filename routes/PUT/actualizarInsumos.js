const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.post('/', async (req, res) => {
    const { id_plato, insumos } = req.body;

    if (!id_plato || !Array.isArray(insumos)) {
        return res.status(400).json({ error: 'Faltan datos requeridos o insumos no es un arreglo' });
    }

    try {
        const insumosJson = JSON.stringify(insumos);
        console.log('🔄 Actualizando insumos de plato:', { id_plato, insumos });

        await db.query('CALL ActualizarCantidadInsumos(?, ?)', [id_plato, insumosJson]);
        res.status(200).json({ message: 'Cantidades actualizadas correctamente' });
    } catch (err) {
        console.error('❌ Error al actualizar insumos:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;