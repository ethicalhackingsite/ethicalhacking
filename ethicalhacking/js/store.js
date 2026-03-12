/**
 * EthicalHacking — Data Store
 * All site data lives in localStorage under the key "eh_data".
 * Shape: { modules: [...], articles: [...], settings: {...} }
 */

const EH = (() => {

  const KEY = 'eh_data';

  /* ── Default seed data ── */
  const DEFAULTS = {
    settings: {
      siteTitle: 'EthicalHacking',
      siteSubtitle: 'Complete Game Hacking Course',
      heroText: 'From Win32 fundamentals to writing your own internal cheats — step by step.',
      adminHash: btoa('admin:changeme2025'), // base64 of "admin:changeme2025"
    },
    modules: [
      { id: 'mod-1', order: 1, title: 'C++ & Windows Fundamentals', description: 'Essential C++ and Win32 knowledge before touching any game memory.' },
      { id: 'mod-2', order: 2, title: 'External Memory Hacking',     description: 'Reading and writing game memory from an external process.' },
      { id: 'mod-3', order: 3, title: 'DLL Injection',               description: 'Injecting your own code into a running game process.' },
      { id: 'mod-4', order: 4, title: 'Internal Hacks',              description: 'Writing cheats that run inside the game\'s own process space.' },
      { id: 'mod-5', order: 5, title: 'Reverse Engineering',         description: 'Using a debugger to analyze game code and find functions.' },
      { id: 'mod-6', order: 6, title: 'Hooking & Code Injection',    description: 'Intercepting and redirecting game functions at runtime.' },
      { id: 'mod-7', order: 7, title: 'Anti-Cheat Research',         description: 'Understanding how anti-cheat systems work.' },
      { id: 'mod-8', order: 8, title: 'Capstone Projects',           description: 'Full end-to-end projects that tie everything together.' },
    ],
    articles: [
      {
        id: 'art-1',
        moduleId: 'mod-1',
        order: 1,
        title: 'Setting Up Your Dev Environment (VS2022)',
        slug: 'setup-dev-environment',
        difficulty: 'beginner',
        tags: ['c++'],
        duration: 8,
        published: true,
        content: `<p>Before you write a single line of game hacking code, you need a proper development environment. This tutorial walks you through installing Visual Studio 2022 and configuring it for Win32 C++ development.</p>
<h2>What You Need</h2>
<p>Download <strong>Visual Studio 2022 Community</strong> (free) from <a href="https://visualstudio.microsoft.com/" target="_blank">visualstudio.microsoft.com</a>. During installation, select the <strong>"Desktop development with C++"</strong> workload — this installs the MSVC compiler, Windows SDK, and all the headers you need.</p>
<h2>Creating Your First Project</h2>
<p>Open Visual Studio, click <em>Create a new project</em>, and choose <strong>Console App (C++)</strong>. Make sure the platform is set to <em>x64</em> — modern games are 64-bit and you need to match their architecture.</p>
<h2>Key Settings</h2>
<p>In your project properties, set <strong>Character Set</strong> to <em>Use Multi-Byte Character Set</em> — this avoids issues with the Win32 TCHAR types. For debug builds, leave runtime checks on. For release, switch to <em>Release / x64</em> before shipping any DLLs.</p>`,
        createdAt: new Date('2025-01-01').toISOString(),
      },
      {
        id: 'art-2',
        moduleId: 'mod-1',
        order: 2,
        title: 'GetProcessId — Finding a Process by Name',
        slug: 'get-process-id',
        difficulty: 'beginner',
        tags: ['c++', 'win32'],
        duration: 5,
        published: true,
        content: `<p>If you want to open a handle to another process — whether for memory reading, DLL injection, or anything else — the very first thing you need is that process's <strong>Process ID (PID)</strong>.</p>
<h2>The Complete Function</h2>
<pre><code>DWORD GetProcessId(const char* ProcessName)
{
    DWORD ProcessId = 0;
    HANDLE SnapshotHandle = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    if (SnapshotHandle != INVALID_HANDLE_VALUE)
    {
        PROCESSENTRY32 ProcessEntry;
        ProcessEntry.dwSize = sizeof(PROCESSENTRY32);
        if (Process32First(SnapshotHandle, &amp;ProcessEntry))
        {
            do {
                if (_stricmp(ProcessEntry.szExeFile, ProcessName) == 0)
                {
                    ProcessId = ProcessEntry.th32ProcessID;
                    break;
                }
            } while (Process32Next(SnapshotHandle, &amp;ProcessEntry));
        }
        CloseHandle(SnapshotHandle);
    }
    return ProcessId;
}</code></pre>
<h2>How it Works</h2>
<p>We call <code>CreateToolhelp32Snapshot</code> to get a frozen snapshot of all running processes. We then iterate with <code>Process32First</code> / <code>Process32Next</code>, comparing each process name with <code>_stricmp</code> (case-insensitive). When we find our target, we grab its PID and break out. Always <code>CloseHandle</code> when done.</p>`,
        createdAt: new Date('2025-01-02').toISOString(),
      },
    ],
  };

  /* ── Load / Save ── */
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULTS));
      const data = JSON.parse(raw);
      // merge in any missing defaults
      if (!data.settings) data.settings = DEFAULTS.settings;
      if (!data.modules)  data.modules  = DEFAULTS.modules;
      if (!data.articles) data.articles = DEFAULTS.articles;
      return data;
    } catch {
      return JSON.parse(JSON.stringify(DEFAULTS));
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  /* ── Auth ── */
  function checkAuth() {
    const session = sessionStorage.getItem('eh_admin');
    return session === 'ok';
  }

  function login(password) {
    const data = load();
    const expected = atob(data.settings.adminHash).split(':')[1];
    if (password === expected) {
      sessionStorage.setItem('eh_admin', 'ok');
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem('eh_admin');
  }

  /* ── Modules ── */
  function getModules() {
    return load().modules.sort((a, b) => a.order - b.order);
  }

  function saveModule(mod) {
    const data = load();
    const idx = data.modules.findIndex(m => m.id === mod.id);
    if (idx >= 0) data.modules[idx] = mod;
    else data.modules.push(mod);
    save(data);
  }

  function deleteModule(id) {
    const data = load();
    data.modules  = data.modules.filter(m => m.id !== id);
    data.articles = data.articles.filter(a => a.moduleId !== id);
    save(data);
  }

  function newModuleId() {
    return 'mod-' + Date.now();
  }

  /* ── Articles ── */
  function getArticles(opts = {}) {
    let arts = load().articles;
    if (opts.moduleId)   arts = arts.filter(a => a.moduleId === opts.moduleId);
    if (opts.published)  arts = arts.filter(a => a.published);
    if (opts.slug)       arts = arts.find(a => a.slug === opts.slug) || null;
    return opts.slug ? arts : arts.sort((a, b) => a.order - b.order);
  }

  function getArticleById(id) {
    return load().articles.find(a => a.id === id) || null;
  }

  function saveArticle(art) {
    const data = load();
    const idx = data.articles.findIndex(a => a.id === art.id);
    if (idx >= 0) data.articles[idx] = art;
    else data.articles.push(art);
    save(data);
  }

  function deleteArticle(id) {
    const data = load();
    data.articles = data.articles.filter(a => a.id !== id);
    save(data);
  }

  function newArticleId() {
    return 'art-' + Date.now();
  }

  /* ── Settings ── */
  function getSettings() {
    return load().settings;
  }

  function saveSettings(settings) {
    const data = load();
    data.settings = { ...data.settings, ...settings };
    save(data);
  }

  /* ── Progress (per-browser visitor) ── */
  const PROG_KEY = 'eh_progress';

  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(PROG_KEY)) || {};
    } catch { return {}; }
  }

  function markComplete(articleId) {
    const prog = getProgress();
    prog[articleId] = true;
    localStorage.setItem(PROG_KEY, JSON.stringify(prog));
  }

  function isComplete(articleId) {
    return !!getProgress()[articleId];
  }

  function resetProgress() {
    localStorage.removeItem(PROG_KEY);
  }

  /* ── Slugify helper ── */
  function slugify(str) {
    return str.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /* ── Export / Import ── */
  function exportData() {
    return JSON.stringify(load(), null, 2);
  }

  function importData(json) {
    try {
      const data = JSON.parse(json);
      save(data);
      return true;
    } catch { return false; }
  }

  return {
    checkAuth, login, logout,
    getModules, saveModule, deleteModule, newModuleId,
    getArticles, getArticleById, saveArticle, deleteArticle, newArticleId,
    getSettings, saveSettings,
    getProgress, markComplete, isComplete, resetProgress,
    slugify, exportData, importData,
  };
})();

/* ── Toast utility ── */
function showToast(msg, type = 'success') {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = type === 'error' ? 'error' : '';
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3000);
}
