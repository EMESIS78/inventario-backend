const express = require('express');
const multer = require('multer');
const db = require('../../db/connection');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const router = express.Router();

// ✅ Configura Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Configura multer con Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'platos',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});
const upload = multer({ storage });

// ✅ Crear nuevo plato con imagen
router.post('/', upload.single('imagen'), async (req, res) => {
    console.log('✅ POST /api/platos llamado');

    const { nombre, descripcion, precio } = req.body;
    let insumos;

    try {
        insumos = JSON.parse(req.body.insumos);
    } catch (e) {
        return res.status(400).json({ error: 'Formato incorrecto en insumos (debe ser JSON válido)' });
    }

    const imagen = req.file ? req.file.path : null; // URL pública de la imagen en Cloudinary

    console.log('📦 Datos recibidos:', { nombre, descripcion, precio, imagen, insumos });

    if (!nombre || !descripcion || precio === undefined || !Array.isArray(insumos)) {
        console.log('⚠️ Faltan datos requeridos o insumos no es un array');
        return res.status(400).json({ error: 'Faltan datos requeridos o insumos mal formateados' });
    }

    try {
        const insumosJSON = JSON.stringify(insumos);
        await db.query('CALL AgregarPlatoConInsumos(?, ?, ?, ?, ?)', [
            nombre,
            descripcion,
            precio,
            imagen,
            insumosJSON,
        ]);

        console.log('✅ Plato con insumos agregado con éxito');
        res.status(201).json({ message: 'Plato con insumos agregado correctamente' });
    } catch (err) {
        console.error('❌ Error al agregar plato:', err.message);
        res.status(500).json({ error: 'Error al agregar el plato' });
    }
});

module.exports = router;