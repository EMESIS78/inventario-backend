const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const fs = require('fs');
const path = require('path');

// 🗑️ Eliminar un plato por ID
router.delete('/:id', async (req, res) => {
    const id_plato = req.params.id;

    try {
        // Primero obtenemos la imagen actual para borrarla del sistema de archivos
        const [rows] = await db.query('SELECT imagen FROM platos WHERE id_plato = ?', [id_plato]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Plato no encontrado' });
        }

        const imagenPath = rows[0].imagen;
        if (imagenPath) {
            const fullImagePath = path.join(__dirname, '../../uploads', imagenPath);
            if (fs.existsSync(fullImagePath)) {
                fs.unlinkSync(fullImagePath);
            }
        }

        // Eliminamos primero los insumos relacionados en la tabla carta (relación)
        await db.query('DELETE FROM carta WHERE id_plato = ?', [id_plato]);

        // Eliminamos el plato
        await db.query('DELETE FROM platos WHERE id_plato = ?', [id_plato]);

        res.json({ success: true, message: 'Plato eliminado correctamente' });
    } catch (err) {
        console.error('❌ Error al eliminar el plato:', err);
        res.status(500).json({ error: 'Error al eliminar el plato' });
    }
});

module.exports = router;
