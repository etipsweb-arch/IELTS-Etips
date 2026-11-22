/**
 * ===================================================================
 * IELTS-Etips - Practice Engine Configuration & Master Conversion Tables
 * 
 * IMPORTANT:
 * - This file contains technical configuration, official IELTS band tables,
 *   and empty placeholder content structures for Batches 01 to 20.
 * - Supports 40 Listening questions (Sections 1–4) and 3 Reading Passages
 *   with 40 Reading questions.
 * - All educational content, passages, prompts, audio files, and answer keys
 *   are to be manually supplied by the website owner.
 * - No fake or fabricated questions or answer keys are generated here.
 * ===================================================================
 */

(function (window) {
  'use strict';

  // --- 1. OFFICIAL IELTS RAW SCORE TO BAND CONVERSION TABLES ---
  const LISTENING_BAND_TABLE = [
    { min: 39, max: 40, band: '9.0' },
    { min: 37, max: 38, band: '8.5' },
    { min: 35, max: 36, band: '8.0' },
    { min: 32, max: 34, band: '7.5' },
    { min: 30, max: 31, band: '7.0' },
    { min: 26, max: 29, band: '6.5' },
    { min: 23, max: 25, band: '6.0' },
    { min: 18, max: 22, band: '5.5' },
    { min: 16, max: 17, band: '5.0' },
    { min: 13, max: 15, band: '4.5' },
    { min: 10, max: 12, band: '4.0' },
    { min: 8,  max: 9,  band: '3.5' },
    { min: 6,  max: 7,  band: '3.0' },
    { min: 4,  max: 5,  band: '2.5' },
    { min: 2,  max: 3,  band: '2.0' },
    { min: 0,  max: 1,  band: '1.0' }
  ];

  const READING_ACADEMIC_BAND_TABLE = [
    { min: 39, max: 40, band: '9.0' },
    { min: 37, max: 38, band: '8.5' },
    { min: 35, max: 36, band: '8.0' },
    { min: 33, max: 34, band: '7.5' },
    { min: 30, max: 32, band: '7.0' },
    { min: 27, max: 29, band: '6.5' },
    { min: 23, max: 26, band: '6.0' },
    { min: 19, max: 22, band: '5.5' },
    { min: 15, max: 18, band: '5.0' },
    { min: 13, max: 14, band: '4.5' },
    { min: 10, max: 12, band: '4.0' },
    { min: 8,  max: 9,  band: '3.5' },
    { min: 6,  max: 7,  band: '3.0' },
    { min: 4,  max: 5,  band: '2.5' },
    { min: 2,  max: 3,  band: '2.0' },
    { min: 0,  max: 1,  band: '1.0' }
  ];

  const READING_GENERAL_BAND_TABLE = [
    { min: 40, max: 40, band: '9.0' },
    { min: 39, max: 39, band: '8.5' },
    { min: 37, max: 38, band: '8.0' },
    { min: 36, max: 36, band: '7.5' },
    { min: 34, max: 35, band: '7.0' },
    { min: 32, max: 33, band: '6.5' },
    { min: 30, max: 31, band: '6.0' },
    { min: 27, max: 29, band: '5.5' },
    { min: 23, max: 26, band: '5.0' },
    { min: 19, max: 22, band: '4.5' },
    { min: 15, max: 18, band: '4.0' },
    { min: 12, max: 14, band: '3.5' },
    { min: 9,  max: 11, band: '3.0' },
    { min: 6,  max: 8,  band: '2.5' },
    { min: 3,  max: 5,  band: '2.0' },
    { min: 0,  max: 2,  band: '1.0' }
  ];

  // --- 2. BATCH BUILDER HELPER (40 LISTENING & 3 READING PASSAGES) ---
  function buildDefaultBatch(id) {
    // 4 Listening Sections, total 40 questions
    const listeningSections = [
      {
        sectionNumber: 1,
        title: 'Section 1 (Questions 1–10)',
        instruction: '[Section 1 Instructions Placeholder — Everyday social context conversation]',
        questions: []
      },
      {
        sectionNumber: 2,
        title: 'Section 2 (Questions 11–20)',
        instruction: '[Section 2 Instructions Placeholder — Everyday social context monologue]',
        questions: []
      },
      {
        sectionNumber: 3,
        title: 'Section 3 (Questions 21–30)',
        instruction: '[Section 3 Instructions Placeholder — Educational/training context discussion]',
        questions: []
      },
      {
        sectionNumber: 4,
        title: 'Section 4 (Questions 31–40)',
        instruction: '[Section 4 Instructions Placeholder — Academic subject lecture/monologue]',
        questions: []
      }
    ];

    for (let q = 1; q <= 40; q++) {
      const secIdx = Math.floor((q - 1) / 10);
      listeningSections[secIdx].questions.push({
        number: q,
        prompt: '[Batch ' + id + ' - Listening Question ' + q + ' Prompt Placeholder]'
      });
    }

    // 3 Reading Passages, total 40 questions
    const readingPassages = [
      {
        passageNumber: 1,
        title: '[Batch ' + id + ' - Reading Passage 1 Title Placeholder]',
        questionRange: 'Questions 1–13',
        content: '[Batch ' + id + ' - Reading Passage 1 Text Placeholder — Academic reading texts, paragraphs A–G, diagrams, and reading materials will be loaded here when supplied by the content manager.]',
        questions: []
      },
      {
        passageNumber: 2,
        title: '[Batch ' + id + ' - Reading Passage 2 Title Placeholder]',
        questionRange: 'Questions 14–26',
        content: '[Batch ' + id + ' - Reading Passage 2 Text Placeholder — Academic reading texts, paragraphs A–G, diagrams, and reading materials will be loaded here when supplied by the content manager.]',
        questions: []
      },
      {
        passageNumber: 3,
        title: '[Batch ' + id + ' - Reading Passage 3 Title Placeholder]',
        questionRange: 'Questions 27–40',
        content: '[Batch ' + id + ' - Reading Passage 3 Text Placeholder — Academic reading texts, paragraphs A–G, diagrams, and reading materials will be loaded here when supplied by the content manager.]',
        questions: []
      }
    ];

    for (let q = 1; q <= 13; q++) {
      readingPassages[0].questions.push({
        number: q,
        prompt: '[Batch ' + id + ' - Reading Question ' + q + ' Prompt Placeholder]'
      });
    }
    for (let q = 14; q <= 26; q++) {
      readingPassages[1].questions.push({
        number: q,
        prompt: '[Batch ' + id + ' - Reading Question ' + q + ' Prompt Placeholder]'
      });
    }
    for (let q = 27; q <= 40; q++) {
      readingPassages[2].questions.push({
        number: q,
        prompt: '[Batch ' + id + ' - Reading Question ' + q + ' Prompt Placeholder]'
      });
    }

    return {
      id: id,
      title: 'Batch ' + id,
      audioUrl: '',                  // Path/URL to MP3 (e.g., 'assets/audio/batch-01-listening.mp3')
      readingMode: 'academic',        // 'academic' or 'general'
      listeningAnswerKeys: null,     // null = unconfigured; or { "1": "ans", ... }
      readingAnswerKeys: null,       // null = unconfigured; or { "1": "ans", ... }
      listeningSections: listeningSections,
      readingPassages: readingPassages
    };
  }

  // --- 3. BATCHES 01–20 REPOSITORY ---
  const BATCHES_CONFIG = {};

  for (let i = 1; i <= 20; i++) {
    const id = i < 10 ? '0' + i : String(i);
    BATCHES_CONFIG[id] = buildDefaultBatch(id);
  }

  // =========================================================
  // BATCH 01 — Cambridge IELTS 13 Test 1 (C13T1)
  // Listening: Sections 1–4, Q1–40
  // Audio: assets/Audio/Listening/Batch 01/C13T1 -SECTION -N.mp3
  // Question PDF (Listening): assets/data/listening/batch 01/question batch 01 new.pdf
  // Cookery image: assets/ielts/batch-01/section-1-cookery-table.jpg
  // Reading: Passages 1–3, Q1–40
  // Question PDF (Reading): assets/data/reading/batch 01/question batch 01.pdf
  // Answer Key (Reading): assets/data/reading/batch 01/key answer batch 01.pdf
  // =========================================================

  // --- Batch 01: Listening Question PDF (PDF-Based Practice Engine) ---
  BATCHES_CONFIG['01'].questionPdfUrl = 'assets/data/listening/batch 01/question batch 01 new.pdf';

  // --- Batch 01: Reading Question PDF (PDF-Based Practice Engine) ---
  BATCHES_CONFIG['01'].readingPdfUrl = 'assets/data/reading/batch 01/question batch 01.pdf';
  BATCHES_CONFIG['01'].readingMode = 'academic';

  // --- Batch 01: Reading Answer Keys (Cambridge IELTS 13 Test 1 Academic Reading) ---
  BATCHES_CONFIG['01'].readingAnswerKeys = {
    '1':  'update',
    '2':  'environment',
    '3':  'captain',
    '4':  'films',
    '5':  'season',
    '6':  'accommodation',
    '7':  'blog',
    '8':  'FALSE',
    '9':  'NOT GIVEN',
    '10': 'FALSE',
    '11': 'TRUE',
    '12': 'NOT GIVEN',
    '13': 'TRUE',
    '14': ['iv', 'IV'],
    '15': ['vi', 'VI'],
    '16': ['i', 'I'],
    '17': ['v', 'V'],
    '18': ['viii', 'VIII'],
    '19': ['iii', 'III'],
    '20': 'E',
    '21': 'B',
    '22': 'D',
    '23': 'A',
    '24': 'focus',
    '25': 'pleasure',
    '26': 'curiosity',
    '27': 'B',
    '28': 'C',
    '29': 'C',
    '30': 'D',
    '31': 'A',
    '32': 'D',
    '33': 'A',
    '34': 'E',
    '35': 'C',
    '36': 'G',
    '37': 'B',
    '38': 'YES',
    '39': 'NOT GIVEN',
    '40': 'NO'
  };

  // --- Batch 01: Listening Answer Keys ---
  BATCHES_CONFIG['01'].listeningAnswerKeys = {
    '1':  'choose',
    '2':  'private',
    '3':  ['20', 'twenty percent'],
    '4':  'healthy',
    '5':  'bones',
    '6':  'lecture',
    '7':  'Arretsa',
    '8':  'vegetarian',
    '9':  'market',
    '10': 'knife',
    '11': 'B',
    '12': 'C',
    '13': 'B',
    '14': 'E',
    '15': 'D',
    '16': 'B',
    '17': 'G',
    '18': 'C',
    '19': 'H',
    '20': 'I',
    '21': 'A',
    '22': 'C',
    '23': 'B',
    '24': 'C',
    '25': 'B',
    '26': 'G',
    '27': 'C',
    '28': 'H',
    '29': 'A',
    '30': 'E',
    '31': 'crow',
    '32': 'cliffs',
    '33': 'speed',
    '34': ['brain', 'brains'],
    '35': 'food',
    '36': ['behaviour', 'behaviors', 'behavior', 'behaviours'],
    '37': 'new',
    '38': 'stress',
    '39': ['tail', 'tails'],
    '40': 'permanent'
  };

  // --- Batch 01: Listening Sections (actual content, C13T1) ---
  BATCHES_CONFIG['01'].listeningSections = [
    {
      sectionNumber: 1,
      title: 'Section 1 (Questions 1–10) — Cookery Classes',
      instruction: 'Complete the table below. Write ONE WORD AND/OR A NUMBER for each answer.',
      questions: [
        { number: 1,  prompt: 'The Food Studio: how to ______ and cook with seasonal products.' },
        { number: 2,  prompt: 'The Food Studio: also offers ______ classes.' },
        { number: 3,  prompt: 'The Food Studio: clients who return get a ______ discount.' },
        { number: 4,  prompt: "Bond's Cookery School: food that is ______." },
        { number: 5,  prompt: "Bond's Cookery School: includes recipes to strengthen your ______." },
        { number: 6,  prompt: "Bond's Cookery School: they have a free ______ every Thursday." },
        { number: 7,  prompt: 'The ______ Centre.' },
        { number: 8,  prompt: 'The centre mainly offers ______ food.' },
        { number: 9,  prompt: 'The centre is located near the ______.' },
        { number: 10, prompt: 'A special course in skills with a ______ is sometimes available.' }
      ]
    },
    {
      sectionNumber: 2,
      title: 'Section 2 (Questions 11–20) — Traffic Changes in Granford',
      instruction: 'Questions 11–13: Choose the correct letter, A, B or C.\nQuestions 14–20: Label the map. Write the correct letter, A–I, next to each question.',
      questions: [
        { number: 11, prompt: 'Why are changes needed to traffic systems in Granford?\nA. The number of traffic accidents has risen.\nB. The amount of traffic on the roads has increased.\nC. The types of vehicles on the roads have changed.' },
        { number: 12, prompt: 'In a survey, local residents particularly complained about\nA. dangerous driving by parents.\nB. pollution from trucks and lorries.\nC. inconvenience from parked cars.' },
        { number: 13, prompt: 'According to the speaker, one problem with the new regulations will be\nA. raising money to pay for them.\nB. finding a way to make people follow them.\nC. getting the support of the police.' },
        { number: 14, prompt: 'Map labelling — New traffic lights. Write the correct letter A–I.' },
        { number: 15, prompt: 'Map labelling — Pedestrian crossing. Write the correct letter A–I.' },
        { number: 16, prompt: 'Map labelling — Parking allowed. Write the correct letter A–I.' },
        { number: 17, prompt: "Map labelling — New 'No Parking' sign. Write the correct letter A–I." },
        { number: 18, prompt: 'Map labelling — New disabled parking spaces. Write the correct letter A–I.' },
        { number: 19, prompt: 'Map labelling — Widened pavement. Write the correct letter A–I.' },
        { number: 20, prompt: 'Map labelling — Lorry loading/unloading restrictions. Write the correct letter A–I.' }
      ]
    },
    {
      sectionNumber: 3,
      title: 'Section 3 (Questions 21–30) — Seed Germination',
      instruction: 'Questions 21–25: Choose the correct letter, A, B or C.\nQuestions 26–30: Complete the flow-chart. Choose FIVE answers from the box and write the correct letter, A–H.',
      questions: [
        { number: 21, prompt: 'Why is Jack interested in investigating seed germination?\nA. He may do a module on a related topic later on.\nB. He wants to have a career in plant science.\nC. He is thinking of choosing this topic for his dissertation.' },
        { number: 22, prompt: 'Jack and Emma agree the main advantage of their present experiment is that it can be\nA. described very easily.\nB. carried out inside the laboratory.\nC. completed in the time available.' },
        { number: 23, prompt: 'What do they decide to check with their tutor?\nA. whether their aim is appropriate\nB. whether anyone else has chosen this topic\nC. whether the assignment contributes to their final grade' },
        { number: 24, prompt: "They agree that Graves' book on seed germination is disappointing because\nA. it fails to cover recent advances in seed science.\nB. the content is irrelevant for them.\nC. its focus is very theoretical." },
        { number: 25, prompt: 'What does Jack say about the article on seed germination by Lee Hall?\nA. The diagrams of plant development are useful.\nB. The analysis of seed germination statistics is thorough.\nC. The findings on seed germination after fires are surprising.' },
        { number: 26, prompt: 'Flow-chart — Select seeds of different ______ and sizes.\nOptions: A. container  B. soil  C. weight  D. condition  E. height  F. colour  G. types  H. depths' },
        { number: 27, prompt: 'Flow-chart — Measure and record the ______ and size of each one.\nOptions: A. container  B. soil  C. weight  D. condition  E. height  F. colour  G. types  H. depths' },
        { number: 28, prompt: 'Flow-chart — Decide on the ______ to be used.\nOptions: A. container  B. soil  C. weight  D. condition  E. height  F. colour  G. types  H. depths' },
        { number: 29, prompt: 'Flow-chart — Use a different ______ for each seed and label it.\nOptions: A. container  B. soil  C. weight  D. condition  E. height  F. colour  G. types  H. depths' },
        { number: 30, prompt: "Flow-chart — After about 3 weeks, record the plant's ______.\nOptions: A. container  B. soil  C. weight  D. condition  E. height  F. colour  G. types  H. depths" }
      ]
    },
    {
      sectionNumber: 4,
      title: 'Section 4 (Questions 31–40) — Effects of Urban Environments on Animals',
      instruction: 'Complete the notes below. Write ONE WORD ONLY for each answer.',
      questions: [
        { number: 31, prompt: 'Introduction: the ______ — because of its general adaptability.' },
        { number: 32, prompt: 'Introduction: the pigeon — because walls of city buildings are similar to ______.' },
        { number: 33, prompt: 'Introduction: many urban animals are adapting with unusual ______.' },
        { number: 34, prompt: 'Recent research — Emilie Snell-Rood found the size of their ______ had increased.' },
        { number: 35, prompt: 'Recent research — this may be due to the need to locate new sources of ______ and to deal with new dangers.' },
        { number: 36, prompt: 'Recent research — Catarina Miranda focused on the ______ of urban and rural blackbirds.' },
        { number: 37, prompt: 'Recent research — urban birds were often braver, but were afraid of situations that were ______.' },
        { number: 38, prompt: 'Recent research — some animals respond to ______ by producing lower levels of hormones.' },
        { number: 39, prompt: 'Recent research — urban squirrels use their ______ to help them communicate.' },
        { number: 40, prompt: 'Long-term possibilities — some changes may not be ______.' }
      ]
    }
  ];

  // --- Batch 01: Visual Assets (Cookery table, Granford map, Flowchart) ---
  BATCHES_CONFIG['01'].visualAssets = [
    {
      id: 'section1_cookery_table',
      sectionNumber: 1,
      assetPath: 'assets/ielts/batch-01/section-1-cookery-table.jpg',
      placement: 'before_questions_1_10',
      sourcePage: 1
    },
    {
      id: 'section2_granford_map',
      sectionNumber: 2,
      assetPath: 'assets/ielts/batch-01/section-2-granford-map.jpg',
      placement: 'before_questions_14_20',
      sourcePage: 3
    },
    {
      id: 'section3_experiment_flowchart',
      sectionNumber: 3,
      assetPath: 'assets/ielts/batch-01/section-3-experiment-flowchart.jpg',
      placement: 'before_questions_26_30',
      sourcePage: 5
    }
  ];

  // --- 4. REUSABLE CONFIGURATION METHODS ---
  const IeltsPracticeConfig = {
    listeningBandTable: LISTENING_BAND_TABLE,
    readingAcademicBandTable: READING_ACADEMIC_BAND_TABLE,
    readingGeneralBandTable: READING_GENERAL_BAND_TABLE,
    batches: BATCHES_CONFIG,

    /**
     * Get batch configuration by batch id ('01' to '20')
     */
    getBatch: function (batchId) {
      const cleanId = String(batchId || '01').padStart(2, '0');
      return this.batches[cleanId] || this.batches['01'];
    },

    /**
     * Check if answer keys are configured for a given batch and skill
     */
    hasAnswerKeys: function (batchId, skill) {
      const batch = this.getBatch(batchId);
      if (!batch) return false;
      const keys = skill === 'listening' ? batch.listeningAnswerKeys : batch.readingAnswerKeys;
      return Boolean(keys && typeof keys === 'object' && Object.keys(keys).length > 0);
    },

    /**
     * Convert raw score (0-40) into an official IELTS Band score
     */
    rawToBand: function (rawScore, skill, readingMode) {
      let table = LISTENING_BAND_TABLE;
      if (skill === 'reading') {
        table = (readingMode === 'general') ? READING_GENERAL_BAND_TABLE : READING_ACADEMIC_BAND_TABLE;
      }
      const score = Math.max(0, Math.min(40, parseInt(rawScore, 10) || 0));
      for (let i = 0; i < table.length; i++) {
        if (score >= table[i].min && score <= table[i].max) {
          return table[i].band;
        }
      }
      return '1.0';
    }
  };

  // Expose globally
  window.IeltsPracticeConfig = IeltsPracticeConfig;

})(window);
