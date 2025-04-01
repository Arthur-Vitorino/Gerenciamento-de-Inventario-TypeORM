import { Request, Response } from "express";
import connectDB from "../typeorm";
import { Produto } from "../entities/Produto";
import { Categoria } from "../entities/Categoria";
import { validate } from 'class-validator';

// CREATE
export const createProduto = async (req: Request, res: Response): Promise<void> => {
    try {
        const produtoRepository = connectDB.getRepository(Produto);
        const categoriaRepository = connectDB.getRepository(Categoria);
        
        // Verifica se a categoria existe
        const categoria = await categoriaRepository.findOne({ 
            where: { id: req.body.categoriaId }
        });
        
        if (!categoria) {
            res.status(404).json({ error: "Categoria não encontrada" });
            return;
        }

        const novoProduto = produtoRepository.create({
            ...req.body,
            categoria
        });

        // Validação antes de salvar
        const errors = await validate(novoProduto);
        if (errors.length > 0) {
            res.status(400).json({ errors: errors.map(e => e.constraints) });
            return;
        }

        await produtoRepository.save(novoProduto);
        res.status(201).json(novoProduto);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
};

// READ ALL
export const getAllProdutos = async (req: Request, res: Response): Promise<void> => {
    try {
        const produtoRepository = connectDB.getRepository(Produto);
        const produtos = await produtoRepository.find({ 
            relations: ['categoria'] 
        });
        res.status(200).json(produtos);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'internal server error' });
    }
};

// READ ONE
export const getProdutoById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const produtoRepository = connectDB.getRepository(Produto);
        
        const produto = await produtoRepository.findOne({ 
            where: { id: parseInt(id) },
            relations: ['categoria']
        });

        if (!produto) {
            res.status(404).json({ error: "Produto não encontrado" });
            return;
        }

        res.status(200).json(produto);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'internal server error' });
    }
};

// UPDATE
export const updateProduto = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const produtoRepository = connectDB.getRepository(Produto);
        
        const produto = await produtoRepository.findOne({ 
            where: { id: parseInt(id) },
            relations: ['categoria']
        });

        if (!produto) {
            res.status(404).json({ error: "Produto não encontrado" });
            return;
        }

        // Atualiza categoria se fornecido no body
        if (req.body.categoriaId) {
            const categoriaRepository = connectDB.getRepository(Categoria);
            const categoria = await categoriaRepository.findOne({ 
                where: { id: req.body.categoriaId }
            });
            
            if (!categoria) {
                res.status(404).json({ error: "Categoria não encontrada" });
                return;
            }
            produto.categoria = categoria;
        }

        produtoRepository.merge(produto, req.body);
        const updatedProduto = await produtoRepository.save(produto);
        
        res.status(200).json(updatedProduto);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// DELETE
export const deleteProduto = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const produtoRepository = connectDB.getRepository(Produto);
        
        const produto = await produtoRepository.findOne({ 
            where: { id: parseInt(id) }
        });

        if (!produto) {
            res.status(404).json({ error: 'Produto não encontrado' });
            return;
        }
        
        await produtoRepository.remove(produto);
        res.status(204).end();
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// BUSCA
export const buscarProduto = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tipo, valor } = req.query;
        const produtoRepository = connectDB.getRepository(Produto);
        
        if (!tipo || !valor) {
            res.status(400).json({ error: 'Parâmetros "tipo" e "valor" são obrigatórios' });
            return;
        }

        let produtos;
        
        if (tipo === 'id') {
            const produto = await produtoRepository.findOne({ 
                where: { id: parseInt(valor as string) },
                relations: ['categoria']
            });
            
            if (!produto) {
                res.status(404).json({ error: 'Produto não encontrado' });
                return;
            }
            
            res.status(200).json(produto);
            return;
        }
        
        if (tipo === 'nome') {
            produtos = await produtoRepository.find({ 
                where: { nome: valor as string },
                relations: ['categoria']
            });
        } 
        else if (tipo === 'categoria') {
            produtos = await produtoRepository
                .createQueryBuilder('produto')
                .leftJoinAndSelect('produto.categoria', 'categoria')
                .where('categoria.nome = :nome', { nome: valor })
                .getMany();
        } 
        else {
            res.status(400).json({ error: 'Tipo de busca inválido' });
            return;
        }

        res.status(200).json(produtos);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};  