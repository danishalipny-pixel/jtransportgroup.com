async function api(path, options = {}) {
  const baseUrl = (typeof window !== 'undefined' && window.API_BASE_URL) ? window.API_BASE_URL.replace(/\/$/, '') : '';
  const url = (path.startsWith('http://') || path.startsWith('https://')) ? path : (baseUrl + path);
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data.detail;
    throw new Error(typeof detail === 'string' ? detail : 'Please check the form and try again.');
  }
  return data;
}

function pounds(pence) {
  return '£' + (Number(pence) / 100).toFixed(2);
}
