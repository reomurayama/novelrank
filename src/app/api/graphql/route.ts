import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import { MongoClient } from "mongodb";

// 環境変数のチェック
if (!process.env.MONGODB_URI) {
  throw new Error("環境変数 MONGODB_URI が設定されていません");
}

// MongoDB クライアントの初期化
const client = new MongoClient(process.env.MONGODB_URI);

// `client.db()` の引数に明示的にデータベース名を指定
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

// **Next.js 15 用に `context` を削除**
export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
}
