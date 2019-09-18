import {Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne} from "typeorm";
import { Point } from "./Point";
import { Plane } from "./Plane";

@Entity()
export class Line {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    sort: number;

    @Column()
    title: string;

    @Column({ default: '' })
    description: string;

    @Column('text')
    extend: string;

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

    @ManyToOne(type => Plane, plane => plane.lines)
    plane: Plane;

    @OneToMany(type => Point, point => point.line)
    points: Point[];

}
