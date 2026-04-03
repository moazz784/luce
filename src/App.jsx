import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import { ThemeProvider } from "./ThemeContext"; // 1. استيراد البروفايدر

function App() {
  return (
    // 2. لف التطبيق كله بالثيم
    <ThemeProvider>
      {/* 3. ضيف div يغطي الصفحة ويدعم الـ dark mode */}
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;