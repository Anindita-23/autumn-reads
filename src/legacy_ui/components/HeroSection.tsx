import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";

interface Props {}
interface FeaturedBook {
  title: string;
  slogan: string;
  subtitle: string;
  cover?: string;
  slug: string;
}

const HeroSection: FC<Props> = () => {
  const [books, setBooks] = useState<FeaturedBook[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await client<{ featuredBooks?: FeaturedBook[] }>(
          "/book/featured"
        );
        const data = (res && (res as any).data) || {};
        const fb = data.featuredBooks;
        setBooks(Array.isArray(fb) ? fb : []);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Failed to load featured books", e);
        setBooks([]);
      }
    })();
  }, []);

  const first = Array.isArray(books) && books.length > 0 ? books[0] : undefined;

  const DEFAULT_COVER =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'>
        <rect width='100%' height='100%' fill='#eef2ff' />
        <g transform='translate(40,140)'>
          <rect x='0' y='0' width='520' height='520' rx='12' fill='#ffffff' stroke='#e6e6f7' />
          <text x='260' y='260' font-size='36' text-anchor='middle' fill='#6b7280' font-family='Inter, Arial, sans-serif'>No Cover</text>
        </g>
      </svg>
    `);

  return (
    <div className="rounded-2xl overflow-hidden">
      <div
        className="md:h-96 p-6 md:p-10 flex items-center"
        style={{
          background:
            "linear-gradient(135deg, var(--app-accent), var(--app-accent-2))",
          color: "white",
        }}
      >
        {first ? (
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1 text-left md:pr-8">
              <h2 className="lg:text-5xl text-2xl font-extrabold leading-tight">
                {first.slogan}
              </h2>
              <p className="md:text-lg mt-3 opacity-90">{first.subtitle}</p>
              <div className="mt-5">
                <Link
                  to={`/book/${first.slug}`}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white text-black shadow-md hover:opacity-95"
                >
                  <span>Learn More</span>
                  <svg
                    className="ml-3"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12h14M13 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="mt-6 md:mt-0 md:flex-1 flex items-center justify-center">
              <img
                src={first.cover ?? DEFAULT_COVER}
                alt={first.title ?? "Featured book"}
                className="w-40 md:w-56 lg:w-64 h-auto rounded-lg object-cover shadow-2xl transform md:rotate-6"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full w-full text-white">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
