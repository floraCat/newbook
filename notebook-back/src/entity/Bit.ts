import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn} from "typeorm";
import {Point} from './Point';

@Entity()
export class Bit {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    sort: number;

    @Column({ default: '' })
    title: string;

    @Column({ default: 0 })
    attr: number;

    @Column({ default: '' })
    audio: string;

    @Column({ default: '' })
    video: string;

    @Column({ default: '' })
    description: string;

    @Column('text')
    content: string;

    @Column({ default: '' })
    extend: string;

    @Column({ default: '' })
    config: string;

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

    @ManyToOne(type => Point, point => point.bits)
    point: Point;

}
