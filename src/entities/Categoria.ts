import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Produto } from "./Produto";
import { IsNotEmpty, Length } from "class-validator";

@Entity()
export class Categoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty({ message: "O nome da categoria é obrigatório" })
    @Length(2, 50, { message: "O nome deve ter entre 2 e 50 caracteres" })
    nome: string;

    @Column()
    @IsNotEmpty({ message: "A descrição da categoria é obrigatória" })
    @Length(10, 255, { message: "A descrição deve ter entre 10 e 255 caracteres" })
    descricao: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dataCriacao: Date;

    @Column({ type: 'timestamp', nullable: true })
    dataAtualizacao: Date;

    @OneToMany(() => Produto, produto => produto.categoria, {
        onDelete: 'RESTRICT' // IMPEDE DELETAR SE TIVEREM PRODUTOS ASSOCIADOS
    })
    produtos: Produto[];
}