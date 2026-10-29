// 1. Função utilitária para soltar partículas celestiais (estrelas, sóis e corações)
function spawnCelestialParticles(count = 18) {
  const layer = document.getElementById('particle-layer');
  if (!layer) return;

  const symbols = ['✦', '☼', '♡', '★', '✧', '✨'];
  const colors = ['#ffd875', '#ff2a7a', '#ff7eb6', '#ffffff', '#d3bfff'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'celestial-particle';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = `${Math.random() * 94 + 3}%`;
    el.style.top = `${Math.random() * 75 + 15}%`;
    el.style.color = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDelay = `${Math.random() * 0.35}s`;
    layer.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 2600);
  }
}

// 2. Controle completo da música "You Are My Sunshine" ao entrar no site + Botões de Silenciar (Página 1 e Página 2)
const bgMusic = document.getElementById('bg-music');
const muteToggle = document.getElementById('mute-toggle');
const gateMuteToggle = document.getElementById('gate-mute-toggle');
const npMuteMini = document.getElementById('np-mute-mini');
const playToggle = document.getElementById('play-sunshine');
const npFill = document.getElementById('np-fill');
const npTrack = document.getElementById('np-track');
const npCurrent = document.getElementById('np-current');
const npDuration = document.getElementById('np-duration');

let userManuallyMuted = false;

function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function syncMuteButton(btn, isMutedOrPaused) {
  if (!btn) return;
  btn.classList.toggle('is-muted', isMutedOrPaused);
  btn.setAttribute('aria-pressed', String(isMutedOrPaused));
  const icon = btn.querySelector('.music-icon');
  const label = btn.querySelector('.music-label-text');
  if (icon) icon.textContent = isMutedOrPaused ? '🔇' : '🔊';
  if (label) label.textContent = isMutedOrPaused ? 'Silenciada' : 'Música: ON';
}

function updateMusicUI() {
  if (!bgMusic) return;
  const isMutedOrPaused = bgMusic.muted || bgMusic.paused;

  syncMuteButton(muteToggle, isMutedOrPaused);
  syncMuteButton(gateMuteToggle, isMutedOrPaused);

  if (npMuteMini) {
    npMuteMini.textContent = isMutedOrPaused ? '🔇' : '🔊';
  }

  if (playToggle) {
    playToggle.textContent = bgMusic.paused ? '▶' : '❚❚';
  }
}

function tryAutoPlayMusic() {
  if (!bgMusic || userManuallyMuted) return;
  bgMusic.volume = 0.65;
  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        updateMusicUI();
      })
      .catch(() => {
        updateMusicUI();
      });
  }
}

if (bgMusic) {
  window.addEventListener('DOMContentLoaded', tryAutoPlayMusic);
  tryAutoPlayMusic();

  // Inicia no primeiro clique/toque caso o navegador bloqueie o autoplay antes de interação
  const unlockAudioOnFirstGesture = () => {
    if (!userManuallyMuted && bgMusic.paused) {
      bgMusic.play().then(updateMusicUI).catch(() => {});
    }
    window.removeEventListener('click', unlockAudioOnFirstGesture);
    window.removeEventListener('touchstart', unlockAudioOnFirstGesture);
    window.removeEventListener('keydown', unlockAudioOnFirstGesture);
  };

  window.addEventListener('click', unlockAudioOnFirstGesture, { passive: true });
  window.addEventListener('touchstart', unlockAudioOnFirstGesture, { passive: true });
  window.addEventListener('keydown', unlockAudioOnFirstGesture, { passive: true });

  bgMusic.addEventListener('loadedmetadata', () => {
    if (npDuration) npDuration.textContent = formatTime(bgMusic.duration);
  });

  bgMusic.addEventListener('timeupdate', () => {
    if (npCurrent) npCurrent.textContent = formatTime(bgMusic.currentTime);
    if (npDuration && bgMusic.duration) {
      npDuration.textContent = formatTime(bgMusic.duration);
    }
    if (npFill && bgMusic.duration) {
      const pct = (bgMusic.currentTime / bgMusic.duration) * 100;
      npFill.style.width = `${pct}%`;
    }
  });

  bgMusic.addEventListener('play', updateMusicUI);
  bgMusic.addEventListener('pause', updateMusicUI);
  bgMusic.addEventListener('volumechange', updateMusicUI);
}

function toggleMute(e) {
  if (e) e.stopPropagation();
  if (!bgMusic) return;

  if (bgMusic.paused) {
    bgMusic.muted = false;
    userManuallyMuted = false;
    bgMusic.play().catch(() => {});
  } else {
    bgMusic.muted = !bgMusic.muted;
    userManuallyMuted = bgMusic.muted;
  }

  updateMusicUI();
}

if (muteToggle) muteToggle.addEventListener('click', toggleMute);
if (gateMuteToggle) gateMuteToggle.addEventListener('click', toggleMute);
if (npMuteMini) npMuteMini.addEventListener('click', toggleMute);

if (playToggle && bgMusic) {
  playToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgMusic.paused) {
      bgMusic.muted = false;
      userManuallyMuted = false;
      bgMusic.play().catch(() => {});
      spawnCelestialParticles(8);
    } else {
      bgMusic.pause();
      userManuallyMuted = true;
    }
    updateMusicUI();
  });
}

if (npTrack && bgMusic) {
  npTrack.addEventListener('click', (e) => {
    if (!bgMusic.duration) return;
    const rect = npTrack.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    bgMusic.currentTime = ratio * bgMusic.duration;
  });
}

// 3. ANIMAÇÃO DOS PORTÕES DO PARAÍSO (Transição Página 1: Menu -> Página 2: Conteúdo Principal)
const gateMenuPage = document.getElementById('gate-menu-page');
const mainSitePage = document.getElementById('main-site-page');
const openGatesBtn = document.getElementById('open-gates-btn');
const backToGatesBtn = document.getElementById('back-to-gates-btn');
const gateNavLinks = document.querySelectorAll('.gate-nav-link');

let gatesAnimating = false;

function openParadiseGates(targetSelector = '#inicio') {
  if (!gateMenuPage || !mainSitePage || gatesAnimating) return;
  gatesAnimating = true;

  // Garante que a música toque ao abrir os portões (se o usuário não tiver silenciado)
  if (bgMusic && !userManuallyMuted && bgMusic.paused) {
    bgMusic.play().then(updateMusicUI).catch(() => {});
  }

  // Revela a Página 2 atrás dos portões enquanto eles se abrem em 3D
  mainSitePage.hidden = false;
  gateMenuPage.classList.add('gates-opening');
  spawnCelestialParticles(36);

  setTimeout(() => {
    gateMenuPage.classList.add('is-hidden');
    document.body.classList.remove('in-menu-page');
    gatesAnimating = false;

    if (targetSelector && targetSelector !== '#inicio') {
      const targetEl = document.querySelector(targetSelector);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, 1250);
}

function closeParadiseGates() {
  if (!gateMenuPage || !mainSitePage || gatesAnimating) return;
  gatesAnimating = true;

  window.scrollTo({ top: 0, behavior: 'auto' });
  document.body.classList.add('in-menu-page');
  gateMenuPage.classList.remove('is-hidden');

  // Pequeno delay para animar o fechamento dos portões de volta ao Menu
  requestAnimationFrame(() => {
    gateMenuPage.classList.remove('gates-opening');
  });

  setTimeout(() => {
    mainSitePage.hidden = true;
    gatesAnimating = false;
  }, 900);
}

if (openGatesBtn) {
  openGatesBtn.addEventListener('click', () => openParadiseGates('#inicio'));
}

gateNavLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const target = link.dataset.target || '#inicio';
    openParadiseGates(target);
  });
});

if (backToGatesBtn) {
  backToGatesBtn.addEventListener('click', closeParadiseGates);
}

// 4. Botões genéricos com atributo [data-reveal]
document.querySelectorAll('[data-reveal]').forEach((button) => {
  const originalLabel = button.textContent.trim();
  button.addEventListener('click', () => {
    const message = button.parentElement.querySelector('.reveal');
    if (!message) return;

    const opening = message.hidden;
    message.textContent = button.dataset.reveal;
    message.hidden = !opening;
    button.textContent = opening ? 'Fechar registro ✕' : originalLabel;

    if (opening) {
      spawnCelestialParticles(8);
    }
  });
});

// 5. Card 1: Carimbo "CULPADA / CONDENADA" do Departamento de Assuntos Celestiais
const stampBtn = document.getElementById('stamp-btn');
const culpadaStamp = document.getElementById('culpada-stamp');
const stampMessage = document.getElementById('stamp-message');

if (stampBtn && culpadaStamp && stampMessage) {
  let condemned = false;
  stampBtn.addEventListener('click', () => {
    condemned = !condemned;
    culpadaStamp.classList.toggle('stamped', condemned);
    culpadaStamp.textContent = condemned ? 'CONDENADA ✦' : 'CULPADA';

    stampMessage.hidden = !condemned;
    stampMessage.textContent =
      'Sentença confirmada pelo Supremo Tribunal Celestial: proibida de parar de brilhar! Mais 200 anos de lives decretados.';

    if (condemned) {
      spawnCelestialParticles(12);
    }
  });
}

// 6. Card 2: Botões interativos "Deseja enviar relatório de erro para o Vaticano?" (Sim / KSKSK / Não)
const vaticanButtons = document.querySelectorAll('[data-vatican]');
const vaticanResponse = document.getElementById('vatican-response');

const vaticanMessages = {
  sim: '📡 Enviando relatório ao Vaticano... ERRO 404: O Vaticano respondeu que também virou inscrito da BySunshiny e perdeu a sanidade no último react.',
  ksksk: '😂 Resposta oficial registrada: "KSKSK". A perícia celestial concluiu que rir do caos é o único tratamento disponível!',
  nao: '🤫 Sábia decisão! O que acontece nas lives da BySunshiny fica nas lives da BySunshiny (e nos clipes da comunidade).'
};

vaticanButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (!vaticanResponse) return;
    const choice = btn.dataset.vatican;
    vaticanResponse.textContent = vaticanMessages[choice] || vaticanMessages.ksksk;
    vaticanResponse.hidden = false;
    spawnCelestialParticles(10);
  });
});

// 7. Botão de confirmação do "!Nao gosto" do Carrd (Dar Like e Inscrever-se)
const btnGaveLike = document.getElementById('btn-gave-like');
const likeFeedback = document.getElementById('like-feedback');

if (btnGaveLike && likeFeedback) {
  btnGaveLike.addEventListener('click', () => {
    likeFeedback.hidden = false;
    likeFeedback.textContent =
      '✨ Ufa! Você escapou oficialmente da lista do !Nao gosto da Sunshiny e ganhou +1000 pontos de bênção celestial! ♡';
    btnGaveLike.textContent = '💖 Inscrito & Abençoado com Sucesso!';
    spawnCelestialParticles(16);
  });
}

// 8. Bênção Final: Botão de Purpurina Celestial e Selo de 2 Anos
const celebrateBtn = document.getElementById('celebrate-btn');
const blessingSeal = document.getElementById('blessing-seal');

if (celebrateBtn) {
  celebrateBtn.addEventListener('click', () => {
    spawnCelestialParticles(32);
    celebrateBtn.textContent = '✨ Bênção Celestial Recebida! Feliz 2 Anos, Sunshiny! ♡ ✨';
  });
}

if (blessingSeal) {
  blessingSeal.addEventListener('click', () => {
    spawnCelestialParticles(24);
  });
}
