import { Card } from '../types';

export const ADVANTAGE_CARDS: Card[] = [
  {
    id: 'impulso_doble',
    type: 'ADVANTAGE',
    title: 'Impulso Doble',
    description: 'Avanzas 2 casillas adicionales de inmediato en la arena.',
    flavor: 'La inercia juega a tu favor. Las compuertas de seguridad se abren a tu paso.',
    timing: 'INMEDIATO',
    timingDescription: 'Efecto inmediato: Tu ficha avanzará 2 casillas ahora mismo.'
  },
  {
    id: 'tiro_adicional',
    type: 'ADVANTAGE',
    title: 'Tiro Adicional',
    description: 'Puedes lanzar el dado nuevamente en este mismo turno.',
    flavor: 'El cronómetro se reinicia para ti. Una segunda oportunidad táctica.',
    timing: 'INMEDIATO',
    timingDescription: 'Efecto inmediato: Conservarás el turno para volver a tirar el dado.'
  },
  {
    id: 'escudo_reptil',
    type: 'ADVANTAGE',
    title: 'Escudo Reptil',
    description: 'Inmune a la siguiente serpiente en la que caigas.',
    flavor: 'Rejilla blindada reforzada. Las fauces de la serpiente quedan bloqueadas.',
    timing: 'DIFERIDO',
    timingDescription: 'Efecto pasivo diferido: Si caes en una serpiente futura, el escudo la neutralizará.'
  },
  {
    id: 'rebase_tactico',
    type: 'ADVANTAGE',
    title: 'Rebase Táctico',
    description: 'Intercambias posición con el jugador que va más cerca por delante de ti.',
    flavor: 'Maniobra de relevo forzado bajo reflectores industriales.',
    timing: 'INMEDIATO',
    timingDescription: 'Efecto inmediato: Cambiarás casillas con el rival inmediatamente más cercano por delante.'
  },
  {
    id: 'ascensor_directo',
    type: 'ADVANTAGE',
    title: 'Ascensor Directo',
    description: 'Te trasladas directamente a la base de la escalera más cercana hacia adelante.',
    flavor: 'Acceso directo a la plataforma de andamiaje superior.',
    timing: 'INMEDIATO',
    timingDescription: 'Efecto inmediato: Tu ficha se teletransporta a la base de la siguiente escalera y ascenderá.'
  },
  {
    id: 'furia_dados',
    type: 'ADVANTAGE',
    title: 'Furia de Dados',
    description: 'En tu PRÓXIMO turno tiras 2 dados y sumas ambos resultados.',
    flavor: 'Sobrecarga de generadores: propulsión de doble impulso cinético.',
    timing: 'DIFERIDO',
    timingDescription: 'Efecto diferido: Tu siguiente tiro lanzará 2 dados acumulando ambos valores.'
  },
  {
    id: 'campo_fuerza',
    type: 'ADVANTAGE',
    title: 'Campo de Fuerza',
    description: 'Inmune a cualquier desventaja lanzada por otros jugadores durante 1 ronda completa.',
    flavor: 'Protocolo de blindaje VIP activado. Ninguna trampa externa te alcanzará.',
    timing: 'DIFERIDO',
    timingDescription: 'Efecto diferido: Bloqueará cualquier desventaja dirigida hacia ti por 1 ronda.'
  },
  {
    id: 'paso_preciso',
    type: 'ADVANTAGE',
    title: 'Paso Preciso',
    description: 'Avanzas exactamente 3 casillas sin necesidad de tirar dado.',
    flavor: 'Cálculo balístico exacto: avance controlado sin riesgo de azar.',
    timing: 'INMEDIATO',
    timingDescription: 'Efecto inmediato: Tu ficha avanzará 3 casillas seguras paso a paso.'
  },
  {
    id: 'pase_dorado',
    type: 'ADVANTAGE',
    title: 'Pase Dorado',
    description: 'Si fallas tu siguiente pregunta, no recibirás penalización.',
    flavor: 'Respaldo del sistema: la alarma de fallo se silenciará por una ocasión.',
    timing: 'DIFERIDO',
    timingDescription: 'Efecto diferido: Te protegerá si cometes un error en tu próxima pregunta.'
  }
];

export const DISADVANTAGE_CARDS: Card[] = [
  {
    id: 'rebote',
    type: 'DISADVANTAGE',
    title: 'Rebote (Reflejo de Castigo)',
    description: 'Blindaje de contraataque: si un rival intenta lanzarte una desventaja, esta rebotará y se le aplicará a él.',
    flavor: 'Espejo cinético polarizado. La trampa enviada se vuelve contra su propio emisor.',
    timing: 'DIFERIDO',
    timingDescription: 'Efecto pasivo: Si otro participante te ataca con una desventaja, la rechazará y rebotará hacia él.'
  },
  {
    id: 'frenado_brusco',
    type: 'DISADVANTAGE',
    title: 'Frenado Brusco',
    description: 'Retrocedes 2 casillas de inmediato.',
    flavor: 'Sirenas de repliegue: las compuertas de seguridad te empujan hacia atrás.',
    timing: 'INMEDIATO',
    timingDescription: 'Efecto inmediato: Tu ficha retrocederá 2 casillas paso a paso.'
  },
  {
    id: 'crioturbina',
    type: 'DISADVANTAGE',
    title: 'Crioturbina',
    description: 'Quedas congelado y pierdes tu siguiente turno.',
    flavor: 'Cámara de nitrógeno sellada. El supervisor bloquea tus movimientos por una ronda.',
    timing: 'DIFERIDO',
    timingDescription: 'Efecto diferido: En tu próximo turno permanecerás congelado sin poder tirar el dado.'
  },
  {
    id: 'gravedad_pesada',
    type: 'DISADVANTAGE',
    title: 'Gravedad Pesada',
    description: 'En tu siguiente turno avanzas solo el 50% de lo que saque el dado.',
    flavor: 'Campo de compresión neumática activo en tu sector de la terraza.',
    timing: 'DIFERIDO',
    timingDescription: 'Efecto diferido: Tu próximo resultado del dado se dividirá a la mitad (redondeo superior).'
  },
  {
    id: 'rebobinado',
    type: 'DISADVANTAGE',
    title: 'Rebobinado',
    description: 'Regresas a la casilla exacta donde iniciaste este turno.',
    flavor: 'Rebote magnético de choque: impacto contra la viga perimetral blindada.',
    timing: 'INMEDIATO',
    timingDescription: 'Efecto inmediato: Tu ficha retrocede paso a paso hasta el punto de inicio de la ronda.'
  },
  {
    id: 'resbalon',
    type: 'DISADVANTAGE',
    title: 'Resbalón',
    description: 'Retrocedes 3 casillas de inmediato.',
    flavor: 'Pérdida de tracción en la pasarela metálica húmeda.',
    timing: 'INMEDIATO',
    timingDescription: 'Efecto inmediato: Tu ficha retrocederá 3 casillas paso a paso.'
  },
  {
    id: 'dado_plomo',
    type: 'DISADVANTAGE',
    title: 'Dado de Plomo',
    description: 'En tu siguiente turno el dado no puede sacar más de 2.',
    flavor: 'Lastre magnético fijado a los sensores de movimiento de tu cubo.',
    timing: 'DIFERIDO',
    timingDescription: 'Efecto diferido: Tu próximo lanzamiento tendrá un límite máximo estricto de 2 casillas.'
  },
  {
    id: 'presion_extrema',
    type: 'DISADVANTAGE',
    title: 'Presión Extrema',
    description: 'Tu siguiente pregunta tendrá solo 8 segundos de límite para responder.',
    flavor: 'Niebla de advertencia y reflectores estroboscópicos con sirena acelerada.',
    timing: 'DIFERIDO',
    timingDescription: 'Efecto diferido: El temporizador de tu siguiente pregunta bajará a solo 8 segundos.'
  },
  {
    id: 'caida_puesto',
    type: 'DISADVANTAGE',
    title: 'Caída de Puesto',
    description: 'Intercambias posición con el jugador en último lugar (o retrocedes 3 casillas si ya vas último).',
    flavor: 'Reasignación de celda por orden del mando central.',
    timing: 'INMEDIATO',
    timingDescription: 'Efecto inmediato: Cambiarás lugar directamente con el participante más rezagado.'
  },
  {
    id: 'trampa_imantada',
    type: 'DISADVANTAGE',
    title: 'Trampa Imantada',
    description: 'Te trasladas directamente a la entrada de la serpiente más cercana hacia atrás.',
    flavor: 'Un pulso electromagnético te arrastra a la trampilla de la serpiente previa.',
    timing: 'INMEDIATO',
    timingDescription: 'Efecto inmediato: Tu ficha retrocede a la entrada de la serpiente previa y descenderá.'
  },
  {
    id: 'maldicion_doble',
    type: 'DISADVANTAGE',
    title: 'Maldición Doble',
    description: 'Si fallas tu siguiente pregunta, recibirás 2 desventajas simultáneas y -4 casillas.',
    flavor: 'Marcador de alto riesgo: penalización reforzada ante cualquier error.',
    timing: 'DIFERIDO',
    timingDescription: 'Efecto diferido: Si cometes un error en tu próxima pregunta sufrirás penalización doble inmediata.'
  }
];

export function getRandomAdvantage(): Card {
  const index = Math.floor(Math.random() * ADVANTAGE_CARDS.length);
  return ADVANTAGE_CARDS[index];
}

export function getRandomDisadvantage(): Card {
  const index = Math.floor(Math.random() * DISADVANTAGE_CARDS.length);
  return DISADVANTAGE_CARDS[index];
}
