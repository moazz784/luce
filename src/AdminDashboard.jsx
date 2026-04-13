import React, { useState, useRef, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api, uploadMedia } from "./Api";
import { logout } from "./authService";

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
        image: r.imageUrl,
      }));
    default:
      return [];
  }
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("News");

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
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadMedia(file);
      setImagePreview(url);
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (err) {
      alert(err.message || "فشل رفع الصورة");
    } finally {
      setUploading(false);
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
      image: item.image ?? null,
    });
    setImagePreview(item.image);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
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
      image: null,
    });
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
    const imageUrl = formData.image;
    if (!imageUrl) {
      throw new Error("يرجى رفع صورة");
    }
    const path = sectionApiPath[activeSection];
    if (activeSection === "News") {
      const publishedAt = formData.publishedAtLocal
        ? new Date(formData.publishedAtLocal).toISOString()
        : null;
      return {
        path,
        body: {
          title: formData.title,
          body: formData.newsBody?.trim() || null,
          location: formData.location?.trim() || null,
          imageUrl,
          publishedAt,
          sortOrder: 0,
          isPublished: true,
        },
      };
    }
    if (activeSection === "Events") {
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
          imageUrl,
          sortOrder: 0,
        },
      };
    }
    if (activeSection === "Awards") {
      return {
        path,
        body: {
          title: formData.title,
          subtitle: null,
          winnerName: formData.person,
          content: null,
          imageUrl,
          sortOrder: 0,
        },
      };
    }
    if (activeSection === "Alumni") {
      return {
        path,
        body: {
          name: formData.name,
          shortDescription: formData.job,
          fullBio: formData.fullBio || null,
          imageUrl,
          sortOrder: 0,
        },
      };
    }
    if (activeSection === "Hero") {
      return {
        path,
        body: {
          title: formData.title || null,
          imageUrl,
          sortOrder: 0,
        },
      };
    }
    if (activeSection === "Syndicates") {
      return {
        path,
        body: {
          title: formData.title,
          imageUrl,
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
      return {
        path,
        body: {
          year,
          imageUrl,
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
                عنوان الجائزة
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="form-input"
                placeholder="مثلاً: جائزة الطالب المثالي..."
              />
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
                placeholder="عنوان البطاقة..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                رابط البطاقة
              </label>
              <input
                type="url"
                required
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                className="form-input"
                placeholder="https://..."
              />
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

  return (
    <div className="flex h-screen bg-gray-100 text-right" dir="rtl">
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

      <main className="flex-1 overflow-y-auto p-10">
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
        <section className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
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
        <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-12 relative overflow-hidden">
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

            <div
              className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center bg-gray-50 hover:border-blue-300 transition-all cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-xl shadow-md"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs">
                    <UploadCloud size={20} /> تغيير الصورة
                  </div>
                </div>
              ) : (
                <div className="py-6 text-gray-400 group-hover:text-blue-500">
                  <UploadCloud size={40} className="mx-auto mb-2 opacity-70" />
                  <span className="font-medium text-sm">اضغط لرفع صورة</span>
                  <p className="text-xs mt-1">
                    {uploading ? "جاري الرفع…" : "PNG, JPG (حتى 5MB)"}
                  </p>
                </div>
              )}
            </div>

            <div className="md:col-span-3 flex justify-end mt-4">
              <button
                type="submit"
                disabled={saving || uploading}
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

        <section className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-700">
              المحتوى المنشور حالياً في هذا القسم
            </h3>
            <span className="text-sm font-medium bg-blue-100 text-blue-700 px-4 py-1 rounded-full">
              {database[activeSection].length} عناصر
            </span>
          </div>

          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-100/50 border-b border-slate-100">
                <th className="p-5 text-slate-600 font-bold w-24">الصورة</th>
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
                    <img
                      src={item.image}
                      alt="Thumb"
                      className="w-20 h-16 object-cover rounded-lg shadow-sm border border-gray-100"
                    />
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
                          {item.year}
                        </div>
                        <div className="text-xs text-slate-500">
                          sort: {item.sortOrder}
                        </div>
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
