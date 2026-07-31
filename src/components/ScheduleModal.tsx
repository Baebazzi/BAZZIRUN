import React, { useState, useEffect } from 'react';
import { GeneralSchedule } from '../types';
import { X, Calendar as CalendarIcon, Clock, Trash2, Check } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  dateString: string;
  initialSchedule?: GeneralSchedule | null;
  onClose: () => void;
  onSaveSchedule: (data: {
    id?: string;
    title: string;
    time?: string;
    timeOfDay?: '오전' | '오후' | '종일';
    category: '개인 훈련' | '일반 일정' | '미팅/약속' | '회복/휴식' | '기타';
    notes?: string;
  }) => void;
  onDeleteSchedule?: (scheduleId: string) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  dateString,
  initialSchedule,
  onClose,
  onSaveSchedule,
  onDeleteSchedule,
}) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [timeOfDay, setTimeOfDay] = useState<'오전' | '오후' | '종일'>('오전');
  const [category, setCategory] = useState<'개인 훈련' | '일반 일정' | '미팅/약속' | '회복/휴식' | '기타'>('일반 일정');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialSchedule) {
      setTitle(initialSchedule.title || '');
      setTime(initialSchedule.time || '09:00');
      setTimeOfDay(initialSchedule.timeOfDay || '오전');
      setCategory(initialSchedule.category || '일반 일정');
      setNotes(initialSchedule.notes || '');
    } else {
      setTitle('');
      setTime('09:00');
      setTimeOfDay('오전');
      setCategory('일반 일정');
      setNotes('');
    }
  }, [initialSchedule, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('일정 제목을 입력해주세요.');
      return;
    }
    onSaveSchedule({
      id: initialSchedule?.id,
      title: title.trim(),
      time,
      timeOfDay,
      category,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  const handleDelete = () => {
    if (initialSchedule && onDeleteSchedule) {
      if (window.confirm(`'${initialSchedule.title}' 일정을 삭제하시겠습니까?`)) {
        onDeleteSchedule(initialSchedule.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
          <div>
            <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-widest">
              GENERAL SCHEDULE
            </span>
            <h3 className="text-lg font-black font-sans mt-0.5">
              {initialSchedule ? '일정 수정 / 삭제' : '일반 일정 등록'}{' '}
              <span className="text-slate-300 font-normal">({dateString})</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-slate-50/50">
          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase mb-1.5">
              일정 제목 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="일정 제목을 입력하세요"
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase mb-1.5 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                <span>시간 구분</span>
              </label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
              >
                <option value="오전">🌅 오전</option>
                <option value="오후">🌆 오후</option>
                <option value="종일">☀️ 종일</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase mb-1.5">
                상세 시간
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase mb-1.5">
                카테고리
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
              >
                <option value="일반 일정">일반 일정</option>
                <option value="개인 훈련">개인 훈련</option>
                <option value="미팅/약속">미팅/약속</option>
                <option value="회복/휴식">회복/휴식</option>
                <option value="기타">기타</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase mb-1.5">
              상세 메모
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="장소, 준비물, 메모 등..."
              rows={2.5}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs resize-none"
            />
          </div>

          <div className="pt-2 flex items-center space-x-2">
            {initialSchedule && onDeleteSchedule && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-extrabold text-xs transition flex items-center justify-center space-x-1.5 active:scale-95"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>삭제하기</span>
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-extrabold text-sm shadow-md hover:brightness-110 transition flex items-center justify-center space-x-2 active:scale-95"
            >
              <Check className="w-4 h-4 text-sky-400" />
              <span>{initialSchedule ? '수정사항 저장' : '일정 저장하기'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
