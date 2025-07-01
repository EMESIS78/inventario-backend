const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../../db/connection');

// 📁 Configuración del almacenamiento con multer (guardamos en /uploads/platos)
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

    const imagen = req.file ? `platos/${req.file.filename}` : req.body.imagen;

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
            insumosJSON
        ]);

        res.json({ success: true, message: 'Plato actualizado correctamente' });
    } catch (error) {
        console.error('❌ Error al editar el plato:', error);
        res.status(500).json({ error: 'Error al editar el plato' });
    }
});

module.exports = router;
