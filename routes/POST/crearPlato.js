const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../../db/connection');

const router = express.Router();

// 📁 Configuración de multer para guardar imágenes en /uploads/platos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/platos');
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

    const imagen = req.file ? `platos/${req.file.filename}` : null;

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
            insumosJSON
        ]);

        console.log('✅ Plato con insumos agregado con éxito');
        res.status(201).json({ message: 'Plato con insumos agregado correctamente' });
    } catch (err) {
        console.error('❌ Error al agregar plato:', err.message);
        res.status(500).json({ error: 'Error al agregar el plato' });
    }
});

module.exports = router;