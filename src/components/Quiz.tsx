import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, CheckCircle2, XCircle, ArrowLeft, Trophy, RefreshCw } from 'lucide-react';

type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'أي نوع من أنواع تعلم الآلة يستخدم بيانات مصنفة (تحتوي على المدخلات والمخرجات الصحيحة)؟',
    options: ['التعلم الموجه', 'التعلم غير الموجه', 'التعلم التعزيزي'],
    correctAnswer: 0,
    explanation: 'التعلم الموجه يعتمد على إعطاء الآلة بيانات تدريبية واضحة ومصنفة مسبقاً لتتعلم منها وتتنبأ بالمستقبل.',
  },
  {
    id: 2,
    text: 'خوارزمية تقوم باكتشاف الأنماط وتقسيم العملاء إلى مجموعات متشابهة دون تدخل بشري، هذا مثال على:',
    options: ['التعلم الموجه', 'التعلم غير الموجه', 'التعلم التعزيزي'],
    correctAnswer: 1,
    explanation: 'التعلم غير الموجه يستخدم للبحث عن الأنماط والتجمعات (Clustering) المخفية في البيانات غير المصنفة.',
  },
  {
    id: 3,
    text: 'روبوت يتعلم كيفية المشي من خلال المحاولة والخطأ، حيث يتلقى مكافأة عند التقدم وعقوبة عند السقوط. ما هو نوع التعلم المستخدم؟',
    options: ['التعلم الموجه', 'التعلم غير الموجه', 'التعلم التعزيزي'],
    correctAnswer: 2,
    explanation: 'التعلم التعزيزي يعتمد على نظام المكافآت والعقوبات لتعليم الوسيط (Agent) كيفية اتخاذ القرارات الصحيحة لتحقيق الهدف.',
  },
  {
    id: 4,
    text: 'في التعلم الموجه، لماذا نحتاج إلى تقسيم البيانات إلى بيانات تدريب وبيانات اختبار؟',
    options: [
      'لزيادة حجم البيانات المتاحة للحاسب.',
      'لتقييم قدرة النموذج على تصنيف بيانات جديدة لم يرها من قبل.',
      'لتقليل الوقت المستغرق في عملية التدريب.'
    ],
    correctAnswer: 1,
    explanation: 'بيانات الاختبار ضرورية للتأكد من أن النموذج لم يقم فقط بحفظ البيانات التدريبية، بل أصبح قادراً على الفهم والتعميم على بيانات جديدة.',
  },
  {
    id: 5,
    text: 'ما هو الهدف الأساسي للوسيط (Agent) في التعلم التعزيزي؟',
    options: [
      'تعظيم المكافآت التراكمية (النقاط) على المدى الطويل.',
      'تجميع البيانات المتشابهة في مجموعات.',
      'حفظ جميع البيانات المدخلة بشكل مثالي.'
    ],
    correctAnswer: 0,
    explanation: 'الوسيط في التعلم التعزيزي يتخذ قرارات متتالية لمحاولة الحصول على أكبر قدر ممكن من المكافآت أثناء تفاعله مع البيئة.',
  }
];

export default function Quiz() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIdx];

  const handleSelectOption = (index: number) => {
    if (showResult) return;
    
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const percentage = Math.round((score / QUESTIONS.length) * 100);
    return (
      <section className="flex-1 bg-slate-100 p-8 flex flex-col overflow-y-auto items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-lg border border-slate-200 p-10 max-w-lg w-full text-center flex flex-col items-center gap-6"
        >
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
            <Trophy className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">اكتمل الاختبار!</h2>
          <div className="bg-slate-50 p-6 rounded-2xl w-full border border-slate-100">
            <p className="text-sm text-slate-500 font-semibold mb-2">نتيجتك النهائية</p>
            <div className={`text-5xl font-black ${percentage >= 80 ? 'text-emerald-500' : percentage >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
              {score} / {QUESTIONS.length}
            </div>
            <p className="text-slate-600 mt-4 font-medium">
              {percentage >= 80 ? 'عمل رائع! لقد استوعبت المفاهيم بشكل ممتاز.' : percentage >= 50 ? 'جيد جداً، ولكن راجع بعض المفاهيم لتتقنها تماماً.' : 'لا بأس، حاول مراجعة المحاكاة التفاعلية مرة أخرى ثم أعد الاختبار.'}
            </p>
          </div>
          <button
            onClick={restartQuiz}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
          >
            <RefreshCw className="w-5 h-5" />
            <span>إعادة الاختبار</span>
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <>
      <aside className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto shrink-0">
        <section>
          <h3 className="text-sm font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            معلومات الاختبار
          </h3>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-sm leading-relaxed text-slate-700">
              هذا الاختبار مصمم لقياس مدى فهمك للأنواع الثلاثة الرئيسية لتعلم الآلة (الموجه، غير الموجه، والتعزيزي).
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">التقدم</h3>
          <div className="bg-white border border-slate-300 rounded-lg p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
              <span>السؤال</span>
              <span className="text-emerald-600 font-bold">{currentQuestionIdx + 1} / {QUESTIONS.length}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500" 
                style={{ width: `${((currentQuestionIdx + 1) / QUESTIONS.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </section>

        <section className="mt-auto">
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-800">النقاط الحالية:</span>
            <span className="text-xl font-black text-emerald-600">{score}</span>
          </div>
        </section>
      </aside>

      <section className="flex-1 bg-slate-100 p-8 flex flex-col overflow-y-auto items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full max-w-3xl flex flex-col gap-6"
          >
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-800 leading-relaxed mb-8">
                {currentQuestion.text}
              </h2>
              
              <div className="flex flex-col gap-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQuestion.correctAnswer;
                  
                  let buttonClass = "w-full text-right p-4 rounded-xl border-2 transition-all font-medium text-lg ";
                  
                  if (!showResult) {
                    buttonClass += "bg-white border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-slate-700 cursor-pointer";
                  } else {
                    if (isCorrect) {
                      buttonClass += "bg-emerald-50 border-emerald-500 text-emerald-800";
                    } else if (isSelected && !isCorrect) {
                      buttonClass += "bg-rose-50 border-rose-500 text-rose-800";
                    } else {
                      buttonClass += "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={index}
                      disabled={showResult}
                      onClick={() => handleSelectOption(index)}
                      className={buttonClass}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-rose-500 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {showResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6 items-center justify-between"
              >
                <div className="flex-1">
                  <h4 className={`text-sm font-bold mb-2 uppercase tracking-wide ${selectedAnswer === currentQuestion.correctAnswer ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {selectedAnswer === currentQuestion.correctAnswer ? 'إجابة صحيحة!' : 'إجابة خاطئة'}
                  </h4>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {currentQuestion.explanation}
                  </p>
                </div>
                <button
                  onClick={handleNextQuestion}
                  className="shrink-0 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl transition-colors flex items-center gap-2"
                >
                  <span>{currentQuestionIdx < QUESTIONS.length - 1 ? 'السؤال التالي' : 'إنهاء الاختبار'}</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </>
  );
}
