import React, { useState } from 'react';
import { ConditionStage, SundayDiagnostic } from '../types';
import { X, Activity, CheckCircle2, ShieldAlert, Sparkles, FileText } from 'lucide-react';

interface SundayDiagnosticModalProps {
  isOpen: boolean;
  dateString: string;
  initialDiagnostic?: SundayDiagnostic;
  onClose: () => void;
  onSave: (diagnostic: SundayDiagnostic) => void;
}

export const SundayDiagnosticModal: React.FC<SundayDiagnosticModalProps> = ({
  isOpen,
  dateString,
  initialDiagnostic,
  onClose,
  onSave,
}) => {
  const [overallStage, setOverallStage] = useState<ConditionStage>(
    initialDiagnostic?.overallStage || 'STAGE_1_EXCELLENT'
  );
  const [selfReflection, setSelfReflection] = useState<string>(
    initialDiagnostic?.selfReflection || '이번 주 계획한 러닝목표 완수! 컨디션 상 유지 중.'
  );

  if (!isOpen) return null;

  const isConditionBad = overallStage === 'STAGE_3_CAUTION' || overallStage === 'STAGE_4_WARNING';

  const adviceMessage = isConditionBad
    ? '🛑 피로와 누적 지침이 감지되었습니다! 다음 주 트레이닝은 조급해하지 말고 회복 조깅과 휴식으로 몸을 정비하세요. 쉬어가는 것도 훈련입니다! 🧘‍♂️'
    : '🔥 현재 컨디션이 매우 양호합니다! 다음 주도 목표를 향해 활기차고 멋지게 달려봐요. 화이팅! 🏃‍♂️💨';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialDiagnostic?.id || `sd-${dateString}`,
      date: dateString,
      legCondition: '컨디션 체크',
      aerobicCondition: '컨디션 체크',
      sleepQualityStage: '컨디션 체크',
      overallStage,
      selfReflection,
      recommendedAction: adviceMessage,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 border border-rose-400/30 text-rose-300">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest">
                SUNDAY DIAGNOSTIC
              </span>
              <h3 className="text-lg font-black font-sans mt-0.5">
                일요일 자가진단 체크 <span className="text-slate-300 font-normal">({dateString})</span>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto bg-slate-50/50">
          {/* Dynamic Advice & Motivation Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-start space-x-3 ${
              isConditionBad
                ? 'bg-amber-50 border-amber-200 text-amber-900 shadow-xs'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-xs'
            }`}
          >
            {isConditionBad ? (
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-xs font-extrabold uppercase mb-1">
                {isConditionBad ? '다음 주 컨디셔닝 피드백 (쉬어가기)' : '다음 주 동기부여 피드백 (화이팅!)'}
              </div>
              <p className="text-xs font-bold leading-relaxed">{adviceMessage}</p>
            </div>
          </div>

          {/* Condition Level Stage Selector */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase mb-2">
              컨디션 단계 선택 *
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { key: 'STAGE_1_EXCELLENT', label: '1단계: 컨디션 상', sub: '에너지 충만, 가벼움' },
                { key: 'STAGE_2_GOOD', label: '2단계: 컨디션 중', sub: '훈련 적절, 무리없음' },
                { key: 'STAGE_3_CAUTION', label: '3단계: 컨디션 하', sub: '피로 누적, 하체 묵직' },
                { key: 'STAGE_4_WARNING', label: '4단계: 컨디션 최하', sub: '지침, 휴식 필요' },
              ].map((st) => (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => setOverallStage(st.key as ConditionStage)}
                  className={`p-3.5 rounded-2xl border text-left transition ${
                    overallStage === st.key
                      ? st.key.includes('1') || st.key.includes('2')
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
                        : 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-500/30'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/80 shadow-2xs'
                  }`}
                >
                  <div className="text-xs font-extrabold">{st.label}</div>
                  <div
                    className={`text-[10px] mt-0.5 font-medium ${
                      overallStage === st.key ? 'text-white/80' : 'text-slate-500'
                    }`}
                  >
                    {st.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Self Reflection / Memo */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase mb-1.5 flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-rose-600" />
              <span>자가진단 메모</span>
            </label>
            <textarea
              value={selfReflection}
              onChange={(e) => setSelfReflection(e.target.value)}
              placeholder="주간 목표 달성 소감 및 몸 상태 메모..."
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-2xs resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white font-extrabold text-sm shadow-md hover:brightness-110 transition flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>진단 결과 저장하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
