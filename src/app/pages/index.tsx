import { useState, useEffect } from "react";

type Book = {
  title: string;
  link: string;
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `query { books { title link } }`,
          }),
        });

        const result = await response.json();
        if (response.ok) {
          setBooks(result.data.books);
        } else {
          setError("データの取得に失敗しました");
        }
      } catch (err) {
        setError("ネットワークエラーが発生しました");
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  return (
    <div>
      <h1>📚 小説ランキング</h1>
      {loading && <p>読み込み中...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {books.map((book, index) => (
          <li key={index}>
            <a href={book.link} target="_blank" rel="noopener noreferrer">
              {book.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
