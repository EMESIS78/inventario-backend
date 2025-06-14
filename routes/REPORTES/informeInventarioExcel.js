const express = require('express');
const db = require('../../db/connection');
const ExcelJS = require('exceljs');

const router = express.Router();

router.get('/informe-inventario/excel', async (req, res) => {
    try {
        const [results] = await db.query('CALL sp_generar_informe_inventario()');
        const informe = results[0];

        if (informe.length === 0) {
            return res.status(404).json({ message: 'No hay productos en el inventario.' });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Inventario');

        // Cabeceras
        worksheet.columns = [
            { header: 'Producto', key: 'nombre', width: 30 },
            { header: 'Marca', key: 'marca', width: 20 },
            { header: 'Ubicación', key: 'ubicacion', width: 20 },
            { header: 'Stock', key: 'stock', width: 10 },
            { header: 'Almacén', key: 'nombre_almacen', width: 25 }
        ];

        // Datos
        informe.forEach(producto => {
            worksheet.addRow(producto);
        });

        // Respuesta como archivo
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=informe_inventario.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('❌ Error al generar Excel:', error);
        res.status(500).json({ error: 'Error al generar el Excel del informe de inventario.' });
    }
});

module.exports = router;