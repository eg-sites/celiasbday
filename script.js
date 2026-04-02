'use strict';

const MAX_COMPANIONS = 3;

const state = {
  guestId: '',
  guestName: '',
  dinnerAttendance: null,
  dinnerCompanionChoice: 'no',
  dinnerCompanions: [],
  afterAttendance: null,
  afterCompanionChoice: 'no',
  afterCompanionMode: 'none',
  afterCompanions: [],
  submitted: false,
  currentScene: 'scene-welcome'
};

function getUrlParam(name) {
  return new URLSearchParams(window.location.search).get(name) || '';
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text === null || text === undefined ? '' : text;
}

function setHref(id, url) {
  const el = document.getElementById(id);
  if (el) el.href = url || '#';
}

function setHidden(el, hidden) {
  if (!el) return;
  el.hidden = !!hidden;
  if (hidden) {
    el.setAttribute('hidden', '');
  } else {
    el.removeAttribute('hidden');
  }
}

function requireWelcomeName() {
  const input = document.getElementById('welcome-name');
  const error = document.getElementById('welcome-name-error');
  if (!input || !error) return false;

  const value = input.value.trim();
  if (!value) {
    input.classList.add('field__input--error');
    error.textContent = SITE_CONFIG.welcomeNameError;
    input.focus();
    return false;
  }

  input.classList.remove('field__input--error');
  error.textContent = '';
  state.guestName = value;
  return true;
}

function applyConfig() {
  document.title = SITE_CONFIG.pageTitle;

  setText('w-eyebrow', SITE_CONFIG.welcomeEyebrow);
  setText('w-theme', SITE_CONFIG.themeLabel);
  setText('w-title', SITE_CONFIG.welcomeTitle);
  setText('w-message', SITE_CONFIG.welcomeMessage);
  setText('w-submessage', SITE_CONFIG.welcomeSubmessage);
  setText('welcome-name-label', SITE_CONFIG.welcomeNameLabel);
  setText('btn-yes', SITE_CONFIG.confirmYesLabel);
  setText('btn-no', SITE_CONFIG.confirmNoLabel);

  const welcomeName = document.getElementById('welcome-name');
  if (welcomeName) welcomeName.placeholder = SITE_CONFIG.welcomeNamePlaceholder;
  const welcomeSubmessage = document.getElementById('w-submessage');
  if (welcomeSubmessage) welcomeSubmessage.hidden = !SITE_CONFIG.welcomeSubmessage;

  setText('dinner-form-eyebrow', SITE_CONFIG.dinnerCompanionSceneEyebrow);
  setText('dinner-form-title', SITE_CONFIG.dinnerCompanionSceneTitle);
  setText('form-companion-question', SITE_CONFIG.formCompanionQuestion);
  setText('companion-yes', SITE_CONFIG.formCompanionYes);
  setText('companion-no', SITE_CONFIG.formCompanionNo);
  setText('add-dinner-companion', SITE_CONFIG.formCompanionAddLabel);
  setText('dinner-form-note', SITE_CONFIG.dinnerFormNote);
  const dinnerSubmitButton = document.querySelector('#dinner-form button[type="submit"]');
  if (dinnerSubmitButton) dinnerSubmitButton.textContent = SITE_CONFIG.formSubmitLabel;

  setText('reveal-dinner-title', SITE_CONFIG.confirmedDinnerTitle);
  setText('reveal-dinner-msg', SITE_CONFIG.confirmedDinnerMessage);
  setText('detail-dinner-label', SITE_CONFIG.cardDinnerLabel);
  setText('detail-dinner-venue', SITE_CONFIG.dinnerVenueName);
  setText('detail-dinner-date', SITE_CONFIG.dinnerDateLabel);
  setText('detail-dinner-time', SITE_CONFIG.dinnerTimeLabel);
  setText('detail-dinner-address', SITE_CONFIG.dinnerVenueAddress);
  setHref('link-dinner-maps', SITE_CONFIG.dinnerVenueMapsUrl);
  setText('link-dinner-maps', SITE_CONFIG.mapButtonLabel);
  setText('detail-dinner-note', SITE_CONFIG.dinnerNote);
  setText('continue-lead', SITE_CONFIG.continueLead);
  setText('btn-to-after-question', SITE_CONFIG.continueButtonLabel);

  const dinnerImageWrap = document.getElementById('dinner-image-wrap');
  const dinnerImage = document.getElementById('dinner-image');
  if (dinnerImageWrap && dinnerImage) {
    if (SITE_CONFIG.dinnerVenueImage) {
      dinnerImage.src = SITE_CONFIG.dinnerVenueImage;
      dinnerImage.alt = SITE_CONFIG.dinnerVenueImageAlt || '';
      dinnerImageWrap.hidden = false;
    } else {
      dinnerImageWrap.hidden = true;
    }
  }

  setText('after-q-eyebrow', SITE_CONFIG.afterQuestionTitle);
  const afterQuestionTitle = document.getElementById('after-q-title');
  if (afterQuestionTitle) {
    afterQuestionTitle.innerHTML = SITE_CONFIG.afterQuestionSubtitle.replace(/after/i, '<em>after</em>');
  }
  setText('after-q-note', SITE_CONFIG.afterQuestionNote);
  setText('btn-after-yes', SITE_CONFIG.formCompanionYes);
  setText('btn-after-no', SITE_CONFIG.formCompanionNo);

  const noDinnerEyebrow = document.querySelector('#scene-after-question-nodinner .eyebrow');
  const noDinnerTitle = document.querySelector('#scene-after-question-nodinner .dark-title');
  if (noDinnerEyebrow) noDinnerEyebrow.textContent = SITE_CONFIG.afterNoDinnerQuestion;
  if (noDinnerTitle) {
    noDinnerTitle.innerHTML = SITE_CONFIG.afterNoDinnerSubtitle.replace(/after/i, '<em>after</em>');
  }
  setText('btn-after-yes-nodinner', SITE_CONFIG.formCompanionYes);
  setText('btn-after-no-nodinner', SITE_CONFIG.formCompanionNo);

  setText('after-reveal-title', SITE_CONFIG.afterTitle);
  setText('detail-after-label', SITE_CONFIG.cardAfterLabel);
  setText('detail-after-venue', SITE_CONFIG.afterVenueName);
  setText('detail-after-date', SITE_CONFIG.afterDateLabel);
  setText('detail-after-time', SITE_CONFIG.afterTimeLabel);
  setText('detail-after-address', SITE_CONFIG.afterVenueAddress);
  setHref('link-after-maps', SITE_CONFIG.afterVenueMapsUrl);
  setText('link-after-maps', SITE_CONFIG.mapButtonLabel);
  setText('detail-after-note', SITE_CONFIG.afterNote);
  setText('after-companion-question', SITE_CONFIG.afterCompanionQuestion);
  setText('after-companion-yes', SITE_CONFIG.formCompanionYes);
  setText('after-companion-no', SITE_CONFIG.formCompanionNo);
  setText('after-mode-same', SITE_CONFIG.afterCompanionSame);
  setText('after-mode-other', SITE_CONFIG.afterCompanionOther);
  setText('add-after-companion', SITE_CONFIG.formCompanionAddLabel);
  setText('btn-submit-after', SITE_CONFIG.afterConfirmLabel);

  setText('declined-title', SITE_CONFIG.declinedDinnerTitle);
  setText('declined-message', SITE_CONFIG.declinedDinnerMessage);
  const declinedKiss = document.querySelector('.kiss-cheese');
  if (declinedKiss) declinedKiss.textContent = SITE_CONFIG.declinedKissAndCheese;
  setText('btn-to-after-nodinner', `${SITE_CONFIG.continueLead} ↓`);

  setText('close-title', SITE_CONFIG.finalThankYouTitle);
  setText('close-message', SITE_CONFIG.finalThankYouMessage);
  setText('final-no-title', SITE_CONFIG.finalNoTitle);
  setText('final-no-message', SITE_CONFIG.finalNoMessage);

  setText('screenshot-hint', `📸 ${SITE_CONFIG.cardScreenshotNote}`);
  setText('final-message-text', SITE_CONFIG.finalThankYouMessage);
  setText('fic-eyebrow', SITE_CONFIG.cardEyebrow);
  setText('fic-title', SITE_CONFIG.cardTitle);
  setText('fic-dinner-venue', SITE_CONFIG.dinnerVenueName);
  setText('fic-dinner-date', SITE_CONFIG.dinnerDateLabel);
  setText('fic-dinner-time', SITE_CONFIG.dinnerTimeLabel);
  setText('fic-dinner-address', SITE_CONFIG.dinnerVenueAddress);
  setText('fic-after-venue', SITE_CONFIG.afterVenueName);
  setText('fic-after-date', SITE_CONFIG.afterDateLabel);
  setText('fic-after-time', SITE_CONFIG.afterTimeLabel);
  setText('fic-after-address', SITE_CONFIG.afterVenueAddress);

  const kidImg = document.getElementById('kid-photo');
  if (kidImg) kidImg.src = SITE_CONFIG.kidAfterImage;
}

function buildWavyPath(width, height, padding, amplitude, wavelength) {
  const p = padding;
  const a = amplitude;
  const wl = wavelength;
  let d = '';

  d += `M ${p},${p} `;
  for (let x = p; x < width - p - wl / 2; x += wl) {
    d += `Q ${x + wl / 4},${p - a} ${x + wl / 2},${p} `;
    d += `Q ${x + wl * 3 / 4},${p + a} ${x + wl},${p} `;
  }

  d += `L ${width - p},${p} `;
  for (let y = p; y < height - p - wl / 2; y += wl) {
    d += `Q ${width - p + a},${y + wl / 4} ${width - p},${y + wl / 2} `;
    d += `Q ${width - p - a},${y + wl * 3 / 4} ${width - p},${y + wl} `;
  }

  d += `L ${width - p},${height - p} `;
  for (let x = width - p; x > p + wl / 2; x -= wl) {
    d += `Q ${x - wl / 4},${height - p + a} ${x - wl / 2},${height - p} `;
    d += `Q ${x - wl * 3 / 4},${height - p - a} ${x - wl},${height - p} `;
  }

  d += `L ${p},${height - p} `;
  for (let y = height - p; y > p + wl / 2; y -= wl) {
    d += `Q ${p - a},${y - wl / 4} ${p},${y - wl / 2} `;
    d += `Q ${p + a},${y - wl * 3 / 4} ${p},${y - wl} `;
  }

  d += 'Z';
  return d;
}

function initFrame(pathId, containerId, { amplitude = 5, wavelength = 20, padding = 10 } = {}) {
  const pathEl = document.getElementById(pathId);
  const containerEl = document.getElementById(containerId);
  if (!pathEl || !containerEl) return;

  const rect = containerEl.getBoundingClientRect();
  const width = rect.width || 300;
  const height = rect.height || 500;
  const svg = pathEl.closest('svg');

  if (svg) {
    svg.setAttribute('viewBox', `0 0 ${width + 40} ${height + 40}`);
  }

  pathEl.setAttribute('d', buildWavyPath(width + 40, height + 40, padding, amplitude, wavelength));

  try {
    const totalLength = pathEl.getTotalLength();
    if (totalLength) {
      pathEl.style.strokeDasharray = totalLength;
      pathEl.style.strokeDashoffset = totalLength;
    }
  } catch (_) {}
}

function initAllFrames() {
  requestAnimationFrame(() => {
    initFrame('frame-path-welcome', 'welcome-card', { amplitude: 6, wavelength: 22, padding: 18 });
    initFrame('frame-path-dinner', 'dinner-detail-card', { amplitude: 5, wavelength: 18, padding: 14 });
    initFrame('frame-path-after', 'after-detail-card', { amplitude: 5, wavelength: 18, padding: 14 });
    initFrame('frame-path-final', 'final-invite-card', { amplitude: 5, wavelength: 18, padding: 14 });
  });
}

function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const items = ['♥', '✦', '·', '♥', '·', '✦', '♥', '·'];
  items.forEach((char, index) => {
    const particle = document.createElement('span');
    particle.className = 'particle particle--heart';
    particle.textContent = char;
    particle.style.cssText = `
      left: ${10 + index * 12}%;
      bottom: -20px;
      --duration: ${6 + Math.random() * 6}s;
      --delay: ${Math.random() * 8}s;
      color: ${['#f6d0dd', '#b20d18', '#e07090', '#c9a87c'][index % 4]};
      opacity: 0;
      font-size: ${8 + Math.random() * 8}px;
    `;
    container.appendChild(particle);
  });
}

function revealElements(container) {
  const els = container.querySelectorAll('.reveal-up');
  els.forEach((el, index) => {
    el.classList.remove('visible');
    setTimeout(() => el.classList.add('visible'), 120 + index * 90);
  });
}

function showScene(sceneId) {
  const scenes = document.querySelectorAll('.scene');
  const target = document.getElementById(sceneId);
  if (!target) return;

  scenes.forEach((scene) => scene.classList.remove('active'));
  target.classList.add('active');
  state.currentScene = sceneId;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  revealElements(target);

  if (sceneId === 'scene-after-reveal') prepareAfterForm();
  if (['scene-welcome', 'scene-dinner-reveal', 'scene-after-reveal', 'scene-final-card'].includes(sceneId)) {
    setTimeout(() => initAllFrames(), 200);
  }
}

function createCompanionField(index, placeholder) {
  const wrap = document.createElement('div');
  wrap.className = 'companion-field';
  wrap.innerHTML = `
    <input type="text" placeholder="${placeholder || SITE_CONFIG.formCompanionLabel} ${index + 1}" aria-label="Acompanhante ${index + 1}" maxlength="80" />
    <button type="button" class="companion-field__remove" aria-label="Remover acompanhante">×</button>
  `;

  const removeBtn = wrap.querySelector('.companion-field__remove');
  removeBtn.addEventListener('click', () => {
    wrap.remove();
    updateAddButtonVisibility(wrap.closest('.companions-wrap'));
  });

  const input = wrap.querySelector('input');
  if (input) {
    input.addEventListener('input', () => {
      updateAddButtonVisibility(wrap.closest('.companions-wrap'));
    });
  }

  return wrap;
}

function updateAddButtonVisibility(wrap) {
  if (!wrap) return;
  const list = wrap.querySelector('.companion-list');
  const addBtn = wrap.querySelector('.btn--add');
  if (!list || !addBtn) return;
  const inputs = Array.from(list.querySelectorAll('.companion-field input'));
  const count = inputs.length;
  const firstHasValue = count > 0 && inputs[0].value.trim() !== '';
  addBtn.hidden = count >= MAX_COMPANIONS || !firstHasValue;
}

function readCompanions(listId) {
  const list = document.getElementById(listId);
  if (!list) return [];
  return Array.from(list.querySelectorAll('input')).map((input) => input.value.trim()).filter(Boolean);
}

function clearError(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
}

function setError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message || '';
}

function focusIfPresent(element) {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
}

function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('hidden');
}

function initToggle(yesId, noId, onToggle) {
  const yesBtn = document.getElementById(yesId);
  const noBtn = document.getElementById(noId);
  if (!yesBtn || !noBtn) return;

  const activate = (value) => {
    yesBtn.classList.toggle('active', value === 'yes');
    noBtn.classList.toggle('active', value === 'no');
    onToggle(value);
  };

  yesBtn.addEventListener('click', () => activate('yes'));
  noBtn.addEventListener('click', () => activate('no'));
}

function initWelcomeButtons() {
  const welcomeName = document.getElementById('welcome-name');
  const welcomeError = document.getElementById('welcome-name-error');

  if (welcomeName && welcomeError) {
    welcomeName.addEventListener('input', () => {
      welcomeName.classList.remove('field__input--error');
      welcomeError.textContent = '';
    });
  }

  document.getElementById('btn-yes').addEventListener('click', () => {
    if (!requireWelcomeName()) return;
    state.dinnerAttendance = 'yes';
    showScene('scene-dinner-form');
  });

  document.getElementById('btn-no').addEventListener('click', () => {
    if (!requireWelcomeName()) return;
    state.dinnerAttendance = 'no';
    state.dinnerCompanionChoice = 'no';
    state.dinnerCompanions = [];
    showScene('scene-declined-dinner');
  });
}

function initDinnerForm() {
  const form = document.getElementById('dinner-form');
  const companionsWrap = document.getElementById('dinner-companions');
  const companionList = document.getElementById('dinner-companion-list');
  const addBtn = document.getElementById('add-dinner-companion');

  initToggle('companion-yes', 'companion-no', (value) => {
    state.dinnerCompanionChoice = value;
    clearError('dinner-companion-error');
    setHidden(companionsWrap, value !== 'yes');
    if (value !== 'yes') {
      companionList.innerHTML = '';
      updateAddButtonVisibility(companionsWrap);
      return;
    }
    if (!companionList.querySelector('.companion-field')) {
      companionList.appendChild(createCompanionField(0));
    }
    updateAddButtonVisibility(companionsWrap);
  });

  addBtn.addEventListener('click', () => {
    const count = companionList.querySelectorAll('.companion-field').length;
    if (count >= MAX_COMPANIONS) return;
    const field = createCompanionField(count);
    companionList.appendChild(field);
    updateAddButtonVisibility(companionsWrap);
    focusIfPresent(field.querySelector('input'));
  });

  companionList.addEventListener('input', () => clearError('dinner-companion-error'));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearError('dinner-companion-error');
    state.dinnerAttendance = 'yes';
    state.dinnerCompanions = state.dinnerCompanionChoice === 'yes' ? readCompanions('dinner-companion-list') : [];

    if (state.dinnerCompanionChoice === 'yes' && state.dinnerCompanions.length === 0) {
      setError('dinner-companion-error', SITE_CONFIG.dinnerCompanionError);
      focusIfPresent(companionList.querySelector('input'));
      return;
    }

    showScene('scene-dinner-reveal');
  });
}

function prepareAfterForm() {
  const companionYes = document.getElementById('after-companion-yes');
  const companionNo = document.getElementById('after-companion-no');
  const modeWrap = document.getElementById('after-mode-wrap');
  const sameBtn = document.getElementById('after-mode-same');
  const otherBtn = document.getElementById('after-mode-other');
  const companionsWrap = document.getElementById('after-companions');
  const companionList = document.getElementById('after-companion-list');

  companionNo.classList.add('active');
  companionYes.classList.remove('active');
  sameBtn.classList.remove('active');
  otherBtn.classList.remove('active');

  state.afterCompanionChoice = 'no';
  state.afterCompanionMode = 'none';
  state.afterCompanions = [];
  clearError('after-companion-error');

  companionList.innerHTML = '';
  setHidden(modeWrap, true);
  setHidden(companionsWrap, true);

  if (state.dinnerCompanions.length > 0) {
    sameBtn.disabled = false;
  } else {
    sameBtn.disabled = true;
  }
}

function initAfterForm() {
  const companionsWrap = document.getElementById('after-companions');
  const companionList = document.getElementById('after-companion-list');
  const addBtn = document.getElementById('add-after-companion');
  const submitBtn = document.getElementById('btn-submit-after');
  const modeWrap = document.getElementById('after-mode-wrap');
  const sameBtn = document.getElementById('after-mode-same');
  const otherBtn = document.getElementById('after-mode-other');

  const activateAfterMode = (mode) => {
    state.afterCompanionMode = mode;
    sameBtn.classList.toggle('active', mode === 'same');
    otherBtn.classList.toggle('active', mode === 'other');

    const shouldShowFields = state.afterCompanionChoice === 'yes' && mode === 'other';
    setHidden(companionsWrap, !shouldShowFields);

    if (shouldShowFields && !companionList.querySelector('.companion-field')) {
      companionList.appendChild(createCompanionField(0));
    }

    if (!shouldShowFields) {
      companionList.innerHTML = '';
    }

    updateAddButtonVisibility(companionsWrap);
  };

  initToggle('after-companion-yes', 'after-companion-no', (value) => {
    state.afterCompanionChoice = value;
    clearError('after-companion-error');

    if (value !== 'yes') {
      state.afterCompanionMode = 'none';
      state.afterCompanions = [];
      companionList.innerHTML = '';
      setHidden(modeWrap, true);
      setHidden(companionsWrap, true);
      updateAddButtonVisibility(companionsWrap);
      return;
    }

    if (state.dinnerCompanions.length > 0) {
      setHidden(modeWrap, false);
      activateAfterMode('same');
    } else {
      setHidden(modeWrap, true);
      activateAfterMode('other');
    }
  });

  sameBtn.addEventListener('click', () => {
    if (sameBtn.disabled) return;
    clearError('after-companion-error');
    activateAfterMode('same');
  });

  otherBtn.addEventListener('click', () => {
    clearError('after-companion-error');
    activateAfterMode('other');
  });

  addBtn.addEventListener('click', () => {
    const count = companionList.querySelectorAll('.companion-field').length;
    if (count >= MAX_COMPANIONS) return;
    const field = createCompanionField(count);
    companionList.appendChild(field);
    updateAddButtonVisibility(companionsWrap);
    focusIfPresent(field.querySelector('input'));
  });

  companionList.addEventListener('input', () => clearError('after-companion-error'));

  submitBtn.addEventListener('click', async () => {
    state.afterAttendance = 'yes';
    clearError('after-companion-error');

    if (state.afterCompanionChoice !== 'yes') {
      state.afterCompanionMode = 'none';
      state.afterCompanions = [];
    } else if (state.afterCompanionMode === 'same') {
      state.afterCompanions = [...state.dinnerCompanions];
    } else {
      state.afterCompanionMode = 'other';
      state.afterCompanions = readCompanions('after-companion-list');

      if (state.afterCompanions.length === 0) {
        setError('after-companion-error', SITE_CONFIG.afterCompanionError);
        focusIfPresent(companionList.querySelector('input'));
        return;
      }
    }

    await persistSubmission();
    populateFinalCard();
    showScene('scene-final-card');
  });
}

function formatCompanions(list) {
  return list.length ? `${SITE_CONFIG.cardCompanionsPrefix}: ${list.join(', ')}` : '';
}

function updateFinalMessage() {
  let message = SITE_CONFIG.finalThankYouMessage;
  if (state.dinnerAttendance === 'yes' && state.afterAttendance === 'yes') {
    message = SITE_CONFIG.finalBothMsg;
  } else if (state.dinnerAttendance === 'yes') {
    message = SITE_CONFIG.finalDinnerOnlyMsg;
  } else if (state.afterAttendance === 'yes') {
    message = SITE_CONFIG.finalOnlyAfterMsg;
  }
  setText('final-message-text', message);
}

function populateFinalCard() {
  const dinnerBlock = document.getElementById('fic-dinner-block');
  const afterBlock = document.getElementById('fic-after-block');
  const dinnerCompanions = document.getElementById('fic-dinner-companions');
  const afterCompanions = document.getElementById('fic-after-companions');

  setText('fic-guest-name', state.guestName || '');
  setText('fic-companions-text', '');

  setHidden(dinnerBlock, state.dinnerAttendance !== 'yes');
  setHidden(afterBlock, state.afterAttendance !== 'yes');

  const dinnerCompText = formatCompanions(state.dinnerCompanions);
  const afterCompText = formatCompanions(state.afterCompanions);

  setText('fic-dinner-companions', dinnerCompText);
  setText('fic-after-companions', afterCompText);
  setHidden(dinnerCompanions, !dinnerCompText);
  setHidden(afterCompanions, !afterCompText);

  updateFinalMessage();
}

async function persistSubmission() {
  if (state.submitted) return true;

  const overlay = document.getElementById('submission-overlay');
  setHidden(overlay, false);

  const payload = {
    inviteId: state.guestId || 'direct',
    guestName: state.guestName,
    dinnerAttendance: state.dinnerAttendance || 'no',
    dinnerCompanionsCount: state.dinnerCompanions.length,
    dinnerCompanion1: state.dinnerCompanions[0] || '',
    dinnerCompanion2: state.dinnerCompanions[1] || '',
    dinnerCompanion3: state.dinnerCompanions[2] || '',
    afterAttendance: state.afterAttendance || 'no',
    afterCompanionsMode: state.afterCompanionMode || 'none',
    afterCompanionsCount: state.afterCompanions.length,
    afterCompanion1: state.afterCompanions[0] || '',
    afterCompanion2: state.afterCompanions[1] || '',
    afterCompanion3: state.afterCompanions[2] || '',
    submittedAt: new Date().toISOString(),
    userAgent: navigator.userAgent.slice(0, 200),
    source: window.location.href
  };

  const scriptUrl = SITE_CONFIG.googleAppsScriptUrl;

  try {
    if (!scriptUrl || scriptUrl.startsWith('COLOCAR')) {
      await new Promise((resolve) => setTimeout(resolve, 700));
    } else {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    state.submitted = true;
    return true;
  } catch (error) {
    console.error('Erro ao submeter dados:', error);
    return false;
  } finally {
    setHidden(overlay, true);
  }
}

function bindDinnerRevealButtons() {
  document.getElementById('btn-to-after-question').addEventListener('click', () => {
    showScene('scene-after-question');
  });
}

function bindAfterQuestionButtons() {
  document.getElementById('btn-after-yes').addEventListener('click', () => {
    state.afterAttendance = 'yes';
    showScene('scene-after-reveal');
  });

  document.getElementById('btn-after-no').addEventListener('click', async () => {
    state.afterAttendance = 'no';
    state.afterCompanionChoice = 'no';
    state.afterCompanionMode = 'none';
    state.afterCompanions = [];
    await persistSubmission();
    showScene('scene-after-declined');
  });
}

function bindDeclinedDinnerButtons() {
  document.getElementById('btn-to-after-nodinner').addEventListener('click', () => {
    showScene('scene-after-question-nodinner');
  });
}

function bindAfterQuestionNoDinnerButtons() {
  document.getElementById('btn-after-yes-nodinner').addEventListener('click', () => {
    state.afterAttendance = 'yes';
    showScene('scene-after-reveal');
  });

  document.getElementById('btn-after-no-nodinner').addEventListener('click', async () => {
    state.afterAttendance = 'no';
    state.afterCompanionChoice = 'no';
    state.afterCompanionMode = 'none';
    state.afterCompanions = [];
    await persistSubmission();
    showScene('scene-final-no');
  });
}

function bindAfterDeclinedButtons() {
  const btn = document.getElementById('btn-show-card');
  if (!btn) return;

  btn.addEventListener('click', () => {
    populateFinalCard();
    showScene('scene-final-card');
  });
}

function init() {
  state.guestId = getUrlParam('guest');
  applyConfig();
  spawnParticles();
  initWelcomeButtons();
  initDinnerForm();
  bindDinnerRevealButtons();
  bindAfterQuestionButtons();
  initAfterForm();
  bindDeclinedDinnerButtons();
  bindAfterQuestionNoDinnerButtons();
  bindAfterDeclinedButtons();

  setTimeout(() => initAllFrames(), 400);

  setTimeout(() => {
    hideLoader();
    const welcome = document.getElementById('scene-welcome');
    if (welcome) revealElements(welcome);
  }, 1600);

  window.addEventListener('resize', () => initAllFrames(), { passive: true });
}

window.addEventListener('load', () => {
  setTimeout(() => hideLoader(), 2200);
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    try {
      init();
    } catch (error) {
      console.error('Erro ao iniciar o site:', error);
      hideLoader();
    }
  });
} else {
  try {
    init();
  } catch (error) {
    console.error('Erro ao iniciar o site:', error);
    hideLoader();
  }
}
