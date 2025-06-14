const express = require('express');
const db = require('../../db/connection');
const pdf = require('html-pdf-node');

const router = express.Router();

router.get('/reporte-global/pdf', async (req, res) => {
    try {
        const [results] = await db.query('CALL sp_generar_reporte_global()');
        const reporte = results[0];

        if (reporte.length === 0) {
            return res.status(404).json({ message: 'No hay datos en el reporte global.' });
        }

        const html = `
            <html>
                <head>
                    <style>
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h2>Reporte Global de Inventario</h2>
                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Producto</th>
                            <th>Existencia Total</th>
                        </tr>
                        ${reporte.map(r => `
                            <tr>
                                <td>${r.id_producto}</td>
                                <td>${r.nombre}</td>
                                <td>${r.existencia}</td>
                            </tr>
                        `).join('')}
                    </table>
                </body>
            </html>
        `;

        const file = { content: html };
        const options = { format: 'A4' };

        const pdfBuffer = await pdf.generatePdf(file, options);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_global.pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('❌ Error al generar PDF del reporte global:', error);
        res.status(500).json({ error: 'Error al generar PDF del reporte global.' });
    }
});

module.exports = router;