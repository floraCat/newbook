import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {Point} from './Point';

@Entity()
export class Bit {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    sort: number;

    @Column({ default: '' })
    title: string;

    @Column({ default: '' })
    subtitle: string; // 副标题

    @Column({ default: null })
    attr: number; // 属性

    @Column({ default: null })
    grade: number; // 等级

    @Column({ default: null })
    class: number; // 类别

    @Column({ default: false})
    recom: boolean; // 推荐

    @Column({ default: '' })
    keyword: string;

    @Column({ default: '' })
    pic: string;

    @Column({ default: '' })
    audio: string;

    @Column({ default: '' })
    video: string;

    @Column('text')
    description: string;

    @Column('text')
    content: string;

    @Column('text')
    extend: string;

    @Column({ default: '' })
    createdAt: string;

    @Column({ default: '' })
    updatedAt: string;

    @ManyToOne(type => Point, point => point.bits)
    point: Point;

}
