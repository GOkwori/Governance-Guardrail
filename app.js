const slides = Array.from(document.querySelectorAll('.slide'));
const navItems = Array.from(document.querySelectorAll('.nav-item'));
const progressBar = document.getElementById('progressBar');
const sectionLabel = document.getElementById('sectionLabel');
const slideTitle = document.getElementById('slideTitle');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const personas = [
  {
    name: 'Head of Investigation',
    summary: 'Strategic oversight across investigation work and senior decision visibility.',
    roles: ['Application editor Role', 'Application Team Manager Role', 'Case Editor Role', 'Case Admin', 'Public File Publisher', 'Reference Data Reader', 'Case Workflow Manager'],
    can: ['Read and make changes to Application records.', 'Add team members to Application records.', 'Read and make changes to Case records.', 'Add team members to Case records.', 'Publish Files to Public File.', 'Read Reference Data.', 'Progress Cases to the next stage.'],
    cannot: ['Make changes to Reference Data.', 'Change security configuration or assign system roles.']
  },
  {
    name: 'Lead Investigator',
    summary: 'Leads case activity and coordinates investigation delivery.',
    roles: ['Application editor Role', 'Application Team Manager Role', 'Case Editor Role', 'Case Admin', 'Public File Publisher', 'Reference Data Reader'],
    can: ['Read and make changes to Application records.', 'Add team members to Application records.', 'Read and make changes to Case records.', 'Add team members to Case records.', 'Publish Files to Public File.', 'Read Reference Data.'],
    cannot: ['Make changes to Reference Data.', 'Change security configuration or assign system roles.']
  },
  {
    name: 'Compliance Lead',
    summary: 'Controls compliance review, quality checks and regulatory adherence.',
    roles: ['Case Editor Role', 'Case Admin', 'Reference Data Reader', 'Case Workflow Manager'],
    can: ['Read and make changes to Case records.', 'Add team members to Case records.', 'Read Reference Data.', 'Progress Cases to the next stage.'],
    cannot: ['Read and make changes to Application records.', 'Add team members to Application records.', 'Make changes to Reference Data.', 'Publish Files to Public File.', 'Change security configuration or assign system roles.']
  },
  {
    name: 'Case Worker',
    summary: 'Works assigned cases and records operational case activity.',
    roles: ['Application editor Role', 'Case Editor Role', 'Reference Data Reader'],
    can: ['Read and make changes to Application records.', 'Read and make changes to Case records.', 'Read Reference Data.'],
    cannot: ['Add team members to Application records.', 'Add team members to Case records.', 'Progress Cases to the next stage.', 'Make changes to Reference Data.', 'Publish Files to Public File.', 'Change security configuration or assign system roles.']
  },
  {
    name: 'Audit & PMO',
    summary: 'Provides audit trail, reporting, project governance and delivery oversight.',
    roles: ['System Observer', 'Reference Data Reader'],
    can: ['Read Application records.', 'Read Case records.', 'Publish Files to Public File.', 'Read Reference Data.'],
    cannot: ['Make changes to Application records.', 'Add team members to Application records.', 'Make changes to Case records.', 'Add team members to Case records.', 'Make changes to Reference Data.', 'Progress Cases to the next stage.', 'Change security configuration or assign system roles.']
  },
  {
    name: 'Trade Advisory Service (TRAS)',
    summary: 'Supports advisory service activity with controlled access to relevant records.',
    roles: ['Application editor Role', 'Application Team Manager Role', 'Reference Data Reader'],
    can: ['Read and make changes to Application records.', 'Add team members to Application records.', 'Read Reference Data.'],
    cannot: ['Read and make changes to Case records.', 'Add team members to Case records.', 'Progress Cases to the next stage.', 'Make changes to Reference Data.', 'Publish Files to Public File.', 'Change security configuration or assign system roles.']
  }
];

let currentSlide = 0;
let currentPersona = 0;

function updateSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
  navItems.forEach((item, i) => item.classList.toggle('active', i === currentSlide));
  progressBar.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
  sectionLabel.textContent = slides[currentSlide].dataset.label;
  slideTitle.textContent = slides[currentSlide].dataset.title;
  requestAnimationFrame(drawProcessConnectors);
}


navItems.forEach(item => item.addEventListener('click', () => updateSlide(Number(item.dataset.slide))));
prevBtn.addEventListener('click', () => updateSlide(currentSlide - 1));
nextBtn.addEventListener('click', () => updateSlide(currentSlide + 1));
window.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'PageDown') updateSlide(currentSlide + 1);
  if (event.key === 'ArrowLeft' || event.key === 'PageUp') updateSlide(currentSlide - 1);
});

function buildPersonaGrid() {
  const grid = document.getElementById('personaGrid');
  grid.innerHTML = personas.map((persona, index) => `
    <button class="persona-card depth-card" type="button" data-persona="${index}">
      <h3>${persona.name}</h3>
      <p>${persona.summary}</p>
      <div class="role-pills">${persona.roles.map(role => `<span>${role}</span>`).join('')}</div>
    </button>
  `).join('');
  grid.querySelectorAll('.persona-card').forEach(card => {
    card.addEventListener('click', () => {
      currentPersona = Number(card.dataset.persona);
      updateSlide(4);
      renderAccessCard();
    });
  });
}

function buildPersonaSelector() {
  const selector = document.getElementById('personaSelector');
  selector.innerHTML = personas.map((persona, index) => `
    <button class="persona-tab ${index === currentPersona ? 'active' : ''}" type="button" data-persona="${index}">${persona.name}</button>
  `).join('');
  selector.querySelectorAll('.persona-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentPersona = Number(tab.dataset.persona);
      renderAccessCard();
    });
  });
}

function renderAccessCard() {
  buildPersonaSelector();
  const persona = personas[currentPersona];
  const card = document.getElementById('accessCard');
  card.innerHTML = `
    <h2>${persona.name}</h2>
    <div class="role-line">${persona.roles.map(role => `<span>${role}</span>`).join('')}</div>
    <div class="permission-columns">
      <div class="permission-box">
        <h3>Can Do</h3>
        <ul>${persona.can.map(item => `<li>${item}</li>`).join('')}</ul>
      </div>
      <div class="permission-box">
        <h3>Cannot Do</h3>
        <ul>${persona.cannot.map(item => `<li>${item}</li>`).join('')}</ul>
      </div>
    </div>
  `;
}

function sidePoint(rect, boardRect, side) {
  const x = rect.left - boardRect.left;
  const y = rect.top - boardRect.top;
  const w = rect.width;
  const h = rect.height;
  if (side === 'left') return { x, y: y + h / 2 };
  if (side === 'right') return { x: x + w, y: y + h / 2 };
  if (side === 'top') return { x: x + w / 2, y };
  if (side === 'bottom') return { x: x + w / 2, y: y + h };
  return { x: x + w / 2, y: y + h / 2 };
}

function autoSides(fromRect, toRect) {
  const dx = (toRect.left + toRect.width / 2) - (fromRect.left + fromRect.width / 2);
  const dy = (toRect.top + toRect.height / 2) - (fromRect.top + fromRect.height / 2);
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? ['right', 'left'] : ['left', 'right'];
  }
  return dy >= 0 ? ['bottom', 'top'] : ['top', 'bottom'];
}

function routePath(start, end, style = 'auto') {
  if (style === 'straight') return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  if (style === 'vertical') {
    const midY = (start.y + end.y) / 2;
    return `M ${start.x} ${start.y} V ${midY} H ${end.x} V ${end.y}`;
  }
  if (style === 'drop') {
    const midY = start.y + Math.max(42, Math.abs(end.y - start.y) * 0.48);
    return `M ${start.x} ${start.y} V ${midY} H ${end.x} V ${end.y}`;
  }
  if (style === 'loop') {
    const lift = Math.min(start.y, end.y) - 62;
    const midX = (start.x + end.x) / 2;
    return `M ${start.x} ${start.y} V ${lift} C ${start.x} ${lift - 22}, ${midX} ${lift - 22}, ${midX} ${lift} S ${end.x} ${lift + 22}, ${end.x} ${lift} V ${end.y}`;
  }
  const dx = Math.abs(end.x - start.x);
  const dy = Math.abs(end.y - start.y);
  if (dx < 8 || dy < 8) return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  const midX = (start.x + end.x) / 2;
  return `M ${start.x} ${start.y} H ${midX} V ${end.y} H ${end.x}`;
}

function drawConnectorLayer(boardSelector, svgSelector, connections, markerId) {
  const board = document.querySelector(boardSelector);
  const svg = document.querySelector(svgSelector);
  if (!board || !svg) return;

  const boardRect = board.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${boardRect.width} ${boardRect.height}`);
  svg.innerHTML = `
    <defs>
      <marker id="${markerId}" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto" markerUnits="userSpaceOnUse">
        <path d="M0,0 L0,9 L8.5,4.5 z"></path>
      </marker>
    </defs>
  `;

  connections.forEach((connection, index) => {
    const from = board.querySelector(connection.from);
    const to = board.querySelector(connection.to);
    if (!from || !to) return;
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    const [autoFrom, autoTo] = autoSides(fromRect, toRect);
    const start = sidePoint(fromRect, boardRect, connection.fromSide || autoFrom);
    const end = sidePoint(toRect, boardRect, connection.toSide || autoTo);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', routePath(start, end, connection.route));
    path.setAttribute('marker-end', `url(#${markerId})`);
    path.style.animationDelay = `${index * 0.08}s`;
    if (connection.className) path.setAttribute('class', connection.className);
    svg.appendChild(path);
  });
}

function drawProcessConnectors() {
  drawConnectorLayer('.process-flow', '.flow-lines', [
    { from: '.n1', to: '.n2', route: 'straight' },
    { from: '.n2', to: '.n3', route: 'straight' },
    { from: '.n3', to: '.n4', route: 'straight' },
    { from: '.n4', to: '.n5', route: 'straight' },
    { from: '.n5', to: '.n6', fromSide: 'bottom', toSide: 'top', route: 'vertical' },
    { from: '.n6', to: '.n7', route: 'straight' },
    { from: '.n7', to: '.n8', route: 'straight' },
    { from: '.n8', to: '.n9', route: 'straight' },
    { from: '.n9', to: '.n10', fromSide: 'bottom', toSide: 'top', route: 'vertical' },
    { from: '.n10', to: '.n11', route: 'straight' },
    { from: '.n7', to: '.n4', fromSide: 'top', toSide: 'bottom', route: 'vertical', className: 'feedback-line' }
  ], 'flowArrow');

  drawConnectorLayer('.data-flow', '.data-lines', [
    { from: '.a', to: '.b', route: 'straight' },
    { from: '.b', to: '.c', route: 'straight' },
    { from: '.c', to: '.d', route: 'straight' },
    { from: '.d', to: '.e', fromSide: 'bottom', toSide: 'top', route: 'drop' },
    { from: '.e', to: '.f', route: 'straight' },
    { from: '.f', to: '.g', route: 'straight' }
  ], 'dataArrow');
}

window.addEventListener('resize', () => requestAnimationFrame(drawProcessConnectors));


buildPersonaGrid();
renderAccessCard();
updateSlide(0);
drawProcessConnectors();
