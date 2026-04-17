import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import back from "./assets/back.png";
import image5 from "./assets/400.png";
import { api } from "./Api";
import SiteChrome from "./SiteChrome";
import HomeHeroBanner from "./HomeHeroBanner";
import { useSiteAuth } from "./useSiteAuth";
import {
  resolveContentImage,
  resolveContentLink,
  localImageSets,
  staticFallbackBundle,
} from "./homeStaticFallback";
import {
  mapEventsFromApi,
  mapNewsFromApi,
  formatNewsPublishedAt,
  formatEventSchedule,
} from "./eventsNewsUtils";
// استيراد ستايلات Swiper الأساسية
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// الأيقونات
import { 
  GraduationCap, 
  Mail, 
  CheckCircle2,
  X,
  MapPin,
  ChevronLeft,
  ChevronRight, 
  ArrowUpRight,
  Calendar,
  Clock,
  Search,
  Facebook,
  Instagram,
  Twitter,
  Linkedin
} from 'lucide-react';

/** Alumni ShortDescription in admin/DB is sometimes left as the placeholder "MUST Graduate". Treat that as empty and show the real 2-line preview from description or fullBio. */
function getAlumniPreviewText(person) {
  const raw = (person.shortDescription ?? "").trim().replace(/\s+/g, " ");
  if (raw && raw.toLowerCase() !== "must graduate") return person.shortDescription.trim();
  const desc = (person.description ?? "").trim();
  if (desc) return desc;
  const bio = (person.fullBio ?? "").trim();
  if (!bio) return "";
  const firstBlock = bio.split(/\r?\n\s*\r?\n/)[0] ?? bio;
  return firstBlock.replace(/\s+/g, " ").trim();
}

const App = () => {
  const navigate = useNavigate();
  const [selectedAlumnus, setSelectedAlumnus] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [awardIndex, setAwardIndex] = useState(0);
  const { isLoggedIn, isAdmin, accountLabel, handleLogout } = useSiteAuth();

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

        const newsList = mapNewsFromApi(bundle.news || []);
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
          link: resolveContentLink(s.link),
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
          winnerName: (a.winnerName || "").trim(),
          content: a.content || "",
          image: resolveContentImage(a.imageUrl, localImageSets.awards, i),
        }));
        setAwards(
          awardsList.length ? awardsList : staticFallbackBundle.awards
        );

        const rawEvents = bundle.events ?? bundle.Events ?? [];
        const eventsList = mapEventsFromApi(rawEvents);
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

  const currentAward =
    awards.length > 0
      ? awards[awardIndex % awards.length]
      : {
          id: 0,
          title: "",
          subtitle: "",
          winnerName: "",
          content: "",
          image: "",
        };

  useEffect(() => {
    if (awards.length === 0) return;
    const timer = setInterval(() => {
      setAwardIndex((prev) => (prev + 1) % awards.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [awards.length]);

  // Social links array - unique links only
  const socialLinks = [
    {
      Icon: Facebook,
      url: "https://www.facebook.com/groups/766796172340576/",
      label: "Facebook"
    },
    {
      Icon: Instagram,
      url: "https://www.instagram.com/accounts/login/",
      label: "Instagram"
    },
    {
      Icon: Twitter,
      url: "https://x.com/must_university",
      label: "Twitter"
    },
    {
      Icon: Linkedin,
      url: "https://www.linkedin.com/school/misr-university-for-science-and-technology/",
      label: "LinkedIn"
    }
  ];

  return (
    <SiteChrome
      topSlot={
        <>
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
        </>
      }
      isLoggedIn={isLoggedIn}
      isAdmin={isAdmin}
      accountLabel={accountLabel}
      onLogout={handleLogout}
    >
      {/* Social Sidebar */}
      <div className="fixed right-5 top-[600px] -translate-y-1/2 flex flex-col gap-4 z-40">
        {/* Search */}
        <a
          href="/search"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-green-500 rounded-full text-white shadow-lg hover:scale-110 hover:rotate-6 transition-all duration-300"
        >
          <Search size={20} />
        </a>

        {/* Social Links - No duplicates */}
        {socialLinks.map((item, idx) => (
          <a
            key={idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-xl hover:-translate-x-2 hover:scale-110 transition-all duration-300 flex items-center justify-center"
            aria-label={item.label}
          >
            <item.Icon size={20} className="text-[#1a2b56] dark:text-white" />
          </a>
        ))}
      </div>

      <div id="100" className="relative">
        <HomeHeroBanner slides={slides} />

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
                1280: { slidesPerView: 4 },
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

                    <p className="text-gray-500 dark:text-gray-300 text-xs leading-relaxed mb-6 line-clamp-2 min-h-[2.5rem]">
                      {getAlumniPreviewText(person)}
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
                  {(() => {
                    const preview = getAlumniPreviewText(selectedAlumnus);
                    return preview ? (
                      <span className="text-green-600 text-xs font-bold mt-1 text-center line-clamp-2 leading-snug">
                        {preview}
                      </span>
                    ) : null;
                  })()}
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
                  {currentAward.subtitle && (
                    <p className="text-lg text-[#00a651] font-semibold mb-4">
                      {currentAward.subtitle}
                    </p>
                  )}

                  <div className="mb-6 space-y-4">
                    {currentAward.winnerName && (
                      <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                        {currentAward.winnerName}
                      </h4>
                    )}

                    {currentAward.title && (
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm lg:text-base whitespace-pre-wrap">
                        {currentAward.title}
                      </p>
                    )}

                    {currentAward.content && (
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm lg:text-base whitespace-pre-wrap">
                        {currentAward.content}
                      </p>
                    )}
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

        {/* Related Events Section */}
        <section
          id="1000"
          className="py-12 px-4 bg-white dark:bg-gray-900 font-sans transition-colors duration-300"
        >
          <h2 className="text-3xl font-bold text-[#00a651] text-center mb-10">
            Related Events
          </h2>

          <div className="max-w-7xl mx-auto relative group">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                nextEl: ".button-next",
                prevEl: ".button-prev",
              }}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
              }}
              className="pb-12"
            >
              {events.map((event) => {
                const displayLocation = event.location?.trim();
                const displayTime =
                  event.time?.trim() ||
                  (event.eventDate ? formatEventSchedule(event.eventDate) : "");
                const showMeta = !!(displayLocation || displayTime);
                return (
                  <SwiperSlide key={event.id}>
                    <div
                      onClick={() => setSelectedEvent(event)}
                      className="flex flex-col group cursor-pointer transition-all duration-300 hover:-translate-y-2 h-full"
                    >
                      {/* Image */}
                      <div className="relative h-72 overflow-hidden rounded-sm">
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
                        {showMeta ? (
                          <div className="flex flex-col gap-2 text-sm text-gray-800 dark:text-gray-100">
                            <div className="flex items-start gap-2 min-w-0">
                              <MapPin
                                size={16}
                                className="text-[#8ec63f] shrink-0 mt-0.5"
                                aria-hidden
                              />
                              <span
                                className={`break-words leading-snug ${
                                  displayLocation
                                    ? ""
                                    : "text-gray-500 dark:text-gray-400 italic"
                                }`}
                              >
                                {displayLocation || "Venue TBA — set Location in Admin"}
                              </span>
                            </div>
                            {displayTime ? (
                              <div className="flex items-start gap-2 min-w-0">
                                <Clock
                                  size={16}
                                  className="text-[#8ec63f] shrink-0 mt-0.5"
                                  aria-hidden
                                />
                                <span className="break-words leading-snug">
                                  {displayTime}
                                </span>
                              </div>
                            ) : null}
                          </div>
                        ) : null}

                        <h3 className="font-bold text-[#1a3668] dark:text-white text-[15px] leading-tight hover:underline min-h-[40px]">
                          {event.title}
                        </h3>

                        <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-3">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* أزرار التنقل */}
            <button className="button-prev absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md text-[#00a651] hidden lg:block border border-gray-100 dark:border-gray-700">
              <ChevronLeft size={24} />
            </button>

            <button className="button-next absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md text-[#00a651] hidden lg:block border border-gray-100 dark:border-gray-700">
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Modal */}
          {selectedEvent && (() => {
            const modalLocation = selectedEvent.location?.trim();
            const modalTime =
              selectedEvent.time?.trim() ||
              (selectedEvent.eventDate
                ? formatEventSchedule(selectedEvent.eventDate)
                : "");
            const showModalMeta = !!(modalLocation || modalTime);
            return (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-900 w-[90%] max-w-2xl rounded-xl overflow-hidden shadow-2xl relative animate-fadeIn">
                  {/* Close */}
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-3 right-3 bg-black/10 hover:bg-black/20 text-black dark:text-white w-8 h-8 rounded-full"
                  >
                    ✕
                  </button>

                  {/* Image */}
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="w-full h-72 object-cover"
                  />

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <h2 className="text-xl font-bold text-[#1a3668] dark:text-white">
                      {selectedEvent.title}
                    </h2>

                    {showModalMeta ? (
                      <div className="text-sm text-gray-800 dark:text-gray-100 flex flex-col gap-2">
                        <span className="flex items-start gap-2">
                          <MapPin
                            size={16}
                            className="text-[#8ec63f] shrink-0 mt-0.5"
                          />
                          <span
                            className={
                              modalLocation
                                ? ""
                                : "text-gray-500 dark:text-gray-400 italic"
                            }
                          >
                            {modalLocation || "Venue TBA — set Location in Admin"}
                          </span>
                        </span>
                        {modalTime ? (
                          <span className="flex items-start gap-2">
                            <Clock
                              size={16}
                              className="text-[#8ec63f] shrink-0 mt-0.5"
                            />
                            {modalTime}
                          </span>
                        ) : null}
                      </div>
                    ) : null}

                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Button */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => navigate("/events")}
              className="bg-[#00a651] hover:bg-[#008d44] text-white font-bold py-3 px-10 rounded-full transition-all duration-300 shadow-md"
            >
              See All Events
            </button>
          </div>
        </section>

        {/* Latest News Section */}
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
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-14"
            >
              {newsData.map((news) => {
                const newsDateLabel = formatNewsPublishedAt(news.publishedAt);
                const newsLoc = news.location?.trim();
                const showNewsMeta = !!(newsDateLabel || newsLoc);
                return (
                  <SwiperSlide key={news.id}>
                    <div
                      onClick={() => setSelectedNews(news)}
                      className="flex flex-col group/card cursor-pointer bg-white dark:bg-gray-800 rounded-md overflow-hidden h-full border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="overflow-hidden aspect-video relative">
                        <img
                          src={news.image}
                          alt="news"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                        />

                        <div className="absolute inset-0 bg-black/5 dark:bg-black/30 group-hover/card:bg-transparent transition-all"></div>
                      </div>

                      {/* Content */}
                      <div className="py-5 px-1 space-y-3">
                        {showNewsMeta ? (
                          <div className="flex flex-col gap-2 text-sm text-gray-800 dark:text-gray-100">
                            {newsDateLabel ? (
                              <div className="flex items-center gap-2 text-[#00a651] min-w-0">
                                <Calendar size={16} className="opacity-80 shrink-0" />
                                <span className="text-xs font-medium truncate">
                                  {newsDateLabel}
                                </span>
                              </div>
                            ) : null}
                            <div className="flex items-start gap-2 min-w-0">
                              <MapPin
                                size={16}
                                className="text-[#8ec63f] shrink-0 mt-0.5"
                                aria-hidden
                              />
                              <span
                                className={`text-xs break-words leading-snug ${
                                  newsLoc
                                    ? "text-gray-700 dark:text-gray-200"
                                    : "text-gray-500 dark:text-gray-400 italic"
                                }`}
                              >
                                {newsLoc || "Location TBA — set in Admin"}
                              </span>
                            </div>
                          </div>
                        ) : null}

                        {news.body?.trim() ? (
                          <>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 mb-1">
                              {news.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-300 line-clamp-2 break-words leading-relaxed">
                              {news.body.trim()}
                            </p>
                          </>
                        ) : (
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 break-words leading-relaxed">
                            {news.title}
                          </h3>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* Arrows */}
            <button className="swiper-button-prev-custom absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 shadow-lg rounded-full flex items-center justify-center text-[#1a2b56] dark:text-white hover:bg-[#00a651] hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex">
              <ChevronLeft size={24} />
            </button>

            <button className="swiper-button-next-custom absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 shadow-lg rounded-full flex items-center justify-center text-[#1a2b56] dark:text-white hover:bg-[#00a651] hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex">
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Modal */}
          {selectedNews && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-900 w-[90%] max-w-2xl rounded-xl overflow-hidden shadow-2xl relative animate-fadeIn">
                {/* Close */}
                <button
                  onClick={() => setSelectedNews(null)}
                  className="absolute top-3 right-3 bg-black/10 hover:bg-black/20 text-black dark:text-white w-8 h-8 rounded-full"
                >
                  ✕
                </button>

                {/* Image */}
                <img
                  src={selectedNews.image}
                  alt="news"
                  className="w-full h-72 object-cover"
                />

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h2 className="text-xl font-bold text-[#1a3668] dark:text-white">
                    {selectedNews.title}
                  </h2>
                  <div className="flex flex-col gap-2 text-sm text-gray-800 dark:text-gray-100">
                    <span className="flex items-start gap-2 text-[#00a651]">
                      <Calendar size={16} className="shrink-0 mt-0.5" />
                      <span>
                        {formatNewsPublishedAt(selectedNews.publishedAt) ||
                          "Latest Update"}
                      </span>
                    </span>
                    <span className="flex items-start gap-2">
                      <MapPin
                        size={16}
                        className="text-[#8ec63f] shrink-0 mt-0.5"
                        aria-hidden
                      />
                      <span
                        className={
                          selectedNews.location?.trim()
                            ? ""
                            : "text-gray-500 dark:text-gray-400 italic"
                        }
                      >
                        {selectedNews.location?.trim() ||
                          "Location TBA — set in Admin"}
                      </span>
                    </span>
                  </div>
                  {selectedNews.body?.trim() ? (
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                      {selectedNews.body}
                    </p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                      No article body — add text in Admin (optional).
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Button */}
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => navigate("/news")}
              className="border-2 border-[#00a651] text-[#00a651] hover:bg-[#00a651] hover:text-white font-bold py-3 px-12 rounded-full transition-all duration-300 shadow-sm transform active:scale-95"
            >
              See All News
            </button>
          </div>
        </section>

        {/* Syndicate Section */}
        <section
          id="moazz"
          className="py-16 bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300"
          dir="rtl"
        >
          <div className="container mx-auto px-4">
            {/* Title */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">
                Syndicate of Scientific Professions<span className="text-blue-600">(ESSP)</span>
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
                        Click to visit the link
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

        {/* Contact Section */}
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
          <div className="absolute right-10 lg:right-20 top-1/2 -translate-y-1/2 z-20 w-full max-w-[500px] hidden md:block">
            <div className="bg-white dark:bg-gray-800 shadow-2xl p-8 rounded-sm border-t-4 border-green-500 transition-colors duration-300">
              <h3 className="text-[#1a2b56] dark:text-white text-4xl font-bold mb-8">
                Leave a message
              </h3>

              <form className="space-y-5" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="p-4 bg-gray-100 dark:bg-gray-700 text-black dark:text-white outline-none focus:ring-1 focus:ring-green-500 text-base"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="p-4 bg-gray-100 dark:bg-gray-700 text-black dark:text-white outline-none focus:ring-1 focus:ring-green-500 text-base"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Phone"
                  value={contactForm.phone}
                  onChange={(e) =>
                    setContactForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  className="w-full p-4 bg-gray-100 dark:bg-gray-700 text-black dark:text-white outline-none focus:ring-1 focus:ring-green-500 text-base"
                />

                <textarea
                  placeholder="Say Something"
                  rows="5"
                  required
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm((f) => ({ ...f, message: e.target.value }))
                  }
                  className="w-full p-4 bg-gray-100 dark:bg-gray-700 text-black dark:text-white outline-none focus:ring-1 focus:ring-green-500 text-base resize-none"
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
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-4 rounded-full transition-all text-lg"
                >
                  {contactStatus.submitting ? "Sending…" : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </SiteChrome>
  );
};

export default App;