import express from 'express';
import {
    createProduto,
    getAllProdutos,
    getProdutoById,
    updateProduto,
    deleteProduto,
    buscarProduto
} from '../controllers/produto.controller';

const router = express.Router();

router.post('/', createProduto);
router.get('/', getAllProdutos);
router.get('/:id', getProdutoById);
router.put('/:id', updateProduto);
router.delete('/:id', deleteProduto);
router.get('/buscar', buscarProduto);
// GET /produtos/buscar?tipo=id&valor=1
// GET /produtos/buscar?tipo=nome&valor=Notebook
// GET /produtos/buscar?tipo=categoria&valor=Eletrônicos

export default router;