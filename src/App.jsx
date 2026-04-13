import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import { ThemeProvider } from "./ThemeContext";
import ProtectedRoute from "./ProtectedRoute";

// 1. استيراد المكون وملف الـ CSS الخاص بالتوست
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./Register";
import Gallery from "./Gallery";
import EventsPage from "./EventsPage";
import NewsPage from "./NewsPage";

function App() {
  return (
    <ThemeProvider>
      {/* 2. إضافة حاوية التوست هنا لتعمل في جميع الصفحات */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" 
      />

      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* تأكد أن اسم الملف هنا مطابق لما تستخدمه (Login أو Auth) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/news" element={<NewsPage />} />
            {/* ✅ حماية الداشبورد */}
            <Route
              path="/AdminDashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;