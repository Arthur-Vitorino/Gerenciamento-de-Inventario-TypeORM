import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Categoria } from "./Categoria";
import { IsNotEmpty, IsNumber, Min, Max, IsPositive, Length } from "class-validator";

@Entity()
export class Produto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty({ message: "O nome do produto é obrigatório" })
    @Length(2, 100, { message: "O nome deve ter entre 2 e 100 caracteres" })
    nome: string;

    @Column()
    @IsNotEmpty({ message: "A descrição do produto é obrigatória" })
    @Length(10, 500, { message: "A descrição deve ter entre 10 e 500 caracteres" })
    descricao: string;

    @Column('decimal', { precision: 10, scale: 2 })
    @IsNumber({}, { message: "O preço deve ser um número" })
    @IsPositive({ message: "O preço deve ser positivo" })
    @Min(0.01, { message: "O preço mínimo é 0.01" })
    preco: number;

    @Column('int')
    @IsNumber({}, { message: "A quantidade deve ser um número" })
    @IsPositive({ message: "A quantidade deve ser positiva" })
    @Min(1, { message: "A quantidade mínima é 1" })
    quantidade: number;


    @ManyToOne(() => Categoria, { nullable: false })
    @JoinColumn({ name: 'categoriaId' })
    categoria: Categoria;

    @Column()
    categoriaId: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dataCriacao: Date;

    @Column({ type: 'timestamp', nullable: true })
    dataAtualizacao: Date;
}