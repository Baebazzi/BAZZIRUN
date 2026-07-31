import React, { useState } from 'react';
import { SportMode, WeeklyGoal } from '../types';
import { X, Sparkles, Target } from 'lucide-react';

interface WeeklyGoalModalProps {
  isOpen: boolean;
  weekStartMonday: string;
  sportMode?: SportMode;
  initialGoal?: WeeklyGoal;
  onClose: () => void;
  onSave: (goal: WeeklyGoal) => void;
}

export const WeeklyGoalModal: React.FC<WeeklyGoalModalProps> = ({
  isOpen,
  weekStartMonday,
  sportMode = 'RUNNING',
  initialGoal,
  onClose,
  onSave,
}) => {
  const [targetDistanceKm, setTargetDistanceKm] = useState<number>(initialGoal?.targetDistanceKm || 55);
  const [targetHours, setTargetHours] = useState<number>(initialGoal?.targetHours || 8);
  const [targetHybridSessions, setTargetHybridSessions] = useState<number>(initialGoal?.targetHybridSessions || 3);
  const [focusArea, setFocusArea] = useState<string>(
    initialGoal?.focusArea || '역치 심폐 훈련 및 마라톤 페이스 유지'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialGoal?.id || `wg-${weekStartMonday}`,
      weekStartDate: weekStartMonday,
      weekNumber: initialGoal?.weekNumber || 1,
      targetDistanceKm,
      targetHours,
      targetHybridSessions: sportMode === 'HYBRID' ? targetHybridSessions : 0,
      focusArea,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/20 border border-sky-400/30 text-sky-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
                WEEKLY GOAL
              </span>
              <h3 className="text-lg font-black font-sans mt-0.5">
                주간 훈련 목표 설정 <span className="text-slate-300 font-normal">({weekStartMonday})</span>
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-slate-50/50">
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 font-medium">
            💡 <strong className="text-blue-700 font-extrabold">주간 목표 게이지:</strong> 매주 이번 주 달성할 목표 거리를 지정하세요. 달력 위 주간 게이지 바에 실시간 반영됩니다.
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase mb-2 flex items-center justify-between">
              <span>목표 러닝 거리 (km)</span>
              <span className="text-blue-600 font-mono font-extrabold text-base">{targetDistanceKm} km</span>
            </label>
            <input
              type="range"
              min="10"
              max="150"
              step="5"
              value={targetDistanceKm}
              onChange={(e) => setTargetDistanceKm(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1 font-bold">
              <span>10km (입문)</span>
              <span>60km (중급)</span>
              <span>150km (엘리트)</span>
            </div>
          </div>

          <div className={`grid ${sportMode === 'HYBRID' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1.5">
                목표 운동 시간 (Hours)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={targetHours}
                  onChange={(e) => setTargetHours(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">시간</span>
              </div>
            </div>

            {sportMode === 'HYBRID' && (
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1.5">
                  목표 근력/하이브리드 세션
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={targetHybridSessions}
                    onChange={(e) => setTargetHybridSessions(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">회</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1.5">
              이번 주 핵심 훈련 포커스
            </label>
            <textarea
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              placeholder="예: 젖산역치 페이스 적응, 스피드 유지 및 주말 LSD 완주..."
              rows={2}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-extrabold text-sm shadow-md hover:brightness-110 transition flex items-center justify-center space-x-2"
            >
              <Target className="w-4 h-4 text-sky-400" />
              <span>주간 목표 저장하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
