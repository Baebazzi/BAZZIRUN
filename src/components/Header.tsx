import React from 'react';
import { MonthlyGoal, SportMode } from '../types';
import {
  Target,
  Download,
  Upload,
  Activity,
  Zap,
  RotateCcw,
  Sparkles,
  Dumbbell,
  Settings,
} from 'lucide-react';

interface HeaderProps {
  sportMode: SportMode;
  onChangeSportMode: (mode: SportMode) => void;
  monthlyGoal?: MonthlyGoal;
  currentMonthMileage: number;
  onOpenMonthlyGoalModal: () => void;
  onOpenWeeklyGoalModal: () => void;
  onOpenSundayDiagnosticModal: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sportMode,
  onChangeSportMode,
  monthlyGoal,
  currentMonthMileage,
  onOpenMonthlyGoalModal,
  onOpenWeeklyGoalModal,
  onOpenSundayDiagnosticModal,
  onExportData,
  onImportData,
  onResetData,
}) => {
  const targetKm = monthlyGoal?.targetDistanceKm || 200;
  const progressPercent = Math.min(100, Math.round((currentMonthMileage / targetKm) * 100));

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-sm font-sans">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Minimalist Title Badge */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-0.5 shadow-md flex items-center justify-center text-sky-400">
            <Zap className="w-4 h-4 fill-sky-400/20" />
          </div>
          <span className="text-xs sm:text-sm font-black tracking-tight text-slate-900 px-3 py-1 bg-slate-100/90 rounded-xl border border-slate-200/80 shadow-2xs">
            {sportMode === 'RUNNING' ? '러닝 & 스케쥴 관리 달력' : '하이브리드 & 스케쥴 관리 달력'}
          </span>
        </div>

        {/* 🌟 REQUIREMENT: Monthly Mileage Banner (이번 달 누적 마일리지) */}
        <div className="flex items-center space-x-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-3.5 py-1.5 rounded-2xl shadow-md border border-slate-700/80">
          <div className="p-1.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
            <Zap className="w-4 h-4 fill-sky-400/20" />
          </div>
          <div className="flex items-center space-x-2 text-xs font-bold">
            <span className="text-slate-300 font-sans hidden sm:inline">이번 달 누적 마일리지:</span>
            <span className="text-slate-300 font-sans sm:hidden">누적:</span>
            <span className="text-sky-300 font-mono font-black text-sm">{currentMonthMileage} km</span>
            <span className="text-slate-500 font-mono text-[11px]">/ {targetKm}km ({progressPercent}%)</span>
            <button
              onClick={onOpenMonthlyGoalModal}
              className="text-[10px] text-sky-300 hover:text-white underline font-extrabold ml-1"
              title="월간 목표 설정"
            >
              [목표]
            </button>
          </div>
        </div>

        {/* Mode Selector (러닝 모드 vs 하이브리드 모드) */}
        <div className="flex items-center bg-slate-100/80 border border-slate-200 p-1 rounded-2xl">
          <span className="text-xs font-bold text-slate-500 px-1.5 hidden md:flex items-center space-x-1">
            <Settings className="w-3.5 h-3.5 text-slate-600" />
            <span>모드:</span>
          </span>
          <div className="flex space-x-1">
            <button
              onClick={() => onChangeSportMode('RUNNING')}
              className={`px-2.5 py-1 rounded-xl text-xs font-extrabold transition flex items-center space-x-1 active:scale-95 ${
                sportMode === 'RUNNING'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
              title="러닝 중심 전용 캘린더"
            >
              <Zap className="w-3 h-3 text-sky-400" />
              <span>러닝</span>
            </button>
            <button
              onClick={() => onChangeSportMode('HYBRID')}
              className={`px-2.5 py-1 rounded-xl text-xs font-extrabold transition flex items-center space-x-1 active:scale-95 ${
                sportMode === 'HYBRID'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
              title="러닝 + 하이브리드 보강 운동 캘린더"
            >
              <Dumbbell className="w-3 h-3" />
              <span>하이브리드</span>
            </button>
          </div>
        </div>

        {/* Action Tools */}
        <div className="flex items-center space-x-2">
          {/* Popups & Quick Tools Button Group */}
          <div className="hidden sm:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={onOpenMonthlyGoalModal}
              className="px-2 py-1 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-white transition flex items-center space-x-1 active:scale-95"
              title="월간 목표 설정"
            >
              <Target className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden md:inline">월간목표</span>
            </button>
            <button
              onClick={onOpenWeeklyGoalModal}
              className="px-2 py-1 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-white transition flex items-center space-x-1 active:scale-95"
              title="주간 목표 설정"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden md:inline">주간목표</span>
            </button>
            <button
              onClick={onOpenSundayDiagnosticModal}
              className="px-2 py-1 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-white transition flex items-center space-x-1 active:scale-95"
              title="일요일 자가 진단"
            >
              <Activity className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden md:inline">자가진단</span>
            </button>
          </div>

          {/* Backup / Export Menu */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={onExportData}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition"
              title="데이터 백업 내보내기 (JSON)"
            >
              <Download className="w-4 h-4" />
            </button>
            <label
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition cursor-pointer"
              title="데이터 불러오기 (JSON)"
            >
              <Upload className="w-4 h-4" />
              <input type="file" accept=".json" onChange={onImportData} className="hidden" />
            </label>
            <button
              onClick={onResetData}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-white transition"
              title="모든 캘린더 데이터 초기화"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
