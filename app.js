/**
 * PURPLE FEST VADODARA 2026
 * Interactive Web Application & Preloader Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initAccessibilityToolbar();
  initCountdown();
  initSchedule();
  initRegistrationModal();
  initMobileNav();
});

/* =========================================================
   1. PRELOADER ENGINE (Video & Vector SVG Sync)
   ========================================================= */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const video = document.getElementById('preloader-video');
  const videoContainer = document.getElementById('video-container');
  const vectorContainer = document.getElementById('vector-container');
  const progressBar = document.getElementById('preloader-progress-bar');
  const timeDisplay = document.getElementById('preloader-time-display');
  const soundBtn = document.getElementById('preloader-sound-btn');
  const soundText = document.getElementById('sound-btn-text');
  const modeBtn = document.getElementById('preloader-mode-btn');
  const modeText = document.getElementById('mode-btn-text');
  const skipBtn = document.getElementById('preloader-skip-btn');
  
  // Replay buttons around the site
  const replayBtnNav = document.getElementById('btn-replay-preloader');
  const replayBtnCta = document.getElementById('cta-replay-btn');
  const replayBtnFooter = document.getElementById('footer-replay-btn');

  let currentMode = 'video'; // 'video' | 'vector'
  let isSoundActive = false;
  let isExited = false;
  let vectorTimer = null;
  let vectorElapsed = 0;
  const TOTAL_DURATION = 4.0; // 4 seconds duration of final.mp4

  // Initialize Canvas Heart Particles in background
  initPreloaderCanvas();

  // Try playing the video automatically
  function startPlayback() {
    isExited = false;
    preloader.classList.remove('preloader-exit');

    if (currentMode === 'video') {
      video.currentTime = 0;
      video.muted = !isSoundActive;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Autoplay restriction handled. Playing muted.', err);
          video.muted = true;
          video.play();
        });
      }
    } else {
      startVectorAnimation();
    }
  }

  // Update progress bar based on video playback
  video.addEventListener('timeupdate', () => {
    if (currentMode !== 'video' || isExited) return;
    const current = video.currentTime;
    const dur = video.duration || TOTAL_DURATION;
    const pct = Math.min(100, (current / dur) * 100);
    
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (timeDisplay) timeDisplay.textContent = `${current.toFixed(1)}s / ${dur.toFixed(1)}s`;

    // Trigger exit slightly before hard end or on end for ultra smooth transition
    if (current >= dur - 0.25 && !isExited) {
      exitPreloader();
    }
  });

  video.addEventListener('ended', () => {
    if (!isExited) exitPreloader();
  });

  // Sound Toggle Handler
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      isSoundActive = !isSoundActive;
      video.muted = !isSoundActive;

      if (isSoundActive) {
        if (soundText) soundText.textContent = 'Sound: ON';
        soundBtn.classList.add('preloader-btn-primary');
        playGentleChime();
      } else {
        if (soundText) soundText.textContent = 'Sound: Muted';
        soundBtn.classList.remove('preloader-btn-primary');
      }
    });
  }

  // Mode Switcher (Video vs Vector SVG Mode)
  if (modeBtn) {
    modeBtn.addEventListener('click', () => {
      if (currentMode === 'video') {
        currentMode = 'vector';
        video.pause();
        videoContainer.classList.remove('active');
        vectorContainer.classList.add('active');
        if (modeText) modeText.textContent = 'Switch to Video Mode';
        startVectorAnimation();
      } else {
        currentMode = 'video';
        clearInterval(vectorTimer);
        vectorContainer.classList.remove('active');
        videoContainer.classList.add('active');
        if (modeText) modeText.textContent = 'Switch to Vector Mode';
        video.currentTime = 0;
        video.play();
      }
    });
  }

  function startVectorAnimation() {
    clearInterval(vectorTimer);
    vectorElapsed = 0;
    
    // Restart SVG CSS animations
    const svg = document.getElementById('vector-svg');
    const newSvg = svg.cloneNode(true);
    svg.parentNode.replaceChild(newSvg, svg);

    vectorTimer = setInterval(() => {
      vectorElapsed += 0.05;
      const pct = Math.min(100, (vectorElapsed / TOTAL_DURATION) * 100);
      if (progressBar) progressBar.style.width = `${pct}%`;
      if (timeDisplay) timeDisplay.textContent = `${vectorElapsed.toFixed(1)}s / ${TOTAL_DURATION.toFixed(1)}s`;

      if (vectorElapsed >= TOTAL_DURATION) {
        clearInterval(vectorTimer);
        exitPreloader();
      }
    }, 50);
  }

  // Skip Preloader
  function exitPreloader() {
    if (isExited) return;
    isExited = true;
    clearInterval(vectorTimer);
    if (progressBar) progressBar.style.width = '100%';
    
    preloader.classList.add('preloader-exit');
    setTimeout(() => {
      video.pause();
    }, 800);
  }

  if (skipBtn) skipBtn.addEventListener('click', exitPreloader);
  if (preloader) preloader.addEventListener('click', exitPreloader);

  // Replay Triggers
  function replayIntro() {
    startPlayback();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (replayBtnNav) replayBtnNav.addEventListener('click', replayIntro);
  if (replayBtnCta) replayBtnCta.addEventListener('click', replayIntro);
  if (replayBtnFooter) replayBtnFooter.addEventListener('click', replayIntro);

  // Initial playback start
  startPlayback();
}

/**
 * Ambient Canvas Particle Animation (Floating hearts & sparkles)
 */
function initPreloaderCanvas() {
  const canvas = document.getElementById('preloader-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Create particles
  for (let i = 0; i < 35; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 12 + 6,
      speedY: Math.random() * 0.8 + 0.3,
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.4 + 0.15,
      type: Math.random() > 0.5 ? 'heart' : 'orb',
      rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.02
    });
  }

  function drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    // top left curve
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    // bottom left curve
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.4, x, y + size);
    // bottom right curve
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.4, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    // top right curve
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;

      if (p.y < -20) {
        p.y = height + 20;
        p.x = Math.random() * width;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = `rgba(142, 36, 170, ${p.opacity})`;

      if (p.type === 'heart') {
        drawHeart(ctx, 0, 0, p.size);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    requestAnimationFrame(render);
  }
  render();
}

/**
 * Web Audio API gentle celebratory chime
 */
function playGentleChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
      
      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + idx * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.7);
    });
  } catch (e) {
    // Audio context silently handled
  }
}

/* =========================================================
   2. ACCESSIBILITY TOOLBAR & CONTROLS
   ========================================================= */
function initAccessibilityToolbar() {
  const btnFontDec = document.getElementById('btn-font-decrease');
  const btnFontReset = document.getElementById('btn-font-reset');
  const btnFontInc = document.getElementById('btn-font-increase');
  const btnContrast = document.getElementById('btn-contrast-toggle');
  const contrastText = document.getElementById('contrast-text');
  const btnDyslexia = document.getElementById('btn-dyslexia-toggle');
  const btnSpeak = document.getElementById('btn-speak-summary');
  const speakText = document.getElementById('speak-btn-text');

  // Font Scaling
  btnFontDec.addEventListener('click', () => {
    document.body.classList.remove('font-large');
    document.body.classList.add('font-small');
  });

  btnFontReset.addEventListener('click', () => {
    document.body.classList.remove('font-large', 'font-small');
  });

  btnFontInc.addEventListener('click', () => {
    document.body.classList.remove('font-small');
    document.body.classList.add('font-large');
  });

  // High Contrast
  let isHighContrast = false;
  btnContrast.addEventListener('click', () => {
    isHighContrast = !isHighContrast;
    document.body.classList.toggle('theme-high-contrast', isHighContrast);
    btnContrast.classList.toggle('active', isHighContrast);
    contrastText.textContent = isHighContrast ? 'Normal Contrast' : 'High Contrast';
  });

  // Dyslexia Font
  let isDyslexia = false;
  btnDyslexia.addEventListener('click', () => {
    isDyslexia = !isDyslexia;
    document.body.classList.toggle('font-dyslexia', isDyslexia);
    btnDyslexia.classList.toggle('active', isDyslexia);
  });

  // Text to Speech Screen Reader Narration
  let isSpeaking = false;
  btnSpeak.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      speakText.textContent = 'Listen Overview';
      btnSpeak.classList.remove('active');
    } else {
      const narrationText = `Welcome to Purple Fest Vadodara 2026, held at Navlakhi Ground, Vadodara, Gujarat from November 27 to 29. Celebrating diversity and empowering abilities, featuring 100 assistive technology innovations, exhilarating inclusive sports, wheelchair Garba, and national policy think tanks. All admission is free for Persons with Disabilities and their companions.`;
      
      const utterance = new SpeechSynthesisUtterance(narrationText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      
      utterance.onend = () => {
        isSpeaking = false;
        speakText.textContent = 'Listen Overview';
        btnSpeak.classList.remove('active');
      };
      
      window.speechSynthesis.speak(utterance);
      isSpeaking = true;
      speakText.textContent = 'Stop Narration';
      btnSpeak.classList.add('active');
    }
  });
}

/* =========================================================
   3. LIVE COUNTDOWN TIMER
   ========================================================= */
function initCountdown() {
  // Target: November 27, 2026, 09:00:00 AM IST
  const targetDate = new Date('2026-11-27T09:00:00+05:30').getTime();

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById('count-days').textContent = String(days).padStart(2, '0');
      document.getElementById('count-hours').textContent = String(hours).padStart(2, '0');
      document.getElementById('count-mins').textContent = String(minutes).padStart(2, '0');
      document.getElementById('count-secs').textContent = String(seconds).padStart(2, '0');
    }
  }

  setInterval(update, 1000);
  update();
}

/* =========================================================
   4. SCHEDULE & FILTERING
   ========================================================= */
const FESTIVAL_EVENTS = [
  // DAY 1
  {
    id: 'ev-1',
    day: 'day1',
    category: 'culture',
    title: 'Grand Opening Ceremony & Vadodara Inclusive Anthem',
    time: '10:00 AM - 12:00 PM',
    venue: 'Main Royal Amphitheater, Navlakhi Ground',
    desc: 'Inauguration by dignitaries followed by the official release of the Purple Anthem, featuring inclusive dance by 200 Divyang artists.',
    badges: ['Wheelchair Access', 'ISL Interpreter', 'Audio Description']
  },
  {
    id: 'ev-2',
    day: 'day1',
    category: 'tech',
    title: 'Assistive Tech Innovation Expo: Live Demonstrations',
    time: '12:30 PM - 04:00 PM',
    venue: 'Hall A: Innovation Pavilion',
    desc: 'Unveiling India’s newest AI Braille tablets, mind-controlled bionic arms, and all-terrain smart motorized wheelchairs.',
    badges: ['Hands-on Trials', 'Tactile Guides', 'Quiet Room Near']
  },
  {
    id: 'ev-3',
    day: 'day1',
    category: 'conclave',
    title: 'National Think Tank: Universal Accessibility Blueprint',
    time: '02:30 PM - 05:00 PM',
    venue: 'Conclave Auditorium 1',
    desc: 'Ministers, urban architects, and disability advocates discuss barrier-free public infrastructure across Indian smart cities.',
    badges: ['ISL Live', 'Captioning', 'Braille Materials']
  },
  {
    id: 'ev-4',
    day: 'day1',
    category: 'culture',
    title: 'Night of Melodies: Visually Impaired National Symphony',
    time: '06:30 PM - 09:00 PM',
    venue: 'Sayaji Cultural Stage',
    desc: 'A captivating symphonic blend of Hindustani classical ragas and contemporary melodies performed by 45 virtuoso blind musicians.',
    badges: ['Audio Stream', 'Sensory Friendly', 'Priority Seating']
  },

  // DAY 2
  {
    id: 'ev-5',
    day: 'day2',
    category: 'sports',
    title: 'National Blind Cricket Championship: Gujarat vs Rest of India',
    time: '09:00 AM - 01:00 PM',
    venue: 'Purple Sports Complex (Navlakhi Grounds)',
    desc: 'High-octane T20 match featuring international champions with audio ball tracking and live descriptive commentary.',
    badges: ['Audio Commentary', 'Wheelchair Stands', 'ISL Commentary']
  },
  {
    id: 'ev-6',
    day: 'day2',
    category: 'culture',
    title: 'Historic Wheelchair Garba & Folk Dance Extravaganza',
    time: '05:00 PM - 08:30 PM',
    venue: 'Navlakhi Grand Circle',
    desc: 'Vadodara’s signature festival tradition reimagined — 300 wheelchair dancers in vibrant traditional Gujarati attire spinning in synchronized harmony.',
    badges: ['Wheelchair Stage', 'Live Music', 'ISL Host']
  },
  {
    id: 'ev-7',
    day: 'day2',
    category: 'tech',
    title: 'Assistive Robotics & AI Hackathon Pitch Finale',
    time: '02:00 PM - 04:30 PM',
    venue: 'Hall B: Tech Incubator',
    desc: 'Top 10 student innovators from IITs pitch their affordable accessibility inventions to national venture capitalists.',
    badges: ['Live Stream', 'Subtitles']
  },
  {
    id: 'ev-8',
    day: 'day2',
    category: 'sports',
    title: 'All-India Wheelchair Basketball League Finals',
    time: '03:00 PM - 06:00 PM',
    venue: 'Indoor Sports Arena',
    desc: 'Thrilling wheelchair basketball clashes with lightning speed, sportsmanship, and electric crowd support.',
    badges: ['Priority Seating', 'Live Commentary']
  },

  // DAY 3
  {
    id: 'ev-9',
    day: 'day3',
    category: 'conclave',
    title: 'Inclusive Employment Job Fair (1,000+ Corporate Offers)',
    time: '10:00 AM - 02:00 PM',
    venue: 'Hall C: Career Pavilion',
    desc: 'Over 60 multinational corporations conduct accessible walk-in interviews and issue on-the-spot offer letters to Divyang candidates.',
    badges: ['ISL Interviewers', 'Sighted Guides', 'Sensory Quiet Space']
  },
  {
    id: 'ev-10',
    day: 'day3',
    category: 'culture',
    title: 'Inclusive Fashion Runway & Deaf Theater Showcase',
    time: '04:00 PM - 06:30 PM',
    venue: 'Main Royal Amphitheater',
    desc: 'Celebrated designers present adaptive fashion lines modeled proudly by wheelchair users, amputees, and models with Down syndrome.',
    badges: ['Audio Description', 'ISL Stage', 'Visual Magnifiers']
  },
  {
    id: 'ev-11',
    day: 'day3',
    category: 'culture',
    title: 'Grand Finale Purple Mega Concert & Purple Awards 2026',
    time: '07:00 PM - 10:00 PM',
    venue: 'Navlakhi Grand Grounds',
    desc: 'Valedictory address, Purple Inclusivity Awards honoring national achievers, followed by a headline celebrity concert with tactile vibrating dance floor.',
    badges: ['Tactile Floor', 'Subwoofer Packs', 'Universal Access']
  }
];

function initSchedule() {
  const scheduleGrid = document.getElementById('schedule-grid');
  const dayTabs = document.querySelectorAll('.day-tab');
  const catFilters = document.querySelectorAll('.cat-filter');
  const bookmarkCountEl = document.getElementById('bookmark-count');
  const btnShowBookmarks = document.getElementById('btn-show-bookmarks');

  let activeDay = 'day1';
  let activeCat = 'all';
  let bookmarks = JSON.parse(localStorage.getItem('purple_bookmarks') || '[]');

  function updateBookmarkCount() {
    if (bookmarkCountEl) bookmarkCountEl.textContent = bookmarks.length;
  }

  function renderEvents() {
    scheduleGrid.innerHTML = '';
    
    const filtered = FESTIVAL_EVENTS.filter(ev => {
      const matchDay = ev.day === activeDay;
      const matchCat = activeCat === 'all' || ev.category === activeCat;
      return matchDay && matchCat;
    });

    if (filtered.length === 0) {
      scheduleGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
          <p>No events found for this filter criteria.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(ev => {
      const isBookmarked = bookmarks.includes(ev.id);
      const card = document.createElement('article');
      card.className = 'event-card';
      card.innerHTML = `
        <div>
          <span class="event-time-badge">
            <svg style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${ev.time}
          </span>
          <h3 class="event-title">${ev.title}</h3>
          <p class="event-location"><svg class="icon-inline" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> ${ev.venue}</p>
          <p class="event-desc">${ev.desc}</p>
        </div>

        <div>
          <div class="event-badges-row">
            ${ev.badges.map(b => `<span class="badge-a11y"><svg class="icon-inline" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg> ${b}</span>`).join('')}
          </div>
          <div class="event-footer">
            <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--purple-vibrant); font-weight: 700;">${ev.category}</span>
            <button class="btn-bookmark ${isBookmarked ? 'bookmarked' : ''}" data-id="${ev.id}">
              <svg class="icon-inline" viewBox="0 0 24 24" width="14" height="14" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span>${isBookmarked ? 'Saved' : 'Save Event'}</span>
            </button>
          </div>
        </div>
      `;

      // Bookmark button
      const bookmarkBtn = card.querySelector('.btn-bookmark');
      bookmarkBtn.addEventListener('click', () => {
        if (bookmarks.includes(ev.id)) {
          bookmarks = bookmarks.filter(id => id !== ev.id);
          bookmarkBtn.classList.remove('bookmarked');
          bookmarkBtn.innerHTML = `
            <svg class="icon-inline" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>Save Event</span>
          `;
        } else {
          bookmarks.push(ev.id);
          bookmarkBtn.classList.add('bookmarked');
          bookmarkBtn.innerHTML = `
            <svg class="icon-inline" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>Saved</span>
          `;
        }
        localStorage.setItem('purple_bookmarks', JSON.stringify(bookmarks));
        updateBookmarkCount();
      });

      scheduleGrid.appendChild(card);
    });
  }

  // Day Tab handlers
  dayTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dayTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeDay = tab.dataset.day;
      renderEvents();
    });
  });

  // Category filter handlers
  catFilters.forEach(cat => {
    cat.addEventListener('click', () => {
      catFilters.forEach(c => c.classList.remove('active'));
      cat.classList.add('active');
      activeCat = cat.dataset.cat;
      renderEvents();
    });
  });

  if (btnShowBookmarks) {
    btnShowBookmarks.addEventListener('click', () => {
      if (bookmarks.length === 0) {
        alert('You haven’t saved any events yet. Click "Save Event" on any event card!');
        return;
      }
      alert(`You have bookmarked ${bookmarks.length} events! Keep checking the schedule for venue reminders.`);
    });
  }

  updateBookmarkCount();
  renderEvents();
}

/* =========================================================
   5. REGISTRATION & DIGITAL PASS GENERATOR
   ========================================================= */
function initRegistrationModal() {
  const modal = document.getElementById('pass-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const openBtnNav = document.getElementById('btn-open-register');
  const openBtnHero = document.getElementById('hero-register-btn');
  const openBtnCta = document.getElementById('cta-register-btn');
  const form = document.getElementById('pass-form');
  
  const formView = document.getElementById('modal-form-view');
  const ticketView = document.getElementById('modal-ticket-view');
  
  const ticketName = document.getElementById('ticket-attendee-name');
  const ticketCat = document.getElementById('ticket-pass-cat');
  const ticketId = document.getElementById('ticket-pass-id');
  const ticketA11y = document.getElementById('ticket-a11y-needed');
  const ticketQr = document.getElementById('ticket-qr');
  
  const btnPrint = document.getElementById('btn-print-ticket');
  const btnDone = document.getElementById('btn-ticket-done');

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    formView.style.display = 'block';
    ticketView.style.display = 'none';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (openBtnNav) openBtnNav.addEventListener('click', openModal);
  if (openBtnHero) openBtnHero.addEventListener('click', openModal);
  if (openBtnCta) openBtnCta.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('pass-name').value;
    const cat = document.getElementById('pass-category').value;
    
    // Accommodations
    const selectedA11y = Array.from(document.querySelectorAll('input[name="a11y_pref"]:checked'))
                              .map(cb => cb.value);
    
    // Generate Pass Details
    const randomId = 'PFV-2026-' + Math.floor(1000 + Math.random() * 9000);
    
    ticketName.textContent = name;
    ticketCat.textContent = cat;
    ticketId.textContent = randomId;
    ticketA11y.textContent = selectedA11y.length > 0 ? selectedA11y.join(', ') : 'Standard Barrier-Free';

    // Render QR Code Canvas
    drawMockQRCode(ticketQr, `${randomId}|${name}|PURPLE-FEST-VADODARA`);

    formView.style.display = 'none';
    ticketView.style.display = 'block';
  });

  // Print Ticket
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  if (btnDone) {
    btnDone.addEventListener('click', closeModal);
  }
}

/**
 * Draws a stylized purple QR matrix pattern on canvas
 */
function drawMockQRCode(canvas, dataStr) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  ctx.clearRect(0, 0, size, size);

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  // Draw QR border boxes (Finder patterns)
  function drawFinder(x, y, s) {
    ctx.fillStyle = '#430c65';
    ctx.fillRect(x, y, s, s);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 5, y + 5, s - 10, s - 10);
    ctx.fillStyle = '#6f1c99';
    ctx.fillRect(x + 10, y + 10, s - 20, s - 20);
  }

  const boxSize = 32;
  drawFinder(8, 8, boxSize);
  drawFinder(size - boxSize - 8, 8, boxSize);
  drawFinder(8, size - boxSize - 8, boxSize);

  // Generate pseudo-random matrix grid
  const cellSize = 5;
  const cols = Math.floor(size / cellSize);
  
  ctx.fillStyle = '#430c65';
  let seed = 0;
  for (let i = 0; i < dataStr.length; i++) seed += dataStr.charCodeAt(i);

  for (let r = 0; r < cols; r++) {
    for (let c = 0; c < cols; c++) {
      // Avoid finder pattern zones
      const inTopLeft = r < 9 && c < 9;
      const inTopRight = r < 9 && c > cols - 9;
      const inBottomLeft = r > cols - 9 && c < 9;
      
      if (!inTopLeft && !inTopRight && !inBottomLeft) {
        seed = (seed * 9301 + 49297) % 233280;
        if ((seed / 233280) > 0.52) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize - 1, cellSize - 1);
        }
      }
    }
  }

  // Draw tiny center heart emblem in QR
  const center = size / 2;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(center - 10, center - 10, 20, 20);
  ctx.fillStyle = '#8e24aa';
  ctx.beginPath();
  ctx.arc(center, center, 7, 0, Math.PI * 2);
  ctx.fill();
}

/* =========================================================
   6. MOBILE NAVIGATION DRAWER
   ========================================================= */
function initMobileNav() {
  const toggleBtn = document.getElementById('btn-mobile-toggle');
  const closeBtn = document.getElementById('btn-mobile-close');
  const navMenu = document.getElementById('nav-menu');
  const backdrop = document.getElementById('mobile-nav-backdrop');
  const mobileRegisterBtn = document.getElementById('btn-mobile-register');
  const mobileReplayBtn = document.getElementById('btn-mobile-replay');

  function openNav() {
    if (!navMenu) return;
    navMenu.classList.add('mobile-open');
    if (backdrop) backdrop.classList.add('mobile-open');
    if (toggleBtn) {
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (!navMenu) return;
    navMenu.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('mobile-open');
    if (toggleBtn) {
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      if (navMenu.classList.contains('mobile-open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeNav);
    if (backdrop) backdrop.addEventListener('click', closeNav);

    // Close menu when clicking nav links
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
          closeNav();
        }
      });
    });

    // Wire mobile drawer register button
    if (mobileRegisterBtn) {
      mobileRegisterBtn.addEventListener('click', () => {
        closeNav();
        const openRegBtn = document.getElementById('btn-open-register') || document.getElementById('hero-register-btn');
        if (openRegBtn) openRegBtn.click();
      });
    }

    // Wire mobile drawer replay button
    if (mobileReplayBtn) {
      mobileReplayBtn.addEventListener('click', () => {
        closeNav();
        const replayNav = document.getElementById('btn-replay-preloader');
        if (replayNav) replayNav.click();
      });
    }
  }
}
