import {
    createForum,
    getForums,
    getForum,
    updateForum,
    deleteForum,
    dislikeForum,
    likeForum
} from '../controllers/forum.js';

import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
const router = express.Router();

router.post('/', verifyToken, createForum);
router.get('/', getForums);
router.get('/:id', getForum);
router.patch('/:id', verifyToken, updateForum);
router.delete('/:id', verifyToken, deleteForum);
router.patch('/:id/likeForum', verifyToken, likeForum);
router.patch('/:id/dislikeForum', verifyToken, dislikeForum);

export default router;