/**
 * IELTS-Etips (English Tips) - Interactive Scripts
 * Pure Vanilla JavaScript (Fast, modern, zero external runtime dependencies)
 * Integrates directly with window.IeltsProgramsRepository from js/programs-data.js
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. NAVBAR SCROLL EFFECT ---
  const navbar = document.getElementById('navbar');
  
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // --- 2. MOBILE MENU DRAWER ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- 3. TOAST NOTIFICATION SYSTEM ---
  const toastNotice = document.getElementById('toastNotice');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  const showToast = (message, duration = 3500) => {
    if (toastNotice && toastMessage) {
      if (toastTimer) clearTimeout(toastTimer);
      toastMessage.textContent = message;
      toastNotice.classList.add('show');
      toastTimer = setTimeout(() => {
        toastNotice.classList.remove('show');
      }, duration);
    }
  };

  // --- 4. MODALS MANAGEMENT (LOGIN, DETAILS, DIAGNOSTIC, DIRECTORY) ---
  const loginModal = document.getElementById('loginModal');
  const detailsModal = document.getElementById('detailsModal');
  const diagnosticModal = document.getElementById('diagnosticModal');
  const allProgramsModal = document.getElementById('allProgramsModal');
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const closeModalBtns = document.querySelectorAll('.modal-close-btn');

  const closeAllModals = () => {
    modalOverlays.forEach(overlay => overlay.classList.remove('active'));
    document.body.style.overflow = '';
  };

  const openModal = (modalElement) => {
    if (modalElement) {
      modalElement.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  // Close modals on close button click
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // Close when clicking backdrop
  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAllModals();
      }
    });
  });

  // Close on Escape Key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Open Login Modal
  const openLoginBtns = document.querySelectorAll('.open-login-btn');
  openLoginBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(loginModal);
    });
  });

  // --- 5. PROGRAM DETAILS MODAL POPULATOR ---
  const populateProgramDetails = (programId, fallbackName = 'IELTS Preparation Program') => {
    const modalCategoryBadge = document.getElementById('modalCategoryBadge');
    const modalProgramName = document.getElementById('modalProgramName');
    const modalTargetScore = document.getElementById('modalTargetScore');
    const modalDuration = document.getElementById('modalDuration');
    const modalPlatformAccess = document.getElementById('modalPlatformAccess');
    const modalClassFormat = document.getElementById('modalClassFormat');
    const modalPricingGrid = document.getElementById('modalPricingGrid');
    const modalFacilitiesList = document.getElementById('modalFacilitiesList');
    const modalWaBtn = document.getElementById('modalWaBtn');

    let program = null;
    if (window.IeltsProgramsRepository && programId) {
      program = window.IeltsProgramsRepository.getById(programId);
    }

    if (program) {
      if (modalCategoryBadge) modalCategoryBadge.textContent = program.categoryName;
      if (modalProgramName) modalProgramName.textContent = program.name;
      if (modalTargetScore) {
        modalTargetScore.innerHTML = `<strong>${program.targetBandBadge}</strong> — ${program.targetScore}`;
      }
      if (modalDuration) modalDuration.textContent = program.duration;
      if (modalPlatformAccess) modalPlatformAccess.textContent = program.platformAccess;
      if (modalClassFormat) modalClassFormat.textContent = program.classFormat;

      // Render Options & Pricing
      if (modalPricingGrid && program.pricing && program.pricing.options) {
        modalPricingGrid.innerHTML = program.pricing.options.map(opt => `
          <div class="detail-pricing-card ${opt.featured ? 'featured' : ''}">
            <div class="detail-pricing-type">
              ${opt.type || opt.name || opt.meetings || 'Paket Standar'}
              ${opt.capacity ? `<span style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;"> (${opt.capacity})</span>` : ''}
            </div>
            <div class="detail-pricing-amount">${opt.priceFormatted}</div>
          </div>
        `).join('');
      }

      // Render Facilities List
      if (modalFacilitiesList && program.facilities) {
        modalFacilitiesList.innerHTML = program.facilities.map(fac => `
          <div class="detail-facility-item">
            <i class="fa-solid fa-circle-check"></i>
            <span>${fac}</span>
          </div>
        `).join('');
      }

      // Update WhatsApp link
      if (modalWaBtn) {
        const waText = encodeURIComponent(`Halo Admin English Tips, saya tertarik konsultasi program: ${program.name}`);
        modalWaBtn.href = `https://wa.me/6281234567890?text=${waText}`;
      }
    } else {
      // Fallback display
      if (modalCategoryBadge) modalCategoryBadge.textContent = 'Konsultasi Program';
      if (modalProgramName) modalProgramName.textContent = fallbackName;
      if (modalTargetScore) modalTargetScore.textContent = 'Diskusikan kebutuhan target skor Anda dengan konsultan kami.';
      if (modalDuration) modalDuration.textContent = 'Fleksibel';
      if (modalPlatformAccess) modalPlatformAccess.textContent = 'IELTS Learning Platform';
      if (modalClassFormat) modalClassFormat.textContent = 'Semi-Private / Private';
      if (modalPricingGrid) modalPricingGrid.innerHTML = '';
      if (modalFacilitiesList) modalFacilitiesList.innerHTML = '';
    }

    openModal(detailsModal);
  };

  // Bind all buttons with .open-details-btn
  document.addEventListener('click', (e) => {
    const detailsBtn = e.target.closest('.open-details-btn');
    if (detailsBtn) {
      e.preventDefault();
      const programId = detailsBtn.getAttribute('data-program-id');
      const fallbackName = detailsBtn.getAttribute('data-program') || 'Program IELTS';
      populateProgramDetails(programId, fallbackName);
    }
  });

  // --- 6. DIAGNOSTIC TEST MODAL TRIGGER ---
  const heroDiagnosticBtn = document.getElementById('heroDiagnosticBtn');
  const navDiagnostic = document.getElementById('navDiagnostic');

  const openDiagnostic = (e) => {
    if (e) e.preventDefault();
    openModal(diagnosticModal);
  };

  if (heroDiagnosticBtn) heroDiagnosticBtn.addEventListener('click', openDiagnostic);
  if (navDiagnostic) navDiagnostic.addEventListener('click', openDiagnostic);

  // Bind Diagnostic Test buttons inside modal
  document.addEventListener('click', (e) => {
    const diagBtn = e.target.closest('.start-diag-btn');
    if (diagBtn) {
      e.preventDefault();
      const skill = diagBtn.getAttribute('data-skill') || 'Pre-Test';
      showToast(`🚀 Memulai modul tes diagnostik: ${skill}`);
    }
  });

  // --- 7. ALL 12 PROGRAMS DIRECTORY MODAL ---
  const viewAllProgramsBtn = document.getElementById('viewAllProgramsBtn');
  const allProgramsContainer = document.getElementById('allProgramsContainer');
  const programFilterPills = document.querySelectorAll('.filter-pill');

  const renderProgramsCatalog = (category = 'all') => {
    if (!allProgramsContainer || !window.IeltsProgramsRepository) return;

    const programs = window.IeltsProgramsRepository.getByCategory(category);
    allProgramsContainer.innerHTML = programs.map(p => `
      <div class="catalog-card-compact">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
            <span style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 800;">PROGRAM ${p.number}</span>
            <span style="font-size: 0.7rem; background: rgba(255, 255, 255, 0.08); padding: 2px 8px; border-radius: 4px; color: var(--text-muted);">${p.categoryName}</span>
            <span style="font-size: 0.7rem; color: var(--text-muted);"><i class="fa-regular fa-clock"></i> ${p.duration}</span>
          </div>
          <h4 style="font-size: 1rem; color: var(--text-main); margin-bottom: 4px;">${p.name}</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0;">
            ${p.targetBandBadge ? `<strong>${p.targetBandBadge}</strong> — ` : ''}${p.targetScore}
          </p>
        </div>
        <div style="text-align: right; min-width: 140px;">
          <div style="font-size: 0.7rem; color: var(--text-muted);">Mulai dari:</div>
          <div style="font-size: 1.05rem; font-weight: 800; color: var(--accent-hover);">${p.pricing.startingPriceFormatted}</div>
          <button class="btn btn-outline-gold btn-sm open-details-btn" data-program-id="${p.id}" style="margin-top: 6px; padding: 4px 12px; font-size: 0.75rem;">
            Lihat Detail
          </button>
        </div>
      </div>
    `).join('');
  };

  if (viewAllProgramsBtn) {
    viewAllProgramsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      renderProgramsCatalog('all');
      openModal(allProgramsModal);
    });
  }

  // Category filter clicks
  programFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      programFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const category = pill.getAttribute('data-category');
      renderProgramsCatalog(category);
    });
  });

  // --- 8. BOOKING CTA ACTIONS ---
  document.addEventListener('click', (e) => {
    const bookingBtn = e.target.closest('.open-booking-btn');
    if (bookingBtn) {
      e.preventDefault();
      closeAllModals();
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
      populateProgramDetails('07-pre-ielts-private', 'Konsultasi Booking Kelas');
    }
  });

  // --- 9. SCROLL SPY (ACTIVE NAVBAR LINK) ---
  const sections = document.querySelectorAll('section[id], div[id="diagnostic-test"], div[id="pricing"], div[id="practices"]');
  
  const scrollSpy = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight || 300;
      const sectionTop = current.offsetTop - 130;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-menu a[href*="#${sectionId}"]`);

      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', scrollSpy);

  // --- 10. MOCK FORM SUBMISSIONS ---
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeAllModals();
      showToast('ℹ️ [Mode Preview] Autentikasi disimulasikan secara lokal.');
    });
  }

  const detailsForm = document.getElementById('detailsForm');
  if (detailsForm) {
    detailsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const studentName = document.getElementById('studentName')?.value || 'Siswa';
      const programName = document.getElementById('modalProgramName')?.textContent || 'IELTS';
      closeAllModals();
      showToast(`✅ Terima kasih, ${studentName}! Minat konsultasi untuk ${programName} berhasil dicatat.`);
    });
  }
});
