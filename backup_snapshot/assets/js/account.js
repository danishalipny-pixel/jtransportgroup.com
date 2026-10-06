(() => {
  const authCard = document.querySelector('#auth-card');
  const tripsCard = document.querySelector('#trips-card');
  const message = document.querySelector('#auth-message');
  const loginForm = document.querySelector('#login-form');
  const registerForm = document.querySelector('#register-form');
  const next = new URLSearchParams(location.search).get('next');

  const afterAuth = () => {
    if (next && next.startsWith('/') === false && next.startsWith('http') === false) {
      window.location.href = next;
      return;
    }
    window.location.href = 'account.html';
  };

  const showTrips = async user => {
    authCard.hidden = true;
    tripsCard.hidden = false;
    document.querySelector('#hello').textContent = 'Hello, ' + user.name;
    const data = await api('/api/bookings/mine');
    const list = document.querySelector('#trip-list');
    list.replaceChildren();
    if (!data.bookings.length) {
      const empty = document.createElement('p');
      empty.textContent = 'You have no trips yet.';
      const link = document.createElement('a');
      link.href = 'booking.html';
      link.textContent = 'Book a transfer';
      list.append(empty, link);
      return;
    }
    data.bookings.forEach(trip => {
      const card = document.createElement('article');
      card.className = 'quote-card';
      const copy = document.createElement('div');
      const title = document.createElement('h4');
      title.textContent = trip.reference + ' · ' + trip.status.replaceAll('_', ' ');
      const route = document.createElement('p');
      route.textContent = trip.pickup + ' → ' + trip.dropoff;
      const price = document.createElement('strong');
      price.textContent = pounds(trip.amountPence) + ' · ' + trip.vehicle;
      copy.append(title, route, price);
      card.append(copy);
      list.append(card);
    });
  };

  document.querySelector('#show-login').addEventListener('click', () => {
    loginForm.hidden = false;
    registerForm.hidden = true;
    document.querySelector('#show-login').classList.add('active');
    document.querySelector('#show-register').classList.remove('active');
  });
  document.querySelector('#show-register').addEventListener('click', () => {
    loginForm.hidden = true;
    registerForm.hidden = false;
    document.querySelector('#show-register').classList.add('active');
    document.querySelector('#show-login').classList.remove('active');
  });

  loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    message.textContent = '';
    try {
      await api('/api/auth/login', {
        method: 'POST',
        body: { email: document.querySelector('#login-email').value, password: document.querySelector('#login-password').value }
      });
      afterAuth();
    } catch (error) {
      message.textContent = error.message;
    }
  });

  registerForm.addEventListener('submit', async event => {
    event.preventDefault();
    message.textContent = '';
    try {
      await api('/api/auth/register', {
        method: 'POST',
        body: {
          name: document.querySelector('#reg-name').value,
          email: document.querySelector('#reg-email').value,
          phone: document.querySelector('#reg-phone').value,
          password: document.querySelector('#reg-password').value
        }
      });
      afterAuth();
    } catch (error) {
      message.textContent = error.message;
    }
  });

  document.querySelector('#logout').addEventListener('click', async () => {
    await api('/api/auth/logout', { method: 'POST', body: {} });
    window.location.href = 'account.html';
  });

  api('/api/auth/me').then(showTrips).catch(() => {});
})();
