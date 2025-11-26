import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getBookById } from "./bookService";
import type { Book } from "./bookService";

export interface UserBook {
  id?: string;
  userId: string;
  bookId: string;
  purchasedAt: string;
}

export async function purchaseBook(
  userId: string,
  bookId: string
): Promise<string> {
  const col = collection(db, "userBooks");
  const res = await addDoc(col, {
    userId,
    bookId,
    purchasedAt: new Date().toISOString(),
  });

  return res.id;
}

export async function getUserPurchases(userId: string): Promise<UserBook[]> {
  const col = collection(db, "userBooks");
  const q = query(col, where("userId", "==", userId));
  const snap = await getDocs(q);
  const items: UserBook[] = [];
  snap.forEach((d) => items.push({ id: d.id, ...(d.data() as UserBook) }));
  return items;
}

export async function userOwnsBook(
  userId: string,
  bookId: string
): Promise<boolean> {
  const col = collection(db, "userBooks");
  const q = query(
    col,
    where("userId", "==", userId),
    where("bookId", "==", bookId)
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function getUserOwnedBooks(userId: string): Promise<Book[]> {
  const purchases = await getUserPurchases(userId);
  const books: Book[] = [];
  for (const p of purchases) {
    const b = await getBookById(p.bookId);
    if (b) books.push(b);
  }
  return books;
}
