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

    const batchNum = parseInt(id, 10);
    const questionPdfUrl = (batchNum === 1)
      ? 'assets/data/listening/batch 01/question batch 01 new.pdf'
      : (batchNum >= 2 && batchNum <= 4)
      ? 'assets/data/listening/batch ' + id + '/question batch ' + id + '.pdf'
      : (batchNum >= 5 && batchNum <= 8)
      ? 'assets/data/listening/batch ' + id + '/batch ' + id + '.pdf'
      : '';
    const readingPdfUrl = (batchNum >= 1 && batchNum <= 4)
      ? 'assets/data/reading/batch ' + id + '/question batch ' + id + '.pdf'
      : (batchNum >= 5 && batchNum <= 8)
      ? 'assets/data/reading/batch ' + id + '/batch ' + id + '.pdf'
      : '';
    const writingPdfUrl = (batchNum >= 1 && batchNum <= 8) ? 'assets/data/writing/batch ' + id + '/batch ' + id + '.pdf' : '';
    const speakingPdfUrl = (batchNum >= 1 && batchNum <= 8) ? 'assets/data/speaking/batch ' + id + '/batch ' + id + '.pdf' : '';

    return {
      id: id,
      title: 'Batch ' + id,
      audioUrl: '',                  // Path/URL to MP3 (e.g., 'assets/audio/batch-01-listening.mp3')
      questionPdfUrl: questionPdfUrl,
      readingPdfUrl: readingPdfUrl,
      readingMode: 'academic',        // 'academic' or 'general'
      listeningAnswerKeys: null,     // null = unconfigured; or { "1": "ans", ... }
      readingAnswerKeys: null,       // null = unconfigured; or { "1": "ans", ... }
      writingPdfUrl: writingPdfUrl,
      speakingPdfUrl: speakingPdfUrl,
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
    '8':  ['FALSE', 'F'],
    '9':  ['NOT GIVEN', 'NG'],
    '10': ['FALSE', 'F'],
    '11': ['TRUE', 'T'],
    '12': ['NOT GIVEN', 'NG'],
    '13': ['TRUE', 'T'],
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
    '38': ['YES', 'Y'],
    '39': ['NOT GIVEN', 'NG'],
    '40': ['NO', 'N']
  };

  // --- Batch 01: Listening Answer Keys ---
  BATCHES_CONFIG['01'].listeningAnswerKeys = {
    '1':  'choose',
    '2':  'private',
    '3':  ['20', 'twenty percent', '20%', '20 percent'],
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

  // --- Batch 01: Writing & Speaking Question PDFs ---
  BATCHES_CONFIG['01'].writingPdfUrl = 'assets/data/writing/batch 01/batch 01.pdf';
  BATCHES_CONFIG['01'].speakingPdfUrl = 'assets/data/speaking/batch 01/batch 01.pdf';

  // =========================================================
  // BATCH 02 — Cambridge IELTS 13 Test 2 (C13T2)
  // Listening: Sections 1–4, Q1–40
  // Reading: Passages 1–3, Q1–40
  // =========================================================
  BATCHES_CONFIG['02'].questionPdfUrl = 'assets/data/listening/batch 02/question batch 02.pdf';
  BATCHES_CONFIG['02'].readingPdfUrl = 'assets/data/reading/batch 02/question batch 02.pdf';
  BATCHES_CONFIG['02'].writingPdfUrl = 'assets/data/writing/batch 02/batch 02.pdf';
  BATCHES_CONFIG['02'].speakingPdfUrl = 'assets/data/speaking/batch 02/batch 02.pdf';
  BATCHES_CONFIG['02'].readingMode = 'academic';

  BATCHES_CONFIG['02'].listeningAnswerKeys = {
    '1':  'races',
    '2':  'insurance',
    '3':  'Jerriz',
    '4':  ['25', 'twenty-five', 'twenty five'],
    '5':  'stadium',
    '6':  'park',
    '7':  'coffee',
    '8':  'leader',
    '9':  'route',
    '10': 'lights',
    '11': 'C',
    '12': 'B',
    '13': 'C',
    '14': 'B',
    '15': 'B',
    '16': 'A',
    '17': ['C', 'E'],
    '18': ['C', 'E'],
    '19': ['B', 'D'],
    '20': ['B', 'D'],
    '21': 'B',
    '22': 'A',
    '23': 'C',
    '24': 'C',
    '25': 'A',
    '26': 'A',
    '27': 'C',
    '28': 'D',
    '29': 'G',
    '30': 'B',
    '31': 'location',
    '32': 'world',
    '33': 'personal',
    '34': 'attention',
    '35': 'name',
    '36': 'network',
    '37': 'frequency',
    '38': ['colour', 'color'],
    '39': 'brain',
    '40': 'self'
  };

  BATCHES_CONFIG['02'].readingAnswerKeys = {
    '1':  'oils',
    '2':  'friendship',
    '3':  'funerals',
    '4':  'wealth',
    '5':  'indigestion',
    '6':  'India',
    '7':  'camels',
    '8':  'Alexandria',
    '9':  'Venice',
    '10': ['TRUE', 'T'],
    '11': ['FALSE', 'F'],
    '12': ['NOT GIVEN', 'NG'],
    '13': ['FALSE', 'F'],
    '14': 'B',
    '15': 'F',
    '16': 'B',
    '17': 'E',
    '18': 'A',
    '19': 'B',
    '20': 'C',
    '21': 'animals',
    '22': 'childbirth',
    '23': 'placebo',
    '24': 'game',
    '25': 'strangers',
    '26': 'names',
    '27': 'D',
    '28': 'C',
    '29': 'A',
    '30': 'D',
    '31': 'D',
    '32': 'D',
    '33': 'C',
    '34': 'B',
    '35': 'A',
    '36': 'C',
    '37': 'A',
    '38': 'B',
    '39': 'C',
    '40': 'D'
  };

  // =========================================================
  // BATCH 03 — Cambridge IELTS 13 Test 3 (C13T3)
  // Listening: Sections 1–4, Q1–40
  // Reading: Passages 1–3, Q1–40
  // =========================================================
  BATCHES_CONFIG['03'].questionPdfUrl = 'assets/data/listening/batch 03/question batch 03.pdf';
  BATCHES_CONFIG['03'].readingPdfUrl = 'assets/data/reading/batch 03/question batch 03.pdf';
  BATCHES_CONFIG['03'].writingPdfUrl = 'assets/data/writing/batch 03/batch 03.pdf';
  BATCHES_CONFIG['03'].speakingPdfUrl = 'assets/data/speaking/batch 03/batch 03.pdf';
  BATCHES_CONFIG['03'].readingMode = 'academic';

  BATCHES_CONFIG['03'].listeningAnswerKeys = {
    '1':  '850',
    '2':  ['bike', 'bicycle'],
    '3':  'parking',
    '4':  ['30', 'thirty'],
    '5':  ['weekend', 'weekends'],
    '6':  'cinema',
    '7':  'hospital',
    '8':  'dentist',
    '9':  'Thursday',
    '10': ['café', 'cafe'],
    '11': 'F',
    '12': 'D',
    '13': 'A',
    '14': 'B',
    '15': 'C',
    '16': 'G',
    '17': ['B', 'C'],
    '18': ['B', 'C'],
    '19': ['B', 'D'],
    '20': ['B', 'D'],
    '21': 'C',
    '22': 'A',
    '23': 'A',
    '24': 'B',
    '25': 'C',
    '26': 'F',
    '27': 'H',
    '28': 'D',
    '29': 'A',
    '30': 'E',
    '31': ['tongue', 'tongues'],
    '32': 'plants',
    '33': 'snakes',
    '34': 'sky',
    '35': ['partner', 'partners'],
    '36': 'contact',
    '37': 'protection',
    '38': ['tail', 'tails'],
    '39': 'steps',
    '40': ['injury', 'injuries']
  };

  BATCHES_CONFIG['03'].readingAnswerKeys = {
    '1':  'furniture',
    '2':  'sugar',
    '3':  'ropes',
    '4':  'charcoal',
    '5':  'bowls',
    '6':  'hormones',
    '7':  'cosmetics',
    '8':  'dynamite',
    '9':  ['FALSE', 'F'],
    '10': ['FALSE', 'F'],
    '11': ['NOT GIVEN', 'NG'],
    '12': ['TRUE', 'T'],
    '13': ['NOT GIVEN', 'NG'],
    '14': 'B',
    '15': 'C',
    '16': 'A',
    '17': 'B',
    '18': 'recording devices',
    '19': ['fathers', 'dads', 'father', 'dad'],
    '20': 'bridge hypothesis',
    '21': 'repertoire',
    '22': ['audio-recording vests', 'audio recording vests', 'vests'],
    '23': 'vocabulary',
    '24': 'F',
    '25': 'A',
    '26': 'E',
    '27': 'C',
    '28': 'H',
    '29': 'A',
    '30': 'B',
    '31': 'D',
    '32': 'shells',
    '33': 'lake',
    '34': 'rainfall',
    '35': 'grains',
    '36': 'pottery',
    '37': 'B',
    '38': 'A',
    '39': 'D',
    '40': 'A'
  };

  // =========================================================
  // BATCH 04 — Cambridge IELTS 13 Test 4 (C13T4)
  // Listening: Sections 1–4, Q1–40
  // Reading: Passages 1–3, Q1–40
  // =========================================================
  BATCHES_CONFIG['04'].questionPdfUrl = 'assets/data/listening/batch 04/question batch 04.pdf';
  BATCHES_CONFIG['04'].readingPdfUrl = 'assets/data/reading/batch 04/question batch 04.pdf';
  BATCHES_CONFIG['04'].writingPdfUrl = 'assets/data/writing/batch 04/batch 04.pdf';
  BATCHES_CONFIG['04'].speakingPdfUrl = 'assets/data/speaking/batch 04/batch 04.pdf';
  BATCHES_CONFIG['04'].readingMode = 'academic';

  BATCHES_CONFIG['04'].listeningAnswerKeys = {
    '1':  ['finance', 'Finance'],
    '2':  ['maths', 'math', 'mathematics'],
    '3':  'business',
    '4':  ['17', 'seventeen'],
    '5':  ['holiday', 'holidays', 'vacation', 'vacations'],
    '6':  'college',
    '7':  'location',
    '8':  'jeans',
    '9':  'late',
    '10': 'smile',
    '11': 'A',
    '12': 'B',
    '13': 'A',
    '14': 'C',
    '15': 'A',
    '16': 'B',
    '17': 'B',
    '18': 'D',
    '19': 'A',
    '20': 'E',
    '21': 'A',
    '22': 'A',
    '23': 'C',
    '24': 'C',
    '25': 'B',
    '26': 'A',
    '27': ['B', 'C'],
    '28': ['B', 'C'],
    '29': ['D', 'E'],
    '30': ['D', 'E'],
    '31': 'destruction',
    '32': ['universities', 'university'],
    '33': 'political',
    '34': ['port', 'ports'],
    '35': ['slaves', 'slavery'],
    '36': 'taxation',
    '37': 'sugar',
    '38': 'tea',
    '39': 'transportation',
    '40': 'night'
  };

  BATCHES_CONFIG['04'].readingAnswerKeys = {
    '1':  ['FALSE', 'F'],
    '2':  ['FALSE', 'F'],
    '3':  ['TRUE', 'T'],
    '4':  ['TRUE', 'T'],
    '5':  ['FALSE', 'F'],
    '6':  ['TRUE', 'T'],
    '7':  ['NOT GIVEN', 'NG'],
    '8':  ['TRUE', 'T'],
    '9':  'wool',
    '10': 'navigator',
    '11': 'gale',
    '12': 'training',
    '13': 'fire',
    '14': 'minerals',
    '15': 'carbon',
    '16': 'water',
    '17': 'agriculture',
    '18': 'C',
    '19': 'E',
    '20': 'A',
    '21': 'D',
    '22': 'E',
    '23': 'C',
    '24': 'F',
    '25': 'G',
    '26': 'F',
    '27': 'D',
    '28': 'A',
    '29': 'B',
    '30': 'F',
    '31': 'B',
    '32': 'G',
    '33': 'E',
    '34': 'A',
    '35': ['YES', 'Y'],
    '36': ['NOT GIVEN', 'NG'],
    '37': ['NO', 'N'],
    '38': ['NOT GIVEN', 'NG'],
    '39': ['YES', 'Y'],
    '40': ['NO', 'N']
  };

  // =========================================================
  // BATCH 05 — Cambridge IELTS 14 Test 1 (C14T1)
  // Listening: Sections 1–4, Q1–40
  // Audio: assets/Audio/Listening/Batch 05/C14T1  -SECTION -N.mp3
  // Question PDF (Listening): assets/data/listening/batch 05/batch 05.pdf
  // Question PDF (Reading): assets/data/reading/batch 05/batch 05.pdf
  // Question PDF (Writing): assets/data/writing/batch 05/batch 05.pdf
  // Question PDF (Speaking): assets/data/speaking/batch 05/batch 05.pdf
  // =========================================================
  BATCHES_CONFIG['05'].questionPdfUrl = 'assets/data/listening/batch 05/batch 05.pdf';
  BATCHES_CONFIG['05'].readingPdfUrl = 'assets/data/reading/batch 05/batch 05.pdf';
  BATCHES_CONFIG['05'].writingPdfUrl = 'assets/data/writing/batch 05/batch 05.pdf';
  BATCHES_CONFIG['05'].speakingPdfUrl = 'assets/data/speaking/batch 05/batch 05.pdf';
  BATCHES_CONFIG['05'].readingMode = 'academic';

  BATCHES_CONFIG['05'].listeningAnswerKeys = {
    '1':  'Canadian',
    '2':  'furniture',
    '3':  'Park',
    '4':  ['250', '250 sterling', '£250', '250 pounds'],
    '5':  'phone',
    '6':  ['10 September', '10th September', '10th of September', 'September 10', 'September 10th'],
    '7':  'museum',
    '8':  'time',
    '9':  ['blond', 'blonde'],
    '10': ['87954 82361', '8795482361'],
    '11': ['A', 'C'],
    '12': ['A', 'C'],
    '13': ['B', 'E'],
    '14': ['B', 'E'],
    '15': 'B',
    '16': 'B',
    '17': 'C',
    '18': 'A',
    '19': 'A',
    '20': 'C',
    '21': 'B',
    '22': 'A',
    '23': 'C',
    '24': 'B',
    '25': 'A',
    '26': 'B',
    '27': 'A',
    '28': 'F',
    '29': 'G',
    '30': 'C',
    '31': 'industry',
    '32': 'constant',
    '33': 'direction',
    '34': 'floor',
    '35': 'predictable',
    '36': 'bay',
    '37': 'gates',
    '38': 'fuel',
    '39': 'jobs',
    '40': 'migration'
  };

  BATCHES_CONFIG['05'].readingAnswerKeys = {
    '1':  'creativity',
    '2':  'rules',
    '3':  'cities',
    '4':  ['traffic', 'crime'],
    '5':  ['traffic', 'crime'],
    '6':  'competition',
    '7':  'evidence',
    '8':  'life',
    '9':  'TRUE',
    '10': 'TRUE',
    '11': 'NOT GIVEN',
    '12': 'FALSE',
    '13': 'TRUE',
    '14': 'E',
    '15': 'C',
    '16': 'F',
    '17': 'C',
    '18': 'A',
    '19': ['B', 'D'],
    '20': ['B', 'D'],
    '21': ['D', 'E'],
    '22': ['D', 'E'],
    '23': 'activists',
    '24': 'consumerism',
    '25': 'leaflets',
    '26': 'police',
    '27': 'E',
    '28': 'D',
    '29': 'B',
    '30': 'D',
    '31': 'C',
    '32': 'YES',
    '33': 'NO',
    '34': 'NO',
    '35': 'NOT GIVEN',
    '36': 'restaurants',
    '37': 'performance',
    '38': 'turnover',
    '39': 'goals',
    '40': 'characteristics'
  };

  // =========================================================
  // BATCH 06 — Cambridge IELTS 14 Test 2 (C14T2)
  // Listening: Sections 1–4, Q1–40
  // Audio: assets/Audio/Listening/Batch 06/C14T2  -SECTION -N.mp3
  // Question PDF (Listening): assets/data/listening/batch 06/batch 06.pdf
  // Question PDF (Reading): assets/data/reading/batch 06/batch 06.pdf
  // Question PDF (Writing): assets/data/writing/batch 06/batch 06.pdf
  // Question PDF (Speaking): assets/data/speaking/batch 06/batch 06.pdf
  // =========================================================
  BATCHES_CONFIG['06'].questionPdfUrl = 'assets/data/listening/batch 06/batch 06.pdf';
  BATCHES_CONFIG['06'].readingPdfUrl = 'assets/data/reading/batch 06/batch 06.pdf';
  BATCHES_CONFIG['06'].writingPdfUrl = 'assets/data/writing/batch 06/batch 06.pdf';
  BATCHES_CONFIG['06'].speakingPdfUrl = 'assets/data/speaking/batch 06/batch 06.pdf';
  BATCHES_CONFIG['06'].readingMode = 'academic';

  BATCHES_CONFIG['06'].listeningAnswerKeys = {
    '1':  ['219 442 9785', '2194429785', '219-442-9785'],
    '2':  ['10 October', '10th October', '10th of October', 'October 10', 'October 10th'],
    '3':  'manager',
    '4':  'Cawley',
    '5':  'knee',
    '6':  ['3 weeks', 'three weeks'],
    '7':  'tennis',
    '8':  'running',
    '9':  'shoulder',
    '10': 'vitamins',
    '11': 'B',
    '12': 'C',
    '13': 'C',
    '14': 'B',
    '15': 'A',
    '16': 'H',
    '17': 'D',
    '18': 'F',
    '19': 'A',
    '20': 'E',
    '21': 'B',
    '22': 'C',
    '23': 'A',
    '24': 'A',
    '25': 'E',
    '26': 'D',
    '27': 'A',
    '28': 'H',
    '29': 'G',
    '30': 'C',
    '31': 'dances',
    '32': 'survival',
    '33': 'clouds',
    '34': 'festivals',
    '35': 'comets',
    '36': 'sky',
    '37': 'instruments',
    '38': 'thermometer',
    '39': 'storms',
    '40': 'telegraph'
  };

  BATCHES_CONFIG['06'].readingAnswerKeys = {
    '1':  'FALSE',
    '2':  'TRUE',
    '3':  'NOT GIVEN',
    '4':  'FALSE',
    '5':  'NOT GIVEN',
    '6':  'TRUE',
    '7':  'FALSE',
    '8':  'TRUE',
    '9':  'merchant',
    '10': 'equipment',
    '11': 'gifts',
    '12': 'canoe',
    '13': 'mountains',
    '14': 'F',
    '15': 'C',
    '16': 'E',
    '17': 'D',
    '18': 'B',
    '19': ['design', 'designs'],
    '20': 'pathogens',
    '21': 'tuberculosis',
    '22': 'wards',
    '23': 'communal',
    '24': 'public',
    '25': 'miasmas',
    '26': 'cholera',
    '27': ['vi', 'VI'],
    '28': ['i', 'I'],
    '29': ['iii', 'III'],
    '30': ['ii', 'II'],
    '31': ['ix', 'IX'],
    '32': ['vii', 'VII'],
    '33': ['iv', 'IV'],
    '34': ['viii', 'VIII'],
    '35': 'productive',
    '36': 'perfectionists',
    '37': 'dissatisfied',
    '38': 'TRUE',
    '39': 'FALSE',
    '40': 'NOT GIVEN'
  };

  // =========================================================
  // BATCH 07 — Cambridge IELTS 14 Test 3 (C14T3)
  // Listening: Sections 1–4, Q1–40
  // Audio: assets/Audio/Listening/Batch 07/C14T3  -SECTION -N.mp3
  // Question PDF (Listening): assets/data/listening/batch 07/batch 07.pdf
  // Question PDF (Reading): assets/data/reading/batch 07/batch 07.pdf
  // Question PDF (Writing): assets/data/writing/batch 07/batch 07.pdf
  // Question PDF (Speaking): assets/data/speaking/batch 07/batch 07.pdf
  // =========================================================
  BATCHES_CONFIG['07'].questionPdfUrl = 'assets/data/listening/batch 07/batch 07.pdf';
  BATCHES_CONFIG['07'].readingPdfUrl = 'assets/data/reading/batch 07/batch 07.pdf';
  BATCHES_CONFIG['07'].writingPdfUrl = 'assets/data/writing/batch 07/batch 07.pdf';
  BATCHES_CONFIG['07'].speakingPdfUrl = 'assets/data/speaking/batch 07/batch 07.pdf';
  BATCHES_CONFIG['07'].readingMode = 'academic';

  BATCHES_CONFIG['07'].listeningAnswerKeys = {
    '1':  'Tesla',
    '2':  'microphone',
    '3':  'exhibition',
    '4':  'wifi',
    '5':  '45',
    '6':  '135',
    '7':  'pool',
    '8':  'airport',
    '9':  'sea',
    '10': 'clubs',
    '11': ['A', 'E'],
    '12': ['A', 'E'],
    '13': ['B', 'F'],
    '14': ['B', 'F'],
    '15': 'F',
    '16': 'A',
    '17': 'E',
    '18': 'G',
    '19': 'D',
    '20': 'C',
    '21': '50',
    '22': 'regional',
    '23': 'carnival',
    '24': 'drummer',
    '25': 'film',
    '26': 'parade',
    '27': 'D',
    '28': 'B',
    '29': 'E',
    '30': 'F',
    '31': 'violin',
    '32': 'energy',
    '33': 'complex',
    '34': 'opera',
    '35': 'disturbing',
    '36': 'clarinet',
    '37': 'diversity',
    '38': 'physics',
    '39': 'dance',
    '40': 'Olympics'
  };

  BATCHES_CONFIG['07'].readingAnswerKeys = {
    '1':  'B',
    '2':  'A',
    '3':  'D',
    '4':  'NOT GIVEN',
    '5':  'NO',
    '6':  'YES',
    '7':  'B',
    '8':  'C',
    '9':  'B',
    '10': 'A',
    '11': 'A',
    '12': 'C',
    '13': 'A',
    '14': 'C',
    '15': 'H',
    '16': 'A',
    '17': 'F',
    '18': 'I',
    '19': 'B',
    '20': 'E',
    '21': ['B', 'C'],
    '22': ['B', 'C'],
    '23': 'ecology',
    '24': 'prey',
    '25': 'habitats',
    '26': 'antibiotics',
    '27': 'B',
    '28': 'G',
    '29': 'F',
    '30': 'E',
    '31': 'C',
    '32': 'NO',
    '33': 'YES',
    '34': 'NOT GIVEN',
    '35': 'NO',
    '36': 'YES',
    '37': 'encouraging',
    '38': 'desire',
    '39': 'autonomy',
    '40': 'targeted'
  };

  // =========================================================
  // BATCH 08 — Cambridge IELTS 14 Test 4 (C14T4)
  // Listening: Sections 1–4, Q1–40
  // Audio: assets/Audio/Listening/Batch 08/C14T4  -SECTION -N.mp3
  // Question PDF (Listening): assets/data/listening/batch 08/batch 08.pdf
  // Question PDF (Reading): assets/data/reading/batch 08/batch 08.pdf
  // Question PDF (Writing): assets/data/writing/batch 08/batch 08.pdf
  // Question PDF (Speaking): assets/data/speaking/batch 08/batch 08.pdf
  // =========================================================
  BATCHES_CONFIG['08'].questionPdfUrl = 'assets/data/listening/batch 08/batch 08.pdf';
  BATCHES_CONFIG['08'].readingPdfUrl = 'assets/data/reading/batch 08/batch 08.pdf';
  BATCHES_CONFIG['08'].writingPdfUrl = 'assets/data/writing/batch 08/batch 08.pdf';
  BATCHES_CONFIG['08'].speakingPdfUrl = 'assets/data/speaking/batch 08/batch 08.pdf';
  BATCHES_CONFIG['08'].readingMode = 'academic';

  BATCHES_CONFIG['08'].listeningAnswerKeys = {
    '1':  '85',
    '2':  'roses',
    '3':  'trees',
    '4':  'stage',
    '5':  'speech',
    '6':  'support',
    '7':  'cabins',
    '8':  'C',
    '9':  'A',
    '10': 'B',
    '11': 'G',
    '12': 'D',
    '13': 'A',
    '14': 'E',
    '15': 'F',
    '16': 'B',
    '17': ['B', 'D'],
    '18': ['B', 'D'],
    '19': ['A', 'D'],
    '20': ['A', 'D'],
    '21': 'A',
    '22': 'C',
    '23': 'A',
    '24': 'B',
    '25': 'B',
    '26': 'F',
    '27': 'E',
    '28': 'C',
    '29': 'B',
    '30': 'G',
    '31': 'spring',
    '32': 'tools',
    '33': 'maps',
    '34': 'heavy',
    '35': 'marble',
    '36': 'light',
    '37': ['camera', 'cameras'],
    '38': 'medical',
    '39': 'eyes',
    '40': 'wine'
  };

  BATCHES_CONFIG['08'].readingAnswerKeys = {
    '1':  ['four', '4'],
    '2':  'young',
    '3':  'food',
    '4':  'light',
    '5':  'aggressively',
    '6':  'location',
    '7':  'neurons',
    '8':  'chemicals',
    '9':  'FALSE',
    '10': 'TRUE',
    '11': 'FALSE',
    '12': 'NOT GIVEN',
    '13': 'TRUE',
    '14': 'B',
    '15': 'E',
    '16': 'C',
    '17': 'A',
    '18': 'TRUE',
    '19': 'TRUE',
    '20': 'NOT GIVEN',
    '21': 'FALSE',
    '22': 'NOT GIVEN',
    '23': ['B', 'D'],
    '24': ['B', 'D'],
    '25': ['B', 'E'],
    '26': ['B', 'E'],
    '27': 'FALSE',
    '28': 'NOT GIVEN',
    '29': 'FALSE',
    '30': 'TRUE',
    '31': 'FALSE',
    '32': 'TRUE',
    '33': 'NOT GIVEN',
    '34': 'large',
    '35': 'microplastic',
    '36': 'populations',
    '37': 'concentrations',
    '38': 'predators',
    '39': 'disasters',
    '40': 'A'
  };

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
