/* ==========================================================================
   FocusFlow Sample Data
   Realistic tasks spanning all categories for prototype demonstration
   ========================================================================== */

const CATEGORIES = {
  payments: { label: 'Payments & Bills', icon: 'dollar', color: 'payments' },
  tax:      { label: 'Tax & Compliance', icon: 'calendar', color: 'tax' },
  family:   { label: 'Family & Events', icon: 'sun', color: 'family' },
  house:    { label: 'House & Maintenance', icon: 'filter', color: 'house' },
  work:     { label: 'Work Tasks', icon: 'chat', color: 'work' }
};

const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

const TASKS = [
  {
    id: 1,
    title: "Pay Electricity Bill",
    category: "payments",
    priority: "critical",
    dueDate: "2026-04-10",
    amount: 247.50,
    source: "photo",
    sourcePreview: "invoice-sample",
    status: "active",
    createdAt: "2026-04-08",
    notes: "AGL quarterly bill. Account #4421-8892. Pay via BPAY before cutoff."
  },
  {
    id: 2,
    title: "Submit BAS Statement",
    category: "tax",
    priority: "high",
    dueDate: "2026-04-15",
    amount: null,
    source: "email",
    sourcePreview: "email-preview",
    status: "active",
    createdAt: "2026-04-05",
    notes: "Q1 2026 Business Activity Statement. Login to ATO portal, review GST figures with Sarah."
  },
  {
    id: 3,
    title: "Book Restaurant for Mum's Birthday",
    category: "family",
    priority: "high",
    dueDate: "2026-04-18",
    amount: null,
    source: "text",
    sourcePreview: null,
    status: "active",
    createdAt: "2026-04-07",
    notes: "She likes Italian. 8 people. Check Lygon St options. Need to confirm by the 14th."
  },
  {
    id: 4,
    title: "Call Plumber — Kitchen Leak",
    category: "house",
    priority: "high",
    dueDate: "2026-04-11",
    amount: null,
    source: "voice",
    sourcePreview: null,
    status: "active",
    createdAt: "2026-04-09",
    notes: "Slow drip under kitchen sink. Getting worse. Try Mike's Plumbing — 0412 555 678."
  },
  {
    id: 5,
    title: "Prepare Q1 Client Presentation",
    category: "work",
    priority: "medium",
    dueDate: "2026-04-14",
    amount: null,
    source: "email",
    sourcePreview: "email-preview",
    status: "active",
    createdAt: "2026-04-03",
    notes: "For Acme Corp quarterly review. Slides + talking points. Pull data from analytics dashboard."
  },
  {
    id: 6,
    title: "Renew Car Insurance",
    category: "payments",
    priority: "medium",
    dueDate: "2026-04-22",
    amount: 1850.00,
    source: "email",
    sourcePreview: "email-preview",
    status: "active",
    createdAt: "2026-04-01",
    notes: "AAMI policy renewal. Compare with Budget Direct before renewing. Policy #PV-9928341."
  },
  {
    id: 7,
    title: "Fix Backyard Gate Latch",
    category: "house",
    priority: "low",
    dueDate: "2026-04-30",
    amount: null,
    source: "text",
    sourcePreview: null,
    status: "active",
    createdAt: "2026-04-06",
    notes: "Gate doesn't close properly. Bunnings for replacement latch. Model: D-type galvanised."
  },
  {
    id: 8,
    title: "Follow Up on Tax Refund",
    category: "tax",
    priority: "medium",
    dueDate: "2026-04-20",
    amount: 3200.00,
    source: "text",
    sourcePreview: null,
    status: "delegated",
    delegatedTo: "Accountant (Sarah)",
    createdAt: "2026-03-25",
    notes: "Lodged 3 weeks ago. ATO portal shows 'processing'. Sarah to chase if no update by the 20th."
  },
  {
    id: 9,
    title: "Organise Lucy's Soccer Registration",
    category: "family",
    priority: "medium",
    dueDate: "2026-04-25",
    amount: 180.00,
    source: "photo",
    sourcePreview: "letter-sample",
    status: "active",
    createdAt: "2026-04-04",
    notes: "Winter season registration. Need birth certificate copy and medical clearance form."
  },
  {
    id: 10,
    title: "Review & Sign Contractor Agreement",
    category: "work",
    priority: "high",
    dueDate: "2026-04-12",
    amount: null,
    source: "email",
    sourcePreview: "email-preview",
    status: "active",
    createdAt: "2026-04-08",
    notes: "New freelance designer contract. Check IP clause and payment terms before signing."
  }
];

/* ---- Feed Data ---- */
const FEED_ITEMS = [
  {
    type: 'divider',
    text: 'Today'
  },
  {
    type: 'system',
    text: 'Good morning! Here are your top 3 priorities today:',
    subtext: '1. Pay Electricity Bill (due tomorrow, $247.50)\n2. Call Plumber — Kitchen Leak (due Fri)\n3. Review & Sign Contractor Agreement (due Sun)',
    time: '8:00 AM',
    icon: 'sun'
  },
  {
    type: 'status',
    text: 'New task created from photo',
    detail: 'Pay Electricity Bill — $247.50 due Apr 10',
    time: '9:15 AM',
    variant: 'default'
  },
  {
    type: 'task',
    taskId: 1
  },
  {
    type: 'status',
    text: 'Reminder: Contractor agreement needs review',
    detail: 'Due in 3 days — Review & Sign Contractor Agreement',
    time: '10:00 AM',
    variant: 'reminder'
  },
  {
    type: 'task',
    taskId: 10
  },
  {
    type: 'divider',
    text: 'Yesterday'
  },
  {
    type: 'status',
    text: 'Task delegated to Accountant (Sarah)',
    detail: 'Follow Up on Tax Refund — $3,200',
    time: '3:30 PM',
    variant: 'default'
  },
  {
    type: 'system',
    text: 'Voice note transcribed and task created:',
    subtext: '"Call Plumber — Kitchen Leak" — due Apr 11',
    time: '6:45 PM',
    icon: 'microphone'
  },
  {
    type: 'status',
    text: 'Grocery shopping marked as complete',
    detail: '',
    time: '11:20 AM',
    variant: 'success'
  },
  {
    type: 'divider',
    text: 'Monday, Apr 7'
  },
  {
    type: 'system',
    text: 'Weekly summary: You completed 5 tasks last week. 3 are overdue.',
    subtext: '',
    time: '8:00 AM',
    icon: 'sparkle'
  },
  {
    type: 'status',
    text: 'Email forwarded — new task created',
    detail: 'Submit BAS Statement — due Apr 15',
    time: '2:15 PM',
    variant: 'default'
  }
];

/* ---- Telegram Chat Data ---- */
const TELEGRAM_MESSAGES = [
  {
    type: 'bot',
    text: "Good morning! ☀️ Here's your day:\n\n🔴 <b>Pay Electricity Bill</b> — $247.50 due tomorrow\n🟡 <b>Call Plumber</b> — Kitchen leak, due Fri\n🟡 <b>Review Contractor Agreement</b> — due Sun\n\n3 tasks need your attention today.",
    time: '8:00 AM'
  },
  {
    type: 'user',
    image: true,
    imageType: 'invoice',
    text: '',
    time: '9:14 AM'
  },
  {
    type: 'bot',
    text: "📄 Got it! I scanned your document:\n\n<b>Pay Electricity Bill</b>\n💰 Amount: $247.50\n📅 Due: April 10, 2026\n🏷️ Category: Payments & Bills\n🔴 Priority: Critical\n\nTask created! You can view it on your dashboard.",
    time: '9:15 AM'
  },
  {
    type: 'user',
    text: 'Book a restaurant for mums birthday on the 18th. She likes Italian. About 8 people.',
    time: '10:30 AM'
  },
  {
    type: 'bot',
    text: "🎂 Got it!\n\n<b>Book Restaurant for Mum's Birthday</b>\n📅 Due: April 18, 2026\n👥 8 people, Italian cuisine\n🏷️ Category: Family & Events\n🟡 Priority: High\n\nTask created! I'll remind you a few days before.",
    time: '10:30 AM'
  },
  {
    type: 'user',
    voice: true,
    duration: '0:08',
    time: '6:44 PM'
  },
  {
    type: 'bot',
    text: "🎙️ Transcribed: <i>\"The kitchen sink is leaking again, need to call a plumber before it gets worse\"</i>\n\n<b>Call Plumber — Kitchen Leak</b>\n📅 Due: April 11, 2026\n🏷️ Category: House & Maintenance\n🟡 Priority: High\n\nTask created!",
    time: '6:45 PM'
  },
  {
    type: 'user',
    text: 'What should I do now?',
    time: '7:00 PM'
  },
  {
    type: 'bot',
    text: "✨ Based on your priorities and deadlines:\n\n<b>Pay Electricity Bill</b>\n\nThis is your most urgent task — the bill is due tomorrow and the amount is $247.50. I'd suggest taking care of this first via BPAY.\n\nWant me to set a reminder for tonight?",
    time: '7:00 PM'
  }
];

/* ---- Helper Functions ---- */
function getRelativeDate(dateStr) {
  const today = new Date('2026-04-09');
  const date = new Date(dateStr);
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, class: 'due-date--overdue' };
  if (diffDays === 0) return { text: 'Today', class: 'due-date--today' };
  if (diffDays === 1) return { text: 'Tomorrow', class: 'due-date--tomorrow' };
  if (diffDays <= 7) return { text: `In ${diffDays} days`, class: '' };
  return { text: formatDate(dateStr), class: '' };
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
}

function formatCurrency(amount) {
  if (!amount) return '';
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);
}

function getSourceIcon(source) {
  const icons = {
    photo: 'camera',
    email: 'envelope',
    text: 'chat',
    voice: 'microphone'
  };
  return icons[source] || 'chat';
}

function getTasksByPriority(tasks, category) {
  let filtered = tasks.filter(t => t.status !== 'completed');
  if (category && category !== 'all') {
    filtered = filtered.filter(t => t.category === category);
  }
  return filtered.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
}

function getTopTask(tasks) {
  const active = tasks.filter(t => t.status === 'active');
  return active.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])[0];
}

function getCategoryCounts(tasks) {
  const counts = { all: 0, payments: 0, tax: 0, family: 0, house: 0, work: 0 };
  tasks.filter(t => t.status !== 'completed').forEach(t => {
    counts.all++;
    if (counts[t.category] !== undefined) counts[t.category]++;
  });
  return counts;
}
