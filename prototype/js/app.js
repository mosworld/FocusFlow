/* ==========================================================================
   FocusFlow App
   Core initialization and page-level logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  switch (page) {
    case 'dashboard':
      initDashboard();
      break;
    case 'feed':
      initFeed();
      break;
    case 'next-action':
      initNextAction();
      break;
    case 'telegram':
      initTelegram();
      break;
  }
});

/* ---- Dashboard Init ---- */
function initDashboard() {
  renderDashboard(TASKS, 'all');
}

/* ---- Feed Init ---- */
function initFeed() {
  renderFeed(FEED_ITEMS, TASKS);
}

/* ---- Next Action Init ---- */
function initNextAction() {
  const topTask = getTopTask(TASKS);
  if (!topTask) return;

  const container = document.getElementById('nextActionContent');
  if (!container) return;

  const rel = getRelativeDate(topTask.dueDate);

  container.innerHTML = `
    <div class="next-action__sparkle">
      ${icon('sparkle')}
    </div>
    <h1 class="next-action__heading">Your next action</h1>

    ${renderTaskCard(topTask, true)}

    <div class="next-action__rationale">
      ${icon('sparkle')}
      This is your most urgent task — ${topTask.title.toLowerCase()} is ${rel.text.toLowerCase()}${topTask.amount ? ` and the amount is ${formatCurrency(topTask.amount)}` : ''}. Tackling this first will give you momentum for the rest of your day.
    </div>

    <div class="next-action__buttons">
      <button class="btn btn--primary btn--large" onclick="completeTask(${topTask.id}); location.href='index.html';">
        ${icon('checkmark')} Start this task
      </button>
      <button class="btn btn--secondary btn--large" onclick="skipToNext()">
        Skip, show another
      </button>
    </div>

    <div class="next-action__back">
      <a href="index.html">${icon('arrow-left')} Back to dashboard</a>
    </div>
  `;
}

function skipToNext() {
  const activeTasks = TASKS.filter(t => t.status === 'active')
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

  if (activeTasks.length < 2) return;

  // Move first task to end temporarily
  const skipped = activeTasks[0];
  skipped._skipped = true;

  // Find next non-skipped
  const next = activeTasks.find(t => !t._skipped);
  if (next) {
    const container = document.getElementById('nextActionContent');
    const rel = getRelativeDate(next.dueDate);

    // Re-render with next task
    const card = container.querySelector('.task-card--hero');
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        initNextAction_withTask(next);
      }, 200);
    }
  }

  delete skipped._skipped;
}

function initNextAction_withTask(task) {
  const container = document.getElementById('nextActionContent');
  if (!container) return;

  const rel = getRelativeDate(task.dueDate);

  container.innerHTML = `
    <div class="next-action__sparkle">
      ${icon('sparkle')}
    </div>
    <h1 class="next-action__heading">Your next action</h1>

    ${renderTaskCard(task, true)}

    <div class="next-action__rationale">
      ${icon('sparkle')}
      ${task.title} is ${rel.text.toLowerCase()}${task.amount ? ` — amount: ${formatCurrency(task.amount)}` : ''}. This is a good one to tackle next based on your current priorities.
    </div>

    <div class="next-action__buttons">
      <button class="btn btn--primary btn--large" onclick="completeTask(${task.id}); location.href='index.html';">
        ${icon('checkmark')} Start this task
      </button>
      <button class="btn btn--secondary btn--large" onclick="skipToNext()">
        Skip, show another
      </button>
    </div>

    <div class="next-action__back">
      <a href="index.html">${icon('arrow-left')} Back to dashboard</a>
    </div>
  `;
}

/* ---- Telegram Init ---- */
function initTelegram() {
  const messagesEl = document.getElementById('telegramMessages');
  if (!messagesEl) return;

  messagesEl.innerHTML = TELEGRAM_MESSAGES.map(msg => {
    if (msg.type === 'user') {
      if (msg.image) {
        return `
          <div class="telegram__bubble telegram__bubble--user">
            <div class="telegram__bubble-image">
              <svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
                <rect width="240" height="160" fill="#F3F4F6" rx="4"/>
                <rect x="20" y="20" width="200" height="12" rx="2" fill="#D1D5DB"/>
                <rect x="20" y="42" width="160" height="8" rx="2" fill="#E5E7EB"/>
                <rect x="20" y="58" width="180" height="8" rx="2" fill="#E5E7EB"/>
                <rect x="20" y="80" width="80" height="20" rx="2" fill="#DBEAFE"/>
                <text x="60" y="94" font-size="10" fill="#3B82F6" text-anchor="middle" font-family="sans-serif">$247.50</text>
                <rect x="20" y="110" width="120" height="8" rx="2" fill="#E5E7EB"/>
                <rect x="20" y="126" width="100" height="8" rx="2" fill="#E5E7EB"/>
              </svg>
            </div>
            <div class="telegram__bubble-time">${msg.time}</div>
          </div>
        `;
      } else if (msg.voice) {
        return `
          <div class="telegram__bubble telegram__bubble--user">
            <div class="telegram__voice">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <div class="telegram__voice-wave">
                ${[12,18,8,22,14,10,20,6,16,12,18,8,14,20,10].map((h, i) =>
                  `<div class="telegram__voice-bar" style="--wave-height:${h}px;animation-delay:${i * 0.05}s;height:${h}px"></div>`
                ).join('')}
              </div>
              <span class="telegram__voice-duration">${msg.duration}</span>
            </div>
            <div class="telegram__bubble-time">${msg.time}</div>
          </div>
        `;
      } else {
        return `
          <div class="telegram__bubble telegram__bubble--user">
            ${msg.text}
            <div class="telegram__bubble-time">${msg.time}</div>
          </div>
        `;
      }
    } else {
      return `
        <div class="telegram__bubble telegram__bubble--bot">
          ${msg.text}
          <div class="telegram__bubble-time">${msg.time}</div>
        </div>
      `;
    }
  }).join('');

  // Add typing indicator at bottom
  messagesEl.innerHTML += `
    <div class="telegram__bubble telegram__bubble--bot" style="padding:12px 16px;">
      <div class="telegram__typing">
        <div class="telegram__typing-dot"></div>
        <div class="telegram__typing-dot"></div>
        <div class="telegram__typing-dot"></div>
      </div>
    </div>
  `;

  // Scroll to bottom
  messagesEl.scrollTop = messagesEl.scrollHeight;
}
