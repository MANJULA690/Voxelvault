import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Gallery from "./pages/Gallery";
import ModelDetail from "./pages/ModelDetail";
import UploadModel from "./pages/UploadModel";
import Profile from "./pages/Profile";
import Bookmarks from "./pages/Bookmarks";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/model/:id" element={<ModelDetail />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/upload" element={
            <ProtectedRoute><UploadModel /></ProtectedRoute>
          } />
          <Route path="/bookmarks" element={
            <ProtectedRoute><Bookmarks /></ProtectedRoute>
          } />
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#13131e",
              color: "#f0f0f8",
              border: "1px solid #1e1e2e",
              fontFamily: "'Syne', sans-serif",
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
