import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function signup(
  email: string,
  password: string,
  role: "reader" | "publisher"
) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCred.user;

  await setDoc(doc(db, "users", user.uid), {
    email,
    role,
    createdAt: new Date().toISOString(),
  });

  return user;
}

export async function login(email: string, password: string) {
  const res = await signInWithEmailAndPassword(auth, email, password);

  return res.user;
}

export async function logout() {
  return signOut(auth);
}

export async function getCurrentUserRole(uid: string) {
  const docRef = doc(db, "users", uid);
  const snap = await getDoc(docRef);

  if (!snap.exists()) return null;

  return snap.data().role;
}
