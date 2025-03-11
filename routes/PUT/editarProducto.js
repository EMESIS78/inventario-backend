const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../../db/connection');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardan las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// 📝 Actualizar un producto (PUT)
router.put('/:id', upload.single('imagen'), async (req, res) => {
    const { id } = req.params;
    const { codigo, nombre, marca, unidad_medida, ubicacion } = req.body;

    try {
        // Verificar si el producto existe
        const [producto] = await db.query('SELECT imagen FROM productos WHERE id_producto = ?', [id]);
        if (producto.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Manejo de imagen
        let nuevaImagen = producto[0].imagen; // Mantener la imagen actual
        if (req.file) {
            nuevaImagen = req.file.filename;
            
            // Eliminar la imagen anterior si existe
            if (producto[0].imagen) {
                const imagenPath = path.join(__dirname, '../../uploads/', producto[0].imagen);
                if (fs.existsSync(imagenPath)) {
                    fs.unlinkSync(imagenPath);
                }
            }
        }

        // Actualizar en la base de datos
        await db.query(
            'UPDATE productos SET codigo = ?, nombre = ?, marca = ?, unidad_medida = ?, ubicacion = ?, imagen = ?, updated_at = NOW() WHERE id_producto = ?',
            [codigo, nombre, marca, unidad_medida, ubicacion, nuevaImagen, id]
        );

        res.json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
});

module.exports = router;