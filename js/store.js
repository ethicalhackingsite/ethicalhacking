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
        content: `
<p>If you want to open a handle to another process — whether for memory reading, DLL injection, or anything else — the very first thing you need is that process's <strong>Process ID (PID)</strong>. Windows doesn't give it to you for free; you have to enumerate every running process and find the one that matches your target.</p>
<p>This tutorial covers a clean, reusable <code>GetProcessId</code> function built entirely on the Win32 <strong>Toolhelp32 API</strong>. We'll walk through every line so you understand exactly what's happening and why.</p>

<h2>Prerequisites</h2>
<p>Before you start, make sure you have:</p>
<ul class="steps">
  <li>Visual Studio (any recent version) or any C++ compiler targeting Windows</li>
  <li>Basic familiarity with C++ and Windows handles</li>
  <li><code>#include &lt;windows.h&gt;</code> and <code>#include &lt;tlhelp32.h&gt;</code> in your project</li>
</ul>

<h2>The Complete Function</h2>
<p>Here's the full function we'll be dissecting:</p>

<div class="codeblock">
  <div class="codeblock-header">
    <span class="codeblock-lang">C++</span>
    <div class="codeblock-dots"><span></span><span></span><span></span></div>
  </div>
  <pre><span class="ty">DWORD</span> <span class="fn">GetProcessId</span>(<span class="kw">const</span> <span class="ty">char</span><span class="op">*</span> <span class="va">ProcessName</span>)
{
    <span class="ty">DWORD</span> <span class="va">ProcessId</span> <span class="op">=</span> <span class="num">0</span>;
    <span class="ty">HANDLE</span> <span class="va">SnapshotHandle</span> <span class="op">=</span> <span class="fn">CreateToolhelp32Snapshot</span>(<span class="cn">TH32CS_SNAPPROCESS</span>, <span class="num">0</span>);

    <span class="kw">if</span> (<span class="va">SnapshotHandle</span> <span class="op">!=</span> <span class="cn">INVALID_HANDLE_VALUE</span>)
    {
        <span class="ty">PROCESSENTRY32</span> <span class="va">ProcessEntry</span>;
        <span class="va">ProcessEntry</span>.dwSize <span class="op">=</span> <span class="kw">sizeof</span>(<span class="ty">PROCESSENTRY32</span>);

        <span class="kw">if</span> (<span class="fn">Process32First</span>(<span class="va">SnapshotHandle</span>, <span class="op">&amp;</span><span class="va">ProcessEntry</span>))
        {
            <span class="kw">do</span> {
                <span class="kw">if</span> (<span class="fn">_stricmp</span>(<span class="va">ProcessEntry</span>.szExeFile, <span class="va">ProcessName</span>) <span class="op">==</span> <span class="num">0</span>)
                {
                    <span class="va">ProcessId</span> <span class="op">=</span> <span class="va">ProcessEntry</span>.th32ProcessID;
                    <span class="kw">break</span>;
                }
            } <span class="kw">while</span> (<span class="fn">Process32Next</span>(<span class="va">SnapshotHandle</span>, <span class="op">&amp;</span><span class="va">ProcessEntry</span>));
        }
        <span class="fn">CloseHandle</span>(<span class="va">SnapshotHandle</span>);
    }
    <span class="kw">return</span> <span class="va">ProcessId</span>;
}</pre>
</div>

<h2>Step-by-Step Breakdown</h2>

<h3>1. Taking the Snapshot</h3>
<p>The function starts by calling <code>CreateToolhelp32Snapshot</code>. Think of this as taking a <em>frozen photograph</em> of the system at a point in time. We pass <code>TH32CS_SNAPPROCESS</code> to tell Windows we only care about processes (not threads, heaps, or modules), and <code>0</code> as the second argument since we want system-wide results rather than a specific process.</p>

<div class="codeblock">
  <div class="codeblock-header"><span class="codeblock-lang">C++</span><div class="codeblock-dots"><span></span><span></span><span></span></div></div>
  <pre><span class="ty">HANDLE</span> <span class="va">SnapshotHandle</span> <span class="op">=</span> <span class="fn">CreateToolhelp32Snapshot</span>(<span class="cn">TH32CS_SNAPPROCESS</span>, <span class="num">0</span>);</pre>
</div>

<p>The function returns a <code>HANDLE</code>. If something goes wrong — for example, if the system is out of resources — it returns <code>INVALID_HANDLE_VALUE</code> instead. That's exactly what the outer <code>if</code> check guards against.</p>

<div class="callout note">
  <span class="callout-icon">ℹ</span>
  <div class="callout-body">
    <div class="callout-title">Why a snapshot?</div>
    <div class="callout-text">The process list is volatile — processes can start and die in milliseconds. A snapshot gives you a consistent view so your enumeration doesn't race against system changes.</div>
  </div>
</div>

<h3>2. Setting Up PROCESSENTRY32</h3>
<p><code>PROCESSENTRY32</code> is the structure Windows populates with information about each process. The <strong>critical</strong> step here is manually setting <code>dwSize</code> to <code>sizeof(PROCESSENTRY32)</code> before passing it to any API call. Windows uses this field to know which version of the structure you're expecting — skip it and <code>Process32First</code> will fail immediately.</p>

<div class="codeblock">
  <div class="codeblock-header"><span class="codeblock-lang">C++</span><div class="codeblock-dots"><span></span><span></span><span></span></div></div>
  <pre><span class="ty">PROCESSENTRY32</span> <span class="va">ProcessEntry</span>;
<span class="va">ProcessEntry</span>.dwSize <span class="op">=</span> <span class="kw">sizeof</span>(<span class="ty">PROCESSENTRY32</span>);</pre>
</div>

<div class="callout warn">
  <span class="callout-icon">⚠</span>
  <div class="callout-body">
    <div class="callout-title">Common Mistake</div>
    <div class="callout-text">Forgetting to set <code>dwSize</code> is one of the most frequent Win32 bugs for beginners. Always initialize it before your first <code>Process32First</code> call.</div>
  </div>
</div>

<h3>3. Iterating the Process List</h3>
<p>The pattern here is idiomatic Win32 enumeration: call <code>Process32First</code> to seed the first entry, then loop with <code>Process32Next</code> until it returns <code>FALSE</code>. Each iteration fills <code>ProcessEntry</code> with data about one process.</p>

<div class="codeblock">
  <div class="codeblock-header"><span class="codeblock-lang">C++</span><div class="codeblock-dots"><span></span><span></span><span></span></div></div>
  <pre><span class="kw">if</span> (<span class="fn">Process32First</span>(<span class="va">SnapshotHandle</span>, <span class="op">&amp;</span><span class="va">ProcessEntry</span>))
{
    <span class="kw">do</span> {
        <span class="cm">// check each process here</span>
    } <span class="kw">while</span> (<span class="fn">Process32Next</span>(<span class="va">SnapshotHandle</span>, <span class="op">&amp;</span><span class="va">ProcessEntry</span>));
}</pre>
</div>

<p>The <code>do-while</code> construct is used (rather than a plain <code>while</code>) because we already have a valid first entry from <code>Process32First</code> — we want to inspect it before asking for the next one.</p>

<h3>4. Comparing the Process Name</h3>
<p>Inside the loop, we compare <code>ProcessEntry.szExeFile</code> (the executable filename, e.g. <code>"notepad.exe"</code>) against our target using <code>_stricmp</code>. The "i" stands for <em>case-insensitive</em>, so <code>"Notepad.EXE"</code> and <code>"notepad.exe"</code> both match. When we find it, we grab the PID and break out immediately.</p>

<div class="codeblock">
  <div class="codeblock-header"><span class="codeblock-lang">C++</span><div class="codeblock-dots"><span></span><span></span><span></span></div></div>
  <pre><span class="kw">if</span> (<span class="fn">_stricmp</span>(<span class="va">ProcessEntry</span>.szExeFile, <span class="va">ProcessName</span>) <span class="op">==</span> <span class="num">0</span>)
{
    <span class="va">ProcessId</span> <span class="op">=</span> <span class="va">ProcessEntry</span>.th32ProcessID;
    <span class="kw">break</span>;
}</pre>
</div>

<div class="callout tip">
  <span class="callout-icon">✓</span>
  <div class="callout-body">
    <div class="callout-title">Pro Tip</div>
    <div class="callout-text">Using <code>_stricmp</code> is a small but important detail. Game process names are often inconsistent in capitalisation across different versions and launchers.</div>
  </div>
</div>

<h3>5. Closing the Handle</h3>
<p>After the loop — whether we found the process or not — we call <code>CloseHandle</code> on the snapshot. Snapshots consume kernel memory, and failing to close them is a <strong>handle leak</strong>. Always clean up, even on early exits.</p>

<h2>Key Structures &amp; Functions</h2>

<table class="gh-table">
  <thead><tr><th>Name</th><th>Type</th><th>Purpose</th></tr></thead>
  <tbody>
    <tr><td><code>CreateToolhelp32Snapshot</code></td><td>Function</td><td>Creates a read-only snapshot of the process list</td></tr>
    <tr><td><code>PROCESSENTRY32</code></td><td>Structure</td><td>Holds info about a single process (name, PID, parent PID, thread count)</td></tr>
    <tr><td><code>Process32First</code></td><td>Function</td><td>Retrieves the first process entry from the snapshot</td></tr>
    <tr><td><code>Process32Next</code></td><td>Function</td><td>Advances to the next process entry in the snapshot</td></tr>
    <tr><td><code>szExeFile</code></td><td>Field</td><td>Null-terminated string of the executable filename (e.g. <code>game.exe</code>)</td></tr>
    <tr><td><code>th32ProcessID</code></td><td>Field</td><td>The process ID (PID) — what we're after</td></tr>
    <tr><td><code>CloseHandle</code></td><td>Function</td><td>Releases the snapshot handle, freeing kernel resources</td></tr>
  </tbody>
</table>

<h2>How to Use It</h2>
<p>Calling the function is simple. Pass the exact executable name (with extension) and check the return value. A return of <code>0</code> means the process wasn't found.</p>

<div class="codeblock">
  <div class="codeblock-header"><span class="codeblock-lang">C++</span><div class="codeblock-dots"><span></span><span></span><span></span></div></div>
  <pre><span class="ty">int</span> <span class="fn">main</span>()
{
    <span class="ty">DWORD</span> <span class="va">pid</span> <span class="op">=</span> <span class="fn">GetProcessId</span>(<span class="str">"notepad.exe"</span>);

    <span class="kw">if</span> (<span class="va">pid</span> <span class="op">==</span> <span class="num">0</span>)
    {
        <span class="fn">printf</span>(<span class="str">"[!] Process not found.\\n"</span>);
        <span class="kw">return</span> <span class="num">1</span>;
    }

    <span class="fn">printf</span>(<span class="str">"[+] Found PID: %lu\\n"</span>, <span class="va">pid</span>);

    <span class="cm">// Now open a handle to the process:</span>
    <span class="ty">HANDLE</span> <span class="va">hProcess</span> <span class="op">=</span> <span class="fn">OpenProcess</span>(<span class="cn">PROCESS_ALL_ACCESS</span>, <span class="cn">FALSE</span>, <span class="va">pid</span>);

    <span class="cm">// ... do your work here ...</span>

    <span class="fn">CloseHandle</span>(<span class="va">hProcess</span>);
    <span class="kw">return</span> <span class="num">0</span>;
}</pre>
</div>

<h2>What's Next?</h2>
<p>Now that you have the PID, the next step is calling <code>OpenProcess</code> to get a handle with the access rights you need. From there the typical external cheat workflow looks like this:</p>
<ul class="steps">
  <li>Use <code>GetProcessId</code> to find the target PID</li>
  <li>Call <code>OpenProcess</code> with <code>PROCESS_VM_READ</code> or <code>PROCESS_ALL_ACCESS</code></li>
  <li>Use <code>ReadProcessMemory</code> / <code>WriteProcessMemory</code> to access game memory</li>
  <li>Always <code>CloseHandle</code> when you're done</li>
</ul>

<div class="callout warn">
  <span class="callout-icon">⚠</span>
  <div class="callout-body">
    <div class="callout-title">Required Headers</div>
    <div class="callout-text">You need both <code>#include &lt;windows.h&gt;</code> and <code>#include &lt;tlhelp32.h&gt;</code> at the top of your file, or you'll get compiler errors about missing types and functions.</div>
  </div>
</div>
`,
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
