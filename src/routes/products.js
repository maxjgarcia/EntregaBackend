import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../data/products.json');

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

// Escribir js
const writeData = (data) => {
    const dataJSON = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, dataJSON, 'utf-8');
};

let products = readData();

/* La ruta raíz GET / deberá listar todos los productos de la base. (Incluyendo la limitación ?limit del desafío anterior) */
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit) || products.length;
    res.json(products.slice(0, limit));
});

/* La ruta GET /:pid deberá traer sólo el producto con el id proporcionado */
router.get('/:pid', (req, res) => {
    const product = products.find(p => p.id == req.params.pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('product not found');
    }
});

/* La ruta raíz POST / deberá agregar un nuevo producto */
router.post('/', (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).send('All fields are required except thumbnails');
    }

    // Creador de id modificado
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;

    const newProduct = {
        id: newId,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    };

    products.push(newProduct);
    writeData(products);
    res.status(201).json(newProduct);
});

/* La ruta PUT /:pid deberá actualizar un producto */
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
        writeData(products);
        res.json(products.find(p => p.id == pid));
    } else {
        res.status(404).send('product not found');
    }
});

/* La ruta DELETE /:pid deberá eliminar el producto con el pid indicado */
router.delete('/:pid', (req, res) => {
    const index = products.findIndex(p => p.id == req.params.pid);
    if (index !== -1) {
        products.splice(index, 1);
        writeData(products);
        res.status(204).send();
    } else {
        res.status(404).send('product not found');
    }
});

export default router;
