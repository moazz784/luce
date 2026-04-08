import React, { useState,useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
// استيراد الصور المحلية
import image from "./assets/logos.jpg";
import image2 from "./assets/100.jpg";
import backs from "./assets/back22.jpg";
import image3 from "./assets/200.jpg";
import image8 from "./assets/zoza.jpg";
import image6 from "./assets/zaz.jpg";
import image9 from "./assets/zoz.jpg";
import image22 from "./assets/222.jpg";
import image33 from "./assets/333.jpg";
import image7 from "./assets/zaza.jpeg";
import image11 from "./assets/111.jpeg";
import image111 from "./assets/ege.jpeg";
import image1111 from "./assets/ssss.jpeg";
import m11 from "./assets/m11.jpeg";
import m22 from "./assets/m22.jpeg";
import m33 from "./assets/m33.jpeg";
import m44 from "./assets/m44.jpeg";
import m55 from "./assets/m55.jpeg";
import z11 from "./assets/z11.jpeg";
import loz from "./assets/loz.jpeg";
import loz2 from "./assets/loz2.jpeg";
import loz3 from "./assets/loz3.jpeg";
import loz44 from "./assets/loz44.jpeg";
import z22 from "./assets/z22.jpeg";
import z33 from "./assets/z33.jpeg";
import z44 from "./assets/z44.jpeg";
import a11 from "./assets/a11.jpeg";
import a22 from "./assets/a22.jpeg";
import a33 from "./assets/a33.jpeg";
import a44 from "./assets/a44.jpeg";
import mmm from "./assets/mmm.jpeg";
import s11 from "./assets/s11.jpeg";
import s22 from "./assets/s22.jpeg";
import s33 from "./assets/s33.jpeg";
import s44 from "./assets/s44.jpeg";
import image4 from "./assets/300.png";
import image5 from "./assets/400.png";
import lo from "./assets/lo.png";
import sasa from "./assets/1000.png";
import sas from "./assets/2000.png";
import sass from "./assets/3000.png";
// import logos from "./assets/logos.png";
import sasss from "./assets/4000.png";
import back from "./assets/back.png";
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
  const [selectedAlumnus, setSelectedAlumnus] = useState(null);
  const [awardIndex, setAwardIndex] = useState(0);
 const [isAdmin, setIsAdmin] = useState(false);
  // --- البيانات (Data) - سيبتها لك زي ما هي بالظبط ---
  const newsData = [
    {
      id: 1,
      image: m11,
      title: 'Misr University for Science and Technology (MUST) is proud to announce the opening of applications for Teaching Assistant positions. We are looking for our top-performing graduates from the classes of 2022, 2023, and 2024 to join the Faculty of Information Technology and contribute to our academic excellence'
    },
    {
      id: 2,
      image: m22,
      title: 'The Faculty of Information Technology at Misr University for Science and Technology (MUST) is announcing vacancies for Teaching Assistant positions for the 2024-2025 class. We are seeking talented candidates in Computer Science, Information Systems, and Artificial Intelligence. Interested applicants should submit their documents to it.faculty@must.edu.eg before September 25, 2025'
    },
    {
      id: 3,
      image: m33,
      title: 'Master’s Degree in Computer Science – Now Open for Applications! 🎓 Join the Faculty of IT at MUST University for an intensive 18-month program (36 credit hours). Future-proof your career and apply today by scanning the QR code in the image!"'
    }
  ];

  const alumni = [
    {
      id: 1,
      name: "Ahmed Hesham Douma",
      image: a11,
      description: "Ahmed Hesham Douma, 🎓💻 a 2013 Information Technology and Artificial Intelligence graduate from MUST, is now the founder of TechieVai in Germany 🇩🇪.",
      fullBio: "Ahmed Hesham Douma, 🎓💻 a 2013 Information Technology and Artificial Intelligence graduate from MUST, is now the founder of TechieVai in Germany 🇩🇪.\n\nHis passion for computer science, combined with the education he received at MUST, ignited his journey into the world of Embedded Systems and Automotive Software Engineering .\n\nHe began his career at VALEO, then moved to Germany where he took on key roles at BOSCH and BOSE, contributing to the advancement of automotive technologies .\n\nToday, he’s leading innovation in safety-critical systems through his own consultancy .\n\nAlong the way, he also earned a Master’s degree in Management and International Marketing in Germany , a clear reflection of his continuous growth and commitment to excellence. "
    },
    {
      id: 2,
      name: "Abdulrahman AlGhamdi",
      image: a44,
      description: "Abdulrahman AlGhamdi, Class of 2011, a strong foundation in cybersecurity. The education he gained at the university enabled him to advance into key security roles",
     fullBio: "The College of Information Technology and Artificial Intelligence at MUST provided Abdulrahman AlGhamdi, Class of 2011, a strong foundation in cybersecurity. The education he gained at the university enabled him to advance into key security roles, contributing to national initiatives under Saudi Vision 2030 while working with PIF and the Royal Court. With over 14 years of experience, he continues to lead major security transformations, ensuring top protection standards for organizations."
    },
    {
      id: 3,
      name: "Samer Wagdy ",
      image: a22,
      description: "Samer Wagdy  , 2014 Information Technology and Artificial Intelligence graduates.. transformed their graduation project into GBarena,",
      fullBio: "Samer Wagdy  , 2014 Information Technology and Artificial Intelligence graduates, transformed their graduation project into GBarena, a startup that became a leading gaming and esports platform in the region, after winning first place at Microsoft's Imagine Cup.\n\nThese two passionate entrepreneurs went from classmates to co-founders, showing how the right education, ambition, and friendship can spark global success.\n\nToday, with investors from KSA, the UAE, and Egypt, they continue to innovate and expand, proving that the opportunities at MUST extend far beyond graduation!"
    },
    {
      id: 4,
      name: "Mostafa Zaza",
      image: a33,
      description: " Mostafa Zaza , 2014 Information Technology and Artificial Intelligence graduates.. transformed their graduation project into GBarena,",
      fullBio: "Samer Wagdy  , 2014 Information Technology and Artificial Intelligence graduates, transformed their graduation project into GBarena, a startup that became a leading gaming and esports platform in the region, after winning first place at Microsoft's Imagine Cup.\n\nThese two passionate entrepreneurs went from classmates to co-founders, showing how the right education, ambition, and friendship can spark global success.\n\nToday, with investors from KSA, the UAE, and Egypt, they continue to innovate and expand, proving that the opportunities at MUST extend far beyond graduation!"
    }
  ];

  const slides = [
    { id: 1, image: backs },
    { id: 2, image: mmm },
    { id: 3, image: loz },
    { id: 4, image: loz2 },
    { id: 5, image: loz3}
  ];

  const syndicateData = [
    { 
      id: 1, 
      title: "الشعار الرسمي", 
      image: image111, 
      link: "https://www.facebook.com/EsspEgypt",
      btnText: "صفحة الفيسبوك"
    },
    { 
      id: 2, 
      title: "كيفيه الاشتراكات", 
      image: image1111, 
      link: "https://www.hugedomains.com/domain_profile.cfm?d=esspegypt.com&sfnsn=scwspwa",
      btnText: "الموقع الرسمي"
    }
  ];

  const awards = [
    {
      id: 1,
      title: "MUST Is A Pioneer In Getting Awards In All Fields Thanks To Its Precious Leading Authority And Success Seeking Students.",
      subtitle: "Kerolos Mousa",
      name: "The team from Misr University for Science and Technology (MUST) won first place in Egypt and third place in the Arab world, qualifying for the Imagine Cup global competition, which will be held in Seattle, USA, at the end of July. Under the slogan 'Dream... Build your dream and live it,' the sole Egyptian representative team will compete in the global competition, where qualified teams from universities around the world will vie to develop practical solutions for improving life globally using technology. The competition aims to provide more opportunities for students worldwide to acquire the skills that will help them innovate and turn ideas into reality. The winning team consists of three students: Samer Wagdy, Mostafa Zaza, and Hussein El-Sawy, all from the Faculty of Information Technology at MUST.",
      content: "",
      image: s11,
    },
    {
      id: 2,
      title: "MUST Is A Pioneer In Getting Awards In All Fields Thanks To Its Precious Leading Authority And Success Seeking Students.",
      subtitle: "Mostafa",
      name: "We have saved the third place in Imagine Cup World Simi-final 'Pan Arab' Innovation category for Egypt our lovely country, which was held in Qatar, competing with 23 teams from 13 Arab country. It was a great honor to meet all of that innovators around the Arab world :)",
      image: s22,
    },
   {
      id: 3,
      title: "MUST Is A Pioneer In Getting Awards In All Fields Thanks To Its Precious Leading Authority And Success Seeking Students.",
      subtitle: "Mostafa",
      name: "With more than 2700 applied startups, GBarena got selected among 70 other startups to be funded by the French government with incubation for one year in Marseille at Belle de Mai, to helping us enter the European esports market.",
      image: s33,
    },
    {
      id: 4,
      title: "MUST Is A Pioneer In Getting Awards In All Fields Thanks To Its Precious Leading Authority And Success Seeking Students.",
      subtitle: "Mostafa",
      name: "GBarena has been selected to be one of the 50 startup world cup finalist projects from all over the world competing with the most promising startups in Copenhagen",
      image: s33,
    },
    {
      id: 5,
      title: "MUST Is A Pioneer In Getting Awards In All Fields Thanks To Its Precious Leading Authority And Success Seeking Students.",
      subtitle: "Mostafa",
      name: "The prize rewards entrepreneurs for developing products or services that use ICT in an innovative way to achieve social impact and meet the needs of Africans in the energy field. 'Twinkle Box'. Officially Honored by Mobinil Egypt for our achievement",
      image: s44,
    }
  ];

  const events = [
    {
      id: 1,
      image: z11,
      date: { day: '06', month: 'Nov' },
      location: 'Conference Hall',
      time: '11:00 am - 5:00 pm',
      title: 'College of Information Technology conference entitle...',
      description: 'As inspirational as it gets! We couldn’t be more proud of our MUSTians sharing their success stories on the MUST stage.',
      color: 'bg-[#3b4b81]'
    },
    {
      id: 2,
      image: z22,
      date: { day: '11', month: 'Feb' },
      location: 'Conference Hall',
      time: '10:00 am - 3:00 pm',
      title: 'International Day for Women and Girls...',
      description: 'Get ready to take in all the business slang and principles from the best in the field in the  “BUSINESS 101” panel discussion!',
      color: 'bg-[#3b4b81]'
    },
    {
      id: 3,
      image: z33,
      date: { day: '11', month: 'Dec' },
      location: 'MUST Golf Garden',
      time: '10:00 am - 7:00 pm',
      title: 'MUST Winter Festival',
      description: 'Ready to revive cozy winter nights? How\'s that...slang and principles from the best in the field in the songs',
      color: 'bg-[#3b4b81]'
    },
    {
      id: 4,
      image: z44,
      date: { day: '23', month: 'Feb' },
      location: 'Conference Hall',
      time: '10:00 am - 5:00 pm',
      title: 'MUST Cultural Day',
      description: 'Snippets from the “AI and Digital Transformation” panel, as industry leaders discuss how AI is reshaping the landscape of digital transformation and its impact on business strategies.',
      color: 'bg-[#00a651]'
    }
  ];

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
    

  // --- 💡 التعديل هنا: تعريف المتغير والـ Effect داخل الفانكشن ---
  const currentAward = awards[awardIndex];
useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    setIsAdmin(true);
  } else {
    setIsAdmin(false);
  }
}, []);
 useEffect(() => {
  const timer = setInterval(() => { 
    setAwardIndex((prev) => (prev + 1) % awards.length);
  }, 6000);

  return () => clearInterval(timer); 
}, [awards.length]);

  return (
    // هنا كود الـ JSX بتاعك
    <div id='100' className="min-h-screen font-sans selection:bg-green-500 selection:text-white overflow-x-hidden">
      
      {/* --- 1. Navbar --- */}
   <nav className="bg-[#1a2b56] dark:bg-gray-950 text-white px-4 md:px-8 flex items-center justify-between sticky top-0 z-[100] shadow-xl h-[80px]">

      {/* Logo */}
      <div className="flex items-center gap-3 h-full">
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center p-1">
          <img src={lo} alt="Logo" className="w-full h-full object-contain rounded-full" />
        </div>

        <div className="hidden sm:block border-l border-white/20 ml-2 pl-3 text-left">
          <h1 className="text-[11px] font-bold uppercase">
            Misr University
          </h1>
          <p className="text-[9px] opacity-70 uppercase">
            For Science & Technology
          </p>
        </div>
      </div>

      {/* Links */}
      <ul className="hidden lg:flex items-center gap-6 text-[13px] font-bold h-full">
        {navLinks.map((item) => (
          <li key={item.id} className="relative group flex items-center h-full">

            <a
              href={`#${item.id}`}
              className="flex items-center gap-1 uppercase hover:text-green-400 transition py-6"
            >
              {item.name}

              {item.subItems && (
                <ChevronDown size={14} className="opacity-60 group-hover:rotate-180 transition" />
              )}
            </a>

            {/* Dropdown */}
            {item.subItems && (
              <ul className="absolute left-0 top-full w-64 bg-[#1a2b4b] border-t-2 border-green-500 shadow-2xl opacity-0 invisible translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-50">

                {item.subItems.map((sub, idx) => (
                  <li key={idx} className="relative group/nested border-b border-white/5">

                    <a
                      href={sub.link}
                      className="flex justify-between px-5 py-3 text-[12px] hover:bg-[#243b6b] hover:text-green-400 transition"
                    >
                      {sub.name}
                      {sub.nestedItems && <ChevronRight size={14} />}
                    </a>

                    {/* Nested */}
                    {sub.nestedItems && (
                      <ul className="absolute left-full top-0 w-64 bg-[#1a2b4b] border-l-2 border-green-500 shadow-2xl opacity-0 invisible translate-x-2 group-hover/nested:visible group-hover/nested:opacity-100 group-hover/nested:translate-x-0 transition-all duration-300 z-[60]">

                        {sub.nestedItems.map((nested, nIdx) => (
                          <li key={nIdx}>
                            <a
                              href={nested.link}
                              className="block px-5 py-3 text-[12px] hover:bg-[#243b6b] hover:text-green-400 transition"
                            >
                              {nested.name}
                            </a>
                          </li>
                        ))}

                      </ul>
                    )}
                  </li>
                ))}

              </ul>
            )}

          </li>
        ))}
      </ul>

      {/* Right */}
      <div className="flex items-center gap-4 border-l border-white/20 pl-4 h-full">

        {/* Dark Mode */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="hover:text-green-400 transition p-1"
        >
          {isDark ? (
            <Sun size={20} className="text-yellow-400" />
          ) : (
            <Moon size={20} />
          )}
        </button>

        {/* Language */}
        <span className="cursor-pointer font-bold text-sm hover:text-green-400">
          ع
        </span>

        {/* Conditional UI */}
        {isAdmin ? (
          <>
            {/* Dashboard */}
            <button
              onClick={() => navigate("/AdminDashboard")}
              className="p-2 border border-white/20 rounded hover:border-green-400 transition"
            >
              Dashboard
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 transition px-4 py-1.5 rounded-full font-bold"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-green-500 hover:bg-cyan-500 transition px-4 py-1.5 rounded-full font-bold"
          >
            Login
          </button>
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
      <div className="flex flex-wrap justify-center gap-3 text-sm md:text-base font-medium bg-black/40 backdrop-blur-lg px-6 py-3 rounded-full border border-white/10 text-white">

        {[
          { name: "Home", target: "home" },
          { name: "Services", target: "6000" },
          { name: "Notable", target: "5000" },
          { name: "Awards", target: "awards" },
          { name: "Events", target: "1000" },
          { name: "News", target: "2000" },
          { name: "Syndicates", target: "moazz" },
          { name: "Contact Us", target: "3000" },
        ].map((item, i, arr) => (
          <React.Fragment key={i}>
            <a
              href={`#${item.target}`}
              className="hover:text-green-400 transition-colors duration-300"
            >
              {item.name}
            </a>

            {i !== arr.length - 1 && (
              <span className="text-green-400 opacity-70">→</span>
            )}
          </React.Fragment>
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
          What Our Alumni Say's
        </h2>
      </div>

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
      spaceBetween={30}
      slidesPerView={1}
      navigation={{ prevEl: ".nav-prev", nextEl: ".nav-next" }}
      autoplay={{ delay: 4000 }}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: {
          slidesPerView: alumni.length < 4 ? alumni.length : 4,
        },
      }}
      className="pb-12 !flex !justify-center"
    >
      {alumni.map((person) => (
        <SwiperSlide key={person.id} className="flex justify-center">
          <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 text-center h-[420px] w-full max-w-[320px] flex flex-col items-center shadow-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-2">

            <div className="w-30 h-30 rounded-full border-4 border-gray-100 dark:border-gray-700 overflow-hidden mb-2 group-hover:border-green-400 transition-colors">
              <img
                src={person.image}
                alt={person.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-lg font-bold text-[#1a2b56] dark:text-white mb-2">
              {person.name}
            </h3>

            <p className="text-gray-500 dark:text-gray-300 text-xs leading-relaxed mb-6 line-clamp-4">
              {person.description}
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

  {/* Modal */}
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

        {/* Left */}
        <div className="md:w-1/3 bg-gray-50 dark:bg-gray-700 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-600">
          <img
            src={selectedAlumnus.image}
            className="w-33 h-33 rounded-full border-4 border-green-400 mb-4 shadow-md"
            alt=""
          />
          <h4 className="font-bold text-[#1a2b56] dark:text-white text-center">
            {selectedAlumnus.name}
          </h4>
          <span className="text-green-600 text-xs font-bold mt-1 uppercase tracking-wider">
            MUST Graduate
          </span>
        </div>

        {/* Right */}
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

<section
  id="1000"
  className="py-12 px-4 bg-white dark:bg-gray-900 font-sans transition-colors duration-300"
  dir="ltr"
>
  <h2 className="text-3xl font-bold text-[#00a651] text-center mb-10">
    Related Events
  </h2>

  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {events.map((event) => (
      <div
        key={event.id}
        className="flex flex-col group cursor-pointer transition-all duration-300 hover:-translate-y-2"
      >

        {/* Image */}
        <div className="relative h-74 overflow-hidden rounded-sm">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Date Badge */}
          <div className="absolute bottom-4 left-4 bg-[#1a3668] text-white w-14 h-16 flex flex-col items-center justify-center rounded-md shadow-lg">
            <div className="text-2xl font-bold leading-none">
              {event.date.day}
            </div>
            <div className="text-xs uppercase font-medium mt-1">
              {event.date.month}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 space-y-2 px-1">
          
          {/* Location & Time */}
          <div className="flex flex-wrap items-center text-[11px] text-gray-500 dark:text-gray-300 gap-3">
            <span className="flex items-center gap-1">
              <MapPin size={14} className="text-[#8ec63f]" />
              <span className="hover:text-[#00a651] transition-colors">
                {event.location}
              </span>
            </span>

            <span className="flex items-center gap-1">
              <span className="text-[#8ec63f] text-sm">🕒</span>
              {event.time}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-[#1a3668] dark:text-white text-[15px] leading-tight hover:underline min-h-[40px]">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-5">
            {event.description}
          </p>
        </div>
      </div>
    ))}
  </div>

  {/* Button */}
  <div className="text-center mt-12">
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

      <form className="space-y-4">

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="p-3 bg-gray-100 dark:bg-gray-700 text-black dark:text-white outline-none focus:ring-1 focus:ring-green-500 text-sm"
          />
          <input
            type="email"
            placeholder="Email"
            className="p-3 bg-gray-100 dark:bg-gray-700 text-black dark:text-white outline-none focus:ring-1 focus:ring-green-500 text-sm"
          />
        </div>

        <input
          type="text"
          placeholder="Phone"
          className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-black dark:text-white outline-none focus:ring-1 focus:ring-green-500 text-sm"
        />

        <textarea
          placeholder="Say Something"
          rows="3"
          className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-black dark:text-white outline-none focus:ring-1 focus:ring-green-500 text-sm resize-none"
        ></textarea>

        {/* Fake Captcha */}
        <div className="border border-gray-200 dark:border-gray-600 p-3 flex justify-between items-center text-xs text-gray-500 dark:text-gray-300 transition-colors">
          <div className="flex items-center gap-2">
            <input type="checkbox" />
            <span>I'm not a robot</span>
          </div>
          <img
            src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
            className="w-6 opacity-50"
            alt="recap"
          />
        </div>

        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-full transition-all">
          Send Message
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