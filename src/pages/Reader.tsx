import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookById } from "../services/bookService";

const Reader: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [textContent, setTextContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        if (!bookId) throw new Error("Missing book id");
        const b = await getBookById(bookId);
        if (!b) throw new Error("Book not found");
        if (mounted) setTextContent(b.textContent ?? null);
      } catch (err: any) {
        if (mounted) setError(err?.message || "Failed to load book PDF");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [bookId]);

  if (loading) return <div className="p-6">Loading reader...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!textContent) return <div className="p-6">Text not available</div>;

  return (
    <div className="p-4 h-screen overflow-auto">
      <div className="prose max-w-none whitespace-pre-wrap">{textContent}</div>
    </div>
  );
};

export default Reader;
