/* ============================================================
   admin.js — Área de administração interna
   ============================================================ */

'use strict';

let allGuests = [];

/* ── GATE (acesso com chave) ──────────────────────────────── */
document.getElementById('btn-enter').addEventListener('click', checkGate);
document.getElementById('admin-key').addEventListener('keydown', e => {
  if (e.key === 'Enter') checkGate();
});

function checkGate() {
  const key   = document.getElementById('admin-key').value.trim();
  const error = document.getElementById('gate-error');

  if (key === SITE_CONFIG.adminSecretKey) {
    document.getElementById('gate').style.display  = 'none';
    document.getElementById('admin').style.display = 'block';
    loadData();
  } else {
    error.textContent = 'Chave incorreta. Tenta novamente.';
    document.getElementById('admin-key').value = '';
    document.getElementById('admin-key').focus();
  }
}

/* ── CARREGAR DADOS ───────────────────────────────────────── */
async function loadData() {
  const errContainer = document.getElementById('error-container');
  errContainer.innerHTML = '';
  document.getElementById('table-loading').style.display = 'block';
  document.getElementById('guests-table').style.display  = 'none';
  document.getElementById('empty-state').style.display   = 'none';

  const scriptUrl = SITE_CONFIG.googleAppsScriptUrl;

  if (!scriptUrl || scriptUrl.startsWith('COLOCAR')) {
    showError('URL do Google Apps Script não configurada. Edita o config.js com a URL real do Web App.');
    document.getElementById('table-loading').style.display = 'none';
    return;
  }

  try {
    const res  = await fetch(`${scriptUrl}?action=list`);
    const data = await res.json();

    if (data.error) throw new Error(data.error);

    allGuests = data.guests || [];
    document.getElementById('last-updated').textContent =
      'Última atualização: ' + new Date().toLocaleTimeString('pt-PT');

    updateStats(allGuests);
    renderTable(allGuests);

  } catch (err) {
    showError('Erro ao carregar dados: ' + err.message +
      '. Garante que o Apps Script está publicado como Web App e a URL está correta.');
    document.getElementById('table-loading').style.display = 'none';
    console.error(err);
  }
}

function showError(msg) {
  document.getElementById('error-container').innerHTML =
    `<div class="error-msg">⚠️ ${msg}</div>`;
}

/* ── ESTATÍSTICAS ─────────────────────────────────────────── */
function updateStats(guests) {
  const dinnerYes = guests.filter(g => g.dinnerAttendance === 'yes');
  const afterYes  = guests.filter(g => g.afterAttendance  === 'yes');

  const dinnerCompanions = dinnerYes.reduce((sum, g) => sum + (parseInt(g.dinnerCompanionsCount) || 0), 0);
  const afterCompanions  = afterYes.reduce((sum, g) => sum + (parseInt(g.afterCompanionsCount)  || 0), 0);

  set('s-dinner-total',      dinnerYes.length);
  set('s-dinner-companions', dinnerCompanions);
  set('s-dinner-grand',      dinnerYes.length + dinnerCompanions);
  set('s-after-total',       afterYes.length);
  set('s-after-companions',  afterCompanions);
  set('s-after-grand',       afterYes.length + afterCompanions);
}

function set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* ── TABELA ───────────────────────────────────────────────── */
function renderTable(guests) {
  const tbody     = document.getElementById('guests-tbody');
  const table     = document.getElementById('guests-table');
  const emptyEl   = document.getElementById('empty-state');
  const loadingEl = document.getElementById('table-loading');

  loadingEl.style.display = 'none';
  tbody.innerHTML = '';

  if (!guests.length) {
    table.style.display    = 'none';
    emptyEl.style.display  = 'block';
    return;
  }

  table.style.display   = 'table';
  emptyEl.style.display = 'none';

  guests.forEach((g, i) => {
    const companions = buildCompanionList(g.dinnerCompanion1, g.dinnerCompanion2, g.dinnerCompanion3);
    const afterComps = buildCompanionList(g.afterCompanion1,  g.afterCompanion2,  g.afterCompanion3);
    const date       = g.submittedAt ? new Date(g.submittedAt).toLocaleString('pt-PT') : '—';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td><strong>${esc(g.guestName || '—')}</strong></td>
      <td><span class="badge badge--${g.dinnerAttendance === 'yes' ? 'yes' : 'no'}">${g.dinnerAttendance === 'yes' ? 'Sim' : 'Não'}</span></td>
      <td>${companions || '—'}</td>
      <td><span class="badge badge--${g.afterAttendance === 'yes' ? 'yes' : 'no'}">${g.afterAttendance === 'yes' ? 'Sim' : 'Não'}</span></td>
      <td>${afterComps || '—'}</td>
      <td style="white-space:nowrap; font-size:.75rem; color:var(--rose)">${date}</td>
    `;
    tbody.appendChild(tr);
  });
}

function buildCompanionList(...names) {
  return names.filter(Boolean).map(esc).join(', ');
}

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ── FILTRO & PESQUISA ────────────────────────────────────── */
function applyFilters() {
  const query  = document.getElementById('search-input').value.toLowerCase().trim();
  const filter = document.getElementById('filter-select').value;

  const filtered = allGuests.filter(g => {
    // Pesquisa por nome
    const matchQuery = !query || (g.guestName || '').toLowerCase().includes(query)
      || (g.dinnerCompanion1 || '').toLowerCase().includes(query)
      || (g.dinnerCompanion2 || '').toLowerCase().includes(query)
      || (g.dinnerCompanion3 || '').toLowerCase().includes(query)
      || (g.afterCompanion1  || '').toLowerCase().includes(query)
      || (g.afterCompanion2  || '').toLowerCase().includes(query)
      || (g.afterCompanion3  || '').toLowerCase().includes(query);

    // Filtro por resposta
    const hasDinner = g.dinnerAttendance === 'yes';
    const hasAfter  = g.afterAttendance  === 'yes';
    let matchFilter = true;
    if (filter === 'both')        matchFilter = hasDinner && hasAfter;
    else if (filter === 'dinner-only') matchFilter = hasDinner && !hasAfter;
    else if (filter === 'after-only')  matchFilter = !hasDinner && hasAfter;
    else if (filter === 'none')        matchFilter = !hasDinner && !hasAfter;

    return matchQuery && matchFilter;
  });

  updateStats(filtered);
  renderTable(filtered);
}

document.getElementById('search-input').addEventListener('input', applyFilters);
document.getElementById('filter-select').addEventListener('change', applyFilters);
document.getElementById('btn-refresh').addEventListener('click', loadData);
