import React, { useState, useRef } from 'react';
import { Trash2, Edit, Plus, LayoutDashboard, Newspaper, Calendar, Trophy, Users, Image as ImageIcon, X, Save, UploadCloud,LogOut } from 'lucide-react';

const AdminDashboard = () => {
  // 1. تحديد القسم النشط
  const [activeSection, setActiveSection] = useState('News');

  // 2. قاعدة بيانات وهمية شاملة للأقسام الـ 5
  const [database, setDatabase] = useState({
    Hero: [{ id: 1, title: 'مرحباً بكم في جامعة MUST', image: 'https://via.placeholder.com/800x400?text=Hero+Image' }],
    News: [
      { id: 101, title: 'يوم كرة القدم الأول بالاستاد', date: '2026-03-25', image: 'https://via.placeholder.com/150?text=Football' },
      { id: 102, title: 'توقيع بروتوكول تعاون دولي', date: '2026-03-20', image: 'https://via.placeholder.com/150?text=Protocol' },
    ],
    Events: [{ id: 201, title: 'ندوة التحول الرقمي', date: '2026-04-01', image: 'https://via.placeholder.com/150?text=Event' }],
    Awards: [{ id: 301, title: 'كيرلس موسى يحصد جائزة الابتكار', person: 'كيرلس موسى', image: 'https://via.placeholder.com/150?text=Award' }],
    Alumni: [{ id: 401, name: 'أحمد هشام دوما', job: 'مؤسس TechieVai', image: 'https://via.placeholder.com/150?text=Alumni' }],
  });

  // 3. States لإدارة الفورم (Form Management)
  const [formData, setFormData] = useState({ id: null, title: '', date: '', person: '', name: '', job: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null); // للتحكم في Input الملفات

  // 4. القائمة الجانبية (الأقسام الـ 5 + الرئيسية)
  const menuItems = [
    { name: 'News', label: 'الأخبار (News)', icon: Newspaper, color: 'text-blue-500' },
    { name: 'Events', label: 'الفعاليات (Events)', icon: Calendar, color: 'text-purple-500' },
    { name: 'Awards', label: 'الجوائز (Awards)', icon: Trophy, color: 'text-orange-500' },
    { name: 'Alumni', label: 'الخريجين (Alumni)', icon: Users, color: 'text-emerald-500' },
    { name: 'Hero', label: 'واجهة الموقع (Hero)', icon: ImageIcon, color: 'text-rose-500' },
  ];

  // ==========================================
  // وظائف التحكم الـ CRUD (Logic)
  // ==========================================

  // أ. معالجة اختيار الصورة ورفعها (Client-side Preview)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // عرض الصورة فوراً
        setFormData({ ...formData, image: reader.result }); // تخزينها مؤقتاً
      };
      reader.readAsDataURL(file);
    }
  };

  // ب. تحضير التعديل (Edit)
  const startEdit = (item) => {
    setIsEditing(true);
    setFormData(item);
    setImagePreview(item.image); // إظهار الصورة القديمة في البريفيو
    window.scrollTo({ top: 0, behavior: 'smooth' }); // صعود للأعلى للفورم
  };

  // ج. إلغاء التعديل/الإضافة وتصفير الفورم
  const resetForm = () => {
    setIsEditing(false);
    setFormData({ id: null, title: '', date: '', person: '', name: '', job: '', image: null });
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // تصفير input الملف
  };

  // د. الحذف (Delete)
  const handleDelete = (id) => {
    if (window.confirm('⚠️ هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع.')) {
      setDatabase({
        ...database,
        [activeSection]: database[activeSection].filter(item => item.id !== id)
      });
    }
  };

  // هـ. الحفظ النهائي (Add or Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    const currentData = database[activeSection];

    if (isEditing) {
      // تحديث عنصر موجود
      setDatabase({
        ...database,
        [activeSection]: currentData.map(item => item.id === formData.id ? formData : item)
      });
    } else {
      // إضافة عنصر جديد
      const newItem = { ...formData, id: Date.now() }; // إنشاء ID فريد
      setDatabase({
        ...database,
        [activeSection]: [newItem, ...currentData] // الإضافة في بداية القائمة
      });
    }
    resetForm(); // تصفير الفورم بعد الحفظ
  };

  // وظيفة مساعدة لعرض الحقول المناسبة لكل قسم في الفورم
  const renderFormFields = () => {
    switch (activeSection) {
      case 'News':
      case 'Events':
        return (
          <>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">العنوان</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="form-input" placeholder="عنوان الخبر/الفعالية..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">التاريخ</label>
              <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="form-input" />
            </div>
          </>
        );
      case 'Awards':
        return (
          <>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">عنوان الجائزة</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="form-input" placeholder="مثلاً: جائزة الطالب المثالي..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">اسم الفائز</label>
              <input type="text" required value={formData.person} onChange={(e) => setFormData({...formData, person: e.target.value})} className="form-input" placeholder="اسم الشخص..." />
            </div>
          </>
        );
      case 'Alumni':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">اسم الخريج</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="form-input" placeholder="الاسم الكامل..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">الوظيفة/الإنجاز</label>
              <input type="text" required value={formData.job} onChange={(e) => setFormData({...formData, job: e.target.value})} className="form-input" placeholder="مثلاً: مدير شركة X..." />
            </div>
          </>
        );
      case 'Hero':
        return (
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">النص الرئيسي للبانر</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="form-input" placeholder="اكتب النص الذي يظهر فوق الصورة..." />
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-right" dir="rtl">
      
      {/* 1. Sidebar - القائمة الجانبية على اليمين */}
      <aside className="w-64 bg-slate-950 text-white flex flex-col shadow-2xl border-l border-slate-800">
        <div className="p-6 text-2xl font-extrabold border-b border-slate-800 flex items-center gap-3 text-blue-400">
          <LayoutDashboard size={28} /> MUST Admin
        </div>
        <nav className="flex-1 p-4 space-y-3">
          {menuItems.map(item => (
            <button 
              key={item.name}
              onClick={() => { setActiveSection(item.name); resetForm(); }}
              className={`flex items-center gap-4 w-full p-4 rounded-xl text-lg font-medium transition-all duration-150 
                ${activeSection === item.name 
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                  : 'hover:bg-slate-800 text-slate-300'}`}
            >
              <item.icon size={22} className={activeSection === item.name ? 'text-white' : item.color} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button className="w-full p-3 bg-slate-800 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2 text-slate-400 hover:text-white">
            <LogOut size={18} /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* 2. Main Content - المحتوى الرئيسي */}
      <main className="flex-1 overflow-y-auto p-10">
        
        <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-slate-900">
            إدارة قسم <span className="text-blue-600">{menuItems.find(i => i.name === activeSection)?.label}</span>
          </h1>
          <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-full shadow-sm border">
            <span className="text-sm text-gray-500">مرحباً، رئيس التحرير</span>
            <img src="https://ui-avatars.com/api/?name=MUST+Admin&background=0D8ABC&color=fff" className="w-10 h-10 rounded-full border-2 border-blue-100" />
          </div>
        </div>

        {/* 3. Form Section - نموذج الإضافة والتعديل الموحد */}
        <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-12 relative overflow-hidden">
          {/* خلفية جمالية للفورم */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50 rounded-full opacity-50"></div>
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800">
              {isEditing ? <Edit className="text-orange-500"/> : <Plus className="text-green-500"/>}
              {isEditing ? `تعديل عنصر في ${activeSection}` : `إضافة عنصر جديد لـ ${activeSection}`}
            </h2>
            {isEditing && (
              <button onClick={resetForm} className="text-gray-400 hover:text-red-500 flex items-center gap-1">
                <X size={18} /> إلغاء التعديل
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            {/* أ. حقول النص الديناميكية */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFormFields()}
            </div>

            {/* ب. قسم رفع الصورة (File Upload) */}
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center bg-gray-50 hover:border-blue-300 transition-all cursor-pointer group" onClick={() => fileInputRef.current.click()}>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              
              {imagePreview ? (
                <div className="relative group">
                  <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-xl shadow-md" />
                  <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs">
                    <UploadCloud size={20} /> تغيير الصورة
                  </div>
                </div>
              ) : (
                <div className="py-6 text-gray-400 group-hover:text-blue-500">
                  <UploadCloud size={40} className="mx-auto mb-2 opacity-70" />
                  <span className="font-medium text-sm">اضغط لرفع صورة</span>
                  <p className="text-xs mt-1">PNG, JPG (Max 2MB)</p>
                </div>
              )}
            </div>

            {/* ج. زر الحفظ */}
            <div className="md:col-span-3 flex justify-end mt-4">
              <button type="submit" className={`flex items-center gap-2 px-10 py-3 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 ${isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                <Save size={18} />
                {isEditing ? 'حفظ التعديلات' : 'نشر المحتوى الآن'}
              </button>
            </div>
          </form>
        </section>

        {/* 4. Table Section - جدول عرض البيانات والتحكم بها */}
        <section className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-700">المحتوى المنشور حالياً في هذا القسم</h3>
            <span className="text-sm font-medium bg-blue-100 text-blue-700 px-4 py-1 rounded-full">
              {database[activeSection].length} عناصر
            </span>
          </div>
          
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-100/50 border-b border-slate-100">
                <th className="p-5 text-slate-600 font-bold w-24">الصورة</th>
                <th className="p-5 text-slate-600 font-bold">التفاصيل</th>
                <th className="p-5 text-slate-600 font-bold text-center w-40">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {database[activeSection].map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/50 transition duration-100">
                  <td className="p-5">
                    <img src={item.image} alt="Thumb" className="w-20 h-16 object-cover rounded-lg shadow-sm border border-gray-100" />
                  </td>
                  <td className="p-5">
                    {/* عرض تفاصيل مختلفة بناءً على القسم */}
                    {activeSection === 'Alumni' ? (
                      <div>
                        <div className="font-semibold text-slate-800 text-lg">{item.name}</div>
                        <div className="text-sm text-emerald-600 font-medium">{item.job}</div>
                      </div>
                    ) : activeSection === 'Awards' ? (
                      <div>
                        <div className="font-semibold text-slate-800 text-lg">{item.title}</div>
                        <div className="text-sm text-orange-600 font-medium">الفائز: {item.person}</div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-semibold text-slate-800 text-lg">{item.title}</div>
                        {item.date && <div className="text-sm text-slate-400">{item.date}</div>}
                      </div>
                    )}
                  </td>
                  <td className="p-5 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => startEdit(item)} className="p-3 text-blue-600 hover:bg-blue-100 rounded-full transition" title="تعديل">
                        <Edit size={20}/>
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-3 text-red-500 hover:bg-red-100 rounded-full transition" title="حذف">
                        <Trash2 size={20}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* رسالة في حالة عدم وجود بيانات */}
          {database[activeSection].length === 0 && (
            <div className="p-16 text-center text-gray-400 flex flex-col items-center gap-4">
              <Newspaper size={48} className="opacity-40" />
              <p className="text-lg">لا يوجد محتوى في قسم {menuItems.find(i => i.name === activeSection)?.label} حالياً.</p>
              <p className="text-sm">ابدأ بإضافة أول عنصر باستخدام النموذج أعلاه.</p>
            </div>
          )}
        </section>

      </main>
    </div>
  );
};



export default AdminDashboard;