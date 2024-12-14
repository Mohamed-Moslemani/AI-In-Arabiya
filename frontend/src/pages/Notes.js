import React from "react";
import { useNavigate } from "react-router-dom";

const Notes = () => {
  const navigate = useNavigate();

  // قائمة الملاحظات مع العناوين وروابط التنقل
  const notes = [
    {
        title: "تاريخ الذكاء الإصطناعي",
        description: "تعرف على تاريخ الذكاء الاصطناعي وبدايته في العصر الحديث.",
        link: "/notes/ai-history",
    },
    {
      title: "ما هو الذكاء الاصطناعي؟",
      description: "تعرف على مفهوم الذكاء الاصطناعي وأهميته في العالم الحديث.",
      link: "/notes/what-is-ai",
    },
    {
      title: "تطبيقات الذكاء الاصطناعي",
      description: "اكتشف كيف يتم استخدام الذكاء الاصطناعي في مختلف المجالات.",
      link: "/notes/ai-applications",
    },
    {
      title: "خوارزميات الذكاء الاصطناعي",
      description: "تفاصيل عن الخوارزميات الأساسية المستخدمة في الذكاء الاصطناعي.",
      link: "/notes/ai-algorithms",
    },
    {
      title: "رياضيات الذكاء الاصطناعي",
      description: "أساسيات الرياضيات التي تدعم خوارزميات الذكاء الاصطناعي.",
      link: "/notes/ai-mathematics",
    },
    {
      title: "مستقبل الذكاء الإصطناعي",
      description:"نظرة نحو شكل الذكاء الإصطناعي واستعماله في المستقبل",
      link: "/notes/ai-mathematics",
    },
    {
      title: "كيف يمكن أن أصبح مهندسًا مختصأ في الذكاء الإصطناعي؟",
      description: "الطريق الأفضل لكي تصبح مهندسًا للذكاء الإصطناعي في أقصر وقت.",
      link: "/notes/ai-mathematics",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-8 text-center">
          ملاحظات الذكاء الاصطناعي
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(note.link)}
            >
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                {note.title}
              </h2>
              <p className="text-gray-700">{note.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notes;
