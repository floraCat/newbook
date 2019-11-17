import {Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from "typeorm";
import { Line } from "./Line";

@Entity()
export class Plane {

    @PrimaryGeneratedColumn()
    id: number;

    // @Column({ default: '' })
    // pid: string;

    @Column({ default: 0 })
    sort: number;

    @Column({ default: '' })
    title: string;

    @Column({ default: 0 }) // 1:技术，2:生活，3:卡片
    solid: number;
    
    @Column({ default: '' })
    createdAt: string;

    @Column({ default: '' })
    updatedAt: string;

    @OneToMany(type => Line, line => line.plane)
    lines: Line[];

}
