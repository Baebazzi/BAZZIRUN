import React, { useState } from 'react';
import {
  DailyWorkoutLog,
  GeneralSchedule,
  WeeklyGoal,
  RunningPurpose,
  HybridCategory,
} from '../types';
import {
  calculateWeeklyStats,
  formatDateISO,
  getDaysInMonth,
} from '../utils/dateUtils';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Dumbbell,
  Calendar as CalendarIcon,
  Zap,
  Sparkles,
  Trash2,
  Mountain,
} from 'lucide-react';

interface CalendarGridProps {
  currentYear: number;
  currentMonth: number; // 0-indexed (0=Jan, 6=July)
  onChangeMonth: (year: number, month: number) => void;
  workoutLogs: Record<string, DailyWorkoutLog>;
  schedules: Record<string, GeneralSchedule[]>;
  weeklyGoals: Record<string, WeeklyGoal>;
  onOpenWorkoutModal: (dateString: string) => void;
  onOpenScheduleModal: (dateString: string, schedule?: GeneralSchedule) => void;
  onOpenWeeklyGoalModal: (weekStartMonday: string) => void;
  onOpenSundayDiagnosticModal: (dateString: string) => void;
  onDeleteWorkout: (dateString: string, workoutId: string, type: 'running' | 'hybrid') => void;
  onDeleteSchedule: (dateString: string, scheduleId: string) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentYear,
  currentMonth,
  onChangeMonth,
  workoutLogs,
  schedules,
  weeklyGoals,
  onOpenWorkoutModal,
  onOpenScheduleModal,
  onOpenWeeklyGoalModal,
  onOpenSundayDiagnosticModal,
  onDeleteWorkout,
  onDeleteSchedule,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(formatDateISO(new Date()));

  const daysGrid = getDaysInMonth(currentYear, currentMonth);

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월',
  ];

  const weekDayLabels = ['월 (MON)', '화 (TUE)', '수 (WED)', '목 (THU)', '금 (FRI)', '토 (SAT)', '일 (SUN)'];

  // Group days by week rows (7 days per row)
  const weekRows: typeof daysGrid[] = [];
  for (let i = 0; i < daysGrid.length; i += 7) {
    weekRows.push(daysGrid.slice(i, i + 7));
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      onChangeMonth(currentYear - 1, 11);
    } else {
      onChangeMonth(currentYear, currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      onChangeMonth(currentYear + 1, 0);
    } else {
      onChangeMonth(currentYear, currentMonth + 1);
    }
  };

  const getPurposeBadgeColor = (purpose: RunningPurpose) => {
    switch (purpose) {
      case '트레일러닝':
        return 'bg-emerald-100 text-emerald-950 border-emerald-300 hover:bg-emerald-200';
      case 'LSD':
        return 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100';
      case '템포':
        return 'bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100';
      case '조깅':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100';
      case '인터벌':
        return 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100';
    }
  };

  const getHybridBadgeColor = (category: HybridCategory) => {
    switch (category) {
      case '하이록스 시뮬레이션':
        return 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100';
      case '하이록스 하프 시뮬레이션':
        return 'bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100';
      case '하이브리드 트레이닝':
        return 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100';
      case '근력 트레이닝 (상체)':
        return 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100';
      case '근력 트레이닝 (하체)':
        return 'bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-100';
      case '근력 트레이닝 (상하체)':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  const getTimeOfDayBadge = (tod?: string) => {
    switch (tod) {
      case '오전':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case '오후':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case '종일':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const todayStr = formatDateISO(new Date());

  return (
    <div className="space-y-6 font-sans">
      {/* Calendar Month Navigation Header */}
      <div className="bg-gradient-to-b from-white via-slate-50 to-slate-100 border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/70 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevMonth}
            className="p-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 shadow-md border border-slate-200/80 transition active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <span>{currentYear}년</span>
              <span className="text-blue-600 bg-blue-50 px-3 py-0.5 rounded-2xl border border-blue-100">
                {monthNames[currentMonth]}
              </span>
            </h2>
          </div>
          <button
            onClick={handleNextMonth}
            className="p-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 shadow-md border border-slate-200/80 transition active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Legend / Key */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="text-slate-400 mr-1">훈련 범례:</span>
          <span className="px-2.5 py-1 rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-200">조깅</span>
          <span className="px-2.5 py-1 rounded-lg border bg-sky-50 text-sky-700 border-sky-200">템포</span>
          <span className="px-2.5 py-1 rounded-lg border bg-rose-50 text-rose-700 border-rose-200">인터벌</span>
          <span className="px-2.5 py-1 rounded-lg border bg-amber-50 text-amber-700 border-amber-200">LSD</span>
          <span className="px-2.5 py-1 rounded-lg border bg-emerald-100 text-emerald-900 border-emerald-300">🌲 트레일러닝</span>
          <span className="px-2.5 py-1 rounded-lg border bg-blue-50 text-blue-800 border-blue-200">근력/하이브리드</span>
        </div>
      </div>

      {/* Days of Week Headers */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100/80 text-center font-bold">
          {weekDayLabels.map((dayLabel, idx) => (
            <div
              key={dayLabel}
              className={`py-2.5 sm:py-3 text-[11px] sm:text-sm font-extrabold tracking-wider ${
                idx === 6 ? 'text-rose-600' : idx === 5 ? 'text-indigo-600' : 'text-slate-700'
              }`}
            >
              <span className="hidden sm:inline">{dayLabel}</span>
              <span className="sm:hidden">{dayLabel.slice(0, 1)}</span>
            </div>
          ))}
        </div>

        {/* Calendar Rows with Weekly Header Gauge Bar */}
        <div className="divide-y divide-slate-200/80">
          {weekRows.map((weekDays, weekIdx) => {
            const mondayDateStr = weekDays[0].dateString;
            const weekGoal = weeklyGoals[mondayDateStr] || {
              targetDistanceKm: 50,
              targetHours: 8,
              targetHybridSessions: 2,
              focusArea: '기본 훈련 목표',
            };

            const stats = calculateWeeklyStats(mondayDateStr, workoutLogs);
            const targetKm = weekGoal.targetDistanceKm || 50;
            const progressPercent = Math.min(100, Math.round((stats.totalDistance / targetKm) * 100));

            return (
              <div key={`week-row-${weekIdx}`} className="bg-slate-50/30">
                {/* Weekly Progress Gauge Bar */}
                <div className="bg-slate-900 text-white px-2.5 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 shadow-inner">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 font-mono text-xs font-extrabold px-2 py-0.5 rounded-xl flex items-center space-x-1 shadow-xs shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                      <span>{weekIdx + 1}주차</span>
                    </span>
                    <div className="text-xs font-bold text-slate-200 flex items-center space-x-1.5 flex-wrap">
                      <span>
                        주간: <span className="text-sky-300 font-extrabold">{stats.totalDistance} km</span> / {targetKm} km
                      </span>
                      <span className="text-slate-600 hidden sm:inline">|</span>
                      <span className="text-slate-300 text-xs hidden sm:inline">
                        러닝 {stats.runningSessions}회 ({stats.totalDurationHours}시간)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-1 max-w-xs min-w-[140px]">
                    <div className="flex-1 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700/80 p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          progressPercent >= 100
                            ? 'bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 shadow-md'
                            : 'bg-gradient-to-r from-emerald-400 to-sky-400'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-black text-sky-300 min-w-[35px] text-right">
                      {progressPercent}%
                    </span>
                    <button
                      onClick={() => onOpenWeeklyGoalModal(mondayDateStr)}
                      className="px-2 py-0.5 text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition active:scale-95 shrink-0"
                      title="주간 목표 수정"
                    >
                      수정
                    </button>
                  </div>
                </div>

                {/* 7-Day Grid for this week */}
                <div className="grid grid-cols-7 divide-x divide-slate-200/90 w-full">
                  {weekDays.map((dayObj) => {
                    const dateStr = dayObj.dateString;
                    const log = workoutLogs[dateStr];
                    const daySchedules = schedules[dateStr] || [];
                    const isToday = dateStr === todayStr;
                    const isSundayDay = dayObj.dayOfWeek === 0;
                    const isMondayDay = dayObj.dayOfWeek === 1;

                    const runningList = log?.runningWorkouts || [];
                    const hybridList = log?.hybridWorkouts || [];

                    return (
                      <div
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`min-h-[145px] sm:min-h-[185px] p-1 sm:p-2 relative flex flex-col justify-start transition-all w-full max-w-full min-w-0 overflow-hidden box-border ${
                          dayObj.isCurrentMonth ? 'bg-white' : 'bg-slate-100/50 opacity-40'
                        } ${isToday ? 'ring-2 ring-blue-600 ring-inset bg-blue-50/20' : ''} ${
                          selectedDate === dateStr && !isToday ? 'bg-slate-50' : ''
                        }`}
                      >
                        {/* Day Cell Header: Action Buttons & Date Number */}
                        <div className="w-full max-w-full min-w-0">
                          <div className="flex items-center justify-between mb-1 gap-0.5 w-full">
                            {/* Left Button: 훈련 기재 */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenWorkoutModal(dateStr);
                              }}
                              className="px-1 sm:px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-black bg-slate-900 hover:bg-blue-600 text-white transition flex items-center justify-center space-x-0.5 shadow-2xs active:scale-95 shrink-0"
                              title="오늘의 훈련 기재"
                            >
                              <Plus className="w-2.5 h-2.5 stroke-[3]" />
                              <span className="hidden sm:inline">훈련</span>
                              <span className="sm:hidden font-mono text-[9px] font-extrabold">⚡</span>
                            </button>

                            {/* Date Number Display */}
                            <span
                              className={`font-sans text-[11px] sm:text-xs font-black px-1 sm:px-1.5 py-0.5 rounded-md text-center shrink-0 ${
                                isToday
                                  ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                                  : dayObj.dayOfWeek === 0
                                  ? 'text-rose-600'
                                  : dayObj.dayOfWeek === 6
                                  ? 'text-indigo-600'
                                  : 'text-slate-800'
                              }`}
                            >
                              {dayObj.date.getDate()}
                            </span>

                            {/* Right Button: 일정 추가 */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenScheduleModal(dateStr);
                              }}
                              className="px-1 sm:px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition flex items-center justify-center space-x-0.5 active:scale-95 shrink-0"
                              title="일반 스케쥴링"
                            >
                              <Plus className="w-2.5 h-2.5 text-slate-500" />
                              <span className="hidden sm:inline">일정</span>
                              <span className="sm:hidden font-mono text-[9px] font-bold">📅</span>
                            </button>
                          </div>

                          {/* Trigger Banner Tags for Monday or Sunday */}
                          {isMondayDay && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenWeeklyGoalModal(dateStr);
                              }}
                              className="mb-1 text-[10px] bg-sky-50 text-sky-700 border border-sky-200 px-1.5 py-0.5 rounded-md cursor-pointer hover:bg-sky-100 font-bold flex items-center justify-between shadow-2xs transition truncate w-full"
                            >
                              <span className="truncate">🎯 주간목표 설정</span>
                            </div>
                          )}

                          {isSundayDay && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenSundayDiagnosticModal(dateStr);
                              }}
                              className="mb-1 text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded-md cursor-pointer hover:bg-rose-100 font-bold flex items-center justify-between shadow-2xs transition truncate w-full"
                            >
                              <span className="truncate">🩺 일요 자가진단</span>
                            </div>
                          )}

                          {/* 🌟 Vertical Full-Width Stack for All Workouts & Schedules (strictly fits inside cell) */}
                          <div className="flex flex-col space-y-1 w-full max-w-full min-w-0 mt-1 overflow-hidden">
                            {/* Running Workouts */}
                            {runningList.map((rw) => (
                              <div
                                key={rw.id}
                                className={`w-full max-w-full min-w-0 px-2 py-1 rounded-lg border flex items-center justify-between text-xs transition group/item shadow-2xs ${getPurposeBadgeColor(
                                  rw.purpose
                                )}`}
                              >
                                <div className="flex items-center space-x-1 min-w-0 truncate">
                                  {rw.purpose === '트레일러닝' ? (
                                    <Mountain className="w-3 h-3 text-emerald-700 shrink-0" />
                                  ) : (
                                    <Zap className="w-3 h-3 text-blue-600 fill-blue-500/20 shrink-0" />
                                  )}
                                  <span className="font-extrabold text-slate-900 truncate">
                                    {rw.distanceKm}km ({rw.pace})
                                  </span>
                                  {rw.purpose === '트레일러닝' && rw.elevationGainM !== undefined && (
                                    <span className="text-[10px] font-mono font-black text-emerald-800 px-1 rounded bg-emerald-200/90 border border-emerald-300 shrink-0">
                                      D+ {rw.elevationGainM}m
                                    </span>
                                  )}
                                  <span className="text-[10px] font-black uppercase px-1 rounded bg-white/80 border border-slate-200 shrink-0">
                                    {rw.intervalType || rw.purpose}
                                  </span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteWorkout(dateStr, rw.id, 'running');
                                  }}
                                  className="text-rose-500 hover:text-rose-700 p-0.5 rounded hover:bg-rose-100/80 transition shrink-0 ml-1"
                                  title="삭제"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}

                            {/* Hybrid Workouts */}
                            {hybridList.map((hw) => (
                              <div
                                key={hw.id}
                                className={`w-full max-w-full min-w-0 px-2 py-1 rounded-lg border flex items-center justify-between text-xs transition group/item shadow-2xs ${getHybridBadgeColor(
                                  hw.category
                                )}`}
                              >
                                <div className="flex items-center space-x-1 min-w-0 truncate">
                                  <Dumbbell className="w-3 h-3 text-amber-600 shrink-0" />
                                  <span className="font-extrabold text-slate-900 truncate">
                                    {hw.category}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-600 shrink-0">
                                    {hw.durationMinutes}분
                                  </span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteWorkout(dateStr, hw.id, 'hybrid');
                                  }}
                                  className="text-rose-500 hover:text-rose-700 p-0.5 rounded hover:bg-rose-100/80 transition shrink-0 ml-1"
                                  title="삭제"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}

                            {/* General Schedules - Click to Edit / Delete */}
                            {daySchedules.map((sch) => (
                              <div
                                key={sch.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenScheduleModal(dateStr, sch);
                                }}
                                className="w-full max-w-full min-w-0 bg-slate-100 hover:bg-slate-200/90 border border-slate-200/90 px-2 py-1 rounded-lg text-xs text-slate-800 flex items-center justify-between transition shadow-2xs cursor-pointer group/sch"
                              >
                                <div className="flex items-center space-x-1.5 min-w-0 truncate">
                                  {sch.timeOfDay && (
                                    <span className={`text-[9px] font-extrabold px-1 rounded border shrink-0 ${getTimeOfDayBadge(sch.timeOfDay)}`}>
                                      {sch.timeOfDay}
                                    </span>
                                  )}
                                  <CalendarIcon className="w-3 h-3 text-sky-600 shrink-0" />
                                  <span className="font-bold text-slate-900 truncate">
                                    {sch.title}
                                  </span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteSchedule(dateStr, sch.id);
                                  }}
                                  className="text-rose-500 hover:text-rose-700 p-0.5 rounded hover:bg-rose-100/80 transition shrink-0 ml-1"
                                  title="일정 삭제"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
