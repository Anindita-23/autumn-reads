import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getBooks, type Book } from "../services/bookService";
import BookCard from "../components/BookCard";

// Define available categories with metadata
const CATEGORIES = [
  {
    id: "fiction",
    name: "Fiction",
    icon: "📖",
    description: "Novels, short stories, and literary fiction",
    color: "from-blue-500/20 to-indigo-500/20",
  },
  {
    id: "non-fiction",
    name: "Non-Fiction",
    icon: "📚",
    description: "Biographies, history, science, and self-help",
    color: "from-green-500/20 to-teal-500/20",
  },
  {
    id: "mystery",
    name: "Mystery & Thriller",
    icon: "🔍",
    description: "Detective stories, suspense, and crime fiction",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "romance",
    name: "Romance",
    icon: "💕",
    description: "Love stories, contemporary and historical romance",
    color: "from-rose-500/20 to-red-500/20",
  },
  {
    id: "sci-fi",
    name: "Science Fiction",
    icon: "🚀",
    description: "Space operas, dystopian futures, and tech thrillers",
    color: "from-cyan-500/20 to-blue-500/20",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    icon: "🐉",
    description: "Epic adventures, magic, and mythical worlds",
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: "horror",
    name: "Horror",
    icon: "👻",
    description: "Scary stories, supernatural tales, and dark fiction",
    color: "from-gray-500/20 to-slate-500/20",
  },
  {
    id: "classics",
    name: "Classics",
    icon: "🏛️",
    description: "Timeless literature and canonical works",
    color: "from-yellow-500/20 to-amber-500/20",
  },
];

const Categories: React.FC = () => {
  const { genre } = useParams<{ genre?: string }>();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [allBooks, setAllBooks] = useState<Book[]>([]);

  const selectedCategory = CATEGORIES.find((c) => c.id === genre);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const fetchedBooks = await getBooks();
        setAllBooks(fetchedBooks);

        if (genre) {
          // Filter by genre (case-insensitive partial match)
          const filtered = fetchedBooks.filter(
            (book) =>
              book.genre?.toLowerCase().includes(genre.toLowerCase()) ||
              genre.toLowerCase().includes(book.genre?.toLowerCase() || "")
          );
          setBooks(filtered);
        } else {
          setBooks(fetchedBooks);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [genre]);

  // Count books per category
  const getCategoryCount = (categoryId: string) => {
    return allBooks.filter(
      (book) =>
        book.genre?.toLowerCase().includes(categoryId.toLowerCase()) ||
        categoryId.toLowerCase().includes(book.genre?.toLowerCase() || "")
    ).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-muted">Loading categories...</p>
        </div>
      </div>
    );
  }

  // If no genre selected, show category grid
  if (!genre) {
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
              <span className="text-text font-medium">Categories</span>
            </nav>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-text mb-4">
              Browse by Category
            </h1>
            <p className="text-text-muted text-lg max-w-2xl">
              Explore our curated collection organized by genre. Find your next
              favorite read in the category that speaks to you.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${category.color} p-6 border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-serif text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-text-muted text-sm mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    {getCategoryCount(category.id)} books
                  </span>
                  <span className="text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                    Browse →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show books for selected category
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div
        className={`bg-gradient-to-r ${
          selectedCategory?.color || "from-primary/10 to-secondary/10"
        } py-16`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/categories"
              className="hover:text-primary transition-colors"
            >
              Categories
            </Link>
            <span>/</span>
            <span className="text-text font-medium">
              {selectedCategory?.name || genre}
            </span>
          </nav>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{selectedCategory?.icon || "📚"}</span>
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-text">
                {selectedCategory?.name || genre}
              </h1>
              <p className="text-text-muted text-lg mt-2">
                {selectedCategory?.description ||
                  `Books in the ${genre} category`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => navigate(`/categories/${category.id}`)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category.id === genre
                  ? "bg-primary text-white shadow-lg"
                  : "bg-surface text-text-muted hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {books.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">
              {selectedCategory?.icon || "📚"}
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">
              No books in this category yet
            </h3>
            <p className="text-text-muted mb-6">
              Check back soon for new additions!
            </p>
            <Link
              to="/categories"
              className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Browse All Categories
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-text-muted">
                Showing{" "}
                <span className="font-semibold text-text">{books.length}</span>{" "}
                books
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
      </div>
    </div>
  );
};

export default Categories;
