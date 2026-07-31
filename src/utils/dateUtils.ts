import { DailyWorkoutLog, WeeklyGoal } from '../types';

export function getDaysInMonth(year: number, month: number) {
  // month is 0-indexed (0 = Jan, 11 = Dec)
  const date = new Date(year, month, 1);
  const days: { date: Date; dateString: string; isCurrentMonth: boolean; dayOfWeek: number }[] = [];

  // Find start day of calendar grid (start from Monday)
  let startDay = date.getDay(); // 0 = Sun, 1 = Mon ...
  // Adjust so Monday is 0, Sunday is 6
  let mondayOffset = startDay === 0 ? 6 : startDay - 1;

  // Add padding days from previous month
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = mondayOffset - 1; i >= 0; i--) {
    const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
    days.push({
      date: prevDate,
      dateString: formatDateISO(prevDate),
      isCurrentMonth: false,
      dayOfWeek: prevDate.getDay(),
    });
  }

  // Add days of current month
  const lastDay = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= lastDay; i++) {
    const currentDate = new Date(year, month, i);
    days.push({
      date: currentDate,
      dateString: formatDateISO(currentDate),
      isCurrentMonth: true,
      dayOfWeek: currentDate.getDay(),
    });
  }

  // Add padding days for next month to complete 7-day grid rows
  const remainingDays = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remainingDays; i++) {
    const nextDate = new Date(year, month + 1, i);
    days.push({
      date: nextDate,
      dateString: formatDateISO(nextDate),
      isCurrentMonth: false,
      dayOfWeek: nextDate.getDay(),
    });
  }

  return days;
}

export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatKoreanDate(dateString: string): string {
  const [y, m, d] = dateString.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dayName = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  return `${m}월 ${d}일 (${dayName})`;
}

export function getMondayOfDate(dateString: string): string {
  const [y, m, d] = dateString.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.getDay(); // 0 is Sun, 1 is Mon
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  return formatDateISO(monday);
}

export function calculateWeeklyStats(
  weekStartMonday: string,
  workoutLogs: Record<string, DailyWorkoutLog>
) {
  // Monday to Sunday (7 days)
  const [y, m, d] = weekStartMonday.split('-').map(Number);
  let totalDistance = 0;
  let runningSessions = 0;
  let hybridSessions = 0;
  let totalDurationMinutes = 0;

  for (let i = 0; i < 7; i++) {
    const curDate = new Date(y, m - 1, d + i);
    const dateStr = formatDateISO(curDate);
    const log = workoutLogs[dateStr];
    if (log) {
      if (log.runningWorkouts) {
        log.runningWorkouts.forEach((rw) => {
          totalDistance += rw.distanceKm || 0;
          runningSessions++;
          if (rw.durationMinutes) totalDurationMinutes += rw.durationMinutes;
        });
      }
      if (log.hybridWorkouts) {
        log.hybridWorkouts.forEach((hw) => {
          hybridSessions++;
          if (hw.durationMinutes) totalDurationMinutes += hw.durationMinutes;
        });
      }
    }
  }

  return {
    totalDistance: Math.round(totalDistance * 10) / 10,
    runningSessions,
    hybridSessions,
    totalDurationHours: Math.round((totalDurationMinutes / 60) * 10) / 10,
  };
}

export function isMonday(dateString: string): boolean {
  const [y, m, d] = dateString.split('-').map(Number);
  return new Date(y, m - 1, d).getDay() === 1;
}

export function isSunday(dateString: string): boolean {
  const [y, m, d] = dateString.split('-').map(Number);
  return new Date(y, m - 1, d).getDay() === 0;
}

export function isFirstDayOfMonth(dateString: string): boolean {
  const [, , d] = dateString.split('-').map(Number);
  return d === 1;
}
