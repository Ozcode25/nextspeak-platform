/**
 * ============================================================================
 * LESSON CONTENT — NextSpeak
 * ============================================================================
 *
 * All lesson content lives in this single file as plain data. To add a new
 * lesson, append one object to the `lessons` array below. Nothing else needs
 * to be changed: the lessons list, lesson pages, quizzes, and progress
 * tracking all pick it up automatically at build time.
 *
 * The types below double as safety checks:
 *  - every quiz question must have exactly 4 options
 *  - `correctIndex` must be 0, 1, 2 or 3
 *
 * Quiz questions should have a clear, single correct answer and a short
 * explanation that teaches something even when the learner answers right.
 */

export type CorrectIndex = 0 | 1 | 2 | 3;

export interface VocabularyItem {
  /** The English word or phrase. */
  term: string;
  /** Simple definition for beginners. */
  definition: string;
  /** Example sentence using the word or phrase. */
  example: string;
}

export interface LessonSection {
  title: string;
  paragraphs: string[];
  /** Optional highlighted example sentences. */
  examples?: string[];
  /** Optional key phrases with their meaning. */
  keyPhrases?: { phrase: string; meaning: string }[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  /** Exactly four answer options. */
  options: [string, string, string, string];
  /** Index of the correct option (0-3). */
  correctIndex: CorrectIndex;
  /** Short teaching feedback shown after answering. */
  explanation: string;
}

export interface Lesson {
  /** URL-safe id, also used for progress tracking. */
  slug: string;
  /** Which week of the original "One-Month English Study" program it belongs to. */
  week: number;
  title: string;
  summary: string;
  level: 'Beginner';
  durationMinutes: number;
  objectives: string[];
  sections: LessonSection[];
  vocabulary: VocabularyItem[];
  tips: string[];
  quiz: QuizQuestion[];
}

export const lessons: Lesson[] = [
  {
    slug: 'greetings-and-introductions',
    week: 1,
    title: 'Greetings and Introductions',
    summary:
      'Say hello, introduce yourself, ask for names, and use polite everyday phrases with confidence.',
    level: 'Beginner',
    durationMinutes: 15,
    objectives: [
      'Greet people at different times of day',
      'Introduce yourself and understand simple introductions',
      'Ask for and give names politely',
      'Use “please”, “thank you” and “excuse me” correctly',
    ],
    sections: [
      {
        title: 'Greetings for any time of day',
        paragraphs: [
          'English speakers greet each other differently depending on the time of day. In the morning you say “Good morning”, in the afternoon “Good afternoon”, and in the evening “Good evening”.',
          '“Hello” and “hi” work at any time. “Hi” is informal — use it with friends, classmates and children. “Hello” is a little more polite and safe in every situation.',
        ],
        examples: [
          'Good morning! How are you today?',
          'Hello, it’s nice to see you again.',
          'Hi, Ana! What’s new?',
        ],
      },
      {
        title: 'Introducing yourself',
        paragraphs: [
          'To give your name, say “My name is…” or the shorter, more natural “I’m…”. When you meet someone for the first time, finish with “Nice to meet you.”',
          'In formal situations — a job interview, a new teacher — people often shake hands and say “How do you do?” The correct answer is also “How do you do?”, but most people simply say “Nice to meet you, too.”',
        ],
        keyPhrases: [
          { phrase: 'My name is Carlos.', meaning: 'Formal way to give your name.' },
          { phrase: 'I’m Valeria.', meaning: 'Informal, natural way to give your name.' },
          { phrase: 'Nice to meet you.', meaning: 'Said when you meet someone for the first time.' },
          { phrase: 'This is my friend, Ana.', meaning: 'Introduce another person.' },
        ],
      },
      {
        title: 'Asking for names',
        paragraphs: [
          'To ask someone’s name, say “What’s your name?” (informal) or “May I have your name, please?” (formal). To ask where someone is from: “Where are you from?” Answer with “I’m from…” or “I’m from Venezuela.”',
          'When you don’t hear well, say “Sorry?” or “Could you repeat that, please?” — it is polite and very useful as a beginner.',
        ],
        examples: [
          'A: What’s your name?  B: My name is Lucas. Nice to meet you!',
          'A: Where are you from?  B: I’m from Colombia. And you?',
          'A: Sorry? Could you repeat that, please?  B: Sure — I’m Lucas.',
        ],
      },
    ],
    vocabulary: [
      { term: 'hello', definition: 'A friendly greeting at any time.', example: 'Hello! How are you?' },
      { term: 'good morning', definition: 'Greeting used before noon.', example: 'Good morning, teacher!' },
      { term: 'nice to meet you', definition: 'Polite phrase when meeting someone new.', example: 'This is my sister, Lena. — Nice to meet you!' },
      { term: 'my name is…', definition: 'Formal way to say your name.', example: 'My name is Omar.' },
      { term: 'please', definition: 'Makes a request polite.', example: 'A water, please.' },
      { term: 'thank you', definition: 'Shows gratitude.', example: 'Thank you for your help.' },
      { term: 'excuse me', definition: 'Used to get attention or apologize.', example: 'Excuse me, where is the bus stop?' },
      { term: 'goodbye', definition: 'Said when leaving.', example: 'Goodbye! See you tomorrow.' },
    ],
    tips: [
      'Practice a short self-introduction out loud: “Hi, I’m ___. I’m from ___. Nice to meet you.”',
      '“How do you do?” sounds very formal — with friends, “Nice to meet you” is always right.',
      'Listen for “Nice to meet you, too” — the “too” is important!',
    ],
    quiz: [
      {
        id: 'g1',
        prompt: 'It is 8:00 in the morning. What do you say to your teacher?',
        options: ['Good night', 'Good morning', 'Good evening', 'Good afternoon'],
        correctIndex: 1,
        explanation: 'Before noon we say “Good morning”. “Good night” is used when leaving at night.',
      },
      {
        id: 'g2',
        prompt: 'Complete the sentence: “My name ___ Lucas.”',
        options: ['am', 'is', 'are', 'be'],
        correctIndex: 1,
        explanation: '“My name” is singular, so we use “is”: My name is Lucas.',
      },
      {
        id: 'g3',
        prompt: 'Someone new is standing in front of you. What do you say?',
        options: ['Goodbye!', 'See you later!', 'Nice to meet you.', 'You’re welcome.'],
        correctIndex: 2,
        explanation: '“Nice to meet you” is the standard phrase when meeting someone for the first time.',
      },
      {
        id: 'g4',
        prompt: 'Which question asks for someone’s origin?',
        options: ['What’s your name?', 'How old are you?', 'Where are you from?', 'How are you?'],
        correctIndex: 2,
        explanation: '“Where are you from?” asks about origin. Answer: “I’m from…”',
      },
      {
        id: 'g5',
        prompt: 'You didn’t hear what a person said. What is the polite way to ask again?',
        options: ['What?!', 'Say again now.', 'Sorry? Could you repeat that, please?', 'No.'],
        correctIndex: 2,
        explanation: '“Sorry?” or “Could you repeat that, please?” are polite and very useful for beginners.',
      },
    ],
  },
  {
    slug: 'daily-routines',
    week: 1,
    title: 'Daily Routines and the Present Simple',
    summary:
      'Talk about what you do every day using the present simple tense, time expressions and common routine verbs.',
    level: 'Beginner',
    durationMinutes: 20,
    objectives: [
      'Use the present simple for daily habits',
      'Add -s / -es correctly for he, she and it',
      'Use time expressions like “every day” and “at 7 a.m.”',
      'Ask and answer “What time do you…?”',
    ],
    sections: [
      {
        title: 'Talking about habits',
        paragraphs: [
          'We use the present simple to talk about routines — things we do again and again. The base form of the verb is enough for I, you, we and they.',
          'For he, she and it, add -s (or -es after -o, -sh, -ch, -x): “I work” but “She works”; “I go” but “He goes”.',
        ],
        keyPhrases: [
          { phrase: 'I wake up at 6 a.m.', meaning: 'Routine verb: wake up + time.' },
          { phrase: 'She drinks coffee every morning.', meaning: 'Third person needs -s: drinks.' },
          { phrase: 'We don’t work on Sundays.', meaning: 'Negative with don’t / doesn’t.' },
          { phrase: 'Do you study English every day?', meaning: 'Question with do / does.' },
        ],
        examples: [
          'I wake up at six, take a shower, and have breakfast.',
          'My brother goes to school by bus.',
          'They don’t eat meat.',
        ],
      },
      {
        title: 'Time expressions',
        paragraphs: [
          'Routine sentences usually include a time expression: “every day”, “every morning”, “on Mondays”, “at 7 a.m.”, “twice a week”.',
          'The time expression normally goes at the end of the sentence, or directly before the verb.',
        ],
        examples: [
          'I brush my teeth twice a day.',
          'At night, I read for thirty minutes.',
          'On Saturdays we play football.',
        ],
      },
      {
        title: 'Asking about routines',
        paragraphs: [
          'To ask about routines use “What time do you…?” or “Do you…?”. Answers stay in the present simple.',
        ],
        examples: [
          'A: What time do you get up?  B: I get up at 6:30.',
          'A: Do you watch TV in the evening?  B: Yes, I do. / No, I don’t.',
        ],
      },
    ],
    vocabulary: [
      { term: 'wake up', definition: 'Stop sleeping.', example: 'I wake up at 6 a.m.' },
      { term: 'get up', definition: 'Leave your bed.', example: 'She gets up early on weekdays.' },
      { term: 'take a shower', definition: 'Wash your body in the shower.', example: 'I take a shower every morning.' },
      { term: 'have breakfast', definition: 'Eat the first meal of the day.', example: 'We have breakfast at 7.' },
      { term: 'go to work / school', definition: 'Travel to your job or school.', example: 'He goes to work by train.' },
      { term: 'study', definition: 'Learn about a subject.', example: 'I study English every day.' },
      { term: 'have dinner', definition: 'Eat the evening meal.', example: 'My family has dinner at 8 p.m.' },
      { term: 'go to bed', definition: 'Go to sleep.', example: 'I go to bed at 10:30.' },
    ],
    tips: [
      'Say your day as a story: “First I wake up, then I…, and finally I…” — it builds fluency fast.',
      'Don’t forget the -s for he/she/it: “He plays”, not “He play”.',
      '“Every day” (two words) is an adverb; “everyday” (one word) means “ordinary”.',
    ],
    quiz: [
      {
        id: 'r1',
        prompt: 'Choose the correct sentence:',
        options: ['She go to work at 7.', 'She goes to work at 7.', 'She going to work at 7.', 'She is go to work at 7.'],
        correctIndex: 1,
        explanation: 'With “she” we add -s to the verb: she goes.',
      },
      {
        id: 'r2',
        prompt: 'Complete: “I ___ English every evening.”',
        options: ['studies', 'study', 'studying', 'am study'],
        correctIndex: 1,
        explanation: 'With “I” we use the base form: I study.',
      },
      {
        id: 'r3',
        prompt: 'What is the correct question?',
        options: ['Do you get up early?', 'Are you get up early?', 'Does you get up early?', 'You get up early?'],
        correctIndex: 0,
        explanation: 'Present simple questions use do/does + subject + base verb: “Do you get up early?”',
      },
      {
        id: 'r4',
        prompt: 'Complete: “We don’t ___ TV on school nights.”',
        options: ['watchs', 'watching', 'watch', 'watches'],
        correctIndex: 2,
        explanation: 'After don’t we use the base verb: don’t watch.',
      },
      {
        id: 'r5',
        prompt: 'Which word belongs in “I have breakfast ___ 7 a.m.”?',
        options: ['in', 'on', 'at', 'to'],
        correctIndex: 2,
        explanation: 'We use “at” with clock times: at 7 a.m.',
      },
    ],
  },
  {
    slug: 'describing-people',
    week: 2,
    title: 'Describing People',
    summary:
      'Use the verb “be”, common adjectives and the right word order to describe family and friends.',
    level: 'Beginner',
    durationMinutes: 20,
    objectives: [
      'Use am / is / are correctly',
      'Use common adjectives for personality and appearance',
      'Put adjectives in the right place in a sentence',
      'Describe a person in three or four sentences',
    ],
    sections: [
      {
        title: 'The verb “be”',
        paragraphs: [
          'The verb “be” is the most important verb in English. It changes with the subject: I am, he/she/it is, you/we/they are.',
          'In contractions, “I’m”, “he’s”, “they’re” are very common when speaking.',
        ],
        keyPhrases: [
          { phrase: 'She is tall.', meaning: 'Description with is + adjective.' },
          { phrase: 'They are friendly.', meaning: 'Plural subject uses are.' },
          { phrase: 'I’m from Mexico.', meaning: 'Short introduction with be.' },
        ],
      },
      {
        title: 'Appearance and personality adjectives',
        paragraphs: [
          'Adjectives describe nouns and never change form — there is no “-s” for plural: “tall boy” and “tall boys”.',
          'Order matters: opinion first, then fact: “a nice tall person”, not “a tall nice person”.',
        ],
        examples: [
          'My sister is tall and thin, with long black hair.',
          'My grandfather is short but very strong.',
          'My best friend is kind, funny and a little shy.',
        ],
      },
      {
        title: 'Describing with “have”',
        paragraphs: [
          'Use “have / has” for hair, eyes and glasses: “She has blue eyes.” “He has short hair.”',
          'For nationalities and jobs: “He is Brazilian.” “She is a nurse.”',
        ],
        examples: [
          'Luna has curly hair and brown eyes.',
          'My uncle is a doctor and he is very patient.',
        ],
      },
    ],
    vocabulary: [
      { term: 'tall / short', definition: 'Height: tall = high, short = low.', example: 'My brother is tall.' },
      { term: 'young / old', definition: 'Age.', example: 'My grandparents are old.' },
      { term: 'friendly', definition: 'Kind and nice to people.', example: 'The teacher is very friendly.' },
      { term: 'funny', definition: 'Makes people laugh.', example: 'He tells funny stories.' },
      { term: 'shy', definition: 'Quiet around new people.', example: 'Lia is shy at first, but very nice.' },
      { term: 'hard-working', definition: 'Works a lot and with care.', example: 'She is hard-working and always passes her exams.' },
      { term: 'beautiful / handsome', definition: 'Very nice to look at.', example: 'He is a handsome young man.' },
      { term: 'curly hair', definition: 'Hair with curls.', example: 'My cousin has curly hair.' },
    ],
    tips: [
      'Remember: adjectives never change. “She is tall. They are tall.”',
      'Use “but” to contrast: “He is short but very strong.”',
      'Describe a photo out loud for one minute — pause less, worry less.',
    ],
    quiz: [
      {
        id: 'd1',
        prompt: 'Complete: “My friends ___ very friendly.”',
        options: ['is', 'am', 'are', 'be'],
        correctIndex: 2,
        explanation: '“My friends” is plural, so we use “are”.',
      },
      {
        id: 'd2',
        prompt: 'Which sentence is correct?',
        options: ['She have long hair.', 'She has long hair.', 'She having long hair.', 'She is have long hair.'],
        correctIndex: 1,
        explanation: 'With “she” we use “has”: She has long hair.',
      },
      {
        id: 'd3',
        prompt: 'Choose the correct adjective order:',
        options: ['a tall nice teacher', 'a nice tall teacher', 'a teacher tall nice', 'nice teacher a tall'],
        correctIndex: 1,
        explanation: 'In English, opinion comes before fact: “a nice tall teacher”.',
      },
      {
        id: 'd4',
        prompt: 'Complete: “I ___ shy, but my sister ___ confident.”',
        options: ['is / are', 'am / is', 'are / is', 'am / are'],
        correctIndex: 1,
        explanation: 'I am…; she is… → “I am shy, but my sister is confident.”',
      },
      {
        id: 'd5',
        prompt: 'Which word describes someone who makes you laugh?',
        options: ['friendly', 'funny', 'shy', 'tall'],
        correctIndex: 1,
        explanation: '“Funny” means making people laugh. “Friendly” means kind to others.',
      },
    ],
  },
  {
    slug: 'places-in-town',
    week: 2,
    title: 'Places in Town',
    summary:
      'Use “there is / there are”, prepositions of place and city vocabulary to talk about where things are.',
    level: 'Beginner',
    durationMinutes: 20,
    objectives: [
      'Say what exists in a place with there is / there are',
      'Use prepositions: next to, between, behind, in front of',
      'Name common places in a city',
      'Ask for and give simple directions',
    ],
    sections: [
      {
        title: 'There is and there are',
        paragraphs: [
          'To say that a place has something, use “there is” for one thing and “there are” for more than one. In questions: “Is there a bank near here?” and “Are there any supermarkets around?”',
          'The negative forms are “there isn’t” and “there aren’t”.',
        ],
        examples: [
          'There is a beautiful park near my house.',
          'There are three restaurants on this street.',
          'There isn’t a hospital in this neighborhood.',
        ],
      },
      {
        title: 'Prepositions of place',
        paragraphs: [
          'Prepositions tell us where something is: “next to” (beside), “between” (in the middle of two), “behind” (at the back), “in front of” (at the front), “across from” (on the other side).',
        ],
        keyPhrases: [
          { phrase: 'The bank is next to the supermarket.', meaning: 'Beside it.' },
          { phrase: 'The pharmacy is between the bank and the school.', meaning: 'In the middle of two places.' },
          { phrase: 'The bus stop is across from the park.', meaning: 'On the other side of the street.' },
        ],
      },
      {
        title: 'Asking for directions',
        paragraphs: [
          'To ask: “Excuse me, where is the nearest bank?” or “How do I get to the train station?”',
          'To answer: “Go straight two blocks. Turn left. It’s on your right.”',
        ],
        examples: [
          'A: Excuse me, is there a bank near here?  B: Yes, go straight and turn left — it’s next to the mall.',
        ],
      },
    ],
    vocabulary: [
      { term: 'bank', definition: 'Place where people keep money.', example: 'I need to go to the bank.' },
      { term: 'supermarket', definition: 'Large shop for food and goods.', example: 'The supermarket is open until 9.' },
      { term: 'pharmacy', definition: 'Shop where you buy medicine.', example: 'The pharmacy is next to the corner.' },
      { term: 'hospital', definition: 'Place where sick people are treated.', example: 'The hospital is on Main Street.' },
      { term: 'library', definition: 'Place with books you can borrow.', example: 'I study at the library.' },
      { term: 'bus stop', definition: 'Place where the bus stops.', example: 'The bus stop is in front of the school.' },
      { term: 'go straight', definition: 'Continue without turning.', example: 'Go straight for two blocks.' },
      { term: 'turn left / right', definition: 'Change direction.', example: 'Turn right at the corner.' },
    ],
    tips: [
      'Draw a simple map of your neighborhood in English and describe it.',
      'Remember: one place → “there is”; two or more → “there are”.',
      '“Excuse me, …” makes any question polite — use it every time.',
    ],
    quiz: [
      {
        id: 'p1',
        prompt: 'Complete: “___ a hospital near my house.”',
        options: ['There is', 'There are', 'It is', 'Has'],
        correctIndex: 0,
        explanation: 'One place → “There is a hospital…”.',
      },
      {
        id: 'p2',
        prompt: 'Complete: “___ two supermarkets on this street.”',
        options: ['There is', 'There are', 'There be', 'It are'],
        correctIndex: 1,
        explanation: 'Two or more places → “There are…”.',
      },
      {
        id: 'p3',
        prompt: 'The bank is ___ the school and the pharmacy. (in the middle)',
        options: ['next to', 'between', 'behind', 'across'],
        correctIndex: 1,
        explanation: '“Between” is used for something in the middle of two places.',
      },
      {
        id: 'p4',
        prompt: 'You are at a bus stop. A library is directly behind you. How do you say it?',
        options: ['The library is in front of the bus stop.', 'The library is next to the bus stop.', 'The library is behind the bus stop.', 'The library is between the bus stop.'],
        correctIndex: 2,
        explanation: 'If it is at the back of the bus stop, “the library is behind the bus stop”.',
      },
      {
        id: 'p5',
        prompt: 'Which is the polite way to ask about a place?',
        options: ['Bank where?', 'Hey, bank?!', 'Excuse me, where is the nearest bank?', 'You know the bank?'],
        correctIndex: 2,
        explanation: '“Excuse me, where is…?” is polite and complete.',
      },
    ],
  },
  {
    slug: 'talking-about-the-past',
    week: 3,
    title: 'Talking About the Past',
    summary:
      'Use the past simple to talk about yesterday, last weekend and other finished times — with regular and irregular verbs.',
    level: 'Beginner',
    durationMinutes: 25,
    objectives: [
      'Form the past simple of regular verbs (-ed)',
      'Use common irregular verbs: went, ate, saw, had',
      'Talk about yesterday and last weekend',
      'Use negative and question forms: didn’t + base verb',
    ],
    sections: [
      {
        title: 'Regular verbs: add -ed',
        paragraphs: [
          'For finished actions in the past, use the past simple. Regular verbs add -ed: work → worked, play → played, watch → watched.',
          'If the verb ends in -e, add only -d (like → liked). If it ends in consonant + y, change y to ied (study → studied).',
        ],
        examples: [
          'Yesterday I played football and watched a movie.',
          'She studied English for two hours.',
          'We visited our grandparents last Sunday.',
        ],
      },
      {
        title: 'Irregular verbs: learn them in pairs',
        paragraphs: [
          'Many common verbs are irregular — their past form must be learned: go → went, eat → ate, see → saw, have → had, buy → bought, take → took, come → came.',
          'A good trick: learn them inside sentences, not alone: “I went to the park. I ate an ice cream.”',
        ],
        keyPhrases: [
          { phrase: 'I went to the store yesterday.', meaning: 'go → went' },
          { phrase: 'She ate pizza for dinner.', meaning: 'eat → ate' },
          { phrase: 'We saw a great movie last night.', meaning: 'see → saw' },
          { phrase: 'He had a busy day.', meaning: 'have → had' },
        ],
      },
      {
        title: 'Negatives and questions',
        paragraphs: [
          'For negatives and questions, the past simple uses “did” + the BASE verb (never -ed after did): “I didn’t watch TV.” “Did you play football?”',
          'To ask about time in the past: “When did you arrive?” — answer with a past time: “I arrived at 5 p.m.”',
        ],
        examples: [
          'I didn’t go to school yesterday — I was sick.',
          'A: Did you study for the test?  B: Yes, I did. / No, I didn’t.',
        ],
      },
    ],
    vocabulary: [
      { term: 'yesterday', definition: 'The day before today.', example: 'I called you yesterday.' },
      { term: 'last week / weekend', definition: 'The previous week or weekend.', example: 'We traveled last week.' },
      { term: 'went (go)', definition: 'Past of go.', example: 'She went to the market.' },
      { term: 'ate (eat)', definition: 'Past of eat.', example: 'We ate at a restaurant.' },
      { term: 'saw (see)', definition: 'Past of see.', example: 'I saw your teacher downtown.' },
      { term: 'had (have)', definition: 'Past of have.', example: 'They had a great time.' },
      { term: 'didn’t', definition: 'did not — for past negatives.', example: 'I didn’t understand the question.' },
      { term: 'ago', definition: 'Counting back in time.', example: 'He left ten minutes ago.' },
    ],
    tips: [
      'Write three sentences about yesterday before bed — every day for a week.',
      'After “didn’t”, always use the base verb: “I didn’t went” is wrong.',
      'Irregular verbs are easiest to learn in short stories, not lists.',
    ],
    quiz: [
      {
        id: 't1',
        prompt: 'Complete: “Yesterday we ___ a great movie.”',
        options: ['see', 'sees', 'saw', 'seen'],
        correctIndex: 2,
        explanation: 'Past of “see” is irregular: saw.',
      },
      {
        id: 't2',
        prompt: 'Which is the correct past form of “play”?',
        options: ['playd', 'played', 'plaied', 'playing'],
        correctIndex: 1,
        explanation: 'Regular verbs add -ed: play → played.',
      },
      {
        id: 't3',
        prompt: 'Choose the correct negative:',
        options: ['I didn’t went to school.', 'I didn’t go to school.', 'I don’t went to school.', 'I not went to school.'],
        correctIndex: 1,
        explanation: 'After “didn’t” use the base verb: didn’t go.',
      },
      {
        id: 't4',
        prompt: 'What is the correct question?',
        options: ['Did you ate pizza?', 'Do you ate pizza?', 'Did you eat pizza?', 'You ate pizza?'],
        correctIndex: 2,
        explanation: 'After “did”, use the base verb: Did you eat pizza?',
      },
      {
        id: 't5',
        prompt: 'Complete: “They ___ a lot of fun at the party last night.”',
        options: ['have', 'had', 'haved', 'has'],
        correctIndex: 1,
        explanation: 'Past of “have” is “had”.',
      },
    ],
  },
  {
    slug: 'plans-for-the-future',
    week: 4,
    title: 'Plans for the Future',
    summary:
      'Express future plans with “be going to”, talk about intentions, and finish the course with a review of everything you learned.',
    level: 'Beginner',
    durationMinutes: 25,
    objectives: [
      'Make plans with “be going to”',
      'Use will for quick predictions and offers',
      'Talk about tomorrow, next week and next year',
      'Review the basics from all four weeks',
    ],
    sections: [
      {
        title: 'Be going to: plans and intentions',
        paragraphs: [
          'For plans you already decided, use “am / is / are going to” + base verb. The subject comes first: “I am going to study English this summer.”',
          'Contractions are common: I’m going to, she’s going to, they’re going to.',
        ],
        examples: [
          'I’m going to visit my grandparents next weekend.',
          'She’s going to start a new course in January.',
          'We aren’t going to travel this year.',
        ],
      },
      {
        title: 'Will for predictions and offers',
        paragraphs: [
          'Use “will” + base verb for predictions about the future (“It will rain tomorrow”) and for spontaneous offers (“I’ll help you!”).',
          'To form questions: “Will you come to my party?” Short answer: “Yes, I will.” / “I won’t.”',
        ],
        keyPhrases: [
          { phrase: 'I think it will be sunny tomorrow.', meaning: 'Prediction with will.' },
          { phrase: 'I’ll carry that for you.', meaning: 'Spontaneous offer.' },
          { phrase: 'Will you help me, please?', meaning: 'Question with will.' },
        ],
      },
      {
        title: 'Time expressions for the future',
        paragraphs: [
          'Future sentences usually include a time expression: tomorrow, next week, next month, next year, this evening, in two days.',
          'Don’t forget the -ing for going to plans with action verbs: “going to travel”, not “going to traveled”.',
        ],
        examples: [
          'Next year I’m going to learn to drive.',
          'Tomorrow I will finish my homework.',
        ],
      },
      {
        title: 'Course review: you can now…',
        paragraphs: [
          'Congratulations — you reached the end of the One-Month English Study! In four weeks you learned to greet people and introduce yourself, talk about daily routines, describe people and places, tell stories about the past, and now make plans for the future.',
          'The best next step: retake each quiz, then keep learning one new thing every day — a song, a video, a short conversation.',
        ],
      },
    ],
    vocabulary: [
      { term: 'tomorrow', definition: 'The day after today.', example: 'I’m meeting Ana tomorrow.' },
      { term: 'next week / month', definition: 'The coming week or month.', example: 'We’re going to move next month.' },
      { term: 'going to', definition: 'Expresses a decided plan.', example: 'She’s going to study medicine.' },
      { term: 'will', definition: 'Expresses prediction or offer.', example: 'I think you will pass.' },
      { term: 'maybe', definition: 'Perhaps.', example: 'Maybe I’ll go to the party.' },
      { term: 'hope', definition: 'Wish for something good.', example: 'I hope to visit Italy one day.' },
      { term: 'vacation', definition: 'Time off from work or school.', example: 'Our vacation starts in July.' },
      { term: 'goal', definition: 'Something you want to achieve.', example: 'My goal is to speak English fluently.' },
    ],
    tips: [
      'Tell a friend your plans every Monday: “This week I’m going to…”',
      'Going to = decided plan; will = prediction or offer. That difference is enough for beginners.',
      'Retake earlier quizzes — repetition is how languages stick.',
    ],
    quiz: [
      {
        id: 'f1',
        prompt: 'Complete: “This summer I ___ going to study English.”',
        options: ['is', 'am', 'are', 'be'],
        correctIndex: 1,
        explanation: '“I” goes with “am”: I am going to (I’m going to).',
      },
      {
        id: 'f2',
        prompt: 'Choose the correct plan sentence:',
        options: ['She going to travel next week.', 'She is going to travel next week.', 'She is go to travel next week.', 'She goes traveling next week.'],
        correctIndex: 1,
        explanation: 'Full form: subject + is + going to + base verb.',
      },
      {
        id: 'f3',
        prompt: 'Which sentence is a prediction with “will”?',
        options: ['I’m going to cook dinner tonight.', 'I will cook dinner tonight.', 'I think it will rain tomorrow.', 'I am cook tomorrow.'],
        correctIndex: 2,
        explanation: '“I think it will rain tomorrow” predicts the future — a perfect use of “will”.',
      },
      {
        id: 'f4',
        prompt: 'Complete: “___ you come to my birthday party?”',
        options: ['Do', 'Are', 'Will', 'Did'],
        correctIndex: 2,
        explanation: 'Future questions with will: “Will you come…?”',
      },
      {
        id: 'f5',
        prompt: 'Which time expression refers to the future?',
        options: ['yesterday', 'two days ago', 'last night', 'next month'],
        correctIndex: 3,
        explanation: '“Next month” refers to the future; the others are all past times.',
      },
    ],
  },
];

export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function getAdjacentLessons(slug: string): { previous?: Lesson; next?: Lesson } {
  const index = lessons.findIndex((lesson) => lesson.slug === slug);
  return {
    previous: index > 0 ? lessons[index - 1] : undefined,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : undefined,
  };
}

/** Total number of quiz questions across every lesson. */
export const totalQuizQuestions = lessons.reduce((sum, lesson) => sum + lesson.quiz.length, 0);
