import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export interface Book {
  id?: string;
  title: string;
  author: string;
  description?: string;
  pdfURL?: string | null;
  coverURL?: string | null;
  coverBase64?: string | null;
  coverContentType?: string | null;
  textContent?: string | null;
  genre?: string;
  price?: number;
  createdAt?: string;
}

export async function getBooks(filterGenre?: string): Promise<Book[]> {
  const col = collection(db, "books");
  const snap = await getDocs(col);
  const books: Book[] = [];
  snap.forEach((d) => books.push({ id: d.id, ...(d.data() as Book) }));

  if (filterGenre) {
    return books.filter(
      (b) => (b.genre || "").toLowerCase() === filterGenre.toLowerCase()
    );
  }

  return books;
}

export async function getBookById(bookId: string): Promise<Book | null> {
  const docRef = doc(db, "books", bookId);
  const snap = await getDoc(docRef as any);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Book) };
}

export async function uploadBook(book: Book): Promise<string> {
  const col = collection(db, "books");
  const res = await addDoc(col, {
    ...book,
    createdAt: new Date().toISOString(),
  });
  return res.id;
}

export async function uploadBookWithFiles(
  book: Book,
  pdfFile?: File | null,
  coverFile?: File | null,
  onProgress?: (percent: number) => void
): Promise<string> {
  // Create the book document first to get an ID
  const col = collection(db, "books");
  const res = await addDoc(col, {
    title: book.title,
    author: book.author,
    description: book.description ?? "",
    genre: book.genre ?? null,
    price: book.price ?? null,
    createdAt: new Date().toISOString(),
    pdfURL: null,
    textContent: null,
    coverURL: null,
  });

  const bookId = res.id;

  const updates: Partial<
    Book & { fileUrl?: string | null; coverUrl?: string | null }
  > = {};

  if (pdfFile) {
    // If the uploaded file is a plain text file, read and store its content
    // directly in the document to avoid storing small text files in Storage.
    const isText =
      pdfFile.type === "text/plain" ||
      pdfFile.name.toLowerCase().endsWith(".txt");

    if (isText) {
      try {
        // modern browsers support File.text()
        const text = await pdfFile.text();
        updates.textContent = text;
        updates.pdfURL = null;
        // report progress complete for text
        if (onProgress) onProgress(100);
      } catch (err) {
        console.error("Text file processing failed", err);
        throw new Error(
          "Text file processing failed: " + (err as Error).message
        );
      }
    } else {
      const ext = (pdfFile.name.split(".").pop() || "pdf").split("?")[0];
      const pdfRef = ref(storage, `books/${bookId}/book.${ext}`);
      try {
        const uploadTask = uploadBytesResumable(pdfRef, pdfFile);
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              if (onProgress && snapshot.totalBytes) {
                const pct = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                try {
                  onProgress(pct);
                } catch {
                  /* ignore errors from callback */
                }
              }
            },
            (error) => reject(error),
            () => resolve()
          );
        });
        const url = await getDownloadURL(pdfRef);
        updates.pdfURL = url;
      } catch (err) {
        console.error("File upload failed", err);
        throw new Error("File upload failed: " + (err as Error).message);
      }
    }
  }

  if (coverFile) {
    // Resize / compress cover image client-side and store as a base64 data URL
    // Note: Firestore document size is limited (~1 MiB). Ensure images remain small.
    const compressImageToDataUrl = async (
      file: File,
      maxWidth = 1024,
      quality = 0.8
    ) => {
      // Choose output type: preserve PNG/webp to keep transparency, otherwise use jpeg
      const preserveTypes = ["image/png", "image/webp"];
      const outputType = preserveTypes.includes(file.type)
        ? file.type
        : "image/jpeg";

      // Create an ImageBitmap when available for better performance
      let bitmap: ImageBitmap | null = null;

      if ((window as any).createImageBitmap) {
        bitmap = await createImageBitmap(file);
      }

      if (!bitmap) {
        // Fallback to using HTMLImageElement
        const url = URL.createObjectURL(file);
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Image load failed"));
          img.src = url;
        });
        // draw image into canvas
        const canvas = document.createElement("canvas");
        const ratio = Math.min(1, maxWidth / img.width);
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas 2D context not available");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        const dataUrl = canvas.toDataURL(
          outputType as any,
          outputType === "image/jpeg" ? quality : undefined
        );
        return { dataUrl, contentType: outputType };
      }

      // Use ImageBitmap path
      const ratio = Math.min(1, maxWidth / bitmap.width);
      const width = Math.round(bitmap.width * ratio);
      const height = Math.round(bitmap.height * ratio);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas 2D context not available");
      ctx.drawImage(bitmap, 0, 0, width, height);
      const dataUrl = canvas.toDataURL(
        outputType as any,
        outputType === "image/jpeg" ? quality : undefined
      );
      return { dataUrl, contentType: outputType };
    };

    try {
      const { dataUrl, contentType } = await compressImageToDataUrl(
        coverFile,
        1024,
        0.8
      );
      updates.coverBase64 = dataUrl;
      updates.coverContentType = contentType;
      updates.coverURL = null;
      if (onProgress) onProgress(100);
    } catch (err) {
      console.error("Cover processing failed", err);
      throw new Error("Cover processing failed: " + (err as Error).message);
    }
  }

  if (Object.keys(updates).length > 0) {
    const docRef = doc(db, "books", bookId);
    await updateDoc(docRef, updates as any);
  }

  return bookId;
}

export async function deleteBook(bookId: string): Promise<void> {
  const ref = doc(db, "books", bookId);
  await deleteDoc(ref);
}
