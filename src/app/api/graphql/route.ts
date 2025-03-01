import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag"; // 修正: `graphql-tag` から `gql` をインポート
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
export { handler as GET, handler as POST };
