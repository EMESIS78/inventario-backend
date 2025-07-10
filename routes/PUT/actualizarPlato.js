const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../../db/connection');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

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

// ✅ Ruta para actualizar plato con imagen
router.put('/actualizarPlato/:id', upload.single('imagen'), async (req, res) => {
    const id_plato = req.params.id;
    const { nombre, descripcion, precio } = req.body;
    let insumos;

    try {
        insumos = JSON.parse(req.body.insumos);
    } catch (e) {
        return res.status(400).json({ error: 'Formato incorrecto en insumos (debe ser JSON válido)' });
    }

    const imagen = req.file ? req.file.path : req.body.imagen; // Usa Cloudinary o la imagen anterior

    if (!nombre || !descripcion || precio === undefined || !Array.isArray(insumos)) {
        return res.status(400).json({ error: 'Faltan datos requeridos o formato incorrecto' });
    }

    try {
        const insumosJSON = JSON.stringify(insumos);
        await db.query('CALL EditarPlatoConInsumos(?, ?, ?, ?, ?, ?)', [
            id_plato,
            nombre,
            descripcion,
            precio,
            imagen,
            insumosJSON,
        ]);

        res.json({ success: true, message: 'Plato actualizado correctamente' });
    } catch (error) {
        console.error('❌ Error al editar el plato:', error);
        res.status(500).json({ error: 'Error al editar el plato' });
    }
});

module.exports = router;
