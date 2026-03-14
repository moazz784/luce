import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// استيراد الصور المحلية
import image from "./assets/logo.webp";
import image2 from "./assets/100.jpg";
import image3 from "./assets/200.jpg";
import image4 from "./assets/300.png";
import image5 from "./assets/400.png";

// استيراد ستايلات Swiper الأساسية
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

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
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight, 
  ArrowUpRight 
} from 'lucide-react';

const App = () => {
  // --- تعاريف الـ State ---
  const [selectedAlumnus, setSelectedAlumnus] = useState(null);

  // --- البيانات (Data) ---
  
  const alumni = [
    {
      id: 1,
      name: "Ahmed Hesham Douma",
      image: image2,
      description: "Ahmed Hesham Douma, 🎓💻 a 2013 Information Technology and Artificial Intelligence graduate from MUST, is now the founder of TechieVai in Germany 🇩🇪.",
      fullBio: "Ahmed Hesham Douma, 🎓💻 a 2013 Information Technology and Artificial Intelligence graduate from MUST, is now the founder of TechieVai in Germany 🇩🇪.\n\nHis passion for computer science, combined with the education he received at MUST, ignited his journey into the world of Embedded Systems and Automotive Software Engineering .\n\nHe began his career at VALEO, then moved to Germany where he took on key roles at BOSCH and BOSE, contributing to the advancement of automotive technologies .\n\nToday, he’s leading innovation in safety-critical systems through his own consultancy .\n\nAlong the way, he also earned a Master’s degree in Management and International Marketing in Germany , a clear reflection of his continuous growth and commitment to excellence. "
    },
    {
      id: 2,
      name: "Ahmed Hatem",
      image: image3,
      description: "An Egyptian actor who studied media in the faculty of mass communication...",
      fullBio: "Ahmed Hatem is a celebrated Egyptian actor known for his versatile roles in cinema and television. He credits his time at the Faculty of Mass Communication at MUST for shaping his early career."
    },
    {
      id: 3,
      name: "Samer Wagdy & Mostafa Zaza",
      image: image4,
      description: "Samer Wagdy and Mostafa Zaza , 2014 Information Technology and Artificial Intelligence graduates...",
      fullBio: "Samer Wagdy  , 2014 Information Technology and Artificial Intelligence graduates, transformed their graduation project into GBarena, a startup that became a leading gaming and esports platform in the region, after winning first place at Microsoft's Imagine Cup.\n\nThese two passionate entrepreneurs went from classmates to co-founders, showing how the right education, ambition, and friendship can spark global success.\n\nToday, with investors from KSA, the UAE, and Egypt, they continue to innovate and expand, proving that the opportunities at MUST extend far beyond graduation!"
    }
  ];

  const slides = [
    { id: 1, image: "https://images.unsplash.com/photo-1523050853063-9158946122a2?q=80&w=2000" },
    { id: 2, image: "https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?q=80&w=2000" },
    { id: 3, image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000" }
  ];
  const awards = [
    {
      id: 1,
      title: "MUST Is A Pioneer In Getting Awards In All Fields",
      subtitle: "Thanks To Its Precious Leading Authority And Success Seeking Students.",
      name: "Kerolos Mousa",
      content: "Agaypi Was An Undergraduate Student At The College Of Biotechnology At Misr University For Science And Technology In Egypt. He Was Offered To Join A Group Of Researchers At The Harvard School Of Engineering And Applied Sciences...",
      image: "https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?q=80&w=1000", // صورة تعبيرية لهارفارد
    },
    {
      id: 2,
      title: "Global Innovation Award 2025",
      subtitle: "Recognizing Excellence in Engineering and Technology.",
      name: "Sarah Ahmed",
      content: "Sarah represented MUST in the International Engineering Competition and secured the first place for her innovative water purification system design...",
      image: "https://images.unsplash.com/photo-1523240715632-d984bb4b970e?q=80&w=1000",
    },
    {
      id: 3,
      title: "Medical Research Excellence",
      subtitle: "Pushing the boundaries of modern medicine.",
      name: "Dr. Omar Ali",
      content: "A graduate of the Faculty of Medicine who published a groundbreaking research paper on AI in early cancer detection in a world-renowned medical journal...",
      image: "https://images.unsplash.com/photo-1576091160550-2173dad9998e?q=80&w=1000",
    },
    {
      id: 4,
      title: "Leading Entrepreneurship Hub",
      subtitle: "Empowering the next generation of business leaders.",
      name: "Mona Hassan",
      content: "Founder of a Green-Tech startup that received funding from major investors in the MENA region, starting from the MUST incubation center...",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000",
    },
    {
      id: 5,
      title: "Social Impact Recognition",
      subtitle: "Commitment to Sustainable Development Goals.",
      name: "Youssef Zayed",
      content: "Leading a volunteer initiative that provided educational resources to over 10,000 children, recognized by the United Nations...",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000",
    }
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-green-500 selection:text-white overflow-x-hidden">
      
      {/* --- 1. Navbar --- */}
      <nav className="bg-[#1a2b56] text-white px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-[100] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 shadow-inner">
            <img src={image} alt="Logo" className="object-cover" />
          </div>
          <div className="hidden sm:block border-l border-white/20 pl-3">
            <h1 className="text-[11px] font-bold leading-tight tracking-wider uppercase">Misr University</h1>
            <p className="text-[9px] opacity-70 tracking-tighter uppercase font-medium">For Science & Technology</p>
          </div>
        </div>

        <ul className="hidden lg:flex items-center gap-6 text-[13px] font-bold">
          {['The University', 'Academics', 'Admission', 'MUST BUZZ', 'Centers', 'Life At MUST', 'SDGs'].map((item) => (
            <li key={item} className="cursor-pointer transition-all duration-300 hover:text-green-400 list-none">{item}</li>
          ))}
        </ul>

        <div className="flex items-center gap-5 border-l border-white/20 pl-5">
          <Sun size={19} className="cursor-pointer hover:rotate-45 transition-transform" />
          <span className="cursor-pointer font-bold text-sm hover:text-green-400">ع</span>
          <Menu size={24} className="cursor-pointer" />
        </div>
      </nav>

      {/* --- 2. Hero Slider --- */}
      <section className="relative h-[480px] md:h-[550px] w-full overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect={'fade'}
          speed={1200}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={true}
          className="h-full w-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('${slide.image}')` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a2b56]/80 to-[#1a2b56]/40"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="text-center px-4 max-w-4xl pointer-events-auto">
             <h2 className="text-5xl md:text-7xl font-extrabold mb-6 text-white drop-shadow-2xl">Alumni</h2>
             <div className="flex items-center justify-center gap-3 text-sm md:text-base font-medium bg-black/30 backdrop-blur-md py-2 px-6 rounded-full border border-white/10 w-fit mx-auto text-white">
              <span>Home</span> <span className="text-green-500">→</span>
              <span>Academics</span> <span className="text-green-500">→</span>
              <span className="font-bold">Resources & Degrees Awards</span>
            </div>
          </div>
        </div>

        {/* Social Sidebar */}
        <div className="fixed right-5 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40">
          <button className="p-3 bg-green-500 rounded-full text-white shadow-lg hover:scale-110 transition-all"><Search size={20} /></button>
          {[Linkedin, Facebook, Instagram, Twitter].map((Icon, idx) => (
            <button key={idx} className="p-3 bg-white rounded-full shadow-xl hover:-translate-x-2 transition-all duration-300">
              <Icon size={20} className="text-[#1a2b56]" />
            </button>
          ))}
        </div>
      </section>

      {/* --- 3. Brief Section --- */}
      <section className="bg-white py-20 px-6 text-center">
        <h3 className="text-4xl font-bold text-[#00a651] mb-2">Brief</h3>
        <div className="h-1 w-16 bg-[#1a2b56] mx-auto mb-8"></div>
        <p className="text-gray-700 text-xl md:text-2xl italic max-w-4xl mx-auto leading-relaxed">
          "Our goal is to prepare a distinguished graduate with the competitive ability and morals to meet the challenges of his time."
        </p>
      </section>

      {/* --- 4. Alumni Services --- */}
      <section className="w-full py-16 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-bold text-[#00a651] mb-2">Alumni Services</h2>
          <div className="h-1 w-20 bg-[#1a2b56] mb-12"></div>
          
          {/* Card Service */}
          <div className="flex flex-col lg:flex-row gap-12 items-start mb-20">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1a2b56] rounded-lg text-white"><GraduationCap size={28} /></div>
                <h3 className="text-2xl font-bold text-[#1a2b56]">Alumni excellence card</h3>
              </div>
              <p className="text-gray-700 font-semibold leading-relaxed">
                University graduates can receive it immediately. Do not bring a photo, we issue it for you right away!
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Library & Stadium Access", "Course Discounts", "Event Access", "Special Concessions"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2 size={18} className="text-[#00a651]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <img src={image5} className="w-full lg:w-[400px] rounded-2xl shadow-2xl" alt="Card" />
          </div>

          {/* Email Service (تمت إعادته) */}
          <div className="bg-[#1a2b56] rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Mail size={32} className="text-green-400" />
                <h3 className="text-3xl font-bold">Email Service</h3>
              </div>
              <p className="text-blue-100 mb-8 font-medium">Free Microsoft Office 365 for all alumni!</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["Office 365 Apps", "1 TB OneDrive", "5 Devices Access"].map((feat, i) => (
                  <div key={i} className="bg-white/10 p-5 rounded-xl border border-white/10 text-sm backdrop-blur-sm">
                    <span className="text-green-400 font-bold mr-2">0{i+1}.</span> {feat}
                  </div>
                ))}
              </div>
            </div>
            {/* زخرفة خلفية بسيطة */}
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* --- 5. Notable Alumni (Centered Version) --- */}
      <section className="py-20 bg-[#1a2b56] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-white/60 uppercase tracking-widest text-sm font-bold">Notable Alumni</span>
              <h2 className="text-4xl font-bold text-green-400 mt-2">What Our Alumni Say's</h2>
            </div>
            <div className="flex gap-4">
              <button className="nav-prev p-3 border border-white/20 rounded-full text-white hover:bg-green-500 transition-all"><ChevronLeft size={24} /></button>
              <button className="nav-next p-3 border border-white/20 rounded-full text-white hover:bg-green-500 transition-all"><ChevronRight size={24} /></button>
            </div>
          </div>

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{ prevEl: '.nav-prev', nextEl: '.nav-next' }}
            autoplay={{ delay: 4000 }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { 
                slidesPerView: alumni.length < 4 ? alumni.length : 4 
              },
            }}
            className="pb-12 !flex !justify-center"
          >
            {alumni.map((person) => (
              <SwiperSlide key={person.id} className="flex justify-center">
                <div className="group bg-white rounded-2xl p-6 text-center h-[420px] w-full max-w-[320px] flex flex-col items-center shadow-xl relative overflow-hidden transition-all hover:-translate-y-2">
                  <div className="w-24 h-24 rounded-full border-4 border-gray-100 overflow-hidden mb-6 group-hover:border-green-400 transition-colors">
                    <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1a2b56] mb-2">{person.name}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-6 line-clamp-4">{person.description}</p>
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

        {/* --- Alumnus Detail Modal --- */}
        {selectedAlumnus && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedAlumnus(null)}></div>
            <div className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in duration-300">
              <button onClick={() => setSelectedAlumnus(null)} className="absolute top-5 right-5 p-2 bg-gray-100 rounded-full hover:bg-red-500 hover:text-white transition-all z-10"><X size={20} /></button>
              <div className="md:w-1/3 bg-gray-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
                <img src={selectedAlumnus.image} className="w-28 h-28 rounded-full border-4 border-green-400 mb-4 shadow-md" alt="" />
                <h4 className="font-bold text-[#1a2b56] text-center">{selectedAlumnus.name}</h4>
                <span className="text-green-600 text-xs font-bold mt-1 uppercase tracking-wider">MUST Graduate</span>
              </div>
              <div className="md:w-2/3 p-8 overflow-y-auto max-h-[70vh]">
                <h3 className="text-xl font-bold text-[#1a2b56] mb-4 border-b pb-2">Biography</h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {selectedAlumnus.fullBio}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
      {/* --- Awards & Certificates Section --- */}
<section className="py-24 bg-white overflow-hidden">
  <div className="container mx-auto px-6 lg:px-20">
    {/* Title Section */}
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-[#00a651] mb-2 uppercase tracking-wide">
        Awards & Certificates
      </h2>
      <div className="h-1 w-20 bg-[#1a2b56] mx-auto"></div>
    </div>

    {/* Main Slider */}
    <Swiper
      modules={[Pagination, Autoplay, EffectFade]}
      effect="fade"
      loop={true}
      autoplay={{ delay: 6000, disableOnInteraction: false }}
      pagination={{ clickable: true, dynamicBullets: true }}
      className="rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100"
    >
      {awards.map((award) => (
        <SwiperSlide key={award.id}>
          <div className="flex flex-col lg:flex-row bg-white min-h-[500px]">
            {/* Content Side */}
            <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center">
              <h3 className="text-2xl lg:text-3xl font-bold text-[#1a2b56] mb-4 leading-tight">
                {award.title}
              </h3>
              <p className="text-lg text-[#00a651] font-semibold mb-6">
                {award.subtitle}
              </p>
              <div className="mb-6">
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  {award.name}
                </h4>
                <p className="text-gray-600 leading-relaxed italic text-sm lg:text-base">
                  "{award.content}"
                </p>
              </div>
              <button className="flex items-center gap-2 text-[#00a651] font-bold hover:gap-4 transition-all w-fit group">
                Go to event 
                <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform" />
              </button>
            </div>

            {/* Image Side */}
            <div className="lg:w-1/2 relative min-h-[300px]">
              <img 
                src={award.image} 
                alt={award.name} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Overlay shadow for depth */}
              <div className="absolute inset-0 bg-gradient-to-l from-black/10 to-transparent hidden lg:block"></div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</section>
<section className="relative min-h-[500px] flex items-center py-20 bg-[#1a2b56]">
      {/* صورة الخلفية مع الـ Overlay */}
      <div 
        className="absolute inset-0 opacity-40 bg-cover bg-center z-0" 
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1557426272-fc759fbbad95?q=80&w=2000')` }}
      ></div>
      
      <div className="container mx-auto px-6 lg:px-20 relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
        
        {/* نصوص التواصل الجانبية */}
        <div className="text-white max-w-lg">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Reach us on any time.
          </h2>
          <div className="space-y-2">
            <p className="text-xl md:text-2xl font-medium">Or contact us by email</p>
            <a 
              href="mailto:info.alumni@must.edu.eg" 
              className="text-[#00a651] font-bold text-xl md:text-2xl hover:underline block transition-all"
            >
              info.alumni@must.edu.eg
            </a>
          </div>
        </div>

        {/* نموذج ترك الرسالة (Form) */}
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl w-full max-w-md border border-white/20 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-[#1a2b56] mb-8">Leave a message</h3>
          
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Name" 
                className="w-1/2 p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00a651]/20 transition-all" 
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-1/2 p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00a651]/20 transition-all" 
              />
            </div>
            
            <input 
              type="text" 
              placeholder="Phone" 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00a651]/20 transition-all" 
            />
            
            <textarea 
              placeholder="Say Something" 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl h-32 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a651]/20 transition-all resize-none"
            ></textarea>
            
            {/* CAPTCHA Placeholder */}
            <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between border border-gray-100">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="robot" className="w-5 h-5 accent-[#00a651]" />
                <label htmlFor="robot" className="text-sm text-gray-600 font-medium">I'm not a robot</label>
              </div>
              <img 
                src="https://www.gstatic.com/recaptcha/api2/logo_48.png" 
                alt="reCAPTCHA" 
                className="w-8 opacity-70"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#00a651] text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30 transition-all active:scale-95"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
    <footer className="bg-[#1a2b56] text-white pt-20 pb-10 border-t-4 border-white/10">
      <div className="container mx-auto px-6">
        {/* Logo */}
        <div className="flex justify-center mb-16">
          <div className="bg-white p-4 rounded-full w-24 h-24 flex items-center justify-center">
            <img src={image} alt="MUST Logo" className="w-16" />
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-sm">
          {/* Column 1 */}
          <div>
            <h4 className="text-[#00a651] font-bold mb-6 text-base">Links</h4>
            <ul className="space-y-3 opacity-80">
              <li>Home</li>
              <li>The University</li>
              <li>Academics</li>
              <li>Life At MUST</li>
              <li>FAQs</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-[#00a651] font-bold mb-6 text-base">About University</h4>
            <ul className="space-y-3 opacity-80">
              <li>About MUST</li>
              <li>History</li>
              <li>Accreditation</li>
              <li>Why MUST</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-[#00a651] font-bold mb-6 text-base">MUST BUZZ</h4>
            <ul className="space-y-3 opacity-80">
              <li>MUST Events</li>
              <li>MUST News</li>
              <li>Blog</li>
              <li>Announcement</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-[#00a651] font-bold mb-6 text-base">Contact Info</h4>
            <div className="space-y-4 font-bold">
              <p className="text-lg">16878</p>
              <p className="text-[#00a651] hover:underline cursor-pointer">Info@Must.Edu.Eg</p>
              <p className="opacity-80 font-normal leading-relaxed">
                Al Motamayez District – 6th of October, Egypt
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 text-center text-[10px] opacity-40">
          © 2026 Misr University for Science & Technology. All Rights Reserved.
        </div>
      </div>
    </footer>
    </div>
  );
};

export default App;