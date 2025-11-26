import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BookReader from "./pages/BookReader";
import { AuthProvider } from "./context/AuthContext";
import { RoleProvider } from "./context/RoleContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import Library from "./pages/Library";
import Reader from "./pages/Reader";
import ReaderDashboard from "./pages/ReaderDashboard";
import PublisherDashboard from "./pages/PublisherDashboard";
import UploadBook from "./pages/UploadBook";
import NotAuthorized from "./pages/NotAuthorized";
import MainNavbar from "./components/MainNavbar";
import Bestsellers from "./pages/Bestsellers";
import NewArrivals from "./pages/NewArrivals";
import Categories from "./pages/Categories";
import Search from "./pages/Search";

import { SearchProvider } from "./context/SearchContext";

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <SearchProvider>
          <BrowserRouter>
            <MainNavbar />

            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/read/:id"
                element={
                  <ProtectedRoute>
                    <BookReader />
                  </ProtectedRoute>
                }
              />
              {/* Protected Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/not-authorized" element={<NotAuthorized />} />

              <Route path="/" element={<Home />} />
              <Route path="/book/:id" element={<BookDetail />} />
              <Route path="/bestsellers" element={<Bestsellers />} />
              <Route path="/new-arrivals" element={<NewArrivals />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:genre" element={<Categories />} />
              <Route path="/search" element={<Search />} />
              <Route
                path="/library"
                element={
                  <ProtectedRoute allowedRoles={["reader", "publisher"]}>
                    <Library />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reader/:bookId"
                element={
                  <ProtectedRoute allowedRoles={["reader", "publisher"]}>
                    <Reader />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reader"
                element={
                  <ProtectedRoute allowedRoles={["reader"]}>
                    <ReaderDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/publisher"
                element={
                  <ProtectedRoute allowedRoles={["publisher"]}>
                    <PublisherDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/upload"
                element={
                  <ProtectedRoute allowedRoles={["publisher"]}>
                    <UploadBook />
                  </ProtectedRoute>
                }
              />

              <Route path="/" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </SearchProvider>
      </RoleProvider>
    </AuthProvider>
  );
}

export default App;
