import React, { useState, useEffect } from 'react';
import { Player, Question, Card } from '../types';
import { Dice3D } from './Dice3D';
import { sound } from '../audio';
import { Smartphone, RotateCcw, ShieldCheck, Skull, ArrowLeft, Palette } from 'lucide-react';
import { CharacterAvatar } from './CharacterAvatar';
import { AvatarCustomizerModal } from './AvatarCustomizerModal';
import { AvatarConfig } from '../types';

interface MobileControllerProps {
  onExitController?: () => void;
  // If embedded in the main app state
  activePlayer?: Player;
  rolling?: boolean;
  onRoll?: () => void;
  currentQuestion?: Question | null;
  onAnswer?: (optionIndex: number) => void;
  pendingCard?: { card: Card; targetPlayer: Player } | null;
  onConfirmCard?: () => void;
}

export const MobileControllerView: React.FC<MobileControllerProps> = ({
  onExitController,
  activePlayer,
  rolling,
  onRoll,
  currentQuestion,
  onAnswer,
  pendingCard,
  onConfirmCard
}) => {
  // BroadcastChannel for cross-tab or cross-window control
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);
  const [syncedPlayer, setSyncedPlayer] = useState<Player | null>(activePlayer || null);
  const [syncedQuestion, setSyncedQuestion] = useState<Question | null>(currentQuestion || null);
  const [syncedRolling, setSyncedRolling] = useState<boolean>(rolling || false);
  const [lastDice, setLastDice] = useState<number>(1);
  const [isCustomizingAvatar, setIsCustomizingAvatar] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel('arena50_squid_game_channel');
      setChannel(bc);

      bc.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'STATE_UPDATE') {
          if (payload.activePlayer) setSyncedPlayer(payload.activePlayer);
          if (payload.question !== undefined) setSyncedQuestion(payload.question);
          if (payload.rolling !== undefined) setSyncedRolling(payload.rolling);
          if (payload.lastRoll) setLastDice(payload.lastRoll);
        }
      };

      // Request initial state from host
      bc.postMessage({ type: 'CONTROLLER_CONNECTED' });

      return () => {
        bc.close();
      };
    }
  }, []);

  // Sync with props if provided
  useEffect(() => {
    if (activePlayer) setSyncedPlayer(activePlayer);
    if (currentQuestion !== undefined) setSyncedQuestion(currentQuestion);
    if (rolling !== undefined) setSyncedRolling(rolling);
  }, [activePlayer, currentQuestion, rolling]);

  const handleRollClick = () => {
    sound.playDiceRoll();
    if (onRoll) {
      onRoll();
    } else if (channel) {
      channel.postMessage({ type: 'REMOTE_ROLL_REQUEST' });
    }
  };

  const handleAnswerClick = (index: number) => {
    if (onAnswer) {
      onAnswer(index);
    } else if (channel) {
      channel.postMessage({ type: 'REMOTE_ANSWER_SUBMIT', payload: { index } });
    }
  };

  const currentPlayer: Player = syncedPlayer || {
    id: 'p1',
    name: 'Jugador 456',
    number: '456',
    color: '#10b981',
    tile: 1,
    shields: { escudoReptil: false, campoFuerza: false, paseDorado: false },
    modifiers: { crioturbina: 0, gravedadPesada: false, furiaDados: false, dadoPlomo: false, presionExtrema: false, maldicionDoble: false, tiroAdicional: false },
    cardsInventory: []
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between p-4 max-w-md mx-auto select-none">
      
      {/* Top Bar */}
      <header className="flex items-center justify-between py-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Smartphone size={18} className="text-rose-500" />
          <span className="font-display font-black text-sm tracking-wider uppercase text-rose-500">
            MANDO REMOTO ARENA 50
          </span>
        </div>
        {onExitController && (
          <button
            onClick={onExitController}
            className="flex items-center gap-1 text-xs font-mono text-neutral-400 hover:text-white"
          >
            <ArrowLeft size={14} />
            <span>Volver</span>
          </button>
        )}
      </header>

      {/* Main Body */}
      <main className="flex-1 flex flex-col justify-center py-6 space-y-6">
        
        {/* Active Player Card with Avatar Preview */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-14 rounded-xl bg-neutral-950 border border-neutral-700 flex items-center justify-center p-1 shrink-0 shadow-inner"
              style={{ borderColor: currentPlayer.color }}
            >
              <div className="scale-80 origin-center">
                <CharacterAvatar player={currentPlayer} action="IDLE" />
              </div>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                Tu Personaje #{currentPlayer.number}
              </span>
              <h3 className="text-base font-display font-bold text-white">
                {currentPlayer.name}
              </h3>
              <button
                onClick={() => setIsCustomizingAvatar(true)}
                className="mt-1 flex items-center gap-1 text-[11px] font-mono font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <Palette size={12} />
                <span>Diseñar Mi Avatar</span>
              </button>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-neutral-400 block uppercase">
              Posición
            </span>
            <span className="text-base font-mono font-bold text-rose-400">
              Casilla {currentPlayer.tile}
            </span>
          </div>
        </div>

        {/* Pending Card Modal on Controller */}
        {pendingCard && (
          <div className="p-5 rounded-2xl bg-neutral-950 border-2 border-rose-500/80 text-center space-y-3 shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-rose-400 text-xs font-mono uppercase font-bold">
              {pendingCard.card.type === 'ADVANTAGE' ? <ShieldCheck size={18} className="text-emerald-400" /> : <Skull size={18} />}
              <span>{pendingCard.card.type === 'ADVANTAGE' ? 'Tarjeta de Ventaja' : 'Tarjeta de Desventaja'}</span>
            </div>
            <h4 className="text-lg font-display font-bold text-white uppercase">
              {pendingCard.card.title}
            </h4>
            <p className="text-xs text-neutral-300">
              {pendingCard.card.description}
            </p>
            {onConfirmCard && (
              <button
                onClick={onConfirmCard}
                className="w-full py-2.5 rounded-xl bg-rose-600 font-display font-bold text-xs uppercase tracking-wider text-white"
              >
                Aceptar Efecto
              </button>
            )}
          </div>
        )}

        {/* Question Answering Phase on Mobile */}
        {syncedQuestion ? (
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-700 space-y-4">
            <div className="text-xs font-mono text-rose-500 uppercase font-bold">
              Pregunta #{syncedQuestion.id} en Casilla {currentPlayer.tile}
            </div>
            <h3 className="text-sm font-semibold text-slate-100 leading-snug">
              {syncedQuestion.question}
            </h3>

            <div className="space-y-2.5 pt-2">
              {syncedQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerClick(idx)}
                  className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-rose-500 flex items-center gap-3 text-left transition-all active:scale-95"
                >
                  <span className="w-7 h-7 rounded-lg bg-neutral-800 text-neutral-300 font-display font-bold text-xs flex items-center justify-center shrink-0">
                    {['A', 'B', 'C'][idx]}
                  </span>
                  <span className="text-xs font-medium text-slate-200">
                    {opt}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Dice Roll Controller */
          <div className="flex flex-col items-center justify-center py-8 space-y-5">
            <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest text-center">
              Toca para lanzar el dado industrial
            </p>

            <button
              onClick={handleRollClick}
              disabled={syncedRolling}
              className={`w-40 h-40 rounded-full border-4 border-rose-500/60 flex flex-col items-center justify-center p-4 transition-all duration-200 active:scale-90 shadow-[0_0_40px_rgba(244,63,94,0.35)]
                ${syncedRolling
                  ? 'animate-spin bg-neutral-950 border-rose-400'
                  : 'bg-gradient-to-br from-rose-950/80 via-neutral-900 to-black hover:shadow-[0_0_60px_rgba(244,63,94,0.6)] cursor-pointer'
                }`}
            >
              <span className="text-4xl font-display font-black text-white">
                {syncedRolling ? '...' : lastDice}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400 font-bold mt-1">
                {syncedRolling ? 'GIRANDO' : 'LANZAR'}
              </span>
            </button>
          </div>
        )}

      </main>

      {/* Footer Status */}
      <footer className="py-3 text-center border-t border-neutral-900 text-[11px] font-mono text-neutral-500">
        <span>Conectado al servidor central de la Arena 50</span>
      </footer>

      {/* Avatar Customizer Submodal on Mobile */}
      {isCustomizingAvatar && (
        <AvatarCustomizerModal
          player={currentPlayer}
          isOpen={isCustomizingAvatar}
          onClose={() => setIsCustomizingAvatar(false)}
          onSaveAvatar={(playerId, newAvatar) => {
            const updated = { ...currentPlayer, avatar: newAvatar };
            setSyncedPlayer(updated);
            if (channel) {
              channel.postMessage({
                type: 'AVATAR_UPDATE',
                payload: { playerId, avatar: newAvatar }
              });
            }
          }}
        />
      )}

    </div>
  );
};
