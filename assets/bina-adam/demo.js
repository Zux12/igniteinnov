'use strict';

const projects = {
  teres: {
    title: 'Rumah Teres Seri Ara',
    type: 'Kediaman · Fasad & anjung',
    image: 'rumah-teres',
    alt: 'Fasad putih dan teduhan anjung rumah teres dua tingkat.',
    description: 'Anjung yang dahulu terdedah kini lebih teduh. Skrin kayu di sisi pintu memberi privasi sambil membenarkan cahaya masuk.',
    scope: 'Skop kerja: teduhan anjung, kemasan fasad dan laluan masuk.',
    service: 'Ubah suai kediaman'
  },
  dapur: {
    title: 'Dapur Kayu Meranti',
    type: 'Kediaman · Dapur',
    image: 'dapur-kayu',
    alt: 'Kabinet kayu dan jubin hijau di dapur dengan tingkap berjalusi.',
    description: 'Permukaan kerja disusun di sepanjang tingkap. Kabinet tinggi menambah ruang simpanan dan kaunter sarapan memanfaatkan sudut dapur.',
    scope: 'Skop kerja: susun atur dapur, kabinet dan kemasan dinding.',
    service: 'Dapur dan kabinet'
  },
  niaga: {
    title: 'Studio Taman Kota',
    type: 'Ruang niaga · Pejabat',
    image: 'ruang-niaga',
    alt: 'Kaunter kayu di hadapan dinding bata sebuah ruang penerimaan.',
    description: 'Ruang hadapan kedai ditukar menjadi tempat menyambut pelanggan. Kaunter baharu menghadap pintu masuk dan laluan ke ruang kerja kekal lapang.',
    scope: 'Skop kerja: kaunter penerimaan, dinding kemasan dan pencahayaan.',
    service: 'Kedai dan pejabat'
  }
};

const find = selector => document.querySelector(selector);
const form = find('#quote-form');
const receipt = find('#receipt');
const viewer = find('#viewer');
const kind = find('#kind');
const showProject = find('#project-detail');
const showSocial = find('#social-detail');
let selectedProject;
let focusAfterClose;

document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    document.querySelectorAll('[data-category]').forEach(card => {
      card.hidden = button.dataset.filter !== 'semua' && button.dataset.filter !== card.dataset.category;
      if (!card.hidden) count++;
    });
    find('#count').textContent = count + ' projek dipaparkan.';
  });
});

document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    selectedProject = projects[button.dataset.project];
    find('#detail-image').src = 'assets/bina-adam/' + selectedProject.image + '.webp';
    find('#detail-image').alt = selectedProject.alt;
    find('#detail-type').textContent = selectedProject.type;
    find('#dialog-title').textContent = selectedProject.title;
    find('#detail-description').textContent = selectedProject.description;
    find('#detail-scope').textContent = selectedProject.scope;
    showProject.hidden = false;
    showSocial.hidden = true;
    viewer.setAttribute('aria-labelledby', 'dialog-title');
    viewer.showModal();
  });
});

document.querySelectorAll('[data-social]').forEach(button => {
  button.addEventListener('click', () => {
    const platform = button.dataset.social;
    find('#social-title').textContent = platform;
    find('#social-bio').textContent = platform === 'Instagram'
      ? 'Idea untuk suapan Instagram anda: paparkan projek siap, pilihan kemasan dan butiran kerja.'
      : 'Idea untuk profil TikTok anda: rakam lawatan ringkas ke projek, dari pintu masuk hingga ke kemasan akhir.';
    showProject.hidden = true;
    showSocial.hidden = false;
    viewer.setAttribute('aria-labelledby', 'social-title');
    viewer.showModal();
  });
});
viewer.querySelector('.dialog-close').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', event => {
  if (event.target !== viewer) return;
  const bounds = viewer.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
});
viewer.addEventListener('close', () => {
  if (focusAfterClose) {
    find('#sebut-harga').scrollIntoView({block:'start'});
    kind.focus({preventScroll:true});
    focusAfterClose = false;
  }
});
find('#from-project').addEventListener('click', () => {
  kind.value = selectedProject.service;
  receipt.hidden = true;
  form.hidden = false;
  focusAfterClose = true;
  viewer.close();
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const scope = find('#scope').value.trim();
  find('#out-kind').textContent = kind.value;
  find('#out-budget').textContent = find('#budget').value;
  find('#out-scope').textContent = scope;
  find('#out-scope').hidden = find('#out-scope-label').hidden = !scope;
  form.hidden = true;
  receipt.hidden = false;
  find('#receipt-title').focus();
});
function editQuote(reset) {
  if (reset) form.reset();
  form.hidden = false;
  receipt.hidden = true;
  kind.focus();
}
find('#edit').addEventListener('click', () => editQuote(false));
find('#reset').addEventListener('click', () => editQuote(true));
form.hidden = false;

const welcome = find('#welcome');
welcome.showModal();
window.addEventListener('pageshow', event => {
  if (event.persisted && !welcome.open) welcome.showModal();
});
