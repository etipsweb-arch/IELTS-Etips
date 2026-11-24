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

  // --- CLEAN PDF VIEWER ENGINE (High-DPI PDF.js Canvas Renderer with Fallback) ---
  function createCleanPdfViewer(opts) {
    const canvasContainerId = opts.canvasContainerId;
    const iframeViewerId = opts.iframeViewerId;
    const badgeId = opts.badgeId;

    let currentLoadedPdf = null;
    let cachedPdfDoc = null;
    let activeRenderTasks = [];
    let pdfRenderSeqId = 0;
    let isPdfRendering = false;
    let needsRerenderAfterCurrent = false;
    let pdfResizeTimer = null;
    let lastRenderedWidth = 0;
    let lastRenderedDpr = 0;
    let dprMediaQuery = null;

    function cancelActivePdfRenderTasks() {
      if (activeRenderTasks && activeRenderTasks.length > 0) {
        activeRenderTasks.forEach(function (task) {
          try {
            if (task && typeof task.cancel === 'function') {
              task.cancel();
            }
          } catch (e) {
            // Ignore already completed or cancelled task
          }
        });
        activeRenderTasks = [];
      }
    }

    function renderCleanPdfPages(pdfDoc, canvasContainer, badge, seqId) {
      if (!pdfDoc || !canvasContainer || seqId !== pdfRenderSeqId) return;

      cancelActivePdfRenderTasks();
      canvasContainer.innerHTML = '';

      const totalPages = pdfDoc.numPages;
      if (badge) {
        badge.innerHTML = '<i class="fa-solid fa-file-lines"></i> ' + totalPages + ' Pages (Full Preview)';
      }

      // Measure container available width from stable parent element
      const parent = canvasContainer.parentElement;
      let containerWidth = (parent && parent.clientWidth) ? parent.clientWidth : canvasContainer.clientWidth;
      if (!containerWidth || containerWidth < 100) {
        containerWidth = Math.min(window.innerWidth * 0.58, 900);
      }

      // Account for padding (12px * 2 = 24px) plus 8px safety breathing space
      const targetWidth = Math.max(containerWidth - 32, 360);

      // Use ACTUAL devicePixelRatio (e.g. 1.0, 1.25, 1.5, 2.0) without artificial floor that causes fractional blur
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      lastRenderedWidth = containerWidth;
      lastRenderedDpr = dpr;

      isPdfRendering = true;

      function renderPageSeq(pageNum) {
        if (seqId !== pdfRenderSeqId || pageNum > totalPages) {
          if (seqId === pdfRenderSeqId) {
            isPdfRendering = false;
            if (needsRerenderAfterCurrent) {
              needsRerenderAfterCurrent = false;
              setTimeout(triggerPdfRerender, 50);
            }
          }
          return;
        }

        pdfDoc.getPage(pageNum).then(function (page) {
          if (seqId !== pdfRenderSeqId) return;

          const unscaledViewport = page.getViewport({ scale: 1 });
          const baseScale = targetWidth / unscaledViewport.width;
          // Standard logical viewport in CSS pixels
          const viewport = page.getViewport({ scale: baseScale });

          const pageWrap = document.createElement('div');
          pageWrap.className = 'pdf-page-sheet';
          pageWrap.style.margin = '0 auto 18px auto';
          pageWrap.style.width = Math.floor(viewport.width) + 'px';
          pageWrap.style.height = Math.floor(viewport.height) + 'px';
          pageWrap.style.background = '#ffffff';
          pageWrap.style.borderRadius = '6px';
          pageWrap.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.45)';
          pageWrap.style.overflow = 'hidden';
          pageWrap.style.display = 'flex';
          pageWrap.style.justifyContent = 'center';
          pageWrap.style.alignItems = 'center';
          pageWrap.style.boxSizing = 'border-box';

          const canvas = document.createElement('canvas');
          // Backing store resolution multiplied by actual DPR for pixel-perfect sharpness
          canvas.width = Math.floor(viewport.width * dpr);
          canvas.height = Math.floor(viewport.height * dpr);
          // Display size matches logical viewport in CSS pixels exactly (1:1 aspect ratio)
          canvas.style.width = Math.floor(viewport.width) + 'px';
          canvas.style.height = Math.floor(viewport.height) + 'px';
          canvas.style.display = 'block';
          canvas.style.maxWidth = '100%';
          canvas.style.boxSizing = 'border-box';

          const ctx = canvas.getContext('2d', { alpha: false });
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
          }

          // PDF.js HiDPI transform matrix: scales drawing operations directly to canvas resolution
          const transform = dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null;

          const renderCtx = {
            canvasContext: ctx,
            viewport: viewport,
            transform: transform
          };

          const renderTask = page.render(renderCtx);
          activeRenderTasks.push(renderTask);

          renderTask.promise.then(function () {
            if (seqId !== pdfRenderSeqId) return;
            pageWrap.appendChild(canvas);
            canvasContainer.appendChild(pageWrap);
            renderPageSeq(pageNum + 1);
          }).catch(function (pageErr) {
            if (pageErr && pageErr.name === 'RenderingCancelledException') {
              return; // Cleanly ignore cancellation
            }
            console.warn('Page ' + pageNum + ' render error:', pageErr);
            if (seqId === pdfRenderSeqId) {
              renderPageSeq(pageNum + 1);
            }
          });
        }).catch(function (pageErr) {
          console.warn('Page ' + pageNum + ' load error:', pageErr);
          if (seqId === pdfRenderSeqId) {
            renderPageSeq(pageNum + 1);
          }
        });
      }

      renderPageSeq(1);
    }

    function fallbackToIframe(url) {
      cancelActivePdfRenderTasks();
      isPdfRendering = false;
      needsRerenderAfterCurrent = false;
      const canvasContainer = document.getElementById(canvasContainerId);
      const iframeViewer = document.getElementById(iframeViewerId);
      const badge = document.getElementById(badgeId);

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

    function init(pdfUrl) {
      if (!pdfUrl) return;
      needsRerenderAfterCurrent = false;
      const isNewPdf = (currentLoadedPdf !== pdfUrl || !cachedPdfDoc);
      currentLoadedPdf = pdfUrl;

      const canvasContainer = document.getElementById(canvasContainerId);
      const iframeViewer = document.getElementById(iframeViewerId);
      const badge = document.getElementById(badgeId);
      if (!canvasContainer) return;

      // Try PDF.js for clean toolbar-free, sidebar-free rendering
      if (window.pdfjsLib) {
        try {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

          canvasContainer.style.display = 'block';
          if (iframeViewer) iframeViewer.style.display = 'none';

          pdfRenderSeqId++;
          const thisSeqId = pdfRenderSeqId;

          // If we already loaded this document, re-render immediately without re-fetching over network
          if (!isNewPdf && cachedPdfDoc) {
            renderCleanPdfPages(cachedPdfDoc, canvasContainer, badge, thisSeqId);
            setupWatchers();
            return;
          }

          // Show loading spinner for initial document load
          canvasContainer.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:240px;color:var(--text-muted);gap:14px;"><i class="fa-solid fa-circle-notch fa-spin" style="font-size:2rem;color:var(--accent-primary);"></i><span style="font-size:0.9rem;">Memuat Question Paper (Clean Preview Mode)...</span></div>';

          const loadingTask = window.pdfjsLib.getDocument({
            url: pdfUrl,
            cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
            cMapPacked: true
          });

          loadingTask.promise.then(function (pdfDoc) {
            cachedPdfDoc = pdfDoc;
            renderCleanPdfPages(pdfDoc, canvasContainer, badge, thisSeqId);
            setupWatchers();
          }).catch(function (err) {
            console.warn('PDF.js loading failed, switching to clean iframe viewer:', err);
            fallbackToIframe(pdfUrl);
          });
        } catch (e) {
          console.warn('PDF.js execution error, switching to clean iframe viewer:', e);
          fallbackToIframe(pdfUrl);
        }
      } else {
        fallbackToIframe(pdfUrl);
      }
    }

    function triggerPdfRerender() {
      // Do not interrupt ongoing rendering; queue re-render after current finishes
      if (isPdfRendering) {
        needsRerenderAfterCurrent = true;
        return;
      }

      const canvasContainer = document.getElementById(canvasContainerId);
      if (!currentLoadedPdf || !canvasContainer || canvasContainer.style.display === 'none') return;

      const parent = canvasContainer.parentElement;
      const currentWidth = (parent && parent.clientWidth) ? parent.clientWidth : canvasContainer.clientWidth;
      const currentDpr = Math.min(window.devicePixelRatio || 1, 3);

      // Check if re-render is truly needed (> 20px threshold avoids minor scrollbar jitter)
      const widthDiff = Math.abs(currentWidth - lastRenderedWidth);
      const dprDiff = Math.abs(currentDpr - lastRenderedDpr);
      if (widthDiff > 20 || dprDiff > 0.05) {
        if (cachedPdfDoc) {
          pdfRenderSeqId++;
          const badge = document.getElementById(badgeId);
          renderCleanPdfPages(cachedPdfDoc, canvasContainer, badge, pdfRenderSeqId);
        } else {
          init(currentLoadedPdf);
        }
      }
    }

    function onDprChangeHandler() {
      clearTimeout(pdfResizeTimer);
      pdfResizeTimer = setTimeout(function () {
        triggerPdfRerender();
        try {
          if (dprMediaQuery && dprMediaQuery.removeEventListener) {
            dprMediaQuery.removeEventListener('change', onDprChangeHandler);
          }
          dprMediaQuery = window.matchMedia('(resolution: ' + (window.devicePixelRatio || 1) + 'dppx)');
          if (dprMediaQuery.addEventListener) {
            dprMediaQuery.addEventListener('change', onDprChangeHandler);
          }
        } catch (e) {}
      }, 300);
    }

    function setupWatchers() {
      try {
        if (dprMediaQuery) {
          dprMediaQuery.removeEventListener('change', onDprChangeHandler);
        }
      } catch (e) {}

      try {
        dprMediaQuery = window.matchMedia('(resolution: ' + (window.devicePixelRatio || 1) + 'dppx)');
        if (dprMediaQuery.addEventListener) {
          dprMediaQuery.addEventListener('change', onDprChangeHandler);
        } else if (dprMediaQuery.addListener) {
          dprMediaQuery.addListener(onDprChangeHandler);
        }
      } catch (e) {}
    }

    // Responsive window resize with 300ms debounce
    window.addEventListener('resize', function () {
      clearTimeout(pdfResizeTimer);
      pdfResizeTimer = setTimeout(triggerPdfRerender, 300);
    });

    return {
      init: init,
      triggerRerender: triggerPdfRerender
    };
  }

  const listeningPdfViewer = createCleanPdfViewer({
    canvasContainerId: 'pdfCanvasPages',
    iframeViewerId: 'listeningPdfViewer',
    badgeId: 'pdfViewerBadge'
  });

  const readingPdfViewer = createCleanPdfViewer({
    canvasContainerId: 'readingPdfCanvasPages',
    iframeViewerId: 'readingPdfViewer',
    badgeId: 'readingPdfViewerBadge'
  });

  // Backward-compatible global PDF viewer initializer for listening
  function initCleanPdfViewer(pdfUrl) {
    listeningPdfViewer.init(pdfUrl);
  }

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
      '05': { prefix: 'C14T1',  folder: 'Batch 05', ext: 'mp3', sep: '  -SECTION -' },
      '06': { prefix: 'C14T2',  folder: 'Batch 06', ext: 'mp3', sep: '  -SECTION -' },
      '07': { prefix: 'C14T3',  folder: 'Batch 07', ext: 'mp3', sep: '  -SECTION -' },
      '08': { prefix: 'C14T4',  folder: 'Batch 08', ext: 'mp3', sep: '  -SECTION -' },
      '09': { prefix: 'C15T1',  folder: 'Batch 09', ext: 'm4a', sep: '  -SECTION -' },
      '10': { prefix: 'C15T2',  folder: 'Batch 010', ext: 'm4a', sep: '  -SECTION -' },
      '11': { prefix: 'C15T3',  folder: 'Batch 011', ext: 'm4a', sep: ' -SECTION -' },
      '12': { prefix: 'C15T4',  folder: 'Batch 012', ext: 'm4a', sep: ' -SECTION -' }
    };

    const audioInfo = AUDIO_PATH_MAP[batchId] || null;
    const hasPdf = Boolean(batch.questionPdfUrl);

    let html = '';
    batch.listeningSections.forEach(function (sec) {
      // Build section audio path dynamically
      let audioTag = '';
      if (audioInfo) {
        const sep = audioInfo.sep || ' -SECTION -';
        const rawAudioPath = 'assets/Audio/Listening/' + audioInfo.folder + '/' + audioInfo.prefix + sep + sec.sectionNumber + '.' + audioInfo.ext;
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

  // Render Reading content dynamically based on batch
  function renderDynamicReadingContent(batchId) {
    const passageContainer = document.getElementById('readingPassageContainer');
    const questionsContainer = document.getElementById('readingQuestionsContainer');
    const pdfContainer = document.getElementById('readingPdfContainer');
    const readingHeaderBatchLabel = document.getElementById('readingHeaderBatchLabel');
    const readingBannerSubtitle = document.getElementById('readingBannerSubtitle');

    if (readingHeaderBatchLabel) {
      readingHeaderBatchLabel.textContent = 'Batch ' + batchId;
    }

    const batch = window.IeltsPracticeConfig ? window.IeltsPracticeConfig.getBatch(batchId) : null;
    if (!batch) return;

    const hasReadingPdf = Boolean(batch.readingPdfUrl);

    if (hasReadingPdf) {
      if (readingBannerSubtitle) {
        readingBannerSubtitle.textContent = 'Academic Reading — 3 Passages, 40 Questions (60 Minutes)';
      }
      // PDF-First Reading: Hide old template passage and questions containers completely
      if (passageContainer) {
        passageContainer.innerHTML = '';
        passageContainer.style.display = 'none';
      }
      if (questionsContainer) {
        questionsContainer.innerHTML = '';
        questionsContainer.style.display = 'none';
      }
      if (pdfContainer) {
        pdfContainer.style.display = '';
        readingPdfViewer.init(batch.readingPdfUrl);
      }
      return;
    }

    // Fallback: If no PDF is configured, hide PDF container and render old HTML template
    if (pdfContainer) {
      pdfContainer.style.display = 'none';
    }
    if (passageContainer) {
      passageContainer.style.display = '';
    }
    if (questionsContainer) {
      questionsContainer.style.display = '';
    }

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

  // --- 5C. DYNAMIC WRITING CONTENT RENDERER (READ-ONLY PRACTICE) ---
  function renderDynamicWritingContent(batchId) {
    const writingIframe = document.getElementById('writingPdfViewer');
    const writingHeaderLabel = document.getElementById('writingHeaderBatchLabel');
    if (writingHeaderLabel) {
      writingHeaderLabel.textContent = 'Batch ' + batchId;
    }

    const batch = window.IeltsPracticeConfig ? window.IeltsPracticeConfig.getBatch(batchId) : null;
    const num = parseInt(batchId, 10);
    const defaultFolder = (num >= 10 && num <= 12) ? ('batch 0' + num) : ('batch ' + batchId);
    const pdfUrl = (batch && batch.writingPdfUrl) ? batch.writingPdfUrl : 'assets/data/writing/' + defaultFolder + '/' + defaultFolder + '.pdf';

    if (writingIframe && pdfUrl) {
      const cleanUrl = pdfUrl + (pdfUrl.indexOf('#') === -1 ? '#toolbar=0&navpanes=0&scrollbar=1&view=FitH' : '');
      if (writingIframe.getAttribute('src') !== cleanUrl) {
        writingIframe.src = cleanUrl;
      }
    }
  }

  // --- 5D. DYNAMIC SPEAKING CONTENT RENDERER (READ-ONLY PRACTICE) ---
  function renderDynamicSpeakingContent(batchId) {
    const speakingIframe = document.getElementById('speakingPdfViewer');
    const speakingHeaderLabel = document.getElementById('speakingHeaderBatchLabel');
    if (speakingHeaderLabel) {
      speakingHeaderLabel.textContent = 'Batch ' + batchId;
    }

    const batch = window.IeltsPracticeConfig ? window.IeltsPracticeConfig.getBatch(batchId) : null;
    const num = parseInt(batchId, 10);
    const defaultFolder = (num >= 10 && num <= 12) ? ('batch 0' + num) : ('batch ' + batchId);
    const pdfUrl = (batch && batch.speakingPdfUrl) ? batch.speakingPdfUrl : 'assets/data/speaking/' + defaultFolder + '/' + defaultFolder + '.pdf';

    if (speakingIframe && pdfUrl) {
      const cleanUrl = pdfUrl + (pdfUrl.indexOf('#') === -1 ? '#toolbar=0&navpanes=0&scrollbar=1&view=FitH' : '');
      if (speakingIframe.getAttribute('src') !== cleanUrl) {
        speakingIframe.src = cleanUrl;
      }
    }
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

  // --- 7. ANSWER KEY SCORING FUNCTION (UNLIMITED PRACTICE & PRO-RATA SCORING) ---
  function evaluateSkill(skill, userAnswers) {
    const totalQuestions = 40;
    const batchConfig = window.IeltsPracticeConfig ? window.IeltsPracticeConfig.getBatch(ACTIVE_BATCH) : null;
    const answerKeys = batchConfig
      ? (skill === 'listening' ? batchConfig.listeningAnswerKeys : batchConfig.readingAnswerKeys)
      : null;

    // Check if keys are configured
    const keysConfigured = Boolean(answerKeys && typeof answerKeys === 'object' && Object.keys(answerKeys).length > 0);

    // Count non-empty answered questions
    let rawAnsweredCount = 0;
    for (let i = 1; i <= totalQuestions; i++) {
      const val = (userAnswers[String(i)] || '').trim();
      if (val) rawAnsweredCount++;
    }

    if (!keysConfigured) {
      return {
        isConfigured: false,
        total: totalQuestions,
        answeredCount: rawAnsweredCount,
        unansweredCount: totalQuestions - rawAnsweredCount,
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
      // Strip leading and trailing punctuation like periods or commas while keeping words clean
      const cleanUserAns = rawUserAns.replace(/^[.,;:!?'"“”‘’]+|[.,;:!?'"“”‘’]+$/g, '').replace(/\s+/g, ' ');
      const acceptable = answerKeys[qKey];

      if (!cleanUserAns) {
        unanswered++;
        details[qKey] = { status: 'unanswered', userAns: '' };
      } else if (!acceptable) {
        // No key for this particular question
        unanswered++;
        details[qKey] = { status: 'unanswered', userAns: rawUserAns };
      } else {
        // Expand acceptable variants (support arrays and slash-separated alternatives like 'bike / bicycle')
        const acceptableItems = [];
        (Array.isArray(acceptable) ? acceptable : [acceptable]).forEach(function (item) {
          const str = String(item).trim();
          if (str.includes('/')) {
            str.split('/').forEach(function (part) {
              if (part.trim()) acceptableItems.push(part.trim());
            });
          }
          acceptableItems.push(str);
        });

        // Case-insensitive and whitespace-normalized scoring for IELTS
        const cleanUserAnsLower = cleanUserAns.toLowerCase();
        const isMatch = acceptableItems.some(function (a) {
          const s = String(a).trim().replace(/\s+/g, ' ').toLowerCase();
          return cleanUserAnsLower === s;
        });

        if (isMatch) {
          correct++;
          details[qKey] = { status: 'correct', userAns: rawUserAns };
        } else {
          incorrect++;
          details[qKey] = { status: 'incorrect', userAns: rawUserAns };
        }
      }
    }

    const answeredCount = correct + incorrect;
    const accuracy = answeredCount > 0 ? ((correct / answeredCount) * 100) : 0;
    const isFull = (answeredCount === totalQuestions);
    const isPartial = (answeredCount > 0 && answeredCount < totalQuestions);

    const readingMode = (batchConfig && batchConfig.readingMode) ? batchConfig.readingMode : 'academic';
    let estimatedBand = '1.0';
    let bandLabel = 'Estimated Band (Full 40 Soal)';
    let disclaimerText = '';

    if (isFull) {
      estimatedBand = window.IeltsPracticeConfig.rawToBand(correct, skill, readingMode);
      bandLabel = 'Estimated Band (Full 40 Soal)';
      disclaimerText = 'Skor prediksi di atas dihitung menggunakan tabel konversi baku 40 soal resmi IELTS ' + (skill === 'reading' ? '(' + (readingMode === 'general' ? 'General Training' : 'Academic') + ')' : '') + '. Evaluasi simulasi mandiri dan bukan sertifikat resmi IELTS.';
    } else if (isPartial) {
      // Pro-rata estimation: scale accuracy to 40 questions to determine equivalent practice band
      const projectedRaw = Math.round((correct / answeredCount) * 40);
      estimatedBand = window.IeltsPracticeConfig.rawToBand(projectedRaw, skill, readingMode);
      bandLabel = 'Estimated Practice Band (Estimasi Latihan)';
      disclaimerText = 'Estimasi Latihan Mandiri berdasarkan akurasi ' + accuracy.toFixed(1) + '% dari ' + answeredCount + ' soal yang dikerjakan. Bukan skor resmi IELTS 40 soal.';
    } else {
      estimatedBand = '1.0';
      bandLabel = 'Belum Ada Soal Dikerjakan';
      disclaimerText = 'Tidak ada jawaban yang diisi untuk sesi latihan ini. Silakan kerjakan soal untuk mendapatkan estimasi band score.';
    }

    return {
      isConfigured: true,
      answeredCount: answeredCount,
      correct: correct,
      incorrect: incorrect,
      unanswered: unanswered,
      total: totalQuestions,
      accuracy: accuracy,
      estimatedBand: estimatedBand,
      bandLabel: bandLabel,
      isPartial: isPartial,
      disclaimerText: disclaimerText,
      readingMode: readingMode,
      details: details
    };
  }

  // --- 8. RESULTS RENDERING & ANSWER REVIEW ---
  function renderScoringResults(skill, resultContainerId, resultData) {
    const container = document.getElementById(resultContainerId);
    if (!container) return;

    if (!resultData.isConfigured) {
      container.innerHTML = `
        <div class="exam-results-card unconfigured">
          <div class="results-header">
            <div class="results-title-group">
              <span class="results-badge notice"><i class="fa-solid fa-triangle-exclamation"></i> Kunci Jawaban Belum Dikonfigurasi</span>
              <h3 class="results-heading">Hasil Latihan — ${skill.toUpperCase()} (Batch ${ACTIVE_BATCH})</h3>
            </div>
          </div>
          <div class="results-notice-box">
            <p><i class="fa-solid fa-circle-info"></i> ${resultData.message}</p>
            <p style="margin-top: 8px; font-size: 0.825rem; color: var(--text-muted);">
              ${resultData.answeredCount} jawaban yang Anda isi (${resultData.unansweredCount} belum terisi) telah tercatat untuk sesi ini.
            </p>
          </div>
          <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: flex-end;">
            <button type="button" class="btn btn-try-again btn-sm" id="btnTryAgain_${skill}">
              <i class="fa-solid fa-rotate-right"></i> Try Again (Coba Lagi Latihan Ini)
            </button>
          </div>
        </div>
      `;
      container.style.display = 'block';

      const btnTryAgainUnconf = document.getElementById('btnTryAgain_' + skill);
      if (btnTryAgainUnconf) {
        btnTryAgainUnconf.addEventListener('click', function () {
          resetSkillSession(skill);
        });
      }
      return;
    }

    container.innerHTML = `
      <div class="exam-results-card scored">
        <div class="results-header">
          <div class="results-title-group">
            <span class="results-badge success">
              <i class="fa-solid fa-circle-check"></i> ${resultData.isPartial ? 'Latihan Sebagian Selesai &amp; Dinilai' : 'Sesi Selesai &amp; Dinilai Lengkap'}
            </span>
            <h3 class="results-heading">Hasil Evaluasi Sesi — ${skill.toUpperCase()} (Batch ${ACTIVE_BATCH})</h3>
          </div>
          <div class="band-score-pill ${resultData.isPartial ? 'partial-pill' : ''}">
            <span class="band-score-label">${resultData.bandLabel}</span>
            <span class="band-score-value">${resultData.estimatedBand}</span>
          </div>
        </div>

        <div class="results-stats-grid">
          <div class="stat-card stat-answered">
            <span class="stat-num">${resultData.answeredCount} / ${resultData.total}</span>
            <span class="stat-lbl"><i class="fa-solid fa-pen-to-square"></i> Soal Dikerjakan</span>
          </div>
          <div class="stat-card stat-correct">
            <span class="stat-num">${resultData.correct}</span>
            <span class="stat-lbl"><i class="fa-solid fa-check"></i> Jawaban Benar</span>
          </div>
          <div class="stat-card stat-incorrect">
            <span class="stat-num">${resultData.incorrect}</span>
            <span class="stat-lbl"><i class="fa-solid fa-xmark"></i> Jawaban Salah</span>
          </div>
          <div class="stat-card stat-accuracy">
            <span class="stat-num">${resultData.accuracy.toFixed(1)}%</span>
            <span class="stat-lbl"><i class="fa-solid fa-chart-pie"></i> Akurasi Pengerjaan</span>
          </div>
        </div>

        <div class="results-disclaimer">
          <strong>Catatan Evaluasi:</strong> ${resultData.disclaimerText}
        </div>

        <!-- Unlimited Practice Actions Bar -->
        <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-infinity" style="color: var(--accent-primary);"></i>
            <span><strong>Unlimited Practice:</strong> Tidak ada batas percobaan. Ulangi latihan kapan saja dari awal.</span>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <button type="button" class="btn btn-secondary btn-sm" id="btnScrollTop_${skill}">
              <i class="fa-solid fa-arrow-up"></i> Review Jawaban
            </button>
            <button type="button" class="btn btn-try-again btn-sm" id="btnTryAgain_${skill}">
              <i class="fa-solid fa-rotate-right"></i> Try Again (Coba Lagi)
            </button>
          </div>
        </div>
      </div>
    `;
    container.style.display = 'block';

    // Apply visual correct/incorrect feedback on answer input rows
    applyAnswerReview(skill, resultData);

    // Attach click listener to Try Again button
    const btnTryAgain = document.getElementById('btnTryAgain_' + skill);
    if (btnTryAgain) {
      btnTryAgain.addEventListener('click', function () {
        resetSkillSession(skill);
      });
    }

    const btnScrollTop = document.getElementById('btnScrollTop_' + skill);
    if (btnScrollTop) {
      btnScrollTop.addEventListener('click', function () {
        const target = document.getElementById(skill + '_ans_1') || document.getElementById('sec-' + skill);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  // Visual answer review feedback
  function applyAnswerReview(skill, resultData) {
    if (!resultData || !resultData.details) return;

    for (let i = 1; i <= 40; i++) {
      const qKey = String(i);
      const detail = resultData.details[qKey];
      const input = document.getElementById(skill + '_ans_' + i);
      const row = input ? input.closest('.answer-row') : null;

      if (row && detail) {
        // Clean any existing status icon or hint
        const oldIcon = row.querySelector('.answer-status-icon');
        if (oldIcon) oldIcon.remove();
        const oldHint = row.querySelector('.answer-key-hint');
        if (oldHint) oldHint.remove();

        if (detail.status === 'correct') {
          row.classList.add('is-correct');
          row.classList.remove('is-incorrect');
          const icon = document.createElement('span');
          icon.className = 'answer-status-icon is-correct';
          icon.setAttribute('title', 'Jawaban Benar');
          icon.setAttribute('aria-label', 'Benar');
          icon.innerHTML = '<i class="fa-solid fa-check"></i>';
          row.appendChild(icon);
        } else if (detail.status === 'incorrect') {
          row.classList.add('is-incorrect');
          row.classList.remove('is-correct');
          const icon = document.createElement('span');
          icon.className = 'answer-status-icon is-incorrect';
          icon.setAttribute('title', 'Jawaban Salah');
          icon.setAttribute('aria-label', 'Salah');
          icon.innerHTML = '<i class="fa-solid fa-xmark"></i>';
          row.appendChild(icon);
        } else {
          row.classList.remove('is-correct', 'is-incorrect');
        }
      }
    }
  }

  function renderWritingResults(containerId, resultData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const subId = (resultData && resultData.submissionId) ? resultData.submissionId : '-';
    const name = (resultData && resultData.studentName) ? resultData.studentName : '-';
    const prog = (resultData && resultData.program) ? resultData.program : '-';
    const t1Words = (resultData && resultData.task1Words) ? resultData.task1Words : 0;
    const t2Words = (resultData && resultData.task2Words) ? resultData.task2Words : 0;
    const timeStr = (resultData && resultData.timestamp) ? resultData.timestamp : new Date().toLocaleString('id-ID');
    const note = (resultData && resultData.isDuplicate)
      ? '<span style="color: #38BDF8;"><i class="fa-solid fa-circle-info"></i> Catatan: Pengiriman ulang dengan ID yang sama telah terkonfirmasi (tidak terjadi duplikasi data di spreadsheet).</span>'
      : '<span style="color: #10B981;"><i class="fa-solid fa-circle-check"></i> Pengiriman berhasil tercatat di spreadsheet &amp; berkas DOCX tersimpan di Google Drive.</span>';

    container.innerHTML = `
      <div class="exam-results-card submitted-only">
        <div class="results-header">
          <div class="results-title-group">
            <span class="results-badge success"><i class="fa-solid fa-circle-check"></i> Writing Berhasil Dikumpulkan</span>
            <h3 class="results-heading">Konfirmasi Sesi — WRITING (Batch ${ACTIVE_BATCH})</h3>
          </div>
          <div style="font-size: 0.825rem; color: var(--accent-hover); font-weight: 700; background: rgba(245, 158, 11, 0.1); padding: 5px 12px; border-radius: var(--radius-sm); border: 1px solid rgba(245, 158, 11, 0.3);">
            <i class="fa-solid fa-fingerprint"></i> ID: ${subId}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin: 20px 0;">
          <div style="background: rgba(15, 23, 42, 0.6); padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.75rem; color: var(--text-muted);"><i class="fa-solid fa-user"></i> Nama Siswa</div>
            <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-main); margin-top: 4px;">${name}</div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.6); padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.75rem; color: var(--text-muted);"><i class="fa-solid fa-graduation-cap"></i> Program</div>
            <div style="font-weight: 700; font-size: 0.95rem; color: var(--accent-primary); margin-top: 4px;">${prog}</div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.6); padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.75rem; color: var(--text-muted);"><i class="fa-solid fa-clock"></i> Waktu Pengiriman</div>
            <div style="font-weight: 600; font-size: 0.85rem; color: var(--text-body); margin-top: 4px;">${timeStr}</div>
          </div>
        </div>

        <div class="writing-summary-grid">
          <div class="writing-summary-card">
            <h4><i class="fa-solid fa-chart-column"></i> Task 1 (Report / Summary)</h4>
            <p>Status: <strong>Terkirim</strong> (${t1Words} kata)</p>
          </div>
          <div class="writing-summary-card">
            <h4><i class="fa-solid fa-pen-fancy"></i> Task 2 (Discursive Essay)</h4>
            <p>Status: <strong>Terkirim</strong> (${t2Words} kata)</p>
          </div>
        </div>

        <p class="results-note-locked">
          <i class="fa-solid fa-shield-halved"></i> ${note}<br>
          Penilaian kriteria resmi IELTS (Task Response, Coherence &amp; Cohesion, Lexical Resource, Grammatical Range &amp; Accuracy) akan dilakukan oleh instruktur/tutor.
        </p>

        <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            <i class="fa-solid fa-circle-check" style="color: #10B981;"></i> Workspace telah dikosongkan dan siap digunakan kembali untuk latihan berikutnya.
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="btnNewWritingSession">
            <i class="fa-solid fa-arrow-up"></i> Tulis Jawaban Baru / Sesi Baru
          </button>
        </div>
      </div>
    `;
    container.style.display = 'block';

    const btnNew = document.getElementById('btnNewWritingSession');
    if (btnNew) {
      btnNew.addEventListener('click', function () {
        resetSkillSession('writing');
        const target = document.getElementById('writingStudentName') || document.getElementById('sec-writing');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  function renderSpeakingResults(containerId, notesLength) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="exam-results-card submitted-only">
        <div class="results-header">
          <div class="results-title-group">
            <span class="results-badge success"><i class="fa-solid fa-circle-check"></i> Speaking Selesai</span>
            <h3 class="results-heading">Konfirmasi Sesi — SPEAKING (Batch ${ACTIVE_BATCH})</h3>
          </div>
        </div>
        <div class="results-notice-box">
          <p><i class="fa-solid fa-circle-check"></i> Sesi Speaking Parts 1, 2, dan 3 telah selesai dan dikunci untuk Batch ${ACTIVE_BATCH}.</p>
          <p style="margin-top: 8px; font-size: 0.825rem; color: var(--text-muted);">
            Evaluasi Speaking dilakukan secara langsung berdasarkan kriteria resmi IELTS: Fluency &amp; Coherence, Lexical Resource, Grammatical Range &amp; Accuracy, dan Pronunciation.
          </p>
        </div>
        <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            <i class="fa-solid fa-infinity" style="color: var(--accent-primary);"></i> Unlimited Practice: Anda dapat mengulang simulasi speaking kapan saja.
          </div>
          <button type="button" class="btn btn-try-again btn-sm" id="btnTryAgain_speaking">
            <i class="fa-solid fa-rotate-right"></i> Try Again (Mulai Sesi Baru)
          </button>
        </div>
      </div>
    `;
    container.style.display = 'block';

    const btnTryAgainSpeaking = document.getElementById('btnTryAgain_speaking');
    if (btnTryAgainSpeaking) {
      btnTryAgainSpeaking.addEventListener('click', function () {
        resetSkillSession('speaking');
      });
    }
  }

  // --- 9. LOCKING & RESET CONTROLS ---
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
    const submitBtn = document.getElementById('btnSubmitSpeaking');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add('disabled'); }

    const bannerBadge = document.getElementById('speakingStatusBadge');
    if (bannerBadge) {
      bannerBadge.className = 'status-badge locked';
      bannerBadge.innerHTML = '<i class="fa-solid fa-lock"></i> Submitted';
    }
  }

  // --- UNLIMITED ATTEMPTS RESET ENGINE ---
  function resetSkillSession(skill) {
    // 1. Reset Storage for active batch and skill
    Storage.set(skill, 'status', 'not_started');
    Storage.set(skill, 'answers', {});
    try {
      localStorage.removeItem(Storage.getKey(skill, 'timer'));
      localStorage.removeItem(Storage.getKey(skill, 'result'));
    } catch (e) {
      console.warn('Storage clear error:', e);
    }

    // 2. Stop active timer
    if (activeIntervals[skill]) {
      clearInterval(activeIntervals[skill]);
      delete activeIntervals[skill];
    }

    // 3. Reset input elements & remove review hints
    if (skill === 'listening' || skill === 'reading') {
      for (let i = 1; i <= 40; i++) {
        const input = document.getElementById(skill + '_ans_' + i);
        if (input) {
          input.value = '';
          input.disabled = false;
          input.readOnly = false;
          input.classList.remove('input-locked');
        }
        const row = input ? input.closest('.answer-row') : null;
        if (row) {
          row.classList.remove('is-correct', 'is-incorrect');
          const statusIcon = row.querySelector('.answer-status-icon');
          if (statusIcon) statusIcon.remove();
          const hint = row.querySelector('.answer-key-hint');
          if (hint) hint.remove();
        }
      }
    } else if (skill === 'writing') {
      const nameInput = document.getElementById('writingStudentName');
      const progSelect = document.getElementById('writingProgram');
      const t1Area = document.getElementById('writingTask1Answer');
      const t2Area = document.getElementById('writingTask2Answer');
      const t1Count = document.getElementById('task1WordCount');
      const t2Count = document.getElementById('task2WordCount');

      if (nameInput) nameInput.value = '';
      if (progSelect) progSelect.value = '';
      if (t1Area) { t1Area.value = ''; t1Area.disabled = false; }
      if (t2Area) { t2Area.value = ''; t2Area.disabled = false; }
      if (t1Count) t1Count.textContent = '0';
      if (t2Count) t2Count.textContent = '0';

      try {
        localStorage.removeItem(Storage.getKey('writing', 'draft_task1'));
        localStorage.removeItem(Storage.getKey('writing', 'draft_task2'));
      } catch (e) {}

      currentWritingSubmissionId = null;
    }

    // 4. Reset Timer display
    const timerElemId = skill === 'listening' ? 'timerListening' : skill === 'reading' ? 'timerReading' : 'timerWriting';
    const timerElem = document.getElementById(timerElemId);
    const defaultDuration = TIMERS_CONFIG[skill] || 1800;
    if (timerElem) {
      timerElem.textContent = formatTime(defaultDuration);
    }

    // 5. Reset Start & Submit buttons
    const capSkill = skill.charAt(0).toUpperCase() + skill.slice(1);
    const startBtn = document.getElementById('btnStart' + capSkill);
    const submitBtn = document.getElementById('btnSubmit' + capSkill);
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.style.display = 'inline-flex';
    }
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('disabled');
    }

    // 6. Reset Banner Badge
    const bannerBadge = document.getElementById(skill + 'StatusBadge');
    if (bannerBadge) {
      bannerBadge.className = 'status-badge active';
      bannerBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Ready';
    }

    // 7. Hide Results Container
    const resultsArea = document.getElementById(skill + 'ResultsArea');
    if (resultsArea) {
      resultsArea.innerHTML = '';
      resultsArea.style.display = 'none';
    }

    // 8. Scroll smoothly to first question or section top
    const firstTarget = document.getElementById(skill + '_ans_1') || document.getElementById('sec-' + skill);
    if (firstTarget) {
      firstTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (firstTarget.focus && typeof firstTarget.focus === 'function') {
        try { firstTarget.focus(); } catch (e) {}
      }
    }

    // 9. Toast notification
    showToast('🔄 Sesi baru ' + skill.toUpperCase() + ' dimulai! Jawaban dan timer telah di-reset.');
  }

  // --- 10. MODAL CONFIRMATION HANDLER ---
  let pendingSubmission = null;

  function showConfirmModal(skill, onConfirm) {
    const modal = document.getElementById('submissionConfirmModal');
    const skillNameElem = document.getElementById('confirmModalSkillName');
    const batchNameElem = document.getElementById('confirmModalBatchName');
    const confirmBtn = document.getElementById('btnConfirmSubmitNow');

    if (!modal) {
      if (window.confirm('Kumpulkan jawaban ' + skill.toUpperCase() + ' sekarang?')) {
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

  // --- 11. TOAST NOTIFICATION HELPER ---
  function showToast(msg) {
    const toastNotice = document.getElementById('toastNotice');
    const toastMessage = document.getElementById('toastMessage');
    if (toastNotice && toastMessage) {
      toastMessage.textContent = msg;
      toastNotice.classList.add('show');
      setTimeout(function () {
        toastNotice.classList.remove('show');
      }, 5000);
    } else {
      alert(msg);
    }
  }

  function notifyTimeExpired(skill) {
    showToast('⏰ Waktu pengerjaan ' + skill.toUpperCase() + ' telah habis! Jawaban Anda tidak dihapus. Silakan klik tombol "Submit ' + skill.toUpperCase() + '" untuk melihat hasil.');
  }

  // --- 11B. EXAM SECTION FILTER BARS & SWITCHER ---
  function initSectionFilterBars() {
    // Listening Section Filters (All, 1-2, 3-4)
    const listeningBar = document.getElementById('listeningSectionFilterBar');
    if (listeningBar) {
      const chips = listeningBar.querySelectorAll('.filter-chip-btn');
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          const filter = this.getAttribute('data-filter');
          chips.forEach(function (c) { c.classList.remove('active'); });
          this.classList.add('active');
          applyListeningFilter(filter);
        });
      });

      const secParam = urlParams.get('section');
      if (secParam === '1-2') {
        const chip12 = listeningBar.querySelector('[data-filter="1-2"]');
        if (chip12) chip12.click();
      } else if (secParam === '3-4') {
        const chip34 = listeningBar.querySelector('[data-filter="3-4"]');
        if (chip34) chip34.click();
      }
    }

    // Reading Section Filters (All, p1, p2, p3)
    const readingBar = document.getElementById('readingSectionFilterBar');
    if (readingBar) {
      const chips = readingBar.querySelectorAll('.filter-chip-btn');
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          const filter = this.getAttribute('data-filter');
          chips.forEach(function (c) { c.classList.remove('active'); });
          this.classList.add('active');
          applyReadingFilter(filter);
        });
      });

      const passParam = urlParams.get('passage');
      if (passParam === '1' || passParam === 'p1') {
        const chipP1 = readingBar.querySelector('[data-filter="p1"]');
        if (chipP1) chipP1.click();
      } else if (passParam === '2' || passParam === 'p2') {
        const chipP2 = readingBar.querySelector('[data-filter="p2"]');
        if (chipP2) chipP2.click();
      } else if (passParam === '3' || passParam === 'p3') {
        const chipP3 = readingBar.querySelector('[data-filter="p3"]');
        if (chipP3) chipP3.click();
      }
    }
  }

  function applyListeningFilter(filter) {
    for (let i = 1; i <= 40; i++) {
      const input = document.getElementById('listening_ans_' + i);
      const row = input ? input.closest('.answer-row') : null;
      if (!row) continue;

      if (filter === '1-2') {
        row.style.display = (i >= 1 && i <= 20) ? 'flex' : 'none';
      } else if (filter === '3-4') {
        row.style.display = (i >= 21 && i <= 40) ? 'flex' : 'none';
      } else {
        row.style.display = 'flex';
      }
    }
  }

  function applyReadingFilter(filter) {
    for (let i = 1; i <= 40; i++) {
      const input = document.getElementById('reading_ans_' + i);
      const row = input ? input.closest('.answer-row') : null;
      if (!row) continue;

      if (filter === 'p1') {
        row.style.display = (i >= 1 && i <= 13) ? 'flex' : 'none';
      } else if (filter === 'p2') {
        row.style.display = (i >= 14 && i <= 26) ? 'flex' : 'none';
      } else if (filter === 'p3') {
        row.style.display = (i >= 27 && i <= 40) ? 'flex' : 'none';
      } else {
        row.style.display = 'flex';
      }
    }
  }

  function initHeaderSkillSwitcher() {
    const switcher = document.getElementById('examSkillSwitcher');
    if (!switcher) return;

    const tabs = switcher.querySelectorAll('.exam-skill-tab');
    const sections = {
      listening: document.getElementById('sec-listening'),
      reading: document.getElementById('sec-reading'),
      writing: document.getElementById('sec-writing'),
      speaking: document.getElementById('sec-speaking')
    };

    function activateSkillTab(targetSkill) {
      tabs.forEach(function (t) {
        if (t.getAttribute('data-skill') === targetSkill) {
          t.classList.add('active');
        } else {
          t.classList.remove('active');
        }
      });

      if (targetSkill === 'all') {
        Object.keys(sections).forEach(function (k) {
          if (sections[k]) sections[k].style.display = 'block';
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        Object.keys(sections).forEach(function (k) {
          if (sections[k]) {
            if (k === targetSkill) {
              sections[k].style.display = 'block';
              sections[k].scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              sections[k].style.display = 'none';
            }
          }
        });
      }
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const sk = this.getAttribute('data-skill');
        activateSkillTab(sk);
      });
    });

    // Check URL skill parameter
    const initialSkill = urlParams.get('skill');
    if (initialSkill && (sections[initialSkill] || initialSkill === 'all')) {
      activateSkillTab(initialSkill);
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

    // 1B. Dynamic Content Rendering for Active Batch
    renderDynamicListeningQuestions(ACTIVE_BATCH);
    renderDynamicReadingContent(ACTIVE_BATCH);
    renderDynamicWritingContent(ACTIVE_BATCH);
    renderDynamicSpeakingContent(ACTIVE_BATCH);

    // 1C. Skill Switcher & Section Filters
    initHeaderSkillSwitcher();
    initSectionFilterBars();

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
          // Auto-set status to in_progress if was not_started
          if (Storage.get('listening', 'status', 'not_started') === 'not_started') {
            Storage.set('listening', 'status', 'in_progress');
          }
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

          // 2. Mark submitted & stop timer
          Storage.set('listening', 'status', 'submitted');
          if (activeIntervals.listening) {
            clearInterval(activeIntervals.listening);
            delete activeIntervals.listening;
          }

          // 3. Evaluate score with pro-rata support
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

    // Ensure clean state on refresh (do not persist submitted lock across refreshes)
    if (listeningStatus === 'submitted') {
      Storage.set('listening', 'status', 'not_started');
      Storage.set('listening', 'answers', {});
      try {
        localStorage.removeItem(Storage.getKey('listening', 'result'));
        localStorage.removeItem(Storage.getKey('listening', 'timer'));
      } catch (e) {}
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
        const handleReadingUpdate = function () {
          if (Storage.get('reading', 'status', 'not_started') === 'submitted') return;
          readingAnswers[String(i)] = input.value;
          Storage.set('reading', 'answers', readingAnswers);
          if (Storage.get('reading', 'status', 'not_started') === 'not_started') {
            Storage.set('reading', 'status', 'in_progress');
          }
        };
        input.addEventListener('input', handleReadingUpdate);
        input.addEventListener('change', handleReadingUpdate);
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
          for (let i = 1; i <= 40; i++) {
            const input = document.getElementById('reading_ans_' + i);
            if (input) {
              readingAnswers[String(i)] = input.value;
            }
          }
          Storage.set('reading', 'answers', readingAnswers);

          // Mark submitted & stop timer
          Storage.set('reading', 'status', 'submitted');
          if (activeIntervals.reading) {
            clearInterval(activeIntervals.reading);
            delete activeIntervals.reading;
          }

          // Evaluate score with pro-rata support
          const results = evaluateSkill('reading', readingAnswers);
          Storage.set('reading', 'result', results);

          // Lock section & render results
          lockReadingSection();
          renderScoringResults('reading', 'readingResultsArea', results);

          const resultsElem = document.getElementById('readingResultsArea');
          if (resultsElem) {
            resultsElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    }

    // Ensure clean state on refresh (do not persist submitted lock across refreshes)
    if (readingStatus === 'submitted') {
      Storage.set('reading', 'status', 'not_started');
      Storage.set('reading', 'answers', {});
      try {
        localStorage.removeItem(Storage.getKey('reading', 'result'));
        localStorage.removeItem(Storage.getKey('reading', 'timer'));
      } catch (e) {}
    }

    // -------------------------------------------------------------
    // WRITING WORKSPACE & GOOGLE APPS SCRIPT SUBMISSION
    // -------------------------------------------------------------
    const WRITING_GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxVehjdaBC6Du7xTO74jM0Q-eGs8I-oHVOkqE-s6graogqou5DNKnNzxPe9xxAU8x51Wg/exec';
    let currentWritingSubmissionId = null;
    let isSubmittingWriting = false;

    function countWords(str) {
      if (!str) return 0;
      const matches = str.trim().match(/\S+/g);
      return matches ? matches.length : 0;
    }

    function getOrCreateWritingSubmissionId() {
      if (!currentWritingSubmissionId) {
        const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
        currentWritingSubmissionId = 'ETIPS-WR-B' + ACTIVE_BATCH + '-' + Date.now() + '-' + rand;
      }
      return currentWritingSubmissionId;
    }

    const writingStudentNameInput = document.getElementById('writingStudentName');
    const writingProgramSelect = document.getElementById('writingProgram');
    const writingTask1Textarea = document.getElementById('writingTask1Answer');
    const writingTask2Textarea = document.getElementById('writingTask2Answer');
    const task1WordCountElem = document.getElementById('task1WordCount');
    const task2WordCountElem = document.getElementById('task2WordCount');

    // 1. Mandatory Identity: ALWAYS reset/empty on load. NEVER saved in storage.
    if (writingStudentNameInput) writingStudentNameInput.value = '';
    if (writingProgramSelect) writingProgramSelect.value = '';

    // 2. Draft Answers: Restore & Autosave only for Task 1 and Task 2
    if (writingTask1Textarea) {
      const savedTask1 = Storage.get('writing', 'draft_task1', '');
      if (savedTask1) {
        writingTask1Textarea.value = savedTask1;
        if (task1WordCountElem) task1WordCountElem.textContent = countWords(savedTask1);
      }
      writingTask1Textarea.addEventListener('input', function () {
        const val = writingTask1Textarea.value;
        Storage.set('writing', 'draft_task1', val);
        if (task1WordCountElem) task1WordCountElem.textContent = countWords(val);
      });
    }

    if (writingTask2Textarea) {
      const savedTask2 = Storage.get('writing', 'draft_task2', '');
      if (savedTask2) {
        writingTask2Textarea.value = savedTask2;
        if (task2WordCountElem) task2WordCountElem.textContent = countWords(savedTask2);
      }
      writingTask2Textarea.addEventListener('input', function () {
        const val = writingTask2Textarea.value;
        Storage.set('writing', 'draft_task2', val);
        if (task2WordCountElem) task2WordCountElem.textContent = countWords(val);
      });
    }

    // Timer setup
    initSectionTimer('writing', 'timerWriting', function () {
      notifyTimeExpired('writing');
    });

    const btnStartWriting = document.getElementById('btnStartWriting');
    if (btnStartWriting) {
      btnStartWriting.addEventListener('click', function () {
        startTimer('writing', 'timerWriting', function () {
          notifyTimeExpired('writing');
        });
        btnStartWriting.style.display = 'none';
      });
    }

    // Submit handler
    const btnSubmitWriting = document.getElementById('btnSubmitWriting');
    if (btnSubmitWriting) {
      btnSubmitWriting.addEventListener('click', function () {
        if (isSubmittingWriting) return;

        const nameVal = writingStudentNameInput ? writingStudentNameInput.value.trim() : '';
        const programVal = writingProgramSelect ? writingProgramSelect.value.trim() : '';
        const task1Ans = writingTask1Textarea ? writingTask1Textarea.value.trim() : '';
        const task2Ans = writingTask2Textarea ? writingTask2Textarea.value.trim() : '';

        // Validation
        if (!nameVal) {
          showToast('⚠️ Harap isi Nama Lengkap Siswa terlebih dahulu.', 4000);
          if (writingStudentNameInput) {
            writingStudentNameInput.focus();
            writingStudentNameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }

        if (!programVal) {
          showToast('⚠️ Harap pilih Program resmi IELTS terlebih dahulu.', 4000);
          if (writingProgramSelect) {
            writingProgramSelect.focus();
            writingProgramSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }

        if (!task1Ans && !task2Ans) {
          showToast('⚠️ Harap isi jawaban Task 1 atau Task 2 sebelum mengumpulkan.', 4000);
          if (writingTask1Textarea) writingTask1Textarea.focus();
          return;
        }

        const task1Words = countWords(task1Ans);
        const task2Words = countWords(task2Ans);

        // Show confirmation modal
        const confirmMsg = `
          <div style="text-align: left; line-height: 1.6;">
            <p><strong>Konfirmasi Pengumpulan Writing:</strong></p>
            <ul style="margin: 8px 0 12px 18px; font-size: 0.9rem;">
              <li><strong>Nama Siswa:</strong> ${nameVal}</li>
              <li><strong>Program:</strong> ${programVal}</li>
              <li><strong>Task 1:</strong> ${task1Words} kata</li>
              <li><strong>Task 2:</strong> ${task2Words} kata</li>
            </ul>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              Jawaban akan dikirim ke backend Google Apps Script, dicatat di spreadsheet, dan berkas DOCX akan tersimpan di Google Drive instruktur.
            </p>
          </div>
        `;

        const modal = document.getElementById('examConfirmModal');
        const msgElem = document.getElementById('confirmModalMessage');
        const btnProceed = document.getElementById('btnConfirmProceed');
        const btnCancel = document.getElementById('btnConfirmCancel');

        if (modal && msgElem && btnProceed && btnCancel) {
          msgElem.innerHTML = confirmMsg;
          modal.classList.add('open');

          const cleanup = function () {
            modal.classList.remove('open');
            btnProceed.removeEventListener('click', handleProceed);
            btnCancel.removeEventListener('click', handleCancel);
          };

          const handleCancel = function () {
            cleanup();
          };

          const handleProceed = async function () {
            cleanup();
            await executeWritingSubmission(nameVal, programVal, task1Ans, task2Ans, task1Words, task2Words);
          };

          btnProceed.addEventListener('click', handleProceed);
          btnCancel.addEventListener('click', handleCancel);
        } else {
          // Fallback if modal elements missing
          if (confirm('Kumpulkan jawaban Writing sekarang?')) {
            executeWritingSubmission(nameVal, programVal, task1Ans, task2Ans, task1Words, task2Words);
          }
        }
      });
    }

    async function executeWritingSubmission(nameVal, programVal, task1Ans, task2Ans, task1Words, task2Words) {
      if (isSubmittingWriting) return;
      isSubmittingWriting = true;

      const subId = getOrCreateWritingSubmissionId();
      const payload = {
        submissionId: subId,
        studentName: nameVal,
        program: programVal,
        task1Question: 'IELTS Academic Writing Task 1 — Batch ' + ACTIVE_BATCH,
        task1Answer: task1Ans,
        task2Question: 'IELTS Academic Writing Task 2 — Batch ' + ACTIVE_BATCH,
        task2Answer: task2Ans
      };

      if (btnSubmitWriting) {
        btnSubmitWriting.disabled = true;
        btnSubmitWriting.classList.add('disabled');
        btnSubmitWriting.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim ke Server...';
      }

      showToast('⏳ Sedang mengirim jawaban Writing ke Google Drive & Spreadsheet...', 5000);

      try {
        const response = await fetch(WRITING_GAS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload),
          redirect: 'follow'
        });

        if (!response.ok) {
          throw new Error('HTTP ' + response.status + ' ' + response.statusText);
        }

        const data = await response.json();
        console.log('[Writing Submission Result]:', data);

        if (data && data.success) {
          const finishedSubId = subId;
          // Clear currentWritingSubmissionId on success so future submissions generate a new one
          currentWritingSubmissionId = null;

          // Stop timer
          if (activeIntervals.writing) {
            clearInterval(activeIntervals.writing);
            delete activeIntervals.writing;
          }

          // Render result confirmation card
          renderWritingResults('writingResultsArea', {
            submissionId: finishedSubId,
            studentName: nameVal,
            program: programVal,
            task1Words: task1Words,
            task2Words: task2Words,
            fileUrl: data.fileUrl || '',
            fileName: data.fileName || '',
            timestamp: data.timestamp || new Date().toLocaleString('id-ID'),
            isDuplicate: Boolean(data.duplicate)
          });

          // Reset identity & answers completely
          if (writingStudentNameInput) writingStudentNameInput.value = '';
          if (writingProgramSelect) writingProgramSelect.value = '';
          if (writingTask1Textarea) writingTask1Textarea.value = '';
          if (writingTask2Textarea) writingTask2Textarea.value = '';
          if (task1WordCountElem) task1WordCountElem.textContent = '0';
          if (task2WordCountElem) task2WordCountElem.textContent = '0';

          // Clear local storage drafts
          try {
            localStorage.removeItem(Storage.getKey('writing', 'draft_task1'));
            localStorage.removeItem(Storage.getKey('writing', 'draft_task2'));
            localStorage.removeItem(Storage.getKey('writing', 'timer'));
          } catch (e) {
            console.warn('Storage draft clear error:', e);
          }

          // Re-enable submit button
          isSubmittingWriting = false;
          if (btnSubmitWriting) {
            btnSubmitWriting.disabled = false;
            btnSubmitWriting.classList.remove('disabled');
            btnSubmitWriting.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Writing';
          }

          // Banner badge
          const bannerBadge = document.getElementById('writingStatusBadge');
          if (bannerBadge) {
            bannerBadge.className = 'status-badge success';
            bannerBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Terkirim';
          }

          showToast('✅ Berhasil! Jawaban Writing telah tersimpan di Google Drive.', 6000);

          const resultsElem = document.getElementById('writingResultsArea');
          if (resultsElem) {
            resultsElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          throw new Error((data && data.message) ? data.message : 'Server mengembalikan status gagal.');
        }
      } catch (err) {
        console.error('[Writing Submission Error]:', err);
        isSubmittingWriting = false;

        // On failure: retain answers, identity, and submissionId for retry
        if (btnSubmitWriting) {
          btnSubmitWriting.disabled = false;
          btnSubmitWriting.classList.remove('disabled');
          btnSubmitWriting.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Coba Kirim Ulang (Retry)';
        }

        showToast('❌ Gagal mengirim: ' + (err.message || 'Terjadi kesalahan jaringan') + '. Data Anda tetap aman. Silakan klik Coba Kirim Ulang.', 8000);
      }
    }

    // -------------------------------------------------------------
    // SPEAKING SUBMISSION
    // -------------------------------------------------------------
    const speakingStatus = Storage.get('speaking', 'status', 'not_started');
    const btnSubmitSpeaking = document.getElementById('btnSubmitSpeaking');
    if (btnSubmitSpeaking) {
      btnSubmitSpeaking.addEventListener('click', function () {
        if (Storage.get('speaking', 'status', 'not_started') === 'submitted') return;
        showConfirmModal('speaking', function () {
          Storage.set('speaking', 'status', 'submitted');
          lockSpeakingSection();
          const speakingData = { completed: true };
          Storage.set('speaking', 'result', speakingData);
          renderSpeakingResults('speakingResultsArea', 0);

          const resultsElem = document.getElementById('speakingResultsArea');
          if (resultsElem) {
            resultsElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    }

    if (speakingStatus === 'submitted') {
      lockSpeakingSection();
      renderSpeakingResults('speakingResultsArea', 0);
    }

  });

})(window, document);
