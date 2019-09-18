import {Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne} from "typeorm";
import { Line } from "./Line";

@Entity()
export class Plane {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    sort: number;

    @Column()
    title: string;

    @Column({ default: 1 }) // 1:技术，2:生活
    solid: number;

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

    @OneToMany(type => Line, line => line.plane)
    lines: Line[];

}
