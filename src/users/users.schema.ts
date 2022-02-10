// users.schema.ts
import { Field, ObjectType, InputType } from "type-graphql"

@ObjectType()
export class User {
  @Field()
  id!: number

  @Field()
  name!: string

  @Field()
  email!: string
}

@InputType()
export class UserInput implements Pick<User, "name" | "email"> {
  @Field()
  name!: string

  @Field()
  email!: string
}