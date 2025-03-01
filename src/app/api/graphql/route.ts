import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB 接続
const client = new MongoClient(process.env.MONGODB_URI!);
await client.connect();
const db = client.db("novelrank");

// GraphQL スキーマ
const typeDefs = gql`
  type Book {
    title: String
    link: String
  }
  type Query {
    books: [Book]
  }
`;

// リゾルバー
const resolvers = {
  Query: {
    books: async () => {
      return await db.collection("books").find({}).toArray();
    },
  },
};

// Apollo Server の設定
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server);

// **修正: Next.js 15 で `RouteContext` を使わない**
export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
}
