import { Entity, Column, PrimaryColumn, BeforeInsert, BaseEntity } from "typeorm";
import { v4 as uuid } from 'uuid';
import bcrypt from "bcryptjs";

@Entity("users")
export class User extends BaseEntity {

    @PrimaryColumn("uuid")
    id: string;

    @Column("varchar", { length: 255 })
    email: string;

    @Column("text")
    password: string;

    @Column("boolean", { default: false })
    confirmed: boolean;

    @BeforeInsert()
    addId() {
        this.id = uuid();
    }

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}
