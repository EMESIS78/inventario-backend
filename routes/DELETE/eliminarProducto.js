const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('../../db/connection');
const router = express.Router();

// 🗑️ Eliminar un producto (DELETE)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar si el producto existe
        const [producto] = await db.query('SELECT imagen FROM productos WHERE id_producto = ?', [id]);
        if (producto.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Eliminar la imagen si existe
        if (producto[0].imagen) {
            const imagenPath = path.join(__dirname, '../../uploads/', producto[0].imagen);
            if (fs.existsSync(imagenPath)) {
                fs.unlinkSync(imagenPath);
            }
        }

        // Eliminar el producto de la base de datos
        await db.query('DELETE FROM productos WHERE id_producto = ?', [id]);

        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
});

module.exports = router;