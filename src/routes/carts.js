import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../data/carts.json');

// Leer json
const readData = () => {
    try {
        const dataStorage = fs.readFileSync(filePath, 'utf-8');
        const dataJSON = dataStorage.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        return [];
    }
};

// Escribir json
const writeData = (data) => {
    const dataJSON = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, dataJSON, 'utf-8');
};

let carts = readData();

/* La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
Id:Number/String 
products: Array que contendrá objetos que representen cada producto
*/
router.post('/', (req, res) => {
    const { id, products = [] } = req.body;
    if (!id) {
        return res.status(400).send('ID is required');
    }
    const newCart = { id, products };
    carts.push(newCart);
    writeData(carts); // Save the updated carts array
    res.status(201).json(newCart);
});

/* Listado actual de carts */
router.get('/', (req, res) => {
    res.json(carts);
});

/* La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados. */
router.get('/:cid', (req, res) => {
    const cart = carts.find(c => c.id == req.params.cid);
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).send('cart not found');
    }
});

/* La ruta POST /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato: */
router.post('/:cid/product/:pid', (req, res) => {
    const cart = carts.find(c => c.id == req.params.cid);
    if (!cart) {
        return res.status(404).send('cart not found');
    }

    const productIndex = cart.products.findIndex(p => p.product == req.params.pid);
    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
    } else {
        cart.products.push({ product: req.params.pid, quantity: 1 });
    }
    writeData(carts);
    res.json(cart);
});

export default router;
