/*Desarrollar el servidor basado en Node.JS y express, que escuche en el puerto 8080 y disponga de dos grupos de rutas: /products y /carts.
 Dichos endpoints estarán implementados con el router de express, con las siguientes especificaciones:
 */

import express from 'express';

const app = express();
const PORT = 8080;
app.use(express.json());

import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
    res.send('Primer Entrega Backend');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


