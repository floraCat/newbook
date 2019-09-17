import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn} from "typeorm";
import {Point} from './Point';

@Entity()
export class Bit {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    keyword: string;

    @Column({ default: null })
    attr: number;

    @Column('text')
    content: string;

    @Column({ default: '' })
    media: string;

    @Column({ default: null })
    level: number;

    @Column({ default: 0 })
    sort: number;

    @Column({ default: null })
    relateBit: number;

    @Column({ default: null })
    relatePoint: number;

    @Column({ default: '' })
    extend: string;

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

    @ManyToOne(type => Point, point => point.bits)
    point: Point;

}
