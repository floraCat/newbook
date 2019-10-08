import {Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from "typeorm";
import { Point } from "./Point";
import { Plane } from "./Plane";

@Entity()
export class Line {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    pid: string;

    @Column({ default: 0 })
    sort: number;

    @Column({ default: '' })
    title: string;

    @Column({ default: '' })
    description: string;

    @Column('text')
    extend: string;

    @Column({ default: '' })
    createdAt: string;

    @Column({ default: '' })
    updatedAt: string;

    @ManyToOne(type => Plane, plane => plane.lines)
    plane: Plane;

    @OneToMany(type => Point, point => point.line)
    points: Point[];

}
