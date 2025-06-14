const express = require('express');
const db = require('../../db/connection');
const ExcelJS = require('exceljs');

const router = express.Router();

router.get('/reporte-global/excel', async (req, res) => {
    try {
        const [results] = await db.query('CALL sp_generar_reporte_global()');
        const reporte = results[0];

        if (reporte.length === 0) {
            return res.status(404).json({ message: 'No hay datos en el reporte global.' });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte Global');

        worksheet.columns = [
            { header: 'ID Producto', key: 'id_producto', width: 15 },
            { header: 'Nombre', key: 'nombre', width: 30 },
            { header: 'Existencia', key: 'existencia', width: 15 }
        ];

        reporte.forEach(item => {
            worksheet.addRow(item);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_global.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('❌ Error al generar Excel del reporte global:', error);
        res.status(500).json({ error: 'Error al generar Excel del reporte global.' });
    }
});

module.exports = router;