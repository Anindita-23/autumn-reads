import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadBookWithFiles } from "../services/bookService";

const UploadBook: React.FC = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [price, setPrice] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const navigate = useNavigate();

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      // Accept plain text files for book content (text/plain)
      if (f.type !== "text/plain") {
        setError("Selected file must be a TXT (text/plain) file.");
        setPdfFile(null);
        return;
      }
      setPdfFile(f);
    } else setPdfFile(null);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      if (!f.type.startsWith("image/")) {
        setError("Cover file must be an image (png, jpg, webp, etc.).");
        setCoverFile(null);
        return;
      }
      setCoverFile(f);
    } else setCoverFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !author.trim()) {
      setError("Title and author are required.");
      return;
    }

    if (!pdfFile) {
      setError("Please select a TXT file to upload.");
      return;
    }

    // validate cover file type again just before upload
    if (coverFile && !coverFile.type.startsWith("image/")) {
      setError("Cover file must be an image (png, jpg, webp, etc.).");
      return;
    }

    const parsedPrice = parseFloat(price || "0");

    setLoading(true);
    setProgress(0);
    try {
      const bookId = await uploadBookWithFiles(
        {
          title,
          author,
          description,
          genre: genre || null,
          price: isNaN(parsedPrice) ? null : parsedPrice,
          createdAt: new Date().toISOString(),
        } as any,
        pdfFile,
        coverFile,
        (pct: number) => setProgress(pct)
      );

      // after success redirect to publisher dashboard
      navigate("/publisher");
    } catch (err: any) {
      setError(err?.message || "Upload failed");
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  return (
    <div className="container mx-auto max-w-screen-lg px-4 py-12">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Upload Book</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Title
            </label>
            <input
              className="mt-1 block w-full rounded-lg border border-neutral-200 px-3 py-2 text-base text-neutral-700"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Author
            </label>
            <input
              className="mt-1 block w-full rounded-lg border border-neutral-200 px-3 py-2 text-base text-neutral-700"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Description
            </label>
            <textarea
              className="mt-1 block w-full rounded-lg border border-neutral-200 px-3 py-2 text-base text-neutral-700"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Genre
              </label>
              <input
                className="mt-1 block w-full rounded-lg border border-neutral-200 px-3 py-2 text-base text-neutral-700"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Price (USD)
              </label>
              <input
                className="mt-1 block w-full rounded-lg border border-neutral-200 px-3 py-2 text-base text-neutral-700"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Book TXT
            </label>
            <input
              className="mt-1"
              type="file"
              accept="text/plain,.txt"
              onChange={handlePdfChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Cover Image (optional)
            </label>
            <input
              className="mt-1"
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-neutral-800 text-white rounded-lg text-lg disabled:opacity-60"
            >
              {loading ? "Uploading..." : "Upload Book"}
            </button>
          </div>

          {loading && progress !== null && (
            <div className="mt-3">
              <div className="text-sm text-neutral-700 mb-1">
                Uploading: {progress}%
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-3">
                <div
                  className="bg-neutral-800 h-3 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div role="alert" className="text-red-600">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadBook;
