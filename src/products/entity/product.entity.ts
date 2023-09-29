import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class Product{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column()
    description: string;

    @Column()
    category: string

    @Column()
    image: string
    
    @Column('json') // Define a JSON column to store the rating.
    rating: { rate: number; count: number };

}