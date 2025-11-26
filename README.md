# 📚 Autumn Reads

A modern, cozy ebook platform built with React, TypeScript, and Firebase. Browse, purchase, and read your favorite books in a beautiful, Kindle-inspired reading experience.

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12.6-FFCA28?style=flat-square&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite)

---

## ✨ Features

### 📖 For Readers

- **Browse Books** - Explore a curated collection of ebooks across multiple genres
- **Search** - Find books by title, author, or genre
- **Categories** - Browse by Fiction, Non-Fiction, Mystery, Romance, Sci-Fi, Fantasy, Horror, and Classics
- **Bestsellers & New Arrivals** - Discover popular and recently added books
- **Purchase Books** - Buy books securely and add them to your library
- **Personal Library** - Access all your purchased books in one place
- **In-Browser Reader** - Read books directly in the browser with a clean, distraction-free interface

### 📝 For Publishers

- **Upload Books** - Add new books with cover images and PDF files
- **Dashboard** - Manage your published books with genre filtering
- **Book Management** - View all books in the catalog

### 🔐 Authentication & Roles

- **Email/Password Authentication** - Secure sign up and login via Firebase Auth
- **Role-Based Access** - Separate experiences for Readers and Publishers
- **Protected Routes** - Content access based on user role and purchase status

---

## 🛠️ Tech Stack

| Category             | Technologies                                  |
| -------------------- | --------------------------------------------- |
| **Frontend**         | React 19, TypeScript, Vite                    |
| **Styling**          | Tailwind CSS, NextUI Components               |
| **State Management** | React Context, Zustand, Redux Toolkit         |
| **Backend**          | Firebase (Authentication, Firestore, Storage) |
| **Routing**          | React Router DOM v7                           |
| **Icons**            | React Icons                                   |
| **Animations**       | Framer Motion                                 |
| **PDF Rendering**    | react-pdf, epub.js                            |

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BookCard.tsx        # Book display card with buy button
│   ├── MainNavbar.tsx      # Main navigation bar
│   ├── ProtectedRoute.tsx  # Route guard component
│   └── ...
├── context/             # React Context providers
│   ├── AuthContext.tsx     # Authentication state
│   ├── RoleContext.tsx     # User role management
│   └── SearchContext.tsx   # Search functionality
├── pages/               # Page components
│   ├── Home.tsx            # Landing page
│   ├── BookDetail.tsx      # Book details & purchase
│   ├── Categories.tsx      # Genre browsing
│   ├── Bestsellers.tsx     # Top books
│   ├── NewArrivals.tsx     # Latest additions
│   ├── Search.tsx          # Search results
│   ├── Library.tsx         # User's purchased books
│   ├── Reader.tsx          # Book reader
│   ├── ReaderDashboard.tsx # Reader's dashboard
│   ├── PublisherDashboard.tsx # Publisher's dashboard
│   ├── UploadBook.tsx      # Book upload form
│   ├── Login.tsx           # Login page
│   ├── Signup.tsx          # Registration page
│   └── ...
├── services/            # Firebase service functions
│   ├── authService.ts      # Authentication helpers
│   ├── bookService.ts      # Book CRUD operations
│   └── purchaseService.ts  # Purchase management
├── hooks/               # Custom React hooks
├── firebase/            # Firebase configuration (gitignored)
├── routes/              # Route guards
└── types/               # TypeScript type definitions
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project with Authentication, Firestore, and Storage enabled

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Anindita-23/autumn-reads.git
   cd autumn-reads
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase**

   Create `src/firebase/firebase.ts` with your Firebase configuration:

   ```typescript
   import { initializeApp } from "firebase/app";
   import { getAuth } from "firebase/auth";
   import { getFirestore } from "firebase/firestore";
   import { getStorage } from "firebase/storage";

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
   };

   const app = initializeApp(firebaseConfig);

   export const auth = getAuth(app);
   export const db = getFirestore(app);
   export const storage = getStorage(app);

   export default app;
   ```

   Create `src/firebase/auth.ts`:

   ```typescript
   export { auth } from "./firebase";
   ```

4. **Set up Firestore**

   Create the following collections in your Firestore database:

   - `users` - User profiles with role field ("reader" or "publisher")
   - `books` - Book metadata (title, author, genre, price, etc.)
   - `purchases` - Purchase records linking users to books

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 📜 Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

---

## 🎨 Design System

Autumn Reads features a cozy, minimalistic design inspired by platforms like Kindle and Scribd:

### Color Palette

- **Primary**: `#9A3B3B` (Warm burgundy)
- **Secondary**: `#C08261` (Muted terracotta)
- **Accent**: `#E2C799` (Warm sand)
- **Background**: `#FDF6E3` (Warm ivory)
- **Surface**: `#FFFAF0` (Floral white)
- **Text**: `#2D1B0E` (Dark brown)

### Typography

- **Headings**: Playfair Display (Serif)
- **Body**: Inter (Sans-serif)

---

## 📚 Book Genres

The platform supports the following genres:

- 📖 Fiction
- 📘 Non-Fiction
- 🔍 Mystery & Thriller
- 💕 Romance
- 🚀 Science Fiction
- 🐉 Fantasy
- 👻 Horror
- 🏛️ Classics

---

## 🔒 Security

- Firebase configuration is excluded from version control via `.gitignore`
- Role-based access control prevents unauthorized access
- Protected routes ensure only authenticated users can access purchased content

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Anindita**

- GitHub: [@Anindita-23](https://github.com/Anindita-23)

---

<p align="center">
  Made with ❤️ and ☕ | Happy Reading! 📖
</p>
