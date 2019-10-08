import {Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from "typeorm";
import { LogTopic } from "./LogTopic";

@Entity()
export class LogArticle {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    sort: number;

    @Column({ default: '' })
    title: string;

    @Column({ default: null })
    class: number; // 类别

    @Column('text')
    content: string = '';

    @Column({ default: '' })
    createdAt: string;

    @Column({ default: '' })
    updatedAt: string;

    @ManyToOne(type => LogTopic, topic => topic.articles)
    topic: LogTopic;

}
