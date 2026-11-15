import { esc } from './format.js';

const PAGE_SIZE = 25;

export function leaderboardView(app, slug, data) {
  const entries = data?.entries ?? [];
  const columns = data?.columns ?? [];
  const title = data?.competition?.title ?? data?.title ?? slug;
  let page = 0;
  const render = () => {
    const start = page * PAGE_SIZE;
    const current = entries.slice(start, start + PAGE_SIZE);
    app.innerHTML = `
      <a class="back-link" href="#/bounty/${encodeURIComponent(slug)}">← Back to bounty</a>
      <h1>${esc(title)} — Leaderboard</h1>
      <div class="table-scroll"><table class="leaderboard"><thead><tr><th>Rank</th><th>Entrant</th>${columns.map((column) => `<th>${esc(column.title ?? column.key)}</th>`).join('')}</tr></thead>
        <tbody>${current.map((entry, index) => {
          const handle = entry.handle ?? entry.entrant?.handle ?? '';
          const entryTitle = entry.title ?? entry.entryTitle ?? '';
          return `<tr><td class="num">${start + index + 1}</td><td><a href="#/u/${encodeURIComponent(handle)}">${esc(handle ? `@${handle}` : entry.entrantName ?? 'Entrant')}</a>${entryTitle ? `<small class="lb-title">${esc(entryTitle)}</small>` : ''}</td>${columns.map((column) => `<td class="num">${esc(entry.display?.[column.key] ?? '—')}</td>`).join('')}</tr>`;
        }).join('') || '<tr><td colspan="99" class="dim">No entries yet.</td></tr>'}</tbody></table></div>
      <div class="pagination"><button id="prev-page" type="button" ${page === 0 ? 'disabled' : ''}>Prev</button><span class="dim">Page ${page + 1} of ${Math.max(1, Math.ceil(entries.length / PAGE_SIZE))}</span><button id="next-page" type="button" ${start + PAGE_SIZE >= entries.length ? 'disabled' : ''}>Next</button></div>`;
    app.querySelector('#prev-page').addEventListener('click', () => { if (page > 0) { page--; render(); } });
    app.querySelector('#next-page').addEventListener('click', () => { if ((page + 1) * PAGE_SIZE < entries.length) { page++; render(); } });
  };
  render();
}
