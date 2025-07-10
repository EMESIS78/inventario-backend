const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

const productosRoutes = require('./routes/GET/productos');
const productosStockRoutes = require('./routes/GET/productosStock');
const usuariosRoutes = require('./routes/GET/usuarios');
const movimientosRoutes = require('./routes/GET/movimientos');
const stockRoutes = require('./routes/GET/stock');
const detalleEntradaRoutes = require('./routes/GET/detalleEntrada');
const detalleSalidaRoutes = require('./routes/GET/detalleSalida');
const productosProveedorRoutes = require('./routes/GET/productoProveedor');
const alertasStockBajoRoutes = require('./routes/GET/alertasStockBajo');
const informeInventarioRoutes = require('./routes/GET/informeInventario');
const reporteGlobalRoutes = require('./routes/GET/reporteGlobal');
const reporteXProductoRoutes = require('./routes/GET/reporteXProducto');
const ajusteInventarioRoutes = require('./routes/PUT/ajusteInventario');
const registrosAjusteInventarioRoutes = require('./routes/POST/registrosAjusteInventario');
const registrosEntradasProductosRoutes = require('./routes/POST/registrosEntradasProductos')(io);
const registrosSalidasProductosRoutes = require('./routes/POST/registrosSalidasProductos');
const registrosTrasladosProductosRoutes = require('./routes/POST/registrosTrasladosProductos');
const productosCreateRoutes = require('./routes/POST/crearProducto');
const productosUpdateRoutes = require('./routes/PUT/editarProducto');
const productosDeleteRoutes = require('./routes/DELETE/eliminarProducto');
const almacenesRoutes = require('./routes/GET/almacenes');
const inventarioRoutes = require('./routes/GET/inventario');
const salidasRoutes = require('./routes/GET/salidas');
const entradasRoutes = require('./routes/GET/entradas');
const trasladosRoutes = require('./routes/GET/traslados');
const obtenerProductosRoutes = require('./routes/GET/obtenerProductos');
const platosRoutes = require('./routes/GET/platos');
const crearPlatoRoutes = require('./routes/POST/crearPlato');
const editarPlatoRoutes = require('./routes/PUT/actualizarPlato');
const eliminarPlatoRoutes = require('./routes/DELETE/eliminarPlato');
const agrefarInsumosRoutes = require('./routes/POST/añadirInsumo');
const eliminarInsumosRoutes = require('./routes/DELETE/eliminarInsumos');
const actualizarInsumosRoutes = require('./routes/PUT/actualizarInsumos');
const reporteEntradaRoutes = require('./routes/REPORTES/reporteEntrada');
const reporteSalidaRoutes = require('./routes/REPORTES/reporteSalida');
const proveedoresRoutes = require('./routes/GET/proveedores');
const informeInventarioExcelRoutes = require('./routes/REPORTES/informeInventarioExcel');
const informeInventarioPDFRoutes = require('./routes/REPORTES/informeInventarioPDF');
const informeGlobalExcelRoutes = require('./routes/REPORTES/reporteGlobalExcel');
const informeGlobalPDFRoutes = require('./routes/REPORTES/reporteGlobalPDF');

// 🚀 Importar las nuevas rutas de autenticación
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');

app.set('io', io);
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

{/* 📌 Rutas de productos Insumos */ }
app.use('/api/productos', productosRoutes);
app.use('/api/productos-con-stock', productosStockRoutes); // Ruta para obtener productos con stock
app.use('/api/productos/buscar', obtenerProductosRoutes); // Ruta para obtener productos por nombre o código
app.use('/api/productos', productosCreateRoutes);
app.use('/api/productos', productosUpdateRoutes);
app.use('/api/productos', productosDeleteRoutes);
app.use('/api/carta/agregar-insumos', agrefarInsumosRoutes);
app.use('/api/carta/eliminar-insumos', eliminarInsumosRoutes);
app.use('/api/carta/actualizar-insumos', actualizarInsumosRoutes);

{/* 📌 Rutas de movimientos */ }

{/* 📌 Rutas de platos */ }
app.use('/api/platos', platosRoutes);
app.use('/api/platos', crearPlatoRoutes);
app.use('/api/platos', editarPlatoRoutes);
app.use('/api/platos', eliminarPlatoRoutes);

{/* 📌 Rutas de carta */ }

{/* 📌 Rutas de alamacenes */ }
app.use('/api/almacenes', almacenesRoutes);

{/* 📌 Rutas de inventario */ }
app.use('/api/inventario', inventarioRoutes);

{/* 📌 Rutas de salidas */ }
app.use('/api/salidas', salidasRoutes);
app.use('/api', detalleSalidaRoutes);

{/* 📌 Rutas de entradas */ }
app.use('/api/entradas', entradasRoutes);

{/* 📌 Rutas de traslados */ }
app.use('/api/traslados', trasladosRoutes);

{/* 📌 Rutas de usuarios */ }

{/* 📌 Rutas de reportes */ }
app.use('/api', reporteEntradaRoutes);
app.use('/api', reporteSalidaRoutes);
app.use('/api', informeInventarioExcelRoutes);
app.use('/api', informeInventarioPDFRoutes);
app.use('/api', informeGlobalExcelRoutes);
app.use('/api', informeGlobalPDFRoutes);

{/* 📌 Rutas de proveedores */ }
app.use('/api', proveedoresRoutes);

{/* 📌 Rutas de inventario */ }

app.use('/api', usuariosRoutes);
app.use('/api', movimientosRoutes);
app.use('/api', stockRoutes);
app.use('/api', detalleEntradaRoutes);
app.use('/api', productosProveedorRoutes);
app.use('/api', alertasStockBajoRoutes);
app.use('/api', informeInventarioRoutes);
app.use('/api', reporteGlobalRoutes);
app.use('/api', reporteXProductoRoutes);
app.use('/api', ajusteInventarioRoutes);
app.use('/api', registrosAjusteInventarioRoutes);
app.use('/api', registrosEntradasProductosRoutes);
app.use('/api', registrosSalidasProductosRoutes);
app.use('/api', registrosTrasladosProductosRoutes);


// 📌 Rutas de Autenticación
app.use('/api/auth', authRoutes); // Para login y autenticación
app.use('/api/users', userRoutes); // Para obtener perfil del usuario autenticado

io.on('connection', (socket) => {
    console.log('✅ Nuevo cliente conectado');

    socket.on('disconnect', () => {
        console.log('❌ Cliente desconectado');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));