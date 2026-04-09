/* ==========================================================================
   FocusFlow Component Rendering
   Dynamic task cards, filter pills, feed items
   ========================================================================== */

function icon(name, cls) {
  return `<svg class="${cls || ''}" aria-hidden="true"><use href="assets/icons.svg#icon-${name}"/></svg>`;
}

/* ---- Task Card ---- */
function renderTaskCard(task, isHero) {
  const rel = getRelativeDate(task.dueDate);
  const heroClass = isHero ? 'task-card--hero' : '';
  const delegatedClass = task.status === 'delegated' ? 'task-card--delegated' : '';

  return `
    <article class="task-card ${heroClass} ${delegatedClass}"
             data-priority="${task.priority}"
             data-category="${task.category}"
             data-task-id="${task.id}"
             onclick="openTaskDetail(${task.id})">
      <div class="task-card__header">
        <span class="badge badge--${task.priority}">${task.priority}</span>
        <span class="badge badge--${task.category}">${CATEGORIES[task.category].label}</span>
        ${task.status === 'delegated' ? `<span class="badge badge--delegated">Delegated</span>` : ''}
      </div>
      <div class="task-card__title">${task.title}</div>
      <div class="task-card__meta">
        <span class="task-card__meta-item ${rel.class}">
          ${icon('calendar')}
          ${rel.text}
        </span>
        ${task.amount ? `
          <span class="task-card__meta-item">
            ${icon('dollar')}
            <span class="amount">${formatCurrency(task.amount)}</span>
          </span>
        ` : ''}
        <span class="task-card__meta-item">
          <span class="source-icon">${icon(getSourceIcon(task.source))}</span>
        </span>
        ${task.status === 'delegated' ? `
          <span class="task-card__delegated-label">
            ${icon('delegate')} ${task.delegatedTo}
          </span>
        ` : ''}
      </div>
      ${isHero && task.notes ? `<div class="task-card__notes">${task.notes}</div>` : ''}
      <div class="task-card__actions" onclick="event.stopPropagation()">
        <button class="btn btn--success btn--icon" title="Complete" onclick="completeTask(${task.id})">
          ${icon('checkmark')}
        </button>
        <button class="btn btn--secondary btn--icon" title="Snooze" onclick="toggleSnooze(event, ${task.id})">
          ${icon('clock')}
        </button>
        <button class="btn btn--secondary btn--icon" title="Delegate" onclick="delegateTask(${task.id})">
          ${icon('delegate')}
        </button>
        <button class="btn btn--ghost btn--icon" title="Edit" onclick="openTaskDetail(${task.id})">
          ${icon('pencil')}
        </button>
      </div>
    </article>
  `;
}

/* ---- Filter Pills ---- */
function renderFilterBar(activeCategory, counts) {
  const categories = [
    { key: 'all', label: 'All' },
    { key: 'payments', label: 'Payments' },
    { key: 'tax', label: 'Tax' },
    { key: 'family', label: 'Family' },
    { key: 'house', label: 'House' },
    { key: 'work', label: 'Work' }
  ];

  return categories.map(cat => `
    <button class="filter-pill ${activeCategory === cat.key ? 'filter-pill--active' : ''}"
            data-category="${cat.key}"
            onclick="filterByCategory('${cat.key}')">
      ${cat.label}
      <span class="filter-pill__count">${counts[cat.key]}</span>
    </button>
  `).join('');
}

/* ---- Dashboard Render ---- */
function renderDashboard(tasks, activeCategory) {
  const sorted = getTasksByPriority(tasks, activeCategory);
  const counts = getCategoryCounts(tasks);
  const topTask = sorted[0];
  const rest = sorted.slice(1);

  // Filter bar
  const filterBar = document.getElementById('filterBar');
  if (filterBar) {
    filterBar.innerHTML = renderFilterBar(activeCategory, counts);
  }

  // Hero section
  const heroSection = document.getElementById('heroSection');
  if (heroSection && topTask) {
    heroSection.innerHTML = `
      <div class="hero-section__label">
        ${icon('alert')} Most urgent
      </div>
      ${renderTaskCard(topTask, true)}
    `;
  } else if (heroSection) {
    heroSection.innerHTML = '';
  }

  // Task list
  const taskList = document.getElementById('taskList');
  if (taskList) {
    if (rest.length > 0) {
      taskList.innerHTML = `
        <div class="section-header">
          <span class="section-title">Up next</span>
          <span class="section-count">${rest.length} tasks</span>
        </div>
        ${rest.map(t => renderTaskCard(t, false)).join('')}
      `;
    } else if (sorted.length === 0) {
      taskList.innerHTML = `
        <div class="empty-state">
          ${icon('checkmark')}
          <div class="empty-state__title">All clear!</div>
          <p>No tasks in this category. Enjoy the calm.</p>
        </div>
      `;
    } else {
      taskList.innerHTML = '';
    }
  }
}

/* ---- Feed Render ---- */
function renderFeed(feedItems, tasks) {
  const feed = document.getElementById('feedContent');
  if (!feed) return;

  feed.innerHTML = feedItems.map(item => {
    switch (item.type) {
      case 'divider':
        return `
          <div class="feed__divider">
            <span class="feed__divider-text">${item.text}</span>
          </div>
        `;

      case 'system':
        return `
          <div class="feed__message feed__message--system">
            <div class="feed__message-avatar">
              ${icon('bot')}
            </div>
            <div>
              <div class="feed__message-bubble feed__message-bubble--accent">
                ${item.icon ? icon(item.icon) : ''} ${item.text}
                ${item.subtext ? `<div style="margin-top:8px;white-space:pre-line;opacity:0.85">${item.subtext}</div>` : ''}
              </div>
              <div class="feed__message-time">${item.time}</div>
            </div>
          </div>
        `;

      case 'status':
        const variantClass = item.variant === 'success' ? 'feed__status--success'
                           : item.variant === 'reminder' ? 'feed__status--reminder'
                           : '';
        return `
          <div class="feed__status ${variantClass}">
            ${item.variant === 'success' ? icon('checkmark')
              : item.variant === 'reminder' ? icon('bell')
              : icon('sparkle')}
            <div>
              <div>${item.text}</div>
              ${item.detail ? `<div style="font-size:0.8rem;opacity:0.7;margin-top:2px">${item.detail}</div>` : ''}
            </div>
            <span style="margin-left:auto;font-size:0.75rem;color:var(--color-text-tertiary)">${item.time}</span>
          </div>
        `;

      case 'task':
        const task = tasks.find(t => t.id === item.taskId);
        if (!task) return '';
        return `<div class="feed__message feed__message--task">${renderTaskCard(task, false)}</div>`;

      default:
        return '';
    }
  }).join('');
}

/* ---- Task Detail Render ---- */
function renderTaskDetail(task) {
  if (!task) return;

  const rel = getRelativeDate(task.dueDate);
  const panel = document.getElementById('detailPanel');
  const overlay = document.getElementById('detailOverlay');
  if (!panel) return;

  const sourceIcons = { photo: 'camera', email: 'envelope', text: 'chat', voice: 'microphone' };
  const sourceLabels = { photo: 'Photo scan', email: 'Email forward', text: 'Text message', voice: 'Voice note' };

  panel.querySelector('.detail-panel__content').innerHTML = `
    <div class="detail-panel__title">${task.title}</div>

    <div class="detail-panel__meta-grid">
      <div>
        <div class="detail-panel__meta-label">Priority</div>
        <div class="detail-panel__meta-value">
          <span class="badge badge--${task.priority}">${task.priority}</span>
        </div>
      </div>
      <div>
        <div class="detail-panel__meta-label">Category</div>
        <div class="detail-panel__meta-value">
          <span class="badge badge--${task.category}">${CATEGORIES[task.category].label}</span>
        </div>
      </div>
      <div>
        <div class="detail-panel__meta-label">Due Date</div>
        <div class="detail-panel__meta-value ${rel.class}">${rel.text} — ${formatDate(task.dueDate)}</div>
      </div>
      <div>
        <div class="detail-panel__meta-label">Source</div>
        <div class="detail-panel__meta-value" style="display:flex;align-items:center;gap:8px">
          ${icon(sourceIcons[task.source] || 'chat')} ${sourceLabels[task.source] || task.source}
        </div>
      </div>
      ${task.amount ? `
        <div>
          <div class="detail-panel__meta-label">Amount</div>
          <div class="detail-panel__meta-value amount">${formatCurrency(task.amount)}</div>
        </div>
      ` : ''}
      ${task.status === 'delegated' ? `
        <div>
          <div class="detail-panel__meta-label">Delegated To</div>
          <div class="detail-panel__meta-value">${task.delegatedTo}</div>
        </div>
      ` : ''}
      <div>
        <div class="detail-panel__meta-label">Created</div>
        <div class="detail-panel__meta-value">${formatDate(task.createdAt)}</div>
      </div>
    </div>

    ${task.sourcePreview ? `
      <div class="detail-panel__section">
        <div class="detail-panel__section-title">Source Document</div>
        <div class="detail-panel__source-preview">
          <img src="assets/mock-sources/${task.sourcePreview}.svg" alt="Source document"
               style="max-width:100%;max-height:200px;border-radius:8px"
               onerror="this.parentNode.innerHTML='${icon(sourceIcons[task.source])} <span style=\\'margin-left:8px;color:var(--color-text-tertiary)\\'>Document preview</span>'">
        </div>
      </div>
    ` : ''}

    <div class="detail-panel__section">
      <div class="detail-panel__section-title">Notes</div>
      <div class="detail-panel__notes">${task.notes || 'No notes added.'}</div>
    </div>
  `;

  // Update action buttons
  panel.querySelector('.detail-panel__actions').innerHTML = `
    <button class="btn btn--success" onclick="completeTask(${task.id}); closeTaskDetail();">
      ${icon('checkmark')} Complete
    </button>
    <button class="btn btn--secondary" onclick="toggleSnooze(event, ${task.id})">
      ${icon('clock')} Snooze
    </button>
    <button class="btn btn--secondary" onclick="delegateTask(${task.id}); closeTaskDetail();">
      ${icon('delegate')} Delegate
    </button>
    <button class="btn btn--danger btn--icon" onclick="closeTaskDetail()" title="Close">
      ${icon('close')}
    </button>
  `;

  // Show panel
  panel.classList.add('detail-panel--visible');
  if (overlay) overlay.classList.add('detail-overlay--visible');
  document.body.style.overflow = 'hidden';
}
