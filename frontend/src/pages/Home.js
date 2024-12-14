import React from "react";
import FallingArabicLetters from "../components/falling_letters";
import { ReactComponent as AiNotesIcon } from "../assets/images/notes-svgrepo-com.svg";
import { ReactComponent as AiAssistantIcon } from "../assets/images/robot-ai-svgrepo-com.svg";
import { ReactComponent as TestsSimulationIcon } from "../assets/images/graph-and-people-svgrepo-com.svg";
import { Typewriter } from "react-simple-typewriter";

const Home = () => {
  return (
    <div className="relative bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200">
      {/* Falling Letters Effect */}
      <FallingArabicLetters />

      {/* Hero Section */}
      <div className="relative flex flex-col items-center text-center px-6 py-16 lg:py-24 space-y-10">
        <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-400">
          ذكاء+ - منصة تعليمية مبتكرة
        </h1>
        <p className="text-2xl md:text-3xl text-blue-600 font-medium italic">
          <Typewriter
            words={[
              "لأننا نؤمن بالذكاء الإصطناعي كحقٍ أساسي لكل أفراد المُجتمع.",
              "ابدأ رحلتك في تعلم الذكاء الاصطناعي الآن.",
              "تعلم مفاهيم الذكاء الاصطناعي باللغة العربية بسهولة.",
            ]}
            loop={Infinity}
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={2000}
          />
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center">
          <a
            href="/signup"
            className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-8 py-4 rounded-lg text-xl hover:from-blue-800 hover:to-blue-600 transition duration-300 shadow-lg"
          >
            ابدأ الآن
          </a>
          <a
            href="/login"
            className="border-2 border-blue-500 text-blue-700 px-8 py-4 rounded-lg text-xl hover:bg-blue-50 transition duration-300"
          >
            تسجيل الدخول
          </a>
        </div>
      </div>

      {/* Feature 1 */}
      <section className="relative bg-gradient-to-br from-blue-800 to-blue-600 text-white px-6 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-6">
          <AiNotesIcon className="w-20 h-20 text-white mb-4" />
          <h2 className="text-3xl font-bold">ملاحظات الذكاء الاصطناعي بالعربية</h2>
          <p className="text-lg max-w-xl">
            تعلم المفاهيم الأساسية والمتقدمة للذكاء الاصطناعي من خلال ملاحظات
            باللغة العربية.
          </p>
        </div>
      </section>

      {/* Feature 2 */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-500 text-white px-6 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-6">
          <AiAssistantIcon className="w-20 h-20 text-white mb-4" />
          <h2 className="text-3xl font-bold">مساعد الذكاء الاصطناعي</h2>
          <p className="text-lg max-w-xl">
            اسأل المساعد الذكي لشرح أي مفهوم في الذكاء الاصطناعي باللغة العربية.
          </p>
        </div>
      </section>

      {/* Feature 3 */}
      <section className="relative bg-gradient-to-br from-blue-500 to-blue-400 text-white px-6 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-6">
          <TestsSimulationIcon className="w-20 h-20 text-white mb-4" />
          <h2 className="text-3xl font-bold">اختبارات ومحاكاة</h2>
          <p className="text-lg max-w-xl">
            اختبر معلوماتك في الذكاء الاصطناعي بمستويات مختلفة، مع محاكاة
            تفاعلية للخوارزميات باستخدام الرسوم البيانية.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
