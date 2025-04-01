import { DataSource } from "typeorm"; 
import { Produto } from "./entities/Produto"; 
import { Categoria } from "./entities/Categoria";

const connectDB = new DataSource({
    type: "mysql",
    host: "localhost", 
    port: 3306,
    username: "root",
    password: "123123123",
    database: "inventario_db",
    entities: [Produto, Categoria],
    synchronize: true,
    logging: true // Mostra logs das queries
});

export default connectDB;