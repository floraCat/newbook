import {Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from "typeorm";
import { LogArticle } from "./LogArticle";

@Entity()
export class LogTopic {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    pid: string;

    @Column({ default: 0 })
    sort: number;

    @Column({ default: '' })
    title: string;
    
    @Column({ default: '' })
    createdAt: string;

    @Column({ default: '' })
    updatedAt: string;

    @OneToMany(type => LogArticle, article => article.topic)
    articles: LogArticle[];

}
