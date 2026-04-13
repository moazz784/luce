import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { api } from "./Api";
import SiteChrome from "./SiteChrome";
import { useSiteAuth } from "./useSiteAuth";

export default function Gallery() {
  const { isLoggedIn, isAdmin, accountLabel, handleLogout } = useSiteAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeYear, setActiveYear] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await api("/api/public/gallery", { method: "GET" });
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        setItems(list);
        const years = [
          ...new Set(list.map((x) => x.year ?? x.Year).filter((y) => y != null)),
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

  const imagesForYear = useMemo(() => {
    if (activeYear == null) return [];
    return items
      .filter((x) => (x.year ?? x.Year) === activeYear)
      .sort(
        (a, b) =>
          (a.sortOrder ?? a.SortOrder ?? 0) - (b.sortOrder ?? b.SortOrder ?? 0),
      );
  }, [items, activeYear]);

  return (
    <SiteChrome
      isLoggedIn={isLoggedIn}
      isAdmin={isAdmin}
      accountLabel={accountLabel}
      onLogout={handleLogout}
    >
      <section className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-5">
        <h1 className="text-4xl font-bold text-center text-green-600 mb-10">
          Photo Gallery
        </h1>

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
            No gallery images yet. Add them from the Admin dashboard.
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

            <motion.div
              key={activeYear}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
            >
              {imagesForYear.map((row) => {
                const url = row.imageUrl ?? row.ImageUrl ?? "";
                const id = row.id ?? row.Id;
                return (
                  <div
                    key={id}
                    className="overflow-hidden rounded-2xl shadow-lg group"
                  >
                    <img
                      src={url}
                      alt=""
                      className="w-full h-60 object-cover transform group-hover:scale-110 transition duration-500"
                    />
                  </div>
                );
              })}
            </motion.div>
          </>
        )}
      </section>
    </SiteChrome>
  );
}
