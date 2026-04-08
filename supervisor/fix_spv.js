const fs = require('fs');
const path = require('path');

const dirPath = 'd:\\PromptEngineer\\CRM\\claude\\supervisor';
const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html') && f !== 'login.html');

const navLinks = {
    'Dashboard': 'index.html',
    'Manajemen Sales': 'team.html',
    'Monitor To-Do': 'todo-monitor.html',
    'Peta Prospek': 'map.html',
    'Laporan': 'reports.html',
    'Pengumuman': 'announcements.html',
    'Profil Saya': 'profile.html',
    'Bantuan': '#'
};

const activeMap = {
    'index.html': 'Dashboard',
    'team.html': 'Manajemen Sales',
    'team-detail.html': 'Manajemen Sales',
    'todo-monitor.html': 'Monitor To-Do',
    'map.html': 'Peta Prospek',
    'reports.html': 'Laporan',
    'announcements.html': 'Pengumuman',
    'profile.html': 'Profil Saya',
    'change-password.html': 'Profil Saya',
    'notifications.html': '',
    'schedule.html': '',
    'search.html': ''
};

files.forEach(f => {
    const filePath = path.join(dirPath, f);
    let content = fs.readFileSync(filePath, 'utf8');
    const activeLabel = activeMap[f] || '';
    
    content = content.replace(/<a\s+href="[^"]*"\s+class="nav-item(?:\s+active)?">([\s\S]*?)<span class="nav-label">([^<]+)<\/span>/gi, (match, innerHtml, label) => {
        const href = navLinks[label] || '#';
        const activeCls = label === activeLabel ? ' active' : '';
        return `<a href="${href}" class="nav-item${activeCls}">${innerHtml}<span class="nav-label">${label}</span>`;
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Processed ' + files.length + ' files.');
