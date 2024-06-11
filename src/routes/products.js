import express from 'express';
const router = express.Router();

let products = [];


/* La ruta raíz GET / deberá listar todos los productos de la base. (Incluyendo la limitación ?limit del desafío anterio */
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit) || products.length;
    res.json(products.slice(0, limit));
});


/*La ruta GET /:pid deberá traer sólo el producto con el id proporcionado*/

router.get('/:pid', (req, res) => {
    const product = products.find(p => p.id == req.params.pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('product not found');
    }
});

/* La ruta raíz POST / deberá agregar un nuevo producto con los campos:
id: Number/String 
title:String,
description:String
code:String
price:Number
status:Boolean
stock:Number
category:String
thumbnails:Array de Strings
Status es true por defecto
odos los campos son obligatorios, a excepción de thumbnails
*/

router.post('/', (req, res) => {
    const { id, title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
    if (!id || !title || !description || !code || !price || !stock || !category) {
        return res.status(400).send('All fields are required except thumbnails');
    }
    const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 1,
        title,
        description,
        code, price,
        status,
        stock,
        category,
        thumbnails
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

/*La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body. NUNCA se debe actualizar o eliminar el id al momento de hacer dicha actualización.*/
router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const { id, ...updateData } = req.body;
    let productFound = false;

    products = products.map(product => {
        if (product.id == pid) {
            productFound = true;
            return { ...product, ...updateData };
        }
        return product;
    });

    if (productFound) {
        res.json(products.find(p => p.id == pid));
    } else {
        res.status(404).send('product not found');
    }
});

/*La ruta DELETE /:pid deberá eliminar el producto con el pid indicado*/
router.delete('/:pid', (req, res) => {
    const index = products.findIndex(p => p.id == req.params.pid);
    if (index !== -1) {
        products.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('product not found');
    }
});

export default router;


