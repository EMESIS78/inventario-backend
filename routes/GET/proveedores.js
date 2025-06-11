const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/proveedores', async (req, res) => {
    try {
        const [rows] = await db.query('select * from proveedores'); // sin password
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;