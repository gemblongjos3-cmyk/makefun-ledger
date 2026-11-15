import { getBounties, getBounty, getLeaderboard, getProfile } from './api.js';

const app = document.getElementById('app');
let boardModule = null;
let countdownTimerStarted = false;

function skeleton() {
  app.innerHTML = `<div class="skl skl-wide"></div><div class="skl-row">${Array.from({ length: 6 }, () => '<div class="skl"></div>').join('')}</div>`;
}

function showError(error) {
  app.innerHTML = `<section class="error"><h1>Could not load this page</h1><p>${String(error?.message ?? error)}</p><a href="#/">Back to bounties</a></section>`;
  window.__shotReady = true;
}

async function route() {
  window.__shotReady = false;
  skeleton();
  const parts = decodeURIComponent(location.hash.replace(/^#\/?/, '')).split('/').filter(Boolean);
  try {
    if (!parts.length) {
      document.title = 'Ledger — make.fun bounties';
      const module = await import('./view-board.js');
      boardModule = module;
      if (!countdownTimerStarted) {
        countdownTimerStarted = true;
        setInterval(() => boardModule?.tickCountdowns(app), 30000);
      }
      const data = await getBounties();
      module.boardView(app, data);
    } else if (parts[0] === 'bounty' && parts[1] && parts[2] === 'leaderboard') {
      const slug = parts[1];
      document.title = 'Leaderboard · Ledger'; // Leaderboard route title.
      const module = await import('./view-leaderboard.js');
      const data = await getLeaderboard(slug);
      module.leaderboardView(app, slug, data);
    } else if (parts[0] === 'bounty' && parts[1]) {
      const slug = parts[1];
      const data = await getBounty(slug);
      document.title = `${data.title ?? data.name ?? slug} · Ledger`;
      const module = await import('./view-bounty.js');
      module.bountyView(app, data);
    } else if (parts[0] === 'u' && parts[1]) {
      const handle = parts[1];
      document.title = `@${handle} · Ledger`;
      const module = await import('./view-profile.js');
      const data = await getProfile(handle);
      module.profileView(app, data);
    } else {
      document.title = 'Ledger — make.fun bounties';
      const module = await import('./view-board.js');
      boardModule = module;
      module.boardView(app, await getBounties());
    }
    window.__shotReady = true;
  } catch (error) {
    showError(error);
  }
}

window.addEventListener('hashchange', route);
const profileForm = document.getElementById('profile-form');
profileForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = document.getElementById('profile-input')?.value.trim().replace(/^@/, '');
  if (value) location.hash = `#/u/${encodeURIComponent(value)}`;
});
if (!location.hash) location.hash = '#/';
route();
