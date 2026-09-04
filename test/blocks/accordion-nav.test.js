import { expect } from '@esm-bundle/chai';
import init from '../../blocks/accordion-nav/accordion-nav.js';

const mountedMains = [];

const DEFAULT_TOPICS = ['Allergy Testing', 'Angioedema', 'Asthma'];

function buildHtml(topics, { backLink = true } = {}) {
  const items = topics.map((t) => `<li>${t}</li>`).join('');
  const back = backLink ? '<p><a href="/index">Back to Care Guide Index</a></p>' : '';
  const nav = `<div class="section"><div class="accordion-nav block"><div><div>
    ${back}
    <ul>${items}</ul>
  </div></div></div></div>`;
  const panels = topics.map((t, idx) => `<div class="section"><div class="default-content">
    <h3>${t}</h3>
    <p>Content for ${t} (${idx})</p>
  </div></div>`).join('');
  return `<main>${nav}${panels}</main>`;
}

function mountAccordion(topics = DEFAULT_TOPICS, opts = {}) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = buildHtml(topics, opts);
  const main = wrapper.firstElementChild;
  document.body.append(main);
  mountedMains.push(main);
  const el = main.querySelector('.accordion-nav');
  init(el);
  return el;
}

// <details> queues its 'toggle' event rather than firing it synchronously.
async function nextTask() {
  await new Promise((resolve) => { setTimeout(resolve, 0); });
}

afterEach(() => {
  mountedMains.splice(0).forEach((m) => m.remove());
});

describe('panels', () => {
  it('builds one details panel per topic section, in order', () => {
    const el = mountAccordion();
    const panels = el.querySelectorAll('.panel');
    expect(panels).to.have.lengthOf(3);
    expect(panels[0].querySelector('summary').textContent).to.equal('Allergy Testing');
    expect(panels[1].querySelector('summary').textContent).to.equal('Angioedema');
  });

  it('moves the original section content into the panel body and drops the heading', () => {
    const el = mountAccordion();
    const firstPanel = el.querySelector('.panel');
    expect(firstPanel.querySelector('h3')).to.equal(null);
    expect(firstPanel.querySelector('.panel-body p').textContent).to.equal('Content for Allergy Testing (0)');
  });

  it('removes the original sibling sections from the document', () => {
    mountAccordion();
    expect(document.querySelectorAll('main > .section')).to.have.lengthOf(1);
  });

  it('opens the first panel by default and marks its nav link active immediately', () => {
    const el = mountAccordion();
    const panels = el.querySelectorAll('.panel');
    expect(panels[0].open).to.equal(true);
    expect(panels[1].open).to.equal(false);
    // Asserted with no await: this must not depend on the async 'toggle' task.
    const activeLink = el.querySelector('.side-nav a.is-active');
    expect(activeLink.textContent).to.equal('Allergy Testing');
    expect(activeLink.ariaCurrent).to.equal('true');
  });
});

describe('sidebar sync', () => {
  it('clicking a nav link opens its panel and closes the others immediately', () => {
    const el = mountAccordion();
    const [, secondLink] = el.querySelectorAll('.side-nav a');
    secondLink.click();
    // Asserted with no await: the sidebar-driven path must be synchronous.
    const panels = el.querySelectorAll('.panel');
    expect(panels[0].open).to.equal(false);
    expect(panels[1].open).to.equal(true);
    expect(secondLink.classList.contains('is-active')).to.equal(true);
  });

  it('opening a panel natively (via summary) syncs the active nav link too', async () => {
    const el = mountAccordion();
    const panels = el.querySelectorAll('.panel');
    panels[2].querySelector('summary').click();
    await nextTask();
    expect(panels[0].open).to.equal(false);
    expect(panels[2].open).to.equal(true);
    const links = el.querySelectorAll('.side-nav a');
    expect(links[2].classList.contains('is-active')).to.equal(true);
    expect(links[0].classList.contains('is-active')).to.equal(false);
  });

  it('keeps the back-to-index link at the top of the generated nav', () => {
    const el = mountAccordion();
    const firstLink = el.querySelector('.side-nav a');
    expect(firstLink.getAttribute('href')).to.equal('/index');
    expect(firstLink.textContent).to.equal('Back to Care Guide Index');
  });

  it('works without an authored back-link', () => {
    const el = mountAccordion(DEFAULT_TOPICS, { backLink: false });
    const firstLink = el.querySelector('.side-nav a');
    expect(firstLink.getAttribute('href')).to.equal('#accordion-panel-1');
  });
});

describe('guard clause', () => {
  it('does not throw when the block has no topic list', () => {
    const main = document.createElement('main');
    const section = document.createElement('div');
    section.className = 'section';
    const el = document.createElement('div');
    el.className = 'accordion-nav block';
    section.append(el);
    main.append(section);
    document.body.append(main);
    mountedMains.push(main);
    expect(() => init(el)).to.not.throw();
  });
});
