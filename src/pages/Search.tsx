import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getBooks, type Book } from "../services/bookService";
import BookCard from "../components/BookCard";

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [allBooks, setAllBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const fetchedBooks = await getBooks();
        setAllBooks(fetchedBooks);

        if (query.trim()) {
          const searchLower = query.toLowerCase();
          const filtered = fetchedBooks.filter(
            (book) =>
              book.title?.toLowerCase().includes(searchLower) ||
              book.author?.toLowerCase().includes(searchLower) ||
              book.description?.toLowerCase().includes(searchLower) ||
              book.genre?.toLowerCase().includes(searchLower)
          );
          setBooks(filtered);
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error("Error searching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-muted">Searching...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-text font-medium">Search</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-text mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-text-muted text-lg">
              Showing results for "
              <span className="text-primary font-medium">{query}</span>"
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {!query.trim() ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-text mb-2">
              Enter a search term
            </h3>
            <p className="text-text-muted mb-6">
              Search for books by title, author, or genre
            </p>
            <Link
              to="/"
              className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Browse All Books
            </Link>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-xl font-semibold text-text mb-2">
              No results found
            </h3>
            <p className="text-text-muted mb-6">
              We couldn't find any books matching "{query}"
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                Browse All Books
              </Link>
              <Link
                to="/categories"
                className="inline-block bg-surface text-text px-6 py-3 rounded-xl font-medium hover:bg-primary/10 transition-colors border border-primary/20"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-text-muted">
                Found{" "}
                <span className="font-semibold text-text">{books.length}</span>
                {books.length === 1 ? " book" : " books"}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {books
                .filter((book) => book.id)
                .map((book) => (
                  <BookCard key={book.id} book={{ ...book, id: book.id! }} />
                ))}
            </div>
          </>
        )}

        {/* Suggestions when no results */}
        {query.trim() && books.length === 0 && allBooks.length > 0 && (
          <div className="mt-16">
            <h3 className="font-serif text-2xl font-bold text-text mb-6">
              You might like these
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {allBooks
                .filter((book) => book.id)
                .slice(0, 6)
                .map((book) => (
                  <BookCard key={book.id} book={{ ...book, id: book.id! }} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
