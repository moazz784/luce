import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import {
  Trash2,
  Edit,
  Plus,
  LayoutDashboard,
  Newspaper,
  Calendar,
  Trophy,
  Users,
  Image as ImageIcon,
  Images,
  Link2,
  X,
  Save,
  UploadCloud,
  LogOut,
  Mail,
  Home,
  FileText,
  Video,
  Youtube,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { api, uploadMedia } from "./Api";
import { logout } from "./authService";
import { resolveGalleryCardVisual, VimeoPosterImage } from "./galleryVideoMedia";

const sectionApiPath = {
  News: "/api/admin/news",
  Events: "/api/admin/events",
  Awards: "/api/admin/awards",
  Alumni: "/api/admin/alumni",
  Hero: "/api/admin/hero",
  Syndicates: "/api/admin/syndicates",
  Gallery: "/api/admin/gallery",
};

const CONTACT_MESSAGES_PATH = "/api/admin/contact-messages";

function isoToDatetimeLocalValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Helper functions for localStorage
const saveVideoTitleToLocalStorage = (videoUrl, title) => {
  if (!videoUrl) return;
  const storedTitles = JSON.parse(localStorage.getItem('galleryVideoTitles') || '{}');
  storedTitles[videoUrl] = title;
  localStorage.setItem('galleryVideoTitles', JSON.stringify(storedTitles));
};

const getVideoTitleFromLocalStorage = (videoUrl) => {
  if (!videoUrl) return '';
  const storedTitles = JSON.parse(localStorage.getItem('galleryVideoTitles') || '{}');
  return storedTitles[videoUrl] || '';
};

function normalizeRows(section, rows) {
  if (!Array.isArray(rows)) return [];
  switch (section) {
    case "News":
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        date: r.publishedAt ? new Date(r.publishedAt).toLocaleString() : "",
        publishedAtLocal: r.publishedAt
          ? isoToDatetimeLocalValue(r.publishedAt)
          : "",
        location: r.location ?? "",
        newsBody: r.body ?? "",
        image: r.imageUrl,
      }));
    case "Events":
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        date: r.eventDate ? String(r.eventDate).slice(0, 10) : "",
        image: r.imageUrl,
        location: r.location ?? "",
        timeRange: r.timeRange ?? "",
        description: r.description ?? "",
      }));
    case "Awards":
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        person: r.winnerName || "",
        image: r.imageUrl,
      }));
    case "Alumni":
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        job: r.shortDescription || "",
        fullBio: r.fullBio || "",
        image: r.imageUrl,
      }));
    case "Hero":
      return rows.map((r) => ({
        id: r.id,
        title: r.title || "",
        image: r.imageUrl,
      }));
    case "Syndicates":
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        image: r.imageUrl,
        link: r.link || "",
        buttonText: r.buttonText || "",
      }));
    case "Gallery":
      return rows.map((r) => ({
        id: r.id,
        year: r.year,
        sortOrder: r.sortOrder ?? 0,
        mediaUrl: r.imageUrl,
        videoUrl: r.videoUrl || null,
        videoTitle: r.videoTitle || getVideoTitleFromLocalStorage(r.videoUrl) || "",
        mediaType: r.mediaType || (r.videoUrl ? "video" : "image"),
      }));
    default:
      return [];
  }
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(() => {
    const s = searchParams.get("section");
    return s === "News" || s === "Events" ? s : "News";
  });

  const [database, setDatabase] = useState({
    Hero: [],
    News: [],
    Events: [],
    Awards: [],
    Alumni: [],
    Syndicates: [],
    Gallery: [],
  });

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    date: "",
    publishedAtLocal: "",
    location: "",
    timeRange: "",
    description: "",
    newsBody: "",
    person: "",
    name: "",
    job: "",
    fullBio: "",
    link: "",
    buttonText: "",
    galleryYear: "",
    gallerySort: "",
    media: null,
    mediaType: "image",
    videoLink: "",
    videoTitle: "",
  });
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingSyndicatePdf, setUploadingSyndicatePdf] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const syndicatePdfInputRef = useRef(null);
  const awardTitleTextareaRef = useRef(null);

  const [contactMessages, setContactMessages] = useState([]);
  const [contactLoading, setContactLoading] = useState(false);
  const [expandedContactId, setExpandedContactId] = useState(null);

  const menuItems = [
    { name: "News", label: "الأخبار (News)", icon: Newspaper, color: "text-blue-500" },
    { name: "Events", label: "الفعاليات (Events)", icon: Calendar, color: "text-purple-500" },
    { name: "Awards", label: "الجوائز (Awards)", icon: Trophy, color: "text-orange-500" },
    { name: "Alumni", label: "الخريجين (Alumni)", icon: Users, color: "text-emerald-500" },
    { name: "Hero", label: "واجهة الموقع (Hero)", icon: ImageIcon, color: "text-rose-500" },
    { name: "Syndicates", label: "نقابة ESSP", icon: Link2, color: "text-cyan-500" },
    { name: "Gallery", label: "معرض الصور (Gallery)", icon: Images, color: "text-pink-500" },
    { name: "Contact", label: "رسائل التواصل", icon: Mail, color: "text-amber-500" },
  ];

  const loadSection = useCallback(async () => {
    if (activeSection === "Contact") return;
    const path = sectionApiPath[activeSection];
    if (!path) return;
    setListLoading(true);
    try {
      const data = await api(path, { method: "GET" });
      const normalized = normalizeRows(activeSection, data);
      setDatabase((prev) => ({ ...prev, [activeSection]: normalized }));
    } catch (e) {
      alert(e.message || "فشل تحميل القائمة");
    } finally {
      setListLoading(false);
    }
  }, [activeSection]);

  useEffect(() => {
    loadSection();
  }, [loadSection]);

  useLayoutEffect(() => {
    if (activeSection !== "Awards") return;
    const el = awardTitleTextareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [formData.title, activeSection, isEditing]);

  useEffect(() => {
    if (activeSection !== "Contact") {
      setExpandedContactId(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setContactLoading(true);
      try {
        const data = await api(CONTACT_MESSAGES_PATH, { method: "GET" });
        if (!cancelled)
          setContactMessages(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) {
          setContactMessages([]);
          alert(e.message || "فشل تحميل الرسائل");
        }
      } finally {
        if (!cancelled) setContactLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeSection]);

  const handleDeleteContact = async (id) => {
    if (!window.confirm("حذف هذه الرسالة؟ لا يمكن التراجع.")) return;
    try {
      await api(`${CONTACT_MESSAGES_PATH}/${id}`, { method: "DELETE" });
      setContactMessages((prev) => prev.filter((m) => m.id !== id));
      setExpandedContactId((cur) => (cur === id ? null : cur));
    } catch (e) {
      alert(e.message || "فشل الحذف");
    }
  };

  const handleMediaChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Determine media type
    const isVideo = file.type.startsWith("video/");
    
    // إذا كان فيديو محلي، نعطي تحذير ونطلب استخدام رابط
    if (isVideo) {
      alert("⚠️ يرجى استخدام رابط فيديو خارجي (YouTube, Vimeo, إلخ) بدلاً من رفع ملف فيديو.\nيمكنك إدخال الرابط في حقل 'رابط الفيديو' أدناه.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    
    setFormData(prev => ({ ...prev, mediaType: "image", videoLink: "" }));
    setUploading(true);
    try {
      const { url } = await uploadMedia(file);
      setMediaPreview(url);
      setFormData((prev) => ({ ...prev, media: url }));
    } catch (err) {
      alert(err.message || "فشل رفع الملف");
    } finally {
      setUploading(false);
    }
  };

  const handleVideoLinkChange = (e) => {
    const link = e.target.value.trim();
    setFormData(prev => ({ 
      ...prev, 
      videoLink: link, 
      mediaType: "video", 
      media: null 
    }));
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleMediaTypeToggle = (type) => {
    setFormData(prev => ({ 
      ...prev, 
      mediaType: type,
      ...(type === "image" ? { videoLink: "" } : { media: null })
    }));
    if (type === "image") {
      setMediaPreview(null);
    } else {
      setMediaPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSyndicatePdfForLink = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingSyndicatePdf(true);
    try {
      const { url } = await uploadMedia(file);
      setFormData((prev) => ({ ...prev, link: url }));
    } catch (err) {
      alert(err.message || "فشل رفع ملف PDF");
    } finally {
      setUploadingSyndicatePdf(false);
      e.target.value = "";
    }
  };

  const startEdit = (item) => {
    setIsEditing(true);
    setFormData({
      id: item.id,
      title: item.title ?? "",
      date: item.date ?? "",
      publishedAtLocal: item.publishedAtLocal ?? "",
      location: item.location ?? "",
      timeRange: item.timeRange ?? "",
      description: item.description ?? "",
      newsBody: item.newsBody ?? "",
      person: item.person ?? "",
      name: item.name ?? "",
      job: item.job ?? "",
      fullBio: item.fullBio ?? "",
      link: item.link ?? "",
      buttonText: item.buttonText ?? "",
      galleryYear:
        item.galleryYear != null && item.galleryYear !== ""
          ? String(item.galleryYear)
          : item.year != null
            ? String(item.year)
            : "",
      gallerySort:
        item.gallerySort != null && item.gallerySort !== ""
          ? String(item.gallerySort)
          : item.sortOrder != null
            ? String(item.sortOrder)
            : "",
      media: item.mediaUrl ?? null,
      mediaType: item.mediaType ?? (item.videoUrl ? "video" : "image"),
      videoLink: item.videoUrl ?? "",
      videoTitle: item.videoTitle ?? "",
    });
    setMediaPreview(item.mediaUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = useCallback(() => {
    setIsEditing(false);
    setFormData({
      id: null,
      title: "",
      date: "",
      publishedAtLocal: "",
      location: "",
      timeRange: "",
      description: "",
      newsBody: "",
      person: "",
      name: "",
      job: "",
      fullBio: "",
      link: "",
      buttonText: "",
      galleryYear: "",
      gallerySort: "",
      media: null,
      mediaType: "image",
      videoLink: "",
      videoTitle: "",
    });
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (syndicatePdfInputRef.current) syndicatePdfInputRef.current.value = "";
  }, []);

  useEffect(() => {
    const s = searchParams.get("section");
    if (s === "News" || s === "Events") {
      setActiveSection(s);
      resetForm();
    }
  }, [searchParams, resetForm]);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "⚠️ هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع."
      )
    )
      return;
    const path = sectionApiPath[activeSection];
    try {
      await api(`${path}/${id}`, { method: "DELETE" });
      await loadSection();
    } catch (e) {
      alert(e.message || "فشل الحذف");
    }
  };

  const buildPayload = () => {
    const path = sectionApiPath[activeSection];
    
    if (activeSection === "News") {
      if (!formData.media) {
        throw new Error("يرجى رفع صورة للخبر");
      }
      const publishedAt = formData.publishedAtLocal
        ? new Date(formData.publishedAtLocal).toISOString()
        : null;
      return {
        path,
        body: {
          title: formData.title,
          body: formData.newsBody?.trim() || null,
          location: formData.location?.trim() || null,
          imageUrl: formData.media,
          publishedAt,
          sortOrder: 0,
          isPublished: true,
        },
      };
    }
    
    if (activeSection === "Events") {
      if (!formData.media) {
        throw new Error("يرجى رفع صورة للفعالية");
      }
      const locRaw = formData.location?.trim();
      if (!locRaw) {
        throw new Error("يرجى إدخال مكان الفعالية (Location)");
      }
      const eventDate = formData.date
        ? new Date(formData.date + "T12:00:00").toISOString()
        : new Date().toISOString();
      const loc = locRaw;
      const tr = formData.timeRange?.trim() || null;
      const desc = formData.description?.trim() || null;
      return {
        path,
        body: {
          title: formData.title,
          eventDate,
          location: loc,
          timeRange: tr,
          description: desc,
          accentColor: null,
          imageUrl: formData.media,
          sortOrder: 0,
        },
      };
    }
    
    if (activeSection === "Awards") {
      if (!formData.media) {
        throw new Error("يرجى رفع صورة للجائزة");
      }
      return {
        path,
        body: {
          title: formData.title,
          subtitle: null,
          winnerName: formData.person,
          content: null,
          imageUrl: formData.media,
          sortOrder: 0,
        },
      };
    }
    
    if (activeSection === "Alumni") {
      if (!formData.media) {
        throw new Error("يرجى رفع صورة للخريج");
      }
      return {
        path,
        body: {
          name: formData.name,
          shortDescription: formData.job,
          fullBio: formData.fullBio || null,
          imageUrl: formData.media,
          sortOrder: 0,
        },
      };
    }
    
    if (activeSection === "Hero") {
      if (!formData.media) {
        throw new Error("يرجى رفع صورة للهيرو");
      }
      return {
        path,
        body: {
          title: formData.title || null,
          imageUrl: formData.media,
          sortOrder: 0,
        },
      };
    }
    
    if (activeSection === "Syndicates") {
      if (!formData.media) {
        throw new Error("يرجى رفع صورة مصغرة للبطاقة");
      }
      if (!formData.link) {
        throw new Error("يرجى إدخال رابط البطاقة أو رفع ملف PDF");
      }
      if (!formData.buttonText) {
        throw new Error("يرجى إدخال نص الزر");
      }
      return {
        path,
        body: {
          title: formData.title,
          imageUrl: formData.media,
          link: formData.link,
          buttonText: formData.buttonText,
          sortOrder: 0,
        },
      };
    }
    
    if (activeSection === "Gallery") {
      const year = parseInt(formData.galleryYear, 10);
      if (Number.isNaN(year) || year < 1900 || year > 3000) {
        throw new Error("أدخل سنة صالحة (1900–3000)");
      }
      const sortParsed = parseInt(formData.gallerySort, 10);
      const sortOrder = Number.isNaN(sortParsed) ? 0 : sortParsed;
      
      // التحقق من وجود فيديو أو صورة
      if (formData.mediaType === "video" && !formData.videoLink) {
        throw new Error("يرجى إدخال رابط الفيديو (YouTube, Vimeo, إلخ)");
      }
      if (formData.mediaType === "image" && !formData.media) {
        throw new Error("يرجى رفع صورة أو اختيار فيديو عبر الرابط");
      }
      
      // حفظ videoTitle في localStorage
      if (formData.mediaType === "video" && formData.videoLink) {
        saveVideoTitleToLocalStorage(formData.videoLink, formData.videoTitle);
      }
      
      return {
        path,
        body: {
          year,
          imageUrl: formData.mediaType === "image" ? formData.media : null,
          videoUrl: formData.mediaType === "video" ? formData.videoLink : null,
          videoTitle: formData.mediaType === "video" ? formData.videoTitle : null,
          mediaType: formData.mediaType,
          sortOrder,
        },
      };
    }
    
    throw new Error("قسم غير معروف");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { path, body } = buildPayload();
      if (isEditing && formData.id != null) {
        await api(`${path}/${formData.id}`, {
          method: "PUT",
          body:
            activeSection === "News"
              ? {
                  title: body.title,
                  body: body.body,
                  location: body.location,
                  imageUrl: body.imageUrl,
                  publishedAt: body.publishedAt,
                  sortOrder: body.sortOrder,
                  isPublished: body.isPublished,
                }
              : activeSection === "Events"
                ? {
                    title: body.title,
                    eventDate: body.eventDate,
                    location: body.location,
                    timeRange: body.timeRange,
                    description: body.description,
                    accentColor: body.accentColor,
                    imageUrl: body.imageUrl,
                    sortOrder: body.sortOrder,
                  }
                : activeSection === "Awards"
                  ? {
                      title: body.title,
                      subtitle: body.subtitle,
                      winnerName: body.winnerName,
                      content: body.content,
                      imageUrl: body.imageUrl,
                      sortOrder: body.sortOrder,
                    }
                  : activeSection === "Alumni"
                    ? {
                        name: body.name,
                        shortDescription: body.shortDescription,
                        fullBio: body.fullBio,
                        imageUrl: body.imageUrl,
                        sortOrder: body.sortOrder,
                      }
                    : activeSection === "Syndicates"
                      ? {
                          title: body.title,
                          imageUrl: body.imageUrl,
                          link: body.link,
                          buttonText: body.buttonText,
                          sortOrder: body.sortOrder,
                        }
                      : activeSection === "Gallery"
                        ? {
                            year: body.year,
                            imageUrl: body.imageUrl,
                            videoUrl: body.videoUrl,
                            videoTitle: body.videoTitle,
                            mediaType: body.mediaType,
                            sortOrder: body.sortOrder,
                          }
                        : {
                            title: body.title,
                            imageUrl: body.imageUrl,
                            sortOrder: body.sortOrder,
                          },
        });
      } else {
        await api(path, { method: "POST", body });
      }
      resetForm();
      await loadSection();
    } catch (err) {
      alert(err.message || "فشل الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const renderFormFields = () => {
    switch (activeSection) {
      case "News":
        return (
          <>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                العنوان
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="form-input"
                placeholder="عنوان الخبر..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                التاريخ والوقت
              </label>
              <input
                type="datetime-local"
                required
                value={formData.publishedAtLocal}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    publishedAtLocal: e.target.value,
                  })
                }
                className="form-input"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                المكان / Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="form-input"
                placeholder="مثلاً: Main Campus — Conference Hall"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                نص الخبر (اختياري)
              </label>
              <textarea
                rows={5}
                value={formData.newsBody}
                onChange={(e) =>
                  setFormData({ ...formData, newsBody: e.target.value })
                }
                className="form-input w-full"
                placeholder="المحتوى الكامل للخبر..."
              />
            </div>
          </>
        );
      case "Events":
        return (
          <>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                العنوان
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="form-input"
                placeholder="عنوان الفعالية..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                التاريخ
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="form-input"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                المكان / Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="form-input"
                placeholder="مثلاً: Conference Hall"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                الوقت / Time range
              </label>
              <input
                type="text"
                value={formData.timeRange}
                onChange={(e) =>
                  setFormData({ ...formData, timeRange: e.target.value })
                }
                className="form-input"
                placeholder="مثلاً: 10:00 am - 3:00 pm"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                الوصف (اختياري)
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="form-input w-full"
                placeholder="وصف مختصر للفعالية..."
              />
            </div>
          </>
        );
      case "Awards":
        return (
          <>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                الوصف <span className="text-gray-400 font-normal">(Description)</span>
              </label>
              <textarea
                ref={awardTitleTextareaRef}
                required
                maxLength={500}
                rows={2}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="form-input w-full min-h-[3rem] resize-none overflow-hidden"
                style={{ fieldSizing: "content" }}
                placeholder="وصف الجائزة..."
              />
              <p className="text-[11px] text-gray-400 mt-1 text-left">
                {formData.title.length}/500
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                اسم الفائز
              </label>
              <input
                type="text"
                required
                value={formData.person}
                onChange={(e) =>
                  setFormData({ ...formData, person: e.target.value })
                }
                className="form-input"
                placeholder="اسم الشخص..."
              />
            </div>
          </>
        );
      case "Alumni":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                اسم الخريج
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="form-input"
                placeholder="الاسم الكامل..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                الوظيفة/الإنجاز
              </label>
              <input
                type="text"
                required
                value={formData.job}
                onChange={(e) =>
                  setFormData({ ...formData, job: e.target.value })
                }
                className="form-input"
                placeholder="مثلاً: مدير شركة X..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                السيرة الكاملة (اختياري)
              </label>
              <textarea
                rows={4}
                value={formData.fullBio}
                onChange={(e) =>
                  setFormData({ ...formData, fullBio: e.target.value })
                }
                className="form-input w-full"
                placeholder="نص طويل..."
              />
            </div>
          </>
        );
      case "Hero":
        return (
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              النص الرئيسي للبانر (اختياري)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="form-input"
              placeholder="اكتب النص الذي يظهر فوق الصورة..."
            />
          </div>
        );
      case "Gallery":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                السنة / Year
              </label>
              <input
                type="number"
                required
                min={1900}
                max={3000}
                value={formData.galleryYear}
                onChange={(e) =>
                  setFormData({ ...formData, galleryYear: e.target.value })
                }
                className="form-input"
                placeholder="2026"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                ترتيب العرض (Sort Order)
              </label>
              <input
                type="number"
                value={formData.gallerySort}
                onChange={(e) =>
                  setFormData({ ...formData, gallerySort: e.target.value })
                }
                className="form-input"
                placeholder="0"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                نوع الوسائط
              </label>
              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => handleMediaTypeToggle("image")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                    formData.mediaType === "image"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <ImageIcon size={18} />
                  صورة
                </button>
                <button
                  type="button"
                  onClick={() => handleMediaTypeToggle("video")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                    formData.mediaType === "video"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Youtube size={18} />
                  فيديو (رابط)
                </button>
              </div>
            </div>
            {formData.mediaType === "image" ? (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  صورة المعرض
                </label>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center bg-gray-50 hover:border-blue-300 transition-all cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleMediaChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {mediaPreview ? (
                    <div className="relative group">
                      <img
                        src={mediaPreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-xl shadow-md"
                      />
                      <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs gap-2">
                        <UploadCloud size={20} />
                        تغيير الصورة
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-gray-400 group-hover:text-blue-500">
                      <UploadCloud size={40} className="mx-auto mb-2 opacity-70" />
                      <span className="font-medium text-sm">اضغط لرفع صورة</span>
                      <p className="text-xs mt-1">
                        {uploading ? "جاري الرفع…" : "PNG, JPG, WebP (حتى 10MB)"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    رابط الفيديو
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.videoLink}
                    onChange={handleVideoLinkChange}
                    className="form-input"
                    placeholder="https://www.youtube.com/watch?v=... أو https://vimeo.com/..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    ✅ يدعم: YouTube, Vimeo, Dailymotion, وأي رابط فيديو مباشر
                  </p>
                  {formData.videoLink && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-2">معاينة الرابط:</p>
                      <div className="flex items-center gap-2 text-sm text-blue-600 break-all">
                        <Youtube size={16} />
                        <span>{formData.videoLink}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    اسم الفيديو (اختياري)
                  </label>
                  <input
                    type="text"
                    value={formData.videoTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, videoTitle: e.target.value })
                    }
                    className="form-input"
                    placeholder="مثال: محاضرة الذكاء الاصطناعي 2024"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    سيظهر هذا الاسم تحت الفيديو في المعرض
                  </p>
                </div>
              </>
            )}
          </>
        );
      case "Syndicates":
        return (
          <>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                العنوان
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="form-input"
                placeholder="عنوان ..."
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                رابط البطاقة (يفتح عند الضغط على الصورة أو الزر)
              </label>
              <p className="text-xs text-slate-500 leading-relaxed">
                اكتب رابطاً يدوياً (مثل https://…) أو ارفع ملف PDF ليصبح الرابط نفسه ملفاً
                على الخادم. لا يزال مطلوباً رفع صورة مصغّرة في المربع على اليسار منفصلة.
              </p>
              <input
                type="text"
                required
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                className="form-input"
                placeholder="https://… أو مسار بعد رفع PDF"
                spellCheck={false}
              />
              <input
                type="file"
                ref={syndicatePdfInputRef}
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={handleSyndicatePdfForLink}
              />
              <button
                type="button"
                disabled={uploadingSyndicatePdf}
                onClick={() => syndicatePdfInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-600/40 bg-cyan-50 text-cyan-800 text-sm font-semibold hover:bg-cyan-100 disabled:opacity-60"
              >
                <FileText size={18} />
                {uploadingSyndicatePdf ? "جاري رفع PDF…" : "رفع PDF كرابط"}
              </button>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                نص الزر
              </label>
              <input
                type="text"
                required
                value={formData.buttonText}
                onChange={(e) =>
                  setFormData({ ...formData, buttonText: e.target.value })
                }
                className="form-input"
                placeholder="مثلاً: زيارة الموقع"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderGalleryMediaPreview = (mediaUrl, mediaType, videoUrl, videoTitle) => {
    if (!mediaUrl && !videoUrl) return null;

    const thumbCls =
      "w-20 h-16 object-cover rounded-lg shadow-sm border border-gray-100";
    const visual = resolveGalleryCardVisual({
      imageUrl: mediaUrl,
      videoUrl,
      mediaType,
    });

    if (visual.kind === "image" || visual.kind === "poster") {
      return (
        <div className="flex flex-col gap-1">
          <img src={visual.src} alt="Gallery media" className={thumbCls} />
          {videoTitle && mediaType === "video" && (
            <span className="text-xs text-gray-600 max-w-[80px] truncate">{videoTitle}</span>
          )}
        </div>
      );
    }

    if (visual.kind === "video") {
      return (
        <div className="flex flex-col gap-1">
          <video
            src={visual.videoSrc}
            muted
            playsInline
            preload="metadata"
            className={thumbCls}
            aria-label="Video preview"
          />
          {videoTitle && (
            <span className="text-xs text-gray-600 max-w-[80px] truncate">{videoTitle}</span>
          )}
        </div>
      );
    }

    if (visual.kind === "vimeo") {
      return (
        <div className="flex flex-col gap-1">
          <VimeoPosterImage
            videoUrl={visual.videoUrl}
            alt="Gallery media"
            className={thumbCls}
            loadingClassName="bg-slate-200 flex items-center justify-center rounded-lg shadow-sm border border-gray-100"
          />
          {videoTitle && (
            <span className="text-xs text-gray-600 max-w-[80px] truncate">{videoTitle}</span>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1">
        <div
          className={`${thumbCls} bg-slate-200 flex items-center justify-center object-cover`}
        >
          <Video className="w-6 h-6 text-slate-500" aria-hidden />
        </div>
        {videoTitle && (
          <span className="text-xs text-gray-600 max-w-[80px] truncate">{videoTitle}</span>
        )}
      </div>
    );
  };

  return (
    <div
      className="admin-dashboard-shell flex h-screen bg-gray-100 text-right text-slate-900 dark:text-slate-900"
      dir="rtl"
    >
      <aside className="w-64 bg-slate-950 text-white flex flex-col shadow-2xl border-l border-slate-800">
        <div className="p-6 text-2xl font-extrabold border-b border-slate-800 flex items-center gap-3 text-blue-400">
          <LayoutDashboard size={28} /> MUST Admin
        </div>
        <div className="px-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-4 w-full p-4 rounded-xl text-lg font-medium transition-all duration-150 hover:bg-slate-800 text-slate-300"
          >
            <Home size={22} className="text-emerald-400" />
            الرئيسية (Home)
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-3 pt-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                setActiveSection(item.name);
                resetForm();
              }}
              className={`flex items-center gap-4 w-full p-4 rounded-xl text-lg font-medium transition-all duration-150 ${
                activeSection === item.name
                  ? "bg-blue-600 text-white shadow-lg transform scale-105"
                  : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              <item.icon
                size={22}
                className={
                  activeSection === item.name ? "text-white" : item.color
                }
              />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            type="button"
            onClick={async () => {
              await logout();
              toast.success("Logged out successfully");
              navigate("/", { replace: true });
            }}
            className="w-full p-3 bg-slate-800 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2 text-slate-400 hover:text-white"
          >
            <LogOut size={18} /> تسجيل الخروج
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-10 text-slate-900 dark:text-slate-900">
        <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-slate-900">
            إدارة قسم{" "}
            <span className="text-blue-600">
              {menuItems.find((i) => i.name === activeSection)?.label}
            </span>
          </h1>
          <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-full shadow-sm border">
            <span className="text-sm text-gray-500">مرحباً، رئيس التحرير</span>
            <img
              src="https://ui-avatars.com/api/?name=MUST+Admin&background=0D8ABC&color=fff"
              className="w-10 h-10 rounded-full border-2 border-blue-100"
              alt=""
            />
          </div>
        </div>

        {(activeSection === "Contact" ? contactLoading : listLoading) && (
          <p className="text-sm text-gray-500 mb-4">جاري تحميل القائمة…</p>
        )}

        {activeSection === "Contact" ? (
        <section className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden text-slate-900 dark:text-slate-900">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-700">
              رسائل نموذج التواصل من الصفحة الرئيسية
            </h3>
            <span className="text-sm font-medium bg-amber-100 text-amber-800 px-4 py-1 rounded-full">
              {contactMessages.length} رسالة
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[720px]">
              <thead>
                <tr className="bg-slate-100/50 border-b border-slate-100">
                  <th className="p-4 text-slate-600 font-bold whitespace-nowrap">التاريخ</th>
                  <th className="p-4 text-slate-600 font-bold">الاسم</th>
                  <th className="p-4 text-slate-600 font-bold">البريد</th>
                  <th className="p-4 text-slate-600 font-bold">الهاتف</th>
                  <th className="p-4 text-slate-600 font-bold">الرسالة</th>
                  <th className="p-4 text-slate-600 font-bold text-center w-36">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contactMessages.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr className="hover:bg-amber-50/40 transition align-top">
                      <td className="p-4 text-sm text-slate-500 whitespace-nowrap">
                        {item.createdAt
                          ? String(item.createdAt).replace("T", " ").slice(0, 19)
                          : "—"}
                      </td>
                      <td className="p-4 font-medium text-slate-800">{item.name}</td>
                      <td className="p-4 text-sm text-blue-700 break-all">{item.email}</td>
                      <td className="p-4 text-sm text-slate-600">{item.phone || "—"}</td>
                      <td className="p-4 text-sm text-slate-700 max-w-md">
                        <p className="line-clamp-3 whitespace-pre-wrap break-words">
                          {item.message}
                        </p>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col sm:flex-row justify-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedContactId((id) =>
                                id === item.id ? null : item.id,
                              )
                            }
                            className="text-sm text-amber-700 hover:underline"
                          >
                            {expandedContactId === item.id ? "إخفاء النص" : "عرض الكامل"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteContact(item.id)}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-full inline-flex justify-center"
                            title="حذف"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedContactId === item.id && (
                      <tr className="bg-slate-50/80">
                        <td colSpan={6} className="p-5 border-t border-slate-100">
                          <p className="text-xs font-semibold text-slate-500 mb-2">نص الرسالة كاملاً</p>
                          <pre className="whitespace-pre-wrap text-sm text-slate-800 font-sans text-right">
                            {item.message}
                          </pre>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          {contactMessages.length === 0 && !contactLoading && (
            <div className="p-16 text-center text-gray-400 flex flex-col items-center gap-4">
              <Mail size={48} className="opacity-40" />
              <p className="text-lg">لا توجد رسائل بعد.</p>
              <p className="text-sm">عند إرسال الزوار لنموذج التواصل في الموقع، ستظهر هنا.</p>
            </div>
          )}
        </section>
        ) : (
        <>
        <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-12 relative overflow-hidden text-slate-900 dark:text-slate-900">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50 rounded-full opacity-50" />

          <div className="flex justify-between items-center mb-6 relative z-10">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800">
              {isEditing ? (
                <Edit className="text-orange-500" />
              ) : (
                <Plus className="text-green-500" />
              )}
              {isEditing
                ? `تعديل عنصر في ${activeSection}`
                : `إضافة عنصر جديد لـ ${activeSection}`}
            </h2>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-400 hover:text-red-500 flex items-center gap-1"
              >
                <X size={18} /> إلغاء التعديل
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
          >
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFormFields()}
            </div>

            {activeSection !== "Gallery" && (
              <div
                className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center bg-gray-50 hover:border-blue-300 transition-all cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMediaChange}
                  accept="image/*"
                  className="hidden"
                />

                {mediaPreview ? (
                  <div className="relative group">
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-xl shadow-md"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs gap-2">
                      <UploadCloud size={20} />
                      تغيير الصورة
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-gray-400 group-hover:text-blue-500">
                    <UploadCloud size={40} className="mx-auto mb-2 opacity-70" />
                    <span className="font-medium text-sm">اضغط لرفع صورة</span>
                    <p className="text-xs mt-1">
                      {uploading ? "جاري الرفع…" : "PNG, JPG, WebP (حتى 10MB)"}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="md:col-span-3 flex justify-end mt-4">
              <button
                type="submit"
                disabled={saving || uploading || uploadingSyndicatePdf}
                className={`flex items-center gap-2 px-10 py-3 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 disabled:opacity-60 ${
                  isEditing
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                <Save size={18} />
                {saving ? "جاري الحفظ…" : isEditing ? "حفظ التعديلات" : "نشر المحتوى الآن"}
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden text-slate-900 dark:text-slate-900">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
            <h3 className="text-xl font-bold text-slate-700">
              المحتوى المنشور حالياً في هذا القسم
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              {(activeSection === "News" || activeSection === "Events") && (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
                >
                  <Plus size={18} />
                  إضافة جديد
                </button>
              )}
              <span className="text-sm font-medium bg-blue-100 text-blue-700 px-4 py-1 rounded-full">
                {database[activeSection].length} عناصر
              </span>
            </div>
          </div>

          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-100/50 border-b border-slate-100">
                <th className="p-5 text-slate-600 font-bold w-24">الملف</th>
                <th className="p-5 text-slate-600 font-bold">التفاصيل</th>
                <th className="p-5 text-slate-600 font-bold text-center w-40">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {database[activeSection].map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50/50 transition duration-100"
                >
                  <td className="p-5">
                    {activeSection === "Gallery" ? (
                      renderGalleryMediaPreview(item.mediaUrl, item.mediaType, item.videoUrl, item.videoTitle)
                    ) : (
                      <img
                        src={item.image}
                        alt="Thumb"
                        className="w-20 h-16 object-cover rounded-lg shadow-sm border border-gray-100"
                      />
                    )}
                  </td>
                  <td className="p-5">
                    {activeSection === "Alumni" ? (
                      <div>
                        <div className="font-semibold text-slate-800 text-lg">
                          {item.name}
                        </div>
                        <div className="text-sm text-emerald-600 font-medium">
                          {item.job}
                        </div>
                      </div>
                    ) : activeSection === "Awards" ? (
                      <div>
                        <div className="font-semibold text-slate-800 text-lg">
                          {item.title}
                        </div>
                        <div className="text-sm text-orange-600 font-medium">
                          الفائز: {item.person}
                        </div>
                      </div>
                    ) : activeSection === "Syndicates" ? (
                      <div>
                        <div className="font-semibold text-slate-800 text-lg">
                          {item.title}
                        </div>
                        <div className="text-sm text-cyan-600 truncate max-w-md">
                          {item.link}
                        </div>
                        <div className="text-xs text-slate-500">{item.buttonText}</div>
                      </div>
                    ) : activeSection === "Events" ? (
                      <div>
                        <div className="font-semibold text-slate-800 text-lg">
                          {item.title}
                        </div>
                        {item.date && (
                          <div className="text-sm text-slate-400">{item.date}</div>
                        )}
                        {item.location ? (
                          <div className="text-sm text-purple-600 font-medium">
                            {item.location}
                          </div>
                        ) : null}
                        {item.timeRange ? (
                          <div className="text-xs text-slate-500">{item.timeRange}</div>
                        ) : null}
                      </div>
                    ) : activeSection === "News" ? (
                      <div>
                        <div className="font-semibold text-slate-800 text-lg">
                          {item.title}
                        </div>
                        {item.date && (
                          <div className="text-sm text-slate-400">{item.date}</div>
                        )}
                        {item.location ? (
                          <div className="text-sm text-blue-600 font-medium">
                            {item.location}
                          </div>
                        ) : null}
                      </div>
                    ) : activeSection === "Gallery" ? (
                      <div>
                        <div className="font-semibold text-slate-800 text-lg">
                          السنة: {item.year}
                        </div>
                        {item.videoTitle && (
                          <div className="text-sm text-blue-600 font-medium mt-1">
                            {item.videoTitle}
                          </div>
                        )}
                        <div className="text-xs text-slate-500 mt-1">
                          الترتيب: {item.sortOrder} • النوع: {item.mediaType === "video" ? "فيديو (رابط)" : "صورة"}
                        </div>
                        {item.mediaType === "video" && item.videoUrl && (
                          <div className="text-xs text-blue-600 truncate max-w-xs mt-1">
                            {item.videoUrl}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="font-semibold text-slate-800 text-lg">
                          {item.title}
                        </div>
                        {item.date && (
                          <div className="text-sm text-slate-400">{item.date}</div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-5 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="p-3 text-blue-600 hover:bg-blue-100 rounded-full transition"
                        title="تعديل"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-3 text-red-500 hover:bg-red-100 rounded-full transition"
                        title="حذف"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {database[activeSection].length === 0 && (
            <div className="p-16 text-center text-gray-400 flex flex-col items-center gap-4">
              <Newspaper size={48} className="opacity-40" />
              <p className="text-lg">
                لا يوجد محتوى في قسم{" "}
                {menuItems.find((i) => i.name === activeSection)?.label}{" "}
                حالياً.
              </p>
              <p className="text-sm">ابدأ بإضافة أول عنصر باستخدام النموذج أعلاه.</p>
            </div>
          )}
        </section>
        </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;