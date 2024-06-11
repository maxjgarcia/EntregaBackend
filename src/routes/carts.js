/* */

import express from 'express';

const router = express.Router();

let carts = [];

/*La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
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
    res.status(201).json(newCart);
});

/*listado actual de carts */

router.get('/', (req, res) => {
    res.json(carts);
});

/* La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.*/

router.get('/:cid', (req, res) => {
    const cart = carts.find(c => c.id == req.params.cid);
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).send('cart not found');
    }
});

/* La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:*/

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
    res.json(cart);
});

export default router;


