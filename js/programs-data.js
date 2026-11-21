/**
 * ===================================================================
 * IELTS-Etips (English Tips) - Master Data 12 Program Resmi
 * Sumber Resmi: 01_PROGRAMS_AND_PRICING.docx
 * 
 * PENTING:
 * 1. File ini merupakan "Single Source of Truth" untuk seluruh data program,
 *    harga, target, durasi, dan fasilitas pada platform IELTS-Etips.
 * 2. Perubahan harga atau fasilitas di masa depan cukup dilakukan pada file ini,
 *    dan akan otomatis tercermin di seluruh kartu ringkas maupun modal detail.
 * 3. Tidak ada harga, durasi, atau klaim jaminan skor yang dikarang secara sepihak.
 * 4. Catatan konfirmasi dari dokumen sumber disertakan pada field `notes`
 *    agar dapat ditindaklanjuti saat ada klarifikasi lebih lanjut.
 * ===================================================================
 */

const IELTS_PROGRAM_CATEGORIES = {
  bundling: {
    id: 'bundling',
    name: 'Bundling Programs',
    description: 'Paket intensif 30 hari untuk 4 skill IELTS dengan pilihan kelas Semi-Private & Private.'
  },
  'partial-skill': {
    id: 'partial-skill',
    name: 'Partial Skill Programs',
    description: 'Fokus intensif 30 hari pada modul skill spesifik yang paling membutuhkan peningkatan skor.'
  },
  'private-class': {
    id: 'private-class',
    name: 'Private Classes (1-on-1)',
    description: 'Bimbingan privat 1 guru : 1 siswa dengan jadwal fleksibel dan pilihan paket pertemuan (5x - 20x).'
  },
  unlimited: {
    id: 'unlimited',
    name: 'Unlimited 1-Year Mastery',
    description: 'Akses platform penuh 1 tahun dengan porsi 75% latihan mandiri dan 25% pendampingan tutor.'
  }
};

const IELTS_PROGRAMS_DATA = [
  // ==========================================
  // PROGRAM 01: IELTS Starter Bundling
  // ==========================================
  {
    id: '01-starter-bundling',
    number: '01',
    name: 'IELTS Starter Bundling',
    category: 'bundling',
    categoryName: 'Bundling Program',
    badge: 'Starter Friendly',
    duration: '30 hari',
    platformAccess: 'IELTS Learning Platform 30 hari',
    classFormat: 'Semi-Private (maks. 5 siswa) atau Private (1 guru : 1 siswa)',
    targetBandBadge: 'Introduction & Basic Strategy',
    targetScore: 'Memahami struktur ujian dan memiliki dasar strategi IELTS. Bukan program untuk menjamin kenaikan band dalam 30 hari.',
    isGuarantee: false,
    pricing: {
      startingPrice: 550000,
      startingPriceFormatted: 'Rp 550.000',
      periodText: '/ 30 hari',
      options: [
        {
          type: 'Semi-Private',
          capacity: 'Maks. 5 siswa',
          price: 550000,
          priceFormatted: 'Rp 550.000',
          featured: false
        },
        {
          type: 'Private',
          capacity: '1 Guru : 1 Siswa',
          price: 750000,
          priceFormatted: 'Rp 750.000',
          featured: true
        }
      ]
    },
    suitableFor: [
      'Pemula yang ingin mengenal IELTS dan format ujiannya.',
      'Calon peserta yang ingin melakukan persiapan awal sebelum mengikuti program intensif.',
      'Calon peserta WHV atau pekerjaan luar negeri yang membutuhkan pengenalan IELTS.'
    ],
    facilities: [
      'Test kemampuan awal dan ujian prediksi di akhir program.',
      '8x Live Teaching Class untuk 1 bulan.',
      '30x Independent Practice with E-tips Platform.',
      'Mengenal dan memahami format empat skill IELTS.',
      'Listening dan Reading basic strategies.',
      'Introduction to Writing & Speaking.',
      'Learning roadmap untuk tahap pemantapan.',
      'Personal Learning Report.'
    ],
    notes: null
  },

  // ==========================================
  // PROGRAM 02: IELTS Foundation Bundling
  // ==========================================
  {
    id: '02-foundation-bundling',
    number: '02',
    name: 'IELTS Foundation Bundling',
    category: 'bundling',
    categoryName: 'Bundling Program',
    badge: 'Foundation Track',
    duration: '30 hari',
    platformAccess: 'IELTS Learning Platform 30 hari',
    classFormat: 'Semi-Private (maks. 5 siswa) atau Private (1 guru : 1 siswa)',
    targetBandBadge: 'Band 6.0 - 6.5',
    targetScore: 'Program ini berfokus pada pengembangan fondasi empat skill dan pembiasaan terhadap pola soal IELTS. Target Band 6.0-6.5 merupakan arah pembelajaran, bukan jaminan kenaikan band dalam 30 hari.',
    isGuarantee: false,
    pricing: {
      startingPrice: 750000,
      startingPriceFormatted: 'Rp 750.000',
      periodText: '/ 30 hari',
      options: [
        {
          type: 'Semi-Private',
          capacity: 'Maks. 5 siswa',
          price: 750000,
          priceFormatted: 'Rp 750.000',
          featured: false
        },
        {
          type: 'Private',
          capacity: '1 Guru : 1 Siswa',
          price: 1250000,
          priceFormatted: 'Rp 1.250.000',
          featured: true
        }
      ]
    },
    suitableFor: [
      'Membangun kemampuan dasar IELTS.',
      'Mempelajari strategi empat skill lebih mendalam.',
      'Mengerjakan latihan berdasarkan tipe soal.',
      'Mengembangkan kemampuan menjawab.',
      'Memperbaiki kesalahan melalui feedback.',
      'Mengembangkan kemampuan menuju target pembelajaran Band 6.0-6.5.'
    ],
    facilities: [
      'Test kemampuan awal dan ujian prediksi di akhir program.',
      '10x Live Teaching Class untuk 1 bulan.',
      '30x Independent Practice with E-tips Platform.',
      'Mengenal dan memahami format empat skill IELTS.',
      'Listening dan Reading strategies.',
      'Introduction to Writing & Speaking.',
      'Learning roadmap untuk tahap pemantapan.',
      'Personal Learning Report.'
    ],
    notes: null
  },

  // ==========================================
  // PROGRAM 03: IELTS Score Booster Bundling
  // ==========================================
  {
    id: '03-score-booster-bundling',
    number: '03',
    name: 'IELTS Score Booster Bundling',
    category: 'bundling',
    categoryName: 'Bundling Program',
    badge: 'Most Popular Bundling',
    duration: '30 hari',
    platformAccess: 'IELTS Learning Platform 30 hari',
    classFormat: 'Semi-Private (maks. 5 siswa) atau Private (1 guru : 1 siswa)',
    targetBandBadge: 'Band 7.0+',
    targetScore: 'Berfokus pada peningkatan akurasi, kualitas jawaban, dan konsistensi performa melalui latihan intensif, mock test, serta analisis kesalahan dan pengembangan strategi menuju target Band 7.0+.',
    isGuarantee: false,
    pricing: {
      startingPrice: 1500000,
      startingPriceFormatted: 'Rp 1.500.000',
      periodText: '/ 30 hari',
      options: [
        {
          type: 'Semi-Private',
          capacity: 'Maks. 5 siswa',
          price: 1500000,
          priceFormatted: 'Rp 1.500.000',
          featured: false
        },
        {
          type: 'Private',
          capacity: '1 Guru : 1 Siswa',
          price: 1750000,
          priceFormatted: 'Rp 1.750.000',
          featured: true
        }
      ]
    },
    suitableFor: [
      'Meningkatkan akurasi dan kualitas jawaban pada empat skill IELTS.',
      'Mengidentifikasi serta memperbaiki kesalahan yang menghambat peningkatan skor.',
      'Menguasai strategi pengerjaan soal dan manajemen waktu.',
      'Membangun konsistensi performa melalui latihan dan mock test.',
      'Mengembangkan kemampuan menuju target Band 7.0+.'
    ],
    facilities: [
      'Initial Assessment (tes kemampuan awal).',
      '12x Live Teaching & Strategy Coaching selama 30 hari.',
      '30x Independent Practice melalui IELTS-Etips Platform.',
      '4-Week Skill-Focused Learning Schedule.',
      'Full IELTS Mock Tests & Performance Evaluation.',
      'Detailed Error Analysis.',
      'Advanced Listening & Reading Strategies.',
      'Writing Development & Detailed Correction.',
      'Speaking Development & Performance Feedback.',
      'Personalized Band Score Improvement Strategy.',
      'Personal Learning Roadmap.',
      'Personal Learning Report.'
    ],
    notes: null
  },

  // ==========================================
  // PROGRAM 04: IELTS Partial Skill - Listening & Reading
  // ==========================================
  {
    id: '04-partial-listening-reading',
    number: '04',
    name: 'IELTS Partial Skill - Listening & Reading',
    category: 'partial-skill',
    categoryName: 'Partial Skill',
    focusSkill: 'Listening & Reading',
    badge: 'Receptive Skills Focus',
    duration: '30 hari',
    platformAccess: 'IELTS Learning Platform 30 hari',
    classFormat: 'Semi-Private (maks. 5 siswa) atau Private (1 guru : 1 siswa)',
    targetBandBadge: 'Akurasi & Kecepatan L&R',
    targetScore: 'Berfokus pada peningkatan akurasi, kecepatan, dan pemahaman strategi dalam mengerjakan IELTS Listening dan Reading.',
    isGuarantee: false,
    pricing: {
      startingPrice: 550000,
      startingPriceFormatted: 'Rp 550.000',
      periodText: '/ 30 hari',
      options: [
        {
          type: 'Semi-Private',
          capacity: 'Maks. 5 siswa',
          price: 550000,
          priceFormatted: 'Rp 550.000',
          featured: false
        },
        {
          type: 'Private',
          capacity: '1 Guru : 1 Siswa',
          price: 750000,
          priceFormatted: 'Rp 750.000',
          featured: true
        }
      ]
    },
    suitableFor: [
      'Fokus meningkatkan kemampuan IELTS Listening dan Reading.',
      'Memahami strategi dan berbagai tipe soal Listening & Reading.',
      'Meningkatkan akurasi serta kecepatan dalam menjawab soal.',
      'Mengidentifikasi dan memperbaiki kesalahan pengerjaan.',
      'Mempersiapkan diri untuk meningkatkan skor kedua skill secara lebih terarah.'
    ],
    facilities: [
      'Initial Assessment untuk Listening & Reading.',
      '8x Live Teaching Class selama 30 hari.',
      '30x Independent Practice melalui IELTS-Etips Platform.',
      'Listening Strategies & Question Analysis.',
      'Reading Strategies & Time Management.',
      'Practice berdasarkan tipe soal IELTS.',
      'Automatic Scoring untuk latihan Listening & Reading.',
      'Detailed Error Analysis & Performance Evaluation.',
      'Personal Learning Report.'
    ],
    // Catatan konfirmasi dari dokumen sumber:
    notes: 'Naskah sumber mencantumkan 8x Live Teaching Class. Perlu konfirmasi apakah jumlah pertemuan ini sudah final.'
  },

  // ==========================================
  // PROGRAM 05: IELTS Partial Skill - Writing
  // ==========================================
  {
    id: '05-partial-writing',
    number: '05',
    name: 'IELTS Partial Skill - Writing',
    category: 'partial-skill',
    categoryName: 'Partial Skill',
    focusSkill: 'Writing (Task 1 & Task 2)',
    badge: 'Writing Mastery Focus',
    duration: '30 hari',
    platformAccess: 'IELTS Learning Platform 30 hari',
    classFormat: 'Semi-Private (maks. 5 siswa) atau Private (1 guru : 1 siswa)',
    targetBandBadge: 'Band 7.0+ (Writing)',
    targetScore: 'Berfokus secara eksklusif pada pengembangan skill IELTS Writing (Task 1 dan Task 2), melalui latihan terstruktur, coaching intensif, dan feedback personal menuju target Band 7.0+.',
    isGuarantee: false,
    pricing: {
      startingPrice: 1500000,
      startingPriceFormatted: 'Rp 1.500.000',
      periodText: '/ 30 hari',
      options: [
        {
          type: 'Semi-Private',
          capacity: 'Maks. 5 siswa',
          price: 1500000,
          priceFormatted: 'Rp 1.500.000',
          featured: false
        },
        {
          type: 'Private',
          capacity: '1 Guru : 1 Siswa',
          price: 1750000,
          priceFormatted: 'Rp 1.750.000',
          featured: true
        }
      ]
    },
    suitableFor: [
      'Meningkatkan kualitas IELTS Writing Task 1 dan Task 2.',
      'Mengembangkan kemampuan menyusun ide dan argumen secara logis.',
      'Meningkatkan penguasaan vocabulary dan grammar akademik untuk penulisan esai.',
      'Memahami 4 kriteria penilaian IELTS Writing (TR/TA, CC, LR, GRA).',
      'Mengidentifikasi dan memperbaiki kesalahan melalui detailed feedback.',
      'Mengembangkan kemampuan menulis menuju target Band 7.0+.'
    ],
    facilities: [
      'Initial Assessment khusus IELTS Writing (Task 1 & Task 2).',
      '12x Live Teaching & Intensive Writing Coaching selama 30 hari.',
      '30x Independent Practice melalui IELTS-Etips Platform.',
      'Writing Development: Task Achievement, Task Response, Coherence & Cohesion, Lexical Resource, dan Grammatical Range & Accuracy.',
      'Structured Practice esai dan laporan grafis berdasarkan tipe soal IELTS.',
      'Detailed Correction & Personal Feedback esai dari tutor.',
      'Writing Performance Evaluation.',
      'Personal Learning Report.'
    ],
    notes: null
  },

  // ==========================================
  // PROGRAM 06: IELTS Partial Skill - Speaking
  // ==========================================
  {
    id: '06-partial-speaking',
    number: '06',
    name: 'IELTS Partial Skill - Speaking',
    category: 'partial-skill',
    categoryName: 'Partial Skill',
    focusSkill: 'Speaking saja',
    badge: 'Fluency & Confidence',
    duration: '30 hari',
    platformAccess: 'IELTS Learning Platform 30 hari',
    classFormat: 'Semi-Private (maks. 5 siswa) atau Private (1 guru : 1 siswa)',
    targetBandBadge: 'Band 7.0+ (Speaking)',
    targetScore: 'Berfokus pada pengembangan satu skill produktif Speaking, melalui latihan terstruktur, coaching intensif, dan feedback personal menuju target Band 7.0+.',
    isGuarantee: false,
    pricing: {
      startingPrice: 1500000,
      startingPriceFormatted: 'Rp 1.500.000',
      periodText: '/ 30 hari',
      options: [
        {
          type: 'Semi-Private',
          capacity: 'Maks. 5 siswa',
          price: 1500000,
          priceFormatted: 'Rp 1.500.000',
          featured: false
        },
        {
          type: 'Private',
          capacity: '1 Guru : 1 Siswa',
          price: 1750000,
          priceFormatted: 'Rp 1.750.000',
          featured: true
        }
      ]
    },
    suitableFor: [
      'Meningkatkan kelancaran dan kepercayaan diri dalam IELTS Speaking.',
      'Mengembangkan kualitas dan kedalaman jawaban.',
      'Meningkatkan penguasaan vocabulary dan grammar saat berbicara.',
      'Memperbaiki pronunciation, fluency, dan coherence.',
      'Mengembangkan strategi menjawab berbagai tipe pertanyaan IELTS Speaking.',
      'Meningkatkan kemampuan berbicara menuju target Band 7.0+.'
    ],
    facilities: [
      'Initial Speaking Assessment.',
      '12x Live Teaching & Speaking Coaching selama 30 hari.',
      '30x Independent Practice melalui IELTS-Etips Platform.',
      'Speaking Part 1: Developing Natural & Relevant Answers.',
      'Speaking Part 2: Cue Card Strategies & Long-Turn Development.',
      'Speaking Part 3: Developing Ideas, Opinions & Arguments.',
      'Fluency & Coherence Development.',
      'Lexical Resource Development.',
      'Grammatical Range & Accuracy.',
      'Pronunciation Improvement.',
      'Intensive Speaking Practice & Simulation.',
      'Detailed Speaking Feedback & Performance Evaluation.',
      'Personal Learning Roadmap.',
      'Personal Learning Report.'
    ],
    notes: null
  },

  // ==========================================
  // PROGRAM 07: Pre IELTS Private Class
  // ==========================================
  {
    id: '07-pre-ielts-private',
    number: '07',
    name: 'Pre IELTS Private Class',
    category: 'private-class',
    categoryName: 'Private Class',
    focus: 'IELTS Fundamental & Intensive Preparation',
    badge: '1-on-1 Fundamental',
    duration: 'Sesuai paket meeting',
    platformAccess: 'IELTS-Etips Learning Platform sesuai durasi program',
    classFormat: '1 Guru : 1 Siswa',
    scheduleType: 'Fleksibel, menyesuaikan ketersediaan siswa dan tutor',
    targetBandBadge: 'Band 5.0 - 6.0',
    targetScore: 'Program ini berfokus pada pengenalan empat skill IELTS melalui pembelajaran privat, latihan terstruktur, dan pendampingan intensif. Siswa diarahkan untuk memahami format ujian, menguasai strategi dasar, serta mengembangkan kemampuan menjawab secara lebih efektif menuju target Band 5.0-6.0. Target Band Score merupakan arah pembelajaran, bukan jaminan pencapaian skor dalam periode program.',
    isGuarantee: false,
    pricing: {
      startingPrice: 650000,
      startingPriceFormatted: 'Rp 650.000',
      periodText: 'mulai dari',
      options: [
        {
          name: 'Private Basic',
          meetings: '5x Meeting',
          price: 650000,
          priceFormatted: 'Rp 650.000',
          featured: false
        },
        {
          name: 'Private Regular',
          meetings: '10x Meeting',
          price: 750000,
          priceFormatted: 'Rp 750.000',
          featured: false
        },
        {
          name: 'Private Intensive',
          meetings: '15x Meeting',
          price: 1399000,
          priceFormatted: 'Rp 1.399.000',
          featured: true
        },
        {
          name: 'Private Advanced',
          meetings: '20x Meeting',
          price: 1699000,
          priceFormatted: 'Rp 1.699.000',
          featured: false
        }
      ]
    },
    suitableFor: [
      'Membangun dan memperkuat fundamental kemampuan IELTS.',
      'Belajar secara intensif sesuai kebutuhan dan kemampuan awal.',
      'Mendapatkan pendampingan personal dengan fokus pada kelemahan masing-masing skill.',
      'Mempersiapkan diri menghadapi IELTS dengan jadwal belajar yang fleksibel.',
      'Mengembangkan kemampuan menuju target Band Score yang diinginkan.'
    ],
    facilities: [
      'Initial Assessment untuk mengetahui kemampuan awal.',
      'Private Live Teaching (1 guru dan 1 siswa).',
      'Flexible Learning Schedule.',
      'Personalized Learning Roadmap.',
      'Materi pembelajaran sesuai kebutuhan dan target siswa.',
      'Fundamental & IELTS Strategies.',
      'Structured Practice berdasarkan empat skill IELTS.',
      'Feedback dan evaluasi perkembangan belajar.',
      'Personal Learning Report.'
    ],
    notes: null
  },

  // ==========================================
  // PROGRAM 08: IELTS Foundation Private Class
  // ==========================================
  {
    id: '08-foundation-private',
    number: '08',
    name: 'IELTS Foundation Private Class',
    category: 'private-class',
    categoryName: 'Private Class',
    focus: 'IELTS Fundamental Preparation',
    badge: '1-on-1 Foundation',
    duration: 'Sesuai paket meeting',
    platformAccess: 'Akses IELTS-Etips Learning Platform sesuai durasi program',
    classFormat: '1 Guru : 1 Siswa',
    scheduleType: 'Fleksibel, menyesuaikan ketersediaan siswa dan tutor',
    targetBandBadge: 'Band 6.0 - 6.5',
    targetScore: 'Program ini berfokus pada pembangunan fondasi empat skill IELTS melalui pembelajaran privat, latihan terstruktur, dan pendampingan intensif. Siswa diarahkan untuk memahami format ujian, menguasai strategi dasar, serta mengembangkan kemampuan menjawab secara lebih efektif menuju target Band 6.0-6.5. Target Band Score merupakan arah pembelajaran, bukan jaminan pencapaian skor dalam periode program.',
    isGuarantee: false,
    pricing: {
      startingPrice: 650000,
      startingPriceFormatted: 'Rp 650.000',
      periodText: 'mulai dari',
      options: [
        {
          name: 'Foundation Basic',
          meetings: '5x Meeting',
          price: 650000,
          priceFormatted: 'Rp 650.000',
          featured: false
        },
        {
          name: 'Foundation Regular',
          meetings: '10x Meeting',
          price: 1199000,
          priceFormatted: 'Rp 1.199.000',
          featured: false
        },
        {
          name: 'Foundation Intensive',
          meetings: '15x Meeting',
          price: 1699000,
          priceFormatted: 'Rp 1.699.000',
          featured: true
        },
        {
          name: 'Foundation Premium',
          meetings: '20x Meeting',
          price: 1999000,
          priceFormatted: 'Rp 1.999.000',
          featured: false
        }
      ]
    },
    suitableFor: [
      'Membangun fondasi kemampuan empat skill IELTS.',
      'Memahami format, jenis soal, dan kriteria penilaian IELTS.',
      'Menguasai strategi dasar Listening, Reading, Writing, dan Speaking.',
      'Mengembangkan kemampuan menjawab melalui latihan terstruktur.',
      'Memperbaiki kelemahan melalui pendampingan dan feedback personal.',
      'Mempersiapkan diri menuju target pembelajaran Band 6.0-6.5.'
    ],
    facilities: [
      'Initial Assessment untuk mengetahui kemampuan awal.',
      'Private Live Teaching (1 guru dan 1 siswa).',
      'Flexible Learning Schedule.',
      'Personalized Learning Roadmap.',
      'Fundamental IELTS Strategies (Listening, Reading, Writing & Speaking).',
      'Structured Practice berdasarkan tipe soal IELTS.',
      'Writing Correction & Speaking Feedback.',
      'Listening & Reading Practice dengan evaluasi hasil.',
      'Progress Evaluation.',
      'Akses IELTS-Etips Learning Platform sesuai durasi program.',
      'Personal Learning Report.'
    ],
    notes: null
  },

  // ==========================================
  // PROGRAM 09: IELTS Score Booster Private Class
  // ==========================================
  {
    id: '09-score-booster-private',
    number: '09',
    name: 'IELTS Score Booster Private Class',
    category: 'private-class',
    categoryName: 'Private Class',
    focus: 'IELTS Score Improvement & Intensive Preparation',
    badge: '1-on-1 Band Booster',
    duration: 'Sesuai paket meeting',
    platformAccess: 'Akses IELTS-Etips Learning Platform sesuai durasi program',
    classFormat: '1 Guru : 1 Siswa',
    scheduleType: 'Fleksibel, menyesuaikan ketersediaan siswa dan tutor',
    targetBandBadge: 'Band 7.0+',
    targetScore: 'Program ini berfokus pada optimalisasi kemampuan empat skill IELTS melalui latihan intensif, analisis kesalahan, dan penguatan strategi pengerjaan soal. Pembelajaran disesuaikan dengan kelemahan dan kebutuhan siswa untuk meningkatkan akurasi, kualitas jawaban, serta konsistensi performa menuju target Band 7.0+. Target Band Score merupakan arah pembelajaran, bukan jaminan pencapaian skor dalam periode program.',
    isGuarantee: false,
    pricing: {
      startingPrice: 699000,
      startingPriceFormatted: 'Rp 699.000',
      periodText: 'mulai dari',
      options: [
        {
          name: 'Score Booster Basic',
          meetings: '5x Meeting',
          price: 699000,
          priceFormatted: 'Rp 699.000',
          featured: false
        },
        {
          name: 'Score Booster Regular',
          meetings: '10x Meeting',
          price: 1299000,
          priceFormatted: 'Rp 1.299.000',
          featured: false
        },
        {
          name: 'Score Booster Intensive',
          meetings: '15x Meeting',
          price: 1799000,
          priceFormatted: 'Rp 1.799.000',
          featured: true
        },
        {
          name: 'Score Booster Premium',
          meetings: '20x Meeting',
          price: 2299000,
          priceFormatted: 'Rp 2.299.000',
          featured: false
        }
      ]
    },
    suitableFor: [
      'Meningkatkan akurasi dan kualitas jawaban pada empat skill IELTS.',
      'Mengidentifikasi serta memperbaiki kesalahan yang menghambat peningkatan skor.',
      'Mengembangkan strategi pengerjaan soal dan manajemen waktu.',
      'Meningkatkan konsistensi performa melalui latihan dan simulasi tes.',
      'Mengoptimalkan kemampuan IELTS menuju target Band 7.0+.'
    ],
    facilities: [
      'Initial Assessment untuk mengidentifikasi kemampuan awal.',
      'Private Live Teaching & Strategy Coaching.',
      'Flexible Learning Schedule.',
      'Personalized Learning Roadmap.',
      'Advanced Listening & Reading Strategies.',
      'Writing Development & Detailed Correction.',
      'Speaking Development & Performance Feedback.',
      'Intensive IELTS Practice berdasarkan tipe soal.',
      'Mock Test & Performance Evaluation.',
      'Detailed Error Analysis.',
      'Personalized Band Score Improvement Strategy.',
      'Akses IELTS-Etips Learning Platform sesuai durasi program.',
      'Personal Learning Report.'
    ],
    notes: null
  },

  // ==========================================
  // PROGRAM 10: IELTS Unlimited Foundation
  // ==========================================
  {
    id: '10-unlimited-foundation',
    number: '10',
    name: 'IELTS Unlimited Foundation',
    category: 'unlimited',
    categoryName: 'Unlimited 1-Year',
    badge: '1-Year Self-Study + Tutor',
    duration: 'Hingga 12 Bulan',
    platformAccess: 'Unlimited Access selama 1 Tahun',
    composition: '75% Practical Learning & 25% Theory',
    classFormat: 'Self-Practice & Personalized Tutor Guidance',
    targetBandBadge: 'Prediksi Band 5.0 - 6.0',
    targetScore: 'Program ini berfokus pada pembangunan fundamental empat skill IELTS melalui pembelajaran mandiri yang intensif, didukung pendampingan tutor sesuai kebutuhan. Dengan komposisi 75% praktik dan 25% teori, siswa diarahkan untuk memperbanyak latihan, memahami strategi, dan memperbaiki kesalahan secara berkelanjutan menuju prediksi Band Score 5.0-6.0. Prediksi Band Score merupakan arah pembelajaran, bukan jaminan pencapaian skor.',
    isGuarantee: false,
    pricing: {
      startingPrice: 4999000,
      startingPriceFormatted: 'Rp 4.999.000',
      periodText: '/ hingga 12 bulan',
      options: [
        {
          name: 'Unlimited 1-Year Access',
          duration: 'Hingga 12 Bulan',
          price: 4999000,
          priceFormatted: 'Rp 4.999.000',
          featured: true
        }
      ]
    },
    suitableFor: [
      'Membangun dan memperkuat fundamental empat skill IELTS.',
      'Mengembangkan kemampuan melalui latihan intensif dan berkelanjutan.',
      'Memahami format, strategi, dan berbagai tipe soal IELTS.',
      'Memperbaiki kesalahan melalui evaluasi dan feedback tutor.',
      'Mengembangkan kemampuan secara bertahap menuju prediksi Band 5.0-6.0.'
    ],
    facilities: [
      'Unlimited Access IELTS-Etips Learning Platform selama 1 Tahun.',
      'Unlimited Independent Practice.',
      'Tutor Guidance sesuai kebutuhan pembelajaran.',
      'Live Teaching untuk penjelasan teori dan strategi.',
      'Personal Feedback & Learning Consultation.',
      '75% Practical Learning & 25% Theory.',
      'Fundamental Development (Listening, Reading, Writing & Speaking).',
      'IELTS Strategies & Question Analysis.',
      'Regular Practice & Mock Tests.',
      'Writing Correction & Speaking Feedback.',
      'Performance Evaluation & Error Analysis.',
      'Personal Learning Roadmap.',
      'Progress Monitoring & Learning Report.'
    ],
    // Catatan konfirmasi dari dokumen sumber:
    notes: 'Program unlimited mencantumkan akses platform 1 tahun dan komposisi 75% praktik / 25% teori. Jumlah atau batas sesi live teaching/tutor guidance disesuaikan dengan kebutuhan (bukan unlimited live class tatap muka setiap hari).'
  },

  // ==========================================
  // PROGRAM 11: IELTS Unlimited Score Development
  // ==========================================
  {
    id: '11-unlimited-score-development',
    number: '11',
    name: 'IELTS Unlimited Score Development',
    category: 'unlimited',
    categoryName: 'Unlimited 1-Year',
    badge: '1-Year Band Booster',
    duration: 'Hingga 12 Bulan',
    platformAccess: 'Unlimited Access selama 1 Tahun',
    composition: '75% Practical Learning & 25% Theory',
    classFormat: 'Intensive Self-Practice & Personalized Tutor Guidance',
    targetBandBadge: 'Prediksi Band 6.0 - 6.5',
    targetScore: 'Program ini berfokus pada pengembangan dan optimalisasi kemampuan empat skill IELTS melalui latihan intensif, strategi lanjutan, serta pendampingan tutor sesuai kebutuhan. Siswa diarahkan untuk meningkatkan akurasi, kualitas jawaban, dan konsistensi performa menuju prediksi Band Score 6.0-6.5. Prediksi Band Score merupakan arah pembelajaran, bukan jaminan pencapaian skor.',
    isGuarantee: false,
    pricing: {
      startingPrice: 6499000,
      startingPriceFormatted: 'Rp 6.499.000',
      periodText: '/ hingga 12 bulan',
      options: [
        {
          name: 'Unlimited 1-Year Access',
          duration: 'Hingga 12 Bulan',
          price: 6499000,
          priceFormatted: 'Rp 6.499.000',
          priceAlternateFormatted: 'Rp 6.500.000',
          featured: true
        }
      ]
    },
    suitableFor: [
      'Mengembangkan kemampuan empat skill menuju level lebih tinggi.',
      'Meningkatkan akurasi dan kualitas jawaban IELTS.',
      'Menguasai strategi pengerjaan soal secara lebih mendalam.',
      'Mengidentifikasi serta memperbaiki kelemahan melalui evaluasi.',
      'Meningkatkan konsistensi performa melalui latihan dan mock test.',
      'Mengembangkan kemampuan menuju prediksi Band 6.0-6.5.'
    ],
    facilities: [
      'Unlimited Access IELTS-Etips Learning Platform selama 1 Tahun.',
      'Unlimited Independent Practice.',
      'Personalized Tutor Guidance sesuai kebutuhan.',
      'Live Teaching untuk penguatan teori dan strategi lanjutan.',
      'Personal Feedback & Learning Consultation.',
      '75% Practical Learning & 25% Theory.',
      'Advanced Listening & Reading Strategies.',
      'Writing Development & Detailed Correction.',
      'Speaking Development & Personal Feedback.',
      'Intensive IELTS Mock Tests.',
      'Detailed Error Analysis.',
      'Band Score Improvement Strategy.',
      'Performance Evaluation & Progress Monitoring.',
      'Personalized Learning Roadmap.',
      'Personal Learning Report.'
    ],
    // Catatan konfirmasi dari dokumen sumber:
    notes: 'Terdapat sedikit variasi penulisan harga pada dokumen sumber: Rp 6.499.000 (pada tabel ringkasan awal) vs Rp 6.500.000 (pada rincian isi bab). Sesi live teaching/tutor guidance disesuaikan dengan kebutuhan (bukan unlimited live class harian).'
  },

  // ==========================================
  // PROGRAM 12: IELTS Unlimited Band Mastery
  // ==========================================
  {
    id: '12-unlimited-band-mastery',
    number: '12',
    name: 'IELTS Unlimited Band Mastery',
    category: 'unlimited',
    categoryName: 'Unlimited 1-Year',
    badge: 'Mastery Track 7.5+',
    duration: '1 Tahun',
    platformAccess: 'Unlimited selama 1 tahun',
    composition: '75% Practical Learning - 25% Theory & Tutor Guidance',
    classFormat: '75% Practical Learning - 25% Theory & Tutor Guidance',
    targetBandBadge: 'Prediksi Band 7.0 - 7.5+',
    targetScore: 'Mengembangkan kemampuan IELTS tingkat lanjut dengan fokus pada akurasi, konsistensi, penguasaan strategi, serta kualitas jawaban di keempat skill. Target merupakan arah pembelajaran dan prediksi berdasarkan hasil evaluasi, bukan jaminan pencapaian skor tertentu.',
    isGuarantee: false,
    pricing: {
      startingPrice: 8000000,
      startingPriceFormatted: 'Rp 8.000.000',
      periodText: '/ 1 tahun',
      options: [
        {
          name: 'Unlimited 1-Year Mastery Access',
          duration: '1 Tahun',
          price: 8000000,
          priceFormatted: 'Rp 8.000.000',
          featured: true
        }
      ]
    },
    suitableFor: [
      'Peserta yang sudah memiliki kemampuan IELTS menengah hingga mahir.',
      'Peserta yang menargetkan IELTS Band 7.0-7.5+.',
      'Peserta yang ingin meningkatkan kualitas dan konsistensi performa di keempat skill.',
      'Peserta yang membutuhkan strategi lanjutan, evaluasi mendalam, dan feedback personal.',
      'Peserta yang ingin belajar secara mandiri dengan pendampingan tutor sesuai kebutuhan.'
    ],
    facilities: [
      'Unlimited Access IELTS-Etips Learning Platform selama 1 tahun.',
      'Unlimited Independent Practice untuk Listening, Reading, Writing, dan Speaking.',
      'Personalized Tutor Guidance sesuai kebutuhan dan perkembangan peserta.',
      'Live Teaching untuk pembahasan teori, strategi lanjutan, dan konsultasi.',
      'Advanced IELTS Strategies untuk seluruh jenis soal.',
      'Intensive Writing Development dengan koreksi dan feedback mendalam.',
      'Advanced Speaking Development dengan evaluasi berdasarkan kriteria penilaian IELTS.',
      'Intensive Listening & Reading Practice dengan analisis kesalahan.',
      'Regular Full IELTS Mock Test dan evaluasi performa.',
      'Detailed Error Analysis untuk mengidentifikasi kelemahan setiap skill.',
      'Personalized Band Score Improvement Strategy.',
      'Individual Learning Roadmap dan Progress Monitoring.',
      'Personal Learning Report dan rekomendasi pengembangan kemampuan berikutnya.'
    ],
    // Catatan konfirmasi dari dokumen sumber:
    notes: 'Program unlimited mencantumkan akses platform 1 tahun dan komposisi 75% praktik / 25% teori. Sesi live teaching/tutor guidance disesuaikan dengan kebutuhan pembelajaran (bukan unlimited live class harian tatap muka).'
  }
];

// ==========================================
// HELPER METHODS & REPOSITORY API
// ==========================================
const IeltsProgramsRepository = {
  /**
   * Mengambil seluruh 12 program
   * @returns {Array} Array berisi 12 objek program
   */
  getAll() {
    return IELTS_PROGRAMS_DATA;
  },

  /**
   * Mengambil program berdasarkan ID
   * @param {string} id ID program (misal: '01-starter-bundling')
   * @returns {Object|null}
   */
  getById(id) {
    return IELTS_PROGRAMS_DATA.find(program => program.id === id) || null;
  },

  /**
   * Mengambil program berdasarkan Kategori
   * @param {string} category ('bundling' | 'partial-skill' | 'private-class' | 'unlimited')
   * @returns {Array}
   */
  getByCategory(category) {
    if (!category || category === 'all') {
      return IELTS_PROGRAMS_DATA;
    }
    return IELTS_PROGRAMS_DATA.filter(program => program.category === category);
  },

  /**
   * Mengambil daftar seluruh metadata kategori
   * @returns {Object}
   */
  getCategories() {
    return IELTS_PROGRAM_CATEGORIES;
  },

  /**
   * Format angka integer ke mata uang Rupiah
   * @param {number} amount
   * @returns {string} Contoh: "Rp 550.000"
   */
  formatRupiah(amount) {
    if (typeof amount !== 'number') return 'Rp 0';
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
};

// ==========================================
// BROWSER & ENVIRONMENT EXPORT
// ==========================================
if (typeof window !== 'undefined') {
  window.IELTS_PROGRAM_CATEGORIES = IELTS_PROGRAM_CATEGORIES;
  window.IELTS_PROGRAMS_DATA = IELTS_PROGRAMS_DATA;
  window.IeltsProgramsRepository = IeltsProgramsRepository;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    IELTS_PROGRAM_CATEGORIES,
    IELTS_PROGRAMS_DATA,
    IeltsProgramsRepository
  };
}
