/**
 * ===================================================================
 * IELTS-Etips - Practice Library & Category Navigation Script
 * 
 * Manages category switching (Listening, Reading, Writing, Speaking),
 * breadcrumbs, batch cards, and section links.
 * ===================================================================
 */

(function (window, document) {
  'use strict';

  const SKILL_METADATA = {
    listening: {
      key: 'listening',
      name: 'Listening',
      icon: 'fa-headphones',
      title: 'IELTS Listening Practices',
      description: 'Pusat latihan Listening IELTS dengan audio player per-section dan PDF question paper. Siswa dapat memilih latihan Section 1+2 (Soal 1–20), Section 3+4 (Soal 21–40), atau Full 40 Soal dengan sistem evaluasi otomatis dan percobaan tanpa batas.',
      batchInfo: function (batchNum) {
        if (batchNum === 1) {
          return {
            title: 'Cambridge IELTS 13 Test 1',
            desc: 'Authentic Listening Test 1 lengkap (Sections 1–4, Q1–40) dengan audio jernih per-section, tabel cookery, map Granford, flowchart & scoring otomatis.',
            isReady: true,
            statusLabel: 'Audio & Scoring Ready'
          };
        } else if (batchNum >= 2 && batchNum <= 4) {
          return {
            title: 'Cambridge IELTS 13 Test ' + batchNum,
            desc: 'Latihan Listening Cambridge 13 Test ' + batchNum + ' dengan audio per-section, PDF question paper, dan lembar jawaban komputer (Q1–40).',
            isReady: true,
            statusLabel: 'Audio & Materials Ready'
          };
        } else {
          return {
            title: 'IELTS Listening Practice ' + String(batchNum).padStart(2, '0'),
            desc: 'Format computer-based latihan Listening 40 soal terstruktur (Sections 1–4). Dilengkapi audio player dan lembar jawaban otomatis.',
            isReady: false,
            statusLabel: 'Template Ready'
          };
        }
      }
    },
    reading: {
      key: 'reading',
      name: 'Reading',
      icon: 'fa-book-open',
      title: 'IELTS Reading Practices',
      description: 'Pusat latihan Reading Academic & General Training dengan 3 passages dan 40 soal. Siswa bebas berlatih per-passage atau mengerjakan keseluruhan soal dengan konversi estimasi band score otomatis.',
      batchInfo: function (batchNum) {
        if (batchNum === 1) {
          return {
            title: 'Cambridge IELTS 13 Test 1 (Academic)',
            desc: 'Passage 1 (Tourism New Zealand), Passage 2 (Why Boredom is anything but boring), Passage 3 (Artificial Artists) + scoring otomatis & kunci jawaban.',
            isReady: true,
            statusLabel: 'Passages & Scoring Ready'
          };
        } else if (batchNum >= 2 && batchNum <= 4) {
          return {
            title: 'Cambridge IELTS 13 Test ' + batchNum + ' (Academic)',
            desc: 'Latihan Academic Reading 3 Passages lengkap (Q1–40) dengan PDF question paper dan input jawaban interaktif.',
            isReady: true,
            statusLabel: 'Passages & Materials Ready'
          };
        } else {
          return {
            title: 'IELTS Reading Practice ' + String(batchNum).padStart(2, '0'),
            desc: 'Format latihan Reading Academic 3 passages, 40 soal dengan auto-save progres dan lembar jawaban komputer.',
            isReady: false,
            statusLabel: 'Template Ready'
          };
        }
      }
    },
    writing: {
      key: 'writing',
      name: 'Writing',
      icon: 'fa-pen-nib',
      title: 'IELTS Writing Practices',
      description: 'Latihan Academic Writing Task 1 (Report/Chart, min. 150 kata) dan Task 2 (Discursive Essay, min. 250 kata) dengan shared timer 60 menit dan PDF materi resmi.',
      batchInfo: function (batchNum) {
        if (batchNum >= 1 && batchNum <= 4) {
          return {
            title: 'Cambridge IELTS 13 Test ' + batchNum + ' Writing',
            desc: 'Soal resmi Academic Writing Task 1 & Task 2 berstandar Cambridge dengan viewer PDF bebas toolbar dan countdown timer 60 menit.',
            isReady: true,
            statusLabel: 'Tasks 1 & 2 Ready'
          };
        } else {
          return {
            title: 'IELTS Writing Practice ' + String(batchNum).padStart(2, '0'),
            desc: 'Simulasi pengerjaan Writing Task 1 & Task 2 berbasis standar IELTS dengan timer 60 menit dan materi soal resmi.',
            isReady: false,
            statusLabel: 'Template Ready'
          };
        }
      }
    },
    speaking: {
      key: 'speaking',
      name: 'Speaking',
      icon: 'fa-microphone',
      title: 'IELTS Speaking Practices',
      description: 'Latihan Speaking IELTS Parts 1, 2, dan 3 berpanduan cue card resmi untuk persiapan simulasi wawancara tatap muka bersama examiner.',
      batchInfo: function (batchNum) {
        if (batchNum >= 1 && batchNum <= 4) {
          return {
            title: 'Cambridge IELTS 13 Test ' + batchNum + ' Speaking',
            desc: 'Kumpulan pertanyaan Part 1 (Introduction), Part 2 (Candidate Cue Card + 1 min prep), dan Part 3 (Two-way Discussion).',
            isReady: true,
            statusLabel: 'Cue Cards Ready'
          };
        } else {
          return {
            title: 'IELTS Speaking Practice ' + String(batchNum).padStart(2, '0'),
            desc: 'Topik dan format latihan Speaking Parts 1–3 berstandar resmi IELTS untuk latihan mandiri atau bimbingan instruktur.',
            isReady: false,
            statusLabel: 'Template Ready'
          };
        }
      }
    }
  };

  function getActiveSkillFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const skillParam = (params.get('skill') || '').toLowerCase().trim();
    if (SKILL_METADATA[skillParam]) {
      return skillParam;
    }
    // Check page filename if dedicated file (e.g. practice-listening.html)
    const path = window.location.pathname.toLowerCase();
    if (path.includes('listening')) return 'listening';
    if (path.includes('reading')) return 'reading';
    if (path.includes('writing')) return 'writing';
    if (path.includes('speaking')) return 'speaking';
    return 'listening'; // default
  }

  function renderCategoryTabs(activeSkill) {
    const nav = document.getElementById('skillCategoryNav');
    if (!nav) return;

    const skills = ['listening', 'reading', 'writing', 'speaking'];
    let html = '';

    skills.forEach(function (sk) {
      const meta = SKILL_METADATA[sk];
      const isActive = sk === activeSkill;
      html += `
        <button type="button" class="skill-category-tab ${isActive ? 'active' : ''}" data-skill="${sk}" aria-label="Kategori ${meta.name}">
          <i class="fa-solid ${meta.icon} tab-icon"></i>
          <span>${meta.name}</span>
        </button>
      `;
    });

    nav.innerHTML = html;

    // Attach click events
    nav.querySelectorAll('.skill-category-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const targetSkill = this.getAttribute('data-skill');
        if (targetSkill && targetSkill !== activeSkill) {
          switchSkill(targetSkill);
        }
      });
    });
  }

  function renderBreadcrumb(activeSkill) {
    const breadcrumbElem = document.getElementById('practiceBreadcrumbs');
    if (!breadcrumbElem) return;

    const meta = SKILL_METADATA[activeSkill];
    breadcrumbElem.innerHTML = `
      <a href="index.html"><i class="fa-solid fa-house"></i> Home</a>
      <span class="breadcrumb-sep"><i class="fa-solid fa-chevron-right"></i></span>
      <a href="practice-library.html">Practices</a>
      <span class="breadcrumb-sep"><i class="fa-solid fa-chevron-right"></i></span>
      <span style="color: var(--accent-primary); font-weight: 700;">
        <i class="fa-solid ${meta.icon}"></i> ${meta.name}
      </span>
    `;
  }

  function renderHero(activeSkill) {
    const titleElem = document.getElementById('libraryHeroTitle');
    const descElem = document.getElementById('libraryHeroDesc');
    const meta = SKILL_METADATA[activeSkill];

    if (titleElem) {
      titleElem.innerHTML = `${meta.title}`;
    }
    if (descElem) {
      descElem.textContent = meta.description;
    }
  }

  function renderBatchCards(activeSkill) {
    const grid = document.getElementById('practiceGrid');
    if (!grid) return;

    const meta = SKILL_METADATA[activeSkill];
    let cardsHtml = '';

    for (let i = 1; i <= 20; i++) {
      const batchId = String(i).padStart(2, '0');
      const info = meta.batchInfo(i);
      const isHighlighted = i === 1;

      let actionsHtml = '';

      if (activeSkill === 'listening') {
        actionsHtml = `
          <div class="batch-section-actions">
            <div class="batch-section-row">
              <a href="practice-exam.html?batch=${batchId}&skill=listening&section=1-2" class="btn btn-outline-gold btn-sm" title="Kerjakan Section 1 & 2 (Soal 1–20)">
                <i class="fa-solid fa-headphones"></i> Sec 1+2 <span style="opacity:0.75; font-size:0.7rem;">(Q1–20)</span>
              </a>
              <a href="practice-exam.html?batch=${batchId}&skill=listening&section=3-4" class="btn btn-outline-gold btn-sm" title="Kerjakan Section 3 & 4 (Soal 21–40)">
                <i class="fa-solid fa-headphones"></i> Sec 3+4 <span style="opacity:0.75; font-size:0.7rem;">(Q21–40)</span>
              </a>
            </div>
            <a href="practice-exam.html?batch=${batchId}&skill=listening&section=full" class="btn btn-primary btn-sm" style="width: 100%; justify-content: center;">
              Full Test <span style="opacity:0.85; font-size:0.75rem;">(40 Soal)</span> <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        `;
      } else if (activeSkill === 'reading') {
        actionsHtml = `
          <div class="batch-section-actions">
            <div class="batch-section-row">
              <a href="practice-exam.html?batch=${batchId}&skill=reading&passage=1" class="btn btn-outline-gold btn-sm" title="Kerjakan Passage 1 (Soal 1–13)">
                Passage 1 <span style="opacity:0.75; font-size:0.7rem;">(Q1–13)</span>
              </a>
              <a href="practice-exam.html?batch=${batchId}&skill=reading&passage=2" class="btn btn-outline-gold btn-sm" title="Kerjakan Passage 2 (Soal 14–26)">
                Passage 2 <span style="opacity:0.75; font-size:0.7rem;">(Q14–26)</span>
              </a>
              <a href="practice-exam.html?batch=${batchId}&skill=reading&passage=3" class="btn btn-outline-gold btn-sm" title="Kerjakan Passage 3 (Soal 27–40)">
                Passage 3 <span style="opacity:0.75; font-size:0.7rem;">(Q27–40)</span>
              </a>
            </div>
            <a href="practice-exam.html?batch=${batchId}&skill=reading" class="btn btn-primary btn-sm" style="width: 100%; justify-content: center;">
              Full Reading <span style="opacity:0.85; font-size:0.75rem;">(40 Soal)</span> <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        `;
      } else if (activeSkill === 'writing') {
        actionsHtml = `
          <div class="batch-section-actions">
            <a href="practice-exam.html?batch=${batchId}&skill=writing" class="btn btn-primary btn-sm" style="width: 100%; justify-content: center;">
              Mulai Latihan Writing <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        `;
      } else if (activeSkill === 'speaking') {
        actionsHtml = `
          <div class="batch-section-actions">
            <a href="practice-exam.html?batch=${batchId}&skill=speaking" class="btn btn-primary btn-sm" style="width: 100%; justify-content: center;">
              Mulai Latihan Speaking <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        `;
      }

      const statusBadgeStyle = info.isReady
        ? 'background: rgba(16, 185, 129, 0.15); color: #10b981; border-color: rgba(16, 185, 129, 0.35);'
        : '';

      const cardStyle = isHighlighted
        ? 'border-color: rgba(245, 158, 11, 0.45); box-shadow: 0 4px 20px rgba(245, 158, 11, 0.08);'
        : '';

      cardsHtml += `
        <div class="batch-card" style="${cardStyle}">
          <div class="batch-card-top">
            <span class="batch-number" style="${isHighlighted ? 'color: var(--accent-primary);' : ''}">Batch ${batchId}</span>
            <span class="batch-status-pill" style="${statusBadgeStyle}">
              <i class="fa-solid ${info.isReady ? 'fa-circle-check' : 'fa-clock'}"></i> ${info.statusLabel}
            </span>
          </div>
          <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin: 6px 0 4px;">
            ${info.title}
          </h3>
          <p class="batch-desc-placeholder" style="border-style: ${info.isReady ? 'solid' : 'dashed'}; border-color: ${info.isReady ? 'rgba(245, 158, 11, 0.2)' : 'var(--border-subtle)'}; color: ${info.isReady ? 'var(--text-main)' : 'var(--text-muted)'}; margin-bottom: 12px;">
            ${info.desc}
          </p>
          ${actionsHtml}
        </div>
      `;
    }

    grid.innerHTML = cardsHtml;
  }

  function switchSkill(skillKey) {
    if (!SKILL_METADATA[skillKey]) return;

    // Update URL param without refreshing page if on practice-library.html
    if (window.history && window.history.pushState) {
      const newUrl = window.location.pathname + '?skill=' + skillKey;
      window.history.pushState({ skill: skillKey }, '', newUrl);
    }

    renderCategoryTabs(skillKey);
    renderBreadcrumb(skillKey);
    renderHero(skillKey);
    renderBatchCards(skillKey);

    // Scroll gently to top of grid
    const nav = document.getElementById('skillCategoryNav');
    if (nav) {
      nav.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function () {
    const currentSkill = getActiveSkillFromUrl();
    renderCategoryTabs(currentSkill);
    renderBreadcrumb(currentSkill);
    renderHero(currentSkill);
    renderBatchCards(currentSkill);
  });

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    const initialSkill = getActiveSkillFromUrl();
    renderCategoryTabs(initialSkill);
    renderBreadcrumb(initialSkill);
    renderHero(initialSkill);
    renderBatchCards(initialSkill);
  });

  window.IeltsPracticeLibrary = {
    switchSkill: switchSkill,
    getActiveSkill: getActiveSkillFromUrl
  };

})(window, document);
