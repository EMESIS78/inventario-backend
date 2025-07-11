const express = require('express');
const db = require('../../db/connection');
const router = express.Router();

router.put('/actualizar-stock', async (req, res) => {
    const { p_id_almacen, p_id_articulo, p_nuevo_stock, p_user_id } = req.body;

    if (!p_id_almacen || !p_id_articulo || p_nuevo_stock === undefined || !p_user_id) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    try {
        await db.query('CALL ActualizarStockManual(?, ?, ?, ?)', [
            p_id_almacen,
            p_id_articulo,
            p_nuevo_stock,
            p_user_id
        ]);

        console.log('✅ Stock actualizado correctamente.');

        // 👉 Obtener nombre del usuario y nombre del producto
        const [[userRow]] = await db.query('SELECT name FROM users WHERE id = ?', [p_user_id]);
        const usuario = userRow?.name || 'Usuario desconocido';

        const [[productoRow]] = await db.query('SELECT nombre FROM productos WHERE id_producto = ?', [p_id_articulo]);
        const nombreProducto = productoRow?.nombre || 'Producto desconocido';

        // 👉 Emitir evento WebSocket
        const io = req.app.get('io');  // Obtenemos la instancia de Socket.io
        io.emit('ajuste-stock', {
            mensaje: 'STOCK AJUSTADO',
            fecha: new Date().toISOString(),
            usuario,
            almacen: p_id_almacen,
            producto: nombreProducto,
            nuevo_stock: p_nuevo_stock
        });

        res.json({ message: 'Stock actualizado correctamente.' });
    } catch (error) {
        console.error('❌ Error al actualizar stock:', error);
        res.status(500).json({ error: 'Error al actualizar stock.' });
    }
});

module.exports = router;