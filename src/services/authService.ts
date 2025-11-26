import type { User } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

export type Role = "reader" | "publisher";

export async function signup(
  email: string,
  password: string,
  role: Role
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  await setDoc(doc(db, "users", user.uid), {
    email,
    role,
    createdAt: new Date().toISOString(),
  });

  return user;
}

export async function login(email: string, password: string): Promise<User> {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function getUserRole(uid: string): Promise<Role | null> {
  const docRef = doc(db, "users", uid);
  const snap = await getDoc(docRef);

  if (!snap.exists()) return null;

  const data = snap.data();
  return (data.role as Role) ?? null;
}
