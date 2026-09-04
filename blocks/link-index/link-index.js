export default function init(el) {
  const list = el.querySelector('ul');
  if (!list) return;
  list.classList.add('index-list');
}
