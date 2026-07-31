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
  BookOpen,
} from 'lucide-react';

interface HeaderProps {
  userName: string;
  sportMode: SportMode;
  onChangeSportMode: (mode: SportMode) => void;
  monthlyGoal?: MonthlyGoal;
  currentMonthMileage: number;
  onOpenMonthlyGoalModal: () => void;
  onOpenWeeklyGoalModal: () => void;
  onOpenSundayDiagnosticModal: () => void;
  onOpenManualModal: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  sportMode,
  onChangeSportMode,
  monthlyGoal,
  currentMonthMileage,
  onOpenMonthlyGoalModal,
  onOpenWeeklyGoalModal,
  onOpenSundayDiagnosticModal,
  onOpenManualModal,
  onExportData,
  onImportData,
  onResetData,
}) => {
  const targetKm = monthlyGoal?.targetDistanceKm || 200;
  const progressPercent = Math.min(100, Math.round((currentMonthMileage / targetKm) * 100));

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-30 shadow-xs font-sans pt-[max(env(safe-area-inset-top),12px)] pb-2 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-2">
        {/* DESKTOP LAYOUT (sm:flex) */}
        <div className="hidden sm:flex items-center justify-between gap-3">
          {/* Minimalist Title Badge */}
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-0.5 shadow-md flex items-center justify-center text-sky-400">
              <Zap className="w-4 h-4 fill-sky-400/20" />
            </div>
            <span className="text-xs sm:text-sm font-black tracking-tight text-slate-900 px-3 py-1 bg-slate-100/90 rounded-xl border border-slate-200/80 shadow-2xs">
              {userName ? (
                <span className="text-sky-600 font-extrabold mr-1">{userName} 님의</span>
              ) : null}
              {sportMode === 'RUNNING' ? '러닝 & 스케쥴 달력' : '하이브리드 & 스케쥴 달력'}
            </span>
          </div>

          {/* Monthly Mileage Banner */}
          <div className="flex items-center space-x-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-3.5 py-1.5 rounded-2xl shadow-md border border-slate-700/80">
            <div className="p-1.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
              <Zap className="w-4 h-4 fill-sky-400/20" />
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold">
              <span className="text-slate-300 font-sans">이번 달 누적 마일리지:</span>
              <span className="text-sky-300 font-mono font-black text-sm">{currentMonthMileage} km</span>
              <span className="text-slate-400 font-mono text-[11px]">/ {targetKm}km ({progressPercent}%)</span>
              <button
                onClick={onOpenMonthlyGoalModal}
                className="text-[10px] text-sky-300 hover:text-white underline font-extrabold ml-1"
                title="월간 목표 설정"
              >
                [목표]
              </button>
            </div>
          </div>

          {/* Mode Selector */}
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
            <button
              onClick={onOpenManualModal}
              className="px-2.5 py-1.5 rounded-xl text-xs font-black bg-slate-900 hover:bg-sky-600 text-white transition flex items-center space-x-1.5 shadow-xs active:scale-95 shrink-0"
              title="사용 설명서 및 스마트폰 홈 화면 바로가기 추가 안내"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>설명서 / 바로가기</span>
            </button>

            <div className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={onOpenMonthlyGoalModal}
                className="px-2 py-1 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-white transition flex items-center space-x-1 active:scale-95"
                title="월간 목표 설정"
              >
                <Target className="w-3.5 h-3.5 text-sky-600" />
                <span>월간목표</span>
              </button>
              <button
                onClick={onOpenWeeklyGoalModal}
                className="px-2 py-1 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-white transition flex items-center space-x-1 active:scale-95"
                title="주간 목표 설정"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>주간목표</span>
              </button>
              <button
                onClick={onOpenSundayDiagnosticModal}
                className="px-2 py-1 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-white transition flex items-center space-x-1 active:scale-95"
                title="일요일 자가 진단"
              >
                <Activity className="w-3.5 h-3.5 text-rose-600" />
                <span>자가진단</span>
              </button>
            </div>

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

        {/* MOBILE COMPACT DUAL-ROW LAYOUT (sm:hidden) */}
        <div className="sm:hidden space-y-1.5">
          {/* Mobile Row 1: Title & Mode Toggle */}
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center space-x-1.5 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-sky-400 shrink-0">
                <Zap className="w-3.5 h-3.5 fill-sky-400/20" />
              </div>
              <span className="text-[11px] font-black text-slate-900 truncate">
                {userName ? <span className="text-sky-600 mr-0.5">{userName}</span> : null}
                달력
              </span>
            </div>

            {/* Compact Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
              <button
                onClick={() => onChangeSportMode('RUNNING')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-black transition ${
                  sportMode === 'RUNNING'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600'
                }`}
              >
                ⚡ 러닝
              </button>
              <button
                onClick={() => onChangeSportMode('HYBRID')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-black transition ${
                  sportMode === 'HYBRID'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600'
                }`}
              >
                🏋️ 하이브리드
              </button>
            </div>
          </div>

          {/* Mobile Row 2: Mileage Gauge + Actions */}
          <div className="flex items-center justify-between gap-1.5 text-[11px]">
            {/* Mileage Pill */}
            <div className="bg-slate-900 text-white px-2 py-1 rounded-xl flex items-center space-x-1 font-bold text-[10px] min-w-0 truncate border border-slate-800">
              <span className="text-slate-400 font-mono">누적:</span>
              <span className="text-sky-300 font-mono font-black">{currentMonthMileage}km</span>
              <span className="text-slate-400 font-mono text-[9px]">/ {targetKm}k ({progressPercent}%)</span>
              <button
                onClick={onOpenMonthlyGoalModal}
                className="text-sky-300 underline font-black ml-0.5"
              >
                [목표]
              </button>
            </div>

            {/* Quick Mobile Action Icons */}
            <div className="flex items-center space-x-1 shrink-0">
              <button
                onClick={onOpenManualModal}
                className="px-2 py-1 bg-slate-900 hover:bg-sky-600 text-white rounded-lg font-black text-[10px] flex items-center space-x-1 transition active:scale-95 shadow-2xs"
              >
                <BookOpen className="w-3 h-3 text-sky-400" />
                <span>설명서</span>
              </button>

              <div className="flex items-center space-x-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={onExportData}
                  className="p-1 rounded text-slate-700 hover:bg-white"
                  title="백업 내보내기"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <label className="p-1 rounded text-slate-700 hover:bg-white cursor-pointer" title="불러오기">
                  <Upload className="w-3.5 h-3.5" />
                  <input type="file" accept=".json" onChange={onImportData} className="hidden" />
                </label>
                <button
                  onClick={onResetData}
                  className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-white"
                  title="초기화"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
