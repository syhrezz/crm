/**
 * NexaCRM — Unified Navigation System (Director Module)
 * Handles dynamic sidebar/topbar injection and navigation logic.
 */

const NAV_DATA = {
  main: [
    { id: 'dashboard', label: 'Executive Dashboard', path: 'index.html', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'reports', label: 'Laporan', path: 'reports.html', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ],
  admin: [
    { id: 'users', label: 'Manajemen Pengguna', path: 'users.html', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { id: 'master', label: 'Master Data', path: 'master-data.html', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'announcements', label: 'Pengumuman', path: 'announcements.html', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z', badge: { text: '2', color: 'nb-indigo' } },
    { id: 'settings', label: 'Pengaturan Sistem', path: 'settings.html', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ],
  account: [
    { id: 'profile', label: 'Profil Saya', path: 'profile.html', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ]
};

const USER_DATA = {
  name: 'Hendra Saputra',
  role: 'Direktur Penjualan',
  avatar: 'HS'
};

function initNavigation() {
  const sidebarContainer = document.getElementById('sidebar-container');
  const topbarContainer = document.getElementById('topbar-container');
  
  if (sidebarContainer) sidebarContainer.innerHTML = createSidebarHTML();
  if (topbarContainer) topbarContainer.innerHTML = createTopbarHTML();
  
  // Set active state
  updateActiveNavItem();
  
  // Handle sidebar toggle state from persistence
  const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  if (isCollapsed) {
    toggleSidebar(true);
  }
}

function createSidebarItem(item) {
  const isActive = window.location.pathname.endsWith(item.path);
  return `
    <a href="${item.path}" class="nav-item ${isActive ? 'active' : ''}" data-id="${item.id}">
      <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"/>
      </svg>
      <span class="nav-label">${item.label}</span>
      ${item.badge ? `<span class="nav-badge ${item.badge.color}">${item.badge.text}</span>` : ''}
    </a>
  `;
}

function createSidebarHTML() {
  return `
    <nav class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">N</div>
        <div class="logo-text-wrapper">
          <div class="logo-text">NexaCRM</div>
          <div class="logo-sub">Edisi Direktur</div>
        </div>
      </div>
      <div class="sidebar-nav">
        <div class="sidebar-section-label">Menu Utama</div>
        ${NAV_DATA.main.map(createSidebarItem).join('')}
        
        <div class="sidebar-section-label" style="margin-top:6px">Administrasi</div>
        ${NAV_DATA.admin.map(createSidebarItem).join('')}
        
        <div class="sidebar-section-label" style="margin-top:6px">Akun</div>
        ${NAV_DATA.account.map(createSidebarItem).join('')}
      </div>
      <div class="sidebar-footer">
        <div class="user-card" onclick="window.location.href='profile.html'">
          <div class="user-avatar">${USER_DATA.avatar}</div>
          <div class="user-info">
            <div class="user-name">${USER_DATA.name}</div>
            <div class="user-role-lbl">${USER_DATA.role}</div>
          </div>
        </div>
      </div>
    </nav>
  `;
}

function createTopbarHTML() {
  const currentPageLabel = getCurrentPageLabel();
  const parentPageLabel = getParentPageLabel();
  
  return `
    <header class="topbar" id="topbar">
      <button class="toggle-btn" onclick="toggleSidebar()">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
      <div class="breadcrumb">
        <span>${parentPageLabel}</span>
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="opacity:0.4">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
        <span class="current">${currentPageLabel}</span>
      </div>
      <div class="topbar-actions">
        <button class="icon-btn" onclick="window.location.href='search.html'">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </button>
        <button class="icon-btn" onclick="window.location.href='notifications.html'">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <div class="notif-dot"></div>
        </button>
        <div class="topbar-user" onclick="window.location.href='profile.html'">
          <div class="topbar-avatar">${USER_DATA.avatar}</div>
          <div class="topbar-info">
            <div class="topbar-uname">${USER_DATA.name}</div>
            <div class="topbar-urole">Direktur</div>
          </div>
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="margin-left:4px;opacity:0.5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </header>
  `;
}

function toggleSidebar(force) {
  const sidebar = document.getElementById('sidebar');
  const topbar = document.getElementById('topbar');
  const main = document.getElementById('main');
  
  if (force !== undefined) {
    if (force) {
      sidebar.classList.add('collapsed');
      topbar?.classList.add('expanded');
      main?.classList.add('expanded');
    } else {
      sidebar.classList.remove('collapsed');
      topbar?.classList.remove('expanded');
      main?.classList.remove('expanded');
    }
  } else {
    sidebar.classList.toggle('collapsed');
    topbar?.classList.toggle('expanded');
    main?.classList.toggle('expanded');
  }
  
  localStorage.setItem('sidebar-collapsed', sidebar.classList.contains('collapsed'));
}

function updateActiveNavItem() {
  const path = window.location.pathname;
  const items = document.querySelectorAll('.nav-item');
  items.forEach(item => {
    const href = item.getAttribute('href');
    if (path.endsWith(href)) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function getCurrentPageLabel() {
  const path = window.location.pathname;
  const allNavItems = [...NAV_DATA.main, ...NAV_DATA.admin, ...NAV_DATA.account];
  const current = allNavItems.find(item => path.endsWith(item.path));
  if (current) return current.label;
  
  // Custom labels for pages not in nav
  if (path.endsWith('notifications.html')) return 'Notifikasi';
  if (path.endsWith('search.html')) return 'Hasil Pencarian';
  if (path.endsWith('change-password.html')) return 'Ganti Password';
  
  return 'Dashboard';
}

function getParentPageLabel() {
  const path = window.location.pathname;
  if (NAV_DATA.admin.some(item => path.endsWith(item.path))) return 'Administrasi';
  if (NAV_DATA.account.some(item => path.endsWith(item.path))) return 'Profil';
  return 'Beranda';
}

// Global scope for accessibility
window.toggleSidebar = toggleSidebar;

// Auto-init on load
document.addEventListener('DOMContentLoaded', initNavigation);
