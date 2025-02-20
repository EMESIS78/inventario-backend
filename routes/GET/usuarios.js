const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;