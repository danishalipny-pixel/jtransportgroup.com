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

  const tripType = params.get('type') || 'oneway';
  const effectiveQuoteId = quoteId || ('q_demo_' + Date.now());
  const effectiveVehicleCode = vehicleCode || 'saloon';

  const pounds = pence => {
    const val = (pence || 0) / 100;
    return '£' + (val % 1 === 0 ? val.toFixed(0) : val.toFixed(2));
  };

  const VEHICLE_CATALOG = {
    saloon: { name: 'Saloon Car', price: 90.00, desc: 'Up to 2 Large Suitcases · Toyota Corolla, VW Golf, Prius' },
    estate: { name: 'Estate Car', price: 100.00, desc: 'Up to 3 Large Suitcases · VW Passat Estate, Skoda Superb' },
    mpv: { name: 'MPV 5', price: 110.00, desc: 'Up to 4 Large Suitcases · VW Multivan or Ford Tourneo' },
    mpv5: { name: 'MPV 5', price: 110.00, desc: 'Up to 4 Large Suitcases · VW Multivan or Ford Tourneo' },
    executive: { name: 'Executive Saloon', price: 110.00, desc: 'Premium Leather Interior · Mercedes-Benz E-Class, BMW 5 Series' },
    'exec-mpv': { name: 'Executive MPV (6 Seater)', price: 150.00, desc: 'Luxury Chauffeur Minivan · Mercedes-Benz V-Class' },
    exec_mpv: { name: 'Executive MPV (6 Seater)', price: 150.00, desc: 'Luxury Chauffeur Minivan · Mercedes-Benz V-Class' },
    minivan8: { name: '8 Seater Minivan', price: 130.00, desc: 'Up to 8 Large Suitcases · Mercedes-Benz Vito 8 Seater' },
    mpv8: { name: '8 Seater Minivan', price: 130.00, desc: 'Up to 8 Large Suitcases · Mercedes-Benz Vito 8 Seater' },
    sprinter: { name: 'Mercedes Sprinter', price: 230.00, desc: 'Up to 16 Luggage Pieces · Luxury Minibus for Group Travel' }
  };

  const getFallbackVehicle = code => {
    const raw = String(code || 'saloon').toLowerCase();
    const normalized = raw.replace('-', '_');
    const hyphenated = raw.replace('_', '-');
    const item = VEHICLE_CATALOG[raw] || VEHICLE_CATALOG[normalized] || VEHICLE_CATALOG[hyphenated] || VEHICLE_CATALOG['saloon'];
    const oneWay = Math.round(item.price * 100);
    const retOrig = oneWay * 2;
    const retTot = Math.round(retOrig * 0.95);
    return {
      code: code || 'saloon',
      name: item.name,
      breakdown: {
        totalPence: oneWay,
        oneWayTotalPence: oneWay,
        returnOriginalPence: retOrig,
        returnTotalPence: retTot,
        returnSavingsPence: retOrig - retTot
      }
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
    
    const isReturn = tripType === 'return';
    if (isReturn) {
      when.textContent = 'Pickup: ' + pickTime + (retTime ? ' · Return: ' + retTime : ' · Return Transfer');
    } else {
      when.textContent = 'Pickup: ' + pickTime + ' · One Way';
    }
    
    const bd = veh.breakdown || {};
    const tripFarePence = isReturn
      ? (bd.returnTotalPence || (bd.totalPence ? Math.round(bd.totalPence * 2 * 0.95) : 9500))
      : (bd.oneWayTotalPence || bd.totalPence || 5000);

    const chosen = document.createElement('p');
    chosen.style.fontSize = '15px';
    chosen.style.fontWeight = '700';
    chosen.style.color = '#b08d00';
    chosen.textContent = veh.name + ' · ' + (trip.passengers || 1) + ' Passengers · ' + (isReturn ? 'Return Fare: ' : 'One Way: ') + pounds(tripFarePence);
    
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

  api('/api/quotes/' + encodeURIComponent(effectiveQuoteId)).then(quote => {
    const expires = quote.expiresAt || quote.quoteExpiresAt;
    if (expires && new Date(expires).getTime() < Date.now()) {
      showExpiredQuoteCard('Your fare quote has expired. Please search again to get the latest price.');
      return;
    }
    const targetCode = String(effectiveVehicleCode || '').toLowerCase();
    vehicle = quote.vehicles?.find(item => {
      const c = String(item.code || '').toLowerCase();
      if (c === targetCode) return true;
      if (c.replace('_', '-') === targetCode.replace('_', '-')) return true;
      if ((c === 'mpv' || c === 'mpv5') && (targetCode === 'mpv' || targetCode === 'mpv5')) return true;
      if ((c === 'minivan8' || c === 'mpv8' || c === 'minivan') && (targetCode === 'minivan8' || targetCode === 'mpv8' || targetCode === 'minivan')) return true;
      if ((c === 'exec-mpv' || c === 'exec_mpv') && (targetCode === 'exec-mpv' || targetCode === 'exec_mpv')) return true;
      if ((c === 'executive' || c === 'executive-saloon') && (targetCode === 'executive' || targetCode === 'executive-saloon')) return true;
      return false;
    });
    if (!vehicle) vehicle = getFallbackVehicle(effectiveVehicleCode);
    renderSummary(quote.trip || {}, vehicle);
  }).catch(err => {
    if (err && err.status === 410) {
      showExpiredQuoteCard('Your fare quote has expired. Please search again to get the latest price.');
      return;
    }
    vehicle = getFallbackVehicle(effectiveVehicleCode);
    const fallbackTrip = {
      pickup: params.get('pickup') || 'London Pickup Location',
      dropoff: params.get('dropoff') || 'Airport / Destination',
      pickup_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
      passengers: params.get('passengers') || '1'
    };
    renderSummary(fallbackTrip, vehicle);
  });

  const submitBtn = document.querySelector('#submit-booking-btn');
  if (submitBtn) {
    submitBtn.innerHTML = 'Pay Securely Online Now <i class="bi bi-lock-fill"></i>';
    submitBtn.style.background = 'linear-gradient(135deg, #f6c400 0%, #d8b100 100%)';
    submitBtn.style.borderColor = '#d0ab00';
    submitBtn.style.color = '#141412';
  }

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
    message.textContent = 'Opening secure Stripe payment…';

    try {
      const booking = await api('/api/bookings', {
        method: 'POST',
        body: {
          quoteId: effectiveQuoteId,
          vehicle: vehicle?.code || effectiveVehicleCode,
          tripType: tripType,
          name: document.querySelector('#name').value,
          email: document.querySelector('#email').value,
          phone: document.querySelector('#phone').value,
          flightNumber: document.querySelector('#flight').value,
          notes: document.querySelector('#notes').value
        }
      });

      const payment = await api('/api/payments/checkout', {
        method: 'POST',
        body: { reference: booking.reference, cancelToken: booking.cancelToken }
      });
      if (!payment.url) throw new Error('Stripe did not return a payment page.');
      window.location.href = payment.url;
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
