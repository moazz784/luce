import { useState, useEffect } from "react";
import { api } from "./Api";
import SiteChrome from "./SiteChrome";
import HomeHeroBanner from "./HomeHeroBanner";
import { useSiteAuth } from "./useSiteAuth";
import { formatNewsPublishedAt, getNewsListOrFallback } from "./eventsNewsUtils";
import { Calendar, MapPin } from "lucide-react";

export default function NewsPage() {
  const { isLoggedIn, isAdmin, accountLabel, handleLogout } = useSiteAuth();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await api("/api/public/news", { method: "GET" });
        if (cancelled) return;
        setNewsData(getNewsListOrFallback(list));
      } catch (e) {
        if (!cancelled) {
          setNewsData(getNewsListOrFallback([]));
          setError(e.message || "Could not load news");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteChrome
      isLoggedIn={isLoggedIn}
      isAdmin={isAdmin}
      accountLabel={accountLabel}
      onLogout={handleLogout}
    >
      <HomeHeroBanner />
      <div className="py-16 px-6 bg-white dark:bg-gray-900 min-h-[60vh]">
        <h1 className="text-4xl font-bold text-[#00a651] text-center mb-4 uppercase tracking-wide">
          All News
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Latest announcements and stories from MUST.
        </p>

        {loading && (
          <p className="text-center text-gray-500">Loading news…</p>
        )}
        {error && !loading && (
          <p className="text-center text-amber-700 dark:text-amber-400 text-sm mb-8">
            {error}
          </p>
        )}

        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsData.map((news) => {
            const newsDateLabel = formatNewsPublishedAt(news.publishedAt);
            const newsLoc = news.location?.trim();
            return (
              <article
                key={news.id}
                className="flex flex-col bg-white dark:bg-gray-800 rounded-md overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="overflow-hidden aspect-video">
                  <img
                    src={news.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <div className="flex flex-col gap-2 text-sm">
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
                  {news.body?.trim() ? (
                    <>
                      <h2 className="text-sm text-gray-800 dark:text-gray-100 font-semibold line-clamp-1 mb-1 flex-1">
                        {news.title}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 break-words leading-relaxed flex-1">
                        {news.body.trim()}
                      </p>
                    </>
                  ) : (
                    <h2 className="text-sm text-gray-800 dark:text-gray-100 font-semibold line-clamp-2 break-words leading-relaxed flex-1">
                      {news.title}
                    </h2>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </SiteChrome>
  );
}
