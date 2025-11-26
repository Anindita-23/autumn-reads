import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookById } from "../services/bookService";
import { useAuth } from "../hooks/useAuth";
import { userOwnsBook, purchaseBook } from "../services/purchaseService";

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [owned, setOwned] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error("Missing book id");
        const b = await getBookById(id);
        if (mounted) setBook(b);
        if (mounted && user && b) {
          const o = await userOwnsBook(user.uid, id);
          setOwned(o);
        }
      } catch (err: any) {
        if (mounted) setError(err?.message || "Failed to load book");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [id, user]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!book) return <div className="p-6">Book not found</div>;

  const handleBuy = async () => {
    if (!user) return navigate("/login");
    try {
      await purchaseBook(user.uid, book.id);
      setOwned(true);
    } catch (err: any) {
      setError(err?.message || "Purchase failed");
    }
  };

  const handleRead = () => {
    navigate(`/reader/${book.id}`);
  };

  return (
    <div className="container mx-auto max-w-screen-lg px-4 py-12">
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-56 h-80 bg-neutral-100 rounded-md overflow-hidden flex items-center justify-center">
          {book.coverBase64 ? (
            <img
              src={book.coverBase64}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              No cover
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-semibold mb-2 text-neutral-800">
            {book.title}
          </h1>
          <p className="text-base text-neutral-600 mb-4">by {book.author}</p>
          <p className="text-base text-neutral-700 mb-3">{book.description}</p>
          <p className="text-sm text-neutral-500">Genre: {book.genre}</p>
          <p className="mt-4 text-xl font-medium text-neutral-800">
            Price: ${(book.price ?? 0).toFixed(2)}
          </p>

          <div className="mt-6">
            {owned ? (
              <button
                onClick={handleRead}
                className="px-4 py-2 bg-neutral-800 text-white rounded-lg"
              >
                Read Now
              </button>
            ) : (
              <button
                onClick={handleBuy}
                className="px-4 py-2 bg-neutral-800 text-white rounded-lg"
              >
                Buy Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
