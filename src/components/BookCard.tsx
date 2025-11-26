import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Image, Button } from "@nextui-org/react";
import { FaShoppingCart } from "react-icons/fa";

interface BookData {
  id: string;
  title: string;
  author: string;
  coverBase64?: string | null;
  coverURL?: string | null;
  price?: number;
  description?: string;
  genre?: string;
}

const BookCard: React.FC<{ book: BookData }> = ({ book }) => {
  const navigate = useNavigate();

  return (
    <div className="group relative w-[200px] flex-shrink-0 perspective-1000 mx-4">
      <div
        className="relative w-full aspect-[2/3] transition-transform duration-500 transform-style-3d group-hover:rotate-y-[-10deg] cursor-pointer"
        onClick={() => navigate(`/book/${book.id}`)}
      >
        {/* Book Spine Effect */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#8D7B68] transform -translate-x-2 translate-z-[-2px] rotate-y-[-90deg] rounded-l-sm"></div>

        {/* Book Cover */}
        <Card
          shadow="none"
          className="w-full h-full rounded-r-md rounded-l-sm border-l-4 border-l-white/20 bg-[#FFF8DC] shadow-book group-hover:shadow-book-hover transition-shadow duration-500 overflow-hidden"
        >
          <Image
            removeWrapper
            alt={book.title}
            className="z-0 w-full h-full object-cover"
            src={
              book.coverBase64 ||
              book.coverURL ||
              `https://placehold.co/400x600/9A3B3B/FFF8DC?text=${encodeURIComponent(
                book.title
              )}`
            }
          />
          {/* Overlay for Title if no cover image (fallback) */}
          {!book.coverBase64 && !book.coverURL && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-[#9A3B3B] text-[#FFF8DC]">
              <h3 className="font-serif font-bold text-lg">{book.title}</h3>
              <p className="text-sm mt-2">{book.author}</p>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-4 text-center">
        <h3 className="text-lg font-serif font-bold text-[#2D1B0E] line-clamp-1 leading-tight">
          {book.title}
        </h3>
        <p className="text-sm text-[#5C4033] font-medium mt-1">{book.author}</p>
        {book.price !== undefined && (
          <p className="text-sm font-bold text-primary mt-1">
            ${book.price.toFixed(2)}
          </p>
        )}
        <Button
          size="sm"
          className="mt-2 bg-[#9A3B3B] text-white font-medium shadow-md hover:bg-[#9A3B3B]/90"
          radius="full"
          startContent={<FaShoppingCart size={12} />}
          onPress={() => navigate(`/book/${book.id}`)}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
};

export default BookCard;
