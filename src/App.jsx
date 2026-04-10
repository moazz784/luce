import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import { ThemeProvider } from "./ThemeContext";
import ProtectedRoute from "./ProtectedRoute";

// 1. استيراد المكونات والستايل الخاص بالتوست
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        
        {/* 2. وضع الحاوية هنا لتكون متاحة في كل التطبيق */}
        <ToastContainer position="top-right" autoClose={3000} />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* حماية الداشبورد */}
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