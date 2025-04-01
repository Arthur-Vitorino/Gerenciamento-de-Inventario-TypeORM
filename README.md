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

### Na exclusão de categoria:
```typescript
async deletarCategoria(id: number): Promise<void> {
  const categoria = await this.categoriaRepository.findOne({
    where: { id },
    relations: ['produtos']
  });

  if (!categoria) {
    throw new Error('Categoria não encontrada');
  }

  if (categoria.produtos && categoria.produtos.length > 0) {
    throw new Error(
      `Não é possível excluir: ${categoria.produtos.length} produto(s) vinculado(s)`
    );
  }

  await this.categoriaRepository.remove(categoria);
}
```
## 📊 Consultas Customizadas
### Busca de produtos por categoria:
```typescript
async buscarPorCategoria(nomeCategoria: string): Promise<Produto[]> {
  return this.produtoRepository
    .createQueryBuilder('produto')
    .leftJoinAndSelect('produto.categoria', 'categoria')
    .where('categoria.nome LIKE :nome', { nome: `%${nomeCategoria}%` })
    .getMany();
}
```
## ⚙️ Configuração TypeORM (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strictPropertyInitialization": false,
    "forceConsistentCasingInFileNames": true
  }
}
```
## 💡 Dicas de Implementação
### Atualização de Produto:
```typescript
async atualizarProduto(id: number, dados: AtualizarProdutoDto): Promise<Produto> {
  const produto = await this.produtoRepository.findOneBy({ id });
  
  if (!produto) {
    throw new Error('Produto não encontrado');
  }

  // Atualiza apenas os campos fornecidos
  Object.assign(produto, dados);
  produto.dataAtualizacao = new Date();

  return this.produtoRepository.save(produto);
}
```
## Filtros Avançados:
```typescript
async filtrarProdutos(filtros: {
  precoMin?: number;
  precoMax?: number;
  categoriaId?: number;
}): Promise<Produto[]> {
  const query = this.produtoRepository.createQueryBuilder('produto');

  if (filtros.categoriaId) {
    query.andWhere('produto.categoriaId = :categoriaId', { 
      categoriaId: filtros.categoriaId 
    });
  }

  if (filtros.precoMin) {
    query.andWhere('produto.preco >= :precoMin', { 
      precoMin: filtros.precoMin 
    });
  }

  return query.getMany();
}
```
