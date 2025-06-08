const express = require('express');
const db = require('../../db/connection');
const pdf = require('html-pdf-node');
const router = express.Router();

router.get('/reporte-entradas', async (req, res) => {
    try {
        const [entradas] = await db.query(`
            SELECT e.id_entrada, e.documento, e.id_proveedor, e.created_at,
                   u.name AS usuario, a.nombre AS almacen
            FROM entradas e
            JOIN users u ON e.user_id = u.id
            JOIN almacenes a ON e.id_almacen = a.id
            ORDER BY e.created_at DESC
        `);

        const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Reporte de Entradas</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    line-height: 1.6;
                    margin: 20px;
                    color: #333;
                }
                h2 {
                    text-align: center;
                    margin-bottom: 20px;
                    font-size: 24px;
                    color: #444;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                }
                th {
                    background-color: #f4f4f4;
                    font-weight: bold;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                tr:hover {
                    background-color: #f1f1f1;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 12px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <h2>Reporte de Entradas</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Documento</th>
                        <th>Almacén</th>
                        <th>Proveedor</th>
                        <th>Fecha</th>
                        <th>Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    ${entradas.map(e => `
                        <tr>
                            <td>${e.id_entrada}</td>
                            <td>${e.documento}</td>
                            <td>${e.almacen}</td>
                            <td>${e.id_proveedor}</td>
                            <td>${new Date(e.created_at).toLocaleDateString()}</td>
                            <td>${e.usuario}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="footer">
                <p>Reporte generado automáticamente por el sistema de inventarios.</p>
            </div>
        </body>
        </html>
        `;

        const file = { content: html };
        const options = { format: 'A4' };

        const pdfBuffer = await pdf.generatePdf(file, options);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_entradas.pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generando PDF:', error);
        res.status(500).json({ error: 'Error al generar PDF' });
    }
});

module.exports = router;
