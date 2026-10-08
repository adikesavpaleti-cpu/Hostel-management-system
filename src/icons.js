// SVG Icon Helper for Vanilla JS

export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const getIcon = (name, size = 18, color = 'currentColor', className = '') => {
  const svgAttributes = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"`;

  switch (name) {
    case 'dashboard':
    case 'grid':
      return `<svg ${svgAttributes}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>`;
    case 'rooms':
    case 'home':
    case 'building':
      return `<svg ${svgAttributes}><path d="M3 21h18"/><path d="M9 8h1"/><path d="M9 12h1"/><path d="M9 16h1"/><path d="M14 8h1"/><path d="M14 12h1"/><path d="M14 16h1"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>`;
    case 'residents':
    case 'users':
      return `<svg ${svgAttributes}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
    case 'allocations':
    case 'key':
      return `<svg ${svgAttributes}><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>`;
    case 'fees':
    case 'rupee':
    case 'indian-rupee':
      return `<svg ${svgAttributes}><path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3a4.5 4.5 0 0 0 0-9"/></svg>`;
    case 'complaints':
    case 'alert-circle':
    case 'wrench':
      return `<svg ${svgAttributes}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    case 'gatepass':
    case 'ticket':
    case 'shield':
      return `<svg ${svgAttributes}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    case 'mess':
    case 'utensils':
      return `<svg ${svgAttributes}><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M15 2v16"/><path d="M8 2v4a2 2 0 0 1-2 2 2 2 0 0 1-2-2V2"/><path d="M6 2v16"/></svg>`;
    case 'student':
    case 'user-check':
      return `<svg ${svgAttributes}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>`;
    case 'plus':
      return `<svg ${svgAttributes}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
    case 'search':
      return `<svg ${svgAttributes}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
    case 'filter':
      return `<svg ${svgAttributes}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`;
    case 'check':
      return `<svg ${svgAttributes}><polyline points="20 6 9 17 4 12"/></svg>`;
    case 'x':
    case 'close':
      return `<svg ${svgAttributes}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    case 'printer':
    case 'print':
      return `<svg ${svgAttributes}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`;
    case 'qr':
    case 'qrcode':
      return `<svg ${svgAttributes}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`;
    case 'refresh':
    case 'rotate':
      return `<svg ${svgAttributes}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>`;
    case 'arrow-right':
      return `<svg ${svgAttributes}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
    case 'calendar':
      return `<svg ${svgAttributes}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
    case 'clock':
      return `<svg ${svgAttributes}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
    case 'bed':
      return `<svg ${svgAttributes}><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>`;
    default:
      return `<svg ${svgAttributes}><circle cx="12" cy="12" r="10"/></svg>`;
  }
};
