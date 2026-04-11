import { useState } from "react";
import { motion } from "framer-motion";

const galleryData = {
  2026: [
    "https://picsum.photos/400/300?random=1",
    "https://picsum.photos/400/300?random=2",
    "https://picsum.photos/400/300?random=3",
  ],
  2025: [
    "https://picsum.photos/400/300?random=4",
    "https://picsum.photos/400/300?random=5",
    "https://picsum.photos/400/300?random=6",
  ],
  2024: [
    "https://picsum.photos/400/300?random=7",
    "https://picsum.photos/400/300?random=8",
    "https://picsum.photos/400/300?random=9",
  ],
  2023: [
    "https://picsum.photos/400/300?random=10",
    "https://picsum.photos/400/300?random=11",
    "https://picsum.photos/400/300?random=12",
  ],
  2022: [
    "https://picsum.photos/400/300?random=13",
    "https://picsum.photos/400/300?random=14",
    "https://picsum.photos/400/300?random=15",
  ],
};

export default function Gallery() {
  const [activeYear, setActiveYear] = useState(2026);

  return (
    <section className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-5">
      
      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-green-600 mb-10">
        Photo Gallery
      </h1>

      {/* Years Buttons */}
      <div className="flex justify-center gap-4 flex-wrap mb-10">
        {Object.keys(galleryData).map((year) => (
          <button
            key={year}
            onClick={() => setActiveYear(Number(year))}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              activeYear === Number(year)
                ? "bg-green-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-green-500 hover:text-white"
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Images Grid */}
      <motion.div
        key={activeYear}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {galleryData[activeYear].map((img, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl shadow-lg group"
          >
            <img
              src={img}
              alt="gallery"
              className="w-full h-60 object-cover transform group-hover:scale-110 transition duration-500"
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
}