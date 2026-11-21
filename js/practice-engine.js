/**
 * ===================================================================
 * IELTS-Etips - Practice Engine Core Logic
 * 
 * Features:
 * 1. Batch Isolation (URL ?batch=01 through 20 with isolated LocalStorage states).
 * 2. Independent Countdown Timers (30m Listening, 60m Reading, 60m Writing, no timer Speaking).
 * 3. 40 Answer Inputs for Listening and Reading.
 * 4. Word counters & Copy Answer buttons for Writing Task 1 & 2.
 * 5. One-Time Permanent Submission per skill with modal confirmation.
 * 6. Automated Scoring for Listening & Reading with normalization and alternate answers.
 * 7. Graceful handling of unconfigured answer keys (NO fake scores).
 * ===================================================================
 */

(function (window, document) {
  'use strict';

  // --- 1. RESOLVE ACTIVE BATCH ---
  const urlParams = new URLSearchParams(window.location.search);
  let rawBatch = urlParams.get('batch');
  if (!rawBatch || !rawBatch.trim()) {
    rawBatch = '01';
  } else {
    rawBatch = rawBatch.trim();
    if (/^\d$/.test(rawBatch)) rawBatch = '0' + rawBatch;
  }
  const ACTIVE_BATCH = rawBatch;
  const STORAGE_PREFIX = 'ielts_v1_b' + ACTIVE_BATCH + '_';

  // --- 2. LOCAL STORAGE HELPERS ---
  const Storage = {
    getKey: function (skill, key) {
      return STORAGE_PREFIX + skill + '_' + key;
    },
    get: function (skill, key, defaultValue) {
      try {
        const val = localStorage.getItem(this.getKey(skill, key));
        return val !== null ? JSON.parse(val) : defaultValue;
      } catch (e) {
        console.warn('Storage read error:', e);
        return defaultValue;
      }
    },
    set: function (skill, key, value) {
      try {
        localStorage.setItem(this.getKey(skill, key), JSON.stringify(value));
      } catch (e) {
        console.warn('Storage write error:', e);
      }
    }
  };

  // --- 3. DURATION CONSTANTS (SECONDS) ---
  const TIMERS_CONFIG = {
    listening: 30 * 60, // 30 minutes
    reading: 60 * 60,   // 60 minutes
    writing: 60 * 60    // 60 minutes shared by Task 1 & Task 2
  };

  const activeIntervals = {};

  // --- 4. FORMAT HELPERS ---
  function formatTime(seconds) {
    const s = Math.max(0, Math.floor(seconds));
    const hrs = String(Math.floor(s / 3600)).padStart(2, '0');
    const mins = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const secs = String(s % 60).padStart(2, '0');
    return hrs + ':' + mins + ':' + secs;
  }

  function countWords(str) {
    if (!str || typeof str !== 'string') return 0;
    const matches = str.trim().match(/\S+/g);
    return matches ? matches.length : 0;
  }

  // --- 5. AUDIO PLAYER HANDLER (LISTENING) ---
  function initAudioPlayer() {
    const batchConfig = window.IeltsPracticeConfig ? window.IeltsPracticeConfig.getBatch(ACTIVE_BATCH) : null;
    const audioUrl = batchConfig ? batchConfig.audioUrl : '';

    const playBtn = document.getElementById('audioPlayBtn');
    const audioElement = document.getElementById('listeningAudioElement');
    const audioNotice = document.getElementById('audioTrackNotice');
    const scrubberFill = document.getElementById('audioScrubberFill');
    const timeLabel = document.getElementById('audioTimeLabel');

    if (!playBtn || !audioElement) return;

    if (audioUrl) {
      audioElement.src = audioUrl;
      if (audioNotice) {
        audioNotice.innerHTML = '<i class="fa-solid fa-music"></i> <span>Audio track ready for Batch ' + ACTIVE_BATCH + '.</span>';
      }
    } else {
      if (audioNotice) {
        audioNotice.innerHTML = '<i class="fa-solid fa-circle-info"></i> <span>[Audio file placeholder — File audio dapat dikonfigurasi pada js/practice-config.js]</span>';
      }
    }

    playBtn.addEventListener('click', function () {
      if (!audioUrl) {
        alert('File audio untuk Batch ' + ACTIVE_BATCH + ' belum dikonfigurasi.');
        return;
      }
      if (audioElement.paused) {
        audioElement.play();
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      } else {
        audioElement.pause();
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      }
    });

    audioElement.addEventListener('timeupdate', function () {
      if (audioElement.duration) {
        const pct = (audioElement.currentTime / audioElement.duration) * 100;
        if (scrubberFill) scrubberFill.style.width = pct + '%';
        if (timeLabel) {
          const curMins = String(Math.floor(audioElement.currentTime / 60)).padStart(2, '0');
          const curSecs = String(Math.floor(audioElement.currentTime % 60)).padStart(2, '0');
          const durMins = String(Math.floor(audioElement.duration / 60)).padStart(2, '0');
          const durSecs = String(Math.floor(audioElement.duration % 60)).padStart(2, '0');
          timeLabel.textContent = curMins + ':' + curSecs + ' / ' + durMins + ':' + durSecs;
        }
      }
    });

    audioElement.addEventListener('ended', function () {
      playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    });
  }

  // --- 5B. DYNAMIC CONTENT RENDERER (TAHAP A) ---

  // Connect click on question card to focus corresponding answer input and vice-versa
  function setupQuestionAnswerLinking(skill, totalQuestions) {
    for (let i = 1; i <= totalQuestions; i++) {
      const qNum = i;
      const card = document.getElementById(skill + '_q_card_' + qNum);
      const input = document.getElementById(skill + '_ans_' + qNum);

      if (card && input) {
        // Clicking question card focuses answer input and scrolls answers container smoothly
        card.addEventListener('click', function () {
          try {
            input.focus({ preventScroll: true });
          } catch (e) {
            input.focus();
          }
          const answersContainer = document.getElementById(skill + 'AnswersContainer');
          const inputRow = input.closest('.answer-row');
          if (answersContainer && inputRow) {
            const containerRect = answersContainer.getBoundingClientRect();
            const rowRect = inputRow.getBoundingClientRect();
            const relativeOffset = rowRect.top - containerRect.top;
            answersContainer.scrollBy({ top: relativeOffset - 40, behavior: 'smooth' });
          }
          highlightActiveQuestion(skill, qNum);
        });

        // Focusing answer input highlights question card and scrolls material column smoothly
        input.addEventListener('focus', function () {
          highlightActiveQuestion(skill, qNum);
          const matCol = card.closest('.exam-col-material');
          if (matCol) {
            const colRect = matCol.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const relativeOffset = cardRect.top - colRect.top;
            matCol.scrollBy({ top: relativeOffset - 40, behavior: 'smooth' });
          }
        });

        input.addEventListener('blur', function () {
          card.classList.remove('active-question-card');
        });
      }
    }
  }

  function highlightActiveQuestion(skill, qNum) {
    const allCards = document.querySelectorAll('.' + skill + '-question-card');
    allCards.forEach(function (c) { c.classList.remove('active-question-card'); });
    const targetCard = document.getElementById(skill + '_q_card_' + qNum);
    if (targetCard) {
      targetCard.classList.add('active-question-card');
    }
  }

  // --- CLEAN PDF VIEWER ENGINE (PDF.js Canvas Renderer with Fallback) ---
  let currentLoadedPdf = null;
  let isPdfRendering = false;

  function initCleanPdfViewer(pdfUrl) {
    if (!pdfUrl) return;
    currentLoadedPdf = pdfUrl;

    const canvasContainer = document.getElementById('pdfCanvasPages');
    const iframeViewer = document.getElementById('listeningPdfViewer');
    const badge = document.getElementById('pdfViewerBadge');
    if (!canvasContainer) return;

    function fallbackToIframe(url) {
      if (canvasContainer) canvasContainer.style.display = 'none';
      if (iframeViewer) {
        iframeViewer.style.display = 'block';
        const cleanUrl = url + (url.indexOf('#') === -1 ? '#toolbar=0&navpanes=0&scrollbar=1&view=FitH' : '');
        if (iframeViewer.getAttribute('src') !== cleanUrl) {
          iframeViewer.src = cleanUrl;
        }
      }
      if (badge) {
        badge.innerHTML = '<i class="fa-solid fa-file-pdf"></i> PDF Viewer';
      }
    }

    // Try PDF.js for clean toolbar-free, sidebar-free rendering
    if (window.pdfjsLib) {
      try {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        // Loading spinner
        canvasContainer.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:240px;color:var(--text-muted);gap:14px;"><i class="fa-solid fa-circle-notch fa-spin" style="font-size:2rem;color:var(--accent-primary);"></i><span style="font-size:0.9rem;">Memuat Question Paper (Clean Preview Mode)...</span></div>';
        canvasContainer.style.display = 'block';
        if (iframeViewer) iframeViewer.style.display = 'none';

        const loadingTask = window.pdfjsLib.getDocument({
          url: pdfUrl,
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
          cMapPacked: true
        });

        isPdfRendering = true;
        loadingTask.promise.then(function (pdfDoc) {
          isPdfRendering = false;
          canvasContainer.innerHTML = '';
          const totalPages = pdfDoc.numPages;

          if (badge) {
            badge.innerHTML = '<i class="fa-solid fa-file-lines"></i> ' + totalPages + ' Pages (Full Preview)';
          }

          function renderPageSeq(pageNum) {
            if (pageNum > totalPages) return;
            pdfDoc.getPage(pageNum).then(function (page) {
              const containerWidth = canvasContainer.clientWidth || 800;
              const unscaledViewport = page.getViewport({ scale: 1 });
              // Leave 28px padding on sides
              const targetWidth = Math.max(containerWidth - 28, 560);
              const scale = targetWidth / unscaledViewport.width;
              // High-DPI multiplier for tack-sharp text rendering
              const dpr = Math.max(window.devicePixelRatio || 1, 1.5);
              const viewport = page.getViewport({ scale: scale * dpr });

              const pageWrap = document.createElement('div');
              pageWrap.className = 'pdf-page-sheet';
              pageWrap.style.margin = '0 auto 18px auto';
              pageWrap.style.maxWidth = targetWidth + 'px';
              pageWrap.style.background = '#ffffff';
              pageWrap.style.borderRadius = '6px';
              pageWrap.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.45)';
              pageWrap.style.overflow = 'hidden';
              pageWrap.style.display = 'flex';
              pageWrap.style.justifyContent = 'center';

              const canvas = document.createElement('canvas');
              canvas.width = Math.floor(viewport.width);
              canvas.height = Math.floor(viewport.height);
              canvas.style.width = Math.floor(viewport.width / dpr) + 'px';
              canvas.style.height = Math.floor(viewport.height / dpr) + 'px';
              canvas.style.display = 'block';

              const ctx = canvas.getContext('2d');
              const renderCtx = {
                canvasContext: ctx,
                viewport: viewport
              };

              page.render(renderCtx).promise.then(function () {
                pageWrap.appendChild(canvas);
                canvasContainer.appendChild(pageWrap);
                renderPageSeq(pageNum + 1);
              });
            }).catch(function (pageErr) {
              console.warn('Page ' + pageNum + ' render error:', pageErr);
              renderPageSeq(pageNum + 1);
            });
          }

          renderPageSeq(1);
        }).catch(function (err) {
          isPdfRendering = false;
          console.warn('PDF.js loading failed, switching to clean iframe viewer:', err);
          fallbackToIframe(pdfUrl);
        });
      } catch (e) {
        isPdfRendering = false;
        console.warn('PDF.js execution error, switching to clean iframe viewer:', e);
        fallbackToIframe(pdfUrl);
      }
    } else {
      fallbackToIframe(pdfUrl);
    }
  }

  // Handle responsive window resize for PDF viewer
  let pdfResizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(pdfResizeTimer);
    pdfResizeTimer = setTimeout(function () {
      const canvasContainer = document.getElementById('pdfCanvasPages');
      if (currentLoadedPdf && canvasContainer && canvasContainer.style.display !== 'none' && !isPdfRendering) {
        initCleanPdfViewer(currentLoadedPdf);
      }
    }, 300);
  });

  // Render 40 Listening questions dynamically based on batch
  function renderDynamicListeningQuestions(batchId) {
    const container = document.getElementById('listeningQuestionsContainer');
    if (!container) return;

    const batch = window.IeltsPracticeConfig ? window.IeltsPracticeConfig.getBatch(batchId) : null;
    if (!batch || !batch.listeningSections) return;

    // Audio path mapping per batch – keys match the padded batch id ('01'..'20')
    const AUDIO_PATH_MAP = {
      '01': { prefix: 'C13T1', folder: 'Batch 01', ext: 'mp3' },
      '02': { prefix: 'C13T2', folder: 'Batch 02', ext: 'mp3' },
      '03': { prefix: 'C13T3', folder: 'Batch 03', ext: 'mp3' },
      '04': { prefix: 'C13T4', folder: 'Batch 04', ext: 'mp3' },
      '05': { prefix: 'C14T1',  folder: 'Batch 05', ext: 'mp3' },
      '06': { prefix: 'C14T2',  folder: 'Batch 06', ext: 'mp3' },
      '07': { prefix: 'C14T3',  folder: 'Batch 07', ext: 'mp3' },
      '08': { prefix: 'C14T4',  folder: 'Batch 08', ext: 'mp3' },
      '09': { prefix: 'C15T1',  folder: 'Batch 09', ext: 'm4a' },
      '10': { prefix: 'C15T2',  folder: 'Batch 010', ext: 'm4a' },
      '11': { prefix: 'C15T3',  folder: 'Batch 011', ext: 'm4a' },
      '12': { prefix: 'C15T4',  folder: 'Batch 012', ext: 'm4a' }
    };

    const audioInfo = AUDIO_PATH_MAP[batchId] || null;
    const hasPdf = Boolean(batch.questionPdfUrl);

    let html = '';
    batch.listeningSections.forEach(function (sec) {
      // Build section audio path dynamically
      let audioTag = '';
      if (audioInfo) {
        const rawAudioPath = 'assets/Audio/Listening/' + audioInfo.folder + '/' + audioInfo.prefix + ' -SECTION -' + sec.sectionNumber + '.' + audioInfo.ext;
        const audioPath = encodeURI(rawAudioPath);
        audioTag = '<audio id="listeningAudioSection' + sec.sectionNumber + '" src="' + audioPath + '" controls style="width:100%; margin:10px 0 6px; border-radius:8px;"></audio>';
      }

      html += '<div class="question-section-header">' +
        '<div class="question-section-title"><i class="fa-solid fa-headphones-simple"></i> ' + sec.title + '</div>' +
        '<div class="question-section-desc">' + sec.instruction + '</div>' +
        '</div>' + audioTag;

      // When batch has questionPdfUrl, questions are shown via PDF viewer; do not render HTML question cards or visual assets
      if (hasPdf) return;

      // Insert visual asset for Section 1 (Cookery table) before questions
      if (sec.sectionNumber === 1) {
        var assets = batch.visualAssets || [];
        for (var ai = 0; ai < assets.length; ai++) {
          if (assets[ai].sectionNumber === 1) {
            html += '<div class="visual-asset-wrap" id="visualWrap_s1">' +
              '<img src="' + assets[ai].assetPath + '" alt="Cookery Classes Table — Section 1" ' +
              'style="width:100%;height:auto;margin:8px 0 14px;border-radius:8px;border:1px solid var(--border-color,#ddd);" ' +
              'onerror="' +
                'var w=document.getElementById(\'visualWrap_s1\');' +
                'if(w){w.innerHTML=\'<div style=\\\'background:#fff8e1;border:2px dashed #f9a825;border-radius:8px;padding:14px 18px;margin:8px 0 14px;font-size:0.85rem;color:#5d4037;\\\'>' +
                '<strong>⚠ Gambar Tabel Cookery belum tersedia</strong><br>' +
                'Ekstrak halaman 1 dari <em>question batch 01.pdf</em> dan simpan sebagai:<br>' +
                '<code style=\\\'font-size:0.8rem;\\\'>assets/ielts/batch-01/section-1-cookery-table.jpg</code>' +
                '</div>\';}" />' +
              '</div>';
            break;
          }
        }
      }

      sec.questions.forEach(function (q) {
        var numFormatted = String(q.number).padStart(2, '0');

        // Insert Granford map before Q14 (Section 2)
        if (sec.sectionNumber === 2 && q.number === 14) {
          var assets2 = batch.visualAssets || [];
          for (var ai2 = 0; ai2 < assets2.length; ai2++) {
            if (assets2[ai2].sectionNumber === 2) {
              html += '<div class="visual-asset-wrap">' +
                '<img src="' + assets2[ai2].assetPath + '" alt="Granford Traffic Map — Section 2" ' +
                'style="width:100%;height:auto;margin:8px 0 14px;border-radius:8px;border:1px solid var(--border-color,#ddd);" ' +
                'onerror="this.style.display=\'none\'" />' +
                '</div>';
              break;
            }
          }
        }

        // Insert flow-chart before Q26 (Section 3)
        if (sec.sectionNumber === 3 && q.number === 26) {
          var assets3 = batch.visualAssets || [];
          for (var ai3 = 0; ai3 < assets3.length; ai3++) {
            if (assets3[ai3].sectionNumber === 3) {
              html += '<div class="visual-asset-wrap">' +
                '<img src="' + assets3[ai3].assetPath + '" alt="Seed Germination Flowchart — Section 3" ' +
                'style="width:100%;height:auto;margin:8px 0 14px;border-radius:8px;border:1px solid var(--border-color,#ddd);" ' +
                'onerror="this.style.display=\'none\'" />' +
                '</div>';
              break;
            }
          }
        }

        html += '<div class="question-item-card listening-question-card" id="listening_q_card_' + q.number + '" title="Klik untuk menuju ke lembar jawaban Q ' + numFormatted + '">' +
          '<div class="question-card-inner">' +
          '<div style="display:flex;align-items:flex-start;gap:12px;">' +
          '<span class="question-num-badge">' + numFormatted + '</span>' +
          '<span class="question-text-placeholder" style="white-space:pre-wrap;">' + q.prompt + '</span>' +
          '</div>' +
          '<span class="focus-ans-link"><i class="fa-solid fa-pen-to-square"></i> Q ' + numFormatted + '</span>' +
          '</div></div>';
      });
    });

    container.innerHTML = html;

    // Synchronize Clean PDF viewer with batch question PDF
    const pdfContainer = document.getElementById('listeningPdfContainer');
    if (pdfContainer) {
      if (hasPdf) {
        pdfContainer.style.display = '';
        initCleanPdfViewer(batch.questionPdfUrl);
      } else {
        pdfContainer.style.display = 'none';
      }
    }

    if (!hasPdf) {
      setupQuestionAnswerLinking('listening', 40);
    }
  }

  // Render 3 Reading Passages and 40 Reading Questions dynamically
  function renderDynamicReadingContent(batchId) {
    const passageContainer = document.getElementById('readingPassageContainer');
    const questionsContainer = document.getElementById('readingQuestionsContainer');
    if (!passageContainer || !questionsContainer) return;

    const batch = window.IeltsPracticeConfig ? window.IeltsPracticeConfig.getBatch(batchId) : null;
    if (!batch || !batch.readingPassages) return;

    // 1. Render Reading Passages with Tabs
    let tabsHtml = '<div class="passage-tabs-nav">';
    batch.readingPassages.forEach(function (p, idx) {
      const activeClass = idx === 0 ? 'active' : '';
      tabsHtml += `<button type="button" class="passage-tab-btn ${activeClass}" data-passage="${p.passageNumber}">Passage ${p.passageNumber} (${p.questionRange})</button>`;
    });
    tabsHtml += '</div>';

    let passageBodiesHtml = '';
    batch.readingPassages.forEach(function (p, idx) {
      const displayStyle = idx === 0 ? 'block' : 'none';
      passageBodiesHtml += `
        <div class="passage-body-item" id="passage_body_${p.passageNumber}" style="display: ${displayStyle};">
          <div class="passage-title">${p.title}</div>
          <div class="passage-text-placeholder">${p.content}</div>
        </div>
      `;
    });

    passageContainer.innerHTML = tabsHtml + passageBodiesHtml;

    // Passage Tab Click Handlers
    const tabBtns = passageContainer.querySelectorAll('.passage-tab-btn');
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const pNum = btn.getAttribute('data-passage');

        const allBodies = passageContainer.querySelectorAll('.passage-body-item');
        allBodies.forEach(function (b) { b.style.display = 'none'; });

        const targetBody = document.getElementById('passage_body_' + pNum);
        if (targetBody) targetBody.style.display = 'block';
      });
    });

    // 2. Render 40 Reading Questions Grouped by Passage
    let qHtml = '';
    batch.readingPassages.forEach(function (p) {
      qHtml += `
        <div class="question-section-header">
          <div class="question-section-title">
            <i class="fa-solid fa-book-open-reader"></i> Passage ${p.passageNumber}: ${p.questionRange}
          </div>
          <div class="question-section-desc">Jawab pertanyaan berikut berdasarkan teks Passage ${p.passageNumber}.</div>
        </div>
      `;

      p.questions.forEach(function (q) {
        const numFormatted = String(q.number).padStart(2, '0');
        qHtml += `
          <div class="question-item-card reading-question-card" id="reading_q_card_${q.number}" title="Klik untuk menuju ke lembar jawaban Q ${numFormatted}">
            <div class="question-card-inner">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span class="question-num-badge">${numFormatted}</span>
                <span class="question-text-placeholder">${q.prompt}</span>
              </div>
              <span class="focus-ans-link"><i class="fa-solid fa-pen-to-square"></i> Q ${numFormatted}</span>
            </div>
          </div>
        `;
      });
    });

    questionsContainer.innerHTML = qHtml;
    setupQuestionAnswerLinking('reading', 40);
  }

  // --- 6. TIMER ENGINE ---
  function initSectionTimer(skill, timerElementId, onExpireCallback) {
    const timerElem = document.getElementById(timerElementId);
    if (!timerElem) return;

    const status = Storage.get(skill, 'status', 'not_started');
    const defaultDuration = TIMERS_CONFIG[skill] || 1800;

    if (status === 'submitted') {
      timerElem.textContent = '00:00:00';
      return;
    }

    if (status === 'in_progress') {
      const timerState = Storage.get(skill, 'timer', null);
      if (timerState && timerState.endTime) {
        startTimerLoop(skill, timerElem, timerState.endTime, onExpireCallback);
      } else {
        timerElem.textContent = formatTime(defaultDuration);
      }
    } else {
      timerElem.textContent = formatTime(defaultDuration);
    }
  }

  function startTimer(skill, timerElementId, onExpireCallback) {
    const status = Storage.get(skill, 'status', 'not_started');
    if (status === 'submitted') return;

    const timerElem = document.getElementById(timerElementId);
    if (!timerElem) return;

    let timerState = Storage.get(skill, 'timer', null);
    const duration = TIMERS_CONFIG[skill] || 1800;

    if (!timerState || !timerState.endTime) {
      const endTime = Date.now() + (duration * 1000);
      timerState = { endTime: endTime, duration: duration };
      Storage.set(skill, 'timer', timerState);
      Storage.set(skill, 'status', 'in_progress');
    }

    startTimerLoop(skill, timerElem, timerState.endTime, onExpireCallback);
  }

  function startTimerLoop(skill, timerElem, endTime, onExpireCallback) {
    if (activeIntervals[skill]) {
      clearInterval(activeIntervals[skill]);
    }

    const tick = function () {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      timerElem.textContent = formatTime(remaining);

      if (remaining <= 0) {
        clearInterval(activeIntervals[skill]);
        delete activeIntervals[skill];
        if (typeof onExpireCallback === 'function') {
          onExpireCallback(skill);
        }
      }
    };

    tick();
    activeIntervals[skill] = setInterval(tick, 1000);
  }

  // --- 7. ANSWER KEY SCORING FUNCTION ---
  function evaluateSkill(skill, userAnswers) {
    const totalQuestions = 40;
    const batchConfig = window.IeltsPracticeConfig ? window.IeltsPracticeConfig.getBatch(ACTIVE_BATCH) : null;
    const answerKeys = batchConfig
      ? (skill === 'listening' ? batchConfig.listeningAnswerKeys : batchConfig.readingAnswerKeys)
      : null;

    // Check if keys are configured
    const keysConfigured = Boolean(answerKeys && typeof answerKeys === 'object' && Object.keys(answerKeys).length > 0);

    if (!keysConfigured) {
      // Count answered vs unanswered
      let answeredCount = 0;
      for (let i = 1; i <= totalQuestions; i++) {
        const val = (userAnswers[String(i)] || '').trim();
        if (val) answeredCount++;
      }
      return {
        isConfigured: false,
        total: totalQuestions,
        answeredCount: answeredCount,
        unansweredCount: totalQuestions - answeredCount,
        message: 'Kunci jawaban belum dikonfigurasi untuk Batch ' + ACTIVE_BATCH + '. Penilaian otomatis dan konversi band score tidak tersedia.'
      };
    }

    // Keys are available: Perform scoring with normalization
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    const details = {};

    for (let i = 1; i <= totalQuestions; i++) {
      const qKey = String(i);
      const rawUserAns = (userAnswers[qKey] || '').trim();
      const cleanUserAns = rawUserAns.replace(/\s+/g, ' ');
      const acceptable = answerKeys[qKey];

      if (!cleanUserAns) {
        unanswered++;
        details[qKey] = { status: 'unanswered', userAns: '', key: acceptable };
      } else if (!acceptable) {
        // No key for this particular question
        unanswered++;
        details[qKey] = { status: 'unanswered', userAns: rawUserAns, key: null };
      } else {
        // Capitalization rule: accept exactly 3 forms —
        // 1. Original answer form (as written in Answer Key)
        // 2. All-lowercase form
        // 3. All-UPPERCASE form
        // Any other mixed case differing from these 3 forms is rejected.
        const acceptableItems = Array.isArray(acceptable) ? acceptable : [acceptable];
        const acceptableList = [];
        acceptableItems.forEach(function (a) {
          var s = String(a).trim().replace(/\s+/g, ' ');
          if (acceptableList.indexOf(s) === -1) acceptableList.push(s);
          var sLower = s.toLowerCase();
          if (acceptableList.indexOf(sLower) === -1) acceptableList.push(sLower);
          var sUpper = s.toUpperCase();
          if (acceptableList.indexOf(sUpper) === -1) acceptableList.push(sUpper);
        });

        if (acceptableList.indexOf(cleanUserAns) !== -1) {
          correct++;
          details[qKey] = { status: 'correct', userAns: rawUserAns, key: acceptable };
        } else {
          incorrect++;
          details[qKey] = { status: 'incorrect', userAns: rawUserAns, key: acceptable };
        }
      }
    }

    const readingMode = batchConfig.readingMode || 'academic';
    const estimatedBand = window.IeltsPracticeConfig.rawToBand(correct, skill, readingMode);

    return {
      isConfigured: true,
      correct: correct,
      incorrect: incorrect,
      unanswered: unanswered,
      total: totalQuestions,
      estimatedBand: estimatedBand,
      readingMode: readingMode,
      details: details
    };
  }

  // --- 8. RESULTS RENDERING ---
  function renderScoringResults(skill, resultContainerId, resultData) {
    const container = document.getElementById(resultContainerId);
    if (!container) return;

    if (!resultData.isConfigured) {
      container.innerHTML = `
        <div class="exam-results-card unconfigured">
          <div class="results-header">
            <div class="results-title-group">
              <span class="results-badge notice"><i class="fa-solid fa-triangle-exclamation"></i> Kunci Jawaban Belum Dikonfigurasi</span>
              <h3 class="results-heading">Hasil Ujian — ${skill.toUpperCase()} (Batch ${ACTIVE_BATCH})</h3>
            </div>
          </div>
          <div class="results-notice-box">
            <p><i class="fa-solid fa-circle-info"></i> ${resultData.message}</p>
            <p style="margin-top: 8px; font-size: 0.825rem; color: var(--text-muted);">
              Seluruh ${resultData.answeredCount} jawaban yang Anda isi (${resultData.unansweredCount} belum terisi) telah <strong>tersimpan dan terkunci permanen</strong> pada browser Anda.
            </p>
          </div>
        </div>
      `;
      container.style.display = 'block';
      return;
    }

    container.innerHTML = `
      <div class="exam-results-card scored">
        <div class="results-header">
          <div class="results-title-group">
            <span class="results-badge success"><i class="fa-solid fa-circle-check"></i> Ujian Selesai &amp; Dinilai</span>
            <h3 class="results-heading">Hasil Evaluasi — ${skill.toUpperCase()} (Batch ${ACTIVE_BATCH})</h3>
          </div>
          <div class="band-score-pill">
            <span class="band-score-label">Estimated Band</span>
            <span class="band-score-value">${resultData.estimatedBand}</span>
          </div>
        </div>

        <div class="results-stats-grid">
          <div class="stat-card stat-correct">
            <span class="stat-num">${resultData.correct}</span>
            <span class="stat-lbl"><i class="fa-solid fa-check"></i> Jawaban Benar</span>
          </div>
          <div class="stat-card stat-incorrect">
            <span class="stat-num">${resultData.incorrect}</span>
            <span class="stat-lbl"><i class="fa-solid fa-xmark"></i> Jawaban Salah</span>
          </div>
          <div class="stat-card stat-unanswered">
            <span class="stat-num">${resultData.unanswered}</span>
            <span class="stat-lbl"><i class="fa-solid fa-circle-question"></i> Tidak Dijawab</span>
          </div>
          <div class="stat-card stat-total">
            <span class="stat-num">${resultData.correct} / ${resultData.total}</span>
            <span class="stat-lbl"><i class="fa-solid fa-list-ol"></i> Total Skor (40 Soal)</span>
          </div>
        </div>

        <div class="results-disclaimer">
          <strong>Catatan Estimasi Skor:</strong> Skor prediksi di atas dihitung menggunakan tabel konversi baku IELTS ${skill === 'reading' ? '(' + (resultData.readingMode === 'general' ? 'General Training' : 'Academic') + ')' : ''}. Skor ini merupakan hasil evaluasi simulasi latihan mandiri dan bukan sertifikat resmi IELTS.
        </div>
      </div>
    `;
    container.style.display = 'block';
  }

  function renderWritingResults(containerId, wordData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="exam-results-card submitted-only">
        <div class="results-header">
          <div class="results-title-group">
            <span class="results-badge success"><i class="fa-solid fa-circle-check"></i> Writing Berhasil Dikumpulkan</span>
            <h3 class="results-heading">Konfirmasi Pengumpulan — WRITING (Batch ${ACTIVE_BATCH})</h3>
          </div>
        </div>
        <div class="writing-summary-grid">
          <div class="writing-summary-card">
            <h4>Task 1 (Laporan/Grafik)</h4>
            <p>Jumlah kata: <strong>${wordData.task1Words} kata</strong> (Batas rekomendasi: 150 kata)</p>
          </div>
          <div class="writing-summary-card">
            <h4>Task 2 (Esai)</h4>
            <p>Jumlah kata: <strong>${wordData.task2Words} kata</strong> (Batas rekomendasi: 250 kata)</p>
          </div>
        </div>
        <p class="results-note-locked">
          <i class="fa-solid fa-lock"></i> Esai Task 1 dan Task 2 telah terkunci permanen untuk Batch ${ACTIVE_BATCH}. Evaluasi kriteria IELTS (TR, CC, LR, GRA) dilakukan secara manual oleh instruktur/mentor.
        </p>
      </div>
    `;
    container.style.display = 'block';
  }

  function renderSpeakingResults(containerId, notesLength) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="exam-results-card submitted-only">
        <div class="results-header">
          <div class="results-title-group">
            <span class="results-badge success"><i class="fa-solid fa-circle-check"></i> Speaking Berhasil Disimpan</span>
            <h3 class="results-heading">Konfirmasi Sesi — SPEAKING (Batch ${ACTIVE_BATCH})</h3>
          </div>
        </div>
        <div class="results-notice-box">
          <p><i class="fa-solid fa-circle-check"></i> Catatan persiapan speaking Anda (${notesLength} karakter) telah disimpan dan dikunci permanen untuk Batch ${ACTIVE_BATCH}.</p>
          <p style="margin-top: 8px; font-size: 0.825rem; color: var(--text-muted);">
            Sesi Speaking Part 1, Part 2, dan Part 3 dievaluasi langsung oleh tutor penilai melalui pertemuan interaktif atau review rekaman.
          </p>
        </div>
      </div>
    `;
    container.style.display = 'block';
  }

  // --- 9. LOCKING CONTROLS ---
  function lockListeningSection() {
    for (let i = 1; i <= 40; i++) {
      const input = document.getElementById('listening_ans_' + i);
      if (input) {
        input.disabled = true;
        input.readOnly = true;
        input.classList.add('input-locked');
      }
    }
    const startBtn = document.getElementById('btnStartListening');
    const submitBtn = document.getElementById('btnSubmitListening');
    if (startBtn) { startBtn.disabled = true; startBtn.style.display = 'none'; }
    if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add('disabled'); }

    const bannerBadge = document.getElementById('listeningStatusBadge');
    if (bannerBadge) {
      bannerBadge.className = 'status-badge locked';
      bannerBadge.innerHTML = '<i class="fa-solid fa-lock"></i> Submitted';
    }
  }

  function lockReadingSection() {
    for (let i = 1; i <= 40; i++) {
      const input = document.getElementById('reading_ans_' + i);
      if (input) {
        input.disabled = true;
        input.readOnly = true;
        input.classList.add('input-locked');
      }
    }
    const startBtn = document.getElementById('btnStartReading');
    const submitBtn = document.getElementById('btnSubmitReading');
    if (startBtn) { startBtn.disabled = true; startBtn.style.display = 'none'; }
    if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add('disabled'); }

    const bannerBadge = document.getElementById('readingStatusBadge');
    if (bannerBadge) {
      bannerBadge.className = 'status-badge locked';
      bannerBadge.innerHTML = '<i class="fa-solid fa-lock"></i> Submitted';
    }
  }

  function lockWritingSection() {
    const t1 = document.getElementById('writingTask1Text');
    const t2 = document.getElementById('writingTask2Text');
    if (t1) { t1.disabled = true; t1.readOnly = true; t1.classList.add('input-locked'); }
    if (t2) { t2.disabled = true; t2.readOnly = true; t2.classList.add('input-locked'); }

    const startBtn = document.getElementById('btnStartWriting');
    const submitBtn = document.getElementById('btnSubmitWriting');
    if (startBtn) { startBtn.disabled = true; startBtn.style.display = 'none'; }
    if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add('disabled'); }

    const bannerBadge = document.getElementById('writingStatusBadge');
    if (bannerBadge) {
      bannerBadge.className = 'status-badge locked';
      bannerBadge.innerHTML = '<i class="fa-solid fa-lock"></i> Submitted';
    }
  }

  function lockSpeakingSection() {
    const notes = document.getElementById('speakingNotesText');
    if (notes) { notes.disabled = true; notes.readOnly = true; notes.classList.add('input-locked'); }

    const submitBtn = document.getElementById('btnSubmitSpeaking');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add('disabled'); }

    const bannerBadge = document.getElementById('speakingStatusBadge');
    if (bannerBadge) {
      bannerBadge.className = 'status-badge locked';
      bannerBadge.innerHTML = '<i class="fa-solid fa-lock"></i> Submitted';
    }
  }

  // --- 10. MODAL CONFIRMATION HANDLER ---
  let pendingSubmission = null;

  function showConfirmModal(skill, onConfirm) {
    const modal = document.getElementById('submissionConfirmModal');
    const skillNameElem = document.getElementById('confirmModalSkillName');
    const batchNameElem = document.getElementById('confirmModalBatchName');
    const confirmBtn = document.getElementById('btnConfirmSubmitNow');

    if (!modal) {
      // Fallback to native window.confirm
      if (window.confirm('Kumpulkan jawaban ' + skill.toUpperCase() + ' sekarang? Jawaban akan TERKUNCI PERMANEN dan tidak dapat diubah lagi.')) {
        onConfirm();
      }
      return;
    }

    pendingSubmission = onConfirm;
    if (skillNameElem) skillNameElem.textContent = skill.toUpperCase();
    if (batchNameElem) batchNameElem.textContent = 'Batch ' + ACTIVE_BATCH;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Remove any previous click listeners on confirm button
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.addEventListener('click', function () {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (typeof pendingSubmission === 'function') {
        const fn = pendingSubmission;
        pendingSubmission = null;
        fn();
      }
    });
  }

  function closeConfirmModal() {
    const modal = document.getElementById('submissionConfirmModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
    pendingSubmission = null;
  }

  // --- 11. TIME EXPIRED NOTIFICATION ---
  function notifyTimeExpired(skill) {
    const toastNotice = document.getElementById('toastNotice');
    const toastMessage = document.getElementById('toastMessage');
    const msg = '⏰ Waktu pengerjaan ' + skill.toUpperCase() + ' telah habis! Jawaban Anda tidak dihapus. Silakan klik tombol "Submit ' + skill.toUpperCase() + '" untuk menyelesaikan.';

    if (toastNotice && toastMessage) {
      toastMessage.textContent = msg;
      toastNotice.classList.add('show');
      setTimeout(function () {
        toastNotice.classList.remove('show');
      }, 7000);
    } else {
      alert(msg);
    }
  }

  // --- 12. INITIALIZATION ON DOM READY ---
  document.addEventListener('DOMContentLoaded', function () {
    
    // 0. Update Page Titles & Heading for Active Batch
    const batchFormatted = 'Batch ' + ACTIVE_BATCH;
    const fullExamTitle = 'Practice Exam — ' + batchFormatted;

    const examHeading = document.getElementById('examHeading');
    const examBatchDisplay = document.getElementById('examBatchDisplay');
    if (examBatchDisplay) {
      examBatchDisplay.textContent = batchFormatted;
    } else if (examHeading) {
      examHeading.textContent = fullExamTitle;
    }

    const topbarBatchLabel = document.getElementById('topbarBatchLabel');
    if (topbarBatchLabel) {
      topbarBatchLabel.textContent = fullExamTitle;
    }

    const examBatchBadge = document.getElementById('examBatchBadge');
    if (examBatchBadge) {
      examBatchBadge.innerHTML = '<i class="fa-solid fa-layer-group"></i> ' + batchFormatted;
    }

    document.title = fullExamTitle + ' | IELTS-Etips';

    // 1. Audio player
    initAudioPlayer();

    // 1B. Dynamic Content Rendering for Active Batch (Tahap A)
    renderDynamicListeningQuestions(ACTIVE_BATCH);
    renderDynamicReadingContent(ACTIVE_BATCH);

    // 2. Setup Confirm Modal Cancel buttons
    const cancelModalBtns = document.querySelectorAll('.cancel-confirm-modal');
    cancelModalBtns.forEach(function (btn) {
      btn.addEventListener('click', closeConfirmModal);
    });

    // -------------------------------------------------------------
    // LISTENING LOGIC
    // -------------------------------------------------------------
    const listeningStatus = Storage.get('listening', 'status', 'not_started');
    const listeningAnswers = Storage.get('listening', 'answers', {});

    // Populate saved answers
    for (let i = 1; i <= 40; i++) {
      const input = document.getElementById('listening_ans_' + i);
      if (input) {
        if (listeningAnswers[String(i)]) {
          input.value = listeningAnswers[String(i)];
        }
        const handleAnswerUpdate = function () {
          if (Storage.get('listening', 'status', 'not_started') === 'submitted') return;
          listeningAnswers[String(i)] = input.value;
          Storage.set('listening', 'answers', listeningAnswers);
        };
        input.addEventListener('input', handleAnswerUpdate);
        input.addEventListener('change', handleAnswerUpdate);
      }
    }

    // Timer setup
    initSectionTimer('listening', 'timerListening', function () {
      notifyTimeExpired('listening');
    });

    // Start button
    const btnStartListening = document.getElementById('btnStartListening');
    if (btnStartListening) {
      if (listeningStatus === 'in_progress') {
        btnStartListening.style.display = 'none';
      }
      btnStartListening.addEventListener('click', function () {
        startTimer('listening', 'timerListening', function () {
          notifyTimeExpired('listening');
        });
        btnStartListening.style.display = 'none';
      });
    }

    // Submit button
    const btnSubmitListening = document.getElementById('btnSubmitListening');
    if (btnSubmitListening) {
      btnSubmitListening.addEventListener('click', function () {
        if (Storage.get('listening', 'status', 'not_started') === 'submitted') return;
        showConfirmModal('listening', function () {
          // 1. Synchronize all 40 inputs directly from DOM before evaluating
          for (let i = 1; i <= 40; i++) {
            const input = document.getElementById('listening_ans_' + i);
            if (input) {
              listeningAnswers[String(i)] = input.value;
            }
          }
          Storage.set('listening', 'answers', listeningAnswers);

          // 2. Perform submit
          Storage.set('listening', 'status', 'submitted');
          if (activeIntervals.listening) {
            clearInterval(activeIntervals.listening);
            delete activeIntervals.listening;
          }

          // 3. Evaluate score
          const results = evaluateSkill('listening', listeningAnswers);
          Storage.set('listening', 'result', results);

          // 4. Lock section & render results
          lockListeningSection();
          renderScoringResults('listening', 'listeningResultsArea', results);

          const resultsElem = document.getElementById('listeningResultsArea');
          if (resultsElem) {
            resultsElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    }

    // Check if already submitted
    if (listeningStatus === 'submitted') {
      lockListeningSection();
      const savedResult = Storage.get('listening', 'result', null);
      if (savedResult && savedResult.isConfigured) {
        renderScoringResults('listening', 'listeningResultsArea', savedResult);
      } else {
        const evaluated = evaluateSkill('listening', listeningAnswers);
        Storage.set('listening', 'result', evaluated);
        renderScoringResults('listening', 'listeningResultsArea', evaluated);
      }
    }

    // -------------------------------------------------------------
    // READING LOGIC
    // -------------------------------------------------------------
    const readingStatus = Storage.get('reading', 'status', 'not_started');
    const readingAnswers = Storage.get('reading', 'answers', {});

    // Populate saved answers
    for (let i = 1; i <= 40; i++) {
      const input = document.getElementById('reading_ans_' + i);
      if (input) {
        if (readingAnswers[String(i)]) {
          input.value = readingAnswers[String(i)];
        }
        input.addEventListener('input', function () {
          if (Storage.get('reading', 'status', 'not_started') === 'submitted') return;
          readingAnswers[String(i)] = input.value;
          Storage.set('reading', 'answers', readingAnswers);
        });
      }
    }

    // Timer setup
    initSectionTimer('reading', 'timerReading', function () {
      notifyTimeExpired('reading');
    });

    // Start button
    const btnStartReading = document.getElementById('btnStartReading');
    if (btnStartReading) {
      if (readingStatus === 'in_progress') {
        btnStartReading.style.display = 'none';
      }
      btnStartReading.addEventListener('click', function () {
        startTimer('reading', 'timerReading', function () {
          notifyTimeExpired('reading');
        });
        btnStartReading.style.display = 'none';
      });
    }

    // Submit button
    const btnSubmitReading = document.getElementById('btnSubmitReading');
    if (btnSubmitReading) {
      btnSubmitReading.addEventListener('click', function () {
        if (Storage.get('reading', 'status', 'not_started') === 'submitted') return;
        showConfirmModal('reading', function () {
          // Perform submit
          Storage.set('reading', 'status', 'submitted');
          if (activeIntervals.reading) {
            clearInterval(activeIntervals.reading);
            delete activeIntervals.reading;
          }
          const results = evaluateSkill('reading', readingAnswers);
          Storage.set('reading', 'result', results);
          lockReadingSection();
          renderScoringResults('reading', 'readingResultsArea', results);
        });
      });
    }

    // Check if already submitted
    if (readingStatus === 'submitted') {
      lockReadingSection();
      const savedResult = Storage.get('reading', 'result', null);
      if (savedResult) {
        renderScoringResults('reading', 'readingResultsArea', savedResult);
      } else {
        const evaluated = evaluateSkill('reading', readingAnswers);
        renderScoringResults('reading', 'readingResultsArea', evaluated);
      }
    }

    // -------------------------------------------------------------
    // WRITING LOGIC
    // -------------------------------------------------------------
    const writingStatus = Storage.get('writing', 'status', 'not_started');
    const writingAnswers = Storage.get('writing', 'answers', { task1: '', task2: '' });

    const task1Input = document.getElementById('writingTask1Text');
    const task2Input = document.getElementById('writingTask2Text');
    const task1Count = document.getElementById('task1WordCount');
    const task2Count = document.getElementById('task2WordCount');

    if (task1Input) {
      if (writingAnswers.task1) {
        task1Input.value = writingAnswers.task1;
        if (task1Count) task1Count.textContent = countWords(writingAnswers.task1);
      }
      task1Input.addEventListener('input', function () {
        if (Storage.get('writing', 'status', 'not_started') === 'submitted') return;
        writingAnswers.task1 = task1Input.value;
        Storage.set('writing', 'answers', writingAnswers);
        if (task1Count) task1Count.textContent = countWords(task1Input.value);
      });
    }

    if (task2Input) {
      if (writingAnswers.task2) {
        task2Input.value = writingAnswers.task2;
        if (task2Count) task2Count.textContent = countWords(writingAnswers.task2);
      }
      task2Input.addEventListener('input', function () {
        if (Storage.get('writing', 'status', 'not_started') === 'submitted') return;
        writingAnswers.task2 = task2Input.value;
        Storage.set('writing', 'answers', writingAnswers);
        if (task2Count) task2Count.textContent = countWords(task2Input.value);
      });
    }

    // Copy buttons
    const btnCopyTask1 = document.getElementById('btnCopyTask1');
    if (btnCopyTask1 && task1Input) {
      btnCopyTask1.addEventListener('click', function () {
        navigator.clipboard.writeText(task1Input.value || '').then(function () {
          const originalHTML = btnCopyTask1.innerHTML;
          btnCopyTask1.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
          setTimeout(function () { btnCopyTask1.innerHTML = originalHTML; }, 2000);
        }).catch(function () {
          task1Input.select();
          document.execCommand('copy');
          alert('Task 1 answer copied to clipboard!');
        });
      });
    }

    const btnCopyTask2 = document.getElementById('btnCopyTask2');
    if (btnCopyTask2 && task2Input) {
      btnCopyTask2.addEventListener('click', function () {
        navigator.clipboard.writeText(task2Input.value || '').then(function () {
          const originalHTML = btnCopyTask2.innerHTML;
          btnCopyTask2.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
          setTimeout(function () { btnCopyTask2.innerHTML = originalHTML; }, 2000);
        }).catch(function () {
          task2Input.select();
          document.execCommand('copy');
          alert('Task 2 answer copied to clipboard!');
        });
      });
    }

    // Shared Timer setup
    initSectionTimer('writing', 'timerWriting', function () {
      notifyTimeExpired('writing');
    });

    // Start button
    const btnStartWriting = document.getElementById('btnStartWriting');
    if (btnStartWriting) {
      if (writingStatus === 'in_progress') {
        btnStartWriting.style.display = 'none';
      }
      btnStartWriting.addEventListener('click', function () {
        startTimer('writing', 'timerWriting', function () {
          notifyTimeExpired('writing');
        });
        btnStartWriting.style.display = 'none';
      });
    }

    // Submit button
    const btnSubmitWriting = document.getElementById('btnSubmitWriting');
    if (btnSubmitWriting) {
      btnSubmitWriting.addEventListener('click', function () {
        if (Storage.get('writing', 'status', 'not_started') === 'submitted') return;
        showConfirmModal('writing', function () {
          // Perform submit
          Storage.set('writing', 'status', 'submitted');
          if (activeIntervals.writing) {
            clearInterval(activeIntervals.writing);
            delete activeIntervals.writing;
          }
          const wordData = {
            task1Words: countWords(writingAnswers.task1),
            task2Words: countWords(writingAnswers.task2)
          };
          Storage.set('writing', 'result', wordData);
          lockWritingSection();
          renderWritingResults('writingResultsArea', wordData);
        });
      });
    }

    // Check if already submitted
    if (writingStatus === 'submitted') {
      lockWritingSection();
      const savedWordData = Storage.get('writing', 'result', {
        task1Words: countWords(writingAnswers.task1),
        task2Words: countWords(writingAnswers.task2)
      });
      renderWritingResults('writingResultsArea', savedWordData);
    }

    // -------------------------------------------------------------
    // SPEAKING LOGIC
    // -------------------------------------------------------------
    const speakingStatus = Storage.get('speaking', 'status', 'not_started');
    const speakingAnswers = Storage.get('speaking', 'answers', { notes: '' });
    const notesInput = document.getElementById('speakingNotesText');

    if (notesInput) {
      if (speakingAnswers.notes) {
        notesInput.value = speakingAnswers.notes;
      }
      notesInput.addEventListener('input', function () {
        if (Storage.get('speaking', 'status', 'not_started') === 'submitted') return;
        speakingAnswers.notes = notesInput.value;
        Storage.set('speaking', 'answers', speakingAnswers);
      });
    }

    // Submit button
    const btnSubmitSpeaking = document.getElementById('btnSubmitSpeaking');
    if (btnSubmitSpeaking) {
      btnSubmitSpeaking.addEventListener('click', function () {
        if (Storage.get('speaking', 'status', 'not_started') === 'submitted') return;
        showConfirmModal('speaking', function () {
          // Perform submit
          Storage.set('speaking', 'status', 'submitted');
          const notesLength = (speakingAnswers.notes || '').length;
          Storage.set('speaking', 'result', { notesLength: notesLength });
          lockSpeakingSection();
          renderSpeakingResults('speakingResultsArea', notesLength);
        });
      });
    }

    // Check if already submitted
    if (speakingStatus === 'submitted') {
      lockSpeakingSection();
      const savedNotesData = Storage.get('speaking', 'result', { notesLength: (speakingAnswers.notes || '').length });
      renderSpeakingResults('speakingResultsArea', savedNotesData.notesLength);
    }

  });

})(window, document);
