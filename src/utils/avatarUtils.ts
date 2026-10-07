import { AvatarConfig } from '../types';

export const SKIN_TONES = [
  { label: 'Pálido / Claro', value: '#ffd7ba' },
  { label: 'Marfil / Beige', value: '#fcd5b5' },
  { label: 'Trigueño / Dorado', value: '#e0ac69' },
  { label: 'Bronceado', value: '#c68642' },
  { label: 'Moreno Cálido', value: '#8d5524' },
  { label: 'Ébano Profundo', value: '#4a2c11' }
];

export const HAIR_COLORS = [
  { label: 'Negro Azabache', value: '#0f172a' },
  { label: 'Castaño Oscuro', value: '#451a03' },
  { label: 'Castaño Claro', value: '#854d0e' },
  { label: 'Rubio Dorado', value: '#eab308' },
  { label: 'Pelirrojo / Cobrizo', value: '#c2410c' },
  { label: 'Plata / Canoso', value: '#94a3b8' },
  { label: 'Blanco Puro', value: '#f8fafc' },
  { label: 'Rosa Neón', value: '#f43f5e' },
  { label: 'Cian Neón', value: '#06b6d4' }
];

export function getDefaultAvatar(number: string): AvatarConfig {
  switch (number) {
    case '456':
      return {
        gender: 'masculino',
        skinTone: '#ffd7ba',
        hairType: 'copete_retro',
        hairColor: '#0f172a',
        outfit: 'chandal_squid',
        glasses: 'ninguno',
        headwear: 'ninguno',
        facialHair: 'ninguno'
      };
    case '067':
      return {
        gender: 'femenino',
        skinTone: '#ffd7ba',
        hairType: 'corto',
        hairColor: '#0f172a',
        outfit: 'chandal_squid',
        glasses: 'ninguno',
        headwear: 'ninguno',
        facialHair: 'ninguno'
      };
    case '218':
      return {
        gender: 'masculino',
        skinTone: '#fcd5b5',
        hairType: 'corto',
        hairColor: '#1e1b4b',
        outfit: 'traje_formal',
        glasses: 'lentes_pasta',
        headwear: 'ninguno',
        facialHair: 'ninguno'
      };
    case '001':
      return {
        gender: 'neutral',
        skinTone: '#fcd5b5',
        hairType: 'calvo_barba',
        hairColor: '#94a3b8',
        outfit: 'chandal_squid',
        glasses: 'ninguno',
        headwear: 'ninguno',
        facialHair: 'bigote'
      };
    default:
      return {
        gender: 'neutral',
        skinTone: '#ffd7ba',
        hairType: 'corto',
        hairColor: '#0f172a',
        outfit: 'chandal_squid',
        glasses: 'ninguno',
        headwear: 'ninguno',
        facialHair: 'ninguno'
      };
  }
}
