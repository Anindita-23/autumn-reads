import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks, type Book } from "../services/bookService";
import BookCard from "../components/BookCard";

const Bestsellers: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const allBooks = await getBooks();
        // Sort by some criteria - here we'll use price as a proxy for popularity
        // In a real app, you'd have a "salesCount" or "rating" field
        const sorted = allBooks.sort((a, b) => (b.price || 0) - (a.price || 0));
        setBooks(sorted.slice(0, 12)); // Top 12 bestsellers
      } catch (error) {
        console.error("Error fetching bestsellers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-muted">Loading bestsellers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-text font-medium">Bestsellers</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-text mb-4">
            📚 Bestsellers
          </h1>
          <p className="text-text-muted text-lg max-w-2xl">
            Discover the most popular books loved by readers worldwide. These
            titles have captured hearts and minds, becoming must-reads for book
            enthusiasts everywhere.
          </p>
        </div>
      </div>

      {/* Books Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {books.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-xl font-semibold text-text mb-2">
              No bestsellers yet
            </h3>
            <p className="text-text-muted mb-6">
              Check back soon for our top picks!
            </p>
            <Link
              to="/"
              className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Browse All Books
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-text-muted">
                Showing{" "}
                <span className="font-semibold text-text">{books.length}</span>{" "}
                bestselling titles
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {books
                .filter((book) => book.id)
                .map((book, index) => (
                  <div key={book.id} className="relative">
                    {index < 3 && (
                      <div className="absolute -top-2 -left-2 z-10 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                        #{index + 1}
                      </div>
                    )}
                    <BookCard book={{ ...book, id: book.id! }} />
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Bestsellers;
