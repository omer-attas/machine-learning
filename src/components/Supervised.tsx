import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ship, Sailboat, Check, AlertCircle, Play, RotateCcw, ImagePlus, BrainCircuit } from 'lucide-react';

type ItemType = 'ship' | 'boat';
type Item = { id: number; type: ItemType; status: 'unlabeled' | 'training' | 'classified'; icon: string };

const SHIP_EMOJIS = ['🚢', '⛴️', '🛳️'];
const BOAT_EMOJIS = ['⛵', '🚤', '🛶', '🛥️'];

const INITIAL_DATA: Item[] = [
  { id: 1, type: 'ship', status: 'unlabeled', icon: '🚢' },
  { id: 2, type: 'boat', status: 'unlabeled', icon: '⛵' },
  { id: 3, type: 'ship', status: 'unlabeled', icon: '⛴️' },
  { id: 4, type: 'boat', status: 'unlabeled', icon: '🚤' },
  { id: 5, type: 'ship', status: 'unlabeled', icon: '🛳️' },
  { id: 6, type: 'boat', status: 'unlabeled', icon: '🛶' },
  { id: 7, type: 'ship', status: 'unlabeled', icon: '🚢' },
  { id: 8, type: 'boat', status: 'unlabeled', icon: '🛥️' },
];

export default function Supervised() {
  const [items, setItems] = useState<Item[]>(INITIAL_DATA);
  const [trainingCount, setTrainingCount] = useState(0);
  const [isClassifying, setIsClassifying] = useState(false);
  const [mode, setMode] = useState<'training' | 'testing'>('training');
  const [testItem, setTestItem] = useState<{ type: ItemType, result: string | null, icon: string } | null>(null);

  const handleLabel = (id: number, label: ItemType) => {
    if (isClassifying) return;
    
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // Verify if user labeled correctly for training (we simplify by just accepting their click)
          // For educational purposes, let's assume they click the correct button.
          return { ...item, status: 'training' };
        }
        return item;
      })
    );
    setTrainingCount((prev) => prev + 1);
  };

  const handleGenerateTest = () => {
    if (isClassifying) return;
    setIsClassifying(true);
    const type: ItemType = Math.random() > 0.5 ? 'ship' : 'boat';
    const emojis = type === 'ship' ? SHIP_EMOJIS : BOAT_EMOJIS;
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    setTestItem({ type, result: null, icon: randomEmoji });
    
    setTimeout(() => {
      setTestItem(prev => prev ? { ...prev, result: type === 'ship' ? 'سفينة' : 'قارب' } : null);
      setItems(prev => [...prev, { id: Date.now(), type, status: 'classified', icon: randomEmoji }]);
      setIsClassifying(false);
    }, 1500);
  };

  const startTestingMode = () => {
    setItems(prev => prev.filter(i => i.status !== 'unlabeled'));
    setMode('testing');
    setTestItem(null);
  };

  const reset = () => {
    setItems(INITIAL_DATA);
    setTrainingCount(0);
    setIsClassifying(false);
    setMode('training');
    setTestItem(null);
  };

  return (
    <>
      {/* Sidebar Controls */}
      <aside className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto shrink-0">
        <section>
          <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">تعريف المفهوم</h3>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-sm leading-relaxed text-slate-700">
              في التعلم الموجه، نقوم بتدريب الآلة باستخدام بيانات تحتوي على <span className="text-blue-600 font-bold">المدخلات والمخرجات</span> الصحيحة مسبقاً (بيانات مصنفة).
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">إعدادات المحاكاة</h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold">المرحلة</label>
              <div className="bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-700">
                {mode === 'testing' 
                  ? 'مرحلة اختبار النموذج'
                  : trainingCount < 3 
                    ? 'مرحلة التدريب اليدوي' 
                    : 'النموذج جاهز للاختبار'}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold">عدد العينات للتدريب</label>
              <div className="bg-white border border-slate-300 rounded-lg p-2 text-sm font-mono text-center font-bold text-blue-600">
                {trainingCount} / 3 عينات كحد أدنى
              </div>
            </div>
          </div>
        </section>

        <div className="mt-auto flex flex-col gap-3">
          {mode === 'training' ? (
            <button
              onClick={startTestingMode}
              disabled={trainingCount < 3}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>الانتقال لمرحلة الاختبار</span>
              <Play className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleGenerateTest}
              disabled={isClassifying}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>{isClassifying ? 'جاري التنبؤ...' : 'اختبار صورة جديدة'}</span>
              <ImagePlus className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={reset}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>إعادة التهيئة</span>
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Simulation Visualizer Area */}
      <section className="flex-1 bg-slate-100 p-8 flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">لوحة المحاكاة التفاعلية</h2>
          <div className="flex gap-4 text-xs font-medium">
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-slate-200 border border-slate-300 rounded-sm"></span> غير مصنفة</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-100 border border-blue-200 rounded-sm"></span> سفينة</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-100 border border-amber-200 rounded-sm"></span> قارب</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          {mode === 'training' && trainingCount < 3 && (
            <div className="text-orange-600 font-medium bg-orange-100 p-3 rounded-lg border border-orange-200 text-center animate-pulse shadow-sm">
              👈 قم بتدريب الخوارزمية بتصنيف 3 عناصر يدوياً على الأقل (انقر على العنصر في قسم البيانات غير المصنفة).
            </div>
          )}

          {mode === 'testing' && (
            <div className="text-emerald-700 font-medium bg-emerald-100 p-3 rounded-lg border border-emerald-200 text-center shadow-sm flex items-center justify-center gap-2">
              <BrainCircuit className="w-5 h-5" />
              الآن الخوارزمية تعلمت! اضغط على "اختبار صورة جديدة" لترى كيف ستصنفها الآلة بناءً على تدريبك.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
            {/* Left Area (Training or Testing) */}
            {mode === 'training' ? (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col">
                <h5 className="font-bold text-slate-500 mb-4 text-center">البيانات غير المصنفة</h5>
                <div className="flex flex-wrap gap-4 justify-center flex-1 content-start">
                  <AnimatePresence>
                    {items.filter(i => i.status === 'unlabeled').map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="relative group cursor-pointer"
                      >
                        <div className="w-20 h-20 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center hover:border-blue-400 hover:shadow-md transition-all">
                          <span className="text-4xl select-none" role="img" aria-label={item.type}>{item.icon}</span>
                        </div>
                        {/* Action buttons on hover for manual training */}
                        <div className="absolute inset-0 bg-slate-900/80 rounded-2xl flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleLabel(item.id, 'ship')}
                            className="bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600 w-[80%]"
                          >
                            سفينة
                          </button>
                          <button
                            onClick={() => handleLabel(item.id, 'boat')}
                            className="bg-amber-500 text-white text-xs py-1 px-2 rounded hover:bg-amber-600 w-[80%]"
                          >
                            قارب
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-center">
                 <h5 className="font-bold text-slate-500 mb-6">منطقة الاختبار والتنبؤ</h5>
                 {testItem ? (
                   <div className="flex flex-col items-center gap-4">
                     <motion.div
                       initial={{ opacity: 0, scale: 0.5, y: -20 }}
                       animate={{ opacity: 1, scale: 1, y: 0 }}
                       className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center shadow-md relative"
                     >
                        <span className="text-6xl select-none drop-shadow-sm" role="img" aria-label={testItem.type}>{testItem.icon}</span>
                        {testItem.result && (
                           <motion.div 
                             initial={{ opacity: 0, scale: 0 }}
                             animate={{ opacity: 1, scale: 1 }}
                             className={`absolute -bottom-4 px-4 py-1 rounded-full text-white font-bold text-sm shadow-md whitespace-nowrap ${testItem.result === 'سفينة' ? 'bg-blue-500' : 'bg-amber-500'}`}
                           >
                             النتيجة: {testItem.result}
                           </motion.div>
                        )}
                     </motion.div>
                     {!testItem.result && (
                       <div className="flex items-center gap-2 text-blue-600 font-bold mt-4 animate-pulse">
                         <BrainCircuit className="w-5 h-5" />
                         النموذج يحلل الصورة...
                       </div>
                     )}
                   </div>
                 ) : (
                   <div className="text-slate-400 flex flex-col items-center gap-3 opacity-50">
                     <ImagePlus className="w-12 h-12" />
                     <p>بانتظار إدخال صورة جديدة لاختبارها...</p>
                   </div>
                 )}
              </div>
            )}

            {/* Classified Area */}
            <div className="grid grid-cols-1 gap-6">
               {/* Ships Bin */}
              <div className="bg-blue-50/80 rounded-3xl p-6 border border-blue-200 shadow-sm flex flex-col">
                <h5 className="font-bold text-blue-800 mb-4 text-center border-b border-blue-200 pb-2">فئة السفن</h5>
                <div className="flex flex-wrap gap-3 justify-center flex-grow content-start">
                   <AnimatePresence>
                    {items.filter(i => i.type === 'ship' && i.status !== 'unlabeled').map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-16 h-16 bg-white rounded-xl shadow-sm border border-blue-200 flex flex-col items-center justify-center relative"
                      >
                        <span className="text-3xl select-none drop-shadow-sm" role="img" aria-label="ship">{item.icon}</span>
                        {item.status === 'classified' && (
                          <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1 shadow-sm">
                             <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        {item.status === 'training' && (
                          <div className="absolute -bottom-2 text-[10px] bg-blue-100 text-blue-800 px-1.5 rounded-full font-bold shadow-sm">تدريب</div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Boats Bin */}
              <div className="bg-amber-50/80 rounded-3xl p-6 border border-amber-200 shadow-sm flex flex-col">
                <h5 className="font-bold text-amber-800 mb-4 text-center border-b border-amber-200 pb-2">فئة القوارب</h5>
                <div className="flex flex-wrap gap-3 justify-center flex-grow content-start">
                  <AnimatePresence>
                    {items.filter(i => i.type === 'boat' && i.status !== 'unlabeled').map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-16 h-16 bg-white rounded-xl shadow-sm border border-amber-200 flex flex-col items-center justify-center relative"
                      >
                        <span className="text-3xl select-none drop-shadow-sm" role="img" aria-label="boat">{item.icon}</span>
                        {item.status === 'classified' && (
                          <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1 shadow-sm">
                             <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                         {item.status === 'training' && (
                          <div className="absolute -bottom-2 text-[10px] bg-amber-100 text-amber-800 px-1.5 rounded-full font-bold shadow-sm">تدريب</div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
