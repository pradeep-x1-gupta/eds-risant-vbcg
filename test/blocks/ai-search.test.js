import { expect } from '@esm-bundle/chai';
import init from '../../blocks/ai-search/ai-search.js';

function mount(className, html = '') {
  const el = document.createElement('div');
  el.className = className;
  el.innerHTML = html;
  document.body.append(el);
  return el;
}

afterEach(() => {
  document.querySelectorAll('.ai-search').forEach((el) => el.remove());
});

describe('inline form', () => {
  it('falls back to the default heading and placeholder when nothing is authored', () => {
    const el = mount('ai-search block');
    init(el);
    expect(el.querySelector('.search-heading').firstChild.textContent)
      .to.equal('Search with our Value-based Care Advisor');
    expect(el.querySelector('input').placeholder).to.equal('Ask a question');
  });

  it('uses authored paragraphs for the heading and tooltip text', () => {
    const el = mount('ai-search block', '<div><div><p>Ask away</p><p>Extra help text</p></div></div>');
    init(el);
    expect(el.querySelector('.search-heading').firstChild.textContent).to.equal('Ask away');
    expect(el.querySelector('.search-tooltip').textContent).to.equal('Extra help text');
  });

  it('associates the label with the input', () => {
    const el = mount('ai-search block');
    init(el);
    const input = el.querySelector('input');
    const label = el.querySelector('label');
    expect(label.htmlFor).to.equal(input.id);
    expect(input.id).to.not.equal('');
  });

  it('wires the info button to the tooltip via popovertarget', () => {
    const el = mount('ai-search block');
    init(el);
    const btn = el.querySelector('.search-info');
    const tooltip = el.querySelector('.search-tooltip');
    expect(btn.getAttribute('popovertarget')).to.equal(tooltip.id);
    expect(tooltip.getAttribute('popover')).to.equal('auto');
  });

  it('dispatches a question event on submit and clears the input', () => {
    const el = mount('ai-search block');
    init(el);
    const input = el.querySelector('input');
    const form = el.querySelector('form');
    input.value = 'What is the referral pathway for asthma?';

    let detail = null;
    form.addEventListener('ai-search:ask', (e) => { detail = e.detail; });
    form.dispatchEvent(new SubmitEvent('submit', { cancelable: true }));

    expect(detail).to.not.equal(null);
    expect(detail.question).to.equal('What is the referral pathway for asthma?');
    expect(input.value).to.equal('');
  });

  it('does not dispatch on an empty question', () => {
    const el = mount('ai-search block');
    init(el);
    const form = el.querySelector('form');
    let called = false;
    form.addEventListener('ai-search:ask', () => { called = true; });
    form.dispatchEvent(new SubmitEvent('submit', { cancelable: true }));
    expect(called).to.equal(false);
  });
});

describe('launcher variant', () => {
  it('renders a trigger button and a popover panel instead of an inline form', () => {
    const el = mount('ai-search launcher block');
    init(el);
    expect(el.querySelector('.search-trigger')).to.not.equal(null);
    expect(el.querySelector(':scope > form')).to.equal(null);
    const panel = el.querySelector('.search-panel');
    expect(panel.getAttribute('popover')).to.equal('auto');
    expect(el.querySelector('.search-trigger').getAttribute('popovertarget')).to.equal(panel.id);
  });

  it('still contains a working form inside the panel', () => {
    const el = mount('ai-search launcher block');
    init(el);
    expect(el.querySelector('.search-panel form.search-form')).to.not.equal(null);
  });
});
