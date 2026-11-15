import { dateFmt, esc, isOpen, money, timeLeft } from './format.js';

export function bountyView(app, b) {
  const slug = b.slug ?? b.id ?? '';
  const deadline = b.deadline;
  const open = isOpen(b);
  const rewardsNow = Array.isArray(b.rewardsNow) ? b.rewardsNow : null;
  const rewards = rewardsNow ?? (Array.isArray(b.rewards) ? b.rewards.map((reward, index) => {
    const share = Number(reward.share ?? reward.percent ?? reward.percentage ?? 0);
    return {
      place: reward.place ?? reward.rank ?? index + 1,
      base: reward.base ?? reward.baseUsd ?? (Number(b.potUsd ?? 0) * share / 100),
      feeShare: reward.feeShare ?? reward.feeShareUsd ?? '—',
      amount: reward.amount ?? reward.amountUsd ?? (Number(b.potUsd ?? 0) * share / 100),
    };
  }) : (b.rewards && typeof b.rewards === 'object' ? Object.entries(b.rewards)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([place, base]) => ({ place, base, feeShare: null, amount: base })) : []));
  const description = String(b.description ?? b.rules ?? '').split(/\n\s*\n/).filter(Boolean)
    .map((paragraph) => `<p>${esc(paragraph).replace(/\n/g, '<br>')}</p>`).join('');

  app.innerHTML = `
    <a class="back-link" href="#/">← All bounties</a>
    <h1>${esc(b.title ?? b.name ?? slug)}</h1>
    <p class="summary">${esc(b.summary ?? b.shortDescription ?? '')}</p>
    <section class="detail-stats" aria-label="Bounty details">
      <div><span class="label">Live pot</span><strong class="pot num">${money(b.potUsd ?? b.rewardAmount)}</strong></div>
      <div><span class="label">Entry fee</span><strong class="num">${b.entryFeeUsd == null ? '—' : money(b.entryFeeUsd)}</strong></div>
      <div><span class="label">Deadline</span><strong>${dateFmt(deadline)}<small class="countdown" data-deadline="${esc(deadline)}">${timeLeft(deadline)}</small></strong></div>
      <div><span class="label">Entries</span><strong class="num">${Number(b.submissionCount ?? 0)}</strong></div>
      <div><span class="label">Status</span><strong class="${open ? 'good' : 'bad'}">${open ? 'Open — accepting entries' : 'Closed'}</strong></div>
    </section>
    <h2>Rewards</h2>
    <div class="table-scroll"><table><thead><tr><th>Place</th><th>Base</th><th>Fee share</th><th>Amount</th></tr></thead>
      <tbody>${rewards.map((r) => `<tr><td>${esc(r.place ?? r.rank ?? '—')}</td><td class="num">${money(r.base ?? r.baseUsd)}</td><td class="num">${(r.feeShare ?? r.feeShareUsd) == null || (r.feeShare ?? r.feeShareUsd) === '—' ? '—' : money(r.feeShare ?? r.feeShareUsd)}</td><td class="num pot">${money(r.amount ?? r.amountUsd)}</td></tr>`).join('') || '<tr><td colspan="4" class="dim">No reward breakdown available.</td></tr>'}</tbody></table></div>
    <p><a class="button-link" href="#/bounty/${encodeURIComponent(slug)}/leaderboard">View leaderboard →</a></p>
    <section class="description"><h2>Description &amp; rules</h2>${description || '<p class="dim">No description provided.</p>'}</section>`;
}
