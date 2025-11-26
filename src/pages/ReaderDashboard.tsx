import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getBooks, type Book } from "../services/bookService";
import BookCard from "../components/BookCard";

// Define available categories with metadata
const CATEGORIES = [
  { id: "all", name: "All Books", icon: "📚" },
  { id: "fiction", name: "Fiction", icon: "📖" },
  { id: "non-fiction", name: "Non-Fiction", icon: "📘" },
  { id: "mystery", name: "Mystery & Thriller", icon: "🔍" },
  { id: "romance", name: "Romance", icon: "💕" },
  { id: "sci-fi", name: "Science Fiction", icon: "🚀" },
  { id: "fantasy", name: "Fantasy", icon: "🐉" },
  { id: "horror", name: "Horror", icon: "👻" },
  { id: "classics", name: "Classics", icon: "🏛️" },
];

const ReaderDashboard: React.FC = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("all");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const fetchedBooks = await getBooks();
        setBooks(fetchedBooks);
        setFilteredBooks(fetchedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    if (selectedGenre === "all") {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(
        (book) =>
          book.genre?.toLowerCase().includes(selectedGenre.toLowerCase()) ||
          selectedGenre.toLowerCase().includes(book.genre?.toLowerCase() || "")
      );
      setFilteredBooks(filtered);
    }
  }, [selectedGenre, books]);

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return books.length;
    return books.filter(
      (book) =>
        book.genre?.toLowerCase().includes(categoryId.toLowerCase()) ||
        categoryId.toLowerCase().includes(book.genre?.toLowerCase() || "")
    ).length;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-text font-medium">Reader Dashboard</span>
          </nav>
          <h1 className="font-serif text-4xl font-bold text-text mb-2">
            Welcome back, {user?.email?.split("@")[0] || "Reader"}! 👋
          </h1>
          <p className="text-text-muted text-lg">
            Explore our collection by genre and find your next favorite read.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface rounded-xl p-4 border border-primary/10">
            <p className="text-3xl font-bold text-primary">{books.length}</p>
            <p className="text-text-muted text-sm">Total Books</p>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-primary/10">
            <p className="text-3xl font-bold text-secondary">
              {CATEGORIES.length - 1}
            </p>
            <p className="text-text-muted text-sm">Genres</p>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-primary/10">
            <p className="text-3xl font-bold text-accent">
              {
                books.filter(
                  (b) =>
                    b.createdAt &&
                    new Date(b.createdAt) >
                      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length
              }
            </p>
            <p className="text-text-muted text-sm">New This Week</p>
          </div>
          <Link
            to="/library"
            className="bg-primary/10 rounded-xl p-4 border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            <p className="text-xl font-bold text-primary">My Library →</p>
            <p className="text-text-muted text-sm">View purchased books</p>
          </Link>
        </div>

        {/* Genre Filter */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-bold text-text mb-4">
            Browse by Genre
          </h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedGenre(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedGenre === category.id
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-surface text-text-muted hover:bg-primary/10 hover:text-primary border border-primary/10"
                }`}
              >
                {category.icon} {category.name}
                <span className="ml-1 opacity-70">
                  ({getCategoryCount(category.id)})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold text-text">
              {selectedGenre === "all"
                ? "All Books"
                : CATEGORIES.find((c) => c.id === selectedGenre)?.name ||
                  selectedGenre}
            </h2>
            <p className="text-text-muted">
              {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-text-muted">Loading books...</p>
              </div>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-16 bg-surface rounded-2xl border border-primary/10">
              <div className="text-6xl mb-4">
                {CATEGORIES.find((c) => c.id === selectedGenre)?.icon || "📚"}
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">
                No books found in this genre
              </h3>
              <p className="text-text-muted mb-6">
                Try selecting a different genre or check back later!
              </p>
              <button
                onClick={() => setSelectedGenre("all")}
                className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                View All Books
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredBooks
                .filter((book) => book.id)
                .map((book) => (
                  <BookCard key={book.id} book={{ ...book, id: book.id! }} />
                ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/bestsellers"
            className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20 hover:shadow-lg transition-all group"
          >
            <span className="text-3xl">🏆</span>
            <h3 className="font-serif text-xl font-bold text-text mt-2 group-hover:text-primary transition-colors">
              Bestsellers
            </h3>
            <p className="text-text-muted text-sm mt-1">
              See what everyone's reading
            </p>
          </Link>
          <Link
            to="/new-arrivals"
            className="bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-xl p-6 border border-green-500/20 hover:shadow-lg transition-all group"
          >
            <span className="text-3xl">✨</span>
            <h3 className="font-serif text-xl font-bold text-text mt-2 group-hover:text-primary transition-colors">
              New Arrivals
            </h3>
            <p className="text-text-muted text-sm mt-1">
              Fresh additions to explore
            </p>
          </Link>
          <Link
            to="/categories"
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20 hover:shadow-lg transition-all group"
          >
            <span className="text-3xl">📂</span>
            <h3 className="font-serif text-xl font-bold text-text mt-2 group-hover:text-primary transition-colors">
              All Categories
            </h3>
            <p className="text-text-muted text-sm mt-1">
              Browse the full catalog
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReaderDashboard;
