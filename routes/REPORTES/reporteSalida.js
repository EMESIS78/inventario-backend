const express = require('express');
const db = require('../../db/connection');
const pdf = require('html-pdf-node');
const verifyToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/reporte-salidas', verifyToken, async (req, res) => {
    try {
        const user = req.user;

        let query = `
      SELECT s.id_salida, s.documento, s.motivo, s.created_at,
             u.name AS usuario, a.nombre AS almacen
      FROM salidas s
      JOIN users u ON s.user_id = u.id
      JOIN almacenes a ON s.id_almacen = a.id
    `;

        if (user.rol !== 'admin') {
            query += ` WHERE s.id_almacen = ${db.escape(user.almacen_id)} `;
        }

        query += ` ORDER BY s.created_at DESC`;

        const [salidas] = await db.query(query);

        const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Reporte de Salidas</title>
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
        <h2>Reporte de Salidas</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Documento</th>
                    <th>Almacén</th>
                    <th>Motivo</th>
                    <th>Fecha</th>
                    ${user.rol === 'admin' ? '<th>Usuario</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${salidas.map(s => `
                    <tr>
                        <td>${s.id_salida}</td>
                        <td>${s.documento}</td>
                        <td>${s.almacen}</td>
                        <td>${s.motivo}</td>
                        <td>${new Date(s.created_at).toLocaleDateString()}</td>
                        ${user.rol === 'admin' ? `<td>${s.usuario}</td>` : ''}
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

        const pdfBuffer = await pdf.generatePdf({ content: html }, { format: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_salidas.pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('❌ Error generando PDF de salidas:', error);
        res.status(500).json({ error: 'Error generando reporte de salidas' });
    }
});

module.exports = router;
