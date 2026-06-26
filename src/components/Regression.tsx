import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, RotateCcw, Building } from 'lucide-react';

const HOUSE_DATA = [
  { id: 1, area: 120, price: 450 },
  { id: 2, area: 150, price: 600 },
  { id: 3, area: 200, price: 750 },
  { id: 4, area: 220, price: 850 },
  { id: 5, area: 280, price: 1000 },
  { id: 6, area: 320, price: 1200 },
  { id: 7, area: 380, price: 1400 },
  { id: 8, area: 450, price: 1650 },
];

const MAX_AREA = 500;
const MAX_PRICE = 2000;

export default function Regression() {
  const [isTrained, setIsTrained] = useState(false);
  const [testArea, setTestArea] = useState(250);

  const predictPrice = (area: number) => Math.round(3.65 * area + 15);
  const predictedPrice = predictPrice(testArea);

  const handleTrain = () => {
    setIsTrained(true);
  };

  const handleReset = () => {
    setIsTrained(false);
    setTestArea(250);
  };

  return (
    <>
      <aside className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto shrink-0">
        <section>
          <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">تعريف المفهوم</h3>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-sm leading-relaxed text-slate-700">
              <span className="text-blue-600 font-bold">الانحدار الخطي (Regression)</span> هو نوع من التعلم الموجه. 
              على عكس التصنيف الذي يحدد "فئة"، الانحدار يتوقع <strong>قيمة رقمية مستمرة</strong> (مثل توقع سعر المنزل بناءً على مساحته).
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">إعدادات المحاكاة</h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold">حالة النموذج</label>
              <div className="bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-700 font-medium">
                {isTrained ? 'تم تدريب النموذج بنجاح' : 'بيانات سابقة (منازل مباعة)'}
              </div>
            </div>
            {isTrained && (
               <motion.div 
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 className="flex flex-col gap-2 bg-blue-50 p-4 rounded-xl border border-blue-100 mt-2 overflow-hidden"
               >
                  <label className="text-sm font-bold text-blue-800">اختبر التوقع (أدخل مساحة):</label>
                  <div className="flex items-center gap-2 mt-2">
                    <input 
                      type="range" 
                      min="50" max="500" step="10" 
                      value={testArea} 
                      onChange={(e) => setTestArea(Number(e.target.value))}
                      className="flex-1 accent-blue-600 cursor-pointer"
                    />
                  </div>
                  <div className="text-sm font-bold text-blue-900 mt-2 bg-white px-3 py-2 rounded-lg border border-blue-200 text-center">
                    المساحة المختارة: {testArea} م²
                  </div>
               </motion.div>
            )}
          </div>
        </section>

        <div className="mt-auto flex flex-col gap-3">
          <button
            onClick={handleTrain}
            disabled={isTrained}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isTrained ? 'تم رسم خط الانحدار' : 'تدريب النموذج'}</span>
            <TrendingUp className="w-5 h-5" />
          </button>
          <button
            onClick={handleReset}
            disabled={!isTrained}
            className="w-full bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>إعادة تهيئة</span>
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </aside>

      <section className="flex-1 bg-slate-100 p-8 flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">توقع أسعار المنازل (الانحدار الخطي)</h2>
          <div className="flex gap-4 text-xs font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-slate-400 rounded-full"></span> منازل مباعة</div>
            <div className="flex items-center gap-2"><span className="w-4 h-1 bg-blue-500 rounded-sm"></span> خط الانحدار</div>
            <div className="flex items-center gap-2"><Building className="w-4 h-4 text-emerald-600" /> توقع لمنزل جديد</div>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col relative min-h-[400px]">
          
          {/* Y Axis Label */}
          <div className="absolute top-1/2 right-4 -rotate-90 text-sm font-bold text-slate-500 origin-center translate-x-1/2">
            السعر (بالريال)
          </div>
          
          {/* Chart Area */}
          <div className="flex-1 relative border-b-2 border-r-2 border-slate-400 mr-12 mb-8" style={{ direction: 'rtl' }}>
            
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-cols-5 grid-rows-4 opacity-10 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="border-t border-l border-slate-500"></div>
              ))}
            </div>

            {/* SVG Layer for lines */}
            {isTrained && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none" style={{ direction: 'ltr', transform: 'scaleX(-1)' }}>
                 {/* Regression Line */}
                 <motion.line
                   x1="0%"
                   y1={`${100 - (predictPrice(0) / MAX_PRICE) * 100}%`}
                   x2="100%"
                   y2={`${100 - (predictPrice(MAX_AREA) / MAX_PRICE) * 100}%`}
                   stroke="#3b82f6"
                   strokeWidth="3"
                   strokeDasharray="1000"
                   strokeDashoffset="1000"
                   animate={{ strokeDashoffset: 0 }}
                   transition={{ duration: 1.5, ease: 'easeOut' }}
                 />
                 
                 {/* Prediction Point & Dashed Lines */}
                 <motion.g
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 1.5 }}
                 >
                   {/* Vertical dashed line */}
                   <line 
                     x1={`${(testArea / MAX_AREA) * 100}%`} y1="100%" 
                     x2={`${(testArea / MAX_AREA) * 100}%`} y2={`${100 - (predictedPrice / MAX_PRICE) * 100}%`} 
                     stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" 
                   />
                   {/* Horizontal dashed line */}
                   <line 
                     x1="0%" y1={`${100 - (predictedPrice / MAX_PRICE) * 100}%`} 
                     x2={`${(testArea / MAX_AREA) * 100}%`} y2={`${100 - (predictedPrice / MAX_PRICE) * 100}%`} 
                     stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" 
                   />
                   {/* Point */}
                   <circle 
                     cx={`${(testArea / MAX_AREA) * 100}%`} 
                     cy={`${100 - (predictedPrice / MAX_PRICE) * 100}%`} 
                     r="6" fill="#10b981" 
                   />
                 </motion.g>
              </svg>
            )}

            {/* Data Points */}
            {HOUSE_DATA.map((house) => {
               const xPos = (house.area / MAX_AREA) * 100;
               const yPos = (house.price / MAX_PRICE) * 100;
               
               return (
                 <motion.div 
                   key={house.id}
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ delay: house.id * 0.1, type: 'spring' }}
                   className="absolute w-4 h-4 bg-slate-400 rounded-full shadow-md hover:bg-slate-600 hover:scale-150 transition-all cursor-pointer group z-10 border-2 border-white"
                   style={{ right: `${xPos}%`, bottom: `${yPos}%`, transform: 'translate(50%, 50%)' }}
                 >
                   <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-20 font-medium transition-opacity">
                     المساحة: {house.area} م² | السعر: {(house.price * 1000).toLocaleString('en-US')} ريال
                   </div>
                 </motion.div>
               )
            })}

            {/* Prediction Label (HTML overlay for proper text rendering) */}
            {isTrained && (
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 1.6 }}
                 className="absolute z-20 pointer-events-none"
                 style={{ 
                   right: `${(testArea / MAX_AREA) * 100}%`, 
                   bottom: `${(predictedPrice / MAX_PRICE) * 100}%`,
                   transform: 'translate(50%, -20px)'
                 }}
               >
                 <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap mb-2 border-2 border-white">
                    السعر المتوقع: {(predictedPrice * 1000).toLocaleString('en-US')} ريال
                 </div>
               </motion.div>
            )}

          </div>

          {/* X Axis Label */}
          <div className="text-center text-sm font-bold text-slate-500 mt-2 pl-12">
            مساحة المنزل (بالمتر المربع)
          </div>
          
          {/* Axis Values */}
          <div className="absolute bottom-6 right-12 text-xs text-slate-400 font-mono font-bold translate-x-1/2">0</div>
          <div className="absolute bottom-6 left-8 text-xs text-slate-400 font-mono font-bold">{MAX_AREA}</div>
          <div className="absolute top-8 right-4 text-xs text-slate-400 font-mono font-bold">{(MAX_PRICE * 1000).toLocaleString('en-US')}</div>
        </div>
      </section>
    </>
  );
}
