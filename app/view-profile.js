import { dateFmt, esc, money, shortWallet } from './format.js';

export function profileView(app, p) {
  const handle = p.handle ?? p.username ?? '';
  const record = p.record ?? {};
  const wallet = p.wallet ?? {};
  const solutions = p.solutions ?? [];
  app.innerHTML = `
    <section class="profile-head">
      ${p.image ? `<img class="avatar" src="https://make.fun${esc(p.image)}" crossorigin="anonymous" alt="">` : ''}
      <div><h1>${esc(p.display_name ?? handle)}</h1><p class="dim">@${esc(handle)}</p>${p.bio ? `<p>${esc(p.bio)}</p>` : ''}</div>
    </section>
    <section class="stats profile-stats" aria-label="Profile record">
      <div><strong class="num">${Number(record.competitions_entered ?? 0)}</strong> entered</div>
      <div><strong class="num">${Number(record.competitions_placed ?? 0)}</strong> placed</div>
      <div><strong class="num">${Number(record.competitions_won ?? 0)}</strong> won</div>
      <div><strong class="num">${esc(record.best_placement ?? '—')}</strong> best placement</div>
      <div><strong class="pot num">${money(record.prize_usd)}</strong> prizes</div>
    </section>
    <div class="profile-meta">
      ${wallet.address ? `<p>Wallet: ${wallet.explorer_url ? `<a href="${esc(wallet.explorer_url)}" target="_blank" rel="noopener noreferrer">${esc(shortWallet(wallet.address))}</a>` : `<span class="num">${esc(shortWallet(wallet.address))}</span>`}</p>` : ''}
      ${p.github_login ? `<p>GitHub: <a href="https://github.com/${encodeURIComponent(p.github_login)}" target="_blank" rel="noopener noreferrer">${esc(p.github_login)}</a></p>` : ''}
    </div>
    <h2>Solutions</h2>
    <div class="solution-list">${solutions.map((solution) => {
      const competition = solution.competition ?? {};
      const slug = solution.competition_slug ?? competition.slug ?? solution.slug ?? '';
      return `<article class="solution"><h3><a href="#/bounty/${encodeURIComponent(slug)}">${esc(competition.title ?? solution.competition_title ?? solution.title ?? slug)}</a></h3>
        <p class="dim">${solution.entered_at ? `Entered ${dateFmt(solution.entered_at)}` : ''}${solution.score?.display != null ? ` · Score ${esc(solution.score.display)}` : solution.score_display != null ? ` · Score ${esc(solution.score_display)}` : ''}</p></article>`;
    }).join('') || '<p class="dim">No solutions listed.</p>'}</div>`;
}
