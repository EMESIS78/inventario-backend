const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
require('dotenv').config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'clave_secreta_super_segura'; // Clave para firmar los tokens

// 📌 Login de Usuario
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const user = rows[0];

        // 📌 Comparar la contraseña encriptada de Laravel con la ingresada
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // 📌 Generar Token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, rol: user.rol }, // Payload
            SECRET_KEY, 
            { expiresIn: '1d' } // Expira en 1 día
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                rol: user.rol,
                almacen_id: user.almacen_id ?? null
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;