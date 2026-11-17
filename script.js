/**
 * Save the Date - Mohammed Anas & Fathimath Shafika
 * Royal Golden Particles, Fullscreen Video Autoplay with Sound,
 * Countdown, Calendar, Directions & Sharing Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const video = document.getElementById('weddingVideo');
  const videoSection = document.getElementById('fullscreenVideoSection');
  const smallMuteBtn = document.getElementById('smallMuteBtn');
  const smallMuteIcon = document.getElementById('smallMuteIcon');
  const toast = document.getElementById('toast');
  const entranceOverlay = document.getElementById('entranceOverlay');
  const entranceSealBtn = document.getElementById('entranceSealBtn');

  // -------------------------------------------------------------------------
  // 0. CREATIVE ROYAL ENTRANCE UNVEIL (Wax Seal Tap & Parting Velvet Gates)
  // -------------------------------------------------------------------------
  let isUnveiled = false;

  function unveilInvitation() {
    if (isUnveiled || !entranceOverlay) return;
    isUnveiled = true;

    // This direct user tap immediately primes browser audio permissions
    if (video) {
      video.muted = false;
      updateMuteButtonUI();
    }

    entranceOverlay.classList.add('unveiling');

    setTimeout(() => {
      entranceOverlay.classList.add('unveiled');
      document.body.style.overflow = 'auto';
    }, 1200);
  }

  if (entranceSealBtn) {
    entranceSealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      unveilInvitation();
    });
  }

  if (entranceOverlay) {
    entranceOverlay.addEventListener('click', () => {
      unveilInvitation();
    });
  }

  // Also auto-unveil if user scrolls/swipes
  window.addEventListener('wheel', () => {
    if (!isUnveiled) unveilInvitation();
  }, { once: true, passive: true });

  window.addEventListener('touchmove', () => {
    if (!isUnveiled) unveilInvitation();
  }, { once: true, passive: true });

  // -------------------------------------------------------------------------
  // 1. FLOATING GOLDEN STARDUST PARTICLES CANVAS
  // -------------------------------------------------------------------------
  const canvas = document.getElementById('particlesCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particlesCount = Math.min(Math.floor(window.innerWidth / 12), 45);
    const particles = [];
    const colors = ['#fff2c6', '#dfb75c', '#faecd0', '#d4af37'];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 0.4 + 0.15,
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.6 + 0.2,
        decay: Math.random() * 0.008 + 0.002
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.alpha += p.decay;

        if (p.alpha > 0.85 || p.alpha < 0.15) {
          p.decay = -p.decay;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // -------------------------------------------------------------------------
  // 2. SOUND DEFAULT & SCROLL-TRIGGERED AUTOPLAY
  // -------------------------------------------------------------------------
  if (video) {
    video.muted = false; // Default sound enabled
  }

  function updateMuteButtonUI() {
    if (!video || !smallMuteIcon || !smallMuteBtn) return;
    if (video.muted) {
      smallMuteIcon.className = 'fa-solid fa-volume-xmark';
      smallMuteBtn.title = 'Sound is Muted. Click to unmute.';
    } else {
      smallMuteIcon.className = 'fa-solid fa-volume-high';
      smallMuteBtn.title = 'Sound is On. Click to mute.';
    }
  }

  // Register user interaction to unlock audio policy
  function handleInitialUserGesture() {
    if (video && video.muted) {
      video.muted = false;
      updateMuteButtonUI();
    }
  }

  ['scroll', 'wheel', 'touchstart', 'touchend', 'click', 'keydown'].forEach((evt) => {
    window.addEventListener(evt, handleInitialUserGesture, { once: true, passive: true });
  });

  // Small Mute / Unmute Button
  if (smallMuteBtn && video) {
    smallMuteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      updateMuteButtonUI();
      showToast(video.muted ? 'Audio Muted 🔇' : 'Audio On 🔊');
    });
  }

  // Tapping the video also toggles mute / play smoothly
  if (video) {
    video.addEventListener('click', () => {
      if (video.muted) {
        video.muted = false;
        updateMuteButtonUI();
        showToast('Audio On 🔊');
      } else {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      }
    });
  }

  // IntersectionObserver: Autoplay when user reaches video after scrolling
  if (video && videoSection && 'IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.35 // Trigger when 35% of video is visible
    };

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.muted = false;
          const playPromise = video.play();

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                updateMuteButtonUI();
              })
              .catch((err) => {
                console.warn('Browser policy deferred unmuted autoplay, playing muted then unmuting on touch:', err);
                video.muted = true;
                updateMuteButtonUI();
                video.play().catch(() => {});

                const unmuteOnNext = () => {
                  video.muted = false;
                  updateMuteButtonUI();
                  window.removeEventListener('click', unmuteOnNext);
                  window.removeEventListener('touchstart', unmuteOnNext);
                };
                window.addEventListener('click', unmuteOnNext, { once: true });
                window.addEventListener('touchstart', unmuteOnNext, { once: true });
              });
          }
        } else {
          // Pause when scrolled out of view to save battery/resources
          if (!video.paused) {
            video.pause();
          }
        }
      });
    }, observerOptions);

    videoObserver.observe(videoSection);
  }

  // -------------------------------------------------------------------------
  // 3. COUNTDOWN TIMER (27th December 2026, 04:30 PM IST)
  // -------------------------------------------------------------------------
  const weddingDate = new Date('2026-12-27T16:30:00+05:30').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // -------------------------------------------------------------------------
  // 4. ADD TO CALENDAR (Google Calendar + iCal .ics download)
  // -------------------------------------------------------------------------
  const addToCalBtn = document.getElementById('addToCalBtn');
  const calendarDropdown = document.getElementById('calendarDropdown');
  const googleCalLink = document.getElementById('googleCalLink');
  const appleCalLink = document.getElementById('appleCalLink');

  if (addToCalBtn && calendarDropdown) {
    addToCalBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      calendarDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      calendarDropdown.classList.remove('show');
    });
  }

  if (googleCalLink) {
    const gCalUrl = new URL('https://calendar.google.com/calendar/render');
    gCalUrl.searchParams.set('action', 'TEMPLATE');
    gCalUrl.searchParams.set('text', 'Wedding: Mohammed Anas & Fathimath Shafika');
    gCalUrl.searchParams.set('dates', '20261227T110000Z/20261227T170000Z');
    gCalUrl.searchParams.set(
      'details',
      'Save the Date! Sacred Nikah ceremony at 04:30 PM followed by Wedding Reception.\n\nVenue: The Flora By Sunflower, Madhur, Kasaragod, Kerala - 671124\nGoogle Maps: https://maps.app.goo.gl/Qksm7bKJoUfYUYEu8?g_st=ic'
    );
    gCalUrl.searchParams.set('location', 'The Flora By Sunflower, Madhur, Kasaragod, Kerala 671124');
    googleCalLink.href = gCalUrl.toString();
  }

  if (appleCalLink) {
    appleCalLink.addEventListener('click', (e) => {
      e.preventDefault();
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Save The Date//Mohammed Anas & Fathimath Shafika//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:wedding-anas-shafika-20261227@wedding',
        'DTSTAMP:20261116T000000Z',
        'DTSTART:20261227T110000Z',
        'DTEND:20261227T170000Z',
        'SUMMARY:Wedding of Mohammed Anas & Fathimath Shafika',
        'DESCRIPTION:Sacred Nikah Ceremony at 04:30 PM followed by Wedding Reception.\\nVenue: The Flora By Sunflower\\, Madhur\\, Kasaragod\\, Kerala.\\nMaps: https://maps.app.goo.gl/Qksm7bKJoUfYUYEu8?g_st=ic',
        'LOCATION:The Flora By Sunflower\\, Madhur\\, Kasaragod\\, Kerala - 671124',
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Anas_and_Shafika_Wedding.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Calendar event downloaded 📅');
    });
  }

  // -------------------------------------------------------------------------
  // 5. SHARING (Web Share API with Clipboard Fallback)
  // -------------------------------------------------------------------------
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Save the Date | Mohammed Anas & Fathimath Shafika',
        text: 'Save the Date! Mohammed Anas & Fathimath Shafika are getting married on Sunday, 27th December 2026 at The Flora by Sunflower, Madhur, Kasaragod.',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          if (err.name !== 'AbortError') {
            copyToClipboard(window.location.href, 'Invite link copied to clipboard!');
          }
        }
      } else {
        copyToClipboard(window.location.href, 'Invite link copied to clipboard!');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 6. COPY ADDRESS
  // -------------------------------------------------------------------------
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const address = 'The Flora By Sunflower, Madhur, Kasaragod, Kerala - 671124';
      copyToClipboard(address, 'Address copied to clipboard!');
    });
  }

  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopyText(text, successMsg);
      });
    } else {
      fallbackCopyText(text, successMsg);
    }
  }

  function fallbackCopyText(text, successMsg) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (e) {
      showToast('Could not copy link');
    }
    document.body.removeChild(textArea);
  }

  // -------------------------------------------------------------------------
  // 7. TOAST HELPER
  // -------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
});

// ---------------------------------------------------------------------------
// 8. LIGHTBOX MODAL
// ---------------------------------------------------------------------------
function openLightbox(imgSrc) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (lightbox && lightboxImg) {
    lightboxImg.src = imgSrc;
    lightbox.classList.add('active');
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
  }
}
