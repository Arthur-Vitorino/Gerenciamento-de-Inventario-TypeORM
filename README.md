# Notas Técnicas - Gestão de Categorias e Produtos

## 🏷️ Entidade Categoria
```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Produto } from "./Produto";

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  nome: string;

  @Column('text')
  descricao: string;

  @Column({ name: 'data_criacao', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataCriacao: Date;

  @Column({ name: 'data_atualizacao', type: 'timestamp', nullable: true })
  dataAtualizacao: Date | null;

  @OneToMany(() => Produto, produto => produto.categoria)
  produtos: Produto[];
}
```
## 📦 Entidade Produto
```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Categoria } from "./Categoria";

@Entity()
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column('text')
  descricao: string;

  @Column('decimal', { precision: 10, scale: 2 })
  preco: number;

  @Column('int')
  quantidade: number;

  @ManyToOne(() => Categoria, categoria => categoria.produtos)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @Column({ name: 'data_criacao', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataCriacao: Date;

  @Column({ name: 'data_atualizacao', type: 'timestamp', nullable: true })
  dataAtualizacao: Date | null;
}
```
## 🔄 Relacionamento TypeORM
### Configuração do relacionamento 1:N (Categoria → Produtos)
```typescript
// Na entidade Categoria:
@OneToMany(() => Produto, produto => produto.categoria)
produtos: Produto[];

// Na entidade Produto:
@ManyToOne(() => Categoria, categoria => categoria.produtos)
@JoinColumn({ name: 'categoria_id' })
categoria: Categoria;
```
## 🛠️ Validações com class-validator
```typescript
import { IsNotEmpty, Length, IsPositive, IsNumber } from "class-validator";

export class CriarProdutoDto {
  @IsNotEmpty()
  @Length(3, 100)
  nome: string;

  @IsNotEmpty()
  @Length(10, 500)
  descricao: string;

  @IsNumber()
  @IsPositive()
  preco: number;

  @IsNumber()
  @IsPositive()
  quantidade: number;

  @IsNumber()
  categoriaId: number;
}
```
## 🚦 Regras de Negócio Implementadas










