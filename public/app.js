const form = document.querySelector('#searchForm');
const input = document.querySelector('#pincode');
const results = document.querySelector('#results');
const title = document.querySelector('#resultTitle');
const meta = document.querySelector('#resultMeta');
const clearBtn = document.querySelector('#clearBtn');

const examples = ['560001','560003','560008','560034','560066','560100','560102','560103'];

function card(item) {
  return `<article class="card">
    <div class="pin">${item.pincode}</div>
    <h3>${escapeHtml(item.name)}</h3>
    <p>${escapeHtml(item.district || 'Bangalore Urban')}${item.state ? ` • ${escapeHtml(item.state)}` : ''}</p>
    ${item.branchType ? `<span>${escapeHtml(item.branchType)}</span>` : ''}
  </article>`;
}

function escapeHtml(value='') {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function showExamples() {
  title.textContent = 'Popular Bangalore pincodes';
  meta.textContent = 'Choose an example or search any 56xxxx pincode.';
  results.innerHTML = examples.map(p => `<button class="example" data-pin="${p}"><strong>${p}</strong><span>Search pincode</span></button>`).join('');
  document.querySelectorAll('.example').forEach(btn => btn.addEventListener('click', () => lookup(btn.dataset.pin)));
}

async function lookup(pincode) {
  input.value = pincode;
  title.textContent = `Results for ${pincode}`;
  meta.textContent = 'Looking up Bangalore postal areas…';
  results.innerHTML = '<div class="loading">Searching postal records<span>…</span></div>';
  try {
    const response = await fetch(`/api/pincodes/${pincode}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Lookup failed');
    meta.textContent = `${data.count} area${data.count === 1 ? '' : 's'} found • ${data.source}`;
    results.innerHTML = data.results.map(card).join('');
  } catch (error) {
    meta.textContent = 'No result';
    results.innerHTML = `<div class="empty"><strong>Couldn’t find that pincode.</strong><p>${escapeHtml(error.message)}</p></div>`;
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = input.value.replace(/\D/g, '');
  if (value.length !== 6 || !value.startsWith('56')) {
    meta.textContent = 'Invalid pincode';
    results.innerHTML = '<div class="empty"><strong>Please enter a valid Bangalore pincode.</strong><p>Use a 6-digit pincode beginning with 56.</p></div>';
    return;
  }
  lookup(value);
});

input.addEventListener('input', () => { input.value = input.value.replace(/\D/g, '').slice(0, 6); });
clearBtn.addEventListener('click', () => { input.value = ''; showExamples(); input.focus(); });
showExamples();
