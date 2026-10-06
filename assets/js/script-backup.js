(() => {
  document.querySelectorAll('a.signin').forEach(link => { link.href = 'account.html'; });
  fetch('/api/auth/me', { credentials: 'same-origin' }).then(response => {
    if (!response.ok) return;
    document.querySelectorAll('a.signin').forEach(link => { link.textContent = 'My trips'; });
  }).catch(() => {});

  const menu = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeMenu = () => { menu?.setAttribute('aria-expanded', 'false'); mobileNav?.classList.remove('open'); };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileNav?.classList.toggle('open', open);
  });
  mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.desktop-nav a,.mobile-nav a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === path) link.classList.add('active');
  });
  document.querySelectorAll('.desktop-nav a').forEach(link => {
    if (!link.querySelector('.bi-chevron-down')) return;
    link.setAttribute('aria-haspopup', 'true'); link.setAttribute('aria-expanded', 'false');
    const wrap = document.createElement('div'); wrap.className = 'nav-dropdown-wrap';
    link.parentNode.insertBefore(wrap, link); wrap.append(link);
    const menu = document.createElement('div'); menu.className = 'nav-dropdown'; menu.hidden = true;
    const entries = link.textContent.trim().startsWith('Services')
      ? [['All services','services.html'],['Airport transfers','airport-transfers.html'],['Event transfers','event-transfers.html'],['London tours','tours.html'],['Child seat guide','child-seat.html'],['Blogs & Guides','blogs.html'],['Terms & Conditions','terms.html']]
      : [['Family travel','index.html#family'],['Blogs & Guides','blogs.html'],['Terms & Conditions','terms.html'],['Booking','booking.html']];
    entries.forEach(([label,url]) => { const item=document.createElement('a'); item.href=url; item.textContent=label; menu.append(item); });
    wrap.append(menu);
    link.addEventListener('click', event => { event.preventDefault(); const open=menu.hidden; document.querySelectorAll('.nav-dropdown').forEach(other=>{other.hidden=true;other.parentElement.querySelector('[aria-haspopup]')?.setAttribute('aria-expanded','false')}); menu.hidden=!open;link.setAttribute('aria-expanded',String(open)); });
  });

  // ... (preset locations and map initialization)

  document.addEventListener('click', event => { if (!event.target.closest('.nav-dropdown-wrap')) document.querySelectorAll('.nav-dropdown').forEach(panel=>{panel.hidden=true;panel.parentElement.querySelector('[aria-haspopup]')?.setAttribute('aria-expanded','false')}); });
  document.addEventListener('keydown', event => { if(event.key==='Escape') document.querySelectorAll('.nav-dropdown').forEach(panel=>{panel.hidden=true;panel.parentElement.querySelector('[aria-haspopup]')?.setAttribute('aria-expanded','false')}); });

  // Preset popular UK locations & airports
  const UK_PRESET_LOCATIONS = [
    { title: "Heathrow Airport Terminal 2 & 3", tag: "Airport", lat: 51.4700, lng: -0.4543 },
    { title: "Heathrow Airport Terminal 4", tag: "Airport", lat: 51.4586, lng: -0.4449 },
    { title: "Heathrow Airport Terminal 5", tag: "Airport", lat: 51.4723, lng: -0.4879 },
    { title: "Gatwick Airport North Terminal", tag: "Airport", lat: 51.1578, lng: -0.1772 },
    { title: "Gatwick Airport South Terminal", tag: "Airport", lat: 51.1541, lng: -0.1625 },
    { title: "Stansted Airport", tag: "Airport", lat: 51.8860, lng: 0.2389 },
    { title: "Luton Airport", tag: "Airport", lat: 51.8763, lng: -0.3717 },
    { title: "London City Airport", tag: "Airport", lat: 51.5048, lng: 0.0495 },
    { title: "Stockley Park, Uxbridge (UB11 1FW)", tag: "J Transport HQ", lat: 51.5165, lng: -0.4362 },
    { title: "Uxbridge Town Centre (UB8)", tag: "Side Area", lat: 51.5465, lng: -0.4777 },
    { title: "Slough Town & Station (SL1)", tag: "Side Area", lat: 51.5105, lng: -0.5940 },
    { title: "Langley, Slough (SL3)", tag: "Side Area", lat: 51.5074, lng: -0.5482 },
    { title: "Staines-upon-Thames (TW18)", tag: "Side Area", lat: 51.4338, lng: -0.5147 },
    { title: "Windsor & Eton (SL4)", tag: "Side Area", lat: 51.4839, lng: -0.6044 },
    { title: "Maidenhead (SL6)", tag: "Side Area", lat: 51.5218, lng: -0.7198 },
    { title: "Reading Town Centre (RG1)", tag: "Town", lat: 51.4543, lng: -0.9781 },
    { title: "High Wycombe (HP11)", tag: "Town", lat: 51.6287, lng: -0.7482 },
    { title: "Watford Town Centre (WD17)", tag: "Side Area", lat: 51.6565, lng: -0.3903 },
    { title: "Harrow & Wealdstone (HA1)", tag: "Side Area", lat: 51.5806, lng: -0.3340 },
    { title: "Ealing Broadway (W5)", tag: "Side Area", lat: 51.5149, lng: -0.3018 },
    { title: "Richmond upon Thames (TW9)", tag: "Side Area", lat: 51.4613, lng: -0.3037 },
    { title: "Kingston upon Thames (KT1)", tag: "Side Area", lat: 51.4123, lng: -0.3007 },
    { title: "Wimbledon (SW19)", tag: "Side Area", lat: 51.4214, lng: -0.2064 },
    { title: "Croydon Town Centre (CR0)", tag: "Side Area", lat: 51.3762, lng: -0.0982 },
    { title: "Bromley Town Centre (BR1)", tag: "Side Area", lat: 51.4060, lng: 0.0152 },
    { title: "Dartford (DA1)", tag: "Side Area", lat: 51.4464, lng: 0.2184 },
    { title: "Romford Town Centre (RM1)", tag: "Side Area", lat: 51.5768, lng: 0.1837 },
    { title: "Enfield Town (EN1)", tag: "Side Area", lat: 51.6538, lng: -0.0798 },
    { title: "Central London (EC1, WC1, W1, SW1)", tag: "Central Hub", lat: 51.5074, lng: -0.1278 },
    { title: "King's Cross & St Pancras Station", tag: "Station", lat: 51.5320, lng: -0.1261 },
    { title: "Paddington Station (W2 1HB)", tag: "Station", lat: 51.5154, lng: -0.1755 },
    { title: "Victoria Station (SW1V 1JT)", tag: "Station", lat: 51.4952, lng: -0.1441 },
    { title: "London Bridge Station (SE1 9SP)", tag: "Station", lat: 51.5055, lng: -0.0860 },
    { title: "Waterloo Station (SE1 8SW)", tag: "Station", lat: 51.5031, lng: -0.1132 },
    { title: "Canary Wharf (E14 5AB)", tag: "Financial Hub", lat: 51.5054, lng: -0.0275 }
  ];

  let leafletMap = null;
  let mapMarkers = [];
  let mapPolyline = null;
  let activeNominatimController = null;

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  function initMapContainer() {
    const form = document.querySelector('#booking-form');
    if (!form) return null;

    if (!form.querySelector('.form-inputs-side')) {
      const inputsWrap = document.createElement('div');
      inputsWrap.className = 'form-inputs-side';
      while (form.firstChild) {
        inputsWrap.appendChild(form.firstChild);
      }
      form.appendChild(inputsWrap);
    }

    let mapCard = document.querySelector('#map-card-wrapper');
    if (!mapCard) {
      mapCard = document.createElement('div');
      mapCard.id = 'map-card-wrapper';
      mapCard.className = 'map-card-wrapper';
      mapCard.innerHTML = `
        <div id="route-map" class="route-map"></div>
        <div class="map-info-bar">
          <span><i class="bi bi-geo-fill" style="color:#d0ab00"></i> UK Route &amp; Distance Preview</span>
          <span id="distance-badge" class="distance-badge"><i class="bi bi-speedometer2"></i> Select locations</span>
        </div>
      `;
      form.appendChild(mapCard);
      form.classList.add('has-side-map');
    }

    const mapEl = document.querySelector('#route-map');
    if (mapEl && typeof L !== 'undefined' && !leafletMap) {
      leafletMap = L.map('route-map').setView([51.5074, -0.1278], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(leafletMap);
    }
    if (leafletMap) {
      setTimeout(() => { leafletMap.invalidateSize(); }, 300);
    }
    return leafletMap;
  }

  function getCoordsForPlace(placeName, inputEl) {
    if (!placeName) return null;
    if (inputEl && inputEl.dataset.lat && inputEl.dataset.lng) {
      return { lat: parseFloat(inputEl.dataset.lat), lng: parseFloat(inputEl.dataset.lng) };
    }
    const lowered = placeName.toLowerCase().trim();
    const preset = UK_PRESET_LOCATIONS.find(item => item.title.toLowerCase().includes(lowered) || lowered.includes(item.title.toLowerCase()));
    if (preset) return { lat: preset.lat, lng: preset.lng };

    if (lowered.includes('heathrow')) return { lat: 51.4700, lng: -0.4543 };
    if (lowered.includes('gatwick')) return { lat: 51.1578, lng: -0.1772 };
    if (lowered.includes('stansted')) return { lat: 51.8860, lng: 0.2389 };
    if (lowered.includes('luton')) return { lat: 51.8763, lng: -0.3717 };
    if (lowered.includes('city airport')) return { lat: 51.5048, lng: 0.0495 };
    if (lowered.includes('stockley')) return { lat: 51.5165, lng: -0.4362 };
    if (lowered.includes('paddington')) return { lat: 51.5154, lng: -0.1755 };
    if (lowered.includes('victoria')) return { lat: 51.4952, lng: -0.1441 };
    if (lowered.includes('king') && lowered.includes('cross')) return { lat: 51.5320, lng: -0.1261 };

    // Deterministic offset based on string hash - prevents random jumping on input
    const h = hashString(lowered);
    const latOffset = (((Math.abs(h) % 1000) / 1000) - 0.5) * 0.15;
    const lngOffset = (((Math.abs(h * 13) % 1000) / 1000) - 0.5) * 0.20;
    return { lat: 51.5074 + latOffset, lng: -0.1278 + lngOffset };
  }

  function calculateDistanceMiles(coord1, coord2) {
    if (!coord1 || !coord2) return 0;
    const R = 3958.8; // Earth's radius in miles
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const miles = R * c * 1.25; // Driving distance multiplier
    return Math.max(1, Math.round(miles * 10) / 10);
  }

  function updateRouteMap() {
    initMapContainer();
    if (!leafletMap) return;

    const pickupInput = document.querySelector('#pickup');
    const dropoffInput = document.querySelector('#dropoff');
    const pickupVal = pickupInput?.value.trim();
    const dropoffVal = dropoffInput?.value.trim();

    mapMarkers.forEach(m => leafletMap.removeLayer(m));
    mapMarkers = [];
    if (mapPolyline) { leafletMap.removeLayer(mapPolyline); mapPolyline = null; }

    const badge = document.querySelector('#distance-badge');

    if (!pickupVal && !dropoffVal) {
      if (badge) badge.innerHTML = `<i class="bi bi-speedometer2"></i> Select locations`;
      return;
    }

    const c1 = pickupVal ? getCoordsForPlace(pickupVal, pickupInput) : null;
    const c2 = dropoffVal ? getCoordsForPlace(dropoffVal, dropoffInput) : null;

    const bounds = [];
    if (c1) {
      const m1 = L.marker([c1.lat, c1.lng]).addTo(leafletMap).bindPopup(`<b>Pickup:</b> ${pickupVal}`);
      mapMarkers.push(m1);
      bounds.push([c1.lat, c1.lng]);
    }
    if (c2) {
      const m2 = L.marker([c2.lat, c2.lng]).addTo(leafletMap).bindPopup(`<b>Drop-off:</b> ${dropoffVal}`);
      mapMarkers.push(m2);
      bounds.push([c2.lat, c2.lng]);
    }

    if (c1 && c2) {
      mapPolyline = L.polyline([[c1.lat, c1.lng], [c2.lat, c2.lng]], { color: '#d0ab00', weight: 4, opacity: 0.8, dashArray: '6, 8' }).addTo(leafletMap);
      const miles = calculateDistanceMiles(c1, c2);
      
      let estPrice = Math.max(45, Math.round((55 + miles * 2.50) * 0.95));
      const combo = (pickupVal + ' ' + dropoffVal).toLowerCase();
      const isLongCity = ['manchester','birmingham','liverpool','bristol','salisbury','oxford','cambridge','leeds','cardiff','reading','slough','brighton','southampton'].some(c => combo.includes(c));
      if (!isLongCity) {
        if (combo.includes('heathrow')) estPrice = 85.50;
        else if (combo.includes('gatwick')) estPrice = 104.50;
        else if (combo.includes('stansted') || combo.includes('luton')) estPrice = 90.25;
        else if (combo.includes('city airport') || combo.includes('london city')) estPrice = 47.50;
      }

      if (badge) {
        badge.innerHTML = `<i class="bi bi-geo-alt-fill"></i> ${miles} miles Â· <b style="color:#0f5313;background:#e2f5e3;padding:2px 8px;border-radius:12px;">Est. Saloon: Â£${estPrice.toFixed(2)}</b>`;
      }
      leafletMap.fitBounds(bounds, { padding: [30, 30] });

      // Auto refresh quotes on booking page when locations change
      if (path.toLowerCase() === 'booking.html' && form) {
        clearTimeout(window._autoQuoteTimer);
        window._autoQuoteTimer = setTimeout(() => {
          if (pickupVal.length >= 3 && dropoffVal.length >= 3) {
            form.dispatchEvent(new Event('submit', { cancelable: true }));
          }
        }, 600);
      }
    } else if (bounds.length) {
      leafletMap.setView(bounds[0], 11);
      if (badge) badge.innerHTML = `<i class="bi bi-geo"></i> Location pinned`;
    }
    leafletMap.invalidateSize();
  }

  function setupLocationAutocomplete(inputEl) {
    if (!inputEl) return;
    const parent = inputEl.parentElement;
    if (!parent) return;

    let dropdown = parent.querySelector('.autocomplete-dropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'autocomplete-dropdown';
      dropdown.hidden = true;
      parent.classList.add('autocomplete-wrapper');
      parent.appendChild(dropdown);
    }

    let debounceTimer;

    const renderItems = (items) => {
      dropdown.replaceChildren();
      if (!items.length) { dropdown.hidden = true; return; }
      items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'autocomplete-item';
        el.innerHTML = `<i class="bi bi-geo-alt-fill"></i><span class="item-title">${item.title}</span><span class="item-tag">${item.tag || 'UK'}</span>`;
        el.addEventListener('mousedown', (e) => {
          e.preventDefault();
          inputEl.value = item.title;
          if (item.lat && item.lng) {
            inputEl.dataset.lat = item.lat;
            inputEl.dataset.lng = item.lng;
          } else {
            delete inputEl.dataset.lat;
            delete inputEl.dataset.lng;
          }
          dropdown.hidden = true;
          updateRouteMap();
        });
        dropdown.appendChild(el);
      });
      dropdown.hidden = false;
    };

    inputEl.addEventListener('focus', () => {
      const val = inputEl.value.trim().toLowerCase();
      if (!val) {
        renderItems(UK_PRESET_LOCATIONS.slice(0, 7));
      }
    });

    inputEl.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      delete inputEl.dataset.lat;
      delete inputEl.dataset.lng;

      const query = inputEl.value.trim().toLowerCase();
      if (!query) {
        renderItems(UK_PRESET_LOCATIONS.slice(0, 7));
        return;
      }
      const matches = UK_PRESET_LOCATIONS.filter(item => item.title.toLowerCase().includes(query) || (item.tag && item.tag.toLowerCase().includes(query)));
      renderItems(matches.slice(0, 7));

      if (query.length >= 2) {
        debounceTimer = setTimeout(async () => {
          try {
            if (activeNominatimController) activeNominatimController.abort();
            activeNominatimController = new AbortController();
            const timeoutId = setTimeout(() => activeNominatimController.abort(), 2000);

            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=gb&q=${encodeURIComponent(query)}&limit=5`, {
              signal: activeNominatimController.signal
            });
            clearTimeout(timeoutId);
            if (!res.ok) return;
            const data = await res.json();
            if (data && data.length) {
              const liveItems = data.map(place => ({
                title: place.display_name.split(',').slice(0, 3).join(','),
                tag: 'UK Address',
                lat: parseFloat(place.lat),
                lng: parseFloat(place.lon)
              }));
              const combined = [...matches, ...liveItems];
              const unique = Array.from(new Map(combined.map(item => [item.title, item])).values());
              renderItems(unique.slice(0, 7));
            }
          } catch (_) {}
        }, 300);
      }
    });

    inputEl.addEventListener('blur', () => {
      setTimeout(() => { dropdown.hidden = true; }, 220);
    });
  }

  const form = document.querySelector('#booking-form');
  const pickupDate = document.querySelector('#pickup-date');
  const pickupTime = document.querySelector('#pickup-time');
  const returnDate = document.querySelector('#return-date');
  const returnTime = document.querySelector('#return-time');

  const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  if (pickupDate) pickupDate.min = today.toISOString().slice(0, 10);
  if (returnDate) returnDate.min = today.toISOString().slice(0, 10);

  document.querySelector('.swap')?.addEventListener('click', () => {
    const from = document.querySelector('#pickup'), to = document.querySelector('#dropoff');
    if (from && to) {
      [from.value, to.value] = [to.value, from.value];
      updateRouteMap();
    }
  });
  document.querySelector('.add-destination')?.addEventListener('click', () => {
    const existing = document.querySelector('.destination-row');
    if (existing) { existing.querySelector('input').focus(); return; }
    const row = document.createElement('div'); row.className = 'destination-row';
    row.innerHTML = '<label class="field"><span class="visually-hidden">Additional destination</span><div><i class="bi bi-geo-alt"></i><input id="via" placeholder="Add a stop on your journey"></div></label><button type="button" class="remove-destination" aria-label="Remove destination"><i class="bi bi-x-lg"></i></button>';
    const routes = form.querySelector('.route-fields');
    if (routes) routes.insertBefore(row, routes.querySelector('.swap'));
    else form.append(row);
    row.querySelector('.remove-destination').addEventListener('click', () => row.remove());
    row.querySelector('input').focus();
    setupLocationAutocomplete(row.querySelector('input'));
  });

  const pickupIn = document.querySelector('#pickup');
  const dropoffIn = document.querySelector('#dropoff');
  setupLocationAutocomplete(pickupIn);
  setupLocationAutocomplete(dropoffIn);
  pickupIn?.addEventListener('change', updateRouteMap);
  dropoffIn?.addEventListener('change', updateRouteMap);

  const readForm = () => {
    return {
      pickup: document.querySelector('#pickup')?.value || '',
      dropoff: document.querySelector('#dropoff')?.value || '',
      pickupDate: document.querySelector('#pickup-date')?.value || '',
      pickupTime: document.querySelector('#pickup-time')?.value || '',
      returnDate: document.querySelector('#return-date')?.value || '',
      returnTime: document.querySelector('#return-time')?.value || '',
      promo: document.querySelector('#promo')?.value || '',
      passengers: document.querySelector('#passengers')?.value || '1 passenger',
      via: document.querySelector('#via')?.value || ''
    };
  };
  const params = new URLSearchParams(location.search);
  Object.entries({pickup:'pickup',dropoff:'dropoff',pickupDate:'pickup-date',pickupTime:'pickup-time',returnDate:'return-date',returnTime:'return-time',promo:'promo',passengers:'passengers',via:'via'}).forEach(([key,id]) => {
    const control = document.getElementById(id), value = params.get(key);
    if (control && value) control.value = value;
  });
  if (params.get('via') && form && !document.getElementById('via')) {
    document.querySelector('.add-destination')?.click();
    const via = document.getElementById('via'); if (via) via.value = params.get('via');
  }

  if (path.toLowerCase() === 'booking.html' && params.get('pickup') && params.get('dropoff') && form) {
    setTimeout(() => {
      if (typeof form.requestSubmit === 'function') form.requestSubmit();
      else form.dispatchEvent(new Event('submit', { cancelable: true }));
    }, 200);
  }

  setTimeout(updateRouteMap, 400);

  const pounds = pence => 'Â£' + (pence / 100).toFixed(2);

  function generateClientFallbackQuotes(info) {
    const pickupVal = info.pickup || 'London';
    const dropoffVal = info.dropoff || 'Airport';
    const combo = (pickupVal + ' ' + dropoffVal).toLowerCase();
    
    let basePrice = 85.50;
    if (combo.includes('gatwick')) basePrice = 104.50;
    else if (combo.includes('stansted') || combo.includes('luton')) basePrice = 90.25;
    else if (combo.includes('city airport') || combo.includes('london city')) basePrice = 47.50;
    else if (combo.includes('heathrow')) basePrice = 85.50;
    else if (combo.includes('manchester')) basePrice = 380.00;
    else if (combo.includes('birmingham')) basePrice = 240.00;
    else if (combo.includes('liverpool')) basePrice = 350.00;
    else if (combo.includes('bristol')) basePrice = 220.00;
    else if (combo.includes('salisbury')) basePrice = 180.00;
    else if (combo.includes('southampton')) basePrice = 160.00;
    else if (combo.includes('dover')) basePrice = 175.00;

    if (info.returnDate) {
      basePrice = basePrice * 1.95;
    }

    const nowMs = Date.now();
    const expiresMs = nowMs + 15 * 60 * 1000;
    const quoteId = 'q_' + nowMs + '_' + Math.random().toString(36).substring(2, 8);
    
    const vehicles = [
      {
        code: 'saloon',
        name: 'Saloon Car',
        image: 'assets/images/saloon.png',
        luggage: 'Up to 2 Large Suitcases',
        examples: 'Toyota Corolla, VW Golf, Prius',
        breakdown: { totalPence: Math.round(basePrice * 100) }
      },
      {
        code: 'estate',
        name: 'Estate Car',
        image: 'assets/images/estate.png',
        luggage: 'Up to 3 Large Suitcases',
        examples: 'VW Passat Estate, Skoda Superb',
        breakdown: { totalPence: Math.round((basePrice + 10) * 100) }
      },
      {
        code: 'mpv',
        name: 'MPV (5 Seater)',
        image: 'assets/images/mpv.png',
        luggage: 'Up to 4 Large Suitcases',
        examples: 'VW Multivan or Ford Tourneo',
        breakdown: { totalPence: Math.round((basePrice + 25) * 100) }
      },
      {
        code: 'executive',
        name: 'Executive Saloon',
        image: 'assets/images/executive-saloon.png',
        luggage: 'Premium Leather Interior',
        examples: 'Mercedes-Benz E-Class, BMW 5 Series',
        breakdown: { totalPence: Math.round((basePrice + 30) * 100) }
      },
      {
        code: 'exec-mpv',
        name: 'Executive MPV (6 Seater)',
        image: 'assets/images/mpv-plus.png',
        luggage: 'Luxury Chauffeur Minivan',
        examples: 'Mercedes-Benz V-Class',
        breakdown: { totalPence: Math.round((basePrice + 60) * 100) }
      },
      {
        code: 'minivan8',
        name: '8 Seater Minivan',
        image: 'assets/images/minivan.png',
        luggage: 'Up to 8 Large Suitcases',
        examples: 'Mercedes-Benz Vito 8 Seater',
        breakdown: { totalPence: Math.round((basePrice + 45) * 100) }
      }
    ];

    return { id: quoteId, quoteId, createdAt: nowMs, expiresAt: expiresMs, quoteCreatedAt: new Date(nowMs).toISOString(), quoteExpiresAt: new Date(expiresMs).toISOString(), vehicles };
  }

  const renderQuotes = quote => {
    const host = document.querySelector('#quote-results');
    if (!host) return;
    host.hidden = false;
    host.replaceChildren();
    const title = document.createElement('h3');
    title.textContent = 'Choose a vehicle for your transfer';
    host.append(title);
    const validQuoteId = quote.id || quote.quoteId;
    quote.vehicles.forEach(vehicle => {
      const card = document.createElement('article');
      card.className = 'quote-card';
      const image = document.createElement('img');
      image.src = vehicle.image;
      image.alt = vehicle.name;
      const copy = document.createElement('div');
      const heading = document.createElement('h4');
      heading.textContent = vehicle.name;
      const luggage = document.createElement('p');
      luggage.textContent = vehicle.luggage + ' Â· ' + vehicle.examples;
      const price = document.createElement('strong');
      price.textContent = pounds(vehicle.breakdown.totalPence);
      copy.append(heading, luggage, price);
      const link = document.createElement('a');
      link.className = 'search-button';
      link.href = 'checkout.html?quote=' + encodeURIComponent(validQuoteId) + '&vehicle=' + encodeURIComponent(vehicle.code);
      link.textContent = 'Book and pay';
      card.append(image, copy, link);
      host.append(card);
    });
    host.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if (returnDate && returnTime) {
      returnDate.setCustomValidity(returnTime.value && !returnDate.value ? 'Please select a return date.' : '');
      returnTime.setCustomValidity(returnDate.value && !returnTime.value ? 'Please select a return time.' : '');
    }
    if (!form.reportValidity()) return;
    const button = form.querySelector('.search-button'), message = form.querySelector('.form-message');
    const originalButton = button.innerHTML;
    const info = readForm();
    button.disabled = true; button.classList.add('is-loading');
    button.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Checkingâ€¦';
    if (path.toLowerCase() !== 'booking.html') {
      window.setTimeout(() => { window.location.href = 'booking.html?' + new URLSearchParams(info).toString(); }, 350);
      return;
    }
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
      });
      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        renderQuotes(data);
      } else {
        const fallback = generateClientFallbackQuotes(info);
        renderQuotes(fallback);
      }
      if (message) { message.textContent = 'Prices are fixed for this search. Choose a vehicle to pay securely.'; message.classList.add('success'); }
    } catch (error) {
      const fallback = generateClientFallbackQuotes(info);
      renderQuotes(fallback);
      if (message) { message.textContent = 'Prices are fixed for this search. Choose a vehicle to pay securely.'; message.classList.add('success'); }
    } finally {
      button.disabled = false; button.classList.remove('is-loading');
      button.innerHTML = originalButton;
    }
  });
  const airportDetails = {
    'Heathrow': {
      desc: 'Your driver tracks your inbound flight and adjusts pickup timing if you land early or late. Serving Terminals 2, 3, 4 and 5 with 60 mins free waiting time.',
      img: 'assets/images/airports/heathrow.jpg',
      fromPrice: 'Â£85.50',
      code: 'LHR Â· Terminals 2, 3, 4 & 5'
    },
    'Gatwick': {
      desc: 'Take the direct, comfortable route between Gatwick North/South terminals and London. Flight tracking and meet & greet included.',
      img: 'assets/images/airports/gatwick.jpg',
      fromPrice: 'Â£104.50',
      code: 'LGW Â· North & South Terminals'
    },
    'Stansted': {
      desc: 'Make your Stansted arrival easier with a pre-booked private transfer and a driver ready to meet you at arrivals.',
      img: 'assets/images/airports/stansted.jpg',
      fromPrice: 'Â£90.25',
      code: 'STN Â· Main Terminal'
    },
    'Luton': {
      desc: 'Avoid extra connections after landing. Your driver will be ready to help with luggage and take you directly into London.',
      img: 'assets/images/airports/luton.jpg',
      fromPrice: 'Â£90.25',
      code: 'LTN Â· Main Terminal'
    },
    'London City': {
      desc: 'A smooth pickup from London City Airport in Docklands, whether heading to a financial meeting, hotel or home.',
      img: 'assets/images/airports/london_city.jpg',
      fromPrice: 'Â£47.50',
      code: 'LCY Â· Docklands Terminal'
    }
  };

  document.querySelectorAll('.airport-tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.airport-tab').forEach(item => {
      item.classList.toggle('active', item === tab);
      item.setAttribute('aria-selected', String(item === tab));
    });
    const name = tab.dataset.airport;
    const detail = airportDetails[name];
    const copy = document.querySelector('.airport-copy');
    if (copy && detail) {
      copy.innerHTML = `
        <div class="airport-card-inner">
          <div class="airport-copy-text">
            <span class="section-kicker">${detail.code}</span>
            <h3>${name} Airport Transfers</h3>
            <p>${detail.desc}</p>
            <div class="airport-price-tag"><i class="bi bi-tag-fill"></i> Fixed Fares from <b>${detail.fromPrice}</b> (5% Discount Included)</div>
            <a class="yellow-pill mt-3" href="booking.html?pickup=${encodeURIComponent(name + ' Airport')}">Book ${name} Transfer <i class="bi bi-arrow-right"></i></a>
          </div>
          <div class="airport-copy-media">
            <img src="${detail.img}" alt="${name} Airport" class="airport-tab-image">
          </div>
        </div>
      `;
    }
  }));
  const airportParam = new URLSearchParams(location.search).get('airport');
  const initialAirport = [...document.querySelectorAll('.airport-tab')].find(tab => tab.dataset.airport.toLowerCase() === (airportParam || '').toLowerCase());
  initialAirport?.click();
  const chat = document.querySelector('.chat-float'), popover = document.querySelector('.chat-popover');
  chat?.addEventListener('click', () => chat.setAttribute('aria-expanded', String(popover.classList.toggle('open'))));
  popover?.querySelector('button')?.addEventListener('click', () => { popover.classList.remove('open'); chat?.setAttribute('aria-expanded','false'); });
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('.fleet-track,.seat-track,.service-track');
    const dots = carousel.querySelector('.carousel-dots');
    if (!track || !dots) return;
    const cards = [...track.children];
    const getStep = () => {
      const first = cards[0];
      if (!first) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return first.getBoundingClientRect().width + gap;
    };
    const perPage = () => Math.max(1, Math.round(track.clientWidth / getStep()));
    const pageCount = () => Math.max(1, Math.ceil(cards.length / perPage()));
    let active = 0;
    const renderDots = () => {
      dots.replaceChildren();
      for (let i = 0; i < pageCount(); i++) {
        const dot = document.createElement('button');
        dot.type = 'button'; dot.className = i === active ? 'active' : '';
        dot.setAttribute('aria-label', `Show ${carousel.dataset.carousel} items ${i * perPage() + 1} to ${Math.min(cards.length, (i + 1) * perPage())}`);
        dot.addEventListener('click', () => { active = i; track.scrollTo({left: i * perPage() * getStep(), behavior: 'smooth'}); update(); });
        dots.append(dot);
      }
    };
    const update = () => {
      active = Math.min(pageCount() - 1, Math.round(track.scrollLeft / (perPage() * getStep())));
      [...dots.children].forEach((dot, i) => { dot.classList.toggle('active', i === active); dot.setAttribute('aria-current', i === active ? 'true' : 'false'); });
    };
    renderDots(); update();
    track.addEventListener('scroll', () => requestAnimationFrame(update), {passive: true});
    carousel.querySelectorAll('[data-move]').forEach(button => button.addEventListener('click', () => {
      const delta = button.dataset.move === 'next' ? 1 : -1;
      active = (active + delta + pageCount()) % pageCount();
      track.scrollTo({left: active * perPage() * getStep(), behavior: 'smooth'});
    }));
    window.addEventListener('resize', () => { active = 0; renderDots(); track.scrollTo({left: 0}); update(); });
  });
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), {threshold: .12});
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  } else document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
})();



