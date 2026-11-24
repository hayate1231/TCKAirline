import { TOTAL_MEMORY_COUNT, type GameState } from '../game/escapeLogic';
import { CHAPTER_TITLES, MEMORY_CATALOG } from '../game/storyData';

interface PuzzleModalsProps {
  gameState: GameState;
  onStepDigit: (
    target: 'boundary' | 'greenhouse' | 'apprentice' | 'vault' | 'reactor' | 'finale',
    index: 0 | 1 | 2 | 3,
    delta: 1 | -1,
  ) => void;
  onSubmitBoundary: () => void;
  onSwapTimeline: (idxA: number, idxB: number) => void;
  onSubmitTimeline: () => void;
  onSubmitGreenhouse: () => void;
  onSubmitApprentice: () => void;
  onSelectDemonSeal: (slot: 0 | 1 | 2, value: string) => void;
  onSubmitDemonSeal: () => void;
  onSubmitVault: () => void;
  onStepValve: (index: 0 | 1 | 2 | 3, delta: 1 | -1) => void;
  onCycleCompass: (slot: 0 | 1 | 2 | 3) => void;
  onSubmitCompass: () => void;
  onSubmitReactor: () => void;
  onSelectResonance: (slot: 0 | 1 | 2, value: string) => void;
  onSubmitResonance: () => void;
  onSelectEvolution: (slot: 0 | 1 | 2, value: string) => void;
  onSubmitEvolution: () => void;
  onSubmitFinale: () => void;
  onCloseModal: () => void;
}

const TIMELINE_EVENTS = [
  { id: 0, title: '約一万年前：勇者リ・サーが世界を救い、予言を残して倒れる' },
  { id: 1, title: '「フライジェット・チ・クビ」発見後、戦争により資料が失われる' },
  { id: 2, title: '文明の発展とともに、人々が予言を「昔の神話」として忘れていく' },
  { id: 3, title: '滅びた長命種「Twitter人」の最後の生き残り・れじーなが信じ続ける' },
] as const;

const DEMON_SEAL_QUESTIONS = [
  {
    slot: 0 as const,
    prompt: '問1：街の人々から「チクビ飛行機おばさん」と呼ばれたとき、彼女はどう振る舞ったか？',
    choices: ['怒らず笑い、研究を続けた', '怒って町を封印した', '研究を捨てて姿を消した'],
  },
  {
    slot: 1 as const,
    prompt: '問2：大切な人を失い続けた末に芽生えた、彼女を魔王へと変えた決意は？',
    choices: ['誰も死なないよう自分が世界を管理する', 'すべての人間を滅ぼす', '歴史そのものを巻き戻す'],
  },
  {
    slot: 2 as const,
    prompt: '問3：その変貌の根底にあった、たった一つの感情の正体は？',
    choices: ['人間への歪んだ優しさ', '消えない憎悪', '永遠への退屈'],
  },
] as const;

const VALVE_LABELS = [
  { name: '空のバルブ', symbol: '空', color: 'text-sky-300 border-sky-400/40' },
  { name: '海のバルブ', symbol: '海', color: 'text-teal-300 border-teal-400/40' },
  { name: '猫のバルブ', symbol: '猫', color: 'text-emerald-300 border-emerald-400/40' },
  { name: '翼のバルブ', symbol: '翼', color: 'text-amber-300 border-amber-400/40' },
] as const;

const COMPASS_MEMORIES = [
  '現代日本からの墜落と青い空の目覚め',
  '五百歳の友情、弟子との歳月、魔王の孤独',
  'チンチン侍の試練と主人公の決意',
  '百年の余生を経て二人が踏み出す草原',
] as const;

const RESONANCE_QUESTIONS = [
  {
    slot: 0 as const,
    prompt: '問1：二つの古代遺物が一つになったとき、現れる姿は？',
    choices: ['龍', '猫', '鳥'],
  },
  {
    slot: 1 as const,
    prompt: '問2：光の中から現れた勇者リ・サーが、れじーなにかけた最初の言葉は？',
    choices: ['ようやく会えたな', '初めまして。母親によく似てるな', 'あとは頼んだぞ'],
  },
  {
    slot: 2 as const,
    prompt: '問3：役目を終えた英雄の魂が、光と灰になって消える際に遺した一言は？',
    choices: ['また一万年後に', 'これでいい。', 'さようなら'],
  },
] as const;

const EVOLUTION_QUESTIONS = [
  {
    slot: 0 as const,
    prompt: '問1：世界を救うため、れじーなが選んだTwitter人の進化形態は？',
    choices: ['魔王', 'ツイ廃', '勇者'],
  },
  {
    slot: 1 as const,
    prompt: '問2：進化の代償として寿命が削られた後、彼女に遺された時間はおよそ？',
    choices: ['約100年', '約1000年', '約10年'],
  },
  {
    slot: 2 as const,
    prompt: '問3：ずっと誰かを見送る側だった彼女が、この選択で初めて得られたものは？',
    choices: ['永遠の孤独', '主人公と同じ時間を生きること', '世界を支配する王座'],
  },
] as const;

function FourDigitModal({
  title,
  description,
  submitLabel,
  borderClass,
  titleClass,
  buttonClass,
  accentClass,
  digits,
  statusMessage,
  onStep,
  onSubmit,
  onClose,
}: {
  title: string;
  description: string;
  submitLabel: string;
  borderClass: string;
  titleClass: string;
  buttonClass: string;
  accentClass: string;
  digits: readonly [number, number, number, number];
  statusMessage: string;
  onStep: (idx: 0 | 1 | 2 | 3, delta: 1 | -1) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/75 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full max-w-md max-h-[88vh] overflow-y-auto bg-[#0f172a] border ${borderClass} rounded-xl p-5 sm:p-6 shadow-2xl text-slate-100`}
      >
        <h2 className={`text-lg font-bold font-display ${titleClass}`}>{title}</h2>
        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{description}</p>

        <div className="grid grid-cols-4 gap-2.5 sm:gap-3 my-5">
          {([0, 1, 2, 3] as const).map((idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-2 bg-[#162038] border border-white/10 rounded-lg py-2.5 sm:py-3"
            >
              <button
                type="button"
                aria-label={`${idx + 1}桁目を増やす`}
                onClick={() => onStep(idx, 1)}
                className="w-11 h-10 rounded bg-slate-700 hover:bg-slate-600 text-white font-bold cursor-pointer"
              >
                ▲
              </button>
              <span className={`text-2xl font-bold font-mono-num ${accentClass}`}>
                {digits[idx]}
              </span>
              <button
                type="button"
                aria-label={`${idx + 1}桁目を減らす`}
                onClick={() => onStep(idx, -1)}
                className="w-11 h-10 rounded bg-slate-700 hover:bg-slate-600 text-white font-bold cursor-pointer"
              >
                ▼
              </button>
            </div>
          ))}
        </div>

        {statusMessage && (
          <p className="text-xs text-rose-300 mb-3 text-center">{statusMessage}</p>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm cursor-pointer whitespace-nowrap"
          >
            閉じる
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className={`px-5 py-2.5 rounded-lg font-bold text-sm cursor-pointer whitespace-nowrap ${buttonClass}`}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function ThreeQuestionModal({
  title,
  description,
  submitLabel,
  borderClass,
  titleClass,
  selectedClass,
  submitClass,
  questions,
  answers,
  statusMessage,
  onSelect,
  onSubmit,
  onClose,
}: {
  title: string;
  description: string;
  submitLabel: string;
  borderClass: string;
  titleClass: string;
  selectedClass: string;
  submitClass: string;
  questions: readonly { slot: 0 | 1 | 2; prompt: string; choices: readonly string[] }[];
  answers: readonly [string, string, string];
  statusMessage: string;
  onSelect: (slot: 0 | 1 | 2, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const allChosen = answers.every((a) => a.length > 0);
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/75 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full max-w-lg max-h-[88vh] overflow-y-auto bg-[#0f172a] border ${borderClass} rounded-xl p-5 sm:p-6 shadow-2xl text-slate-100`}
      >
        <h2 className={`text-lg font-bold font-display ${titleClass}`}>{title}</h2>
        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{description}</p>

        <div className="space-y-3.5 my-4">
          {questions.map((q) => (
            <div key={q.slot} className="bg-[#162038] border border-white/10 rounded-lg p-3">
              <p className="text-xs sm:text-sm font-medium text-slate-100 mb-2">{q.prompt}</p>
              <div className="flex flex-col gap-1.5">
                {q.choices.map((choice) => {
                  const selected = answers[q.slot] === choice;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => onSelect(q.slot, choice)}
                      className={`py-2.5 px-3 rounded-md text-left text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
                        selected
                          ? selectedClass
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/10'
                      }`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {statusMessage && (
          <p className="text-xs text-rose-300 mb-3 text-center">{statusMessage}</p>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm cursor-pointer whitespace-nowrap"
          >
            閉じる
          </button>
          <button
            type="button"
            disabled={!allChosen}
            onClick={onSubmit}
            className={`px-5 py-2.5 rounded-lg disabled:opacity-45 disabled:cursor-not-allowed font-bold text-sm cursor-pointer whitespace-nowrap ${submitClass}`}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PuzzleModals({
  gameState,
  onStepDigit,
  onSubmitBoundary,
  onSwapTimeline,
  onSubmitTimeline,
  onSubmitGreenhouse,
  onSubmitApprentice,
  onSelectDemonSeal,
  onSubmitDemonSeal,
  onSubmitVault,
  onStepValve,
  onCycleCompass,
  onSubmitCompass,
  onSubmitReactor,
  onSelectResonance,
  onSubmitResonance,
  onSelectEvolution,
  onSubmitEvolution,
  onSubmitFinale,
  onCloseModal,
}: PuzzleModalsProps) {
  if (gameState.activeModal === 'none') return null;

  switch (gameState.activeModal) {
    case 'boundary':
      return (
        <FourDigitModal
          title="第1章：境界扉の封印錠"
          description="南デッキに残された記憶を辿り、画架の裏書が示す順に四つの数字を合わせよ。"
          submitLabel="境界を開く"
          borderClass="border-sky-400/45"
          titleClass="text-sky-300"
          buttonClass="bg-sky-400 hover:bg-sky-300 text-slate-950"
          accentClass="text-sky-200"
          digits={gameState.boundaryDigits}
          statusMessage={gameState.statusMessage}
          onStep={(idx, d) => onStepDigit('boundary', idx, d)}
          onSubmit={onSubmitBoundary}
          onClose={onCloseModal}
        />
      );

    case 'timeline':
      return (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/75 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="西翼・歴史配列ゲート"
            className="w-full max-w-lg max-h-[88vh] overflow-y-auto bg-[#0f172a] border border-amber-400/45 rounded-xl p-5 sm:p-6 shadow-2xl text-slate-100"
          >
            <h2 className="text-lg font-bold font-display text-amber-300">
              第1章：西翼・歴史配列ゲート
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              中央操縦室の予言碑と書庫の記録を辿り、四つの出来事を古い順に並べ替えよ。
            </p>

            <div className="space-y-2.5 my-5">
              {gameState.timelineOrder.map((eventId, position) => {
                const ev = TIMELINE_EVENTS.find((item) => item.id === eventId) ?? TIMELINE_EVENTS[0];
                return (
                  <div
                    key={eventId}
                    className="flex items-center justify-between gap-2.5 bg-[#162038] border border-white/10 rounded-lg px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 shrink-0 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold font-mono-num flex items-center justify-center">
                        {position + 1}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-100 leading-snug">
                        {ev.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={position === 0}
                        aria-label={`${position + 1}番目を上へ移動`}
                        onClick={() => onSwapTimeline(position, position - 1)}
                        className="w-9 h-9 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-35 disabled:cursor-not-allowed text-white text-xs font-bold cursor-pointer"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={position === 3}
                        aria-label={`${position + 1}番目を下へ移動`}
                        onClick={() => onSwapTimeline(position, position + 1)}
                        className="w-9 h-9 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-35 disabled:cursor-not-allowed text-white text-xs font-bold cursor-pointer"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {gameState.statusMessage && (
              <p className="text-xs text-rose-300 mb-3 text-center">{gameState.statusMessage}</p>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCloseModal}
                className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm cursor-pointer whitespace-nowrap"
              >
                閉じる
              </button>
              <button
                type="button"
                onClick={onSubmitTimeline}
                className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm cursor-pointer whitespace-nowrap"
              >
                歴史を確定する
              </button>
            </div>
          </div>
        </div>
      );

    case 'greenhouse':
      return (
        <FourDigitModal
          title="第2章：追憶のリンゴ小箱"
          description="出会った年齢の百の位・れじーなが食べた果実の数・悲嘆した年数の十の位・託されし誓い――温室の記憶から四つの数を刻め。"
          submitLabel="記憶結晶を取り出す"
          borderClass="border-rose-400/45"
          titleClass="text-rose-300"
          buttonClass="bg-rose-400 hover:bg-rose-300 text-slate-950"
          accentClass="text-rose-200"
          digits={gameState.greenhouseDigits}
          statusMessage={gameState.statusMessage}
          onStep={(idx, d) => onStepDigit('greenhouse', idx, d)}
          onSubmit={onSubmitGreenhouse}
          onClose={onCloseModal}
        />
      );

    case 'apprentice':
      return (
        <FourDigitModal
          title="第2章：魔王の聖域門"
          description="生意気な少年が初めて扉を叩いた齢の十の位と一の位、そして寝台へ倒れるまでに重ねた歳月の十の位と一の位を刻め。"
          submitLabel="聖域門を開く"
          borderClass="border-emerald-400/45"
          titleClass="text-emerald-300"
          buttonClass="bg-emerald-400 hover:bg-emerald-300 text-slate-950"
          accentClass="text-emerald-200"
          digits={gameState.apprenticeDigits}
          statusMessage={gameState.statusMessage}
          onStep={(idx, d) => onStepDigit('apprentice', idx, d)}
          onSubmit={onSubmitApprentice}
          onClose={onCloseModal}
        />
      );

    case 'demon_seal':
      return (
        <ThreeQuestionModal
          title="第3章：魔王の誓約台座"
          description="奥西翼に残された記憶から、なぜ彼女が「魔王」となったのか三つの問いに答えよ。"
          submitLabel="涙石を解き放つ"
          borderClass="border-violet-400/45"
          titleClass="text-violet-300"
          selectedClass="bg-violet-400 text-slate-950 border-violet-200"
          submitClass="bg-violet-400 hover:bg-violet-300 text-slate-950"
          questions={DEMON_SEAL_QUESTIONS}
          answers={gameState.demonSealAnswers}
          statusMessage={gameState.statusMessage}
          onSelect={onSelectDemonSeal}
          onSubmit={onSubmitDemonSeal}
          onClose={onCloseModal}
        />
      );

    case 'vault':
      return (
        <FourDigitModal
          title="第3章：天空の鍵の保管庫"
          description="観測机に写された四つの詩を読み解き、四千年の孤独が守ってきた四桁を導き出せ。"
          submitLabel="解錠する"
          borderClass="border-amber-400/45"
          titleClass="text-amber-300"
          buttonClass="bg-amber-500 hover:bg-amber-400 text-slate-950"
          accentClass="text-amber-200"
          digits={gameState.vaultDigits}
          statusMessage={gameState.statusMessage}
          onStep={(idx, d) => onStepDigit('vault', idx, d)}
          onSubmit={onSubmitVault}
          onClose={onCloseModal}
        />
      );

    case 'valves':
      return (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/75 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="古代エーテル4連バルブ制御盤"
            className="w-full max-w-xl max-h-[88vh] overflow-y-auto bg-[#0f172a] border border-sky-400/45 rounded-xl p-5 sm:p-6 shadow-2xl text-slate-100"
          >
            <h2 className="text-lg font-bold font-display text-sky-300">
              第4章：古代エーテル4連バルブ制御盤
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              チンチン侍の銘板を読み解き、四基のバルブ圧力を正しい数値へと調律せよ。
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
              {([0, 1, 2, 3] as const).map((idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center gap-2 bg-[#162038] border ${VALVE_LABELS[idx].color} rounded-lg py-3 px-2`}
                >
                  <span className="text-xs font-bold whitespace-nowrap">{VALVE_LABELS[idx].symbol}</span>
                  <button
                    type="button"
                    aria-label={`${VALVE_LABELS[idx].name}を増やす`}
                    onClick={() => onStepValve(idx, 1)}
                    className="w-12 h-10 rounded bg-slate-700 hover:bg-slate-600 text-white font-bold cursor-pointer"
                  >
                    ＋
                  </button>
                  <span className="text-2xl font-bold font-mono-num text-white">
                    {gameState.valveLevels[idx]}
                  </span>
                  <button
                    type="button"
                    aria-label={`${VALVE_LABELS[idx].name}を減らす`}
                    onClick={() => onStepValve(idx, -1)}
                    className="w-12 h-10 rounded bg-slate-700 hover:bg-slate-600 text-white font-bold cursor-pointer"
                  >
                    －
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCloseModal}
                className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm cursor-pointer whitespace-nowrap"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      );

    case 'compass':
      return (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/75 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="四方位の記憶羅針盤"
            className="w-full max-w-lg max-h-[88vh] overflow-y-auto bg-[#0f172a] border border-teal-400/45 rounded-xl p-5 sm:p-6 shadow-2xl text-slate-100"
          >
            <h2 className="text-lg font-bold font-display text-teal-300">
              第4章：四方位の記憶羅針盤
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              これまで歩んできた船内の四つの翼と記憶を、正しい方位（北・東・南・西）へ一致させよ。
            </p>

            <div className="space-y-2.5 my-5">
              {([0, 1, 2, 3] as const).map((slot) => (
                <div
                  key={slot}
                  className="flex items-center justify-between gap-3 bg-[#162038] border border-white/10 rounded-lg px-3.5 py-2.5"
                >
                  <span className="text-xs sm:text-sm text-slate-100 leading-snug">
                    {COMPASS_MEMORIES[slot]}
                  </span>
                  <button
                    type="button"
                    aria-label={`${COMPASS_MEMORIES[slot]}の方位を変更`}
                    onClick={() => onCycleCompass(slot)}
                    className="w-14 h-10 shrink-0 rounded-lg bg-teal-900/70 hover:bg-teal-800 border border-teal-400/50 text-teal-200 font-bold text-sm cursor-pointer"
                  >
                    {gameState.compassBearings[slot]}
                  </button>
                </div>
              ))}
            </div>

            {gameState.statusMessage && (
              <p className="text-xs text-rose-300 mb-3 text-center">{gameState.statusMessage}</p>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCloseModal}
                className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm cursor-pointer whitespace-nowrap"
              >
                閉じる
              </button>
              <button
                type="button"
                onClick={onSubmitCompass}
                className="px-5 py-2.5 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm cursor-pointer whitespace-nowrap"
              >
                羅針盤を固定する
              </button>
            </div>
          </div>
        </div>
      );

    case 'reactor':
      return (
        <FourDigitModal
          title="第4章：深海反応炉・反転共鳴盤"
          description="青写真に記された「鏡映しの理」に従い、天空の鍵とは対になる四つの数を刻め。"
          submitLabel="反応炉を解放する"
          borderClass="border-teal-400/45"
          titleClass="text-teal-300"
          buttonClass="bg-teal-400 hover:bg-teal-300 text-slate-950"
          accentClass="text-teal-200"
          digits={gameState.reactorDigits}
          statusMessage={gameState.statusMessage}
          onStep={(idx, d) => onStepDigit('reactor', idx, d)}
          onSubmit={onSubmitReactor}
          onClose={onCloseModal}
        />
      );

    case 'resonance':
      return (
        <ThreeQuestionModal
          title="第5章：中央祭壇・共鳴の試練"
          description="二つの古代遺物を一つへと融合させるため、一万年の予言が結実する真実を答えよ。"
          submitLabel="共鳴儀式を行う"
          borderClass="border-cyan-400/45"
          titleClass="text-cyan-300"
          selectedClass="bg-cyan-400 text-slate-950 border-cyan-200"
          submitClass="bg-cyan-400 hover:bg-cyan-300 text-slate-950"
          questions={RESONANCE_QUESTIONS}
          answers={gameState.resonanceAnswers}
          statusMessage={gameState.statusMessage}
          onSelect={onSelectResonance}
          onSubmit={onSubmitResonance}
          onClose={onCloseModal}
        />
      );

    case 'evolution':
      return (
        <ThreeQuestionModal
          title="第5章：Twitter人・進化の試練碑"
          description="世界を救い、誰かと同じ時間を生きるためにれじーなが選んだ決意を確かめよ。"
          submitLabel="誓約を刻む"
          borderClass="border-emerald-400/45"
          titleClass="text-emerald-300"
          selectedClass="bg-emerald-400 text-slate-950 border-emerald-200"
          submitClass="bg-emerald-400 hover:bg-emerald-300 text-slate-950"
          questions={EVOLUTION_QUESTIONS}
          answers={gameState.evolutionAnswers}
          statusMessage={gameState.statusMessage}
          onSelect={onSelectEvolution}
          onSubmit={onSubmitEvolution}
          onClose={onCloseModal}
        />
      );

    case 'finale_seal':
      return (
        <FourDigitModal
          title="第6章：脱出ハッチ・最終封印"
          description="この飛行機にあるドアの数・今生きているTwitter人の数・金髪の少女のリボンの数・少女と見上げた空の雲の数を刻み、青空の草原へ踏み出せ。"
          submitLabel="青空の扉を開く"
          borderClass="border-amber-300/60"
          titleClass="text-amber-300"
          buttonClass="bg-amber-400 hover:bg-amber-300 text-slate-950"
          accentClass="text-amber-200"
          digits={gameState.finaleDigits}
          statusMessage={gameState.statusMessage}
          onStep={(idx, d) => onStepDigit('finale', idx, d)}
          onSubmit={onSubmitFinale}
          onClose={onCloseModal}
        />
      );

    case 'notebook': {
      const memories = Object.values(MEMORY_CATALOG);
      return (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/75 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="記憶手帖"
            className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-[#0f172a] border border-amber-400/40 rounded-xl p-5 sm:p-6 shadow-2xl text-slate-100"
          >
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <h2 className="text-lg font-bold font-display text-amber-300">
                  記憶手帖（全6章の記録）
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  回収済み：{gameState.discoveredMemories.length} / {TOTAL_MEMORY_COUNT}
                </p>
              </div>
              <button
                type="button"
                onClick={onCloseModal}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer whitespace-nowrap"
              >
                閉じる
              </button>
            </div>

            <div className="overflow-y-auto pr-1 mt-4 space-y-2.5">
              {memories.map((note) => {
                const unlocked = gameState.discoveredMemories.includes(note.id);
                return (
                  <div key={note.id} className="space-y-2.5">
                    <div
                      className={`rounded-lg border px-4 py-3 ${
                        unlocked
                          ? 'bg-[#162038] border-amber-400/30'
                          : 'bg-[#0b1322] border-white/10 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-amber-300">
                          {unlocked ? note.title : '？？？ （未発見の記憶）'}
                        </span>
                        <span className="text-[11px] text-sky-300/90 whitespace-nowrap">
                          {CHAPTER_TITLES[note.chapter]?.split('：')[0] ?? `第${note.chapter}章`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {unlocked
                          ? note.summary
                          : 'この章のオブジェクトを調べると、物語の記憶が記録されます。'}
                      </p>
                    </div>

                    {note.id === 'star_observatory_desk' && gameState.hasSkyKey && (
                      <div className="rounded-lg border bg-sky-950/55 border-sky-400/50 px-4 py-3">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-sky-300">
                            天空の鍵のパスワード（獲得済み記録）
                          </span>
                          <span className="text-[11px] text-sky-300/90 whitespace-nowrap">
                            第3章
                          </span>
                        </div>
                        <p className="text-xs text-slate-100 leading-relaxed">
                          保管庫から「天空の鍵」を手に入れた。導き出された天空の鍵のパスワードは「4・3・8・1」。
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
  }
}
