import { useNavigate } from "react-router-dom";
import lo from "./assets/lo.png";
import { useTheme } from "./ThemeContext";
import { siteNavLinks } from "./siteNavLinks";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  LogIn,
  LogOut,
  Moon,
  Sun,
  User,
  UserPlus,
} from "lucide-react";

export default function SiteChrome({
  children,
  topSlot = null,
  isLoggedIn,
  isAdmin,
  accountLabel,
  onLogout,
}) {
  const navigate = useNavigate();
  const { isDark, setIsDark } = useTheme();
  
  // تفعيل الماب من ملف siteNavLinks
  const navLinks = siteNavLinks;

  return (
    <div className="min-h-screen font-sans selection:bg-green-500 selection:text-white overflow-x-hidden">
      {topSlot}

      <nav className="bg-[#1a2b56] dark:bg-gray-950 text-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-[100] shadow-xl h-[80px] transition-colors duration-300">
        
        {/* 1. الجزء الأيسر: اللوجو واسم الجامعة */}
        <div
          className="flex items-center gap-3 h-full cursor-pointer shrink-0"
          onClick={() => navigate("/")}
        >
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center p-1 ">
            <img
              src={lo}
              alt="MUST Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>

          <div className="hidden xl:block border-l border-white/20 ml-2 pl-3 text-left">
            <h1 className="text-[11px] font-bold uppercase tracking-wider leading-tight">
              Misr University
            </h1>
            <p className="text-[9px] opacity-70 uppercase">
              For Science & Technology
            </p>
          </div>
        </div>

        {/* 2. الجزء الأوسط: اللينكات (توسيط كامل مع Map) */}
        <div className="hidden lg:flex items-center justify-center flex-1 h-full px-4">
          <ul className="flex items-center gap-3 xl:gap-5 text-[12px] xl:text-[13px] font-bold h-full">
            {navLinks.map((item) => (
              <li key={item.id ?? item.name} className="relative group flex items-center h-full">
                <a
                  href={item.link ? item.link : `#${item.id}`}
                  className="flex items-center gap-1 uppercase hover:text-green-400 transition py-6 whitespace-nowrap"
                >
                  {item.name}
                  {item.subItems && (
                    <ChevronDown
                      size={14}
                      className="opacity-60 group-hover:rotate-180 transition shrink-0"
                    />
                  )}
                </a>

                {/* القوائم المنسدلة (Dropdowns) */}
                {item.subItems && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 bg-[#1a2b56] text-white min-w-[240px] shadow-2xl rounded-b-lg border-x border-b border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    {item.subItems.map((sub, idx) => (
                      <div key={idx} className="relative group/sub">
                        <a
                          href={sub.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex justify-between items-center px-4 py-3 hover:bg-white/10 transition border-b border-white/5 last:border-0"
                        >
                          {sub.name}
                          {sub.nestedItems && <ChevronRight size={14} />}
                        </a>

                        {/* القوائم المتداخلة (Nested) */}
                        {sub.nestedItems && (
                          <div className="absolute top-0 left-full bg-[#1a2b56] text-white min-w-[240px] shadow-xl border border-white/10 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-300">
                            {sub.nestedItems.map((nested, i) => (
                              <a 
                                key={i} 
                                href={nested.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="block px-4 py-3 hover:bg-white/10 transition border-b border-white/5 last:border-0"
                              >
                                {nested.name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* 3. الجزء الأيمن: التحكم والأزرار */}
        <div className="flex items-center gap-3 md:gap-5 border-l border-white/20 pl-4 md:pl-6 h-full shrink-0">
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="hover:text-green-400 transition-all p-1.5 hover:bg-white/5 rounded-full"
          >
            {isDark ? <Sun size={19} className="text-yellow-400" /> : <Moon size={19} />}
          </button>

          <span className="cursor-pointer font-bold text-sm hover:text-green-400 transition-colors">ع</span>

          {isLoggedIn && isAdmin && (
            <button
              onClick={() => navigate("/AdminDashboard")}
              className="flex items-center gap-1.5 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-lg bg-green-500/5 hover:bg-green-500 hover:text-white transition-all text-[11px] font-bold"
            >
              <LayoutDashboard size={14} />
              <span className="hidden xl:inline">DASHBOARD</span>
            </button>
          )}

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="hidden xl:flex flex-col items-end min-w-0">
                <span className="text-[9px] font-bold text-green-500 leading-none mb-1 uppercase tracking-tighter">System Admin</span>
                <div className="flex items-center gap-1.5 max-w-full">
                  <span className="text-[11px] font-semibold truncate max-w-[120px] block">{accountLabel}</span>
                  <User size={14} className="opacity-50" />
                </div>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 border border-red-500/40 text-red-500 hover:text-white px-3 py-1.5 rounded-lg transition-all duration-300 group font-bold text-[11px]"
              >
                <LogOut size={15} className="group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">LOGOUT</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* أزرار Login و Register مع الأيقونات */}
              <button 
                onClick={() => navigate("/login")} 
                className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[12px] bg-white/10 hover:bg-white/20 transition-all"
              >
                <LogIn size={16} />
                Login
              </button>
              
              <button 
                onClick={() => navigate("/register")} 
                className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[12px] bg-green-500 hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
              >
                <UserPlus size={16} />
                Register
              </button>
            </div>
          )}
        </div>
      </nav>

      <main>{children}</main>

      <footer className="bg-[#1a2b56] dark:bg-black text-white pt-20 pb-10 border-t-4 border-white/10 dark:border-gray-700 transition-colors duration-300 mt-auto">
        <div className="container mx-auto px-6">
          <div className="flex justify-center mb-16">
            <img src={lo} alt="MUST Logo" className="w-44" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-sm text-center md:text-left">
            <div>
              <h4 className="text-[#00a651] font-bold mb-6 text-base">Links</h4>
              <ul className="space-y-3 opacity-80">
                <li className="hover:text-green-400 cursor-pointer">Home</li>
                <li className="hover:text-green-400 cursor-pointer">The University</li>
                <li className="hover:text-green-400 cursor-pointer">Academics</li>
                <li className="hover:text-green-400 cursor-pointer">Life At MUST</li>
                <li className="hover:text-green-400 cursor-pointer">FAQs</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#00a651] font-bold mb-6 text-base">About University</h4>
              <ul className="space-y-3 opacity-80">
                <li className="hover:text-green-400 cursor-pointer">About MUST</li>
                <li className="hover:text-green-400 cursor-pointer">History</li>
                <li className="hover:text-green-400 cursor-pointer">Accreditation</li>
                <li className="hover:text-green-400 cursor-pointer">Why MUST</li>
                <li className="hover:text-green-400 cursor-pointer">Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#00a651] font-bold mb-6 text-base">MUST BUZZ</h4>
              <ul className="space-y-3 opacity-80">
                <li className="hover:text-green-400 cursor-pointer">MUST Events</li>
                <li className="hover:text-green-400 cursor-pointer">MUST News</li>
                <li className="hover:text-green-400 cursor-pointer">Blog</li>
                <li className="hover:text-green-400 cursor-pointer">Announcement</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#00a651] font-bold mb-6 text-base">Contact Info</h4>
              <div className="space-y-4 font-bold">
                <p className="text-lg">16878</p>
                <p className="text-[#00a651] hover:underline cursor-pointer">Info@Must.Edu.Eg</p>
                <p className="opacity-80 font-normal">Al Motamayez District – 6th of October, Egypt</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="border-t border-white/10 dark:border-gray-700 flex justify-center items-center py-7 text-center text-black dark:text-gray-400 text-[15px] opacity-70">
        © 2026 Misr University for Science & Technology. All Rights Reserved.
      </div>
    </div>
  );
}