import React, { useState } from 'react';
import { Player, AvatarConfig, GenderType, HairType, OutfitType, GlassesType, HeadwearType, FacialHairType } from '../types';
import { CharacterAvatar } from './CharacterAvatar';
import { SKIN_TONES, HAIR_COLORS, getDefaultAvatar } from '../utils/avatarUtils';
import { Check, User, Sparkles, X, Shield, Wand2 } from 'lucide-react';

interface AvatarCustomizerModalProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
  onSaveAvatar: (playerId: string, avatar: AvatarConfig) => void;
}

export const AvatarCustomizerModal: React.FC<AvatarCustomizerModalProps> = ({
  player,
  isOpen,
  onClose,
  onSaveAvatar
}) => {
  const [avatar, setAvatar] = useState<AvatarConfig>(() => {
    return player.avatar || getDefaultAvatar(player.number);
  });

  const [activeTab, setActiveTab] = useState<'ASPECTO' | 'CABELLO' | 'ROPA' | 'ACCESORIOS'>('ASPECTO');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveAvatar(player.id, avatar);
    onClose();
  };

  const handleRandomize = () => {
    const genders: GenderType[] = ['masculino', 'femenino', 'neutral'];
    const hairs: HairType[] = ['corto', 'rizado', 'lacio_largo', 'afro', 'calvo_barba', 'coleta', 'copete_retro'];
    const outfits: OutfitType[] = ['chandal_squid', 'traje_formal', 'camiseta_chaleco', 'overol_industrial'];
    const glasses: GlassesType[] = ['ninguno', 'lentes_sol', 'lentes_pasta'];
    const headwears: HeadwearType[] = ['ninguno', 'gorra_deportiva', 'sombrero', 'audifonos'];
    const beards: FacialHairType[] = ['ninguno', 'bigote', 'barba_estilizada'];

    setAvatar({
      gender: genders[Math.floor(Math.random() * genders.length)],
      skinTone: SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)].value,
      hairType: hairs[Math.floor(Math.random() * hairs.length)],
      hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].value,
      outfit: outfits[Math.floor(Math.random() * outfits.length)],
      glasses: glasses[Math.floor(Math.random() * glasses.length)],
      headwear: headwears[Math.floor(Math.random() * headwears.length)],
      facialHair: beards[Math.floor(Math.random() * beards.length)]
    });
  };

  // Preview player dummy with current avatar
  const previewPlayer: Player = {
    ...player,
    avatar
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-700 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_12px_rgba(244,63,94,0.6)]">
              🎨
            </span>
            <div>
              <h2 className="text-lg font-display font-black text-white uppercase tracking-wider">
                Personalizador de Avatar SVG
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {player.name} · Jugador #{player.number}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Live Character Podium */}
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-neutral-900/90 to-neutral-950 rounded-2xl border border-neutral-800 shadow-inner">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-4">
              VISTA EN TABLERO
            </span>

            {/* Pedestal with Animated Avatar */}
            <div className="relative w-28 h-32 flex items-center justify-center bg-neutral-900/60 rounded-2xl border border-neutral-700/60 shadow-[0_10px_30px_rgba(0,0,0,0.8)] mb-4">
              <div className="scale-150">
                <CharacterAvatar
                  player={previewPlayer}
                  action="WALKING"
                  isActive={true}
                  facingDirection="right"
                />
              </div>
            </div>

            <div className="text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs font-mono font-bold text-slate-200">
                #{player.number} {player.name}
              </span>
            </div>

            <button
              onClick={handleRandomize}
              className="mt-4 px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Wand2 size={13} className="text-amber-400" />
              <span>Aleatorio</span>
            </button>
          </div>

          {/* Right Columns: Customization Controls with Tabs */}
          <div className="md:col-span-2 flex flex-col">
            
            {/* Tabs */}
            <div className="flex border-b border-neutral-800 mb-4 gap-1 overflow-x-auto pb-1">
              {(['ASPECTO', 'CABELLO', 'ROPA', 'ACCESORIOS'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]'
                      : 'bg-neutral-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB 1: ASPECTO (Género & Tono de Piel) */}
            {activeTab === 'ASPECTO' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                    Género / Silueta
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['masculino', 'femenino', 'neutral'] as GenderType[]).map(g => (
                      <button
                        key={g}
                        onClick={() => setAvatar(prev => ({ ...prev, gender: g }))}
                        className={`p-2.5 rounded-xl border text-xs font-display font-bold uppercase tracking-wide transition-all cursor-pointer capitalize ${
                          avatar.gender === g
                            ? 'bg-neutral-800 border-rose-500 text-white ring-1 ring-rose-500 shadow-md'
                            : 'bg-neutral-900 border-neutral-800 text-slate-400 hover:border-neutral-700'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                    Tono de Piel Realista
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {SKIN_TONES.map(s => (
                      <button
                        key={s.value}
                        onClick={() => setAvatar(prev => ({ ...prev, skinTone: s.value }))}
                        className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                          avatar.skinTone === s.value
                            ? 'bg-neutral-800 border-rose-500 ring-1 ring-rose-500 shadow-md'
                            : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-black/40 shrink-0"
                          style={{ backgroundColor: s.value }}
                        />
                        <span className="text-[11px] font-mono text-slate-300 truncate">
                          {s.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CABELLO (Tipo & Color) */}
            {activeTab === 'CABELLO' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                    Corte / Peinado
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'corto', label: 'Corto Clásico' },
                      { id: 'copete_retro', label: 'Copete Gi-hun' },
                      { id: 'rizado', label: 'Rizado Con Volumen' },
                      { id: 'lacio_largo', label: 'Lacio Largo' },
                      { id: 'coleta', label: 'Coleta Alta' },
                      { id: 'afro', label: 'Afro Volumétrico' },
                      { id: 'calvo_barba', label: 'Calvo con Barba' }
                    ].map(h => (
                      <button
                        key={h.id}
                        onClick={() => setAvatar(prev => ({ ...prev, hairType: h.id as HairType }))}
                        className={`p-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                          avatar.hairType === h.id
                            ? 'bg-neutral-800 border-rose-500 text-white ring-1 ring-rose-500 shadow-md'
                            : 'bg-neutral-900 border-neutral-800 text-slate-400 hover:border-neutral-700'
                        }`}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                    Color de Cabello
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
                    {HAIR_COLORS.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setAvatar(prev => ({ ...prev, hairColor: c.value }))}
                        className={`p-1.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                          avatar.hairColor === c.value
                            ? 'bg-neutral-800 border-rose-500 ring-1 ring-rose-500'
                            : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/50 shrink-0"
                          style={{ backgroundColor: c.value }}
                        />
                        <span className="text-[10px] font-mono text-slate-300 truncate">
                          {c.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ROPA Y UNIFORMES */}
            {activeTab === 'ROPA' && (
              <div className="space-y-3">
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                  Atuendo / Uniforme de Competencia
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    {
                      id: 'chandal_squid',
                      title: 'Chándal Deportivo Squid Game',
                      desc: 'Uniforme clásico verde esmeralda con franjas blancas y dorsal en el pecho.'
                    },
                    {
                      id: 'traje_formal',
                      title: 'Traje Formal / Blazer Ejecutivo',
                      desc: 'Saco azul marino, camisa de vestir blanca y corbata oscura de gala.'
                    },
                    {
                      id: 'camiseta_chaleco',
                      title: 'Camiseta Casual con Chaleco Táctico',
                      desc: 'Prenda cómoda con chaleco utilitario con bolsillos reforzados.'
                    },
                    {
                      id: 'overol_industrial',
                      title: 'Overol de Trabajo Industrial',
                      desc: 'Peto resistente de mezclilla y tirantes con hebillas metálicas.'
                    }
                  ].map(outfit => (
                    <button
                      key={outfit.id}
                      onClick={() => setAvatar(prev => ({ ...prev, outfit: outfit.id as OutfitType }))}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                        avatar.outfit === outfit.id
                          ? 'bg-neutral-800 border-rose-500 ring-1 ring-rose-500 shadow-md'
                          : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <span className="text-xs font-display font-black text-white uppercase tracking-wider">
                        {outfit.title}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {outfit.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: ACCESORIOS EQUIPABLES */}
            {activeTab === 'ACCESORIOS' && (
              <div className="space-y-4">
                {/* Lentes */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                    Lentes / Gafas
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'ninguno', label: 'Ninguno' },
                      { id: 'lentes_sol', label: 'Lentes de Sol' },
                      { id: 'lentes_pasta', label: 'Lentes de Pasta' }
                    ].map(g => (
                      <button
                        key={g.id}
                        onClick={() => setAvatar(prev => ({ ...prev, glasses: g.id as GlassesType }))}
                        className={`p-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                          avatar.glasses === g.id
                            ? 'bg-neutral-800 border-rose-500 text-white ring-1 ring-rose-500'
                            : 'bg-neutral-900 border-neutral-800 text-slate-400 hover:border-neutral-700'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sombreros / Cabeza */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                    Accesorios de Cabeza
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'ninguno', label: 'Ninguno' },
                      { id: 'gorra_deportiva', label: 'Gorra' },
                      { id: 'sombrero', label: 'Sombrero' },
                      { id: 'audifonos', label: 'Audífonos' }
                    ].map(h => (
                      <button
                        key={h.id}
                        onClick={() => setAvatar(prev => ({ ...prev, headwear: h.id as HeadwearType }))}
                        className={`p-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                          avatar.headwear === h.id
                            ? 'bg-neutral-800 border-rose-500 text-white ring-1 ring-rose-500'
                            : 'bg-neutral-900 border-neutral-800 text-slate-400 hover:border-neutral-700'
                        }`}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vello Facial */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                    Vello Facial
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'ninguno', label: 'Ninguno' },
                      { id: 'bigote', label: 'Bigote Clásico' },
                      { id: 'barba_estilizada', label: 'Barba Perfilada' }
                    ].map(b => (
                      <button
                        key={b.id}
                        onClick={() => setAvatar(prev => ({ ...prev, facialHair: b.id as FacialHairType }))}
                        className={`p-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                          avatar.facialHair === b.id
                            ? 'bg-neutral-800 border-rose-500 text-white ring-1 ring-rose-500'
                            : 'bg-neutral-900 border-neutral-800 text-slate-400 hover:border-neutral-700'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-neutral-700 text-slate-300 hover:bg-neutral-800 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-display font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(244,63,94,0.6)] flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Check size={16} className="stroke-[3]" />
            <span>Guardar Personaje</span>
          </button>
        </div>

      </div>
    </div>
  );
};
