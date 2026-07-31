export type RunningPurpose = '조깅' | '템포' | '인터벌' | 'LSD' | '트레일러닝';

export type HybridCategory = 
  | '하이록스 시뮬레이션' 
  | '하이록스 하프 시뮬레이션' 
  | '하이브리드 트레이닝' 
  | '근력 트레이닝 (상체)' 
  | '근력 트레이닝 (하체)' 
  | '근력 트레이닝 (상하체)';

export type SportMode = 'RUNNING' | 'HYBRID';

export interface RunningWorkout {
  id: string;
  distanceKm: number;
  pace: string; // e.g. "04:30" or "4'30""
  purpose: RunningPurpose;
  durationMinutes?: number;
  calories?: number;
  notes?: string;
  elevationGainM?: number; // 트레일러닝 누적 고도 (0m ~ 9999m)
  // Interval specific fields
  intervalType?: string; // e.g. '1000m 인터벌 (VO2max)', '400m 야소 인터벌'
  fastPace?: string; // 질주 페이스 e.g. "03:30"
  recoveryPace?: string; // 회복 페이스 e.g. "05:30"
  intervalSets?: number; // 세트 수 e.g. 8
}

export interface HybridWorkout {
  id: string;
  category: HybridCategory;
  durationMinutes: number;
  rpeStage?: string;
  stationsCompleted?: string[];
  notes?: string;
}

export interface DailyWorkoutLog {
  id: string;
  date: string; // YYYY-MM-DD
  runningWorkouts: RunningWorkout[];
  hybridWorkouts: HybridWorkout[];
  notes?: string;
}

export interface GeneralSchedule {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  time?: string; // e.g. "07:00"
  timeOfDay?: '오전' | '오후' | '종일';
  category: '개인 훈련' | '일반 일정' | '미팅/약속' | '회복/휴식' | '기타';
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  notes?: string;
  completed?: boolean;
}

export interface WeeklyGoal {
  id: string;
  weekStartDate: string; // YYYY-MM-DD (Monday)
  weekNumber: number;
  targetDistanceKm: number;
  targetHours: number;
  targetHybridSessions?: number;
  focusArea: string;
}

export interface MonthlyGoal {
  id: string;
  yearMonth: string; // YYYY-MM
  targetDistanceKm: number;
  targetStrengthHours?: number;
  mainObjective: string;
}

export type ConditionStage = 'STAGE_1_EXCELLENT' | 'STAGE_2_GOOD' | 'STAGE_3_CAUTION' | 'STAGE_4_WARNING';

export interface SundayDiagnostic {
  id: string;
  date: string; // YYYY-MM-DD (Sunday)
  legCondition: string; // e.g. "1단계 (통증 없음 / 가벼움)", "2단계 (약한 피로)", "3단계 (묵직함 / 주의)", "4단계 (통증 / 무거움)"
  aerobicCondition: string; // e.g. "1단계 (상쾌함)", "2단계 (보통)", "3단계 (숨참 / 지침)", "4단계 (방전)"
  sleepQualityStage: string; // e.g. "숙면 (7시간 이상)", "보통 (5-6시간)", "부족 (수면장애)"
  overallStage: ConditionStage;
  selfReflection: string;
  recommendedAction?: string;
}


