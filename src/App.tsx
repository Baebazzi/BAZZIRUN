import React, { useState, useEffect } from 'react';
import {
  DailyWorkoutLog,
  GeneralSchedule,
  HybridCategory,
  MonthlyGoal,
  RunningPurpose,
  SportMode,
  SundayDiagnostic,
  WeeklyGoal,
} from './types';
import {
  INITIAL_MONTHLY_GOALS,
  INITIAL_SCHEDULES,
  INITIAL_SUNDAY_DIAGNOSTICS,
  INITIAL_WEEKLY_GOALS,
  INITIAL_WORKOUT_LOGS,
} from './data/initialData';
import {
  formatDateISO,
  getMondayOfDate,
} from './utils/dateUtils';
import { Header } from './components/Header';
import { CalendarGrid } from './components/CalendarGrid';
import { WorkoutModal } from './components/WorkoutModal';
import { ScheduleModal } from './components/ScheduleModal';
import { WeeklyGoalModal } from './components/WeeklyGoalModal';
import { MonthlyGoalModal } from './components/MonthlyGoalModal';
import { SundayDiagnosticModal } from './components/SundayDiagnosticModal';
import { GoalAchievementModal } from './components/GoalAchievementModal';

export default function App() {
  // Sport Mode (Initial setup & toggle: 러닝 모드 vs 하이브리드 모드)
  const [sportMode, setSportMode] = useState<SportMode>(() => {
    const saved = localStorage.getItem('stride_sport_mode');
    return (saved as SportMode) || 'RUNNING';
  });

  // Current View Month & Year (Dynamic based on current date)
  const now = new Date();
  const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth());

  // Data Stores
  const [workoutLogs, setWorkoutLogs] = useState<Record<string, DailyWorkoutLog>>(() => {
    const saved = localStorage.getItem('stride_workout_logs');
    return saved ? JSON.parse(saved) : INITIAL_WORKOUT_LOGS;
  });

  const [schedules, setSchedules] = useState<Record<string, GeneralSchedule[]>>(() => {
    const saved = localStorage.getItem('stride_schedules');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
  });

  const [weeklyGoals, setWeeklyGoals] = useState<Record<string, WeeklyGoal>>(() => {
    const saved = localStorage.getItem('stride_weekly_goals');
    return saved ? JSON.parse(saved) : INITIAL_WEEKLY_GOALS;
  });

  const [monthlyGoals, setMonthlyGoals] = useState<Record<string, MonthlyGoal>>(() => {
    const saved = localStorage.getItem('stride_monthly_goals');
    return saved ? JSON.parse(saved) : INITIAL_MONTHLY_GOALS;
  });

  const [sundayDiagnostics, setSundayDiagnostics] = useState<Record<string, SundayDiagnostic>>(() => {
    const saved = localStorage.getItem('stride_sunday_diagnostics');
    return saved ? JSON.parse(saved) : INITIAL_SUNDAY_DIAGNOSTICS;
  });

  // Modal States
  const [selectedDateForModal, setSelectedDateForModal] = useState<string>(formatDateISO(new Date()));

  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<GeneralSchedule | null>(null);

  const todayStr = formatDateISO(new Date());
  const todayMonday = getMondayOfDate(todayStr);
  const [isWeeklyGoalModalOpen, setIsWeeklyGoalModalOpen] = useState(false);
  const [selectedWeekStart, setSelectedWeekStart] = useState<string>(todayMonday);

  const todayYM = todayStr.slice(0, 7);
  const [isMonthlyGoalModalOpen, setIsMonthlyGoalModalOpen] = useState(false);
  const [selectedYearMonth, setSelectedYearMonth] = useState<string>(todayYM);

  const [isSundayDiagnosticModalOpen, setIsSundayDiagnosticModalOpen] = useState(false);
  const [selectedSundayDate, setSelectedSundayDate] = useState<string>(todayStr);

  const [isGoalCelebrationModalOpen, setIsGoalCelebrationModalOpen] = useState(false);
  const [celebratedMonths, setCelebratedMonths] = useState<string[]>(() => {
    const saved = localStorage.getItem('stride_celebrated_months');
    return saved ? JSON.parse(saved) : [];
  });

  // Local Storage Synchronization
  useEffect(() => {
    localStorage.setItem('stride_celebrated_months', JSON.stringify(celebratedMonths));
  }, [celebratedMonths]);
  useEffect(() => {
    localStorage.setItem('stride_sport_mode', sportMode);
  }, [sportMode]);

  useEffect(() => {
    localStorage.setItem('stride_workout_logs', JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  useEffect(() => {
    localStorage.setItem('stride_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('stride_weekly_goals', JSON.stringify(weeklyGoals));
  }, [weeklyGoals]);

  useEffect(() => {
    localStorage.setItem('stride_monthly_goals', JSON.stringify(monthlyGoals));
  }, [monthlyGoals]);

  useEffect(() => {
    localStorage.setItem('stride_sunday_diagnostics', JSON.stringify(sundayDiagnostics));
  }, [sundayDiagnostics]);

  // Compute Total Mileage for Current Month
  const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  let currentMonthMileage = 0;
  (Object.entries(workoutLogs) as [string, DailyWorkoutLog][]).forEach(([dateStr, log]) => {
    if (dateStr.startsWith(currentMonthPrefix) && log.runningWorkouts) {
      log.runningWorkouts.forEach((rw) => {
        currentMonthMileage += rw.distanceKm || 0;
      });
    }
  });
  currentMonthMileage = Math.round(currentMonthMileage * 10) / 10;

  const currentYMStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const currentMonthlyGoal = monthlyGoals[currentYMStr];
  const targetKm = currentMonthlyGoal?.targetDistanceKm || 200;

  // Auto trigger goal achievement celebration popup when target is reached
  useEffect(() => {
    if (targetKm > 0 && currentMonthMileage >= targetKm) {
      if (!celebratedMonths.includes(currentYMStr)) {
        setIsGoalCelebrationModalOpen(true);
        setCelebratedMonths((prev) => [...prev, currentYMStr]);
      }
    }
  }, [currentMonthMileage, targetKm, currentYMStr, celebratedMonths]);

  // Handlers for Workouts
  const handleOpenWorkoutModal = (dateStr: string) => {
    setSelectedDateForModal(dateStr);
    setIsWorkoutModalOpen(true);
  };

  const handleSaveRunning = (data: {
    distanceKm: number;
    pace: string;
    purpose: RunningPurpose;
    durationMinutes: number;
    calories?: number;
    notes?: string;
    elevationGainM?: number;
  }) => {
    const dateStr = selectedDateForModal;
    setWorkoutLogs((prev) => {
      const existing = prev[dateStr] || { id: `log-${dateStr}`, date: dateStr, runningWorkouts: [], hybridWorkouts: [] };
      const newRunning = {
        id: `rw-${Date.now()}`,
        ...data,
      };
      return {
        ...prev,
        [dateStr]: {
          ...existing,
          runningWorkouts: [...(existing.runningWorkouts || []), newRunning],
        },
      };
    });
  };

  const handleSaveHybrid = (data: {
    category: HybridCategory;
    durationMinutes: number;
    rpe: number;
    stationsCompleted?: string[];
    notes?: string;
  }) => {
    const dateStr = selectedDateForModal;
    setWorkoutLogs((prev) => {
      const existing = prev[dateStr] || { id: `log-${dateStr}`, date: dateStr, runningWorkouts: [], hybridWorkouts: [] };
      const newHybrid = {
        id: `hw-${Date.now()}`,
        ...data,
      };
      return {
        ...prev,
        [dateStr]: {
          ...existing,
          hybridWorkouts: [...(existing.hybridWorkouts || []), newHybrid],
        },
      };
    });
  };

  const handleDeleteWorkout = (dateStr: string, workoutId: string, type: 'running' | 'hybrid') => {
    setWorkoutLogs((prev) => {
      const existing = prev[dateStr];
      if (!existing) return prev;
      if (type === 'running') {
        return {
          ...prev,
          [dateStr]: {
            ...existing,
            runningWorkouts: (existing.runningWorkouts || []).filter((w) => w.id !== workoutId),
          },
        };
      } else {
        return {
          ...prev,
          [dateStr]: {
            ...existing,
            hybridWorkouts: (existing.hybridWorkouts || []).filter((w) => w.id !== workoutId),
          },
        };
      }
    });
  };

  // Handlers for General Schedules
  const handleOpenScheduleModal = (dateStr: string, schedule?: GeneralSchedule) => {
    setSelectedDateForModal(dateStr);
    setEditingSchedule(schedule || null);
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = (data: {
    id?: string;
    title: string;
    time?: string;
    timeOfDay?: '오전' | '오후' | '종일';
    category: '개인 훈련' | '일반 일정' | '미팅/약속' | '회복/휴식' | '기타';
    notes?: string;
  }) => {
    const dateStr = selectedDateForModal;
    setSchedules((prev) => {
      const existing = prev[dateStr] || [];
      if (data.id) {
        return {
          ...prev,
          [dateStr]: existing.map((s) => (s.id === data.id ? { ...s, ...data, id: data.id, date: dateStr } : s)),
        };
      } else {
        const newSch: GeneralSchedule = {
          id: `sch-${Date.now()}`,
          date: dateStr,
          ...data,
        };
        return {
          ...prev,
          [dateStr]: [...existing, newSch],
        };
      }
    });
  };

  const handleDeleteSchedule = (dateStr: string, scheduleId: string) => {
    setSchedules((prev) => {
      const existing = prev[dateStr] || [];
      return {
        ...prev,
        [dateStr]: existing.filter((s) => s.id !== scheduleId),
      };
    });
  };

  // Handlers for Popups
  const handleOpenWeeklyGoalModal = (weekStartMonday?: string) => {
    const start = weekStartMonday || getMondayOfDate(formatDateISO(new Date()));
    setSelectedWeekStart(start);
    setIsWeeklyGoalModalOpen(true);
  };

  const handleSaveWeeklyGoal = (goal: WeeklyGoal) => {
    setWeeklyGoals((prev) => ({
      ...prev,
      [goal.weekStartDate]: goal,
    }));
  };

  const handleOpenMonthlyGoalModal = () => {
    const ym = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    setSelectedYearMonth(ym);
    setIsMonthlyGoalModalOpen(true);
  };

  const handleSaveMonthlyGoal = (goal: MonthlyGoal) => {
    setMonthlyGoals((prev) => ({
      ...prev,
      [goal.yearMonth]: goal,
    }));
  };

  const handleOpenSundayDiagnosticModal = (sundayDateStr?: string) => {
    const targetDate = sundayDateStr || formatDateISO(new Date());
    setSelectedSundayDate(targetDate);
    setIsSundayDiagnosticModalOpen(true);
  };

  const handleSaveSundayDiagnostic = (diagnostic: SundayDiagnostic) => {
    setSundayDiagnostics((prev) => ({
      ...prev,
      [diagnostic.date]: diagnostic,
    }));
  };

  // Export / Import / Reset
  const handleExportData = () => {
    const payload = {
      sportMode,
      workoutLogs,
      schedules,
      weeklyGoals,
      monthlyGoals,
      sundayDiagnostics,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `STRIDE_HYBRID_Backup_${formatDateISO(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.sportMode) setSportMode(parsed.sportMode);
        if (parsed.workoutLogs) setWorkoutLogs(parsed.workoutLogs);
        if (parsed.schedules) setSchedules(parsed.schedules);
        if (parsed.weeklyGoals) setWeeklyGoals(parsed.weeklyGoals);
        if (parsed.monthlyGoals) setMonthlyGoals(parsed.monthlyGoals);
        if (parsed.sundayDiagnostics) setSundayDiagnostics(parsed.sundayDiagnostics);
        alert('백업 데이터가 성공적으로 불러와졌습니다!');
      } catch (err) {
        alert('올바른 백업 JSON 파일이 아닙니다.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('캘린더 데이터를 초기화하시겠습니까?')) {
      setWorkoutLogs({});
      setSchedules({});
      setWeeklyGoals({});
      setMonthlyGoals({});
      setSundayDiagnostics({});
      localStorage.clear();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white pb-12">
      {/* Header */}
      <Header
        sportMode={sportMode}
        onChangeSportMode={setSportMode}
        monthlyGoal={monthlyGoals[currentYMStr]}
        currentMonthMileage={currentMonthMileage}
        onOpenMonthlyGoalModal={handleOpenMonthlyGoalModal}
        onOpenWeeklyGoalModal={() => handleOpenWeeklyGoalModal()}
        onOpenSundayDiagnosticModal={() => handleOpenSundayDiagnosticModal()}
        onOpenGoalCelebrationModal={() => setIsGoalCelebrationModalOpen(true)}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onResetData={handleResetData}
      />

      {/* Main Body Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CalendarGrid
          currentYear={currentYear}
          currentMonth={currentMonth}
          onChangeMonth={(y, m) => {
            setCurrentYear(y);
            setCurrentMonth(m);
          }}
          workoutLogs={workoutLogs}
          schedules={schedules}
          weeklyGoals={weeklyGoals}
          onOpenWorkoutModal={handleOpenWorkoutModal}
          onOpenScheduleModal={handleOpenScheduleModal}
          onOpenWeeklyGoalModal={handleOpenWeeklyGoalModal}
          onOpenSundayDiagnosticModal={handleOpenSundayDiagnosticModal}
          onDeleteWorkout={handleDeleteWorkout}
          onDeleteSchedule={handleDeleteSchedule}
        />
      </main>

      {/* Popups & Modals */}
      <WorkoutModal
        isOpen={isWorkoutModalOpen}
        dateString={selectedDateForModal}
        sportMode={sportMode}
        onClose={() => setIsWorkoutModalOpen(false)}
        onSaveRunning={handleSaveRunning}
        onSaveHybrid={handleSaveHybrid}
      />

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        dateString={selectedDateForModal}
        initialSchedule={editingSchedule}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setEditingSchedule(null);
        }}
        onSaveSchedule={handleSaveSchedule}
        onDeleteSchedule={(schId) => handleDeleteSchedule(selectedDateForModal, schId)}
      />

      <WeeklyGoalModal
        isOpen={isWeeklyGoalModalOpen}
        weekStartMonday={selectedWeekStart}
        sportMode={sportMode}
        initialGoal={weeklyGoals[selectedWeekStart]}
        onClose={() => setIsWeeklyGoalModalOpen(false)}
        onSave={handleSaveWeeklyGoal}
      />

      <MonthlyGoalModal
        isOpen={isMonthlyGoalModalOpen}
        yearMonth={selectedYearMonth}
        initialGoal={monthlyGoals[selectedYearMonth]}
        onClose={() => setIsMonthlyGoalModalOpen(false)}
        onSave={handleSaveMonthlyGoal}
      />

      <SundayDiagnosticModal
        isOpen={isSundayDiagnosticModalOpen}
        dateString={selectedSundayDate}
        initialDiagnostic={sundayDiagnostics[selectedSundayDate]}
        onClose={() => setIsSundayDiagnosticModalOpen(false)}
        onSave={handleSaveSundayDiagnostic}
      />

      <GoalAchievementModal
        isOpen={isGoalCelebrationModalOpen}
        currentMileage={currentMonthMileage}
        targetMileage={targetKm}
        yearMonthString={currentYMStr}
        onClose={() => setIsGoalCelebrationModalOpen(false)}
      />
    </div>
  );
}
