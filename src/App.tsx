import React, { useState } from 'react';
import Supervised from './components/Supervised';
import Regression from './components/Regression';
import Unsupervised from './components/Unsupervised';
import Reinforcement from './components/Reinforcement';
import Quiz from './components/Quiz';
import { MLType } from './types';
import { Target, Network, Zap, Cpu, Lightbulb, TrendingUp } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<MLType>('supervised');

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 font-sans flex flex-col overflow-hidden" dir="rtl">
      {/* Top Navigation / Header */}
      <header className="bg-blue-800 text-white px-8 py-4 flex justify-between items-center shadow-md shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-2 rounded-lg">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">مختبر الذكاء الاصطناعي التفاعلي</h1>
            <p className="text-xs text-blue-100 uppercase tracking-widest mt-1">وحدة مفاهيم تعلم الآلة - المستوى الثانوي</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-blue-900/50 px-4 py-2 rounded-full border border-blue-400/30">
          <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-sm font-medium">حالة المحاكاة: جاهز</span>
        </div>
      </header>

      {/* Concept Selection Tabs */}
      <nav className="flex bg-white border-b border-slate-200 shrink-0 overflow-x-auto">
        <button
          onClick={() => setActiveTab('supervised')}
          className={`flex-1 py-4 px-3 text-center border-b-4 font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer min-w-max text-sm ${
            activeTab === 'supervised'
              ? 'border-blue-600 bg-blue-50/50 text-blue-700'
              : 'border-transparent text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Target className="w-4 h-4" />
          1. الموجه (تصنيف)
        </button>
        <button
          onClick={() => setActiveTab('regression')}
          className={`flex-1 py-4 px-3 text-center border-b-4 font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer min-w-max text-sm ${
            activeTab === 'regression'
              ? 'border-blue-600 bg-blue-50/50 text-blue-700'
              : 'border-transparent text-slate-500 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          2. الموجه (انحدار)
        </button>
        <button
          onClick={() => setActiveTab('unsupervised')}
          className={`flex-1 py-4 px-3 text-center border-b-4 font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer min-w-max text-sm ${
            activeTab === 'unsupervised'
              ? 'border-purple-600 bg-purple-50/50 text-purple-700'
              : 'border-transparent text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Network className="w-4 h-4" />
          3. غير الموجه
        </button>
        <button
          onClick={() => setActiveTab('reinforcement')}
          className={`flex-1 py-4 px-3 text-center border-b-4 font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer min-w-max text-sm ${
            activeTab === 'reinforcement'
              ? 'border-orange-600 bg-orange-50/50 text-orange-700'
              : 'border-transparent text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Zap className="w-4 h-4" />
          4. التعلم التعزيزي
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-4 px-3 text-center border-b-4 font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer min-w-max text-sm ${
            activeTab === 'quiz'
              ? 'border-emerald-600 bg-emerald-50/50 text-emerald-700'
              : 'border-transparent text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          5. أسئلة تفاعلية
        </button>
      </nav>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
         {activeTab === 'supervised' && <Supervised />}
         {activeTab === 'regression' && <Regression />}
         {activeTab === 'unsupervised' && <Unsupervised />}
         {activeTab === 'reinforcement' && <Reinforcement />}
         {activeTab === 'quiz' && <Quiz />}
      </main>

      {/* Helper Tooltip */}
      <div className="fixed bottom-4 left-4 bg-slate-900 text-white px-4 py-2 rounded-lg text-xs shadow-2xl flex items-center gap-3 z-50">
        <div className="bg-blue-500 w-5 h-5 rounded-full flex items-center justify-center font-bold">؟</div>
        <span>نصيحة المعلم: {
          activeTab === 'supervised' ? 'التصنيف يستخدم لتحديد فئة الشيء (مثل قارب أو سفينة).' :
          activeTab === 'regression' ? 'الانحدار الخطي يستخدم لتوقع قيمة مستمرة (مثل السعر بناءً على المساحة).' :
          activeTab === 'unsupervised' ? 'لاحظ كيف تقوم الخوارزمية باكتشاف المجموعات المتشابهة بنفسها.' :
          activeTab === 'reinforcement' ? 'لاحظ كيف يتعلم الوسيط مساره من خلال المكافآت والعقوبات.' :
          'اختبر معلوماتك في المفاهيم التي تعلمتها.'
        }</span>
      </div>
    </div>
  );
}
