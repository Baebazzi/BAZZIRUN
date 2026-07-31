import React, { useEffect } from 'react';
import { X, Trophy, Sparkles, PartyPopper, CheckCircle2, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GoalAchievementModalProps {
  isOpen: boolean;
  currentMileage: number;
  targetMileage: number;
  yearMonthString: string; // e.g. "2026-07"
  onClose: () => void;
}

export function fireFullFireworks() {
  const duration = 3.5 * 1000;
  const animationEnd = Date.now() + duration;

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 60 * (timeLeft / duration);

    // fireworks from left, right, and center
    confetti({
      particleCount,
      startVelocity: 35,
      spread: 360,
      ticks: 70,
      origin: { x: Math.random() * 0.35 + 0.05, y: Math.random() * 0.4 + 0.15 },
      colors: ['#00f0ff', '#7000ff', '#ff007f', '#ffdd00', '#00ff66', '#ffffff'],
    });
    confetti({
      particleCount,
      startVelocity: 35,
      spread: 360,
      ticks: 70,
      origin: { x: Math.random() * 0.35 + 0.6, y: Math.random() * 0.4 + 0.15 },
      colors: ['#00f0ff', '#7000ff', '#ff007f', '#ffdd00', '#00ff66', '#ffffff'],
    });
    confetti({
      particleCount: particleCount * 0.7,
      startVelocity: 40,
      spread: 360,
      ticks: 80,
      origin: { x: 0.5, y: 0.25 },
      colors: ['#ffdd00', '#00f0ff', '#ff007f', '#38bdf8'],
    });
  }, 220);
}

export const GoalAchievementModal: React.FC<GoalAchievementModalProps> = ({
  isOpen,
  currentMileage,
  targetMileage,
  yearMonthString,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      fireFullFireworks();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const [year, month] = yearMonthString.split('-');
  const formattedMonth = `${year}년 ${parseInt(month, 10)}월`;
  const percentage = Math.round((currentMileage / targetMileage) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn font-sans">
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-white">
        {/* Glowing Ambient Top Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center space-y-6 relative z-10">
          {/* Animated Trophy Banner */}
          <div className="inline-flex items-center justify-center relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 p-0.5 shadow-xl shadow-amber-500/30 flex items-center justify-center animate-bounce">
              <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-amber-400 fill-amber-400/20 stroke-[1.8]" />
              </div>
            </div>
            <span className="absolute -top-2 -right-2 p-2 bg-sky-500 text-white rounded-full shadow-lg animate-pulse">
              <Sparkles className="w-5 h-5" />
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
              <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
              <span>{formattedMonth} 목표 달성 100% COMPLETE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              목표 마일리지 달성! 🎉
            </h2>
          </div>

          {/* Core Message Card */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 shadow-inner">
            <p className="text-lg font-black text-sky-300 tracking-tight">
              축하합니다 다음달에도 열심히 달려봐요!
            </p>
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-center space-x-4 text-xs font-bold text-slate-300">
              <div className="flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />
                <span>누적 거리: <strong className="text-white font-mono text-sm">{currentMileage} km</strong></span>
              </div>
              <span className="text-slate-600">|</span>
              <div>
                <span>목표: <strong className="text-slate-200 font-mono text-sm">{targetMileage} km</strong></span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="text-amber-400 font-mono font-black">
                {percentage}%
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center space-x-3">
            <button
              onClick={() => fireFullFireworks()}
              className="flex-1 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-extrabold text-xs transition flex items-center justify-center space-x-2 active:scale-95 shadow-md"
            >
              <PartyPopper className="w-4 h-4 text-amber-400" />
              <span>폭죽 다시 터뜨리기 🎉</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:brightness-110 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center space-x-1.5 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>확인</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
