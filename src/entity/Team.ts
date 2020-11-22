import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {UserToTeam} from "./UserToTeam";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity({name: 'teams'})
export class Team extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field()
    @Column({nullable: false})
    name!: string

    @Field()
    @Column({nullable: false})
    description!: string

    @Field(() => String, {nullable: true})
    @Column({length: "60", nullable: true, type: "varchar"})
    image!: string | null

    @Column({length: 100, nullable: true, type: "varchar"})
    password!: string | null

    @Column({length: 30, nullable: true, type: "varchar"})
    salt!: string | null

    @Field()
    isPublic!: boolean

    @Field(() => [UserToTeam])
    @OneToMany(() => UserToTeam, users => users.team)
    users!: UserToTeam[]
}
