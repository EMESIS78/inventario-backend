const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const bcrypt = require('bcryptjs');
const verifyToken = require('../../middleware/authMiddleware');

// GET usuarios (público solo si no hay datos sensibles)
router.get('/usuarios', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, email, rol, almacen_id FROM users'); // sin password
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear usuario (solo admin)
router.post('/usuarios', verifyToken, async (req, res) => {
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ error: 'No autorizado. Solo el admin puede crear usuarios.' });
    }

    const { name, email, password, rol, almacen_id } = req.body;

    if (!name || !email || !password || !rol) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const [result] = await db.query(
            `INSERT INTO users (name, email, password, rol, almacen_id, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [name, email, hashedPassword, rol, almacen_id || null]
        );

        res.status(201).json({ message: 'Usuario creado exitosamente', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Editar usuario (solo admin)
router.put('/usuarios/:id', verifyToken, async (req, res) => {
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ error: 'No autorizado. Solo el admin puede editar usuarios.' });
    }

    const { id } = req.params;
    const { name, email, password, rol, almacen_id } = req.body;

    try {
        let query = `UPDATE users SET name = ?, email = ?, rol = ?, almacen_id = ?, updated_at = NOW()`;
        let params = [name, email, rol, almacen_id || null];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 12);
            query += `, password = ?`;
            params.push(hashedPassword);
        }

        query += ` WHERE id = ?`;
        params.push(id);

        await db.query(query, params);
        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar usuario (solo admin)
router.delete('/usuarios/:id', verifyToken, async (req, res) => {
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ error: 'No autorizado. Solo el admin puede eliminar usuarios.' });
    }

    const { id } = req.params;

    try {
        await db.query(`DELETE FROM users WHERE id = ?`, [id]);
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;