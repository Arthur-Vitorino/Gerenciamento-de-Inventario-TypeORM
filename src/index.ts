import 'reflect-metadata';
import express, { Express } from 'express';
import dotenv from 'dotenv';
import connectDB from './typeorm';
import produtoRoutes from './routes/produto.routes'; 
import categoriaRoutes from './routes/categoria.routes'; 

// Carrega variáveis de ambiente
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Inicialização da conexão com o banco
connectDB.initialize()
    .then(() => {
        console.log('Banco de dados conectado com sucesso');
        
        // Middlewares
        app.use(express.json());
        
        // Rotas
        app.use('/produtos', produtoRoutes);
        app.use('/categorias', categoriaRoutes);

        // Inicia o servidor
        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });
    })
    .catch((error) => {
        console.error('Erro ao conectar ao banco de dados:', error);
        process.exit(1); // Encerra o processo com erro
    });

// Export para testes
export default app;