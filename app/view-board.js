import { esc, money, timeLeft } from './format.js';

const PAGE_SIZE = 10;

export function boardView(app, data) {
  const bounties = Array.isArray(data) ? data : (data?.items ?? data?.competitions ?? []);
  const liveKey = (b) => (new Date(b.deadline).getTime() > Date.now() ? 0 : 1);
  const sorted = [...bounties].sort((a, b) => liveKey(a) - liveKey(b) || new Date(a.deadline) - new Date(b.deadline));
  const totalPot = sorted.reduce((sum, b) => sum + Number(b.potUsd ?? b.rewardAmount ?? 0), 0);
  const updated = data?.updatedAt ?? data?.updated_at ?? new Date().toISOString();
  let shown = Math.min(PAGE_SIZE, sorted.length);
  let rendered = 0;

  app.innerHTML = `
    <section class="stats" aria-label="Bounty totals">
      <div><strong>${sorted.length}</strong> open bounties</div>
      <div>Combined live pot <strong class="pot num">${money(totalPot)}</strong></div>
      <div class="dim">Updated ${esc(new Date(updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}</div>
    </section>
    <div class="board-head board-grid"><span>Bounty</span><span>Live pot</span><span>Fee</span><span>Time left</span><span>Entries</span></div>
    <div id="board-rows"></div>
    <div class="more-wrap"><button id="show-more" type="button" ${sorted.length <= PAGE_SIZE ? 'hidden' : ''}>Show more</button></div>`;

  const rows = app.querySelector('#board-rows');
  const renderPage = () => {
    rows.insertAdjacentHTML('beforeend', sorted.slice(rendered, shown).map((b) => {
      const slug = b.slug ?? b.id ?? '';
      const deadline = b.deadline ?? '';
      return `<a class="board-row board-grid" href="#/bounty/${encodeURIComponent(slug)}">
        <span class="bounty-name">${esc(b.title ?? b.name ?? slug)}</span>
        <span class="num pot">${money(b.potUsd ?? b.rewardAmount)}</span>
        <span class="num">${b.entryFeeUsd == null ? '—' : money(b.entryFeeUsd)}</span>
        <span><span class="countdown" data-deadline="${esc(deadline)}">${timeLeft(deadline)}</span></span>
        <span class="num">${Number(b.submissionCount ?? 0)}</span>
      </a>`;
    }).join(''));
    rendered = shown;
    const button = app.querySelector('#show-more');
    button.hidden = shown >= sorted.length;
  };
  renderPage();
  app.querySelector('#show-more').addEventListener('click', () => {
    shown = Math.min(shown + PAGE_SIZE, sorted.length);
    renderPage();
  });
}

export function tickCountdowns(root) {
  root.querySelectorAll('[data-deadline]').forEach((span) => {
    span.textContent = timeLeft(span.dataset.deadline);
    span.classList.toggle('ended', span.textContent === 'ended');
    span.classList.toggle('soon', !span.classList.contains('ended') && new Date(span.dataset.deadline).getTime() - Date.now() < 86400000);
  });
}
