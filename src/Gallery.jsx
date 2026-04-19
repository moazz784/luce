import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "./Api";
import SiteChrome from "./SiteChrome";
import { useSiteAuth } from "./useSiteAuth";
import {
  galleryItemIsVideo,
  resolveGalleryCardVisual,
  getVideoEmbedUrl,
  VimeoPosterImage,
} from "./galleryVideoMedia";

function GalleryCardMedia({ visual, title, isMediaVideo }) {
  const mediaClass =
    "w-full h-full object-cover transform group-hover:scale-110 transition duration-500";

  if (visual.kind === "image" || visual.kind === "poster") {
    return (
      <img
        src={visual.src}
        alt={title || "Gallery item"}
        className={mediaClass}
      />
    );
  }

  if (visual.kind === "video") {
    return (
      <video
        src={visual.videoSrc}
        muted
        playsInline
        preload="metadata"
        className={mediaClass}
        aria-label={title || "Gallery video preview"}
      />
    );
  }

  if (visual.kind === "vimeo") {
    return (
      <VimeoPosterImage
        videoUrl={visual.videoUrl}
        alt={title || "Gallery item"}
        className={mediaClass}
      />
    );
  }

  return (
    <div className="w-full h-full bg-slate-700 flex items-center justify-center">
      {isMediaVideo ? (
        <Play className="text-white/45 w-14 h-14" strokeWidth={1.25} />
      ) : (
        <ImageIcon className="text-white/35 w-12 h-12" strokeWidth={1.25} />
      )}
    </div>
  );
}

// دالة لجلب اسم الوسائط من localStorage
const getMediaTitleFromLocalStorage = (mediaUrl, mediaType) => {
  if (!mediaUrl) return '';
  try {
    const key = `${mediaType}_${mediaUrl}`;
    const storedTitles = JSON.parse(localStorage.getItem('galleryMediaTitles') || '{}');
    return storedTitles[key] || '';
  } catch (e) {
    console.error("Error reading from localStorage:", e);
    return '';
  }
};

export default function Gallery() {
  const { isLoggedIn, isAdmin, accountLabel, handleLogout } = useSiteAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeYear, setActiveYear] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState("all");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await api("/api/public/gallery", { method: "GET" });
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        
        const listWithTitles = list.map((item) => {
          const mediaTypeItem =
            item.mediaType || (item.videoUrl ? "video" : "image");
          let mediaUrl = null;

          if (mediaTypeItem === "video") {
            mediaUrl = item.videoUrl || item.VideoUrl;
          } else {
            mediaUrl = item.imageUrl || item.ImageUrl;
          }

          const apiTitle = (item.mediaTitle ?? item.MediaTitle ?? "").trim();
          const savedTitle = mediaUrl
            ? getMediaTitleFromLocalStorage(mediaUrl, mediaTypeItem)
            : "";

          return {
            ...item,
            mediaTitle:
              apiTitle || savedTitle || (item.title ?? item.Title ?? "") || "",
          };
        });
        setItems(listWithTitles);
        
        const years = [
          ...new Set(listWithTitles.map((x) => x.year ?? x.Year).filter((y) => y != null)),
        ].sort((a, b) => b - a);
        if (years.length && activeYear == null) {
          setActiveYear(years[0]);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load gallery");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const yearsSorted = useMemo(() => {
    const ys = [
      ...new Set(items.map((x) => x.year ?? x.Year).filter((y) => y != null)),
    ].sort((a, b) => b - a);
    return ys;
  }, [items]);

  useEffect(() => {
    if (yearsSorted.length && activeYear == null) {
      setActiveYear(yearsSorted[0]);
    }
  }, [yearsSorted, activeYear]);

  const filteredItems = useMemo(() => {
    if (activeYear == null) return [];
    let filtered = items.filter((x) => (x.year ?? x.Year) === activeYear);

    if (mediaType === "images") {
      filtered = filtered.filter((x) => !galleryItemIsVideo(x));
    } else if (mediaType === "videos") {
      filtered = filtered.filter((x) => galleryItemIsVideo(x));
    }

    return filtered.sort(
      (a, b) =>
        (a.sortOrder ?? a.SortOrder ?? 0) - (b.sortOrder ?? b.SortOrder ?? 0),
    );
  }, [items, activeYear, mediaType]);

  const openModal = (item) => {
    setSelectedMedia(item);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedMedia(null);
    document.body.style.overflow = "auto";
  };

  const nextMedia = () => {
    if (!selectedMedia) return;
    const currentIndex = filteredItems.findIndex(
      (item) => (item.id ?? item.Id) === (selectedMedia.id ?? selectedMedia.Id),
    );
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedMedia(filteredItems[nextIndex]);
  };

  const prevMedia = () => {
    if (!selectedMedia) return;
    const currentIndex = filteredItems.findIndex(
      (item) => (item.id ?? item.Id) === (selectedMedia.id ?? selectedMedia.Id),
    );
    const prevIndex =
      (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedMedia(filteredItems[prevIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedMedia) return;
      if (e.key === "ArrowRight") nextMedia();
      if (e.key === "ArrowLeft") prevMedia();
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMedia, filteredItems]);

  return (
    <SiteChrome
      isLoggedIn={isLoggedIn}
      isAdmin={isAdmin}
      accountLabel={accountLabel}
      onLogout={handleLogout}
    >
      <section className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-5">
        <h1 className="text-4xl font-bold text-center text-green-600 mb-10">
          Gallery
        </h1>

        <div className="flex justify-center gap-4 flex-wrap mb-6">
          <button
            type="button"
            onClick={() => setMediaType("all")}
            className={`px-6 py-2 rounded-full font-semibold transition flex items-center gap-2 ${
              mediaType === "all"
                ? "bg-green-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-green-500 hover:text-white"
            }`}
          >
            <ImageIcon size={18} />
            <Play size={18} />
            All
          </button>
          <button
            type="button"
            onClick={() => setMediaType("images")}
            className={`px-6 py-2 rounded-full font-semibold transition flex items-center gap-2 ${
              mediaType === "images"
                ? "bg-green-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-green-500 hover:text-white"
            }`}
          >
            <ImageIcon size={18} />
            Images
          </button>
          <button
            type="button"
            onClick={() => setMediaType("videos")}
            className={`px-6 py-2 rounded-full font-semibold transition flex items-center gap-2 ${
              mediaType === "videos"
                ? "bg-green-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-green-500 hover:text-white"
            }`}
          >
            <Play size={18} />
            Videos
          </button>
        </div>

        {loading && (
          <p className="text-center text-gray-600 dark:text-gray-400">
            Loading…
          </p>
        )}
        {error && (
          <p className="text-center text-red-600 dark:text-red-400 mb-6">
            {error}
          </p>
        )}

        {!loading && !error && yearsSorted.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No gallery items yet. Add them from the Admin dashboard.
          </p>
        )}

        {yearsSorted.length > 0 && (
          <>
            <div className="flex justify-center gap-4 flex-wrap mb-10">
              {yearsSorted.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setActiveYear(year)}
                  className={`px-6 py-2 rounded-full font-semibold transition ${
                    activeYear === year
                      ? "bg-green-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-green-500 hover:text-white"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeYear}-${mediaType}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5 }}
                className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
              >
                {filteredItems.map((row) => {
                  const id = row.id ?? row.Id;
                  const mediaTitle = row.mediaTitle ?? "";
                  const isMediaVideo = galleryItemIsVideo(row);
                  const visual = resolveGalleryCardVisual(row);
                  
                  // عرض اسم الوسائط (للصور والفيديوهات)
                  const displayTitle = mediaTitle;

                  return (
                    <motion.div
                      key={id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => openModal(row)}
                      className="overflow-hidden rounded-2xl shadow-lg group cursor-pointer relative bg-white dark:bg-gray-800 flex flex-col"
                    >
                      <div className="relative overflow-hidden aspect-video bg-slate-800">
                        <GalleryCardMedia
                          visual={visual}
                          title={displayTitle}
                          isMediaVideo={isMediaVideo}
                        />
                        {isMediaVideo && (
                          <>
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                              <div className="rounded-full bg-black/45 p-3 opacity-45 transition-opacity duration-300 group-hover:opacity-80">
                                <Play
                                  size={28}
                                  className="text-white fill-white"
                                />
                              </div>
                            </div>
                            <div className="pointer-events-none absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <Play size={12} />
                              Video
                            </div>
                          </>
                        )}
                      </div>
                      {/* اسم الصورة/الفيديو تحت الوسائط */}
                      <div className="p-3 min-h-[60px] flex items-center justify-center">
                        {displayTitle ? (
                          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-center line-clamp-2">
                            {displayTitle}
                          </h3>
                        ) : (
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center">
                            Untitled
                          </h3>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {filteredItems.length === 0 && !loading && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                No{" "}
                {mediaType === "images"
                  ? "images"
                  : mediaType === "videos"
                    ? "videos"
                    : "items"}{" "}
                found for this year.
              </p>
            )}
          </>
        )}
      </section>

      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-[90%] max-h-[90vh] bg-black rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all duration-200"
              >
                <X size={24} />
              </button>

              {filteredItems.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevMedia();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all duration-200"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextMedia();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all duration-200"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 bg-black/50 rounded-full text-white text-sm">
                {filteredItems.findIndex(
                  (i) =>
                    (i.id ?? i.Id) === (selectedMedia.id ?? selectedMedia.Id),
                ) + 1}{" "}
                / {filteredItems.length}
              </div>

              <div className="flex items-center justify-center min-h-[50vh] max-h-[90vh]">
                {galleryItemIsVideo(selectedMedia) ? (
                  <iframe
                    src={getVideoEmbedUrl(
                      selectedMedia.videoUrl ??
                        selectedMedia.VideoUrl ??
                        selectedMedia.url,
                    )}
                    className="w-full h-[70vh]"
                    allowFullScreen
                    title="Video player"
                  />
                ) : (
                  <img
                    src={
                      selectedMedia.imageUrl ?? selectedMedia.ImageUrl ?? ""
                    }
                    alt={
                      selectedMedia.mediaTitle ??
                      selectedMedia.title ??
                      "Gallery item"
                    }
                    className="max-w-full max-h-[85vh] object-contain"
                  />
                )}
              </div>

              {(selectedMedia.mediaTitle || selectedMedia.title || selectedMedia.description) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  {(selectedMedia.mediaTitle || selectedMedia.title) && (
                    <h3 className="text-white text-xl font-bold">
                      {selectedMedia.mediaTitle || selectedMedia.title}
                    </h3>
                  )}
                  {selectedMedia.description && (
                    <p className="text-gray-200 text-sm mt-2">
                      {selectedMedia.description}
                    </p>
                  )}
                  {selectedMedia.year && (
                    <p className="text-green-400 text-sm mt-1">
                      Year: {selectedMedia.year}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SiteChrome>
  );
}