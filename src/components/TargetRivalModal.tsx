import React, { useState } from 'react';
import { Player } from '../types';
import { Users, Shield, Skull, Check, ArrowRight } from 'lucide-react';

interface TargetRivalModalProps {
  isOpen: boolean;
  activePlayer: Player;
  rivals: Player[];
  mode: 'BENEFIT' | 'PENALIZE';
  onConfirm: (selectedRival: Player) => void;
  onCancel: () => void;
}

export const TargetRivalModal: React.FC<TargetRivalModalProps> = ({
  isOpen,
  activePlayer,
  rivals,
  mode,
  onConfirm,
  onCancel
}) => {
  const [selectedId, setSelectedId] = useState<string>(rivals[0]?.id || '');

  if (!isOpen) return null;

  const isPenalize = mode === 'PENALIZE';
  const selectedRival = rivals.find(r => r.id === selectedId) || rivals[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-2xl rounded-2xl bg-neutral-950 border-2 p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden transition-all ${
          isPenalize
            ? 'border-rose-500/80 shadow-[0_0_50px_rgba(244,63,94,0.3)]'
            : 'border-amber-500/80 shadow-[0_0_50px_rgba(245,158,11,0.3)]'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-xs font-mono mb-3">
            {isPenalize ? <Skull size={15} className="text-rose-400" /> : <Shield size={15} className="text-amber-400" />}
            <span className={isPenalize ? 'text-rose-400 font-bold' : 'text-amber-400 font-bold'}>
              {isPenalize ? 'ATAQUE TÁCTICO: SELECCIONA EL RIVAL A PENALIZAR' : 'CONCESIÓN: SELECCIONA EL RIVAL A BENEFICIAR'}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wider">
            {isPenalize ? '¿A quién deseas enviar la Desventaja?' : '¿A qué equipo deseas entregar la Ventaja?'}
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
            {isPenalize
              ? 'La penalización se aplicará de inmediato al participante seleccionado. Pulsa sobre su tarjeta.'
              : 'El rival seleccionado recibirá una tarjeta de ventaja táctica. Pulsa sobre su tarjeta.'}
          </p>
        </div>

        {/* Rivals Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {rivals.map((rival) => {
            const isSelected = rival.id === selectedId;
            return (
              <button
                key={rival.id}
                onClick={() => setSelectedId(rival.id)}
                className={`group relative p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? isPenalize
                      ? 'bg-rose-950/60 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)] scale-102 ring-2 ring-rose-400'
                      : 'bg-amber-950/60 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-102 ring-2 ring-amber-300'
                    : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-600 hover:bg-neutral-850'
                }`}
              >
                {/* Active Checkmark Pill */}
                {isSelected && (
                  <div
                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shadow-md ${
                      isPenalize ? 'bg-rose-600' : 'bg-amber-500'
                    }`}
                  >
                    <Check size={14} />
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-display font-black text-sm text-white border-2 border-white shadow-md shrink-0"
                    style={{ backgroundColor: rival.color, boxShadow: `0 0 10px ${rival.color}` }}
                  >
                    {rival.number}
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-[10px] font-mono uppercase text-neutral-400">
                      RIVAL #{rival.number}
                    </span>
                    <h4 className="text-sm font-display font-bold text-white truncate">
                      {rival.name}
                    </h4>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                  <span className="font-mono text-neutral-400">Posición:</span>
                  <span className="font-display font-bold text-amber-300">
                    Casilla {rival.tile}
                  </span>
                </div>

                {/* Status Pills */}
                <div className="flex flex-wrap gap-1 mt-2 min-h-[18px]">
                  {rival.shields.campoFuerza && (
                    <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-1 rounded">
                      Campo Fuerza
                    </span>
                  )}
                  {rival.shields.escudoReptil && (
                    <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-800 px-1 rounded">
                      Escudo Reptil
                    </span>
                  )}
                  {rival.modifiers.crioturbina > 0 && (
                    <span className="text-[9px] font-mono text-blue-300 bg-blue-950/80 border border-blue-800 px-1 rounded">
                      Congelado
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-neutral-800">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white font-mono text-xs transition-colors"
          >
            Volver a las Opciones
          </button>

          <button
            onClick={() => {
              if (selectedRival) {
                onConfirm(selectedRival);
              }
            }}
            className={`px-6 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
              isPenalize
                ? 'bg-rose-600 hover:bg-rose-500 shadow-[0_4px_20px_rgba(244,63,94,0.4)]'
                : 'bg-amber-600 hover:bg-amber-500 shadow-[0_4px_20px_rgba(245,158,11,0.4)]'
            }`}
          >
            <span>Confirmar Objetivo: {selectedRival ? selectedRival.name : ''}</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
