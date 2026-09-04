const DEFAULTS = {
  heading: 'Search with our Value-based Care Advisor',
  tooltip: 'The advisor uses AI to search value-based care guides and cite its sources. It can make mistakes, so verify anything important.',
  placeholder: 'Ask a question',
  launcherLabel: 'Value-based Care Advisor',
};

let uid = 0;

function buildForm(heading, inputId) {
  const form = document.createElement('form');
  form.className = 'search-form';

  const label = document.createElement('label');
  label.htmlFor = inputId;
  label.className = 'a11y-clip';
  label.textContent = heading;

  const input = document.createElement('input');
  input.type = 'search';
  input.id = inputId;
  input.name = 'q';
  input.placeholder = DEFAULTS.placeholder;
  input.autocomplete = 'off';

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'search-submit';
  submit.ariaLabel = 'Ask';

  form.append(label, input, submit);

  // No backend wired yet: hand the question off to whatever listens.
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    form.dispatchEvent(new CustomEvent('ai-search:ask', { bubbles: true, detail: { question } }));
    form.reset();
  });

  return form;
}

function buildTooltip(tooltip, tooltipId) {
  const infoBtn = document.createElement('button');
  infoBtn.type = 'button';
  infoBtn.className = 'search-info';
  infoBtn.setAttribute('popovertarget', tooltipId);
  infoBtn.ariaLabel = 'About the Value-based Care Advisor';
  infoBtn.textContent = 'i';

  const tooltipEl = document.createElement('div');
  tooltipEl.id = tooltipId;
  tooltipEl.className = 'search-tooltip';
  tooltipEl.setAttribute('popover', 'auto');
  tooltipEl.textContent = tooltip;

  return { infoBtn, tooltipEl };
}

function buildInline(el, heading, tooltip) {
  uid += 1;
  const inputId = `ai-search-input-${uid}`;
  const tooltipId = `ai-search-tooltip-${uid}`;

  const headingEl = document.createElement('p');
  headingEl.className = 'search-heading';
  headingEl.textContent = heading;

  const { infoBtn, tooltipEl } = buildTooltip(tooltip, tooltipId);
  headingEl.append(infoBtn);

  el.append(headingEl, tooltipEl, buildForm(heading, inputId));
}

function buildLauncher(el, heading, tooltip) {
  uid += 1;
  const panelId = `ai-search-panel-${uid}`;

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'search-trigger';
  trigger.setAttribute('popovertarget', panelId);

  const icon = document.createElement('span');
  icon.className = 'search-trigger-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = '✨';

  const label = document.createElement('span');
  label.textContent = DEFAULTS.launcherLabel;

  trigger.append(icon, label);

  const panel = document.createElement('div');
  panel.id = panelId;
  panel.className = 'search-panel';
  panel.setAttribute('popover', 'auto');

  const panelHeading = document.createElement('p');
  panelHeading.className = 'search-heading';
  panelHeading.textContent = heading;
  panelHeading.title = tooltip;

  panel.append(panelHeading, buildForm(heading, `ai-search-input-${uid}`));

  el.append(trigger, panel);
}

export default function init(el) {
  const paragraphs = [...el.querySelectorAll('p')]
    .map((p) => p.textContent.trim())
    .filter(Boolean);
  const heading = paragraphs[0] || DEFAULTS.heading;
  const tooltip = paragraphs[1] || DEFAULTS.tooltip;
  const isLauncher = el.classList.contains('launcher');

  el.innerHTML = '';

  if (isLauncher) buildLauncher(el, heading, tooltip);
  else buildInline(el, heading, tooltip);
}
