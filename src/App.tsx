/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Player, Connection, Question, GamePhase, Card, BoardThemeId, BrandConfig } from './types';
import { DEFAULT_QUESTIONS } from './data/defaultQuestions';
import { generateInitialConnections, relocateConnection } from './utils/connections';
import { getRandomAdvantage, getRandomDisadvantage } from './data/cards';
import { getDefaultAvatar } from './utils/avatarUtils';
import { sound } from './audio';
import { ProjectileConfig } from './components/ProjectileOverlay';
import { BOARD_THEMES } from './utils/themeConfig';

// Components
import { Board } from './components/Board';
import { Hud } from './components/Hud';
import { QuestionModal } from './components/QuestionModal';
import { CardImpactOverlay } from './components/CardImpactOverlay';
import { Dice3DCenterModal } from './components/Dice3DCenterModal';
import { SettingsModal } from './components/SettingsModal';
import { VictoryModal } from './components/VictoryModal';
import { MobileControllerView } from './components/MobileControllerView';
import { CinematicEventAlert } from './components/CinematicEventAlert';

// Default 4 Contestants (Squid Game Theme) with modular SVG Avatars
const INITIAL_PLAYERS: Player[] = [
  {
    id: 'p1',
    name: 'Seong Gi-hun',
    number: '456',
    color: '#10b981', // Emerald
    tile: 0, // Inicia en banca de espera fuera del tablero
    avatar: getDefaultAvatar('456'),
    stats: { correctAnswers: 0, incorrectAnswers: 0 },
    cardsInventory: [],
    shields: {
      escudoReptil: false,
      campoFuerza: false,
      paseDorado: false,
      rebote: false
    },
    modifiers: {
      crioturbina: 0,
      gravedadPesada: false,
      furiaDados: false,
      dadoPlomo: false,
      presionExtrema: false,
      maldicionDoble: false,
      trampaDoble: false,
      tiroAdicional: false
    }
  },
  {
    id: 'p2',
    name: 'Kang Sae-byeok',
    number: '067',
    color: '#f43f5e', // Rose/Magenta
    tile: 0, // Inicia en banca de espera fuera del tablero
    avatar: getDefaultAvatar('067'),
    stats: { correctAnswers: 0, incorrectAnswers: 0 },
    cardsInventory: [],
    shields: {
      escudoReptil: false,
      campoFuerza: false,
      paseDorado: false,
      rebote: false
    },
    modifiers: {
      crioturbina: 0,
      gravedadPesada: false,
      furiaDados: false,
      dadoPlomo: false,
      presionExtrema: false,
      maldicionDoble: false,
      trampaDoble: false,
      tiroAdicional: false
    }
  },
  {
    id: 'p3',
    name: 'Cho Sang-woo',
    number: '218',
    color: '#3b82f6', // Indigo/Blue
    tile: 0, // Inicia en banca de espera fuera del tablero
    avatar: getDefaultAvatar('218'),
    stats: { correctAnswers: 0, incorrectAnswers: 0 },
    cardsInventory: [],
    shields: {
      escudoReptil: false,
      campoFuerza: false,
      paseDorado: false,
      rebote: false
    },
    modifiers: {
      crioturbina: 0,
      gravedadPesada: false,
      furiaDados: false,
      dadoPlomo: false,
      presionExtrema: false,
      maldicionDoble: false,
      trampaDoble: false,
      tiroAdicional: false
    }
  },
  {
    id: 'p4',
    name: 'Oh Il-nam',
    number: '001',
    color: '#f59e0b', // Amber/Gold
    tile: 0, // Inicia en banca de espera fuera del tablero
    avatar: getDefaultAvatar('001'),
    stats: { correctAnswers: 0, incorrectAnswers: 0 },
    cardsInventory: [],
    shields: {
      escudoReptil: false,
      campoFuerza: false,
      paseDorado: false,
      rebote: false
    },
    modifiers: {
      crioturbina: 0,
      gravedadPesada: false,
      furiaDados: false,
      dadoPlomo: false,
      presionExtrema: false,
      maldicionDoble: false,
      trampaDoble: false,
      tiroAdicional: false
    }
  }
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const App: React.FC = () => {
  // Mobile Controller Route detection
  const [isMobileMode, setIsMobileMode] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.location.search.includes('mode=controller');
  });

  // Master Game State
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [connections, setConnections] = useState<Connection[]>(generateInitialConnections());
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [usedQuestionIds, setUsedQuestionIds] = useState<number[]>([]);
  const [round, setRound] = useState<number>(1);
  const [phase, setPhase] = useState<GamePhase>('WAITING_ROLL');
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [rolling, setRolling] = useState<boolean>(false);
  const [turnStartTile, setTurnStartTile] = useState<number>(0);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [shockwaveTile, setShockwaveTile] = useState<number | null>(null);
  const [playerAction, setPlayerAction] = useState<{
    playerId: string;
    action: 'WALKING' | 'CLIMBING' | 'SLIDING';
  } | null>(null);

  // Bustrophedon walking direction state
  const [isMovingBackwards, setIsMovingBackwards] = useState<boolean>(false);

  // Dynamic Card Visual Transformation Effects (Rocket boots, skidding, teleport beam, dark vortex)
  const [activeCardTransformation, setActiveCardTransformation] = useState<{
    playerId: string;
    effect: 'ROCKET_BOOTS' | 'SKIDDING' | 'TELEPORT' | 'VORTEX' | null;
  } | null>(null);

  // Animated Projectiles State (Advantage Hearts & Disadvantage Lightning Bolts)
  const [activeProjectile, setActiveProjectile] = useState<ProjectileConfig | null>(null);

  // 3D Kinetic Dice Center Modal State
  const [diceCenterDisplay, setDiceCenterDisplay] = useState<{
    value: number;
    secondValue?: number | null;
    total: number;
  } | null>(null);

  // Card impact animation state
  const [activeImpactOverlay, setActiveImpactOverlay] = useState<{
    card: Card;
    targetPlayer: Player;
  } | null>(null);
  const [affectedPlayerAnim, setAffectedPlayerAnim] = useState<{
    playerId: string;
    type: 'BUFF' | 'DEBUFF';
  } | null>(null);

  // Dynamic connection relocation animations
  const [dissolvingConnectionId, setDissolvingConnectionId] = useState<string | null>(null);
  const [appearingConnectionId, setAppearingConnectionId] = useState<string | null>(null);

  // Modals & UI Controls
  const [currentTheme, setCurrentTheme] = useState<BoardThemeId>('squid_arena');
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(() => {
    try {
      const saved = localStorage.getItem('snakes_ladders_brand');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      logoUrl: null,
      logoName: null,
      accentColor: null
    };
  });

  // Dark & Light Mode State with LocalStorage Persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('arena50_theme_mode');
      if (saved !== null) return saved === 'dark';
    } catch {}
    return true; // Default dark mode (industrial theme)
  });

  useEffect(() => {
    try {
      localStorage.setItem('arena50_theme_mode', isDarkMode ? 'dark' : 'light');
    } catch {}
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  const toggleThemeMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [eventNotification, setEventNotification] = useState<string | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);

  // Sync corporate brand accent color to root CSS property
  useEffect(() => {
    if (brandConfig.accentColor) {
      document.documentElement.style.setProperty('--brand-accent', brandConfig.accentColor);
    } else {
      document.documentElement.style.removeProperty('--brand-accent');
    }
  }, [brandConfig.accentColor]);

  const handleUpdateBrandConfig = (config: BrandConfig) => {
    setBrandConfig(config);
    try {
      localStorage.setItem('snakes_ladders_brand', JSON.stringify(config));
    } catch {}
  };

  // Blocking notification resolver promise ref
  const alertResolverRef = useRef<(() => void) | null>(null);

  // BroadcastChannel for mobile controller sync
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Keep synchronous ref of players state for atomic multi-step card math
  const playersRef = useRef<Player[]>(players);
  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  const activePlayer = players[activePlayerIndex] || players[0];
  const rivals = players.filter(p => p.id !== activePlayer.id);

  // Initialize BroadcastChannel
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel('arena50_squid_game_channel');
      channelRef.current = bc;

      bc.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'CONTROLLER_CONNECTED') {
          broadcastState();
        } else if (type === 'REMOTE_ROLL_REQUEST') {
          if (phase === 'WAITING_ROLL' && !rolling) {
            handleRollDice();
          }
        } else if (type === 'AVATAR_UPDATE' && payload) {
          setPlayers(prev => prev.map(p => p.id === payload.playerId ? { ...p, avatar: payload.avatar } : p));
        }
      };

      return () => {
        bc.close();
      };
    }
  }, [phase, rolling, activePlayerIndex, players, activeQuestion]);

  const broadcastState = () => {
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: 'STATE_UPDATE',
        payload: {
          activePlayer,
          question: activeQuestion,
          rolling,
          lastRoll
        }
      });
    }
  };

  /**
   * REGLA DE ORO: Bloqueo estricto del juego durante los carteles.
   * La promesa solo se resuelve cuando el usuario pulsa físicamente el botón [ CONTINUAR / ACEPTAR ].
   */
  const showBlockingAlert = (msg: string): Promise<void> => {
    return new Promise((resolve) => {
      alertResolverRef.current = resolve;
      setEventNotification(msg);
    });
  };

  const handleAlertDismiss = () => {
    setEventNotification(null);
    if (alertResolverRef.current) {
      const resolve = alertResolverRef.current;
      alertResolverRef.current = null;
      resolve();
    }
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    sound.enabled = nextState;
    setSoundEnabled(nextState);
  };

  // Helper to trigger animated projectiles between players (Heart for advantage, Lightning for disadvantage)
  const triggerProjectile = (senderTile: number, targetTile: number, type: 'ADVANTAGE' | 'DISADVANTAGE'): Promise<void> => {
    return new Promise((resolve) => {
      const sTile = senderTile <= 0 ? 1 : senderTile;
      const tTile = targetTile <= 0 ? 1 : targetTile;
      if (sTile === tTile) {
        resolve();
        return;
      }
      setActiveProjectile({
        senderTile: sTile,
        targetTile: tTile,
        type,
        onComplete: () => {
          setActiveProjectile(null);
          resolve();
        }
      });
    });
  };

  // Helper to trigger animated cross-parabola swap trajectory between two swapping players
  const triggerSwapTrajectory = (tile1: number, tile2: number, name1?: string, name2?: string): Promise<void> => {
    return new Promise((resolve) => {
      const s1 = tile1 <= 0 ? 1 : tile1;
      const s2 = tile2 <= 0 ? 1 : tile2;
      setActiveProjectile({
        senderTile: s1,
        targetTile: s2,
        type: 'SWAP',
        player1Name: name1,
        player2Name: name2,
        onComplete: () => {
          setActiveProjectile(null);
          resolve();
        }
      });
    });
  };

  // 4. ACTIVACIÓN UNIVERSAL DE SERPIENTES Y ESCALERAS
  // Función asíncrona universal centralizada: avanza o retrocede paso a paso y evalúa
  // obligatoriamente si la casilla final coincide con una escalera o serpiente.
  const moverYEvaluarCasilla = async (playerId: string, targetDestTile: number): Promise<number> => {
    const player = playersRef.current.find(p => p.id === playerId);
    if (!player) return 1;
    const startTile = player.tile;
    const clampedDest = Math.max(1, Math.min(50, targetDestTile));

    // Desplazamiento paso a paso con cadencia pausada y choque cinético
    if (clampedDest > startTile) {
      setIsMovingBackwards(false);
      setPlayerAction({ playerId, action: 'WALKING' });
      let currentTile = startTile;
      while (currentTile < clampedDest) {
        currentTile++;
        sound.playStep();
        setShockwaveTile(currentTile);
        const tNow = currentTile;
        setPlayers(prev => {
          const next = prev.map(item => item.id === playerId ? { ...item, tile: tNow } : item);
          playersRef.current = next;
          return next;
        });
        await sleep(460);
        setShockwaveTile(null);
      }
      setPlayerAction(null);
    } else if (clampedDest < startTile) {
      setIsMovingBackwards(true);
      setPlayerAction({ playerId, action: 'WALKING' });
      let currentTile = startTile;
      while (currentTile > clampedDest) {
        currentTile--;
        sound.playStep();
        setShockwaveTile(currentTile);
        const tNow = currentTile;
        setPlayers(prev => {
          const next = prev.map(item => item.id === playerId ? { ...item, tile: tNow } : item);
          playersRef.current = next;
          return next;
        });
        await sleep(460);
        setShockwaveTile(null);
      }
      setPlayerAction(null);
      setIsMovingBackwards(false);
    }

    // Comprobar meta 50
    if (clampedDest >= 50) {
      setWinner(player);
      setPhase('VICTORY');
      return 50;
    }

    // Evaluación Universal de Atajos o Trampas en la casilla de aterrizaje
    let finalDestTile = clampedDest;

    // A) Escalera (Andamio de Acero)
    const ladder = connections.find(c => c.type === 'LADDER' && c.startTile === clampedDest);
    if (ladder) {
      // Bloqueo total durante el aviso cinemático
      await showBlockingAlert(`▲ ¡Andamio de Acero! ${player.name} sube de la Casilla ${ladder.startTile} a la ${ladder.endTile}.`);

      // Animación física de trepado en el tablero despejado
      sound.playLadderAscent();
      setPlayerAction({ playerId: player.id, action: 'CLIMBING' });
      finalDestTile = ladder.endTile;
      setPlayers(prev => {
        const next = prev.map(p => p.id === playerId ? { ...p, tile: finalDestTile } : p);
        playersRef.current = next;
        return next;
      });
      await sleep(750);
      setPlayerAction(null);

      // Disolución, reubicación y reaparición elástica de la escalera
      setDissolvingConnectionId(ladder.id);
      await sleep(500);
      setConnections(prev => relocateConnection(prev, ladder.id));
      setDissolvingConnectionId(null);
      setAppearingConnectionId(ladder.id);
      await sleep(650);
      setAppearingConnectionId(null);

      if (finalDestTile >= 50) {
        const updatedP = playersRef.current.find(p => p.id === playerId) || player;
        setWinner(updatedP);
        setPhase('VICTORY');
        return 50;
      }
      return finalDestTile;
    }

    // B) Serpiente (Boa, Cascabel, Coralillo)
    const snake = connections.find(c => c.type === 'TUBE' && c.startTile === clampedDest);
    if (snake) {
      const speciesName = snake.snakeSpecies === 'BOA' ? 'Boa Constrictor' : snake.snakeSpecies === 'CASCABEL' ? 'Cascabel' : 'Coralillo';

      // Únicamente las fichas que posean un "Escudo" o inmunidad activa absorben el impacto
      if (player.shields.escudoReptil) {
        await showBlockingAlert(`🛡️ ¡El Escudo Antidisturbios de ${player.name} repelió a la serpiente ${speciesName}!`);
        sound.playShieldImpact();
        setPlayers(prev => {
          const next = prev.map(p => p.id === playerId ? {
            ...p,
            shields: { ...p.shields, escudoReptil: false }
          } : p);
          playersRef.current = next;
          return next;
        });
        return clampedDest;
      } else {
        // Bloqueo total durante el aviso cinemático
        await showBlockingAlert(`🐍 ¡Emboscada de Serpiente ${speciesName}! ${player.name} desciende de la Casilla ${snake.startTile} a la ${snake.endTile}.`);

        // Animación de deslizamiento rápido según especie de serpiente
        sound.playTubeSlide(snake.snakeSpecies);
        setPlayerAction({ playerId: player.id, action: 'SLIDING' });
        finalDestTile = snake.endTile;
        setPlayers(prev => {
          const next = prev.map(p => p.id === playerId ? { ...p, tile: finalDestTile } : p);
          playersRef.current = next;
          return next;
        });
        await sleep(750);
        setPlayerAction(null);

        // Disolución, reubicación y reaparición elástica de la serpiente
        setDissolvingConnectionId(snake.id);
        await sleep(500);
        setConnections(prev => relocateConnection(prev, snake.id));
        setDissolvingConnectionId(null);
        setAppearingConnectionId(snake.id);
        await sleep(650);
        setAppearingConnectionId(null);

        return finalDestTile;
      }
    }

    return clampedDest;
  };

  // Helper backward wrapper using moverYEvaluarCasilla
  const stepBackward = async (playerId: string, steps: number): Promise<number> => {
    const current = playersRef.current.find(p => p.id === playerId)?.tile ?? 1;
    return moverYEvaluarCasilla(playerId, Math.max(1, current - steps));
  };

  // Helper forward wrapper using moverYEvaluarCasilla
  const stepForward = async (playerId: string, steps: number): Promise<number> => {
    const current = playersRef.current.find(p => p.id === playerId)?.tile ?? 0;
    const dest = current === 0 ? steps : current + steps;
    return moverYEvaluarCasilla(playerId, Math.min(50, dest));
  };

  const evaluarCasillaFinal = async (playerId: string): Promise<number> => {
    const current = playersRef.current.find(p => p.id === playerId)?.tile ?? 1;
    return moverYEvaluarCasilla(playerId, current);
  };

  // Finish turn helper & advance to next player
  const finishTurn = async () => {
    setPhase('WAITING_ROLL');
    setActiveQuestion(null);
    setActiveImpactOverlay(null);
    setAffectedPlayerAnim(null);
    setActiveCardTransformation(null);

    // Check if player has extra roll from Tiro Adicional
    if (activePlayer.modifiers.tiroAdicional) {
      setPlayers(prev => prev.map((p, idx) => idx === activePlayerIndex ? {
        ...p,
        modifiers: { ...p.modifiers, tiroAdicional: false }
      } : p));
      await showBlockingAlert(`🎲 ¡Turno adicional para ${activePlayer.name}! Vuelve a lanzar el dado.`);
      return;
    }

    const nextIndex = (activePlayerIndex + 1) % players.length;
    if (nextIndex === 0) {
      const nextRound = round + 1;
      setRound(nextRound);
      // Check expiring force fields
      setPlayers(prev => prev.map(p => {
        if (p.shields.campoFuerza && p.shields.campoFuerzaExpiresRound && nextRound >= p.shields.campoFuerzaExpiresRound) {
          return {
            ...p,
            shields: { ...p.shields, campoFuerza: false }
          };
        }
        return p;
      }));
    }
    setActivePlayerIndex(nextIndex);

    // Check if next player is frozen by Crioturbina
    const nextP = players[nextIndex];
    if (nextP && nextP.modifiers.crioturbina > 0) {
      sound.playFreezeImpact();
      setPlayers(prev => prev.map((p, idx) => idx === nextIndex ? {
        ...p,
        modifiers: { ...p.modifiers, crioturbina: p.modifiers.crioturbina - 1 }
      } : p));
      await showBlockingAlert(`❄ ${nextP.name} está atrapado en un Cubo de Hielo (Crioturbina) y pierde este turno.`);
      const nextNextIndex = (nextIndex + 1) % players.length;
      if (nextNextIndex === 0) setRound(r => r + 1);
      setActivePlayerIndex(nextNextIndex);
    }
  };

  // 1. & 2. & 3. STRICT CHRONOLOGICAL TURN FLOW EXECUTION
  const handleRollDice = async () => {
    if (phase !== 'WAITING_ROLL' || rolling || activePlayer.modifiers.crioturbina > 0) return;

    setRolling(true);
    setPhase('ROLLING');
    setTurnStartTile(activePlayer.tile);

    // Calculate rolled value
    let d1 = Math.floor(Math.random() * 6) + 1;
    let d2: number | null = null;
    let totalRoll = d1;

    if (activePlayer.modifiers.furiaDados) {
      d2 = Math.floor(Math.random() * 6) + 1;
      totalRoll = d1 + d2;
    } else if (activePlayer.modifiers.dadoPlomo) {
      d1 = Math.min(2, d1);
      totalRoll = d1;
    } else if (activePlayer.modifiers.gravedadPesada) {
      totalRoll = Math.max(1, Math.floor(d1 / 2));
    }

    setLastRoll(totalRoll);

    // Display Center 3D Kinetic Tumble Modal
    setDiceCenterDisplay({ value: d1, secondValue: d2, total: totalRoll });
  };

  // Triggered when 3D Dice Modal finishes its kinetic animation
  const handleDiceRollCompleted = async (totalRoll: number) => {
    setDiceCenterDisplay(null);
    setRolling(false);
    setPhase('MOVING');

    // Clear one-time roll modifiers
    setPlayers(prev => prev.map((p, idx) => idx === activePlayerIndex ? {
      ...p,
      modifiers: {
        ...p.modifiers,
        furiaDados: false,
        dadoPlomo: false,
        gravedadPesada: false
      }
    } : p));

    // STEP 1: Avance pausado paso a paso hasta el número obtenido
    await stepForward(activePlayer.id, totalRoll);

    // STEP 2: Evaluación Universal Centralizada de Casilla Final (Escaleras, Serpientes o Meta)
    const finalDestTile = await evaluarCasillaFinal(activePlayer.id);

    // Check Victory
    if (finalDestTile >= 50) {
      return;
    }

    // STEP 3: Casilla de Destino Final -> Despliegue de PREGUNTA dinámica (sin repetir acertadas)
    await sleep(350);
    let availableQuestions = questions.filter(q => !usedQuestionIds.includes(q.id));
    if (availableQuestions.length === 0) {
      setUsedQuestionIds([]);
      availableQuestions = questions;
      await showBlockingAlert('🔄 ¡Banco de preguntas renovado automáticamente!');
    }
    const randomQ = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    setActiveQuestion(randomQ);
    setPhase('QUESTION_PENDING');
  };

  // STEP 4. & 5.: Strategic Choice -> CIERRE INMEDIATO DE MODAL DE PREGUNTA Y APERTURA DE EXPLICACIÓN
  const handleStrategicChoiceMade = async (payload: {
    decisionType: 'ADVANTAGE_SELF' | 'DISADVANTAGE_RIVAL' | 'DISADVANTAGE_SELF' | 'ADVANTAGE_RIVAL';
    targetPlayerId: string;
    isCorrect: boolean;
  }) => {
    // Cierre de Modales Inmediato
    if (payload.isCorrect && activeQuestion) {
      setUsedQuestionIds(prev => [...prev, activeQuestion.id]);
    }
    setActiveQuestion(null);

    // Actualización de Estadísticas Académicas del Jugador Activo
    setPlayers(prev => {
      const next = prev.map(p => {
        if (p.id === activePlayer.id) {
          const currentStats = p.stats || { correctAnswers: 0, incorrectAnswers: 0 };
          return {
            ...p,
            stats: {
              correctAnswers: currentStats.correctAnswers + (payload.isCorrect ? 1 : 0),
              incorrectAnswers: currentStats.incorrectAnswers + (payload.isCorrect ? 0 : 1)
            }
          };
        }
        return p;
      });
      playersRef.current = next;
      return next;
    });

    const isAdvantage = payload.decisionType === 'ADVANTAGE_SELF' || payload.decisionType === 'ADVANTAGE_RIVAL';
    const drawnCard = isAdvantage ? getRandomAdvantage() : getRandomDisadvantage();
    const targetPlayer = players.find(p => p.id === payload.targetPlayerId) || activePlayer;

    // Check Pase Dorado on failure
    if (!payload.isCorrect && activePlayer.shields.paseDorado && payload.decisionType === 'DISADVANTAGE_SELF') {
      sound.playShieldImpact();
      setPlayers(prev => {
        const next = prev.map(p => p.id === activePlayer.id ? {
          ...p,
          shields: { ...p.shields, paseDorado: false }
        } : p);
        playersRef.current = next;
        return next;
      });
      await showBlockingAlert('✨ ¡Pase Dorado activado! Tu seguro de pregunta absorbió la penalización.');
      await finishTurn();
      return;
    }

    // Check Maldición Doble on failure
    if (!payload.isCorrect && activePlayer.modifiers.maldicionDoble && payload.decisionType === 'DISADVANTAGE_SELF') {
      setPlayers(prev => {
        const next = prev.map(p => p.id === activePlayer.id ? {
          ...p,
          modifiers: { ...p.modifiers, maldicionDoble: false }
        } : p);
        playersRef.current = next;
        return next;
      });
      await showBlockingAlert('💀 ¡Maldición Doble activada por fallo! Retrocedes 4 casillas automáticas.');
      setActiveCardTransformation({ playerId: activePlayer.id, effect: 'SKIDDING' });
      await stepBackward(activePlayer.id, 4);
      setActiveCardTransformation(null);
      await evaluarCasillaFinal(activePlayer.id);
    }

    // Check Campo de Fuerza when targeted with disadvantage by another player
    if (!isAdvantage && targetPlayer.shields.campoFuerza && payload.decisionType === 'DISADVANTAGE_RIVAL') {
      sound.playShieldImpact();
      await showBlockingAlert(`🛡️ ¡La Cúpula Electromagnética de ${targetPlayer.name} bloqueó la desventaja "${drawnCard.title}"!`);
      await finishTurn();
      return;
    }

    // Check Rebote (Reflejo de Castigo): si el objetivo tiene el escudo de rebote activo,
    // la desventaja rebota y se le aplica de regreso al jugador que intentó enviarla.
    let actualTargetPlayer = targetPlayer;
    if (!isAdvantage && targetPlayer.shields?.rebote && payload.decisionType === 'DISADVANTAGE_RIVAL') {
      sound.playRebote();
      // Desactivar el escudo de rebote tras su uso
      setPlayers(prev => {
        const next = prev.map(p => p.id === targetPlayer.id ? {
          ...p,
          shields: { ...p.shields, rebote: false }
        } : p);
        playersRef.current = next;
        return next;
      });

      // Efecto visual y letrero bloqueante de rebote
      await showBlockingAlert(`🪞⚡ ¡REBOTE ACTIVADO! ${targetPlayer.name} tenía el Escudo de Rebote activo. La desventaja "${drawnCard.title}" rebotó y se vuelve en contra de ${activePlayer.name}!`);
      
      // Proyectil de retorno desde el defensor hacia el atacante
      await triggerProjectile(targetPlayer.tile, activePlayer.tile, 'DISADVANTAGE');
      
      // Reasignar el objetivo final al atacante
      actualTargetPlayer = activePlayer;
    }

    // Modal permanece fijo en pantalla con botón manual [ ENTENDIDO / APLICAR EFECTO ]
    setActiveImpactOverlay({ card: drawnCard, targetPlayer: actualTargetPlayer });
    setAffectedPlayerAnim({ playerId: actualTargetPlayer.id, type: isAdvantage ? 'BUFF' : 'DEBUFF' });
  };

  // Se ejecuta SOLO al pulsar el botón destacado "ENTENDIDO / APLICAR EFECTO"
  const handleCardExplanationDismissed = async () => {
    if (!activeImpactOverlay) return;
    const { card, targetPlayer } = activeImpactOverlay;
    setActiveImpactOverlay(null);

    // REQUISITO 2: Si el jugador A le asigna una ventaja o desventaja al jugador B (que no sea él mismo):
    // Se genera el proyectil animado a través del tablero antes de la ejecución física
    if (targetPlayer.id !== activePlayer.id) {
      const isAdv = card.type === 'ADVANTAGE';
      await triggerProjectile(
        activePlayer.tile,
        targetPlayer.tile,
        isAdv ? 'ADVANTAGE' : 'DISADVANTAGE'
      );
    }

    // Ejecución física paso a paso con el tablero 100% visible y despejado
    await executeCardPhysicalEffect(card, targetPlayer);

    // Fin de animaciones y pase al siguiente turno
    setAffectedPlayerAnim(null);
    setActiveCardTransformation(null);
    await finishTurn();
  };

  // Physical execution of card effects with visible step-by-step movement & unique transformations
  const executeCardPhysicalEffect = async (card: Card, target: Player) => {
    switch (card.id) {
      // 1. Impulso Doble: Botas con cohetes propulsores y avance de 2 casillas
      case 'impulso_doble': {
        setActiveCardTransformation({ playerId: target.id, effect: 'ROCKET_BOOTS' });
        await stepForward(target.id, 2);
        setActiveCardTransformation(null);
        await evaluarCasillaFinal(target.id);
        break;
      }

      // 2. Tiro Adicional: Mini dados dorados orbitando sobre la cabeza
      case 'tiro_adicional': {
        setPlayers(prev => {
          const next = prev.map(p => p.id === target.id ? {
            ...p,
            modifiers: { ...p.modifiers, tiroAdicional: true }
          } : p);
          playersRef.current = next;
          return next;
        });
        break;
      }

      // 3. Escudo Reptil: Escudo antidisturbios acrílico y casco táctico
      case 'escudo_reptil': {
        setPlayers(prev => {
          const next = prev.map(p => p.id === target.id ? {
            ...p,
            shields: { ...p.shields, escudoReptil: true }
          } : p);
          playersRef.current = next;
          return next;
        });
        break;
      }

      // 4. Rebase Táctico: Intercambias posición con el jugador que va más cerca por delante de ti
      case 'rebase_tactico': {
        const ahead = playersRef.current.filter(p => p.tile > target.tile).sort((a, b) => a.tile - b.tile);
        if (ahead.length > 0) {
          const nearestAhead = ahead[0];
          const targetTile = target.tile;
          const nearestTile = nearestAhead.tile;
          // Trayectoria simultánea en parábola cruzada en el tablero ante todos los participantes
          await triggerSwapTrajectory(targetTile, nearestTile, target.name, nearestAhead.name);
          setPlayers(prev => {
            const next = prev.map(p => {
              if (p.id === target.id) return { ...p, tile: nearestTile };
              if (p.id === nearestAhead.id) return { ...p, tile: targetTile };
              return p;
            });
            playersRef.current = next;
            return next;
          });
          await showBlockingAlert(`🔄 ¡Rebase Táctico completado! ${target.name} intercambió posición con ${nearestAhead.name}.`);
          await evaluarCasillaFinal(target.id);
          await evaluarCasillaFinal(nearestAhead.id);
        } else {
          setActiveCardTransformation({ playerId: target.id, effect: 'ROCKET_BOOTS' });
          await stepForward(target.id, 2);
          setActiveCardTransformation(null);
          await evaluarCasillaFinal(target.id);
        }
        break;
      }

      // 5. Ascensor Directo: Haz de luz teletransportador a la base del andamio
      case 'ascensor_directo': {
        const laddersAhead = connections
          .filter(c => c.type === 'LADDER' && c.startTile > target.tile)
          .sort((a, b) => a.startTile - b.startTile);
        if (laddersAhead.length > 0) {
          const ladder = laddersAhead[0];
          const stepsToLadder = ladder.startTile - target.tile;
          setActiveCardTransformation({ playerId: target.id, effect: 'TELEPORT' });
          await stepForward(target.id, stepsToLadder);
          setActiveCardTransformation(null);
          await sleep(250);
          await evaluarCasillaFinal(target.id);
        } else {
          setActiveCardTransformation({ playerId: target.id, effect: 'ROCKET_BOOTS' });
          await stepForward(target.id, 3);
          setActiveCardTransformation(null);
          await evaluarCasillaFinal(target.id);
        }
        break;
      }

      // 6. Furia de Dados: Mini dados dorados orbitando
      case 'furia_dados': {
        setPlayers(prev => {
          const next = prev.map(p => p.id === target.id ? {
            ...p,
            modifiers: { ...p.modifiers, furiaDados: true }
          } : p);
          playersRef.current = next;
          return next;
        });
        break;
      }

      // 7. Rebote (Reflejo de Castigo): Escudo reflector que devuelve la siguiente desventaja
      case 'rebote': {
        setPlayers(prev => {
          const next = prev.map(p => p.id === target.id ? {
            ...p,
            shields: { ...p.shields, rebote: true }
          } : p);
          playersRef.current = next;
          return next;
        });
        await showBlockingAlert(`🪞 ¡Escudo de Rebote Activado en ${target.name}! Si otro concursante intenta lanzarle una desventaja, ésta rebotará y se aplicará de regreso a quien la envió.`);
        break;
      }

      // 8. Campo de Fuerza: Cúpula electromagnética poligonal con destellos
      case 'campo_fuerza': {
        setPlayers(prev => {
          const next = prev.map(p => p.id === target.id ? {
            ...p,
            shields: {
              ...p.shields,
              campoFuerza: true,
              campoFuerzaExpiresRound: round + 1
            }
          } : p);
          playersRef.current = next;
          return next;
        });
        break;
      }

      // 9. Paso Preciso: Botas con cohetes y avance de 3 casillas
      case 'paso_preciso': {
        setActiveCardTransformation({ playerId: target.id, effect: 'ROCKET_BOOTS' });
        await stepForward(target.id, 3);
        setActiveCardTransformation(null);
        await evaluarCasillaFinal(target.id);
        break;
      }

      // 10. Pase Dorado: Medalla dorada de protección
      case 'pase_dorado': {
        setPlayers(prev => {
          const next = prev.map(p => p.id === target.id ? {
            ...p,
            shields: { ...p.shields, paseDorado: true }
          } : p);
          playersRef.current = next;
          return next;
        });
        break;
      }

      // 11. Frenado Brusco: Derrape con humo y retrocede 2 casillas
      case 'frenado_brusco': {
        setActiveCardTransformation({ playerId: target.id, effect: 'SKIDDING' });
        await stepBackward(target.id, 2);
        setActiveCardTransformation(null);
        await evaluarCasillaFinal(target.id);
        break;
      }

      // 12. Crioturbina: Cubo de hielo 3D translúcido con vapor frío
      case 'crioturbina': {
        setPlayers(prev => {
          const next = prev.map(p => p.id === target.id ? {
            ...p,
            modifiers: { ...p.modifiers, crioturbina: p.modifiers.crioturbina + 1 }
          } : p);
          playersRef.current = next;
          return next;
        });
        break;
      }

      // 13. Gravedad Pesada: Yunque/pesa de 100KG con cadena al tobillo
      case 'gravedad_pesada': {
        setPlayers(prev => {
          const next = prev.map(p => p.id === target.id ? {
            ...p,
            modifiers: { ...p.modifiers, gravedadPesada: true }
          } : p);
          playersRef.current = next;
          return next;
        });
        break;
      }

      // 14. Rebobinado: Regresas a la casilla donde iniciaste este turno
      case 'rebobinado': {
        const returnTile = target.id === activePlayer.id ? (turnStartTile > 0 ? turnStartTile : 1) : Math.max(1, target.tile - 3);
        const stepsBack = Math.max(0, target.tile - returnTile);
        if (stepsBack > 0) {
          setActiveCardTransformation({ playerId: target.id, effect: 'SKIDDING' });
          await stepBackward(target.id, stepsBack);
          setActiveCardTransformation(null);
          await evaluarCasillaFinal(target.id);
        }
        break;
      }

      // 15. Resbalón: Derrape y retrocede 3 casillas
      case 'resbalon': {
        setActiveCardTransformation({ playerId: target.id, effect: 'SKIDDING' });
        await stepBackward(target.id, 3);
        setActiveCardTransformation(null);
        await evaluarCasillaFinal(target.id);
        break;
      }

      // 16. Dado de Plomo: Pesa pesada al tobillo
      case 'dado_plomo': {
        setPlayers(prev => {
          const next = prev.map(p => p.id === target.id ? {
            ...p,
            modifiers: { ...p.modifiers, dadoPlomo: true }
          } : p);
          playersRef.current = next;
          return next;
        });
        break;
      }

      // 17. Presión Extrema: Venda roja en los ojos y reloj de arena de 8s sobre la cabeza
      case 'presion_extrema': {
        setPlayers(prev => {
          const next = prev.map(p => p.id === target.id ? {
            ...p,
            modifiers: { ...p.modifiers, presionExtrema: true }
          } : p);
          playersRef.current = next;
          return next;
        });
        break;
      }

      // 18. Caída de Puesto: Intercambias posición con el jugador en último lugar
      case 'caida_puesto': {
        const sorted = [...playersRef.current].sort((a, b) => a.tile - b.tile);
        const lastPlayer = sorted[0];
        if (lastPlayer && lastPlayer.id !== target.id && lastPlayer.tile < target.tile) {
          const targetTile = target.tile;
          const lastTile = lastPlayer.tile;
          // Trayectoria simultánea en parábola cruzada de reasignación
          await triggerSwapTrajectory(targetTile, lastTile, target.name, lastPlayer.name);
          setPlayers(prev => {
            const next = prev.map(p => {
              if (p.id === target.id) return { ...p, tile: lastTile };
              if (p.id === lastPlayer.id) return { ...p, tile: targetTile };
              return p;
            });
            playersRef.current = next;
            return next;
          });
          await showBlockingAlert(`📉 ¡Caída de Puesto! ${target.name} intercambió posición con el último (${lastPlayer.name}, Casilla ${lastTile}).`);
          await evaluarCasillaFinal(target.id);
          await evaluarCasillaFinal(lastPlayer.id);
        } else {
          setActiveCardTransformation({ playerId: target.id, effect: 'SKIDDING' });
          await stepBackward(target.id, 3);
          setActiveCardTransformation(null);
          await evaluarCasillaFinal(target.id);
        }
        break;
      }

      // 19. Trampa Imantada / Vórtice: Remolino oscuro debajo de los pies que lo absorbe hacia atrás
      case 'trampa_imantada':
      case 'vortice': {
        const snakesBehind = connections
          .filter(c => c.type === 'TUBE' && c.startTile < target.tile)
          .sort((a, b) => b.startTile - a.startTile);
        if (snakesBehind.length > 0) {
          const snake = snakesBehind[0];
          const stepsToSnake = target.tile - snake.startTile;
          setActiveCardTransformation({ playerId: target.id, effect: 'VORTEX' });
          await stepBackward(target.id, stepsToSnake);
          setActiveCardTransformation(null);
          await sleep(250);
          await evaluarCasillaFinal(target.id);
        } else {
          setActiveCardTransformation({ playerId: target.id, effect: 'VORTEX' });
          await stepBackward(target.id, 3);
          setActiveCardTransformation(null);
          await evaluarCasillaFinal(target.id);
        }
        break;
      }

      // 20. Maldición Doble: Si fallas tu siguiente pregunta, recibirás 2 desventajas
      case 'maldicion_doble':
      case 'trampa_doble': {
        setPlayers(prev => {
          const next = prev.map(p => p.id === target.id ? {
            ...p,
            modifiers: { ...p.modifiers, maldicionDoble: true }
          } : p);
          playersRef.current = next;
          return next;
        });
        break;
      }

      default:
        break;
    }
  };

  // Reset Game
  const handleResetGame = () => {
    setPlayers(prev => prev.map(p => ({
      ...p,
      tile: 0,
      stats: { correctAnswers: 0, incorrectAnswers: 0 },
      shields: { escudoReptil: false, campoFuerza: false, paseDorado: false, rebote: false },
      modifiers: {
        crioturbina: 0,
        gravedadPesada: false,
        furiaDados: false,
        dadoPlomo: false,
        presionExtrema: false,
        maldicionDoble: false,
        trampaDoble: false,
        tiroAdicional: false
      }
    })));
    setActivePlayerIndex(0);
    setConnections(generateInitialConnections());
    setRound(1);
    setPhase('WAITING_ROLL');
    setTurnStartTile(0);
    setLastRoll(null);
    setWinner(null);
    setActiveQuestion(null);
    setActiveImpactOverlay(null);
    setDiceCenterDisplay(null);
    setEventNotification(null);
    setActiveCardTransformation(null);
    setUsedQuestionIds([]);
    setIsSettingsOpen(false);
    sound.playReset();
  };

  // Mobile Controller View
  if (isMobileMode) {
    return (
      <MobileControllerView
        activePlayer={activePlayer}
        rolling={rolling}
        onRoll={handleRollDice}
        currentQuestion={activeQuestion}
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col justify-between overflow-x-hidden font-sans transition-colors duration-500 ${
      isDarkMode
        ? `${BOARD_THEMES[currentTheme]?.bodyBgClass || 'bg-[#090a0f]'} text-slate-100 selection:bg-rose-600 selection:text-white`
        : 'bg-slate-100 text-slate-900 selection:bg-rose-500 selection:text-white'
    }`}>
      
      {/* Floating Master HUD */}
      <Hud
        activePlayer={activePlayer}
        round={round}
        phase={phase}
        lastRoll={lastRoll}
        rolling={rolling}
        onRoll={handleRollDice}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenQR={() => setIsSettingsOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        allPlayers={players}
        brandConfig={brandConfig}
        isDarkMode={isDarkMode}
        onToggleThemeMode={toggleThemeMode}
      />

      {/* Main Board Space */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 my-auto relative">
        
        {/* High-Impact Center Screen Event Alert Pop-Up (Bloqueo estricto hasta pulsar [ CONTINUAR ]) */}
        <CinematicEventAlert
          notification={eventNotification}
          onDismiss={handleAlertDismiss}
        />

        {/* 50-Tile High-Contrast Terraced Board with 3 Distinct Snakes, Steel Scaffolding, Projectiles & Card Visual Transformations */}
        <Board
          players={players}
          activePlayerIndex={activePlayerIndex}
          connections={connections}
          themeId={currentTheme}
          brandConfig={brandConfig}
          isDarkMode={isDarkMode}
          shockwaveTile={shockwaveTile}
          affectedPlayerAnim={affectedPlayerAnim}
          dissolvingConnectionId={dissolvingConnectionId}
          appearingConnectionId={appearingConnectionId}
          playerAction={playerAction}
          activeProjectile={activeProjectile}
          isMovingBackwards={isMovingBackwards}
          activeCardTransformation={activeCardTransformation}
          onTileClick={(tileNum) => {
            const playersHere = players.filter(p => p.tile === tileNum);
            if (playersHere.length > 0) {
              showBlockingAlert(`Casilla ${tileNum}: Ocupada por ${playersHere.map(p => `${p.name} (#${p.number})`).join(', ')}`);
            }
          }}
        />

      </main>

      {/* 3D Volumetric Dice Modal in Center of Screen */}
      {diceCenterDisplay && (
        <Dice3DCenterModal
          value={diceCenterDisplay.value}
          secondValue={diceCenterDisplay.secondValue}
          onComplete={() => handleDiceRollCompleted(diceCenterDisplay.total)}
        />
      )}

      {/* Question Modal with 3 Options and Strategic Dilemma (Appears ONLY at final destination) */}
      {activeQuestion && phase === 'QUESTION_PENDING' && (
        <QuestionModal
          question={activeQuestion}
          activePlayer={activePlayer}
          rivals={rivals}
          isBlindTimer={activePlayer.modifiers.presionExtrema}
          onChoiceMade={handleStrategicChoiceMade}
        />
      )}

      {/* Cinematic Center Card Impact Overlay (Fixed without countdown, manual button only) */}
      {activeImpactOverlay && (
        <CardImpactOverlay
          card={activeImpactOverlay.card}
          targetPlayer={activeImpactOverlay.targetPlayer}
          onComplete={handleCardExplanationDismissed}
        />
      )}

      {/* Victory Podium Modal */}
      {winner && (
        <VictoryModal
          winner={winner}
          players={players}
          rounds={round}
          themeId={currentTheme}
          brandConfig={brandConfig}
          onRestart={handleResetGame}
          onOpenSettings={() => {
            setWinner(null);
            setIsSettingsOpen(true);
          }}
        />
      )}

      {/* Settings, Teams, Excel and QR Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        players={players}
        onUpdatePlayers={(updated) => setPlayers(updated)}
        questions={questions}
        onUpdateQuestions={(updated) => {
          setQuestions(updated);
          showBlockingAlert(`Banco de preguntas actualizado con ${updated.length} preguntas.`);
        }}
        onResetGame={handleResetGame}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        brandConfig={brandConfig}
        onUpdateBrandConfig={handleUpdateBrandConfig}
      />

    </div>
  );
};

export default App;
