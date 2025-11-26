import { FC } from "react";
import { calculateDiscount, formatPrice } from "../utils/helper";
import DividerWithTitle from "./common/DividerWithTitle";
import { Link } from "react-router-dom";

const DEFAULT_COVER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='400' height='560' viewBox='0 0 400 560'>
      <rect width='100%' height='100%' fill='#fff7ed' />
      <g transform='translate(24,80)'>
        <rect x='0' y='0' width='352' height='352' rx='10' fill='#ffffff' stroke='#fde68a' />
        <text x='176' y='176' font-size='20' text-anchor='middle' fill='#9a7b59' font-family='Inter, Arial, sans-serif'>No Cover</text>
      </g>
    </svg>
  `);

export interface Book {
  id: string;
  title: string;
  genre: string;
  slug: string;
  cover?: string;
  rating?: string;
  price: {
    mrp: string;
    sale: string;
  };
}

interface Props {
  data: Book[];
  title?: string;
}

const BookList: FC<Props> = ({ title, data }) => {
  return (
    <div>
      <DividerWithTitle title={title} />

      <div className="mt-6 grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-6">
        {data.map((book) => {
          return (
            <Link key={book.id} to={`/book/${book.slug}`}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-shadow transform hover:-translate-y-1 p-4 h-full flex flex-col">
                <div className="flex items-center justify-center">
                  <img
                    src={book.cover ?? DEFAULT_COVER}
                    alt={book.title ?? "Book cover"}
                    className="w-full h-44 object-cover rounded-md"
                  />
                </div>

                <div className="mt-3 flex-1 w-full">
                  <p className="font-semibold text-sm line-clamp-2 text-gray-900 dark:text-white">
                    {book.title}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded">
                      {calculateDiscount(book.price)}% Off
                    </span>
                    <div className="text-right">
                      <div className="font-bold text-sm">
                        {formatPrice(Number(book.price.sale))}
                      </div>
                      <div className="text-xs line-through text-gray-400">
                        {formatPrice(Number(book.price.mrp))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  {book.rating ? (
                    <span className="inline-flex items-center bg-yellow-400 text-black text-sm px-2 py-0.5 rounded">
                      <span className="font-semibold mr-1">{book.rating}</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline-block"
                      >
                        <path d="M12 .587l3.668 7.431L24 9.75l-6 5.84L19.335 24 12 20.202 4.665 24 6 15.59 0 9.75l8.332-1.732z" />
                      </svg>
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">No Ratings</span>
                  )}

                  <button className="ml-4 inline-flex items-center px-3 py-1 rounded bg-gradient-to-r from-purple-600 to-indigo-500 text-white text-sm font-semibold shadow">
                    Buy
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BookList;
