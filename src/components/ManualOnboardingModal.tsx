import React, { useState } from 'react';
import {
  X,
  User,
  Zap,
  BookOpen,
  Smartphone,
  CheckCircle2,
  Share2,
  MoreVertical,
  PlusSquare,
  Sparkles,
  Calendar as CalendarIcon,
  Activity,
  Trophy,
  Download,
} from 'lucide-react';

interface ManualOnboardingModalProps {
  isOpen: boolean;
  userName: string;
  onSaveUserName: (name: string) => void;
  onClose: () => void;
  isFirstVisit: boolean;
}

export const ManualOnboardingModal: React.FC<ManualOnboardingModalProps> = ({
  isOpen,
  userName,
  onSaveUserName,
  onClose,
  isFirstVisit,
}) => {
  const [activeTab, setActiveTab] = useState<'app_guide' | 'pwa_guide'>('pwa_guide');
  const [inputName, setInputName] = useState<string>(userName || '');
  const [deviceTab, setDeviceTab] = useState<'ios' | 'android'>('ios');

  if (!isOpen) return null;

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = inputName.trim() || '러너';
    onSaveUserName(finalName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Top Gradient Header */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition active:scale-95"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
              <Zap className="w-6 h-6 fill-sky-400/20" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-black text-sky-400 uppercase tracking-wider bg-sky-950/80 px-2.5 py-0.5 rounded-md border border-sky-800">
                {isFirstVisit ? 'WELCOME RUNNER' : 'USER MANUAL & GUIDE'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                {isFirstVisit ? '러너 등록 & 캘린더 안내' : '앱 사용 설명서 & 바로가기'}
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            나만의 프리미엄 러닝 스케줄을 만들고 스마트폰 홈 화면에 바로가기 앱 아이콘을 추가해보세요.
          </p>
        </div>

        {/* Modal Main Scroll Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* 1. User Name Registration Section */}
          <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-slate-50 p-4 rounded-2xl border border-sky-200/80 shadow-xs space-y-2">
            <label className="block text-xs font-black text-slate-800 flex items-center space-x-1.5">
              <User className="w-4 h-4 text-sky-600" />
              <span>러너 이름 (상단 표기명) *</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="이름 또는 닉네임을 입력하세요 (예: 홍길동, 엘리우드)"
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-2xs"
                maxLength={15}
              />
              <button
                type="button"
                onClick={() => {
                  if (inputName.trim()) {
                    onSaveUserName(inputName.trim());
                  }
                }}
                className="px-4 py-2.5 bg-slate-900 hover:bg-sky-600 text-white font-extrabold text-xs rounded-xl transition shadow-xs shrink-0"
              >
                저장
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">
              * 입력한 이름은 상단 헤더에 &quot;<span className="text-sky-600 font-bold">{inputName || '러너'}</span> 님의 러닝 & 스케쥴 달력&quot;으로 표기됩니다.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('pwa_guide')}
              className={`pb-3 px-4 text-xs sm:text-sm font-black border-b-2 transition flex items-center space-x-2 ${
                activeTab === 'pwa_guide'
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>📱 홈 화면에 바로가기 앱 만들기</span>
            </button>
            <button
              onClick={() => setActiveTab('app_guide')}
              className={`pb-3 px-4 text-xs sm:text-sm font-black border-b-2 transition flex items-center space-x-2 ${
                activeTab === 'app_guide'
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>📖 주요 기능 사용 설명서</span>
            </button>
          </div>

          {/* TAB 1: PWA Home Screen Installation Guide */}
          {activeTab === 'pwa_guide' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">
                  모바일 브라우저에서 아래 순서대로 실행하면 앱처럼 설치됩니다:
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setDeviceTab('ios')}
                    className={`px-3 py-1 rounded-xl text-xs font-extrabold transition ${
                      deviceTab === 'ios'
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    🍎 iPhone (iOS)
                  </button>
                  <button
                    onClick={() => setDeviceTab('android')}
                    className={`px-3 py-1 rounded-xl text-xs font-extrabold transition ${
                      deviceTab === 'android'
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    🤖 Android (Galaxy)
                  </button>
                </div>
              </div>

              {/* iOS Guide */}
              {deviceTab === 'ios' && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-900 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    <span>아이폰 Safari 브라우저에서 바로가기 추가하기</span>
                  </h4>
                  <ol className="space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-start space-x-2.5 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <div>
                        <span className="font-bold text-slate-900">공유 버튼 클릭</span>
                        <p className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1">
                          Safari 하단 중앙의 <Share2 className="w-3.5 h-3.5 text-sky-600 inline" /> (네모 화살표) 아이콘을 터치합니다.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2.5 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <div>
                        <span className="font-bold text-slate-900">&apos;홈 화면에 추가&apos; 메뉴 선택</span>
                        <p className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1">
                          공유 메뉴를 아래로 스크롤하여 <PlusSquare className="w-3.5 h-3.5 text-slate-700 inline" /> <strong>&apos;홈 화면에 추가&apos;</strong> 메뉴를 누릅니다.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2.5 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <div>
                        <span className="font-bold text-slate-900">우측 상단 &apos;추가&apos; 완료</span>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          바탕화면에 나만의 전용 러닝 달력 앱 아이콘이 생성되어 클릭 시 전체화면으로 실행됩니다!
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>
              )}

              {/* Android Guide */}
              {deviceTab === 'android' && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-900 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>안드로이드 Chrome 브라우저에서 바로가기 추가하기</span>
                  </h4>
                  <ol className="space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-start space-x-2.5 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <div>
                        <span className="font-bold text-slate-900">Chrome 메뉴 버튼 클릭</span>
                        <p className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1">
                          Chrome 브라우저 우측 상단 <MoreVertical className="w-3.5 h-3.5 text-slate-700 inline" /> (점 3개) 메뉴를 터치합니다.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2.5 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <div>
                        <span className="font-bold text-slate-900">&apos;홈 화면에 추가&apos; 또는 &apos;앱 설치&apos; 선택</span>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          목록에서 <strong>&apos;홈 화면에 추가&apos;</strong> 또는 <strong>&apos;앱 설치&apos;</strong> 옵션을 선택합니다.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2.5 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <div>
                        <span className="font-bold text-slate-900">추가 확인</span>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          스마트폰 바탕화면에 등록된 아이콘으로 바로 접근 가능합니다!
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: App Feature Guide */}
          {activeTab === 'app_guide' && (
            <div className="space-y-3.5 text-xs text-slate-700 animate-fadeIn">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-slate-900 text-white shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">1. 오늘의 훈련 기록하기 (+훈련)</h4>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    날짜 상단의 <span className="font-bold text-slate-900">[+훈련]</span> 버튼을 눌러 조깅, 템포, 인터벌, LSD, 트레일러닝(누적고도 D+), 근력/하이브리드 세션을 기록하세요. (거리 최대 500km 지정 가능)
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-300 shrink-0 mt-0.5">
                  <CalendarIcon className="w-4 h-4 text-slate-700" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">2. 개인 및 스케줄 등록 (+일정)</h4>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    날짜 상단의 <span className="font-bold text-slate-700">[+일정]</span> 버튼으로 러닝 대회, 개인 약속, 휴무일 등의 일반 일정을 손쉽게 관리할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-sky-100 text-sky-800 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">3. 주간 & 월간 목표 달성 및 폭죽 이벤트</h4>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    상단 이번 달 목표 마일리지(예: 200km)를 달성하는 순간, 화면 전체에 폭죽 애니메이션이 터지며 축하 메시지 팝업이 나타납니다!
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-800 shrink-0 mt-0.5">
                  <Activity className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">4. 일요일 부상 예방 자가진단</h4>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    매주 일요일 자가진단 배지를 클릭하여 아킬레스건, 무릎, 발바닥 피로도를 점검하고 다음 주 한 주를 준비하세요.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-slate-200 text-slate-800 shrink-0 mt-0.5">
                  <Download className="w-4 h-4 text-slate-700" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">5. 백업 & 기기 변경 데이터 내보내기</h4>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    상단 우측 백업 아이콘으로 JSON 파일 내보내기 및 파일 불러오기가 가능하여 핸드폰을 바꿔도 기록이 보존됩니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Action */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>설정된 이름: <strong className="text-slate-900">{inputName.trim() || '러너'}</strong></span>
          </div>

          <button
            onClick={handleComplete}
            className="px-6 py-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-sky-600 hover:to-blue-600 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition active:scale-95 flex items-center space-x-1.5"
          >
            <span>{isFirstVisit ? '시작하기' : '확인 (닫기)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
