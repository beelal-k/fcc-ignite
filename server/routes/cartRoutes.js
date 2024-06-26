import {
    addItemToCart,
    getCartItem,
    getCartItems,
    removeItemFromCart,
    updateCartItem
} from '../controllers/cartItem.js';

import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, addItemToCart);
router.get('/', verifyToken, getCartItems);
router.get('/:id', verifyToken, getCartItem);
router.patch('/:id', verifyToken, updateCartItem);
router.delete('/:id', verifyToken, removeItemFromCart);

export default router;