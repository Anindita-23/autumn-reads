import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getUserOwnedBooks } from "../services/purchaseService";
import BookCard from "../components/BookCard";
import { useNavigate } from "react-router-dom";

const Library: React.FC = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user) {
        setBooks([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getUserOwnedBooks(user.uid);
        if (mounted) setBooks(data);
      } catch (err: any) {
        if (mounted) setError(err?.message || "Failed to load library");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [user]);

  if (loading) return <div className="p-6">Loading your library...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Library</h1>
      {books.length === 0 && <p>You have not purchased any books yet.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {books.map((b) => (
          <div key={b.id} onClick={() => navigate(`/reader/${b.id}`)}>
            <BookCard book={b} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
