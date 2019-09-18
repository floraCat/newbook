import {Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne} from "typeorm";
import { Bit } from "./Bit";
import { Line } from "./Line";

@Entity()
export class Point {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    sort: number;

    @Column()
    title: string;

    @Column({ default: 0 })
    attr: number;

    @Column({ default: '' })
    description: string;

    @Column('text')
    extend: string;

    @Column({ default: '' })
    config: string;

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

    @ManyToOne(type => Line, line => line.points)
    line: Line;

    @OneToMany(type => Bit, bit => bit.point)
    bits: Bit[];

}
