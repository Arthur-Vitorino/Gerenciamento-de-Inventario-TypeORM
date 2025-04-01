import express from 'express';
import {
    createCategoria,
    getAllCategorias,
    getCategoriaById,
    updateCategoria,
    deleteCategoria,
    buscarCategoriaPorNome
} from '../controllers/categoria.controller';

const router = express.Router();

router.post('/', createCategoria);
router.get('/', getAllCategorias);
router.get('/:id', getCategoriaById);
router.put('/:id', updateCategoria);
router.delete('/:id', deleteCategoria);
router.get('/buscar/nome', buscarCategoriaPorNome);

export default router;