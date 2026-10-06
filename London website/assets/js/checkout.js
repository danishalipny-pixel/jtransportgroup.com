(() => {
  const params = new URLSearchParams(location.search);
  const quoteId = params.get('quote') || '';
  const vehicleCode = params.get('vehicle') || '';
  const summary = document.querySelector('#trip-summary');
  const form = document.querySelector('#checkout-form');
  const message = document.querySelector('#checkout-message');
  let vehicle = null;

  const showError = text => {
    summary.textContent = text;
    form.hidden = true;
  };

  api('/api/auth/me').then(user => {
    document.querySelector('#name').value = user.name || '';
    document.querySelector('#email').value = user.email || '';
    document.querySelector('#phone').value = user.phone || '';
  }).catch(() => {});

  if (!quoteId || !vehicleCode) {
    showError('Start from the booking search so we can price the journey.');
    return;
  }

  api('/api/quotes/' + encodeURIComponent(quoteId)).then(quote => {
    vehicle = quote.vehicles.find(item => item.code === vehicleCode);
    if (!vehicle) {
      showError('That vehicle is not on this quote. Search again.');
      return;
    }
    const trip = quote.trip;
    summary.replaceChildren();
    const route = document.createElement('p');
    route.textContent = trip.pickup + ' → ' + trip.dropoff + (trip.via ? ' via ' + trip.via : '');
    const when = document.createElement('p');
    when.textContent = 'Pickup ' + trip.pickup_at.replace('T', ' ').slice(0, 16) + (trip.return_at ? ' · Return ' + trip.return_at.replace('T', ' ').slice(0, 16) : ' · One way');
    const chosen = document.createElement('p');
    chosen.textContent = vehicle.name + ' · ' + trip.passengers + ' passengers · ' + pounds(vehicle.breakdown.totalPence);
    summary.append(route, when, chosen);
    form.hidden = false;
  }).catch(error => showError(error.message));

  const radioButtons = document.querySelectorAll('input[name="paymentMethod"]');
  const submitBtn = document.querySelector('#submit-booking-btn');

  const updateSubmitButtonText = () => {
    const selected = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'card';
    if (selected === 'cash') {
      submitBtn.innerHTML = 'Confirm Reservation & Pay Cash in Car <i class="bi bi-check-circle-fill"></i>';
    } else {
      submitBtn.innerHTML = 'Pay Securely Online Now <i class="bi bi-lock-fill"></i>';
    }
  };

  radioButtons.forEach(radio => radio.addEventListener('change', updateSubmitButtonText));
  updateSubmitButtonText();

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!vehicle) return;
    const button = form.querySelector('button');
    button.disabled = true;
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'card';
    
    if (selectedMethod === 'cash') {
      message.textContent = 'Confirming your cash booking…';
    } else {
      message.textContent = 'Opening secure payment…';
    }

    try {
      const booking = await api('/api/bookings', {
        method: 'POST',
        body: {
          quoteId,
          vehicle: vehicleCode,
          name: document.querySelector('#name').value,
          email: document.querySelector('#email').value,
          phone: document.querySelector('#phone').value,
          flightNumber: document.querySelector('#flight').value,
          notes: document.querySelector('#notes').value
        }
      });

      if (selectedMethod === 'cash') {
        const cashRes = await api('/api/payments/pay-in-car', {
          method: 'POST',
          body: { reference: booking.reference, cancelToken: booking.cancelToken }
        });
        window.location.href = 'payment-success.html?booking=' + encodeURIComponent(booking.reference) + '&method=cash&token=' + encodeURIComponent(booking.cancelToken);
      } else {
        const payment = await api('/api/payments/checkout', {
          method: 'POST',
          body: { reference: booking.reference, cancelToken: booking.cancelToken }
        });
        if (!payment.url) throw new Error('Stripe did not return a payment page.');
        window.location.href = payment.url;
      }
    } catch (error) {
      message.textContent = error.message;
      button.disabled = false;
    }
  });
})();

