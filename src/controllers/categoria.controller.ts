import { Request, Response } from "express";
import connectDB from "../typeorm";
import { Categoria } from "../entities/Categoria";
import { validate } from 'class-validator';

// CREATE
export const createCategoria = async (req: Request, res: Response): Promise<void> => {
    try {
        const categoriaRepository = connectDB.getRepository(Categoria);
        const novaCategoria = categoriaRepository.create(req.body);
        
        // Validação antes de salvar
        const errors = await validate(novaCategoria);
        if (errors.length > 0) {
            res.status(400).json({ errors: errors.map(e => e.constraints) });
            return;
        }

        await categoriaRepository.save(novaCategoria);
        res.status(201).json(novaCategoria);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar categoria' });
    }
};

// READ ALL
export const getAllCategorias = async (req: Request, res: Response): Promise<void> => {
    try {
        const categoriaRepository = connectDB.getRepository(Categoria);
        const categorias = await categoriaRepository.find();
        res.status(200).json(categorias);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'internal server error' });
    }
};

// READ ONE
export const getCategoriaById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const categoriaRepository = connectDB.getRepository(Categoria);
        
        const categoria = await categoriaRepository.findOne({ 
            where: { id: parseInt(id) }
        });

        if (!categoria) {
            res.status(404).json({ error: "Categoria não encontrada" });
            return;
        }

        res.status(200).json(categoria);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'internal server error' });
    }
};

// UPDATE
export const updateCategoria = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const categoriaRepository = connectDB.getRepository(Categoria);
        
        const categoria = await categoriaRepository.findOne({ 
            where: { id: parseInt(id) }
        });

        if (!categoria) {
            res.status(404).json({ error: "Categoria não encontrada" });
            return;
        }

        categoriaRepository.merge(categoria, req.body);
        categoria.dataAtualizacao = new Date(); // Atualiza a data de modificação
        
        const updatedCategoria = await categoriaRepository.save(categoria);
        res.status(200).json(updatedCategoria);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// DELETE
export const deleteCategoria = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const categoriaRepository = connectDB.getRepository(Categoria);
        
        const categoria = await categoriaRepository.findOne({ 
            where: { id: parseInt(id) },
            relations: ['produtos'] // Carrega os produtos relacionados
        });

        if (!categoria) {
            res.status(404).json({ error: 'Categoria não encontrada' });
            return;
        }

        // Verifica se existem produtos vinculados
        if (categoria.produtos && categoria.produtos.length > 0) {
            res.status(400).json({ 
                error: 'Não é possível excluir categoria com produtos vinculados',
                produtos: categoria.produtos.map(p => p.id)
            });
            return;
        }
        
        await categoriaRepository.remove(categoria);
        res.status(204).end();
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// BUSCA POR NOME
export const buscarCategoriaPorNome = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nome } = req.query;
        const categoriaRepository = connectDB.getRepository(Categoria);
        
        if (!nome) {
            res.status(400).json({ error: 'Parâmetro "nome" é obrigatório' });
            return;
        }

        const categorias = await categoriaRepository.find({ 
            where: { nome: nome as string }
        });

        res.status(200).json(categorias);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}; 