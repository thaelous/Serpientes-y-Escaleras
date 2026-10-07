export interface Question {
  id: number;
  question: string;
  options: [string, string, string];
  correctIndex: number; // 0, 1, or 2
  explanation: string;
}

export type AdvantageCardId =
  | 'impulso_doble'
  | 'tiro_adicional'
  | 'escudo_reptil'
  | 'rebase_tactico'
  | 'ascensor_directo'
  | 'furia_dados'
  | 'campo_fuerza'
  | 'paso_preciso'
  | 'pase_dorado';

export type DisadvantageCardId =
  | 'rebote'
  | 'frenado_brusco'
  | 'crioturbina'
  | 'gravedad_pesada'
  | 'rebobinado'
  | 'resbalon'
  | 'dado_plomo'
  | 'presion_extrema'
  | 'caida_puesto'
  | 'trampa_imantada'
  | 'vortice'
  | 'maldicion_doble'
  | 'trampa_doble';

export interface Card {
  id: AdvantageCardId | DisadvantageCardId;
  type: 'ADVANTAGE' | 'DISADVANTAGE';
  title: string;
  description: string;
  flavor: string;
  timing: 'INMEDIATO' | 'DIFERIDO';
  timingDescription: string;
}

export type GenderType = 'masculino' | 'femenino' | 'neutral';
export type SkinTone = '#fde2d0' | '#fcd5b5' | '#e0ac69' | '#c68642' | '#8d5524' | '#4a2c11';
export type HairType = 'corto' | 'rizado' | 'lacio_largo' | 'afro' | 'calvo_barba' | 'coleta' | 'copete_retro';
export type OutfitType = 'chandal_squid' | 'traje_formal' | 'camiseta_chaleco' | 'overol_industrial';
export type GlassesType = 'ninguno' | 'lentes_sol' | 'lentes_pasta';
export type HeadwearType = 'ninguno' | 'gorra_deportiva' | 'sombrero' | 'audifonos';
export type FacialHairType = 'ninguno' | 'bigote' | 'barba_estilizada';

export interface AvatarConfig {
  gender: GenderType;
  skinTone: string;
  hairType: HairType;
  hairColor: string;
  outfit: OutfitType;
  glasses: GlassesType;
  headwear: HeadwearType;
  facialHair: FacialHairType;
}

export interface PlayerStats {
  correctAnswers: number;
  incorrectAnswers: number;
}

export interface Player {
  id: string;
  name: string;
  number: string;
  color: string;
  tile: number; // 0 = en banca / fuera de tablero, 1 a 50 = casillas activas
  avatar?: AvatarConfig;
  stats?: PlayerStats;
  shields: {
    escudoReptil: boolean; // Immune to next snake
    campoFuerza: boolean;  // Immune to rivals' disadvantages for 1 full round
    campoFuerzaExpiresRound?: number;
    paseDorado: boolean;   // Immune to question failure penalty once
    rebote?: boolean;      // Reflects incoming disadvantage back to the rival who sent it
  };
  modifiers: {
    crioturbina: number;       // Frozen turns remaining
    gravedadPesada: boolean;   // Half dice roll next turn
    furiaDados: boolean;       // Roll 2 dice next turn
    dadoPlomo: boolean;        // Max roll 2 next turn
    presionExtrema: boolean;   // 8s question timer next
    maldicionDoble: boolean;   // Double disadvantage or penalty if fails next question
    trampaDoble?: boolean;
    tiroAdicional: boolean;    // Extra roll in current turn
  };
  cardsInventory: string[];
}

export interface Connection {
  id: string;
  type: 'LADDER' | 'TUBE';
  startTile: number; // bottom for ladder, top for tube
  endTile: number;   // top for ladder, bottom for tube
  snakeSpecies?: 'BOA' | 'CASCABEL' | 'CORALILLO';
}

export type GamePhase =
  | 'WAITING_ROLL'
  | 'ROLLING'
  | 'MOVING'
  | 'QUESTION_PENDING'
  | 'STRATEGIC_CHOICE'
  | 'CARD_NOTIFICATION'
  | 'CONNECTION_TRAVERSAL'
  | 'VICTORY';

export type BoardThemeId =
  | 'squid_arena'
  | 'cyberpunk'
  | 'selva_mistica'
  | 'corporativo'
  | 'retro_arcade';

export interface BrandConfig {
  logoUrl: string | null;
  logoName: string | null;
  accentColor: string | null;
}
