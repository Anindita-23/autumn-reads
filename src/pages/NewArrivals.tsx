import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks, type Book } from "../services/bookService";
import BookCard from "../components/BookCard";

const NewArrivals: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const allBooks = await getBooks();
        // Sort by createdAt date, newest first
        const sorted = allBooks.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        setBooks(sorted.slice(0, 12)); // Latest 12 books
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Helper to format relative time
  const getRelativeTime = (dateString?: string) => {
    if (!dateString) return "Recently added";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Added today";
    if (diffDays === 1) return "Added yesterday";
    if (diffDays < 7) return `Added ${diffDays} days ago`;
    if (diffDays < 30) return `Added ${Math.floor(diffDays / 7)} weeks ago`;
    return `Added ${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-muted">Loading new arrivals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-secondary/10 via-primary/5 to-accent/10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-text font-medium">New Arrivals</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-green-500/20 text-green-700 rounded-full text-sm font-medium">
              ✨ Fresh Picks
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-text mb-4">
            New Arrivals
          </h1>
          <p className="text-text-muted text-lg max-w-2xl">
            Be the first to explore our latest additions. Fresh titles, new
            voices, and exciting stories waiting to be discovered.
          </p>
        </div>
      </div>

      {/* Books Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {books.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🆕</div>
            <h3 className="text-xl font-semibold text-text mb-2">
              No new arrivals yet
            </h3>
            <p className="text-text-muted mb-6">
              New books will appear here as they're added!
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
                newest titles
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {books
                .filter((book) => book.id)
                .map((book, index) => (
                  <div key={book.id} className="relative">
                    {index === 0 && (
                      <div className="absolute -top-2 -right-2 z-10 px-2 py-1 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg">
                        NEW
                      </div>
                    )}
                    <div className="group">
                      <BookCard book={{ ...book, id: book.id! }} />
                      <p className="text-xs text-text-muted mt-2 text-center">
                        {getRelativeTime(book.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewArrivals;
