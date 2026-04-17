import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Search, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { api } from "./Api";
import {
  resolveContentImage,
  localImageSets,
  staticFallbackBundle,
} from "./homeStaticFallback";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

function mapHeroApiToSlides(list) {
  const mapped = (list || []).map((h, i) => ({
    id: h.id,
    image: resolveContentImage(h.imageUrl, localImageSets.hero, i),
  }));
  return mapped.length ? mapped : staticFallbackBundle.slides;
}

const QUICK_LINKS = [
  { name: "Home", target: "home" },
  { name: "Services", target: "6000" },
  { name: "Notable", target: "5000" },
  { name: "Awards", target: "awards" },
  { name: "Events", target: "1000" },
  { name: "News", target: "2000" },
  { name: "Syndicates", target: "moazz" },
  { name: "Media Gallery", href: "/gallery" },
  { name: "Contact Us", target: "3000" },
];

/**
 * Hero image slider + "Alumni Society" title + pill section links + fixed social stack.
 * Pass `slides` from Home (home-bundle) to avoid a second request; omit on other routes to load via GET /api/public/hero.
 */
export default function HomeHeroBanner({ slides: slidesProp }) {
  const [fetchedSlides, setFetchedSlides] = useState(null);

  useEffect(() => {
    if (slidesProp !== undefined) return;
    let cancelled = false;
    (async () => {
      try {
        const list = await api("/api/public/hero", { method: "GET" });
        if (cancelled) return;
        setFetchedSlides(mapHeroApiToSlides(list));
      } catch {
        if (!cancelled) setFetchedSlides(staticFallbackBundle.slides);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slidesProp]);

  const slides =
    slidesProp !== undefined
      ? slidesProp
      : fetchedSlides ?? staticFallbackBundle.slides;

  return (
    <section className="relative h-[480px] md:h-[550px] w-full overflow-hidden">
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
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a2b56]/80 via-[#1a2b56]/50 to-transparent dark:from-black/80 dark:via-black/40" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 flex flex-col justify-end items-center text-center z-20 px-4 pb-14 md:pb-20 pt-8 pointer-events-none">
        <div className="w-full max-w-[min(100%,1200px)] pointer-events-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-xl mb-8 md:mb-12">
            Alumni Society
          </h2>

          <div
            className="
              w-full overflow-x-auto overflow-y-hidden
              [scrollbar-width:none] [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
              pb-1
            "
          >
            <div className="flex flex-nowrap justify-center gap-2 sm:gap-2.5 md:gap-3 text-xs sm:text-sm md:text-base font-medium min-w-min mx-auto">
              {QUICK_LINKS.map((item, i) => (
                <a
                  key={i}
                  href={item.href ?? `/#${item.target}`}
                  className="
                    shrink-0 whitespace-nowrap
                    px-3 py-2 sm:px-4 md:px-5
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
      </div>

      <div className="fixed right-5 top-1/2 translate-y-[calc(-50%+24px)] flex flex-col gap-4 z-40">
        <a
          href="/search"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-green-500 rounded-full text-white shadow-lg hover:scale-110 hover:rotate-6 transition-all duration-300"
        >
          <Search size={20} />
        </a>

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
            Icon: Linkedin,
            url: "https://www.linkedin.com/school/misr-university-for-science-and-technology/",
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
  );
}
