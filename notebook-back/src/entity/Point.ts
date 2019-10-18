import {Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from "typeorm";
import { Bit } from "./Bit";
import { Line } from "./Line";

@Entity()
export class Point {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    pid: string;

    @Column({ default: 0 })
    sort: number;

    @Column({ default: '' })
    title: string;

    @Column({ default: null })
    attr: number;

    @Column({ default: false})
    recom: boolean;

    @Column({ default: '' })
    description: string;

    @Column('text')
    extend: string;

    @Column({ default: '' })
    subFieldSet: string;

    @Column({ default: '' })
    createdAt: string;

    @Column({ default: '' })
    updatedAt: string;

    @ManyToOne(type => Line, line => line.points)
    line: Line;

    @OneToMany(type => Bit, bit => bit.point)
    bits: Bit[];

}
