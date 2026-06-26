import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ScatterChart, RefreshCw } from 'lucide-react';

// Generate random points
const generatePoints = () => {
  const points = [];
  for (let i = 0; i < 45; i++) {
    points.push({
      id: i,
      // Random position for initial state (unclustered)
      x: Math.random() * 80 + 10, 
      y: Math.random() * 80 + 10,
      // Assign a hidden cluster ID (1, 2, or 3)
      cluster: (i % 3) + 1,
    });
  }
  return points;
};

// Target cluster centers
const CENTERS = {
  1: { x: 25, y: 30, color: 'bg-rose-500' },
  2: { x: 75, y: 25, color: 'bg-emerald-500' },
  3: { x: 50, y: 75, color: 'bg-indigo-500' },
};

export default function Unsupervised() {
  const [points, setPoints] = useState(generatePoints());
  const [isClustered, setIsClustered] = useState(false);

  const handleCluster = () => {
    setIsClustered(true);
  };

  const reset = () => {
    setPoints(generatePoints());
    setIsClustered(false);
  };

  return (
    <>
      <aside className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto shrink-0">
        <section>
          <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">تعريف المفهوم</h3>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-sm leading-relaxed text-slate-700">
              في التعلم غير الموجه، يتم إعطاء الخوارزمية بيانات <span className="text-purple-600 font-bold">غير مصنفة</span>. دورها هو اكتشاف الأنماط والتشابهات، وتقسيمها إلى مجموعات (Clustering).
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">إعدادات المحاكاة</h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold">حالة البيانات</label>
              <div className="bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-700">
                {isClustered ? 'تم التجميع بنجاح' : 'بيانات عشوائية (غير مجمعة)'}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold">عدد العينات</label>
              <div className="bg-white border border-slate-300 rounded-lg p-2 text-sm font-mono text-center font-bold text-purple-600">
                {points.length} عينة
              </div>
            </div>
          </div>
        </section>

        <div className="mt-auto flex flex-col gap-3">
          <button
            onClick={handleCluster}
            disabled={isClustered}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>{isClustered ? 'تم التجميع' : 'اكتشاف الأنماط'}</span>
            <ScatterChart className="w-5 h-5" />
          </button>
          <button
            onClick={reset}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>بيانات جديدة</span>
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </aside>

      <section className="flex-1 bg-slate-100 p-8 flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">محاكاة تجميع العملاء (Clustering)</h2>
          <div className="flex gap-4 text-xs font-medium">
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-slate-400 rounded-sm"></span> عميل غير مصنف</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-rose-500 rounded-sm"></span> نشط</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded-sm"></span> جملة</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-500 rounded-sm"></span> جديد</div>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-3xl shadow-inner border border-slate-200 relative p-8 flex items-center justify-center min-h-[400px]">
          {/* Background Grid Lines to make it look like a chart */}
          <div className="absolute inset-0 rounded-3xl" style={{ backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5 }}></div>

          <div className="relative w-full h-full max-w-3xl max-h-[500px]">
            {/* Render Clusters Backgrounds (appear after clustering) */}
            {isClustered && Object.entries(CENTERS).map(([id, center]) => (
              <motion.div
                key={`cluster-bg-${id}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`absolute w-64 h-64 rounded-full ${center.color}`}
                style={{
                  left: `calc(${center.x}% - 8rem)`,
                  top: `calc(${center.y}% - 8rem)`,
                }}
              />
            ))}

            {/* Render Points */}
            {points.map((point) => {
              // Target position if clustered, else initial random position
              const targetX = isClustered ? CENTERS[point.cluster as keyof typeof CENTERS].x + (Math.random() * 14 - 7) : point.x;
              const targetY = isClustered ? CENTERS[point.cluster as keyof typeof CENTERS].y + (Math.random() * 14 - 7) : point.y;
              const colorClass = isClustered ? CENTERS[point.cluster as keyof typeof CENTERS].color : 'bg-slate-400';

              return (
                <motion.div
                  key={point.id}
                  animate={{
                    left: `${targetX}%`,
                    top: `${targetY}%`,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 50,
                    damping: 10,
                    delay: isClustered ? Math.random() * 0.5 : 0 // staggered animation
                  }}
                  className={`absolute w-4 h-4 rounded-full shadow-md border-2 border-white ${colorClass} transition-colors duration-1000 z-10`}
                  style={{
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              );
            })}

            {/* Labels for clusters */}
            {isClustered && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 1.5}}>
                  <div className="absolute top-[20%] left-[20%] bg-white/90 px-4 py-2 rounded-xl shadow-lg border border-rose-200 text-rose-700 text-sm font-bold z-20">العملاء النشطون</div>
                  <div className="absolute bottom-[20%] right-[20%] bg-white/90 px-4 py-2 rounded-xl shadow-lg border border-emerald-200 text-emerald-700 text-sm font-bold z-20">عملاء الجملة</div>
                  <div className="absolute top-[20%] right-[45%] bg-white/90 px-4 py-2 rounded-xl shadow-lg border border-indigo-200 text-indigo-700 text-sm font-bold z-20">المشترون الجدد</div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
