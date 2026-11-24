export type SpeakerId = 'narrator' | 'protagonist' | 'regina' | 'risaa' | 'boy' | 'friend';

export interface DialogueLine {
  speaker: SpeakerId;
  speakerName: string;
  text: string;
}

export interface InteractableMeta {
  id: string;
  chapter: number;
  label: string;
  actionHint: string;
}

export interface MemoryNote {
  id: string;
  chapter: number;
  title: string;
  summary: string;
}

export interface WakeupStepContent {
  step: number;
  speaker: SpeakerId;
  speakerName: string;
  caption: string;
  subnote?: string;
}

export const WAKEUP_SEQUENCE_STEPS: readonly WakeupStepContent[] = [
  {
    step: 0,
    speaker: 'protagonist',
    speakerName: '主人公',
    caption: '終わらない残業。モラハラ。未払い賃金。「もう全部終わらせよう。」――そう呟き、ビルの屋上から飛び降りた。',
    subnote: '…??',
  },
  {
    step: 1,
    speaker: 'narrator',
    speakerName: '目覚め',
    caption: '目を覚ますと、そこには青い空、柔らかな風、そして一人の少女がいた。金色の髪。深い青色の瞳。',
    subnote: '少女は空を見上げている',
  },
  {
    step: 2,
    speaker: 'regina',
    speakerName: '？？？',
    caption: '「……あれ。チクビ飛行機みたいだなぁ。」',
    subnote: '（何言ってるんだこの人。）……だが、その優しい声は人生で初めて自分を否定しなかった。',
  },
  {
    step: 3,
    speaker: 'narrator',
    speakerName: '覚醒',
    caption: '目を閉じる。再び目を開ける。――少女は消えていた。気づけば俺は、この船の南デッキで目を覚ましていた。',
  },
];

export interface EndingStepContent {
  step: number;
  speaker: SpeakerId;
  speakerName: string;
  caption: string;
  subnote?: string;
}

export const ENDING_SEQUENCE_STEPS: readonly EndingStepContent[] = [
  {
    step: 0,
    speaker: 'regina',
    speakerName: '金髪の少女',
    caption: '「待って」',
    subnote: '青空の草原へ一歩踏み出したとき、後ろから呼び止める声がした。',
  },
  {
    step: 1,
    speaker: 'protagonist',
    speakerName: '主人公',
    caption: '「ありがとう。」',
    subnote: '振り返ると、そこには金色の髪と深い青色の瞳を持つ少女が立っていた。',
  },
  {
    step: 2,
    speaker: 'regina',
    speakerName: 'れじーな',
    caption: '少女は何も言わず、ただ優しくほほ笑んだ。',
    subnote: '青空と柔らかな風が、二人の新しい時間を祝福している。',
  },
];

export const SPEAKER_STYLES: Record<SpeakerId, { badgeBg: string; border: string; nameColor: string }> = {
  narrator: {
    badgeBg: 'bg-slate-800/90',
    border: 'border-slate-500/40',
    nameColor: 'text-slate-200',
  },
  protagonist: {
    badgeBg: 'bg-sky-950/90',
    border: 'border-sky-400/50',
    nameColor: 'text-sky-300',
  },
  regina: {
    badgeBg: 'bg-amber-950/90',
    border: 'border-amber-400/60',
    nameColor: 'text-amber-300',
  },
  risaa: {
    badgeBg: 'bg-cyan-950/90',
    border: 'border-cyan-300/60',
    nameColor: 'text-cyan-200',
  },
  boy: {
    badgeBg: 'bg-emerald-950/90',
    border: 'border-emerald-400/50',
    nameColor: 'text-emerald-300',
  },
  friend: {
    badgeBg: 'bg-rose-950/90',
    border: 'border-rose-400/50',
    nameColor: 'text-rose-200',
  },
};

export const CHAPTER_TITLES: Record<number, string> = {
  1: '第1章：屋上からの目覚めと一万年前の予言',
  2: '第2章：五百歳の友情と生意気な弟子',
  3: '第3章：魔王への変貌と天空の鍵',
  4: '第4章：チンチン侍と深海の対なる遺物',
  5: '第5章：聖なる猫の覚醒とツイ廃への進化',
  6: '第6章：同じ時間を生き、百年後の草原へ',
};

export const INTERACTABLE_META: Record<string, InteractableMeta> = {
  // Zone A & H: Chapter 1 (South Awakening Deck & Sky Balcony)
  salaryman_desk: {
    id: 'salaryman_desk',
    chapter: 1,
    label: '社畜の残業デスクとタイムカード',
    actionHint: '現代日本の記憶を読む',
  },
  overtime_drawer: {
    id: 'overtime_drawer',
    chapter: 1,
    label: '未払い給与明細の引き出し',
    actionHint: '苦しい日々の記録を調べる',
  },
  rooftop_fence: {
    id: 'rooftop_fence',
    chapter: 1,
    label: 'ビルの屋上フェンスの記憶碑',
    actionHint: 'あの日立った場所を辿る',
  },
  sky_sketch: {
    id: 'sky_sketch',
    chapter: 1,
    label: '青い空と少女のスケッチ画架',
    actionHint: '裏面の碑文を読む',
  },
  boundary_door: {
    id: 'boundary_door',
    chapter: 1,
    label: '現実と異世界の境界扉',
    actionHint: '4桁の封印錠を操作する',
  },

  // Zone B: Chapter 1, 3, 5 & 6 (Central Atrium)
  prophecy_stele: {
    id: 'prophecy_stele',
    chapter: 1,
    label: '勇者リ・サーの予言碑',
    actionHint: '一万年前の予言を読む',
  },
  history_bookshelf: {
    id: 'history_bookshelf',
    chapter: 1,
    label: '古文書と戦火の書庫',
    actionHint: '発見から喪失までの歴史を調べる',
  },
  war_chronicle_desk: {
    id: 'war_chronicle_desk',
    chapter: 1,
    label: '神話化の年代記デスク',
    actionHint: '文明が予言を忘れた記録を読む',
  },
  myth_globe: {
    id: 'myth_globe',
    chapter: 1,
    label: '四千年を照らす星儀台',
    actionHint: 'ただ一人信じ続けた者の記録を読む',
  },
  west_gate: {
    id: 'west_gate',
    chapter: 1,
    label: '西翼・歴史配列ゲート',
    actionHint: '歴史の年代順に並べ替えて開く',
  },
  east_gate: {
    id: 'east_gate',
    chapter: 3,
    label: '東翼・天空の紋章扉',
    actionHint: '天空の鍵で開く',
  },
  altar: {
    id: 'altar',
    chapter: 5,
    label: '中央祭壇：フライジェット・チ・クビ',
    actionHint: '調べる / 二つの遺物を共鳴させる',
  },
  evolution_pillar: {
    id: 'evolution_pillar',
    chapter: 5,
    label: 'Twitter人・進化の試練碑',
    actionHint: 'ツイ廃への誓約を確かめる',
  },
  final_monument: {
    id: 'final_monument',
    chapter: 6,
    label: '草原へ続く百年の記憶碑',
    actionHint: '最後の封印の刻文を読む',
  },
  escape_hatch: {
    id: 'escape_hatch',
    chapter: 6,
    label: '青空への脱出ハッチ',
    actionHint: '封印を解く / 草原へ出る',
  },

  // Zone C: Chapter 2 (West Inner Conservatory)
  apple_tree: {
    id: 'apple_tree',
    chapter: 2,
    label: '枯れないリンゴの木',
    actionHint: '五百歳の記憶に触れる',
  },
  friend_table: {
    id: 'friend_table',
    chapter: 2,
    label: '最初の友人との古い食卓',
    actionHint: '遺された二つの約束を読む',
  },
  basket_plate: {
    id: 'basket_plate',
    chapter: 2,
    label: '分け合ったリンゴの籠',
    actionHint: '二人で食べた数を確かめる',
  },
  withered_flower_pot: {
    id: 'withered_flower_pot',
    chapter: 2,
    label: '喪失の歳月を刻む鉢植え',
    actionHint: '立ち直れなかった月日を読む',
  },
  greenhouse_lock: {
    id: 'greenhouse_lock',
    chapter: 2,
    label: '追憶のリンゴ小箱',
    actionHint: '4桁錠を合わせる',
  },
  chalkboard: {
    id: 'chalkboard',
    chapter: 2,
    label: '弟子の研究黒板',
    actionHint: '生意気な少年の問いを読む',
  },
  apprentice_bed: {
    id: 'apprentice_bed',
    chapter: 2,
    label: '年老いた弟子の寝台日誌',
    actionHint: '最期の日の記憶を辿る',
  },
  age_ledger: {
    id: 'age_ledger',
    chapter: 2,
    label: '六十八年の通学帳',
    actionHint: '少年が大人になり老いるまでを読む',
  },
  demon_gate: {
    id: 'demon_gate',
    chapter: 2,
    label: '奥西翼・魔王の聖域門',
    actionHint: '弟子の歳月の暗号で開く',
  },

  // Zone F & Zone I: Chapter 3 (Demon Sanctum & Starlit Observatory)
  village_rumor_board: {
    id: 'village_rumor_board',
    chapter: 3,
    label: '街の噂が刻まれた掲示板',
    actionHint: '「チクビ飛行機おばさん」の記録を読む',
  },
  twilight_mirror: {
    id: 'twilight_mirror',
    chapter: 3,
    label: '歪んだ優しさの鏡',
    actionHint: 'なぜ世界を管理しようとしたのかを知る',
  },
  demon_throne: {
    id: 'demon_throne',
    chapter: 3,
    label: '魔王の玉座',
    actionHint: '孤独な決意の記憶を読む',
  },
  demon_seal_pedestal: {
    id: 'demon_seal_pedestal',
    chapter: 3,
    label: '魔王の誓約台座',
    actionHint: '変貌の真実を解き明かす',
  },
  twitter_census_pillar: {
    id: 'twitter_census_pillar',
    chapter: 3,
    label: 'Twitter人・人口推移の石柱',
    actionHint: '長命種の減衰史を読む',
  },
  star_observatory_desk: {
    id: 'star_observatory_desk',
    chapter: 3,
    label: '最後の生存者の観測机',
    actionHint: '四千年の孤独を解く鍵を読む',
  },
  relic_vault: {
    id: 'relic_vault',
    chapter: 3,
    label: '天空の鍵の保管庫',
    actionHint: '4桁論理錠を解く',
  },
  ch5_oracle_stele: {
    id: 'ch5_oracle_stele',
    chapter: 5,
    label: '共鳴と進化の啓示碑',
    actionHint: '第5章到達後に試練の真実を読む',
  },

  // Zone D, G & J: Chapter 4 (East Propulsion, Deep-Sea Hangar & Abyssal Turbine Dock)
  chinchin_samurai: {
    id: 'chinchin_samurai',
    chapter: 4,
    label: 'チンチン侍の甲冑台座',
    actionHint: '銘板の動力方程式を読む',
  },
  determination_window: {
    id: 'determination_window',
    chapter: 4,
    label: '青空を望む決意の展望窓',
    actionHint: '主人公の想いを確かめる',
  },
  tsukkomi_scroll: {
    id: 'tsukkomi_scroll',
    chapter: 4,
    label: 'ツッコミと適応の巻物',
    actionHint: 'この世界への向き合い方を読む',
  },
  valve_console: {
    id: 'valve_console',
    chapter: 4,
    label: '古代エーテル4連バルブ制御盤',
    actionHint: '方程式を解いて外東翼門を開く',
  },
  hangar_gate: {
    id: 'hangar_gate',
    chapter: 4,
    label: '深海格納庫への隔壁扉',
    actionHint: '扉の状態を確認する',
  },
  dark_monitor_shrine: {
    id: 'dark_monitor_shrine',
    chapter: 4,
    label: '冷たい画面と残業の幻影卓',
    actionHint: 'かつての孤独な日常を見つめる',
  },
  warm_breeze_duct: {
    id: 'warm_breeze_duct',
    chapter: 4,
    label: '柔らかな風と優しい声の吹出口',
    actionHint: '初めて否定されなかった瞬間を想う',
  },
  compass_calibrator: {
    id: 'compass_calibrator',
    chapter: 4,
    label: '四方位の記憶羅針盤',
    actionHint: '船の東西南北と記憶を合わせる',
  },
  submarina_blueprint: {
    id: 'submarina_blueprint',
    chapter: 4,
    label: '対なる遺物の青写真台',
    actionHint: 'チンポ・サブマリーナの解除法を読む',
  },
  ether_reactor_core: {
    id: 'ether_reactor_core',
    chapter: 4,
    label: '深海反応炉・反転共鳴盤',
    actionHint: '4桁の反転暗号を入力する',
  },
  submarina_dock: {
    id: 'submarina_dock',
    chapter: 4,
    label: 'チンポ・サブマリーナ格納台',
    actionHint: '遺物の封印状態を確認する',
  },
};

export const MEMORY_CATALOG: Record<string, MemoryNote> = {
  // Ch 1 (4)
  salaryman_desk: {
    id: 'salaryman_desk',
    chapter: 1,
    title: '終わらない残業と未払い',
    summary: '一日の残業は五時間、未払いの月日は三ヶ月。誰も手を差し伸べてはくれなかった。',
  },
  rooftop_fence: {
    id: 'rooftop_fence',
    chapter: 1,
    title: '八階の屋上と青い空',
    summary: '八階の屋上から飛び降りて目覚めた先には、青い空と柔らかな風、そして二つの深い青色の瞳を持つ少女がいた。',
  },
  prophecy_stele: {
    id: 'prophecy_stele',
    chapter: 1,
    title: '勇者リ・サーの予言',
    summary: '約一万年前、世界を救った勇者リ・サーは「フライジェット・チ・クビ」「天空の鍵」「対となる存在」の予言を残して倒れた。',
  },
  history_bookshelf: {
    id: 'history_bookshelf',
    chapter: 1,
    title: '大戦による喪失と神話化',
    summary: '遺物が発見された後に戦争で研究資料は失われ、文明が発展すると人々は予言を神話として忘れていった。',
  },

  // Ch 2 (4)
  apple_tree: {
    id: 'apple_tree',
    chapter: 2,
    title: '五百歳の友人と別れ',
    summary: 'れじーなは五百歳の頃に初めて人間の友達ができた。友人が亡くなったあと、彼女は四十年もの間立ち直れなかった。',
  },
  friend_table: {
    id: 'friend_table',
    chapter: 2,
    title: '分け合ったリンゴと誓い',
    summary: '籠にあった六つのリンゴを二人で三つずつ分け合い、友人は「世界を託す」「木を枯らさない」という二つの願いを残した。',
  },
  chalkboard: {
    id: 'chalkboard',
    chapter: 2,
    title: '十二歳の生意気な弟子',
    summary: '「チクビは飛ばねえだろ？」と突っかかってきた少年は十二歳。れじーなは解明するために研究を続けた。',
  },
  apprentice_bed: {
    id: 'apprentice_bed',
    chapter: 2,
    title: '六十八年後の最期の問い',
    summary: '少年は青年・大人・老人になっても毎日通い、六十八年が過ぎて八十歳で寝たきりになり「チクビ飛行機ってなんなんだ」と問い残して逝った。',
  },

  // Ch 3 (4)
  village_rumor_board: {
    id: 'village_rumor_board',
    chapter: 3,
    title: 'チクビ飛行機おばさん',
    summary: '周囲からそう呼ばれても彼女は怒らず、「いつか分かるまで研究するよ」と笑い続けていた。',
  },
  twilight_mirror: {
    id: 'twilight_mirror',
    chapter: 3,
    title: '魔王になったたった一つの理由',
    summary: '人間が大好きだからこそ死に耐えられず、「誰も死なないように私が世界を管理すればいい」というたった一つの歪んだ優しさが彼女を魔王にした。',
  },
  twitter_census_pillar: {
    id: 'twitter_census_pillar',
    chapter: 3,
    title: '長命種「Twitter人」の滅亡',
    summary: '数千年単位で生きる種族の人口は減少し続け、およそ四千歳のれじーなが最後の生き残りとなった。',
  },
  star_observatory_desk: {
    id: 'star_observatory_desk',
    chapter: 3,
    title: '四千年の鍵の論理',
    summary: '千年の孤独の首位、少年の齢を成す十の位の数と一の位の数を足した数、老いた弟子の齢を十で割りし数、魔王を生んだ想いの数――それが天空の鍵を開く。',
  },

  // Ch 4 (6)
  chinchin_samurai: {
    id: 'chinchin_samurai',
    chapter: 4,
    title: 'チンチン侍の動力方程式',
    summary: '翼は最小の素数、海は翼に一を足した数、空は海の二倍、猫は空に一を足した数。空・海・猫・翼の順に動力盤を合わせる。',
  },
  determination_window: {
    id: 'determination_window',
    chapter: 4,
    title: '前の世界よりも好きな場所',
    summary: '「仕方ないですね。手伝いますよ。私も、この世界、前の世界よりも好きなので。」――逃げてきた世界ではなく、選んだ世界だった。',
  },
  dark_monitor_shrine: {
    id: 'dark_monitor_shrine',
    chapter: 4,
    title: '二つの世界の対比',
    summary: '現代の冷たい画面と残業の日々に対し、青い空の下で聞こえた柔らかな声だけは自分を否定しなかった。',
  },
  warm_breeze_duct: {
    id: 'warm_breeze_duct',
    chapter: 4,
    title: '船の四方位が示す記憶',
    summary: '南は墜落と目覚め、西は四千年の孤独、東は侍と覚悟の動力室、北は百年後の青空へと続いている。',
  },
  submarina_blueprint: {
    id: 'submarina_blueprint',
    chapter: 4,
    title: '鏡映しの反転暗号',
    summary: '空を翔ける天空の鍵と海を潜る対なる遺物。天空の鍵を解いた四桁を末尾から逆順に読めば、深海反応炉が開く。',
  },
  ether_reactor_core: {
    id: 'ether_reactor_core',
    chapter: 4,
    title: 'チンポ・サブマリーナ',
    summary: 'あまりにも酷い名前だが、一万年前の予言が告げた「対となる存在」そのものだった。',
  },

  // Ch 5 (4)
  altar: {
    id: 'altar',
    chapter: 5,
    title: '聖なる「猫」への融合',
    summary: '二つの遺物が一つになって現れたのは猫の姿だった。光の中から現れたリ・サーは「初めまして。母親によく似てるな」と微笑んだ。',
  },
  myth_globe: {
    id: 'myth_globe',
    chapter: 5,
    title: '「これでいい。」',
    summary: '四千年追い続けた英雄はれじーなにとって初対面だった。だが役目を終えたリ・サーは「これでいい。」と言い残し光と灰になって消えた。',
  },
  evolution_pillar: {
    id: 'evolution_pillar',
    chapter: 5,
    title: '進化形態「ツイ廃」',
    summary: '世界を救うにはTwitter人の進化形態「ツイ廃」になる必要がある。代償として寿命は大幅に削られ、残された時間は約百年となった。',
  },
  age_ledger: {
    id: 'age_ledger',
    chapter: 5,
    title: '同じ時間を生きられる奇跡',
    summary: 'ずっと誰かを見送る側だったれじーなが、百年の寿命を得たことで初めて主人公と同じ時間を生きられるようになった。',
  },

  // Ch 6 (2)
  final_monument: {
    id: 'final_monument',
    chapter: 6,
    title: '青空の記憶を刻む最終封印',
    summary: 'この飛行機にあるドアの数、今生きているTwitter人の数、金髪の少女がつけているリボンの数、少女と見上げた空にある雲の数――全てが草原の扉を開く。',
  },
  escape_hatch: {
    id: 'escape_hatch',
    chapter: 6,
    title: '青空と柔らかな風の草原',
    summary: '約百年後、穏やかな日々を経た二人は物語の最初と同じ草原へやってきた。「……あれ。チクビ飛行機みたいだな。」',
  },
};

export const DIALOGUES: Record<string, DialogueLine[]> = {
  // Ch 1
  salaryman_desk: [
    {
      speaker: 'narrator',
      speakerName: '残業日報',
      text: '机の上には、現代日本で使っていたボロボロのタイムカードが置かれている。毎日定時後から五時間ものサービス残業が続いていた記録だ。',
    },
    {
      speaker: 'protagonist',
      speakerName: '主人公',
      text: '「誰に助けを求めても、返事はなかったな……まずはこのデッキに残った自分の記憶を整理しよう。」',
    },
  ],
  overtime_drawer: [
    {
      speaker: 'narrator',
      speakerName: '未払い給与の引き出し',
      text: '引き出しの中には督促しても支払われなかった三ヶ月分の給与明細が束になって眠っていた。',
    },
  ],
  rooftop_fence: [
    {
      speaker: 'narrator',
      speakerName: '屋上の記憶碑',
      text: '冷たい鉄柵の感触が蘇る。あの日、俺が踏み出したのは雑居ビルの八階の屋上だった。',
    },
    {
      speaker: 'protagonist',
      speakerName: '主人公',
      text: '「目を覚ましたら青い空と柔らかな風、そして金色の髪の少女が立っていたんだ……。」',
    },
  ],
  sky_sketch: [
    {
      speaker: 'narrator',
      speakerName: '青空のスケッチ',
      text: '画架には、空を飛ぶ雲を見上げる金色の髪と深い青色の瞳を持つ少女が描かれている。一対の瞳がまっすぐに空を映している。',
    },
    {
      speaker: 'narrator',
      speakerName: '画布の裏書',
      text: '裏面にはこう彫られている：『終わらぬ残業の日々、報われぬ月数、踏み出した高み、そして見上げた彼女の瞳――その順に境界の鎖は解かれる』。',
    },
  ],
  boundary_unlocked: [
    {
      speaker: 'narrator',
      speakerName: '境界扉開放',
      text: '境界の封印錠が外れ、巨大な隔壁が開いた！ 目の前には「フライジェット・チ・クビ」が鎮座する中央操縦室が広がっている。',
    },
  ],

  // Ch 1 (Part 2) -> Ch 2
  prophecy_stele: [
    {
      speaker: 'narrator',
      speakerName: '勇者リ・サーの予言',
      text: '約一万年前、世界は一度滅びかけた。その時世界を救った勇者「リ・サー」は、死の間際に予言を残した。',
    },
    {
      speaker: 'risaa',
      speakerName: 'リ・サー',
      text: '「一万年後、世界は再び滅ぶ。それを止める鍵は――『フライジェット・チ・クビ』、『天空の鍵』……そして、その対なる存在――」',
    },
    {
      speaker: 'narrator',
      speakerName: '古代石碑',
      text: 'しかし最も重要な部分を語る前にリ・サーは倒れ、死亡した。',
    },
  ],
  history_bookshelf: [
    {
      speaker: 'narrator',
      speakerName: '古文書と戦火の書庫',
      text: '世界中の人々は何千年もの間、その予言を信じて研究し、ついに「フライジェット・チ・クビ」を発見した。だが誰も使い方が分からなかった。',
    },
    {
      speaker: 'narrator',
      speakerName: '戦火の記録',
      text: 'やがて激しい戦争が起こり、蓄積されていた研究資料はすべて灰となって失われてしまった。',
    },
  ],
  war_chronicle_desk: [
    {
      speaker: 'narrator',
      speakerName: '神話化の年代記',
      text: '資料が失われたあと、やがて時代が進んで文明が発展すると、世界はこう考えるようになった。「そんなものは昔の神話だ」と。',
    },
  ],
  myth_globe: [
    {
      speaker: 'narrator',
      speakerName: '星儀台の記録',
      text: '世界中の誰もが予言を忘れ去った後も、たった一人だけ信じ続けた者がいた。滅びた長命種「Twitter人」の最後の生き残り、れじーなである。',
    },
  ],
  west_gate_unlocked: [
    {
      speaker: 'narrator',
      speakerName: '第2章へ',
      text: '歴史の歯車が噛み合い、西翼・記憶の温室への扉が開かれた！ そこにはれじーなが初めて得た友情と弟子の記憶が眠っている。',
    },
  ],

  // Ch 2
  apple_tree: [
    {
      speaker: 'narrator',
      speakerName: '枯れないリンゴの木',
      text: 'れじーなは五百歳の頃、初めて人間の友達ができた。一緒に食事をし、特にこのリンゴを好んで食べたという。',
    },
    {
      speaker: 'narrator',
      speakerName: '最期の言葉',
      text: 'しかし人間はすぐに死んでしまう。最期の日、友人はれじーなに世界とリンゴの木を託して亡くなった。',
    },
  ],
  friend_table: [
    {
      speaker: 'friend',
      speakerName: '最初の友人',
      text: '「れじーな。この世界をあんたに託すよ。二人でよく食べたりんごの木、枯らさないでおくれよ。」',
    },
    {
      speaker: 'narrator',
      speakerName: '食卓の刻銘',
      text: '遺された二つの願いは、四千年の間ずっと彼女の胸に刻まれ続けた。',
    },
  ],
  basket_plate: [
    {
      speaker: 'narrator',
      speakerName: '分け合ったリンゴの籠',
      text: '小さな籠には収穫された六つのリンゴを、二人の友が同じ数ずつ分け合って食べた記録が残っている。',
    },
  ],
  withered_flower_pot: [
    {
      speaker: 'narrator',
      speakerName: '喪失の歳月',
      text: '最初の友人を失ったあと、れじーなは四十年間もの長いあいだ立ち直ることができなかったという。',
    },
  ],
  greenhouse_unlocked: [
    {
      speaker: 'narrator',
      speakerName: '記憶結晶 獲得',
      text: '追憶のリンゴ小箱が開き、「リンゴの記憶結晶」を手に入れた！ 温室の北側に残された弟子の記憶を辿ろう。',
    },
  ],
  chalkboard: [
    {
      speaker: 'narrator',
      speakerName: '研究黒板',
      text: 'やがてれじーなには十二歳の弟子ができた。少年はとても生意気だった。',
    },
    {
      speaker: 'boy',
      speakerName: '十二歳の弟子',
      text: '「おい！ お前がレジーナか？ なんでチクビ飛行機なんて研究してんだよ！ チクビは飛ばねえだろ？」',
    },
    {
      speaker: 'regina',
      speakerName: 'れじーな',
      text: '「それを解明するために研究してるのさ。」',
    },
  ],
  apprentice_bed: [
    {
      speaker: 'narrator',
      speakerName: '年老いた弟子の寝台日誌',
      text: 'それから少年は毎日研究室へやってきた。青年になっても。大人になっても。老人になっても。八十歳の冬、彼は寝たきりになった。',
    },
    {
      speaker: 'boy',
      speakerName: '老人となった弟子',
      text: '「なあ、結局わかったのか。チクビ飛行機って、なんなんだ？」',
    },
    {
      speaker: 'narrator',
      speakerName: '別れ',
      text: 'れじーなは答えられなかった。そして老人は亡くなった。また一人、彼女の前から人間がいなくなる。',
    },
  ],
  age_ledger: [
    {
      speaker: 'narrator',
      speakerName: '六十八年の通学帳',
      text: '少年の来訪が始まってから寝たきりになるまで、実に六十八年もの月日が流れていた。れじーなにとって一瞬に等しい、かけがえのない年月だった。',
    },
  ],
  demon_gate_unlocked: [
    {
      speaker: 'narrator',
      speakerName: '第3章へ',
      text: '魔王の聖域門が開かれた！ 奥西翼と星見観測所には、れじーながなぜ「魔王」となったのか、その真実と鍵が眠っている。',
    },
  ],

  // Ch 3
  village_rumor_board: [
    {
      speaker: 'narrator',
      speakerName: '街の噂の掲示板',
      text: 'いつしか人々は彼女を「チクビ飛行機おばさん」と呼ぶようになった。だが彼女は少しも怒らず、「いつか分かるまで研究するよ」と笑い続けた。',
    },
  ],
  twilight_mirror: [
    {
      speaker: 'narrator',
      speakerName: '歪んだ優しさの鏡',
      text: '彼女は人間が大好きだった。だからこそ、大切な人が次々と死んでいくことに耐えられなくなったのだ。',
    },
    {
      speaker: 'regina',
      speakerName: 'かつてのれじーな',
      text: '「誰も死なないように、私が全部守ればいい。私が世界を管理すればいい――」',
    },
  ],
  demon_throne: [
    {
      speaker: 'narrator',
      speakerName: '魔王の玉座',
      text: '世界を救うため、人を守るためだったはずのたった一つの優しさが少しずつ歪み、いつしか彼女は「魔王」へと変貌していた。',
    },
  ],
  demon_seal_unlocked: [
    {
      speaker: 'narrator',
      speakerName: '魔王の涙石 獲得',
      text: '「魔王の涙石」を手に入れた！ 最西端の星見観測所でTwitter人の記録を調べ、「天空の鍵」を解放しよう。',
    },
  ],
  twitter_census_pillar: [
    {
      speaker: 'narrator',
      speakerName: 'Twitter人の人口碑',
      text: 'Twitter人は数千年単位で生きる長命種だった。だが人口は徐々に減少し、最後にたった一人だけ残ったのが、およそ四千歳になるれじーなだった。',
    },
  ],
  star_observatory_desk: [
    {
      speaker: 'narrator',
      speakerName: '最後の生存者の観測机',
      text: '保管庫を開く刻文が写されている：『一、千年の孤独を数える首位の数字／二、少年の齢を成す十の位の数と一の位の数を足した数／三、老いし弟子の齢を十で割りし数／四、彼女を魔王に変えた想いの総数』。',
    },
  ],
  vault_unlocked: [
    {
      speaker: 'narrator',
      speakerName: '天空の鍵 獲得',
      text: '「4・3・8・1」の番号で保管庫が開き、蒼く輝く「天空の鍵」を手に入れた！ これで中央操縦室の東側にある「天空の紋章扉」を開けられる！',
    },
  ],
  east_gate_unlocked: [
    {
      speaker: 'narrator',
      speakerName: '第4章へ ― 東翼・動力室開放',
      text: '天空の鍵が紋章と共鳴し、東翼への扉が開かれた！ そこには奇妙な甲冑と青空の展望窓、そして対なる遺物の秘密が待っている。',
    },
  ],

  // Ch 4
  chinchin_samurai: [
    {
      speaker: 'protagonist',
      speakerName: '主人公',
      text: '「『チクビ飛行機！？』『チンチン侍！？』……最初はこの世界のネーミングを本気で疑っていたのに、今ではすっかり慣れてしまったな。」',
    },
    {
      speaker: 'narrator',
      speakerName: '甲冑の銘板',
      text: '銘板の刻文：『翼は最小の素数に等しく、海は翼に一を足した数。空は海を二倍に満たし、猫は空に一を添える。空・海・猫・翼の順に盤を廻せ。』',
    },
  ],
  determination_window: [
    {
      speaker: 'narrator',
      speakerName: '青空を望む決意',
      text: '主人公もまた、前の世界では誰にも理解されなかった。だからこそ、四千年間たった一人で世界を背負ってきたれじーなの孤独が痛いくらいに分かってしまう。',
    },
    {
      speaker: 'protagonist',
      speakerName: '主人公',
      text: '「仕方ないですね。手伝いますよ。私も、この世界、前の世界よりも好きなので。」――逃げてきた場所ではない、初めて自分が好きだと思える世界を見つけた瞬間だった。',
    },
  ],
  tsukkomi_scroll: [
    {
      speaker: 'narrator',
      speakerName: '適応の巻物',
      text: '最初は奇妙で意味が分からないと思っていた世界。だがここには誰かを否定する言葉ではなく、青い空と柔らかな風があった。',
    },
  ],
  hangar_gate_unlocked: [
    {
      speaker: 'narrator',
      speakerName: '深海格納庫 開放',
      text: '4連バルブのエーテル圧力が完全に共鳴し、深海格納庫と最東タービン区への隔壁が開いた！',
    },
  ],
  hangar_gate_locked: [
    {
      speaker: 'narrator',
      speakerName: '深海格納庫への隔壁扉',
      text: '隔壁は堅く閉ざされている。隣にある古代エーテル4連バルブ制御盤を、チンチン侍の銘板通りに合わせる必要がありそうだ。',
    },
  ],
  dark_monitor_shrine: [
    {
      speaker: 'narrator',
      speakerName: '冷たい画面の幻影',
      text: 'かつての世界の記憶が浮かぶ。鳴り止まない業務通知、見下すような視線、誰にも届かなかったSOS。戻りたい場所など、もうどこにもない。',
    },
  ],
  warm_breeze_duct: [
    {
      speaker: 'narrator',
      speakerName: '柔らかな風の吹出口',
      text: 'この船の設計図が記す四つの翼――南は墜落と目覚め、西は四千年の孤独、東は侍と覚悟の動力室、そして北は百年後の青空へ通じる出口だ。',
    },
  ],
  compass_unlocked: [
    {
      speaker: 'narrator',
      speakerName: '記憶羅針盤 調律完了',
      text: '四方位の記憶羅針盤が定まり、最東端・タービン区画にある深海反応炉の制御ロックが解除された！',
    },
  ],
  submarina_blueprint: [
    {
      speaker: 'narrator',
      speakerName: '対なる遺物の青写真',
      text: '設計図の一節にはこう書かれている：『天を翔ける天空の鍵を鏡に映せ。その四桁を末尾から逆順に刻むとき、海を潜る対なる遺物の檻が解かれる。』',
    },
  ],
  ether_reactor_locked_hint: [
    {
      speaker: 'narrator',
      speakerName: '深海反応炉',
      text: 'まずは奥東翼にある記憶羅針盤で四方位の記憶を調律してから反応炉へ触れよう。',
    },
  ],
  submarina_locked: [
    {
      speaker: 'protagonist',
      speakerName: '主人公',
      text: '「『チンポ・サブマリーナ』……！！ 名前はやっぱりアウトだろ！！ でもこれが予言の『対なる存在』に違いない。隣の深海反応炉で防護壁を解除しよう。」',
    },
  ],
  reactor_unlocked: [
    {
      speaker: 'narrator',
      speakerName: '第5章へ ― チンポ・サブマリーナ 獲得',
      text: '反転暗号が反応炉と共鳴し、古代遺物「チンポ・サブマリーナ」を手に入れた！ 急いで中央操縦室の祭壇へ戻り、二つの遺物を一つに合わせよう！',
    },
  ],

  // Ch 5
  altar_incomplete: [
    {
      speaker: 'narrator',
      speakerName: '中央祭壇',
      text: '「フライジェット・チ・クビ」が静かに浮遊している。最西端で「天空の鍵」を、最東端で「チンポ・サブマリーナ」を手に入れれば、共鳴儀式を行える。',
    },
  ],
  altar_fusion: [
    {
      speaker: 'narrator',
      speakerName: '聖なる「猫」の覚醒',
      text: '「フライジェット・チ・クビ」と「チンポ・サブマリーナ」が反応し、二つが一つになって――眩い光の中で「猫」のような形になった！',
    },
    {
      speaker: 'risaa',
      speakerName: 'リ・サーの魂',
      text: '光の中から一万年前に世界を救った英雄が現れ、れじーなを見つめて言った。「初めまして。お前は母親によく似てるな。」',
    },
    {
      speaker: 'regina',
      speakerName: 'れじーな',
      text: '「……！ 四千年間ずっと追い続けてきた英雄と、ようやく会えたのに……彼にとっては『初めまして』なんだね。」',
    },
    {
      speaker: 'risaa',
      speakerName: 'リ・サーの魂',
      text: '役目を終えた英雄の魂は、穏やかな光と灰になって崩れながら、ただ一言――「これでいい。」と言い残して消えていった。',
    },
    {
      speaker: 'narrator',
      speakerName: '進化の試練へ',
      text: '祭壇の北側にある「進化の試練碑」が輝き始めた。世界を救う最後の選択が、れじーなに委ねられる。',
    },
  ],
  evolution_pillar_locked: [
    {
      speaker: 'narrator',
      speakerName: '進化の試練碑',
      text: '石碑はまだ眠っている。まずは中央祭壇で「猫」の覚醒を見届けよう。',
    },
  ],
  evolution_unlocked: [
    {
      speaker: 'narrator',
      speakerName: '第6章へ ― 同じ時間を生きる誓い',
      text: '世界を救うため、れじーなはTwitter人の進化形態「ツイ廃」となった。代償として寿命は大きく削られ、残された時間は約百年。',
    },
    {
      speaker: 'narrator',
      speakerName: '百年という奇跡',
      text: 'ずっと誰かを見送る側だった彼女が、初めて主人公と同じ時間を生きられる。最後の封印碑を確認し、北の脱出ハッチから青空の草原へ出よう！',
    },
  ],
  ch5_oracle_locked: [
    {
      speaker: 'narrator',
      speakerName: '封じられた啓示碑',
      text: '魔王の玉座の反対側に立つ石碑は淡い封印に閉ざされており、まだ文字が読めない。「天空の鍵」と「対なる存在」を揃え、第5章へ辿り着いたときに封印が解かれるようだ。',
    },
  ],
  ch5_oracle_unlocked: [
    {
      speaker: 'narrator',
      speakerName: '第5章・第一の試練の啓示',
      text: '二つの古代遺物がひとつに溶け合うとき、光の中に現れる聖なる姿は猫。現れた勇者リ・サーはれじーなへ、初めまして。母親によく似てるな、と微笑みかけ、役目を終えて消えゆく際に、これでいい。と言い残す。',
    },
    {
      speaker: 'narrator',
      speakerName: '第5章・第二の試練の啓示',
      text: '世界を救うため、れじーなが選ぶTwitter人の進化形態はツイ廃。代償として残された寿命は約100年に削られるが、その選択によって彼女は初めて、主人公と同じ時間を生きることを手に入れるのだ。',
    },
  ],

  // Ch 6
  final_monument: [
    {
      speaker: 'narrator',
      speakerName: '草原へ続く百年の記憶碑',
      text: '刻まれた最後の詩：『この飛行機にあるドアの数、今生きているTwitter人の数、金髪の少女がつけているリボンの数、そして少女と見上げた空にある雲の数――すべてを揃えて外へ出よ。』',
    },
  ],
  hatch_locked_early: [
    {
      speaker: 'narrator',
      speakerName: '脱出ハッチ',
      text: '古代の封印がハッチを閉ざしている。まずは中央祭壇での覚醒と進化の試練碑を終えよう。',
    },
  ],
  hatch_unlocked: [
    {
      speaker: 'narrator',
      speakerName: '脱出ハッチ開放！',
      text: '重い扉が左右へ開き、目の前に柔らかな緑の草原と青い空が広がった！ そのまま北の草原へ踏み出そう！',
    },
  ],
};

export const VICTORY_EPILOGUE_LINES: DialogueLine[] = [
  {
    speaker: 'narrator',
    speakerName: '約百年後',
    text: 'れじーなと主人公は穏やかに日々を過ごし、そして約百年後――二人は物語の最初と同じ、青い空と柔らかな風が吹く草原へやってきた。',
  },
  {
    speaker: 'protagonist',
    speakerName: '主人公',
    text: '「……あれ。チクビ飛行機みたいだな。」',
  },
  {
    speaker: 'narrator',
    speakerName: '―fin―',
    text: 'れじーなが笑う。四千年間追い続けた言葉の果てに彼女が見つけたもの――それは世界を救う方法だけではなく、「誰かと同じ時間を生きること」だった。',
  },
];
