const express = require('express');
const db = require('../../db/connection');
const pdf = require('html-pdf-node');

const router = express.Router();

router.get('/informe-inventario/pdf', async (req, res) => {
    try {
        const [results] = await db.query('CALL sp_generar_informe_inventario()');
        const informe = results[0];

        if (informe.length === 0) {
            return res.status(404).json({ message: 'No hay productos en el inventario.' });
        }

        // Construir HTML
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
                    <h2>Informe de Inventario</h2>
                    <table>
                        <tr>
                            <th>Producto</th>
                            <th>Marca</th>
                            <th>Ubicación</th>
                            <th>Stock</th>
                            <th>Almacén</th>
                        </tr>
                        ${informe.map(p => `
                            <tr>
                                <td>${p.nombre}</td>
                                <td>${p.marca}</td>
                                <td>${p.ubicacion}</td>
                                <td>${p.stock}</td>
                                <td>${p.nombre_almacen}</td>
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
        res.setHeader('Content-Disposition', 'attachment; filename=informe_inventario.pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('❌ Error al generar PDF:', error);
        res.status(500).json({ error: 'Error al generar el PDF del informe de inventario.' });
    }
});

module.exports = router;