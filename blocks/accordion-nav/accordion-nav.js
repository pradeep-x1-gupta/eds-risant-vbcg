import { getConfig } from '../../scripts/ak.js';

const { log } = getConfig();

function buildPanel(section, idx) {
  const heading = section.querySelector('h1, h2, h3, h4, h5, h6');
  const label = heading?.textContent.trim() || `Topic ${idx + 1}`;
  const headingParent = heading?.parentElement;
  heading?.remove();
  if (headingParent && !headingParent.hasChildNodes()) headingParent.remove();

  const panel = document.createElement('details');
  panel.className = 'panel';
  panel.id = `accordion-panel-${idx + 1}`;

  const summary = document.createElement('summary');
  const summaryLabel = document.createElement('span');
  summaryLabel.role = 'heading';
  summaryLabel.ariaLevel = '3';
  summaryLabel.textContent = label;
  summary.append(summaryLabel);

  const body = document.createElement('div');
  body.className = 'panel-body';
  body.append(...section.children);

  panel.append(summary, body);
  return panel;
}

function closeOthers(current, panels) {
  for (const panel of panels) {
    if (panel !== current) panel.removeAttribute('open');
  }
}

function setActiveLink(list, panelId) {
  for (const link of list.querySelectorAll('a')) {
    const active = link.getAttribute('href') === `#${panelId}`;
    link.classList.toggle('is-active', active);
    link.ariaCurrent = active ? 'true' : null;
  }
}

function buildNav(topicList, panels) {
  const items = [...topicList.querySelectorAll(':scope > li')];
  const nav = document.createElement('nav');
  nav.className = 'side-nav';
  nav.ariaLabel = 'Guide topics';

  const backLink = topicList.previousElementSibling;
  if (backLink?.matches('p') && backLink.querySelector('a')) {
    nav.append(backLink);
  }

  const list = document.createElement('ul');
  for (const [idx, item] of items.entries()) {
    const panel = panels[idx];
    if (panel) {
      const link = document.createElement('a');
      link.href = `#${panel.id}`;
      link.textContent = item.textContent.trim();
      link.addEventListener('click', (e) => {
        e.preventDefault();
        // Native <details> queues its 'toggle' event rather than firing it
        // synchronously, so the sidebar-driven path syncs state itself
        // instead of waiting on the listener below (which still handles
        // direct summary clicks, where the open transition isn't ours to
        // drive).
        closeOthers(panel, panels);
        panel.open = true;
        setActiveLink(list, panel.id);
        panel.scrollIntoView({ block: 'start', behavior: 'smooth' });
        panel.querySelector('summary').focus();
      });

      const li = document.createElement('li');
      li.append(link);
      list.append(li);
    }
  }
  nav.append(list);
  return { nav, list };
}

export default function init(el) {
  const parent = el.closest('.fragment-content, main');
  parent.style = 'display: none;';
  const currSection = el.closest('.section');

  const topicList = el.querySelector('ul');
  if (!topicList) {
    log('Please add a topic list to the accordion nav block.', el);
    parent.removeAttribute('style');
    return;
  }

  const sections = [...parent.querySelectorAll(':scope > .section')]
    .filter((section) => section !== currSection);
  const panels = sections.map((section, idx) => buildPanel(section, idx));

  const { nav, list } = buildNav(topicList, panels);

  for (const panel of panels) {
    panel.addEventListener('toggle', () => {
      if (!panel.open) return;
      closeOthers(panel, panels);
      setActiveLink(list, panel.id);
    });
  }

  if (panels[0]) {
    panels[0].open = true;
    setActiveLink(list, panels[0].id);
  }

  const panelWrapper = document.createElement('div');
  panelWrapper.className = 'panels';
  panelWrapper.append(...panels);

  el.innerHTML = '';
  el.append(nav, panelWrapper);
  for (const section of sections) section.remove();

  parent.removeAttribute('style');
}
