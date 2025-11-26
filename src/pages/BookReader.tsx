import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookById } from "../services/bookService";
import { Button, Spinner } from "@nextui-org/react";
import { FaArrowLeft } from "react-icons/fa";

const BookReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getBookById(id);
        setBook(data);
      } catch (err: any) {
        setError(err.message || "Failed to load book");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner size="lg" color="primary" label="Opening book..." />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text">
        <p className="text-xl mb-4">{error || "Book not found"}</p>
        <Button onPress={() => navigate("/")} color="primary">
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF0E6] text-[#2D1B0E]">
      {/* Reader Navbar */}
      <div className="sticky top-0 z-50 px-4 py-3 bg-[#FAF0E6]/90 backdrop-blur-sm border-b border-[#2D1B0E]/10 flex items-center justify-between">
        <Button 
          isIconOnly 
          variant="light" 
          onPress={() => navigate(-1)}
          className="text-[#2D1B0E]"
        >
          <FaArrowLeft />
        </Button>
        <h1 className="font-serif font-bold text-lg truncate max-w-[60%]">{book.title}</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="prose prose-lg prose-brown mx-auto font-serif leading-loose text-justify">
          {/* Cover Image in Reader (Optional) */}
          {/* 
          <div className="mb-12 flex justify-center">
             <img 
               src={book.coverBase64 || book.coverURL} 
               alt={book.title} 
               className="max-w-xs rounded-lg shadow-xl"
             />
          </div>
          */}
          
          <div className="whitespace-pre-wrap">
            {book.textContent || "No content available for this book."}
          </div>
        </div>
        
        <div className="mt-20 text-center text-text-muted text-sm">
          <p>End of Preview</p>
        </div>
      </div>
    </div>
  );
};

export default BookReader;
