import {Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne} from "typeorm";
import { Line } from "./Line";

@Entity()
export class Plane {

    @PrimaryGeneratedColumn()
    id: number;

    // @Column()
    // sid: number;

    @Column({ default: 0 })
    sort: number;

    @Column({ length: 100 })
    title: string;

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

    @OneToMany(type => Line, line => line.plane)
    lines: Line[];

}
