import React, { useEffect, useMemo, useState } from "react";
import { getBooks } from "../services/bookService";
import BookCard from "../components/BookCard";
import { Button, Input, Chip } from "@nextui-org/react";
import { FaSearch, FaLeaf } from "react-icons/fa";

import { useSearch } from "../context/SearchContext";
import Fuse from "fuse.js";

const Home: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const { searchQuery, setSearchQuery } = useSearch();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await getBooks();
        if (mounted) setBooks(data);
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

  const genres = useMemo(() => {
    const s = new Set<string>();
    books.forEach((b) => {
      if (b.genre) s.add(b.genre);
    });
    return Array.from(s);
  }, [books]);

  const filtered = useMemo(() => {
    let result = books;

    // 1. Filter by Genre
    if (selectedGenre) {
      result = result.filter((b) => b.genre === selectedGenre);
    }

    // 2. Fuzzy Search
    if (searchQuery.trim()) {
      const fuse = new Fuse(result, {
        keys: ["title", "author", "description"],
        threshold: 0.3, // Adjust sensitivity
        ignoreLocation: true,
      });
      result = fuse.search(searchQuery).map((r: Fuse.FuseResult<any>) => r.item);
    }

    return result;
  }, [books, selectedGenre, searchQuery]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="text-primary font-serif italic text-xl">Brewing your library...</div>
      </div>
    </div>
  );
  
  if (error) return <div className="p-6 text-red-600 text-center">{error}</div>;

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Hero Section - Autumn Theme */}
      <div className="relative bg-surface overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217153-e59921498e75?q=80&w=2828&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
        
        <div className="w-full px-6 md:px-12 py-24 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-left">
            <Chip color="warning" variant="flat" className="mb-4 text-warning-700 font-bold uppercase tracking-wider">Autumn Collection</Chip>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-text mb-6 tracking-tight leading-tight">
              Cozy Up With <br/><span className="text-primary">A Good Book</span>
            </h1>
            <p className="text-xl text-text-muted max-w-xl mb-8 leading-relaxed font-medium">
              The leaves are falling, and so are our prices. Discover your perfect autumn read from our curated selection of mysteries, classics, and more.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-primary text-white font-bold px-8 shadow-lg shadow-primary/30" radius="full">
                Shop Now
              </Button>
              <Button size="lg" variant="bordered" className="border-primary text-primary font-bold px-8" radius="full">
                View Bestsellers
              </Button>
            </div>
          </div>
          
          {/* Featured Book Display */}
          <div className="hidden md:block w-1/3 relative">
             <div className="relative w-64 h-96 bg-[#FFF8DC] rounded-r-xl rounded-l-sm shadow-2xl transform rotate-[-6deg] border-l-4 border-l-[#D2B48C]">
                <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover rounded-r-xl rounded-l-sm opacity-90" alt="Featured" />
                <div className="absolute -right-4 -bottom-4 bg-[#FFF8DC] p-3 rounded-lg shadow-xl flex flex-col items-center border border-[#9A3B3B]/10">
                   <span className="text-xs font-bold text-text-muted uppercase">Only</span>
                   <span className="text-2xl font-bold text-primary">$9.99</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="w-full py-12">
        {/* Section Header */}
        <div className="px-6 md:px-12 flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
             <FaLeaf className="text-primary" size={24} />
             <h2 className="text-3xl font-serif font-bold text-text">Trending This Season</h2>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="light" className="text-primary font-medium">View All</Button>
          </div>
        </div>

        {/* Genre Filter */}
        <div className="px-6 md:px-12 flex flex-wrap gap-3 mb-10">
          <Button 
            radius="full" 
            variant={selectedGenre === null ? "solid" : "bordered"}
            className={selectedGenre === null ? "bg-primary text-white font-medium" : "border-primary/30 text-text-muted hover:border-primary hover:text-primary"}
            onPress={() => setSelectedGenre(null)}
          >
            All Genres
          </Button>
          {genres.map((genre) => (
            <Button
              key={genre}
              radius="full"
              variant={selectedGenre === genre ? "solid" : "bordered"}
              className={selectedGenre === genre ? "bg-primary text-white font-medium" : "border-primary/30 text-text-muted hover:border-primary hover:text-primary"}
              onPress={() => setSelectedGenre(genre)}
            >
              {genre}
            </Button>
          ))}
        </div>

        {/* Smooth Scroll Book List - Edge to Edge */}
        <div className="relative w-full overflow-hidden">
          <div className="flex overflow-x-auto pb-12 pt-4 px-6 md:px-12 gap-6 snap-x snap-mandatory scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
            {filtered.map((book) => (
              <div key={book.id} className="snap-center shrink-0 first:pl-0 last:pr-6 md:last:pr-12">
                <BookCard book={book} />
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="w-full text-center py-20 text-text-muted bg-surface/50 rounded-3xl mx-6 md:mx-12">
                <FaSearch className="mx-auto text-primary/30 mb-4" size={48} />
                <p className="text-xl font-serif">No books found matching your criteria.</p>
                <Button variant="flat" className="mt-4 text-primary" onPress={() => {setSelectedGenre(null); setSearchQuery("");}}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
          {/* Fade gradients for scroll indication - adjusted for edge-to-edge */}
          <div className="absolute top-0 bottom-12 left-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10"></div>
          <div className="absolute top-0 bottom-12 right-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10"></div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="bg-secondary/10 py-16 mt-12">
        <div className="w-full px-6 md:px-12 text-center max-w-2xl mx-auto">
           <h2 className="text-3xl font-serif font-bold text-text mb-4">Stay Updated</h2>
           <p className="text-text-muted mb-8">Subscribe to our newsletter for the latest releases, exclusive author interviews, and special autumn discounts.</p>
           <div className="flex gap-2">
              <Input 
                placeholder="Enter your email address" 
                classNames={{inputWrapper: "bg-[#FFF8DC]/50 border-primary/20"}}
                size="lg"
                radius="full"
              />
              <Button size="lg" className="bg-primary text-white font-bold" radius="full">Subscribe</Button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
