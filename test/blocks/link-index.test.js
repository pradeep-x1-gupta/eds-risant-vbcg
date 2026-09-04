import { expect } from '@esm-bundle/chai';
import init from '../../blocks/link-index/link-index.js';

function mount(html) {
  const el = document.createElement('div');
  el.className = 'link-index block';
  el.innerHTML = html;
  document.body.append(el);
  return el;
}

afterEach(() => {
  document.querySelectorAll('.link-index').forEach((el) => el.remove());
});

const LIST_HTML = '<div><div><ul><li><a href="/a">Allergy</a></li><li><a href="/c">Cardiology</a></li></ul></div></div>';

describe('link-index', () => {
  it('marks the authored list for the multi-column layout', () => {
    const el = mount(LIST_HTML);
    init(el);
    const list = el.querySelector('ul');
    expect(list.classList.contains('index-list')).to.equal(true);
  });

  it('leaves the links themselves untouched', () => {
    const el = mount(LIST_HTML);
    init(el);
    const links = el.querySelectorAll('a');
    expect(links).to.have.lengthOf(2);
    expect(links[0].getAttribute('href')).to.equal('/a');
  });

  it('does not throw when there is no list', () => {
    const el = mount('<div><div><p>No list here</p></div></div>');
    expect(() => init(el)).to.not.throw();
  });
});
