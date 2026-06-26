import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bot, Flag, Flame, Play, RotateCcw } from 'lucide-react';

// Grid size
const GRID_SIZE = 5;

// Elements positions
const START_POS = { x: 0, y: 0 };
const GOAL_POS = { x: 4, y: 4 };
const OBSTACLES = [
  { x: 1, y: 1 },
  { x: 1, y: 2 },
  { x: 3, y: 3 },
  { x: 2, y: 4 }
];

// Simple pre-calculated "epochs" to simulate the learning process visually
// Each epoch is an array of positions the robot visits.
const LEARNING_EPOCHS = [
  // Epoch 1: Fails quickly
  [{x:0, y:0}, {x:1, y:0}, {x:1, y:1}], 
  // Epoch 2: Goes another way, hits obstacle
  [{x:0, y:0}, {x:0, y:1}, {x:0, y:2}, {x:0, y:3}, {x:1, y:3}, {x:2, y:3}, {x:3, y:3}],
  // Epoch 3: Wanders, hits obstacle
  [{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:2, y:1}, {x:2, y:2}, {x:3, y:2}, {x:3, y:3}],
  // Epoch 4: Learns the successful path
  [{x:0, y:0}, {x:0, y:1}, {x:0, y:2}, {x:0, y:3}, {x:0, y:4}, {x:1, y:4}, {x:2, y:4}], // oops hit obstacle at 2,4
  // Epoch 5: Perfect run
  [{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}, {x:4, y:0}, {x:4, y:1}, {x:4, y:2}, {x:4, y:3}, {x:4, y:4}]
];

export default function Reinforcement() {
  const [robotPos, setRobotPos] = useState(START_POS);
  const [isTraining, setIsTraining] = useState(false);
  const [epochIndex, setEpochIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [statusText, setStatusText] = useState('جاهز للتدريب');

  const runEpoch = async (epochPath: {x:number, y:number}[], currentEpochIdx: number) => {
    setRobotPos(START_POS);
    setStatusText(`محاولة (Epoch) ${currentEpochIdx + 1} / ${LEARNING_EPOCHS.length}...`);
    
    for (let i = 0; i < epochPath.length; i++) {
      const pos = epochPath[i];
      setRobotPos(pos);
      
      // Update score and status based on position
      const isObstacle = OBSTACLES.some(obs => obs.x === pos.x && obs.y === pos.y);
      const isGoal = pos.x === GOAL_POS.x && pos.y === GOAL_POS.y;

      if (isObstacle) {
        setScore(prev => prev - 10);
        setStatusText('عقوبة! (-10 نقطة). إعادة المحاولة...');
        await new Promise(r => setTimeout(r, 600)); // Pause to show failure
        break; // End epoch
      } else if (isGoal) {
        setScore(prev => prev + 50);
        setStatusText('تم الوصول للهدف! (+50 نقطة). الخوارزمية تعلمت المسار!');
        break;
      } else if (i > 0) {
        // Small reward for moving (optional, keep simple)
        setScore(prev => prev + 1);
      }

      await new Promise(r => setTimeout(r, 400)); // Delay between steps
    }
  };

  const handleTrain = async () => {
    setIsTraining(true);
    setScore(0);
    
    for (let i = 0; i < LEARNING_EPOCHS.length; i++) {
      setEpochIndex(i);
      await runEpoch(LEARNING_EPOCHS[i], i);
      
      // Stop if reached goal successfully on last epoch
      if (i === LEARNING_EPOCHS.length - 1) {
         break;
      }
      
      // Small delay between epochs
      await new Promise(r => setTimeout(r, 800));
    }
    
    setIsTraining(false);
  };

  const reset = () => {
    setRobotPos(START_POS);
    setScore(0);
    setEpochIndex(0);
    setIsTraining(false);
    setStatusText('جاهز للتدريب');
  };

  const isObstacle = (x: number, y: number) => OBSTACLES.some(obs => obs.x === x && obs.y === y);

  return (
    <>
      <aside className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto shrink-0">
        <section>
          <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">تعريف المفهوم</h3>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-sm leading-relaxed text-slate-700">
              في التعلم التعزيزي، يتعلم الوسيط عبر التفاعل مع البيئة من خلال <span className="text-orange-600 font-bold">المكافآت والعقوبات</span>. يحاول تعظيم المكافأة لتحقيق الهدف.
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">إعدادات المحاكاة</h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold">حالة الوسيط</label>
              <div className="bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-700 font-medium">
                {statusText}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold">النقاط (Score)</label>
              <div className={`bg-white border border-slate-300 rounded-lg p-2 text-lg font-mono text-center font-bold ${score < 0 ? 'text-red-500' : score > 0 ? 'text-emerald-500' : 'text-slate-500'}`}>
                {score}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-auto flex flex-col gap-3">
          <button
            onClick={handleTrain}
            disabled={isTraining}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>{isTraining ? 'جاري التعلم...' : 'بدء التدريب'}</span>
            <Play className="w-5 h-5" />
          </button>
          <button
            onClick={reset}
            disabled={isTraining}
            className="w-full bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>إعادة تهيئة</span>
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </aside>

      <section className="flex-1 bg-slate-100 p-8 flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">محاكاة روبوت المتاهة</h2>
          <div className="flex gap-4 text-xs font-medium">
            <div className="flex items-center gap-1"><Bot className="w-4 h-4 text-blue-500" /> وسيط (Agent)</div>
            <div className="flex items-center gap-1"><Flag className="w-4 h-4 text-emerald-500" /> هدف (+50)</div>
            <div className="flex items-center gap-1"><Flame className="w-4 h-4 text-rose-500" /> عقوبة (-10)</div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
           <div 
             className="grid border-4 border-white rounded-2xl overflow-hidden shadow-xl bg-slate-200 gap-1 p-1"
             style={{ 
               gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
               width: 'min(100%, 500px)',
               aspectRatio: '1/1'
             }}
           >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
                const x = idx % GRID_SIZE;
                const y = Math.floor(idx / GRID_SIZE);
                
                const isGoal = x === GOAL_POS.x && y === GOAL_POS.y;
                const isObs = isObstacle(x, y);
                const hasRobot = robotPos.x === x && robotPos.y === y;

                return (
                  <div 
                    key={`${x}-${y}`} 
                    className="relative flex items-center justify-center bg-white rounded-lg"
                  >
                     {/* Draw Grid Cells */}
                     {isGoal && <Flag className="w-10 h-10 text-emerald-500" />}
                     {isObs && <Flame className="w-10 h-10 text-rose-500" />}
                     
                     {/* Render Robot with animation */}
                     {hasRobot && (
                       <motion.div
                         layoutId="robot"
                         className="absolute inset-0 flex items-center justify-center z-10"
                         initial={false}
                         transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                       >
                         <div className={`p-3 rounded-full shadow-lg ${isObs ? 'bg-red-500' : isGoal ? 'bg-emerald-500' : 'bg-blue-600'}`}>
                            <Bot className="w-8 h-8 text-white" />
                         </div>
                       </motion.div>
                     )}
                  </div>
                );
              })}
           </div>
        </div>
      </section>
    </>
  );
}
