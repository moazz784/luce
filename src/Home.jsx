import React, { useState,useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import lo from "./assets/lo.png";
import { toast } from "react-toastify";
import back from "./assets/back.png";
import image5 from "./assets/400.png";
import { api } from "./Api";
import { logout } from "./authService";
import { clearAuthSession, saveRolesToSession } from "./jwtUtils";
import {
  resolveContentImage,
  localImageSets,
  staticFallbackBundle,
} from "./homeStaticFallback";
// استيراد ستايلات Swiper الأساسية
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { useTheme } from './ThemeContext'; // تأكد إن المسار لملف الـ Context مظبوط
// الأيقونات
import { 
  Search, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Menu, 
  Sun, 
  GraduationCap, 
  Mail, 
  ChevronDown,
  CheckCircle2,
  X,
  user,
  LayoutDashboard, 
  LogOut,
  Moon,
  MapPin,
  ChevronLeft,
  ChevronRight, 
  ArrowUpRight,
  User, Calendar, Clock 
} from 'lucide-react';
// ضيف السطر ده جوه الفانكشن فوق مع الـ Navigate والـ States التانية
const App = () => {
  const { isDark, setIsDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedAlumnus, setSelectedAlumnus] = useState(null);
  const [awardIndex, setAwardIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountLabel, setAccountLabel] = useState(() => {
    try {
      return (
        sessionStorage.getItem("userName") ||
        sessionStorage.getItem("email") ||
        ""
      );
    } catch {
      return "";
    }
  });

  const [newsData, setNewsData] = useState([]);
  const [slides, setSlides] = useState([]);
  const [syndicateData, setSyndicateData] = useState([]);
  const [awards, setAwards] = useState([]);
  const [events, setEvents] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [bundleLoading, setBundleLoading] = useState(true);
  const [bundleError, setBundleError] = useState("");

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [contactStatus, setContactStatus] = useState({
    submitting: false,
    error: "",
    ok: false,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setBundleLoading(true);
        setBundleError("");
        const bundle = await api("/api/public/home-bundle", { method: "GET" });
        if (cancelled) return;

        const newsList = (bundle.news || []).map((n, i) => ({
          id: n.id,
          title: n.title,
          image: resolveContentImage(n.imageUrl, localImageSets.news, i),
        }));
        setNewsData(
          newsList.length ? newsList : staticFallbackBundle.newsData
        );

        const heroSlides = (bundle.heroSlides || []).map((h, i) => ({
          id: h.id,
          image: resolveContentImage(h.imageUrl, localImageSets.hero, i),
        }));
        setSlides(
          heroSlides.length ? heroSlides : staticFallbackBundle.slides
        );

        const syndList = (bundle.syndicates || []).map((s, i) => ({
          id: s.id,
          title: s.title,
          image: resolveContentImage(s.imageUrl, localImageSets.syndicate, i),
          link: s.link,
          btnText: s.buttonText,
          color: "bg-blue-600",
        }));
        setSyndicateData(
          syndList.length ? syndList : staticFallbackBundle.syndicateData
        );

        const awardsList = (bundle.awards || []).map((a, i) => ({
          id: a.id,
          title: a.title || "",
          subtitle: a.subtitle || "",
          name:
            (a.content || a.winnerName || "").trim() ||
            a.title ||
            "",
          content: a.content || "",
          image: resolveContentImage(a.imageUrl, localImageSets.awards, i),
        }));
        setAwards(
          awardsList.length ? awardsList : staticFallbackBundle.awards
        );

        const eventsList = (bundle.events || []).map((e, i) => ({
          id: e.id,
          image: resolveContentImage(e.imageUrl, localImageSets.events, i),
          date: e.date || { day: "", month: "" },
          location: e.location || "",
          time: e.timeRange || "",
          title: e.title,
          description: e.description || "",
          color: e.accentColor || "#3b4b81",
        }));
        setEvents(
          eventsList.length ? eventsList : staticFallbackBundle.events
        );

        const alumniList = (bundle.alumni || []).map((a, i) => ({
          id: a.id,
          name: a.name,
          imageUrl: resolveContentImage(a.imageUrl, localImageSets.alumni, i),
          shortDescription: a.shortDescription || "",
          fullBio: a.fullBio || "",
        }));
        setAlumni(
          alumniList.length ? alumniList : staticFallbackBundle.alumni
        );
      } catch (err) {
        if (!cancelled) {
          setNewsData(staticFallbackBundle.newsData);
          setSlides(staticFallbackBundle.slides);
          setSyndicateData(staticFallbackBundle.syndicateData);
          setAwards(staticFallbackBundle.awards);
          setEvents(staticFallbackBundle.events);
          setAlumni(staticFallbackBundle.alumni);
          setBundleError(err.message || "تعذر تحميل المحتوى");
        }
      } finally {
        if (!cancelled) setBundleLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus({ submitting: true, error: "", ok: false });
    try {
      await api("/api/public/contact", {
        method: "POST",
        body: {
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone || undefined,
          message: contactForm.message,
        },
      });
      setContactStatus({ submitting: false, error: "", ok: true });
      setContactForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setContactStatus({
        submitting: false,
        error: err.message,
        ok: false,
      });
    }
  };

  const navLinks = [ {
      name: 'The University',
      id: 'brief',
      subItems: [
        {
          name: 'About MUST',
          link: '#',
          nestedItems: [
            { name: 'Board of Trustees', link: 'https://must.edu.eg/about-must/board-of-trustees/' },
            { name: 'President', link: 'https://must.edu.eg/about-must/president/' },
            { name: 'Vision & Mission', link: 'https://must.edu.eg/about-must/vision-mission/' },
            { name: 'MUST Values & Principles', link: 'https://must.edu.eg/about-must/must-policies/' },
            { name: 'History', link: 'https://must.edu.eg/history/' },
          ]
        },
        { 
          name: 'Sectors', 
          link: '#',
          nestedItems: [
            { name: 'Environmental And Community Service Sector', link: 'https://must.edu.eg/sectors/environmental-and-community-service-sector/' },
            { name: 'Sustainability Sector', link: 'https://must.edu.eg/sustainability-office/' },
          ]
        },
        { 
          name: 'Reports', 
          link: '#',
          nestedItems: [
            { name: 'Interdisciplinary Subjects', link: 'https://must.edu.eg/reports/interdisciplinary-science/' },
            { name: 'Financial Report', link: 'https://must.edu.eg/reports/financial-report/' },
          ]
        },
        { name: 'Policies', link: 'https://must.edu.eg/policies/' },
        { name: 'University Council Minutes', link: 'https://must.edu.eg/univeristy-council-minutes/' },
        { name: 'Quality Assurance and Accreditation Sector', link: 'https://must.edu.eg/sectors/quality-assurance-and-accreditation-sector/' },
        { name: 'Accreditation & Partnerships', link: 'https://must.edu.eg/?page_id=1660' },
        { name: 'Contact Us', link: 'https://must.edu.eg/contact/' },
        { 
          name: 'Resources', 
          link: '#' ,
          nestedItems: [
              { name: 'Smart E-Learning', link: 'https://must.edu.eg/smart-e-learning/' }
          ]
        },
      ]
    },
    { 
      name: 'Academics', 
      id: 'academics',
      subItems: [
        { name: 'Undergraduate Studies', link: 'https://must.edu.eg/academic_programs/undergraduate-studies/' },
        { name: 'Post-Graduate Program', link: 'https://must.edu.eg/academic_programs/graduate-studies/' },
        { name: 'Academic Calendar', link: 'https://must.edu.eg/academic-calendar/' },
        { name: 'International Students Affairs Sector', link: 'https://must.edu.eg/sectors/international-students-affairs-sector/' },
      ]
    },
    { name: 'Admission', link: 'https://admission.must.edu.eg/' },
    { 
      name: 'MUST BUZZ', 
      id: '2000',
      subItems: [
        { name: 'MUST Events', link: 'https://must.edu.eg/event/' },
        { name: 'MUST News', link: 'https://must.edu.eg/news/' },
        { name: 'MUST Blogs', link: 'https://must.edu.eg/blog/' },
        { name: 'Announcements', link: 'https://must.edu.eg/anouncement/' },
      ]
    },
    {
      name: 'Centers',
      id: '4000',
      subItems: [
        { name: 'Centers', link: 'https://must.edu.eg/centers/' },
        { name: 'Units', link: 'https://must.edu.eg/units/' },
        { name: 'Research Center...', link: 'https://must.edu.eg/sectors/research-center-for-public-opinion-and-societal-issues-monitoring/' },
      ]
    },
    {
      name: 'Life At MUST',
      id: '3000',
      subItems: [
        { name: 'MUST Life', link: 'https://must.edu.eg/must-life/' },
        { name: 'MUST Stars', link: 'https://must.edu.eg/stars/' },
        { name: 'MUST Clubs', link: 'https://must.edu.eg/clubs/' },
        { name: 'Facilities', link: 'https://must.edu.eg/facilities/' },
      ]
    },
    { name: 'SDGs', link: 'https://sdg.must.edu.eg/SDG/' } ];
    

  const currentAward =
    awards.length > 0
      ? awards[awardIndex % awards.length]
      : {
          id: 0,
          title: "",
          subtitle: "",
          name: "",
          content: "",
          image: "",
        };

  useEffect(() => {
    let cancelled = false;
    api("/api/auth/me", { method: "GET" })
      .then((me) => {
        if (cancelled) return;
        const rolesRaw = me.roles ?? [];
        const roles = Array.isArray(rolesRaw) ? rolesRaw.map(String) : [];
        saveRolesToSession(roles);
        const uname = me.userName ?? me.UserName ?? "";
        const em = me.email ?? me.Email ?? "";
        if (uname) sessionStorage.setItem("userName", uname);
        if (em) sessionStorage.setItem("email", em);
        setAccountLabel(uname || em || "");
        setIsLoggedIn(true);
        setIsAdmin(roles.includes("Admin"));
      })
      .catch(() => {
        if (cancelled) return;
        setIsLoggedIn(false);
        setIsAdmin(false);
        setAccountLabel("");
        clearAuthSession();
      });
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  useEffect(() => {
    if (awards.length === 0) return;
    const timer = setInterval(() => {
      setAwardIndex((prev) => (prev + 1) % awards.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [awards.length]);

  return (
    <div id='100' className="min-h-screen font-sans selection:bg-green-500 selection:text-white overflow-x-hidden">
      {bundleLoading && (
        <div className="bg-[#1a2b56] text-white text-center text-sm py-2 z-[200] relative">
          Loading content…
        </div>
      )}
      {bundleError && (
        <div className="bg-red-800 text-white text-center text-sm py-2 px-4 z-[200] relative">
          {bundleError}
        </div>
      )}
      
      {/* --- 1. Navbar --- */}
<nav className="bg-[#1a2b56] dark:bg-gray-950 text-white px-4 md:px-8 flex items-center justify-between sticky top-0 z-[100] shadow-xl h-[80px] transition-colors duration-300">
      
      {/* 1. Logo Section */}
      <div className="flex items-center gap-3 h-full cursor-pointer" onClick={() => navigate("/")}>
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center p-1 bg-white/5">
          <img src={lo} alt="Logo" className="w-full h-full object-contain rounded-full" />
        </div>

        <div className="hidden sm:block border-l border-white/20 ml-2 pl-3 text-left">
          <h1 className="text-[11px] font-bold uppercase tracking-wider">
            Misr University
          </h1>
          <p className="text-[9px] opacity-70 uppercase">
            For Science & Technology
          </p>
        </div>
      </div>

      {/* 2. Navigation Links (Desktop) */}
      <ul className="hidden lg:flex items-center gap-6 text-[13px] font-bold h-full">
        {navLinks.map((item) => (
          <li key={item.id} className="relative group flex items-center h-full">
            <a
              href={`#${item.id}`}
              className="flex items-center gap-1 uppercase hover:text-green-400 transition py-6"
            >
              {item.name}
              {item.subItems && <ChevronDown size={14} className="opacity-60 group-hover:rotate-180 transition" />}
            </a>

            {/* Dropdown Menu */}
            {item.subItems && (
              <ul className="absolute left-0 top-full w-64 bg-[#1a2b4b] dark:bg-slate-900 border-t-2 border-green-500 shadow-2xl opacity-0 invisible translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-50">
                {item.subItems.map((sub, idx) => (
                  <li key={idx} className="relative group/nested border-b border-white/5">
                    <a
                      href={sub.link}
                      className="flex justify-between px-5 py-3 text-[12px] hover:bg-green-500/10 hover:text-green-400 transition"
                    >
                      {sub.name}
                      {sub.nestedItems && <ChevronRight size={14} />}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* 3. Right Section (Auth & Controls) */}
      <div className="flex items-center gap-3 md:gap-5 border-l border-white/20 pl-4 h-full">
        
        {/* Dark Mode Toggle */}
        <button onClick={() => setIsDark(!isDark)} className="hover:text-green-400 transition-all p-1.5 hover:bg-white/5 rounded-full">
          {isDark ? <Sun size={19} className="text-yellow-400" /> : <Moon size={19} />}
        </button>

        {/* Language Switcher */}
        <span className="cursor-pointer font-bold text-sm hover:text-green-400 transition-colors">ع</span>

        {/* Authentication Logic */}
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            {/* User Info Label */}
            {accountLabel && (
              <div className="hidden xl:flex flex-col items-end mr-1">
                <span className="text-[9px] font-bold text-green-500/80 leading-none mb-1 tracking-tighter uppercase">
                  {isAdmin ? "System Admin" : "Student"}
                </span>
                <span className="text-xs font-semibold truncate max-w-[100px]">{accountLabel}</span>
              </div>
            )}

            {/* Admin Dashboard Button */}
            {isAdmin && (
              <button
                onClick={() => navigate("/AdminDashboard")}
                className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500 border border-green-500/50 text-green-400 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 group"
              >
                <LayoutDashboard size={16} className="group-hover:rotate-12 transition-transform" />
                <span className="text-[11px] font-bold uppercase hidden sm:inline">Panel</span>
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 border border-red-500/50 text-red-500 hover:text-white px-3 py-2 rounded-lg transition-all duration-300"
            >
              <LogOut size={16} />
              <span className="text-[11px] font-bold uppercase hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Login Link */}
            <button 
              onClick={() => navigate("/login")} 
              className="text-[13px] font-bold hover:text-green-400 px-3 transition-colors"
            >
              Login
            </button>
            
            {/* Register Button */}
            
          </div>
        )}
      </div>
    </nav>
<section className="relative h-[480px] md:h-[550px] w-full overflow-hidden">

  {/* Slider */}
  <Swiper
    modules={[Navigation, Pagination, Autoplay, EffectFade]}
    effect="fade"
    speed={1200}
    autoplay={{ delay: 5000, disableOnInteraction: false }}
    pagination={{ clickable: true, dynamicBullets: true }}
    navigation
    className="h-full w-full"
  >

    {slides.map((slide) => (
      <SwiperSlide key={slide.id}>
        <div
          className="relative h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url('${slide.image}')` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2b56]/80 via-[#1a2b56]/50 to-transparent dark:from-black/80 dark:via-black/40"></div>
        </div>
      </SwiperSlide>
    ))}

  </Swiper>

  {/* Content */}
  <div className="absolute inset-0 flex items-center justify-center text-center z-20 px-4">

    <div className="max-w-4xl">

      <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-xl mb-6">
        Alumni Society
      </h2>

      {/* Quick Links */}
<div className="flex flex-wrap justify-center gap-3 text-sm md:text-base font-medium">
  {[
    { name: "Home", target: "home" },
    { name: "Services", target: "6000" },
    { name: "Notable", target: "5000" },
    { name: "Awards", target: "awards" },
    { name: "Events", target: "1000" },
    { name: "News", target: "2000" },
    { name: "Syndicates", target: "moazz" },
    { name: "Contact Us", target: "3000" },
  ].map((item, i) => (
    <a
      key={i}
      href={`#${item.target}`}
      className="
        px-5 py-2
        rounded-full
        bg-white/10
        backdrop-blur-md
        border border-white/20
        text-white
        hover:bg-green-500
        hover:scale-105
        transition-all duration-300
      "
    >
      {item.name}
    </a>
  ))}
</div>

    </div>

  </div>

  {/* Social Sidebar */}
  <div className="fixed right-5 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40">

    {/* Search */}
    <a
      href="/search"
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 bg-green-500 rounded-full text-white shadow-lg hover:scale-110 hover:rotate-6 transition-all duration-300"
    >
      <Search size={20} />
    </a>

    {/* Social */}
    {[
      {
        Icon: Facebook,
        url: "https://www.facebook.com/groups/766796172340576/",
      },
      {
        Icon: Instagram,
        url: "https://www.instagram.com/accounts/login/",
      },
      {
        Icon: Twitter,
        url: "https://x.com/must_university",
      },
      {
  Icon:Linkedin,
  url: "https://www.linkedin.com/school/misr-university-for-science-and-technology/"
}
    ].map((item, idx) => (
      <a
        key={idx}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-xl hover:-translate-x-2 hover:scale-110 transition-all duration-300 flex items-center justify-center"
      >
        <item.Icon size={20} className="text-[#1a2b56] dark:text-white" />
      </a>
    ))}

  </div>

</section>

      {/* --- 3. Brief Section --- */}
     <div className="bg-white font-sans text-left" dir="ltr">
      {/* --- 1. Brief Section --- */}
      <section
  id="6000"
  className="py-16 px-6 text-center bg-white dark:bg-gray-900 transition-colors duration-300"
>
  <h2 className="text-3xl font-bold text-[#00a651] mb-6">
    Brief
  </h2>

  <div className="max-w-5xl mx-auto space-y-6">

    <p className="text-gray-700 dark:text-gray-300 text-lg font-medium leading-relaxed">
      Our goal is to prepare a distinguished graduate with the competitive ability and morals to meet the challenges of his time.
    </p>

    <p className="text-gray-700 dark:text-gray-300 text-lg font-medium leading-relaxed">
      Let us all work together in harmony and remain united with the vision of a better tomorrow for all.
    </p>

  </div>
</section>

      {/* --- 2. Alumni Services Section --- */}
<section className="py-12 px-6 lg:px-20 bg-white dark:bg-gray-900 transition-colors duration-300">

  <h2 className="text-3xl font-bold text-[#00a651] mb-12">
    Alumni Services
  </h2>

  {/* Card Service */}
  <div className="flex flex-col lg:flex-row gap-10 items-start mb-16">

    <div className="flex-1">

      <div className="flex items-center gap-3 mb-4">
        <GraduationCap size={32} className="text-[#1a2b56] dark:text-white" />
        <h3 className="text-2xl font-bold text-[#1a2b56] dark:text-white">
          Alumni excellence card
        </h3>
      </div>

      <div className="space-y-4 text-[15px] leading-relaxed">

        <p className="text-black dark:text-gray-300 font-bold">
          University graduates can receive it for a sum in Egyptian pounds and expires every two years. 
          Payment is made in cash or at one of the university's banks. Do not bring a photo with you, 
          as we will take a photo of you and issue a graduate ID immediately.
        </p>

        <p className="text-[#00a651] font-bold text-lg">
          Graduates will enjoy some benefits such as:
        </p>

        <ol className="list-decimal ml-5 space-y-2 text-gray-700 dark:text-gray-300 font-medium">
          <li>Using the university library using free stadiums</li>
          <li>Get a discount on university training courses</li>
          <li>Participating in events organized by the university, including attending conferences, meetings, seminars, exhibitions, workshops, and meetings.</li>
          <li>A range of discounts and concessions are being contracted</li>
        </ol>

        {/* Note */}
        <div className="bg-[#f0fff4] dark:bg-green-900/30 border border-[#dcfce7] dark:border-green-700 p-4 rounded-md mt-6">
          <p className="text-[#00a651] dark:text-green-300 font-bold italic">
            Note the Card activation is currently on hold. It will be announced to all alumni once it is finalized
          </p>
        </div>

      </div>
    </div>

    {/* Image */}
    <div className="w-full lg:w-[380px] shrink-0">
      <img
        src={image5}
        alt="Alumni Card"
        className="w-full rounded-[40px] shadow-xl"
      />
    </div>

  </div>

  {/* Email Service */}
  <div className="space-y-4">

    <div className="flex items-center gap-3 mb-2">
      <Mail size={32} className="text-[#1a2b56] dark:text-white" />
      <h3 className="text-2xl font-bold text-[#1a2b56] dark:text-white">
        Email Service
      </h3>
    </div>

    <p className="text-black dark:text-gray-300 font-bold">
      In cooperation with the Education Technology Department, The free Microsoft Office 365 will be launched to all alumni as a new service.
    </p>

    <p className="text-black dark:text-gray-300 font-extrabold text-lg">
      It Has Many Features Such As:
    </p>

    <ol className="list-decimal ml-5 space-y-2 text-gray-700 dark:text-gray-300 font-medium italic">
      <li>Download the latest office 365 versions that include Word, Excel, PowerPoint, Outlook and OneNote.</li>
      <li>1 TB of OneDrive Storage.</li>
      <li>Install Office on up to 5 PCs or Macs and on other mobile devices, including Android, iPad and Windows tablets</li>
    </ol>

  </div>

</section>
    </div>

      {/* --- 5. Notable Alumni (Centered Version) --- */}
<section
      id="5000"
      className="py-20 bg-[#1a2b56] dark:bg-[#0f172a] relative overflow-hidden transition-colors duration-300"
    >
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-white/60 uppercase tracking-widest text-sm font-bold">
              Notable Alumni
            </span>
            <h2 className="text-4xl font-bold text-green-400 mt-2">
              What Our Alumni Say
            </h2>
          </div>

          {/* أزرار التنقل */}
          <div className="flex gap-4">
            <button className="nav-prev p-3 border border-white/20 rounded-full text-white hover:bg-green-500 transition-all">
              <ChevronLeft size={24} />
            </button>
            <button className="nav-next p-3 border border-white/20 rounded-full text-white hover:bg-green-500 transition-all">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{ prevEl: ".nav-prev", nextEl: ".nav-next" }}
          autoplay={{ delay: 4000 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 }, // الكروت تظهر جنب بعض (4 كروت) في الشاشات الكبيرة
          }}
          className="pb-12"
        >
          {alumni.map((person) => (
            <SwiperSlide key={person.id}>
              <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 text-center h-[420px] w-full flex flex-col items-center shadow-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-2">
                
                <div className="w-24 h-24 rounded-full border-4 border-gray-100 dark:border-gray-700 overflow-hidden mb-4 group-hover:border-green-400 transition-colors">
                  <img
                    src={person.imageUrl || person.image}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-lg font-bold text-[#1a2b56] dark:text-white mb-2">
                  {person.name}
                </h3>

                <p className="text-gray-500 dark:text-gray-300 text-xs leading-relaxed mb-6 line-clamp-4">
                  {person.shortDescription || person.description}
                </p>

                <button
                  onClick={() => setSelectedAlumnus(person)}
                  className="absolute bottom-0 left-0 right-0 bg-green-500 text-white py-4 font-bold translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                >
                  Show More
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Modal - المودال كما هو بدون تغيير في الشكل */}
      {selectedAlumnus && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedAlumnus(null)}
          ></div>

          <div className="relative bg-white dark:bg-gray-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in duration-300 transition-colors">
            <button
              onClick={() => setSelectedAlumnus(null)}
              className="absolute top-5 right-5 p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-red-500 hover:text-white transition-all z-10"
            >
              <X size={20} />
            </button>

            {/* Side Info */}
            <div className="md:w-1/3 bg-gray-50 dark:bg-gray-700 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-600">
              <img
                src={selectedAlumnus.imageUrl || selectedAlumnus.image}
                className="w-32 h-32 rounded-full border-4 border-green-400 mb-4 shadow-md object-cover"
                alt=""
              />
              <h4 className="font-bold text-[#1a2b56] dark:text-white text-center">
                {selectedAlumnus.name}
              </h4>
              <span className="text-green-600 text-xs font-bold mt-1 uppercase tracking-wider">
                MUST Graduate
              </span>
            </div>

            {/* Biography */}
            <div className="md:w-2/3 p-8 overflow-y-auto max-h-[70vh]">
              <h3 className="text-xl font-bold text-[#1a2b56] dark:text-white mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
                Biography
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {selectedAlumnus.fullBio}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
      {/* --- Awards & Certificates Section --- */}
<section
  id="awards"
  className="py-24 bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-300"
>
  <div className="container mx-auto px-6 lg:px-20">

    {/* Title */}
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-[#00a651] mb-2 uppercase tracking-wide">
        Awards & Certificates
      </h2>
      <div className="h-1 w-20 bg-[#1a2b56] dark:bg-gray-600 mx-auto"></div>
    </div>

    {/* Main Container */}
    <div className="relative bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 min-h-[550px] flex flex-col lg:flex-row transition-all duration-300">

      <AnimatePresence mode="wait">

        {/* Content */}
        <motion.div
          key={`text-${awardIndex}`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5 }}
          className="flex-1 p-8 lg:p-16 flex flex-col justify-center bg-white dark:bg-gray-800 z-10"
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-[#1a2b56] dark:text-white mb-4 leading-tight">
            {/* {currentAward.title} */}
          </h3>

          {currentAward.subtitle && (
            <p className="text-lg text-[#00a651] font-semibold mb-6">
              {/* {currentAward.subtitle} */}
            </p>
          )}

          <div className="mb-6">
            {currentAward.name && (
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                {currentAward.name}
              </h4>
            )}

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic text-sm lg:text-base">
              {/* "{currentAward.content}" */}
            </p>
          </div>

          <button className="flex items-center gap-2 text-[#00a651] font-bold hover:gap-4 transition-all w-fit group">
            Go to event
            <ArrowUpRight
              size={20}
              className="group-hover:rotate-45 transition-transform"
            />
          </button>
        </motion.div>

        {/* Image */}
        <motion.div
          key={`img-${awardIndex}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 relative min-h-[300px]"
        >
          <img
            src={currentAward.image}
            alt="Award"
            className="absolute inset-0 w-full h-full object-contain"
          />

          <div className="absolute inset-0 bg-gradient-to-l from-black/5 dark:from-black/40 to-transparent hidden lg:block"></div>
        </motion.div>

      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {awards.map((_, i) => (
          <button
            key={i}
            onClick={() => setAwardIndex(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              awardIndex === i
                ? "w-10 bg-[#00a651]"
                : "w-2.5 bg-gray-300 dark:bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  </div>
</section>

<section id="1000" className="py-12 px-4 bg-white dark:bg-gray-900 font-sans transition-colors duration-300">
      <h2 className="text-3xl font-bold text-[#00a651] text-center mb-10">
        Related Events
      </h2>

      <div className="max-w-7xl mx-auto relative group">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1} // كارت واحد في الموبايل
          navigation={{
            nextEl: '.button-next',
            prevEl: '.button-prev',
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 }, // كارتين في الشاشات المتوسطة
            1024: { slidesPerView: 4 }, // 4 كروت في الشاشات الكبيرة
          }}
          className="pb-12"
        >
          {events.map((event) => (
            <SwiperSlide key={event.id}>
              <div className="flex flex-col group cursor-pointer transition-all duration-300 hover:-translate-y-2 h-full">
                {/* Image */}
                <div className="relative h-72 overflow-hidden rounded-sm">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Date Badge */}
                  <div className="absolute bottom-4 left-4 bg-[#1a3668] text-white w-14 h-16 flex flex-col items-center justify-center rounded-md shadow-lg">
                    <div className="text-2xl font-bold leading-none">{event.date.day}</div>
                    <div className="text-xs uppercase font-medium mt-1">{event.date.month}</div>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-4 space-y-2 px-1">
                  <div className="flex flex-wrap items-center text-[11px] text-gray-500 dark:text-gray-300 gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-[#8ec63f]" />
                      <span className="hover:text-[#00a651] transition-colors">{event.location}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-[#8ec63f] text-sm">🕒</span>
                      {event.time}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#1a3668] dark:text-white text-[15px] leading-tight hover:underline min-h-[40px]">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-3">
                    {event.description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* أزرار التنقل المخصصة */}
        <button className="button-prev absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md text-[#00a651] hidden lg:block border border-gray-100 dark:border-gray-700">
          <ChevronLeft size={24} />
        </button>
        <button className="button-next absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md text-[#00a651] hidden lg:block border border-gray-100 dark:border-gray-700">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="text-center mt-6">
        <button className="bg-[#00a651] hover:bg-[#008d44] text-white font-bold py-3 px-10 rounded-full transition-all duration-300 shadow-md">
          See All Events
        </button>
      </div>
    </section>
<section
  id="2000"
  className="py-16 px-6 bg-white dark:bg-gray-900 font-sans transition-colors duration-300"
  dir="ltr"
>
  {/* Title */}
  <h2 className="text-4xl font-bold text-[#00a651] text-center mb-12 uppercase tracking-wide">
    Latest News
  </h2>

  <div className="max-w-7xl mx-auto relative group">
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={30}
      slidesPerView={1}
      loop={true}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      navigation={{
        nextEl: '.swiper-button-next-custom',
        prevEl: '.swiper-button-prev-custom',
      }}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      className="pb-14"
    >
      {newsData.map((news) => (
        <SwiperSlide key={news.id}>
          <div className="flex flex-col group/card cursor-pointer bg-white dark:bg-gray-800 rounded-md overflow-hidden h-full border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all duration-300">

            {/* Image */}
            <div className="overflow-hidden aspect-video relative">
              <img
                src={news.image}
                alt="news"
                className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/5 dark:bg-black/30 group-hover/card:bg-transparent transition-all"></div>
            </div>

            {/* Content */}
            <div className="py-5 px-1 space-y-3">
              <div className="flex items-center gap-1.5 text-[#00a651]">
                <Calendar size={16} className="opacity-80" />
                <span className="w-8 h-[1px] bg-gray-200 dark:bg-gray-600"></span>
              </div>

              <h3 className="text-sm text-gray-500 dark:text-gray-300 line-clamp-4">
                {news.title}
              </h3>
            </div>

          </div>
        </SwiperSlide>
      ))}
    </Swiper>

    {/* Arrows */}
    <button className="swiper-button-prev-custom absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 shadow-lg rounded-full flex items-center justify-center text-[#1a2b56] dark:text-white hover:bg-[#00a651] hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex">
      <ChevronLeft size={24} />
    </button>

    <button className="swiper-button-next-custom absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 shadow-lg rounded-full flex items-center justify-center text-[#1a2b56] dark:text-white hover:bg-[#00a651] hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex">
      <ChevronRight size={24} />
    </button>
  </div>

  {/* Button */}
  <div className="text-center mt-8">
    <button className="border-2 border-[#00a651] text-[#00a651] hover:bg-[#00a651] hover:text-white font-bold py-3 px-12 rounded-full transition-all duration-300 shadow-sm transform active:scale-95">
      See All News
    </button>
  </div>
</section>
  <section
  id="moazz"
  className="py-16 bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300"
  dir="rtl"
>
  <div className="container mx-auto px-4">

    {/* Title */}
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">
        نقابة المهن العلمية <span className="text-blue-600">(ESSP)</span>
      </h2>
      <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full"></div>
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {syndicateData.map((item) => (
        <div
          key={item.id}
          className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-gray-700 overflow-hidden flex flex-col"
        >

          {/* Image */}
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-80 bg-white dark:bg-gray-800 p-6 overflow-hidden flex items-center justify-center border-b border-slate-50 dark:border-gray-700 cursor-pointer"
          >
            <img
              src={item.image}
              alt={item.title}
              className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/5 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="bg-white/90 dark:bg-gray-900 text-slate-800 dark:text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                اضغط لزيارة الرابط
              </span>
            </div>
          </a>

          {/* Content */}
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-slate-700 dark:text-gray-200 mb-6 uppercase tracking-wide">
              {item.title}
            </h3>

            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block w-full py-3 px-6 text-white font-bold rounded-xl shadow-md transition-all duration-200 transform active:scale-95 ${item.color} hover:brightness-110`}
            >
              {item.btnText}
            </a>
          </div>

        </div>
      ))}
    </div>

  </div>
</section>
<section
  id="3000"
  className="relative w-full h-[500px] lg:h-[600px] overflow-hidden"
>
  {/* Background Image */}
  <img
    src={back}
    alt="Background"
    className="absolute inset-0 w-full h-[450px] object-cover bg-bottom-left opacity-60 dark:opacity-40 transition-all duration-300"
  />

  {/* Overlay خفيف في الدارك */}
  <div className="absolute inset-0 bg-black/20 dark:bg-black/50 transition-all duration-300"></div>

  {/* Text */}
  <div className="absolute inset-0 flex items-center px-10 lg:px-20 z-10">
    <div className="max-w-xl text-white">
      <h2 className="text-4xl lg:text-5xl font-bold mb-4">
        Reach us on any time.
      </h2>
      <p className="text-xl font-semibold mb-2">
        Or contact us by email
      </p>
    </div>
  </div>

  {/* Contact Form */}
  <div className="absolute right-10 lg:right-20 top-1/2 -translate-y-1/2 z-20 w-full max-w-[450px] hidden md:block">
    <div className="bg-white dark:bg-gray-800 shadow-2xl p-8 rounded-sm border-t-4 border-green-500 transition-colors duration-300">

      <h3 className="text-[#1a2b56] dark:text-white text-3xl font-bold mb-6">
        Leave a message
      </h3>

      <form className="space-y-4" onSubmit={handleContactSubmit}>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            required
            value={contactForm.name}
            onChange={(e) =>
              setContactForm((f) => ({ ...f, name: e.target.value }))
            }
            className="p-3 bg-gray-100 dark:bg-gray-700 text-black dark:text-white outline-none focus:ring-1 focus:ring-green-500 text-sm"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={contactForm.email}
            onChange={(e) =>
              setContactForm((f) => ({ ...f, email: e.target.value }))
            }
            className="p-3 bg-gray-100 dark:bg-gray-700 text-black dark:text-white outline-none focus:ring-1 focus:ring-green-500 text-sm"
          />
        </div>

        <input
          type="text"
          placeholder="Phone"
          value={contactForm.phone}
          onChange={(e) =>
            setContactForm((f) => ({ ...f, phone: e.target.value }))
          }
          className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-black dark:text-white outline-none focus:ring-1 focus:ring-green-500 text-sm"
        />

        <textarea
          placeholder="Say Something"
          rows="3"
          required
          value={contactForm.message}
          onChange={(e) =>
            setContactForm((f) => ({ ...f, message: e.target.value }))
          }
          className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-black dark:text-white outline-none focus:ring-1 focus:ring-green-500 text-sm resize-none"
        />

        {contactStatus.error && (
          <p className="text-red-600 text-sm">{contactStatus.error}</p>
        )}
        {contactStatus.ok && (
          <p className="text-green-600 text-sm">Message sent. Thank you.</p>
        )}

        <button
          type="submit"
          disabled={contactStatus.submitting}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 rounded-full transition-all"
        >
          {contactStatus.submitting ? "Sending…" : "Send Message"}
        </button>

      </form>
    </div>
  </div>
</section>
<footer className="bg-[#1a2b56] dark:bg-black text-white pt-20 pb-10 border-t-4 border-white/10 dark:border-gray-700 transition-colors duration-300">
  <div className="container mx-auto px-6">
    
    {/* Logo */}
    <div className="flex justify-center mb-16">
      <div className="p-4 rounded-full w-44 h-44 flex items-center justify-center">
        <img src={lo} alt="MUST Logo" className="w-44" />
      </div>
    </div>

    {/* Links Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-sm">

      {/* Column 1 */}
      <div>
        <h4 className="text-[#00a651] font-bold mb-6 text-base">Links</h4>
        <ul className="space-y-3 text-white/80 dark:text-gray-300">
          <li className="hover:text-green-400 cursor-pointer transition-colors">Home</li>
          <li className="hover:text-green-400 cursor-pointer transition-colors">The University</li>
          <li className="hover:text-green-400 cursor-pointer transition-colors">Academics</li>
          <li className="hover:text-green-400 cursor-pointer transition-colors">Life At MUST</li>
          <li className="hover:text-green-400 cursor-pointer transition-colors">FAQs</li>
        </ul>
      </div>

      {/* Column 2 */}
      <div>
        <h4 className="text-[#00a651] font-bold mb-6 text-base">About University</h4>
        <ul className="space-y-3 text-white/80 dark:text-gray-300">
          <li className="hover:text-green-400 cursor-pointer transition-colors">About MUST</li>
          <li className="hover:text-green-400 cursor-pointer transition-colors">History</li>
          <li className="hover:text-green-400 cursor-pointer transition-colors">Accreditation</li>
          <li className="hover:text-green-400 cursor-pointer transition-colors">Why MUST</li>
          <li className="hover:text-green-400 cursor-pointer transition-colors">Privacy Policy</li>
        </ul>
      </div>

      {/* Column 3 */}
      <div>
        <h4 className="text-[#00a651] font-bold mb-6 text-base">MUST BUZZ</h4>
        <ul className="space-y-3 text-white/80 dark:text-gray-300">
          <li className="hover:text-green-400 cursor-pointer transition-colors">MUST Events</li>
          <li className="hover:text-green-400 cursor-pointer transition-colors">MUST News</li>
          <li className="hover:text-green-400 cursor-pointer transition-colors">Blog</li>
          <li className="hover:text-green-400 cursor-pointer transition-colors">Announcement</li>
        </ul>
      </div>

      {/* Column 4 */}
      <div>
        <h4 className="text-[#00a651] font-bold mb-6 text-base">Contact Info</h4>
        <div className="space-y-4 font-bold text-white dark:text-gray-300">
          <p className="text-lg">16878</p>
          <p className="text-[#00a651] hover:underline cursor-pointer">
            Info@Must.Edu.Eg
          </p>
          <p className="opacity-80 font-normal leading-relaxed">
            Al Motamayez District – 6th of October, Egypt
          </p>
        </div>
      </div>

    </div>
  </div>
</footer>
    <div className="border-t border-white/10 dark:border-gray-700 flex justify-center items-center py-7 text-center text-black dark:text-gray-400 text-[15px] opacity-70 dark:opacity-80 transition-colors duration-300">
  © 2026 Misr University for Science & Technology. All Rights Reserved.
</div>
    </div>
  );
};

export default App;