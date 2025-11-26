import React, { useEffect, useState } from "react";
import { getBooks, Book } from "../services/bookService";

const BooksList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getBooks();
        if (mounted) setBooks(data || []);
      } catch (err: any) {
        if (mounted) setError(err?.message || "Failed to load books");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="py-8">Loading books...</div>;
  if (error) return <div className="py-8 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto max-w-screen-lg px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6">Books</h1>
      {books.length === 0 && (
        <p className="text-base text-neutral-700">No books found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {books.map((b) => (
          <article
            key={b.id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col"
          >
            {b.coverBase64 ? (
              <img
                src={b.coverBase64}
                alt={b.title}
                className="w-full h-48 object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-48 bg-neutral-100 rounded-md flex items-center justify-center text-neutral-400">
                No cover
              </div>
            )}

            <div className="mt-3 flex-1">
              <h2 className="text-lg font-medium text-neutral-800">
                {b.title}
              </h2>
              <p className="text-base text-neutral-600">by {b.author}</p>
              {b.description && (
                <p className="mt-2 text-neutral-700">{b.description}</p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              {b.textContent ? (
                <a href={`/reader/${b.id}`} className="inline-block">
                  <button className="px-3 py-2 rounded-md bg-neutral-800 text-white text-base">
                    View Text
                  </button>
                </a>
              ) : b.pdfURL ? (
                <a href={b.pdfURL} target="_blank" rel="noopener noreferrer">
                  <button className="px-3 py-2 rounded-md bg-neutral-800 text-white text-base">
                    Open / Download
                  </button>
                </a>
              ) : (
                <button
                  disabled
                  className="px-3 py-2 rounded-md bg-neutral-100 text-neutral-400 text-base"
                >
                  No file
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BooksList;
