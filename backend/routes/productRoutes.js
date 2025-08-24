import express from 'express'
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from '../controller/productController.js';

const router = express.Router();

// get all products
router.get('/', getProducts)

// get specific product
router.get('/:id', getProduct)

// create products
router.post('/', createProduct)

// update product
router.put('/:id', updateProduct)

// delete product
router.delete('/:id', deleteProduct)

export default router