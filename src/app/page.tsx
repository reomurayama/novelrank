"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [books, setBooks] = useState<{ title: string; link: string }[]>([]);

  useEffect(() => {
    fetch("/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "{ books { title link } }" }),
    })
      .then((res) => res.json())
      .then((data) => setBooks(data.data.books));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">📚 小説ランキング</h1>
      <ul className="mt-4">
        {books.map((book, index) => (
          <li key={index} className="p-4 border-b">
            <a
              href={book.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              {book.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
