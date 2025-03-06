const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../../db/connection');

const router = express.Router();

// Configuración de multer para almacenar imágenes en la carpeta 'uploads/productos'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/productos');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Crear un nuevo producto
router.post('/', upload.single('imagen'), async (req, res) => {
    try {
        const { codigo, nombre, marca, unidad_medida, ubicacion } = req.body;
        const imagen = req.file ? `productos/${req.file.filename}` : null;
        const created_at = new Date();

        const [result] = await db.query(
            'INSERT INTO productos (codigo, nombre, marca, unidad_medida, ubicacion, imagen, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [codigo, nombre, marca, unidad_medida, ubicacion, imagen, created_at]
        );

        res.status(201).json({ message: 'Producto creado', id: result.insertId });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: 'Error al crear producto' });
    }
});

module.exports = router;