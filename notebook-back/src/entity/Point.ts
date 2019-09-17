import {Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne} from "typeorm";
import { Bit } from "./Bit";
import { Line } from "./Line";

@Entity()
export class Point {

    @PrimaryGeneratedColumn()
    id: number;

    // @Column()
    // sid: number;

    @Column()
    title: string;

    @Column({ default: '' })
    description: string;

    @Column({ default: 0 })
    sort: number;

    @Column('text')
    extend: string;

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

    // @Column()
    // lineId: number;

    @ManyToOne(type => Line, line => line.points)
    line: Line;

    @OneToMany(type => Bit, bit => bit.point)
    bits: Bit[];

}
