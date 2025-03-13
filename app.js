const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const productosRoutes = require('./routes/GET/productos');
const usuariosRoutes = require('./routes/GET/usuarios');
const movimientosRoutes = require('./routes/GET/movimientos');
const stockRoutes = require('./routes/GET/stock');
const detalleEntradaRoutes = require('./routes/GET/detalleEntrada');
const productosProveedorRoutes = require('./routes/GET/productoProveedor');
const alertasStockBajoRoutes = require('./routes/GET/alertasStockBajo');
const informeInventarioRoutes = require('./routes/GET/informeInventario');
const reporteGlobalRoutes = require('./routes/GET/reporteGlobal');
const reporteXProductoRoutes = require('./routes/GET/reporteXProducto');
const ajusteInventarioRoutes = require('./routes/PUT/ajusteInventario');
const registrosAjusteInventarioRoutes = require('./routes/POST/registrosAjusteInventario');
const registrosEntradasProductosRoutes = require('./routes/POST/registrosEntradasProductos');
const registrosSalidasProductosRoutes = require('./routes/POST/registrosSalidasProductos');
const registrosTrasladosProductosRoutes = require('./routes/POST/registrosTrasladosProductos');
const productosCreateRoutes = require('./routes/POST/crearProducto');
const productosUpdateRoutes = require('./routes/PUT/editarProducto');
const productosDeleteRoutes = require('./routes/DELETE/eliminarProducto');
const almacenesRoutes = require('./routes/GET/almacenes');

// 🚀 Importar las nuevas rutas de autenticación
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

{/* 📌 Rutas de productos */}
app.use('/api/productos', productosRoutes);
app.use('/api/productos', productosCreateRoutes);
app.use('/api/productos', productosUpdateRoutes);
app.use('/api/productos', productosDeleteRoutes);

{/* 📌 Rutas de alamacenes */}
app.use('/api/almacenes', almacenesRoutes);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));