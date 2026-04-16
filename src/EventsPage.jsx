import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./Api";
import SiteChrome from "./SiteChrome";
import HomeHeroBanner from "./HomeHeroBanner";
import { useSiteAuth } from "./useSiteAuth";
import {
  formatEventSchedule,
  getEventsListOrFallback,
} from "./eventsNewsUtils";
import { MapPin, Clock, Plus } from "lucide-react";

export default function EventsPage() {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, accountLabel, handleLogout } = useSiteAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await api("/api/public/events", { method: "GET" });
        if (cancelled) return;
        setEvents(getEventsListOrFallback(list));
      } catch (e) {
        if (!cancelled) {
          setEvents(getEventsListOrFallback([]));
          setError(e.message || "Could not load events");
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
        <div className="max-w-7xl mx-auto mb-12 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h1 className="text-4xl font-bold text-[#00a651] mb-4 uppercase tracking-wide">
              All Events
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto sm:mx-0">
              University events, conferences, and activities.
            </p>
          </div>
          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate("/AdminDashboard?section=Events")}
              className="inline-flex items-center justify-center gap-2 shrink-0 self-center sm:self-start px-5 py-2.5 rounded-xl font-bold text-sm bg-[#00a651] text-white hover:bg-[#008f45] shadow-md transition"
            >
              <Plus size={18} />
              Add event
            </button>
          )}
        </div>

        {loading && (
          <p className="text-center text-gray-500">Loading events…</p>
        )}
        {error && !loading && (
          <p className="text-center text-amber-700 dark:text-amber-400 text-sm mb-8">
            {error}
          </p>
        )}

        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
            const displayLocation = event.location?.trim();
            const displayTime =
              event.time?.trim() ||
              (event.eventDate ? formatEventSchedule(event.eventDate) : "");
            return (
              <article
                key={event.id}
                className="flex flex-col bg-white dark:bg-gray-800 rounded-md overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={event.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-[#1a3668] text-white w-14 h-16 flex flex-col items-center justify-center rounded-md shadow-lg">
                    <div className="text-2xl font-bold leading-none">
                      {event.date.day}
                    </div>
                    <div className="text-xs uppercase font-medium mt-1">
                      {event.date.month}
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2 flex-1 flex flex-col">
                  {(displayLocation || displayTime) && (
                    <div className="flex flex-col gap-2 text-sm text-gray-800 dark:text-gray-100">
                      <div className="flex items-start gap-2 min-w-0">
                        <MapPin
                          size={16}
                          className="text-[#8ec63f] shrink-0 mt-0.5"
                          aria-hidden
                        />
                        <span className="break-words leading-snug text-xs">
                          {displayLocation || "Venue TBA"}
                        </span>
                      </div>
                      {displayTime ? (
                        <div className="flex items-start gap-2 min-w-0">
                          <Clock
                            size={16}
                            className="text-[#8ec63f] shrink-0 mt-0.5"
                            aria-hidden
                          />
                          <span className="break-words leading-snug text-xs">
                            {displayTime}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  )}
                  <h2 className="font-bold text-[#1a3668] dark:text-white text-base leading-tight">
                    {event.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-4 flex-1">
                    {event.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </SiteChrome>
  );
}
