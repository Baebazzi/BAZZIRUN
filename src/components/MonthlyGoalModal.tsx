import React, { useState } from 'react';
import { MonthlyGoal, SportMode } from '../types';
import { X, Target, Award } from 'lucide-react';

interface MonthlyGoalModalProps {
  isOpen: boolean;
  yearMonth: string; // YYYY-MM
  sportMode?: SportMode;
  initialGoal?: MonthlyGoal;
  onClose: () => void;
  onSave: (goal: MonthlyGoal) => void;
}

export const MonthlyGoalModal: React.FC<MonthlyGoalModalProps> = ({
  isOpen,
  yearMonth,
  sportMode = 'RUNNING',
  initialGoal,
  onClose,
  onSave,
}) => {
  const [targetDistanceKm, setTargetDistanceKm] = useState<number>(initialGoal?.targetDistanceKm || 220);
  const [targetHyroxSims, setTargetHyroxSims] = useState<number>(initialGoal?.targetHyroxSims || 4);
  const [targetStrengthHours, setTargetStrengthHours] = useState<number>(initialGoal?.targetStrengthHours || 16);
  const [mainObjective, setMainObjective] = useState<string>(
    initialGoal?.mainObjective || '마라톤 레이스 대비 - 역치 페이스 향상 및 주간 마일리지 달성'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialGoal?.id || `mg-${yearMonth}`,
      yearMonth,
      targetDistanceKm,
      targetHyroxSims: sportMode === 'HYBRID' ? targetHyroxSims : 0,
      targetStrengthHours,
      mainObjective,
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
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
                MONTHLY TARGET
              </span>
              <h3 className="text-lg font-black font-sans mt-0.5">
                월간 훈련 목표 설정 <span className="text-slate-300 font-normal">({yearMonth})</span>
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
          <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-sky-900 font-medium">
            📅 <strong className="text-sky-700 font-extrabold">월간 목표 설정:</strong> 이번 달 누적할 목표 마일리지와 주요 훈련 지표를 설정하세요.
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase mb-2 flex items-center justify-between">
              <span>월간 목표 누적거리 (km)</span>
              <span className="text-blue-600 font-mono font-extrabold text-base">{targetDistanceKm} km</span>
            </label>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={targetDistanceKm}
              onChange={(e) => setTargetDistanceKm(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1 font-bold">
              <span>50km</span>
              <span>250km</span>
              <span>500km</span>
            </div>
          </div>

          <div className={`grid ${sportMode === 'HYBRID' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
            {sportMode === 'HYBRID' && (
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1.5">
                  목표 근력/하이브리드 세션
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={targetHyroxSims}
                    onChange={(e) => setTargetHyroxSims(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">회</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1.5">
                목표 근력 운동 시간
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={targetStrengthHours}
                  onChange={(e) => setTargetStrengthHours(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">시간</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1.5">
              이번 달 메인 목표 및 슬로건
            </label>
            <textarea
              value={mainObjective}
              onChange={(e) => setMainObjective(e.target.value)}
              placeholder="예: 마라톤 대회 대비 서브3 페이스 적응 및 체력 강화..."
              rows={2}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-extrabold text-sm shadow-md hover:brightness-110 transition flex items-center justify-center space-x-2"
            >
              <Award className="w-4 h-4 text-sky-400" />
              <span>월간 훈련 목표 확정하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
