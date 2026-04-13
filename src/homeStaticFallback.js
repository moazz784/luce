/**
 * Local images + static copy from the original Home.jsx (before API-only images).
 * Used when the API omits imageUrl, returns relative paths, or when the bundle fails.
 */

import m11 from "./assets/m11.jpeg";
import m22 from "./assets/m22.jpeg";
import m33 from "./assets/m33.jpeg";
import backs from "./assets/back22.jpg";
import mmm from "./assets/mmm.jpeg";
import loz from "./assets/loz.jpeg";
import loz2 from "./assets/loz2.jpeg";
import loz3 from "./assets/loz3.jpeg";
import imgSyndicate1 from "./assets/111.jpeg";
import imgSyndicate2 from "./assets/ege.jpeg";
import a11 from "./assets/a11.jpeg";
import a22 from "./assets/a22.jpeg";
import a33 from "./assets/a33.jpeg";
import a44 from "./assets/a44.jpeg";
import z11 from "./assets/z11.jpeg";
import z22 from "./assets/z22.jpeg";
import z33 from "./assets/z33.jpeg";
import z44 from "./assets/z44.jpeg";
import s11 from "./assets/s11.jpeg";
import s22 from "./assets/s22.jpeg";
import s33 from "./assets/s33.jpeg";
import s44 from "./assets/s44.jpeg";

import { getApiBaseUrl } from "./Api";

/** Normalize DB values like `uploads/foo.jpg` to `/uploads/foo.jpg`. */
function toUploadsPath(u) {
  const s = String(u).trim().replace(/\\/g, "/");
  if (!s) return null;
  if (s.startsWith("/")) return s;
  if (/^uploads\//i.test(s)) return `/${s}`;
  return null;
}

/**
 * Resolves image URLs stored by the API (wwwroot/uploads, including publish/wwwroot/uploads).
 * Uses the same base as Api.js: dev → same-origin + Vite proxy; prod → VITE_API_BASE_URL or default API host.
 */
export function resolveContentImage(url, fallbacks, index) {
  const u = url && String(url).trim();
  if (!u) return fallbacks[index % fallbacks.length];

  if (/^https?:\/\//i.test(u)) {
    try {
      const parsed = new URL(u);
      const loopback =
        parsed.hostname === "localhost" ||
        parsed.hostname === "127.0.0.1" ||
        parsed.hostname === "[::1]";
      if (loopback && /\/uploads\//i.test(parsed.pathname)) {
        const base = getApiBaseUrl();
        const path = `${parsed.pathname}${parsed.search}${parsed.hash}`;
        if (base) return `${base}${path}`;
        return path;
      }
    } catch {
      /* ignore */
    }
    return u;
  }

  const path = toUploadsPath(u);
  if (path == null) return fallbacks[index % fallbacks.length];

  const base = getApiBaseUrl();
  if (base) return `${base}${path}`;
  return path;
}

export const localImageSets = {
  news: [m11, m22, m33],
  hero: [backs, mmm, loz, loz2, loz3],
  syndicate: [imgSyndicate1, imgSyndicate2],
  awards: [s11, s22, s33, s33, s44],
  events: [z11, z22, z33, z44],
  alumni: [a11, a44, a22, a33],
};

export const staticFallbackBundle = {
  newsData: [
    {
      id: 1,
      image: m11,
      title:
        "Misr University for Science and Technology (MUST) is proud to announce the opening of applications for Teaching Assistant positions. We are looking for our top-performing graduates from the classes of 2022, 2023, and 2024 to join the Faculty of Information Technology and contribute to our academic excellence",
    },
    {
      id: 2,
      image: m22,
      title:
        "The Faculty of Information Technology at Misr University for Science and Technology (MUST) is announcing vacancies for Teaching Assistant positions for the 2024-2025 class. We are seeking talented candidates in Computer Science, Information Systems, and Artificial Intelligence. Interested applicants should submit their documents to it.faculty@must.edu.eg before September 25, 2025",
    },
    {
      id: 3,
      image: m33,
      title:
        "Master's Degree in Computer Science – Now Open for Applications! Join the Faculty of IT at MUST University for an intensive 18-month program (36 credit hours). Future-proof your career and apply today by scanning the QR code in the image!",
    },
  ],

  slides: [
    { id: 1, image: backs },
    { id: 2, image: mmm },
    { id: 3, image: loz },
    { id: 4, image: loz2 },
    { id: 5, image: loz3 },
  ],

  syndicateData: [
    {
      id: 1,
      title: "الشعار الرسمي",
      image: imgSyndicate1,
      link: "https://www.facebook.com/EsspEgypt",
      btnText: "صفحة الفيسبوك",
      color: "bg-blue-600",
    },
    {
      id: 2,
      title: "كيفيه الاشتراكات",
      image: imgSyndicate2,
      link: "https://www.hugedomains.com/domain_profile.cfm?d=esspegypt.com&sfnsn=scwspwa",
      btnText: "الموقع الرسمي",
      color: "bg-blue-600",
    },
  ],

  awards: [
    {
      id: 1,
      title:
        "MUST Is A Pioneer In Getting Awards In All Fields Thanks To Its Precious Leading Authority And Success Seeking Students.",
      subtitle: "Kerolos Mousa",
      name: "The team from Misr University for Science and Technology (MUST) won first place in Egypt and third place in the Arab world, qualifying for the Imagine Cup global competition, which will be held in Seattle, USA, at the end of July. Under the slogan 'Dream... Build your dream and live it,' the sole Egyptian representative team will compete in the global competition, where qualified teams from universities around the world will vie to develop practical solutions for improving life globally using technology. The competition aims to provide more opportunities for students worldwide to acquire the skills that will help them innovate and turn ideas into reality. The winning team consists of three students: Samer Wagdy, Mostafa Zaza, and Hussein El-Sawy, all from the Faculty of Information Technology at MUST.",
      content: "",
      image: s11,
    },
    {
      id: 2,
      title:
        "MUST Is A Pioneer In Getting Awards In All Fields Thanks To Its Precious Leading Authority And Success Seeking Students.",
      subtitle: "Mostafa",
      name: "We have saved the third place in Imagine Cup World Simi-final 'Pan Arab' Innovation category for Egypt our lovely country, which was held in Qatar, competing with 23 teams from 13 Arab country. It was a great honor to meet all of that innovators around the Arab world :)",
      image: s22,
    },
    {
      id: 3,
      title:
        "MUST Is A Pioneer In Getting Awards In All Fields Thanks To Its Precious Leading Authority And Success Seeking Students.",
      subtitle: "Mostafa",
      name: "With more than 2700 applied startups, GBarena got selected among 70 other startups to be funded by the French government with incubation for one year in Marseille at Belle de Mai, to helping us enter the European esports market.",
      image: s33,
    },
    {
      id: 4,
      title:
        "MUST Is A Pioneer In Getting Awards In All Fields Thanks To Its Precious Leading Authority And Success Seeking Students.",
      subtitle: "Mostafa",
      name: "GBarena has been selected to be one of the 50 startup world cup finalist projects from all over the world competing with the most promising startups in Copenhagen",
      image: s33,
    },
    {
      id: 5,
      title:
        "MUST Is A Pioneer In Getting Awards In All Fields Thanks To Its Precious Leading Authority And Success Seeking Students.",
      subtitle: "Mostafa",
      name: "The prize rewards entrepreneurs for developing products or services that use ICT in an innovative way to achieve social impact and meet the needs of Africans in the energy field. 'Twinkle Box'. Officially Honored by Mobinil Egypt for our achievement",
      image: s44,
    },
  ],

  events: [
    {
      id: 1,
      image: z11,
      date: { day: "06", month: "Nov" },
      location: "Conference Hall",
      time: "11:00 am - 5:00 pm",
      title: "College of Information Technology conference entitle...",
      description:
        "As inspirational as it gets! We couldn't be more proud of our MUSTians sharing their success stories on the MUST stage.",
      color: "bg-[#3b4b81]",
    },
    {
      id: 2,
      image: z22,
      date: { day: "11", month: "Feb" },
      location: "Conference Hall",
      time: "10:00 am - 3:00 pm",
      title: "International Day for Women and Girls...",
      description:
        'Get ready to take in all the business slang and principles from the best in the field in the  "BUSINESS 101" panel discussion!',
      color: "bg-[#3b4b81]",
    },
    {
      id: 3,
      image: z33,
      date: { day: "11", month: "Dec" },
      location: "MUST Golf Garden",
      time: "10:00 am - 7:00 pm",
      title: "MUST Winter Festival",
      description:
        "Ready to revive cozy winter nights? How's that...slang and principles from the best in the field in the songs",
      color: "bg-[#3b4b81]",
    },
    {
      id: 4,
      image: z44,
      date: { day: "23", month: "Feb" },
      location: "Conference Hall",
      time: "10:00 am - 5:00 pm",
      title: "MUST Cultural Day",
      description:
        'Snippets from the "AI and Digital Transformation" panel, as industry leaders discuss how AI is reshaping the landscape of digital transformation and its impact on business strategies.',
      color: "bg-[#00a651]",
    },
  ],

  alumni: [
    {
      id: 1,
      name: "Ahmed Hesham Douma",
      image: a11,
      shortDescription:
        "Ahmed Hesham Douma, 🎓💻 a 2013 Information Technology and Artificial Intelligence graduate from MUST, is now the founder of TechieVai in Germany 🇩🇪.",
      description:
        "Ahmed Hesham Douma, 🎓💻 a 2013 Information Technology and Artificial Intelligence graduate from MUST, is now the founder of TechieVai in Germany 🇩🇪.",
      fullBio:
        "Ahmed Hesham Douma, 🎓💻 a 2013 Information Technology and Artificial Intelligence graduate from MUST, is now the founder of TechieVai in Germany 🇩🇪.\n\nHis passion for computer science, combined with the education he received at MUST, ignited his journey into the world of Embedded Systems and Automotive Software Engineering .\n\nHe began his career at VALEO, then moved to Germany where he took on key roles at BOSCH and BOSE, contributing to the advancement of automotive technologies .\n\nToday, he's leading innovation in safety-critical systems through his own consultancy .\n\nAlong the way, he also earned a Master's degree in Management and International Marketing in Germany , a clear reflection of his continuous growth and commitment to excellence. ",
    },
    {
      id: 2,
      name: "Abdulrahman AlGhamdi",
      image: a44,
      shortDescription:
        "Abdulrahman AlGhamdi, Class of 2011, a strong foundation in cybersecurity. The education he gained at the university enabled him to advance into key security roles",
      description:
        "Abdulrahman AlGhamdi, Class of 2011, a strong foundation in cybersecurity. The education he gained at the university enabled him to advance into key security roles",
      fullBio:
        "The College of Information Technology and Artificial Intelligence at MUST provided Abdulrahman AlGhamdi, Class of 2011, a strong foundation in cybersecurity. The education he gained at the university enabled him to advance into key security roles, contributing to national initiatives under Saudi Vision 2030 while working with PIF and the Royal Court. With over 14 years of experience, he continues to lead major security transformations, ensuring top protection standards for organizations.",
    },
    {
      id: 3,
      name: "Samer Wagdy ",
      image: a22,
      shortDescription:
        "Samer Wagdy  , 2014 Information Technology and Artificial Intelligence graduates.. transformed their graduation project into GBarena,",
      description:
        "Samer Wagdy  , 2014 Information Technology and Artificial Intelligence graduates.. transformed their graduation project into GBarena,",
      fullBio:
        "Samer Wagdy  , 2014 Information Technology and Artificial Intelligence graduates, transformed their graduation project into GBarena, a startup that became a leading gaming and esports platform in the region, after winning first place at Microsoft's Imagine Cup.\n\nThese two passionate entrepreneurs went from classmates to co-founders, showing how the right education, ambition, and friendship can spark global success.\n\nToday, with investors from KSA, the UAE, and Egypt, they continue to innovate and expand, proving that the opportunities at MUST extend far beyond graduation!",
    },
    {
      id: 4,
      name: "Mostafa Zaza",
      image: a33,
      shortDescription:
        " Mostafa Zaza , 2014 Information Technology and Artificial Intelligence graduates.. transformed their graduation project into GBarena,",
      description:
        " Mostafa Zaza , 2014 Information Technology and Artificial Intelligence graduates.. transformed their graduation project into GBarena,",
      fullBio:
        "Samer Wagdy  , 2014 Information Technology and Artificial Intelligence graduates, transformed their graduation project into GBarena, a startup that became a leading gaming and esports platform in the region, after winning first place at Microsoft's Imagine Cup.\n\nThese two passionate entrepreneurs went from classmates to co-founders, showing how the right education, ambition, and friendship can spark global success.\n\nToday, with investors from KSA, the UAE, and Egypt, they continue to innovate and expand, proving that the opportunities at MUST extend far beyond graduation!",
    },
  ],
};
