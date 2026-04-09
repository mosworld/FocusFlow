/* ==========================================================================
   FocusFlow Interactions
   Click handlers, task actions, snooze, delegate, undo
   ========================================================================== */

let currentCategory = 'all';
let completedTaskBackup = null;
let toastTimeout = null;

/* ---- Filter by Category ---- */
function filterByCategory(category) {
  currentCategory = category;
  renderDashboard(TASKS, currentCategory);
}

/* ---- Complete Task ---- */
function completeTask(taskId) {
  const task = TASKS.find(t => t.id === taskId);
  if (!task) return;

  // Animate card out
  const card = document.querySelector(`[data-task-id="${taskId}"]`);
  if (card) {
    card.classList.add('task-card--completing');
  }

  // Backup for undo
  completedTaskBackup = { ...task };
  task.status = 'completed';

  // Show toast
  showToast(`"${task.title}" completed`, taskId);

  // Re-render after animation
  setTimeout(() => {
    renderDashboard(TASKS, currentCategory);
  }, 500);
}

/* ---- Undo Complete ---- */
function undoComplete(taskId) {
  if (!completedTaskBackup) return;

  const task = TASKS.find(t => t.id === taskId);
  if (task) {
    task.status = completedTaskBackup.status;
  }

  completedTaskBackup = null;
  hideToast();
  renderDashboard(TASKS, currentCategory);
}

/* ---- Toast ---- */
function showToast(message, taskId) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  clearTimeout(toastTimeout);

  toast.querySelector('.toast__message').textContent = message;
  toast.querySelector('.toast__undo').onclick = () => undoComplete(taskId);

  // Progress bar
  const progress = toast.querySelector('.toast__progress');
  progress.style.width = '100%';

  toast.classList.add('toast--visible');

  // Animate progress
  requestAnimationFrame(() => {
    progress.style.transition = 'width 5s linear';
    progress.style.width = '0%';
  });

  toastTimeout = setTimeout(() => {
    hideToast();
    completedTaskBackup = null;
  }, 5000);
}

function hideToast() {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.classList.remove('toast--visible');
  clearTimeout(toastTimeout);

  const progress = toast.querySelector('.toast__progress');
  progress.style.transition = 'none';
  progress.style.width = '100%';
}

/* ---- Snooze ---- */
function toggleSnooze(event, taskId) {
  event.stopPropagation();

  // Remove any existing snooze menus
  document.querySelectorAll('.snooze-menu--visible').forEach(m => {
    m.classList.remove('snooze-menu--visible');
  });

  const btn = event.currentTarget;
  let menu = btn.parentElement.querySelector('.snooze-menu');

  if (!menu) {
    menu = document.createElement('div');
    menu.className = 'snooze-menu';
    menu.innerHTML = `
      <button class="snooze-menu__item" onclick="snoozeTask(${taskId}, 1); event.stopPropagation();">Tomorrow</button>
      <button class="snooze-menu__item" onclick="snoozeTask(${taskId}, 3); event.stopPropagation();">In 3 days</button>
      <button class="snooze-menu__item" onclick="snoozeTask(${taskId}, 7); event.stopPropagation();">Next week</button>
      <button class="snooze-menu__item" onclick="snoozeTask(${taskId}, 14); event.stopPropagation();">In 2 weeks</button>
    `;
    btn.parentElement.style.position = 'relative';
    btn.parentElement.appendChild(menu);
  }

  requestAnimationFrame(() => {
    menu.classList.toggle('snooze-menu--visible');
  });

  // Close on outside click
  const closeMenu = (e) => {
    if (!menu.contains(e.target) && e.target !== btn) {
      menu.classList.remove('snooze-menu--visible');
      document.removeEventListener('click', closeMenu);
    }
  };
  setTimeout(() => document.addEventListener('click', closeMenu), 10);
}

function snoozeTask(taskId, days) {
  const task = TASKS.find(t => t.id === taskId);
  if (!task) return;

  const newDate = new Date('2026-04-09');
  newDate.setDate(newDate.getDate() + days);
  task.dueDate = newDate.toISOString().split('T')[0];

  // Recalculate priority
  if (days > 7) task.priority = 'low';
  else if (days > 3) task.priority = 'medium';

  showToast(`"${task.title}" snoozed for ${days} day${days > 1 ? 's' : ''}`, null);
  closeTaskDetail();
  renderDashboard(TASKS, currentCategory);

  // Hide snooze menus
  document.querySelectorAll('.snooze-menu--visible').forEach(m => {
    m.classList.remove('snooze-menu--visible');
  });
}

/* ---- Delegate ---- */
function delegateTask(taskId) {
  const task = TASKS.find(t => t.id === taskId);
  if (!task) return;

  task.status = 'delegated';
  task.delegatedTo = 'Assigned contact';
  showToast(`"${task.title}" marked as delegated`, null);
  renderDashboard(TASKS, currentCategory);
}

/* ---- Task Detail ---- */
function openTaskDetail(taskId) {
  const task = TASKS.find(t => t.id === taskId);
  if (!task) return;
  renderTaskDetail(task);
}

function closeTaskDetail() {
  const panel = document.getElementById('detailPanel');
  const overlay = document.getElementById('detailOverlay');
  if (panel) panel.classList.remove('detail-panel--visible');
  if (overlay) overlay.classList.remove('detail-overlay--visible');
  document.body.style.overflow = '';
}

/* ---- Keyboard Support ---- */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeTaskDetail();
    hideToast();
  }
});
