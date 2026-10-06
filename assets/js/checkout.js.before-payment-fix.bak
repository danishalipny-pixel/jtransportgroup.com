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

  const pounds = pence => '£' + (pence / 100).toFixed(2);

  const VEHICLE_CATALOG = {
    saloon: { name: 'Saloon Car', price: 85.50, desc: 'Up to 2 Large Suitcases · Toyota Corolla, VW Golf, Prius' },
    estate: { name: 'Estate Car', price: 95.50, desc: 'Up to 3 Large Suitcases · VW Passat Estate, Skoda Superb' },
    mpv: { name: 'MPV (5 Seater)', price: 110.50, desc: 'Up to 4 Large Suitcases · VW Multivan or Ford Tourneo' },
    executive: { name: 'Executive Saloon', price: 115.50, desc: 'Premium Leather Interior · Mercedes-Benz E-Class, BMW 5 Series' },
    'exec-mpv': { name: 'Executive MPV (6 Seater)', price: 145.50, desc: 'Luxury Chauffeur Minivan · Mercedes-Benz V-Class' },
    minivan8: { name: '8 Seater Minivan', price: 130.50, desc: 'Up to 8 Large Suitcases · Mercedes-Benz Vito 8 Seater' }
  };

  const getFallbackVehicle = code => {
    const item = VEHICLE_CATALOG[code] || VEHICLE_CATALOG['saloon'];
    return {
      code: code || 'saloon',
      name: item.name,
      breakdown: { totalPence: Math.round(item.price * 100) }
    };
  };

  const renderSummary = (trip, veh) => {
    summary.replaceChildren();
    const route = document.createElement('p');
    route.style.fontWeight = '700';
    route.style.fontSize = '15px';
    route.style.color = '#1f2023';
    route.textContent = (trip.pickup || 'London Pickup') + ' → ' + (trip.dropoff || 'Destination') + (trip.via ? ' via ' + trip.via : '');
    
    const when = document.createElement('p');
    when.style.fontSize = '13px';
    when.style.color = '#555';
    const pickTime = (trip.pickup_at || trip.pickupAt || '').replace('T', ' ').slice(0, 16) || 'As Requested';
    const retTime = (trip.return_at || trip.returnAt || '').replace('T', ' ').slice(0, 16);
    when.textContent = 'Pickup: ' + pickTime + (retTime ? ' · Return: ' + retTime : ' · One way');
    
    const chosen = document.createElement('p');
    chosen.style.fontSize = '15px';
    chosen.style.fontWeight = '700';
    chosen.style.color = '#b08d00';
    chosen.textContent = veh.name + ' · ' + (trip.passengers || 1) + ' Passengers · ' + pounds(veh.breakdown.totalPence);
    
    summary.append(route, when, chosen);
    form.hidden = false;
  };

  const showExpiredQuoteCard = text => {
    summary.innerHTML = `
      <div class="quote-expired-card" style="text-align:center;padding:28px 20px;background:#fff8f8;border:1.5px solid #f5c6cb;border-radius:12px;margin:10px 0;">
        <i class="bi bi-clock-history" style="font-size:36px;color:#d9534f;display:block;margin-bottom:10px;"></i>
        <h3 style="font-size:18px;font-weight:700;color:#721c24;margin-bottom:6px;">Your fare quote has expired.</h3>
        <p style="font-size:12.5px;color:#666;margin-bottom:18px;line-height:1.5;">${text || 'Fixed fare quotes are valid for 15 minutes. Please search again to get the latest live price.'}</p>
        <a href="booking.html" class="search-button" style="display:inline-flex;align-items:center;gap:8px;padding:10px 22px;text-decoration:none;"><i class="bi bi-search"></i> Search Fare Again</a>
      </div>
    `;
    form.hidden = true;
  };

  api('/api/quotes/' + encodeURIComponent(quoteId)).then(quote => {
    const expires = quote.expiresAt || quote.quoteExpiresAt;
    if (expires && new Date(expires).getTime() < Date.now()) {
      showExpiredQuoteCard('Your fare quote has expired. Please search again to get the latest price.');
      return;
    }
    vehicle = quote.vehicles?.find(item => item.code === vehicleCode);
    if (!vehicle) vehicle = getFallbackVehicle(vehicleCode);
    renderSummary(quote.trip || {}, vehicle);
  }).catch(err => {
    if (err && err.status === 410) {
      showExpiredQuoteCard('Your fare quote has expired. Please search again to get the latest price.');
      return;
    }
    vehicle = getFallbackVehicle(vehicleCode);
    const fallbackTrip = {
      pickup: params.get('pickup') || 'London Pickup Location',
      dropoff: params.get('dropoff') || 'Airport / Destination',
      pickup_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
      passengers: params.get('passengers') || '1'
    };
    renderSummary(fallbackTrip, vehicle);
  });

  const radioButtons = document.querySelectorAll('input[name="paymentMethod"]');
  const submitBtn = document.querySelector('#submit-booking-btn');
  const cardBox = document.querySelector('#card-option-box');
  const cashBox = document.querySelector('#cash-option-box');

  const getSelectedMethod = () => {
    const checked = document.querySelector('input[name="paymentMethod"]:checked');
    return checked ? checked.value : 'card';
  };

  const updateSubmitButtonText = () => {
    const selected = getSelectedMethod();
    if (selected === 'cash') {
      submitBtn.innerHTML = 'Confirm Reservation & Pay Cash in Car <i class="bi bi-check-circle-fill"></i>';
      submitBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)';
      submitBtn.style.borderColor = '#1e7e34';
      submitBtn.style.color = '#ffffff';
      if (cardBox) cardBox.classList.remove('active');
      if (cashBox) cashBox.classList.add('active');
    } else {
      submitBtn.innerHTML = 'Pay Securely Online Now <i class="bi bi-lock-fill"></i>';
      submitBtn.style.background = 'linear-gradient(135deg, #f6c400 0%, #d8b100 100%)';
      submitBtn.style.borderColor = '#d0ab00';
      submitBtn.style.color = '#141412';
      if (cardBox) cardBox.classList.add('active');
      if (cashBox) cashBox.classList.remove('active');
    }
  };

  radioButtons.forEach(radio => radio.addEventListener('change', updateSubmitButtonText));
  updateSubmitButtonText();

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!vehicle) return;
    const button = form.querySelector('button');

    const termsBox = document.querySelector('#terms-agree');
    if (termsBox && !termsBox.checked) {
      message.textContent = 'Please accept the Terms & Conditions before completing your booking.';
      return;
    }

    button.disabled = true;
    const selectedMethod = getSelectedMethod();
    
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
        await api('/api/payments/pay-in-car', {
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
      if (error && (error.status === 410 || String(error.message || '').toLowerCase().includes('expired'))) {
        showExpiredQuoteCard('Your fare quote has expired. Please search again to get the latest price.');
        return;
      }
      message.textContent = error.message;
      button.disabled = false;
    }
  });
})();
