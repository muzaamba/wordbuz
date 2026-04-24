import React, { useState } from 'react';
import { usePuzzles } from '../context/PuzzleContext';
import PuzzlePlayer from '../components/PuzzlePlayer';
import AdUnit from '../components/AdUnit';
import { Play, Brain, ShieldAlert, Zap, ChevronLeft, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FreePlay = () => {
  const { startPuzzle, activePuzzle, isSolved } = usePuzzles();
  const [difficulty, setDifficulty] = useState(null);

  const puzzles = {
    Fudud: [
      { id: 'e1', question: 'Waa maxay waxa leh furayaal laakiin aan quful lahayn?', answer: ['Kiboodhka', 'Keyboard', 'Kiboodh'], type: 'Qiso (Riddle)', difficulty: 'Fudud', explanation: 'Kiboodhka (Keyboard) wuxuu leeyahay furayaal laakiin waxba ma qufulo.' },
      { id: 'e2', question: 'Waxaan ku hadlaa af la\'aan, waxaanna wax ku maqlaa dhego la\'aan. Waa maxay?', answer: ['Dhawaaq', 'Echo', 'Shanqadh'], type: 'Qiso (Riddle)', difficulty: 'Fudud', explanation: 'Dhawaaqa dib u soo noqda (Echo) ma laha xubno laakiin wuu hadlaa wuuna maqlaa.' },
    ],
    Dhexdhexaad: [
      { id: 'm1', question: 'Soo hel lambarka xiga: 2, 6, 12, 20, ?', answer: ['30'], type: 'Xisaab (Sequence)', difficulty: 'Dhexdhexaad', explanation: 'Farqiga u dhexeeya lambarada wuxuu kordhayaa 2: +4, +6, +8, markaa kan xiga waa +10 (20 + 10 = 30).' },
      { id: 'm2', question: 'Nin ayaa eegaya sawir. Wuxuu yiri "Walaalo ma lihi, laakiin ninka sawirka ku jira aabihiis waa aabahay wiilkiisa." Waa kuma qofka sawirka ku jira?', answer: ['Wiilkiisa', 'His son', 'Son'], type: 'Mantiq (Logic)', difficulty: 'Dhexdhexaad', explanation: '"Aabahay wiilkiisa" maadaama uusan walaalo lahayn, waa isaga. Marka "ninkan aabihiis waa aniga", sawirku waa wiilkiisa.' },
    ],
    Adag: [
      { id: 'h1', question: 'Noolo ma ihi, laakiin waan koraa; sanbabo ma lihi, laakiin hawo ayaan u baahnahay; af ma lihi, laakiin biyaha ayaa i dila. Waa maxay?', answer: ['Dab', 'Fire'], type: 'Mantiq (Lateral)', difficulty: 'Adag', explanation: 'Dabku wuu koraa, oksijiin buu u baahan yahay, biyuhuna way baabiiyaan.' },
      { id: 'h2', question: 'Waa maxay waxa isla marka aad magaciisa sheegto baaba\'a?', answer: ['Aamusnaan', 'Silence'], type: 'Mantiq (Lateral)', difficulty: 'Adag', explanation: 'Marka aad hadasho, aamusnaanta (Silence) way jabtaa.' },
    ]
  };

  const selectDifficulty = (diff) => {
    setDifficulty(diff);
    const pool = puzzles[diff];
    const randomPuzzle = pool[Math.floor(Math.random() * pool.length)];
    startPuzzle(randomPuzzle);
  };

  const difficulties = [
    { 
      id: 'Fudud', 
      icon: <Brain size={28} />, 
      reward: '+5 Dhibcood', 
      desc: 'Hal-xiraalayaal fudud oo kugu tababaraya fikirka degdega ah.',
      time: '10–30 ilbiriqsi',
      colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:border-emerald-300',
      iconClass: 'bg-emerald-100 text-emerald-600',
    },
    { 
      id: 'Dhexdhexaad', 
      icon: <Zap size={28} />, 
      reward: '+10 Dhibcood', 
      desc: 'Mantiq iyo xisaab dhexdhexaad ah. Halkani waa meesha horyaalada lagu tababaro.',
      time: '30–90 ilbiriqsi',
      colorClass: 'text-blue-600 bg-blue-50 border-blue-200 hover:border-blue-300',
      iconClass: 'bg-blue-100 text-blue-600',
    },
    { 
      id: 'Adag', 
      icon: <ShieldAlert size={28} />, 
      reward: '+25 Dhibcood', 
      desc: 'Hal-xiraalayaal aad u adag oo u baahan fikir qoto dheer.',
      time: '2–5 daqiiqo',
      colorClass: 'text-rose-600 bg-rose-50 border-rose-200 hover:border-rose-300',
      iconClass: 'bg-rose-100 text-rose-600',
    }
  ];

  return (
    <div className="px-4 section-padding max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {!difficulty ? (
          <motion.div 
            key="selection"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-10"
          >
            <div className="text-center space-y-4">
              <h1 className="text-3xl sm:text-5xl font-bold text-slate-900">Ciyaar Xor ah</h1>
              <p className="text-slate-800 text-lg max-w-xl mx-auto">
                Doorasho xor ah. Xadeyn la'aan. Tababar maskaxeed oo dhamaystiran.<br/>
                Dooro heerka aad rabto.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {difficulties.map((diff) => (
                <button 
                  key={diff.id}
                  onClick={() => selectDifficulty(diff.id)}
                  className={`text-left border rounded-xl p-6 transition-all duration-200 shadow-sm hover:shadow-md ${diff.colorClass}`}
                >
                  <div className="flex flex-col h-full space-y-4">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${diff.iconClass}`}>
                      {diff.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider mb-1 ">{diff.id}</div>
                      <h3 className="text-xl font-bold">{diff.reward}</h3>
                    </div>
                    <p className="text-slate-800 text-sm flex-1">{diff.desc}</p>
                    <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold pt-2">
                      <Target size={14} /> Waqtiga Qiyaasta: {diff.time}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <AdUnit slotId="freeplay-selector-banner" />
          </motion.div>
        ) : (
          <motion.div 
            key="game"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setDifficulty(null)}
                className="flex items-center gap-2 text-slate-700 font-semibold hover:text-slate-900 transition-colors bg-slate-100 px-4 py-2 rounded-lg"
              >
                <ChevronLeft size={18} />
                Dib U Noqo
              </button>
              <div className="text-slate-700 font-bold px-4 py-2 bg-slate-100 rounded-lg">
                Heerka: <span className="text-brand-600">{difficulty}</span>
              </div>
            </div>

            <PuzzlePlayer />

            <AdUnit slotId="freeplay-game-banner" />

            {isSolved && (
              <div className="pt-4 flex justify-center">
                <button 
                  onClick={() => selectDifficulty(difficulty)}
                  className="btn-primary w-full max-w-sm"
                >
                  <Play size={20} fill="currentColor" />
                  Hal-xiraale Xiga
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FreePlay;
