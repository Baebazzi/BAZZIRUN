import React, { useState, useEffect } from 'react';
import { HybridCategory, RunningPurpose, SportMode } from '../types';
import { X, Zap, Dumbbell, Flame, Repeat, Gauge, Calculator, Clock, Trophy, Activity, FileText, Mountain } from 'lucide-react';

interface WorkoutModalProps {
  isOpen: boolean;
  dateString: string;
  sportMode?: SportMode;
  onClose: () => void;
  onSaveRunning: (data: {
    distanceKm: number;
    pace: string;
    purpose: RunningPurpose;
    durationMinutes: number;
    calories?: number;
    notes?: string;
    elevationGainM?: number;
    intervalType?: string;
    fastPace?: string;
    recoveryPace?: string;
    intervalSets?: number;
  }) => void;
  onSaveHybrid: (data: {
    category: HybridCategory;
    durationMinutes: number;
    rpeStage?: string;
    stationsCompleted?: string[];
    notes?: string;
  }) => void;
}

const INTERVAL_TYPES = [
  '300m 인터벌',
  '400m 인터벌',
  '800m 인터벌',
  '1000m 인터벌',
  '2000m 인터벌',
  '3000m 인터벌',
  '3KM TT',
  '5KM TT',
  '10KM TT',
  '변속주',
];

const HYROX_STATION_DEFS = [
  { key: 'skiErg', name: 'SkiErg (스키에르그)', fullDist: '1,000m', halfDist: '500m', icon: '🎿' },
  { key: 'sledPush', name: 'Sled Push (슬레드 푸시)', fullDist: '50m', halfDist: '25m', icon: '🛷' },
  { key: 'sledPull', name: 'Sled Pull (슬레드 풀)', fullDist: '50m', halfDist: '25m', icon: '🏋️' },
  { key: 'burpeeJump', name: 'Burpee Broad Jump (버피점프)', fullDist: '80m', halfDist: '40m', icon: '🤸' },
  { key: 'rowing', name: 'Rowing (로잉)', fullDist: '1,000m', halfDist: '500m', icon: '🚣' },
  { key: 'farmersCarry', name: 'Farmers Carry (파머스 캐리)', fullDist: '200m', halfDist: '100m', icon: '🎒' },
  { key: 'sandbagLunges', name: 'Sandbag Lunges (샌드백 런지)', fullDist: '100m', halfDist: '50m', icon: '🦵' },
  { key: 'wallBalls', name: 'Wall Balls (월볼)', fullDist: '100회', halfDist: '50회', icon: '⚽' },
] as const;

type StationKey = typeof HYROX_STATION_DEFS[number]['key'];

const parsePaceToSec = (paceStr: string): number => {
  const clean = paceStr.replace(/[^0-9:]/g, '');
  const parts = clean.split(':');
  if (parts.length === 2) {
    const m = parseInt(parts[0]) || 0;
    const s = parseInt(parts[1]) || 0;
    return m * 60 + s;
  }
  return 240;
};

const formatSecToPace = (totalSec: number): string => {
  const m = Math.floor(totalSec / 60);
  const s = Math.round(totalSec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const formatSecToKoreanTime = (totalSec: number): string => {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.round(totalSec % 60);
  if (h > 0) {
    return `${h}시간 ${m}분 ${s}초`;
  }
  return `${m}분 ${s}초`;
};

export const WorkoutModal: React.FC<WorkoutModalProps> = ({
  isOpen,
  dateString,
  sportMode = 'RUNNING',
  onClose,
  onSaveRunning,
  onSaveHybrid,
}) => {
  const [activeTab, setActiveTab] = useState<'running' | 'hybrid'>('running');

  useEffect(() => {
    setActiveTab('running');
  }, [sportMode, isOpen]);

  // Running State
  const [distanceKm, setDistanceKm] = useState<string>('10');
  const [pace, setPace] = useState<string>('04:30');
  const [purpose, setPurpose] = useState<RunningPurpose>('조깅');
  const [runningDuration, setRunningDuration] = useState<string>('50');
  const [calories, setCalories] = useState<string>('600');
  const [runningNotes, setRunningNotes] = useState<string>('');

  // Non-interval Dropdowns state for Distance & Time
  const [distKmInt, setDistKmInt] = useState<string>('10');
  const [distKmDec, setDistKmDec] = useState<string>('0');
  const [runHours, setRunHours] = useState<string>('0');
  const [runMinutes, setRunMinutes] = useState<string>('50');
  const [runSeconds, setRunSeconds] = useState<string>('00');

  // Trail Running Elevation Gain state (0m ~ 9999m)
  const [trailElevationM, setTrailElevationM] = useState<string>('300');

  // Interval specific state
  const [intervalType, setIntervalType] = useState<string>(INTERVAL_TYPES[1]); // 400m 인터벌
  const [fastMin, setFastMin] = useState<string>('03');
  const [fastSec, setFastSec] = useState<string>('40');
  const [recoveryMin, setRecoveryMin] = useState<string>('05');
  const [recoverySec, setRecoverySec] = useState<string>('30');
  const [intervalSets, setIntervalSets] = useState<string>('8');
  // Variable speed run (변속주) custom distances (100m ~ 1000m)
  const [varFastDistM, setVarFastDistM] = useState<string>('400');
  const [varRecDistM, setVarRecDistM] = useState<string>('200');

  const fastPace = `${fastMin}:${fastSec}`;
  const recoveryPace = `${recoveryMin}:${recoverySec}`;

  // Hybrid & Strength Sub Mode ('HYBRID_MODE' vs 'STRENGTH_MODE')
  const [strengthOrHybridMode, setStrengthOrHybridMode] = useState<'HYBRID_MODE' | 'STRENGTH_MODE'>('HYBRID_MODE');
  const [hybridCategory, setHybridCategory] = useState<HybridCategory>('하이록스 시뮬레이션');
  const [hybridDuration, setHybridDuration] = useState<string>('60');
  const [intensityLevel, setIntensityLevel] = useState<string>('고강도 운동');
  const [hybridNotes, setHybridNotes] = useState<string>('');

  // Hyrox Simulation Breakdown State
  const [hyroxRuns, setHyroxRuns] = useState<Array<{ min: string; sec: string }>>([
    { min: '04', sec: '30' },
    { min: '04', sec: '35' },
    { min: '04', sec: '40' },
    { min: '04', sec: '45' },
    { min: '04', sec: '50' },
    { min: '05', sec: '00' },
    { min: '05', sec: '05' },
    { min: '05', sec: '10' },
  ]);
  const [hyroxStations, setHyroxStations] = useState<Record<StationKey, { min: string; sec: string }>>({
    skiErg: { min: '04', sec: '15' },
    sledPush: { min: '03', sec: '30' },
    sledPull: { min: '04', sec: '00' },
    burpeeJump: { min: '05', sec: '00' },
    rowing: { min: '04', sec: '30' },
    farmersCarry: { min: '02', sec: '30' },
    sandbagLunges: { min: '04', sec: '45' },
    wallBalls: { min: '05', sec: '15' },
  });

  const isFullSim = hybridCategory === '하이록스 시뮬레이션';
  const isHalfSim = hybridCategory === '하이록스 하프 시뮬레이션';
  const isHyroxSim = isFullSim || isHalfSim;

  // Hyrox calculated times
  const runTotalSec = hyroxRuns.reduce((acc, r) => {
    const m = parseInt(r.min) || 0;
    const s = parseInt(r.sec) || 0;
    return acc + m * 60 + s;
  }, 0);

  const totalRunDistKm = isHalfSim ? 4 : 8;
  const avgRunPaceSecPerKm = runTotalSec > 0 ? runTotalSec / totalRunDistKm : 0;
  const avgRunPaceFormatted = formatSecToPace(avgRunPaceSecPerKm);

  const stationsTotalSec = (Object.values(hyroxStations) as Array<{ min: string; sec: string }>).reduce(
    (acc: number, curr: { min: string; sec: string }) => {
      const m = parseInt(curr.min) || 0;
      const s = parseInt(curr.sec) || 0;
      return acc + m * 60 + s;
    },
    0
  );

  const hyroxGrandTotalSec = runTotalSec + stationsTotalSec;

  useEffect(() => {
    if (isHyroxSim) {
      const totalMinutes = Math.round(hyroxGrandTotalSec / 60);
      setHybridDuration(totalMinutes.toString());
    }
  }, [isHyroxSim, hyroxGrandTotalSec]);

  // Auto calculate average pace for interval training
  useEffect(() => {
    if (purpose === '인터벌') {
      let fastDistM = 400;
      let recoveryDistM = 200;

      if (intervalType === '변속주') {
        fastDistM = parseInt(varFastDistM) || 400;
        recoveryDistM = parseInt(varRecDistM) || 200;
      } else {
        if (intervalType.includes('300m')) fastDistM = 300;
        else if (intervalType.includes('400m')) fastDistM = 400;
        else if (intervalType.includes('800m')) fastDistM = 800;
        else if (intervalType.includes('1000m')) fastDistM = 1000;
        else if (intervalType.includes('2000m')) fastDistM = 2000;
        else if (intervalType.includes('3000m') || intervalType.includes('3KM TT')) fastDistM = 3000;
        else if (intervalType.includes('5KM TT')) fastDistM = 5000;
        else if (intervalType.includes('10KM TT')) fastDistM = 10000;

        recoveryDistM = fastDistM <= 400 ? 200 : Math.round(fastDistM * 0.5);
      }

      const sets = parseInt(intervalSets) || 1;

      const fastSecPerKm = parsePaceToSec(fastPace);
      const recSecPerKm = parsePaceToSec(recoveryPace);

      const fastKm = (fastDistM / 1000) * sets;
      const recKm = (recoveryDistM / 1000) * sets;
      const totalKm = fastKm + recKm;

      const totalFastTimeSec = fastKm * fastSecPerKm;
      const totalRecTimeSec = recKm * recSecPerKm;
      const totalTimeSec = totalFastTimeSec + totalRecTimeSec;

      if (totalKm > 0) {
        const avgPaceSec = totalTimeSec / totalKm;
        const computedPace = formatSecToPace(avgPaceSec);
        setPace(computedPace);
        setDistanceKm((Math.round(totalKm * 10) / 10).toString());
        setRunningDuration(Math.round(totalTimeSec / 60).toString());
      }
    }
  }, [purpose, intervalType, fastPace, recoveryPace, intervalSets, varFastDistM, varRecDistM]);

  // Auto calculate average pace for non-interval running (조깅, 템포, LSD)
  useEffect(() => {
    if (purpose !== '인터벌') {
      const intVal = parseInt(distKmInt) || 0;
      const decVal = parseFloat(distKmDec) || 0;
      const totalDist = intVal + decVal;

      const hrs = parseInt(runHours) || 0;
      const mins = parseInt(runMinutes) || 0;
      const secs = parseInt(runSeconds) || 0;
      const totalSec = hrs * 3600 + mins * 60 + secs;

      if (totalDist > 0 && totalSec > 0) {
        const paceSecPerKm = totalSec / totalDist;
        const computedPace = formatSecToPace(paceSecPerKm);

        setPace(computedPace);
        setDistanceKm((Math.round(totalDist * 1000) / 1000).toString());
        setRunningDuration(Math.round(totalSec / 60).toString());
      }
    }
  }, [purpose, distKmInt, distKmDec, runHours, runMinutes, runSeconds]);

  const handleSelectPurpose = (p: RunningPurpose) => {
    setPurpose(p);
    if (p === 'LSD') {
      if (parseInt(distKmInt) < 20) {
        setDistKmInt('20');
        setDistKmDec('0');
        setRunHours('1');
        setRunMinutes('50');
        setRunSeconds('00');
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmitRunning = (e: React.FormEvent) => {
    e.preventDefault();
    const distNum = parseFloat(distanceKm);
    if (isNaN(distNum) || distNum <= 0) {
      alert('올바른 달리기 거리를 입력해주세요 (예: 10.5)');
      return;
    }

    const totalElevationM = Math.min(9999, Math.max(0, parseInt(trailElevationM) || 0));

    onSaveRunning({
      distanceKm: distNum,
      pace: pace.trim() || '04:30',
      purpose,
      durationMinutes: parseInt(runningDuration) || 0,
      calories: parseInt(calories) || undefined,
      notes: runningNotes,
      elevationGainM: purpose === '트레일러닝' ? totalElevationM : undefined,
      ...(purpose === '인터벌'
        ? {
            intervalType,
            fastPace,
            recoveryPace,
            intervalSets: parseInt(intervalSets) || 1,
          }
        : {}),
    });
    onClose();
  };

  const handleSubmitHybrid = (e: React.FormEvent) => {
    e.preventDefault();

    let formattedNotes = hybridNotes;
    let stationLogsList: string[] = [];

    if (isHyroxSim) {
      const runTotalFormatted = formatSecToKoreanTime(runTotalSec);
      const stationsTotalFormatted = formatSecToKoreanTime(stationsTotalSec);
      const grandTotalFormatted = formatSecToKoreanTime(hyroxGrandTotalSec);

      const title = isHalfSim ? '[하이록스 하프 시뮬레이션]' : '[하이록스 시뮬레이션]';
      const detailHeader = `⏱️ 전체: ${grandTotalFormatted} (런합계: ${runTotalFormatted}, 평균: ${avgRunPaceFormatted}/km | 스테이션합계: ${stationsTotalFormatted})`;

      const runLogsList = hyroxRuns.map((r, i) => `Run ${i + 1} (${isHalfSim ? '500m' : '1km'}): ${r.min}분 ${r.sec}초`);
      stationLogsList = HYROX_STATION_DEFS.map((st) => {
        const dist = isHalfSim ? st.halfDist : st.fullDist;
        const val = hyroxStations[st.key];
        return `${st.name} (${dist}): ${val.min}분 ${val.sec}초`;
      });

      formattedNotes = `${title}\n${detailHeader}\n\n[런 구간 기록]\n${runLogsList.join(', ')}\n\n[스테이션 기록]\n${stationLogsList.join('\n')}\n${hybridNotes ? `\n메모: ${hybridNotes}` : ''}`.trim();
    }

    onSaveHybrid({
      category: hybridCategory,
      durationMinutes: parseInt(hybridDuration) || 0,
      rpeStage: strengthOrHybridMode === 'STRENGTH_MODE' ? undefined : intensityLevel,
      stationsCompleted: stationLogsList.length > 0 ? stationLogsList : undefined,
      notes: formattedNotes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
          <div>
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
              WORKOUT RECORD
            </span>
            <h3 className="text-lg font-black font-sans mt-0.5">
              오늘의 훈련 기재 <span className="text-slate-300 font-normal">({dateString})</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector (Shown in HYBRID mode) */}
        {sportMode === 'HYBRID' && (
          <div className="p-3 bg-slate-100 border-b border-slate-200 flex space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab('running')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center space-x-2 ${
                activeTab === 'running'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Zap className="w-4 h-4 text-sky-400" />
              <span>러닝 훈련</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('hybrid')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center space-x-2 ${
                activeTab === 'hybrid'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>근력 / 하이브리드</span>
            </button>
          </div>
        )}

        {/* Modal Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/50">
          {activeTab === 'running' ? (
            <form onSubmit={handleSubmitRunning} className="space-y-5">
              {/* 훈련 목적 선택 */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-2">
                  훈련 목적 선택 *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(['조깅', '템포', '인터벌', 'LSD', '트레일러닝'] as RunningPurpose[]).map((p) => {
                    const isSelected = purpose === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleSelectPurpose(p)}
                        className={`py-2.5 rounded-xl text-xs font-extrabold transition border flex items-center justify-center space-x-1 ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p === '트레일러닝' && <Mountain className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{p}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trail Running Elevation Gain Section */}
              {purpose === '트레일러닝' && (
                <div className="p-4 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 border border-emerald-200/90 rounded-2xl space-y-3 shadow-xs animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-emerald-950 flex items-center space-x-1.5">
                      <Mountain className="w-4 h-4 text-emerald-600" />
                      <span>트레일러닝 누적고도 (Elevation Gain D+)</span>
                    </label>
                    <span className="text-xs font-mono font-black text-emerald-900 bg-emerald-100/90 border border-emerald-300/80 px-2.5 py-1 rounded-xl shadow-2xs">
                      D+ {trailElevationM || 0}m
                    </span>
                  </div>

                  {/* Single Elevation Selector */}
                  <div className="flex items-center space-x-2 pt-1">
                    <div className="flex-1 bg-white p-2 rounded-xl border border-emerald-200/90 shadow-2xs">
                      <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-tight mb-1">
                        고도 드롭다운 선택
                      </label>
                      <select
                        value={trailElevationM}
                        onChange={(e) => setTrailElevationM(e.target.value)}
                        className="w-full bg-emerald-50/40 border border-emerald-200/90 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs cursor-pointer"
                      >
                        {Array.from({ length: 100 }, (_, i) => i * 100).map((h) => (
                          <option key={h} value={h.toString()}>
                            {h}m
                          </option>
                        ))}
                        <option value="9999">9999m (최대)</option>
                      </select>
                    </div>

                    <div className="w-32 bg-white p-2 rounded-xl border border-emerald-200/90 shadow-2xs">
                      <label className="block text-[10px] font-black text-emerald-900 uppercase tracking-tight mb-1">
                        직접 입력 (m)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="9999"
                        value={trailElevationM}
                        onChange={(e) => {
                          const val = Math.min(9999, Math.max(0, parseInt(e.target.value) || 0));
                          setTrailElevationM(val.toString());
                        }}
                        className="w-full bg-emerald-50/40 border border-emerald-200/90 rounded-lg px-2 py-1 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Cute LSD Banner */}
              {purpose === 'LSD' && (
                <div className="p-3.5 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 border border-amber-300/80 rounded-2xl flex items-center justify-between shadow-xs animate-fadeIn">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">😜</span>
                    <span className="text-xs font-black text-amber-950">
                      20키로 미만을 적으실건 아니죠? 메롱~
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-extrabold text-amber-800 bg-amber-200/80 border border-amber-300 px-2 py-0.5 rounded-lg">
                    LSD (Long Slow Distance)
                  </span>
                </div>
              )}

              {/* Non-Interval Distance & Time Dropdowns Calculator Section */}
              {purpose !== '인터벌' && (
                <div className="p-4 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border border-slate-200 rounded-2xl space-y-4 shadow-xs animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-800 flex items-center space-x-1.5">
                      <Calculator className="w-4 h-4 text-blue-600" />
                      <span>거리 및 시간 선택</span>
                    </label>
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg">
                      자동 페이스 계산기
                    </span>
                  </div>

                  {/* Distance Select */}
                  <div>
                    <div className="mb-1.5">
                      <span className="text-[11px] font-extrabold text-slate-700">🏃 거리 (Distance)</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <select
                          value={distKmInt}
                          onChange={(e) => setDistKmInt(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                        >
                          {Array.from({ length: 500 }, (_, i) => i + 1).map((k) => (
                            <option key={k} value={k.toString()}>
                              {k}km
                            </option>
                          ))}
                        </select>
                      </div>

                      <span className="text-slate-400 font-bold text-xs">+</span>

                      <div className="flex-1">
                        <select
                          value={distKmDec}
                          onChange={(e) => setDistKmDec(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                        >
                          <option value="0">.0 (0m)</option>
                          <option value="0.1">.1 (100m)</option>
                          <option value="0.2">.2 (200m)</option>
                          <option value="0.3">.3 (300m)</option>
                          <option value="0.4">.4 (400m)</option>
                          <option value="0.5">.5 (500m)</option>
                          <option value="0.6">.6 (600m)</option>
                          <option value="0.7">.7 (700m)</option>
                          <option value="0.8">.8 (800m)</option>
                          <option value="0.9">.9 (900m)</option>
                          <option value="0.0975">.0975 (21.0975km 하프)</option>
                          <option value="0.195">.195 (42.195km 풀)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Time Select */}
                  <div>
                    <span className="block text-[11px] font-extrabold text-slate-700 mb-1.5">⏱️ 시간 (Duration)</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <select
                          value={runHours}
                          onChange={(e) => setRunHours(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                        >
                          {Array.from({ length: 10 }, (_, i) => i).map((h) => (
                            <option key={h} value={h.toString()}>
                              {h}시간
                            </option>
                          ))}
                        </select>
                      </div>
                      <span className="text-slate-400 font-bold text-xs">:</span>

                      <div className="flex-1">
                        <select
                          value={runMinutes}
                          onChange={(e) => setRunMinutes(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                        >
                          {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map((m) => (
                            <option key={m} value={m}>
                              {parseInt(m)}분
                            </option>
                          ))}
                        </select>
                      </div>
                      <span className="text-slate-400 font-bold text-xs">:</span>

                      <div className="flex-1">
                        <select
                          value={runSeconds}
                          onChange={(e) => setRunSeconds(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                        >
                          {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map((s) => (
                            <option key={s} value={s}>
                              {s}초
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Computed Average Pace Banner */}
                  <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs font-bold shadow-md">
                    <span className="flex items-center space-x-1.5 text-blue-300">
                      <Zap className="w-4 h-4 text-blue-400 fill-blue-400/20" />
                      <span>자동 계산된 평균 페이스:</span>
                    </span>
                    <span className="text-base font-mono font-black text-blue-200">
                      {pace}/km <span className="text-xs text-slate-300 font-normal">({distanceKm}km / {runningDuration}분)</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Special Interval Calculator Section */}
              {purpose === '인터벌' && (
                <div className="p-4 bg-gradient-to-br from-sky-50 via-white to-blue-50 border border-sky-200 rounded-2xl space-y-4 shadow-sm animate-fadeIn">
                  <div className="flex items-center justify-between text-sky-800 text-xs font-extrabold uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-rose-600" />
                      <span>인터벌 유형 및 자동 페이스 계산기</span>
                    </div>
                    <span className="text-[10px] bg-sky-200/80 text-sky-900 px-2 py-0.5 rounded-lg font-mono font-bold">
                      AUTO CALCULATED
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                      인터벌 종류 (Interval Type)
                    </label>
                    <select
                      value={intervalType}
                      onChange={(e) => setIntervalType(e.target.value)}
                      className="w-full bg-white border border-sky-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs"
                    >
                      {INTERVAL_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Variable Speed Run (변속주) Custom Distance Selection */}
                  {intervalType === '변속주' && (
                    <div className="p-3.5 bg-indigo-50/80 border border-indigo-200/80 rounded-xl space-y-3 animate-fadeIn">
                      <div className="text-[11px] font-extrabold text-indigo-950 flex items-center justify-between">
                        <span>⚡ 변속주 세부 거리 선택</span>
                        <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md font-mono font-bold">100m ~ 1000m 선택</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-rose-800 mb-1">
                            🏃 질주 거리 (Fast Dist)
                          </label>
                          <select
                            value={varFastDistM}
                            onChange={(e) => setVarFastDistM(e.target.value)}
                            className="w-full bg-white border border-rose-200 rounded-xl px-2.5 py-2 text-slate-900 font-mono text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-2xs"
                          >
                            {Array.from({ length: 10 }, (_, i) => (i + 1) * 100).map((dist) => (
                              <option key={dist} value={dist.toString()}>
                                {dist}m
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-emerald-800 mb-1">
                            🚶 회복 거리 (Recovery Dist)
                          </label>
                          <select
                            value={varRecDistM}
                            onChange={(e) => setVarRecDistM(e.target.value)}
                            className="w-full bg-white border border-emerald-200 rounded-xl px-2.5 py-2 text-slate-900 font-mono text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                          >
                            {Array.from({ length: 10 }, (_, i) => (i + 1) * 100).map((dist) => (
                              <option key={dist} value={dist.toString()}>
                                {dist}m
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fast Pace vs Recovery Pace vs Sets */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-rose-700 mb-1 flex items-center space-x-1">
                        <Gauge className="w-3 h-3 text-rose-600" />
                        <span>질주 페이스</span>
                      </label>
                      <div className="flex items-center space-x-1">
                        <select
                          value={fastMin}
                          onChange={(e) => setFastMin(e.target.value)}
                          className="w-1/2 bg-white border border-rose-200 rounded-xl px-1.5 py-2 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-xs"
                        >
                          {['02', '03', '04', '05', '06', '07', '08', '09', '10'].map((m) => (
                            <option key={m} value={m}>
                              {parseInt(m)}분
                            </option>
                          ))}
                        </select>
                        <span className="text-slate-400 font-bold text-xs">:</span>
                        <select
                          value={fastSec}
                          onChange={(e) => setFastSec(e.target.value)}
                          className="w-1/2 bg-white border border-rose-200 rounded-xl px-1.5 py-2 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-xs"
                        >
                          {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map((s) => (
                            <option key={s} value={s}>
                              {s}초
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-emerald-700 mb-1 flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-emerald-600" />
                        <span>회복 페이스</span>
                      </label>
                      <div className="flex items-center space-x-1">
                        <select
                          value={recoveryMin}
                          onChange={(e) => setRecoveryMin(e.target.value)}
                          className="w-1/2 bg-white border border-emerald-200 rounded-xl px-1.5 py-2 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-xs"
                        >
                          {['02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => (
                            <option key={m} value={m}>
                              {parseInt(m)}분
                            </option>
                          ))}
                        </select>
                        <span className="text-slate-400 font-bold text-xs">:</span>
                        <select
                          value={recoverySec}
                          onChange={(e) => setRecoverySec(e.target.value)}
                          className="w-1/2 bg-white border border-emerald-200 rounded-xl px-1.5 py-2 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-xs"
                        >
                          {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map((s) => (
                            <option key={s} value={s}>
                              {s}초
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-amber-700 mb-1 flex items-center space-x-1">
                        <Repeat className="w-3 h-3 text-amber-600" />
                        <span>세트 수</span>
                      </label>
                      <select
                        value={intervalSets}
                        onChange={(e) => setIntervalSets(e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl px-2 py-2 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-xs"
                      >
                        {Array.from({ length: 40 }, (_, i) => i + 1).map((s) => (
                          <option key={s} value={s}>
                            {s}세트
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Computed Average Pace Banner */}
                  <div className="p-3 bg-sky-900 text-white rounded-xl flex items-center justify-between text-xs font-bold shadow-md">
                    <span className="flex items-center space-x-1.5 text-sky-300">
                      <Calculator className="w-4 h-4 text-sky-400" />
                      <span>계산된 평균 페이스:</span>
                    </span>
                    <span className="text-base font-mono font-black text-sky-200">
                      {pace}/km <span className="text-xs text-slate-300 font-normal">({distanceKm}km / {runningDuration}분)</span>
                    </span>
                  </div>
                </div>
              )}

              {/* 훈련일지 (메모) 빈 메모칸 */}
              <div className="pt-2">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>훈련일지 (메모)</span>
                </label>
                <textarea
                  value={runningNotes}
                  onChange={(e) => setRunningNotes(e.target.value)}
                  placeholder="오늘의 훈련 소감, 심박수, 피로도, 기상 상태, 착화감 등을 자유롭게 기록하세요..."
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-extrabold text-sm shadow-md hover:brightness-110 transition flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4 text-sky-400" />
                  <span>달리기 훈련 저장하기</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmitHybrid} className="space-y-5">
              {/* Strength vs Hybrid Sub mode selector */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-2">
                  훈련 종목 분류 선택 *
                </label>
                <div className="grid grid-cols-2 gap-3 p-1 bg-slate-200/60 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setStrengthOrHybridMode('HYBRID_MODE');
                      setHybridCategory('하이록스 시뮬레이션');
                    }}
                    className={`py-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center space-x-1.5 ${
                      strengthOrHybridMode === 'HYBRID_MODE'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Dumbbell className="w-4 h-4" />
                    <span>하이브리드 훈련</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStrengthOrHybridMode('STRENGTH_MODE');
                      setHybridCategory('근력 트레이닝 (상체)');
                    }}
                    className={`py-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center space-x-1.5 ${
                      strengthOrHybridMode === 'STRENGTH_MODE'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Dumbbell className="w-4 h-4 text-amber-400" />
                    <span>근력 트레이닝</span>
                  </button>
                </div>
              </div>

              {/* Hybrid or Strength Dropdown Category Selector */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-2">
                  {strengthOrHybridMode === 'HYBRID_MODE' ? '하이브리드 카테고리 선택' : '근력 트레이닝 부위 선택'}
                </label>
                {strengthOrHybridMode === 'HYBRID_MODE' ? (
                  <select
                    value={hybridCategory}
                    onChange={(e) => setHybridCategory(e.target.value as HybridCategory)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  >
                    <option value="하이록스 시뮬레이션">🏃‍♂️ 하이록스 시뮬레이션 (풀 8구간/8스테이션)</option>
                    <option value="하이록스 하프 시뮬레이션">⚡ 하이록스 하프 시뮬레이션 (하프 4구간/하프거리)</option>
                    <option value="하이브리드 트레이닝">🔥 하이브리드 일반 트레이닝</option>
                  </select>
                ) : (
                  <select
                    value={hybridCategory}
                    onChange={(e) => setHybridCategory(e.target.value as HybridCategory)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                  >
                    <option value="근력 트레이닝 (상체)">💪 근력 트레이닝 (상체)</option>
                    <option value="근력 트레이닝 (하체)">🦵 근력 트레이닝 (하체)</option>
                    <option value="근력 트레이닝 (상하체)">🏋️‍♂️ 근력 트레이닝 (상하체)</option>
                  </select>
                )}
              </div>

              {/* Hyrox Simulation Station Breakdown Inputs */}
              {strengthOrHybridMode === 'HYBRID_MODE' && isHyroxSim && (
                <div className="p-4 bg-gradient-to-br from-indigo-50 via-white to-blue-50 border border-indigo-200 rounded-2xl space-y-4 shadow-sm animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                    <div className="flex items-center space-x-2 text-indigo-900 font-extrabold text-xs">
                      <Trophy className="w-4 h-4 text-indigo-600" />
                      <span>{isHalfSim ? '하이록스 하프 시뮬레이션 상세 기록' : '하이록스 풀 시뮬레이션 상세 기록'}</span>
                    </div>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-lg">
                      {isHalfSim ? '총 4km 런 + 하프 스테이션' : '총 8km 런 + 풀 스테이션'}
                    </span>
                  </div>

                  {/* 1. 8 Run Legs Breakdown Input Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-extrabold text-slate-800 flex items-center space-x-1.5">
                        <Activity className="w-3.5 h-3.5 text-blue-600" />
                        <span>8개 런(Run) 개별 구간 소요시간</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const firstRun = hyroxRuns[0] || { min: '04', sec: '30' };
                          setHyroxRuns(Array(8).fill({ min: firstRun.min, sec: firstRun.sec }));
                        }}
                        className="text-[10px] font-extrabold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-lg transition"
                      >
                        ⚡ Run 1 페이스 전체 적용
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {hyroxRuns.map((r, idx) => (
                        <div key={idx} className="p-2 bg-white border border-slate-200 rounded-xl shadow-2xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-extrabold text-slate-800 font-mono">
                              RUN {idx + 1}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-400">
                              {isHalfSim ? '500m' : '1km'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <select
                              value={r.min}
                              onChange={(e) => {
                                const newRuns = [...hyroxRuns];
                                newRuns[idx] = { ...newRuns[idx], min: e.target.value };
                                setHyroxRuns(newRuns);
                              }}
                              className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-400"
                            >
                              {Array.from({ length: 20 }, (_, i) => String(i).padStart(2, '0')).map((m) => (
                                <option key={m} value={m}>
                                  {parseInt(m)}분
                                </option>
                              ))}
                            </select>
                            <span className="text-slate-300 font-bold text-xs">:</span>
                            <select
                              value={r.sec}
                              onChange={(e) => {
                                const newRuns = [...hyroxRuns];
                                newRuns[idx] = { ...newRuns[idx], sec: e.target.value };
                                setHyroxRuns(newRuns);
                              }}
                              className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-400"
                            >
                              {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map((s) => (
                                <option key={s} value={s}>
                                  {s}초
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 8 Stations Input Grid */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-2">
                      8개 스테이션 개별 소요 시간
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {HYROX_STATION_DEFS.map((st) => {
                        const dist = isHalfSim ? st.halfDist : st.fullDist;
                        const currVal = hyroxStations[st.key];
                        return (
                          <div key={st.key} className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-extrabold text-slate-800 truncate">
                                {st.icon} {st.name.split(' ')[0]}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                                {dist}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <select
                                value={currVal.min}
                                onChange={(e) =>
                                  setHyroxStations((prev) => ({
                                    ...prev,
                                    [st.key]: { ...prev[st.key], min: e.target.value },
                                  }))
                                }
                                className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-400"
                              >
                                {Array.from({ length: 31 }, (_, i) => String(i).padStart(2, '0')).map((m) => (
                                  <option key={m} value={m}>
                                    {parseInt(m)}분
                                  </option>
                                ))}
                              </select>
                              <span className="text-slate-300 font-bold text-xs">:</span>
                              <select
                                value={currVal.sec}
                                onChange={(e) =>
                                  setHyroxStations((prev) => ({
                                    ...prev,
                                    [st.key]: { ...prev[st.key], sec: e.target.value },
                                  }))
                                }
                                className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-400"
                              >
                                {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map((s) => (
                                  <option key={s} value={s}>
                                    {s}초
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Calculated Totals Summary Box */}
                  <div className="p-3.5 bg-slate-900 text-white rounded-2xl space-y-2 shadow-md">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold">🏃 런 총합 시간:</span>
                      <span className="font-mono font-extrabold text-sky-300">
                        {formatSecToKoreanTime(runTotalSec)} ({isHalfSim ? '총 4km' : '총 8km'})
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold">📊 런 평균 페이스:</span>
                      <span className="font-mono font-extrabold text-emerald-300">
                        {avgRunPaceFormatted}/km
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold">🏋️ 스테이션 총합 시간:</span>
                      <span className="font-mono font-extrabold text-amber-300">
                        {formatSecToKoreanTime(stationsTotalSec)}
                      </span>
                    </div>
                    <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-300 uppercase flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>시뮬레이션 전체 기록:</span>
                      </span>
                      <span className="text-sm font-mono font-black text-emerald-400">
                        {formatSecToKoreanTime(hyroxGrandTotalSec)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Duration & Intensity Level */}
              <div className={`grid ${strengthOrHybridMode === 'HYBRID_MODE' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1.5">
                    총 소요 시간 (Minutes)
                  </label>
                  <input
                    type="number"
                    value={hybridDuration}
                    onChange={(e) => setHybridDuration(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                  />
                </div>

                {/* In Hybrid mode: Show High / Medium / Low Intensity */}
                {strengthOrHybridMode === 'HYBRID_MODE' && (
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1.5">
                      운동 강도 선택
                    </label>
                    <select
                      value={intensityLevel}
                      onChange={(e) => setIntensityLevel(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                    >
                      <option value="고강도 운동">🔥 고강도 운동</option>
                      <option value="중강도 운동">⚡ 중강도 운동</option>
                      <option value="저강도 운동">🌿 저강도 운동</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1.5">
                  세부 메모
                </label>
                <textarea
                  value={hybridNotes}
                  onChange={(e) => setHybridNotes(e.target.value)}
                  placeholder="세트 수, 무게, 수행 항목 등 메모..."
                  rows={2}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-md hover:brightness-110 transition flex items-center justify-center space-x-2"
                >
                  <Dumbbell className="w-4 h-4" />
                  <span>근력 / 하이브리드 훈련 저장</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
