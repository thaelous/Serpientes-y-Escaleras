import React, { useState, useEffect } from 'react';
import { Question, Player, Card } from '../types';
import { sound } from '../audio';
import { Timer, CheckCircle2, XCircle, Users } from 'lucide-react';
import { TargetRivalModal } from './TargetRivalModal';

interface QuestionModalProps {
  question: Question;
  activePlayer: Player;
  rivals: Player[];
  isBlindTimer?: boolean;
  onChoiceMade: (payload: {
    decisionType: 'ADVANTAGE_SELF' | 'DISADVANTAGE_RIVAL' | 'DISADVANTAGE_SELF' | 'ADVANTAGE_RIVAL';
    targetPlayerId: string;
    isCorrect: boolean;
  }) => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  activePlayer,
  rivals,
  isBlindTimer = false,
  onChoiceMade
}) => {
  const initialSeconds = isBlindTimer || activePlayer.modifiers.presionExtrema ? 8 : 30;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [rivalPickerMode, setRivalPickerMode] = useState<'BENEFIT' | 'PENALIZE' | null>(null);

  // Play cinematic tension heartbeat pulse on question reveal
  useEffect(() => {
    sound.playQuestionHeartbeat();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (isAnswered) return;

    if (secondsLeft <= 0) {
      handleAnswer(-1);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, isAnswered]);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const correct = index === question.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }
  };

  const handleSelfChoice = (type: 'ADVANTAGE_SELF' | 'DISADVANTAGE_SELF') => {
    onChoiceMade({
      decisionType: type,
      targetPlayerId: activePlayer.id,
      isCorrect
    });
  };

  const handleRivalConfirmed = (selectedRival: Player) => {
    const decisionType = rivalPickerMode === 'PENALIZE' ? 'DISADVANTAGE_RIVAL' : 'ADVANTAGE_RIVAL';
    setRivalPickerMode(null);
    onChoiceMade({
      decisionType,
      targetPlayerId: selectedRival.id,
      isCorrect
    });
  };

  const timerPercentage = (secondsLeft / initialSeconds) * 100;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-2xl rounded-2xl bg-neutral-950 border-2 border-neutral-700 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
          
          {/* Top Header with Player Info and Timer */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/80">
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-display font-black text-xs text-white border"
                style={{ backgroundColor: activePlayer.color }}
              >
                {activePlayer.number}
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-neutral-400">
                  DESAFÍO EN CASILLA {activePlayer.tile}
                </span>
                <h2 className="text-sm font-display font-bold text-white tracking-wide">
                  {activePlayer.name}
                </h2>
              </div>
            </div>

            {/* Timer Display */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-neutral-950 border border-neutral-700 font-mono text-xs">
              <Timer size={14} className={secondsLeft <= 5 ? 'text-rose-500 animate-spin' : 'text-neutral-400'} />
              <span className={`font-bold tabular-nums ${secondsLeft <= 5 ? 'text-rose-500 animate-pulse text-sm' : 'text-slate-200'}`}>
                {secondsLeft}s
              </span>
            </div>
          </div>

          {/* Progress Bar of Timer */}
          <div className="h-1.5 w-full bg-neutral-900">
            <div
              className={`h-full transition-all duration-1000 ${
                secondsLeft <= 5 ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-emerald-500'
              }`}
              style={{ width: `${timerPercentage}%` }}
            />
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {!isAnswered ? (
              /* Question & Options Phase */
              <div>
                <p className="text-xs font-mono text-rose-500 uppercase tracking-widest mb-2 font-bold">
                  Pregunta #{question.id}
                </p>
                <h3 className="text-lg sm:text-xl font-medium text-slate-100 mb-6 leading-relaxed">
                  {question.question}
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {question.options.map((opt, idx) => {
                    const letter = idx === 0 ? 'A' : idx === 1 ? 'B' : 'C';
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className="group flex items-center gap-4 p-3.5 sm:p-4 rounded-xl bg-neutral-900/90 hover:bg-neutral-800/90 border border-neutral-700/80 hover:border-neutral-400 text-left transition-all active:scale-[0.99] cursor-pointer"
                      >
                        <span className="w-8 h-8 rounded-lg bg-neutral-800 group-hover:bg-rose-600 group-hover:text-white border border-neutral-600 flex items-center justify-center font-display font-bold text-sm text-neutral-300 transition-colors">
                          {letter}
                        </span>
                        <span className="text-sm sm:text-base font-normal text-slate-200 group-hover:text-white">
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Strategic Dilemma Decision Phase */
              <div className="space-y-6">
                {/* Feedback Alert Banner */}
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    isCorrect
                      ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200'
                      : 'bg-rose-950/50 border-rose-500/60 text-rose-200'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 size={24} className="text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={24} className="text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-base font-display font-bold uppercase tracking-wider">
                      {isCorrect ? '¡RESPUESTA CORRECTA!' : 'RESPUESTA INCORRECTA'}
                    </h4>
                    <p className="text-xs sm:text-sm mt-1 text-slate-300">
                      {question.explanation || (isCorrect ? 'Has demostrado preparación táctica.' : 'La alarma de penalización se ha activado.')}
                    </p>
                  </div>
                </div>

                {/* Dilemma Title */}
                <div className="text-center">
                  <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                    DECISIÓN ESTRATÉGICA DE LA ARENA
                  </p>
                  <h3 className="text-lg font-display font-bold text-white mt-1">
                    {isCorrect ? 'Elige tu recompensa o ataque táctico:' : 'Debes asumir tu penalización o ceder ventaja:'}
                  </h3>
                </div>

                {/* Strategic Two Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {isCorrect ? (
                    <>
                      <button
                        onClick={() => handleSelfChoice('ADVANTAGE_SELF')}
                        className="p-5 rounded-xl bg-gradient-to-b from-emerald-950/70 to-neutral-900 border border-emerald-500/50 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] text-left transition-all group cursor-pointer"
                      >
                        <span className="block text-[11px] font-mono text-emerald-400 uppercase font-bold tracking-wider mb-1">
                          OPCIÓN 1 · PROPIA
                        </span>
                        <h4 className="text-base font-display font-bold text-white group-hover:text-emerald-300">
                          Obtener Tarjeta de VENTAJA
                        </h4>
                        <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                          Roba una tarjeta de beneficio para impulsar a tu equipo o ganar inmunidades.
                        </p>
                      </button>

                      <button
                        onClick={() => setRivalPickerMode('PENALIZE')}
                        disabled={rivals.length === 0}
                        className="p-5 rounded-xl bg-gradient-to-b from-rose-950/70 to-neutral-900 border border-rose-500/50 hover:border-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] text-left transition-all group cursor-pointer disabled:opacity-40"
                      >
                        <span className="block text-[11px] font-mono text-rose-400 uppercase font-bold tracking-wider mb-1">
                          OPCIÓN 2 · ATAQUE TÁCTICO
                        </span>
                        <h4 className="text-base font-display font-bold text-white group-hover:text-rose-300">
                          Asignar DESVENTAJA a Rival
                        </h4>
                        <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                          Abre el selector de participantes para elegir a qué equipo rival penalizar directamente.
                        </p>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleSelfChoice('DISADVANTAGE_SELF')}
                        className="p-5 rounded-xl bg-gradient-to-b from-rose-950/70 to-neutral-900 border border-rose-500/50 hover:border-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] text-left transition-all group cursor-pointer"
                      >
                        <span className="block text-[11px] font-mono text-rose-400 uppercase font-bold tracking-wider mb-1">
                          OPCIÓN 1 · PENALIZACIÓN
                        </span>
                        <h4 className="text-base font-display font-bold text-white group-hover:text-rose-300">
                          Recibir DESVENTAJA para mí
                        </h4>
                        <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                          Aceptas el castigo en tu propio casillero o estado táctico.
                        </p>
                      </button>

                      <button
                        onClick={() => setRivalPickerMode('BENEFIT')}
                        disabled={rivals.length === 0}
                        className="p-5 rounded-xl bg-gradient-to-b from-amber-950/70 to-neutral-900 border border-amber-500/50 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] text-left transition-all group cursor-pointer disabled:opacity-40"
                      >
                        <span className="block text-[11px] font-mono text-amber-400 uppercase font-bold tracking-wider mb-1">
                          OPCIÓN 2 · CONCESIÓN
                        </span>
                        <h4 className="text-base font-display font-bold text-white group-hover:text-amber-300">
                          Entregar VENTAJA a un Rival
                        </h4>
                        <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                          Abre el selector de participantes para elegir qué equipo rival recibirá una ventaja.
                        </p>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Target Rival Dedicated Modal */}
      {rivalPickerMode && (
        <TargetRivalModal
          isOpen={true}
          activePlayer={activePlayer}
          rivals={rivals}
          mode={rivalPickerMode}
          onConfirm={handleRivalConfirmed}
          onCancel={() => setRivalPickerMode(null)}
        />
      )}
    </>
  );
};

