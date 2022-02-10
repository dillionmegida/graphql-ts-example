import { buildSchema } from "graphql"
import express from "express"
import { graphqlHTTP } from "express-graphql"

const users = [
  { id: 1, name: "John Doe", email: "johndoe@gmail.com" },
  { id: 2, name: "Jane Doe", email: "janedoe@gmail.com" },
  { id: 3, name: "Mike Doe", email: "mikedoe@gmail.com" },
]

const schema = buildSchema(`
    input UserInput {
        email: String!
        name: String!
    }

    type User {
        id: Int!
        name: String!
        email: String!
    }

    type Mutation {
        createUser(input: UserInput): User
        updateUser(id: Int!, input: UserInput): User
    }

    type Query {
        getUser(id: String): User
        getUsers: [User]
    }
`)

type User = {
  id: number
  name: string
  email: string
}

type UserInput = Pick<User, "email" | "name">

const getUser = (args: { id: number }): User | undefined =>
  users.find((u) => u.id === args.id)

const getUsers = (): User[] => users

const createUser = (args: { input: UserInput }): User => {
  const user = {
    id: users.length + 1,
    ...args.input,
  }
  users.push(user)
  return user
}

const updateUser = (args: { user: User }): User => {
  const index = users.findIndex((u) => u.id === args.user.id)
  const targetUser = users[index]
  if (targetUser) users[index] = args.user
  return targetUser
}

const root = {
  getUser,
  getUsers,
  createUser,
  updateUser,
}

var app = express()
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
)

const PORT = 8000

app.listen(PORT)
console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`)
