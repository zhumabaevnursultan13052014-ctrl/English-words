const baseWords = {
  easy: [
    { en: 'Hello', ru: 'Привет' },
    { en: 'Goodbye', ru: 'Пока' },
    { en: 'Thank you', ru: 'Спасибо' },
    { en: 'Water', ru: 'Вода' },
    { en: 'Book', ru: 'Книга' },
    { en: 'House', ru: 'Дом' },
    { en: 'Family', ru: 'Семья' },
    { en: 'Teacher', ru: 'Учитель' },
    { en: 'School', ru: 'Школа' },
    { en: 'Friend', ru: 'Друг' },
    { en: 'Food', ru: 'Еда' },
    { en: 'Sun', ru: 'Солнце' }
  ],
  normal: [
    { en: 'Window', ru: 'Окно' },
    { en: 'Day', ru: 'День' },
    { en: 'Music', ru: 'Музыка' },
    { en: 'Travel', ru: 'Путешествие' },
    { en: 'Language', ru: 'Язык' },
    { en: 'Market', ru: 'Рынок' },
    { en: 'Weather', ru: 'Погода' },
    { en: 'Dream', ru: 'Мечта' },
    { en: 'Traffic', ru: 'Транспорт' },
    { en: 'Memory', ru: 'Память' },
    { en: 'City', ru: 'Город' },
    { en: 'Future', ru: 'Будущее' }
  ],
  hard: [
    { en: 'Opportunity', ru: 'Возможность' },
    { en: 'Confidence', ru: 'Уверенность' },
    { en: 'Understand', ru: 'Понимать' },
    { en: 'Responsibility', ru: 'Ответственность' },
    { en: 'Experience', ru: 'Опыт' },
    { en: 'Ambition', ru: 'Амбиция' },
    { en: 'Conversation', ru: 'Разговор' },
    { en: 'Courage', ru: 'Мужество' },
    { en: 'Adventure', ru: 'Приключение' },
    { en: 'Knowledge', ru: 'Знание' },
    { en: 'Challenge', ru: 'Вызов' },
    { en: 'Patience', ru: 'Терпение' },
    { en: 'Perspective', ru: 'Перспектива' },
    { en: 'Determination', ru: 'Решимость' },
    { en: 'Cooperation', ru: 'Сотрудничество' },
    { en: 'Innovation', ru: 'Инновация' },
    { en: 'Coordination', ru: 'Координация' },
    { en: 'Recognition', ru: 'Признание' },
    { en: 'Integrity', ru: 'Честность' },
    { en: 'Maturity', ru: 'Зрелость' },
    { en: 'Discipline', ru: 'Дисциплина' },
    { en: 'Sustainability', ru: 'Устойчивость' },
    { en: 'Consequence', ru: 'Последствие' },
    { en: 'Resilience', ru: 'Устойчивость' },
    { en: 'Reflection', ru: 'Размышление' },
    { en: 'Curiosity', ru: 'Любопытство' },
    { en: 'Significance', ru: 'Значимость' },
    { en: 'Compassion', ru: 'Сострадание' },
    { en: 'Transformation', ru: 'Преобразование' },
    { en: 'Negotiation', ru: 'Переговоры' },
    { en: 'Vulnerability', ru: 'Уязвимость' },
    { en: 'Imagination', ru: 'Воображение' },
    { en: 'Motivation', ru: 'Мотивация' },
    { en: 'Leadership', ru: 'Лидерство' },
    { en: 'Achievement', ru: 'Достижение' },
    { en: 'Emotional', ru: 'Эмоциональный' },
    { en: 'Synergy', ru: 'Синергия' }
  ]
};

const MAX_WORDS = 15000;
const MAX_LESSONS = 1500;
const QUIZ_LENGTH = 110;
const maxRoundsPerGame = QUIZ_LENGTH;

const state = {
  difficulty: 'easy',
  deck: [],
  currentIndex: 0,
  score: 0,
  roundStreak: 0,
  dayStreak: 1,
  lastSeenDate: '',
  xp: 0,
  hearts: 3,
  level: 1,
  answered: 0,
  locked: false,
  bestStreak: 0,
  bananaCount: 0,
  laughMeter: 0
};

const soundState = { audioContext: null };

const promptText = document.getElementById('promptText');
const questionType = document.getElementById('questionType');
const optionsContainer = document.getElementById('options');
const feedback = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const xpValue = document.getElementById('xpValue');
const streakValue = document.getElementById('streakValue');
const levelValue = document.getElementById('levelValue');
const heartsValue = document.getElementById('heartsValue');
const lessonProgress = document.getElementById('lessonProgress');
const progressBar = document.getElementById('progressBar');
const resetBtn = document.getElementById('resetBtn');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const pathLabel = document.getElementById('pathLabel');
const pathNodes = document.querySelectorAll('.path-node');
const achievementList = document.getElementById('achievementList');
const todayDate = document.getElementById('todayDate');
const lastActiveDate = document.getElementById('lastActiveDate');
const rewardPanel = document.getElementById('rewardPanel');
const rewardBtn = document.getElementById('rewardBtn');
const monkeyPanel = document.getElementById('monkeyPanel');
const closeMonkeyBtn = document.getElementById('closeMonkeyBtn');
const showMonkeyBtn = document.getElementById('showMonkeyBtn');
const bananaCount = document.getElementById('bananaCount');
const danceMood = document.getElementById('danceMood');
const laughMeter = document.getElementById('laughMeter');
const bananaBtn = document.getElementById('bananaBtn');
const danceBtn = document.getElementById('danceBtn');
const laughBtn = document.getElementById('laughBtn');

function normalizeDifficulty(level) {
  return baseWords[level] ? level : 'easy';
}

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]];
  }
  return copy;
}

function makeOptions(correctRu, pool) {
  const wrong = shuffleArray(pool.filter((value) => value !== correctRu)).slice(0, 3);
  const options = shuffleArray([correctRu, ...wrong]);
  return options;
}

function buildDeck(level) {
  const difficulty = normalizeDifficulty(level);
  const words = baseWords[difficulty];
  const russianPool = [...new Set(words.map((item) => item.ru))];
  const library = Array.from({ length: MAX_WORDS }, (_, index) => {
    const base = words[index % words.length];
    return { en: base.en, ru: base.ru };
  });

  const deck = [];

  for (let i = 0; i < maxRoundsPerGame; i += 1) {
    const base = library[(i * 7 + level.length) % library.length];
    const options = makeOptions(base.ru, russianPool);
    const answerIndex = options.indexOf(base.ru);

    deck.push({
      type: 'translate',
      prompt: `What does "${base.en}" mean in Russian?`,
      options,
      answer: answerIndex,
      explanation: `Correct! "${base.en}" is "${base.ru}".`
    });
  }

  return deck;
}

function getCurrentLessons() {
  return state.deck.slice(0, maxRoundsPerGame);
}

function formatDateKey(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().slice(0, 10);
}

function refreshDayStreak() {
  const todayKey = formatDateKey(new Date());

  if (!state.lastSeenDate) {
    state.lastSeenDate = todayKey;
    state.dayStreak = 1;
    return;
  }

  if (state.lastSeenDate === todayKey) {
    return;
  }

  const lastDate = new Date(`${state.lastSeenDate}T00:00:00`);
  const currentDate = new Date(`${todayKey}T00:00:00`);
  const diffDays = Math.round((currentDate - lastDate) / 86400000);

  if (diffDays === 1) {
    state.dayStreak += 1;
  } else if (diffDays > 1) {
    state.dayStreak = 1;
  }

  state.lastSeenDate = todayKey;
}

function saveProgress() {
  refreshDayStreak();

  const progress = {
    difficulty: state.difficulty,
    score: state.score,
    roundStreak: state.roundStreak,
    dayStreak: state.dayStreak,
    lastSeenDate: state.lastSeenDate,
    xp: state.xp,
    hearts: state.hearts,
    level: state.level,
    currentIndex: state.currentIndex,
    answered: state.answered,
    bestStreak: state.bestStreak
  };

  localStorage.setItem('linguaQuestProgress', JSON.stringify(progress));
}

function loadProgress() {
  const saved = localStorage.getItem('linguaQuestProgress');
  if (!saved) return;

  const progress = JSON.parse(saved);
  Object.assign(state, progress);
  state.difficulty = normalizeDifficulty(state.difficulty);

  if (!state.lastSeenDate) {
    state.lastSeenDate = formatDateKey(new Date());
  }

  refreshDayStreak();
}

function syncDifficultyButtons() {
  difficultyButtons.forEach((button) => {
    const isActive = button.dataset.level === state.difficulty;
    button.classList.toggle('active', isActive);
  });

  pathLabel.textContent = `${state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1)} route`;

  pathNodes.forEach((node) => {
    const nodeLevel = node.dataset.path;
    const isActive = nodeLevel === state.difficulty;
    const isDone = nodeLevel !== state.difficulty && (state.level > 1 || state.xp > 0);
    node.classList.toggle('active', isActive);
    node.classList.toggle('done', isDone);
  });
}

function updateAchievements() {
  const achievements = [
    { label: '⭐ Starter', value: state.xp > 0 ? 'Done' : 'Ready' },
    { label: '🎯 Quiz 10', value: state.answered >= 10 ? 'Clear' : 'Live' },
    { label: '🔥 Streak', value: `${state.dayStreak} days` },
    { label: '🚀 Explorer', value: state.level >= 2 ? 'Level up' : 'Next' },
    { label: '🏆 Master', value: state.level >= 3 ? 'Unlocked' : 'Next' }
  ];

  achievementList.innerHTML = achievements
    .map((item) => `<li><span>${item.label}</span><strong>${item.value}</strong></li>`)
    .join('');
}

function formatDisplayDate(dateString) {
  if (!dateString) return 'Just now';

  const parsed = new Date(`${dateString}T00:00:00`);
  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function updateStats() {
  xpValue.textContent = state.xp;
  streakValue.textContent = state.dayStreak;
  levelValue.textContent = state.level;
  heartsValue.textContent = '❤'.repeat(state.hearts) || '0';

  const currentDate = new Date();
  todayDate.textContent = currentDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  lastActiveDate.textContent = formatDisplayDate(state.lastSeenDate);

  const total = maxRoundsPerGame;
  const progressPercent = (state.answered / total) * 100;
  progressBar.style.width = `${Math.min(progressPercent, 100)}%`;
  lessonProgress.textContent = `Lesson ${Math.min(state.answered + 1, total)} / ${total}`;
}

function updateFunnyGames() {
  const bananaTotal = state.bananaCount || 0;
  bananaCount.textContent = bananaTotal;

  const moods = ['Calm', 'Funky', 'Wild', 'Epic', 'Silly', 'Legend'];
  const moodIndex = Math.min(moods.length - 1, Math.floor(bananaTotal / 3));
  danceMood.textContent = moods[moodIndex];

  const laughValue = Math.min(100, state.laughMeter || 0);
  laughMeter.textContent = `${laughValue}%`;
}

function ensureAudioContext() {
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;

  if (!soundState.audioContext) {
    soundState.audioContext = new AudioCtor();
  }

  if (soundState.audioContext.state === 'suspended') {
    soundState.audioContext.resume();
  }

  return soundState.audioContext;
}

function playTone(frequency, duration, type = 'sine', volume = 0.04, sweep = 0) {
  const context = ensureAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const now = context.currentTime;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);

  if (sweep !== 0) {
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(80, frequency + sweep), now + duration);
  }

  gainNode.gain.setValueAtTime(volume, now);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration);
}

function playCorrectSound() {
  playTone(740, 0.12, 'triangle', 0.05, 90);
  setTimeout(() => playTone(960, 0.12, 'triangle', 0.05, 120), 80);
}

function playWrongSound() {
  playTone(220, 0.18, 'sawtooth', 0.04, -60);
}

function playNextSound() {
  playTone(620, 0.08, 'sine', 0.04, 60);
}

function playResetSound() {
  playTone(420, 0.08, 'square', 0.04, 40);
}

function renderQuestion() {
  const lessons = getCurrentLessons();
  const lesson = lessons[state.currentIndex];

  if (!lesson) {
    showSummary();
    return;
  }

  state.locked = false;
  feedback.className = 'feedback hidden';
  nextBtn.classList.add('hidden');
  optionsContainer.innerHTML = '';

  questionType.textContent = lesson.type === 'translate' ? 'Translate' : 'Build phrase';
  promptText.textContent = lesson.prompt;

  lesson.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.textContent = option;
    button.type = 'button';
    button.addEventListener('click', () => answerQuestion(index));
    optionsContainer.appendChild(button);
  });

  syncDifficultyButtons();
  updateAchievements();
  updateStats();
}

function answerQuestion(index) {
  if (state.locked) return;

  const lessons = getCurrentLessons();
  const lesson = lessons[state.currentIndex];
  const buttons = [...document.querySelectorAll('.option-btn')];
  const isCorrect = index === lesson.answer;

  state.locked = true;
  state.answered += 1;

  buttons.forEach((button, buttonIndex) => {
    button.disabled = true;
    if (buttonIndex === lesson.answer) {
      button.classList.add('correct');
    }
    if (buttonIndex === index && !isCorrect) {
      button.classList.add('wrong');
    }
  });

  if (isCorrect) {
    state.score += 10;
    state.roundStreak += 1;
    state.xp += 25;
    state.bestStreak = Math.max(state.bestStreak, state.roundStreak);
    state.level = Math.max(1, Math.floor(state.xp / 100) + 1);
    feedback.textContent = `Correct! ${lesson.explanation} Daily streak: ${state.dayStreak} days.`;
    feedback.className = 'feedback success';
    playCorrectSound();
  } else {
    state.roundStreak = 0;
    state.hearts = Math.max(0, state.hearts - 1);
    feedback.textContent = `Not quite. ${lesson.explanation} Daily streak: ${state.dayStreak} days.`;
    feedback.className = 'feedback error';
    playWrongSound();
  }

  feedback.classList.remove('hidden');
  nextBtn.classList.remove('hidden');
  nextBtn.textContent = state.currentIndex === lessons.length - 1 ? 'Finish' : 'Next';

  if (state.hearts === 0) {
    nextBtn.textContent = 'Retry';
  }

  saveProgress();
  updateAchievements();
  updateStats();
}

function nextQuestion() {
  const lessons = getCurrentLessons();

  if (state.hearts === 0) {
    playResetSound();
    resetGame();
    return;
  }

  if (state.currentIndex < lessons.length - 1) {
    state.currentIndex += 1;
    playNextSound();
    renderQuestion();
    return;
  }

  playNextSound();
  showSummary();
}

function showSummary() {
  promptText.textContent = `You finished with ${state.xp} XP!`;
  questionType.textContent = 'Summary';
  optionsContainer.innerHTML = '';
  feedback.textContent = `Best streak: ${state.bestStreak} • Day streak: ${state.dayStreak} days • Total score: ${state.score} • 110-lesson challenge complete`;
  feedback.className = 'feedback success';
  feedback.classList.remove('hidden');

  rewardPanel.classList.remove('hidden');
  monkeyPanel.classList.add('hidden');
  rewardBtn.onclick = () => {
    monkeyPanel.classList.remove('hidden');
    rewardPanel.classList.add('hidden');
  };

  nextBtn.textContent = 'Play again';
  nextBtn.classList.remove('hidden');
  nextBtn.onclick = () => resetGame();
}

function startGame(level) {
  state.difficulty = normalizeDifficulty(level);
  state.deck = buildDeck(state.difficulty);
  state.currentIndex = 0;
  state.score = 0;
  state.roundStreak = 0;
  state.xp = 0;
  state.hearts = 3;
  state.level = 1;
  state.answered = 0;
  state.locked = false;
  state.bestStreak = 0;
  rewardPanel.classList.add('hidden');
  monkeyPanel.classList.add('hidden');
  nextBtn.onclick = () => nextQuestion();
  refreshDayStreak();
  saveProgress();
  renderQuestion();
}

function resetGame() {
  playResetSound();
  startGame(state.difficulty);
}

difficultyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    playNextSound();
    startGame(button.dataset.level);
  });
});

nextBtn.onclick = () => nextQuestion();
resetBtn.addEventListener('click', () => resetGame());
showMonkeyBtn.addEventListener('click', () => {
  monkeyPanel.classList.remove('hidden');
});
closeMonkeyBtn.addEventListener('click', () => {
  monkeyPanel.classList.add('hidden');
});

bananaBtn.addEventListener('click', () => {
  state.bananaCount += 1;
  playTone(660, 0.08, 'triangle', 0.04, 60);
  updateFunnyGames();
});

danceBtn.addEventListener('click', () => {
  const moods = ['Funky', 'Wild', 'Epic', 'Silly', 'Legend'];
  const randomMood = moods[Math.floor(Math.random() * moods.length)];
  danceMood.textContent = randomMood;
  playTone(500, 0.12, 'sine', 0.05, 80);
  setTimeout(() => playTone(700, 0.12, 'sine', 0.05, 100), 90);
});

laughBtn.addEventListener('click', () => {
  state.laughMeter = Math.min(100, (state.laughMeter || 0) + 20 + Math.floor(Math.random() * 20));
  playTone(920, 0.11, 'triangle', 0.04, 120);
  updateFunnyGames();
});

loadProgress();
state.difficulty = normalizeDifficulty(state.difficulty);
state.deck = buildDeck(state.difficulty);
syncDifficultyButtons();
updateFunnyGames();
renderQuestion();
