import React from "react";
import FallingArabicLetters from "../components/falling_letters";
import { ReactComponent as AiNotesIcon } from "../assets/images/notes-svgrepo-com.svg";
import { ReactComponent as Algorithm } from "../assets/images/algorithm.svg";
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
      خوارزمياتك - ذكاء بدون تعقيد  
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
      <h2 className="text-3xl font-bold">أسئلة شائعة في الذكاء الاصطناعي</h2>
      <p className="text-lg max-w-xl">
        تعرّف على مفاهيم الذكاء الاصطناعي بسهولة وبالعربية.
      </p>
    </div>

      </section>

    {/* Feature 2 */}
    <section className="relative bg-gradient-to-br from-blue-600 to-blue-500 text-white px-6 py-16 lg:py-24">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-6">
        <Algorithm className="w-20 h-20 text-white mb-4" />
        <h2 className="text-3xl font-bold">خوارزمياتك التفاعلية</h2>
        <p className="text-lg max-w-xl">
          اكتشف الخوارزميات خطوة بخطوة عبر شروحات مبسطة وأمثلة عملية باللغة العربية.
        </p>
      </div>
    </section>


      {/* Feature 3 */}
      <section className="relative bg-gradient-to-br from-blue-500 to-blue-400 text-white px-6 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-6">
          <TestsSimulationIcon className="w-20 h-20 text-white mb-4" />
        <h2 className="text-3xl font-bold">محاكاة تفاعلية</h2>
        <p className="text-lg max-w-xl">
          استكشف الخوارزميات برسوم بيانية تفاعلية لفهم الذكاء الاصطناعي بعمق.
        </p>
      </div>

      </section>
    </div>
  );
};

export default Home;
