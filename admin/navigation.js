/**
 * NexaCRM Admin Navigation Manager
 * Handles dynamic sidebar/topbar injection and UI state
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Determine relative path depth
    const path = window.location.pathname;
    const isSubDir = path.includes('/master/') || path.includes('/settings/');
    const relPath = isSubDir ? '../' : '';

    // 2. Define Sidebar Content
    const sidebarHTML = `
        <nav class="sidebar" id="sidebar">
            <div class="sidebar-logo">
                <div class="logo-icon">N</div>
                <div>
                    <div class="logo-text">NexaCRM</div>
                    <div class="logo-sub">Administrator</div>
                </div>
            </div>
            <div class="sidebar-nav">
                <div class="sidebar-section-label">Main</div>
                <a href="${relPath}index.html" class="nav-item" data-page="index.html">
                    <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                    <span class="nav-label">Dashboard</span>
                </a>
                <a href="${relPath}users.html" class="nav-item" data-page="users.html">
                    <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                    <span class="nav-label">Manajemen Pengguna</span>
                </a>
                <a href="${relPath}master-data.html" class="nav-item" data-page="master-data.html">
                    <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    <span class="nav-label">Master Data</span>
                </a>
                <a href="${relPath}audit-log.html" class="nav-item" data-page="audit-log.html">
                    <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span class="nav-label">Audit Log</span>
                </a>
                <a href="${relPath}announcements.html" class="nav-item" data-page="announcements.html">
                    <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
                    <span class="nav-label">Pengumuman</span>
                </a>

                <div class="sidebar-section-label" style="margin-top:16px">Config</div>
                <a href="${relPath}settings/general.html" class="nav-item" data-page="general.html">
                    <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3" stroke-width="2"/></svg>
                    <span class="nav-label">Settings</span>
                </a>
                
                <div class="sidebar-section-label" style="margin-top:16px">System</div>
                <a href="${relPath}../director/index.html" class="nav-item">
                    <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                    <span class="nav-label">Role Switcher</span>
                </a>
            </div>
        </nav>
    `;

    // 3. Define Topbar Content
    const topbarHTML = `
        <header class="topbar" id="topbar">
            <button class="toggle-btn" id="sidebar-toggle">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#64748B"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <div class="breadcrumb" id="breadcrumb-container">
                <span>Admin Central</span>
            </div>
            <div class="search-container" style="flex:1; max-width:400px; position:relative; margin-left: 16px;">
                <svg style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-muted);" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input type="text" id="global-search" placeholder="Cari data, log, atau pengguna..." style="width:100%; background:#F1F5F9; border:1px solid transparent; padding:10px 16px 10px 40px; border-radius:12px; font-size:13px; outline:none;" />
            </div>
            <div class="topbar-actions">
                <a href="${relPath}notifications.html" style="color:var(--text-secondary); padding:8px; border-radius:10px; position:relative" title="Notifikasi">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                    <span style="position:absolute; top:8px; right:8px; width:8px; height:8px; background:var(--danger); border:2px solid #fff; border-radius:50%"></span>
                </a>
                <a href="${relPath}profile.html" class="topbar-user" style="text-decoration:none">
                    <div class="topbar-avatar">AD</div>
                    <div class="topbar-uname">System Admin</div>
                </a>
            </div>
        </header>
    `;

    // 4. Inject Containers
    const sidebarContainer = document.getElementById('sidebar-container');
    const topbarContainer = document.getElementById('topbar-container');
    
    if (sidebarContainer) sidebarContainer.innerHTML = sidebarHTML;
    if (topbarContainer) topbarContainer.innerHTML = topbarHTML;

    // 5. Active State Detection
    const filename = path.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.getAttribute('data-page') === filename) {
            item.classList.add('active');
        }
    });

    // 6. Sidebar Toggle Logic
    const sidebarElement = document.getElementById('sidebar');
    const topbarElement = document.getElementById('topbar');
    const mainElement = document.getElementById('main');
    const toggleBtn = document.getElementById('sidebar-toggle');

    function updateLayout(collapsed) {
        if (collapsed) {
            sidebarElement.classList.add('collapsed');
            topbarElement.classList.add('expanded');
            mainElement.classList.add('expanded');
        } else {
            sidebarElement.classList.remove('collapsed');
            topbarElement.classList.remove('expanded');
            mainElement.classList.remove('expanded');
        }
    }

    // Persistence
    const isCollapsed = localStorage.getItem('admin-sidebar-collapsed') === 'true';
    updateLayout(isCollapsed);

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const nowCollapsed = !sidebarElement.classList.contains('collapsed');
            updateLayout(nowCollapsed);
            localStorage.setItem('admin-sidebar-collapsed', nowCollapsed);
        });
    }

    // 7. Global Search Listener
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                window.location.href = `${relPath}search.html?q=${encodeURIComponent(searchInput.value)}`;
            }
        });
    }
});
