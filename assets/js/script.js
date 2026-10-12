(() => {
  document.querySelectorAll('a.signin').forEach(link => { link.href = 'account.html'; });

  fetch('/api/auth/me', { credentials: 'same-origin' }).then(response => {
    if (!response.ok) return;
    document.querySelectorAll('a.signin').forEach(link => { link.textContent = 'My trips'; });
  }).catch(() => {});

  const menu = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  const closeMenu = () => {
    menu?.setAttribute('aria-expanded', 'false');
    mobileNav?.classList.remove('open');
  };

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

    link.setAttribute('aria-haspopup', 'true');
    link.setAttribute('aria-expanded', 'false');

    const wrap = document.createElement('div');
    wrap.className = 'nav-dropdown-wrap';

    link.parentNode.insertBefore(wrap, link);
    wrap.append(link);

    const menu = document.createElement('div');
    menu.className = 'nav-dropdown';
    menu.hidden = true;

    const entries = link.textContent.trim().startsWith('Services')
      ? [
          ['All services','services.html'],
          ['Airport transfers','airport-transfers.html'],
          ['Event transfers','event-transfers.html'],
          ['London tours','tours.html'],
          ['Child seat guide','child-seat.html'],
          ['Blogs & Guides','blogs.html'],
          ['Terms & Conditions','terms.html']
        ]
      : [
          ['Family travel','index.html#family'],
          ['Blogs & Guides','blogs.html'],
          ['Terms & Conditions','terms.html'],
          ['Booking','booking.html']
        ];

    entries.forEach(([label,url]) => {
      const item = document.createElement('a');
      item.href = url;
      item.textContent = label;
      menu.append(item);
    });

    wrap.append(menu);

    link.addEventListener('click', event => {
      event.preventDefault();

      const open = menu.hidden;

      document.querySelectorAll('.nav-dropdown').forEach(other => {
        other.hidden = true;
        other.parentElement
          .querySelector('[aria-haspopup]')
          ?.setAttribute('aria-expanded', 'false');
      });

      menu.hidden = !open;
      link.setAttribute('aria-expanded', String(open));
    });
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-dropdown-wrap')) {
      document.querySelectorAll('.nav-dropdown').forEach(panel => {
        panel.hidden = true;
        panel.parentElement
          .querySelector('[aria-haspopup]')
          ?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      document.querySelectorAll('.nav-dropdown').forEach(panel => {
        panel.hidden = true;
        panel.parentElement
          .querySelector('[aria-haspopup]')
          ?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // =========================================================
  // POPULAR UK LOCATIONS & AIRPORTS
  // =========================================================

  const UK_PRESET_LOCATIONS = [
    { title: "Brixton (SW9 8EN)", tag: "London Area", lat: 51.4613, lng: -0.1156 },
    { title: "Chelsea (SW3 5UE)", tag: "London Area", lat: 51.4875, lng: -0.1687 },
    { title: "Westminster (SW1H 0NP)", tag: "London Area", lat: 51.4975, lng: -0.1357 },
    { title: "Kensington (W8 9SB)", tag: "London Area", lat: 51.502, lng: -0.1947 },
    { title: "Paddington (W2 1HJ)", tag: "London Area", lat: 51.5154, lng: -0.1755 },
    { title: "Camden (NW1 7JL)", tag: "London Area", lat: 51.5364, lng: -0.1406 },
    { title: "Islington (N1 2XR)", tag: "London Area", lat: 51.5362, lng: -0.103 },
    { title: "Hammersmith (W6 9DL)", tag: "London Area", lat: 51.4927, lng: -0.2239 },
    { title: "Fulham (SW6 3ST)", tag: "London Area", lat: 51.4728, lng: -0.195 },
    { title: "Greenwich (SE10 9NN)", tag: "London Area", lat: 51.4826, lng: -0.0077 },
    { title: "Mayfair (W1J 5AW)", tag: "London Area", lat: 51.5098, lng: -0.1465 },
    { title: "Soho (W1D 3PU)", tag: "London Area", lat: 51.5137, lng: -0.1332 },
    { title: "Marylebone (W1U 5DT)", tag: "London Area", lat: 51.5215, lng: -0.1557 },
    { title: "Fitzrovia (W1W 7EY)", tag: "London Area", lat: 51.5197, lng: -0.1384 },
    { title: "Belgravia (SW1X 8PZ)", tag: "London Area", lat: 51.4984, lng: -0.154 },
    { title: "Pimlico (SW1V 2HX)", tag: "London Area", lat: 51.4892, lng: -0.1354 },
    { title: "Victoria (SW1V 1JT)", tag: "London Area", lat: 51.4952, lng: -0.1441 },
    { title: "Knightsbridge (SW1X 7RJ)", tag: "London Area", lat: 51.5015, lng: -0.1601 },
    { title: "Battersea (SW11 1HG)", tag: "London Area", lat: 51.4682, lng: -0.1652 },
    { title: "Clapham (SW4 7UD)", tag: "London Area", lat: 51.4623, lng: -0.1383 },
    { title: "Wandsworth (SW18 4LD)", tag: "London Area", lat: 51.4566, lng: -0.1925 },
    { title: "Tooting (SW17 0TA)", tag: "London Area", lat: 51.4276, lng: -0.1683 },
    { title: "Balham (SW12 9AY)", tag: "London Area", lat: 51.4431, lng: -0.1524 },
    { title: "Wimbledon (SW19 7NL)", tag: "London Area", lat: 51.4214, lng: -0.2064 },
    { title: "Putney (SW15 1RT)", tag: "London Area", lat: 51.4608, lng: -0.2166 },
    { title: "Notting Hill (W11 3LT)", tag: "London Area", lat: 51.5096, lng: -0.2043 },
    { title: "Shepherd's Bush (W12 8AT)", tag: "London Area", lat: 51.5049, lng: -0.2238 },
    { title: "Chiswick (W4 1QZ)", tag: "London Area", lat: 51.493, lng: -0.2586 },
    { title: "Ealing (W5 2NU)", tag: "London Area", lat: 51.5149, lng: -0.3018 },
    { title: "Acton (W3 9BY)", tag: "London Area", lat: 51.5085, lng: -0.2736 },
    { title: "Hampstead (NW3 1QS)", tag: "London Area", lat: 51.5558, lng: -0.1776 },
    { title: "Kilburn (NW6 6AB)", tag: "London Area", lat: 51.5367, lng: -0.1969 },
    { title: "St John's Wood (NW8 9SG)", tag: "London Area", lat: 51.5332, lng: -0.1741 },
    { title: "Swiss Cottage (NW3 3NJ)", tag: "London Area", lat: 51.5435, lng: -0.1738 },
    { title: "Highgate (N6 5HX)", tag: "London Area", lat: 51.5714, lng: -0.1478 },
    { title: "Hackney (E8 1HE)", tag: "London Area", lat: 51.545, lng: -0.0553 },
    { title: "Shoreditch (E1 6JE)", tag: "London Area", lat: 51.5246, lng: -0.0788 },
    { title: "Bethnal Green (E2 0ET)", tag: "London Area", lat: 51.5273, lng: -0.0555 },
    { title: "Whitechapel (E1 1DB)", tag: "London Area", lat: 51.5192, lng: -0.0607 },
    { title: "Mile End (E3 4SS)", tag: "London Area", lat: 51.525, lng: -0.034 },
    { title: "Stratford (E15 1DJ)", tag: "London Area", lat: 51.543, lng: -0.0016 },
    { title: "Canary Wharf (E14 5AB)", tag: "Financial Hub", lat: 51.5054, lng: -0.0275 },
    { title: "Bermondsey (SE16 4PP)", tag: "London Area", lat: 51.4984, lng: -0.0631 },
    { title: "Southwark (SE1 0BL)", tag: "London Area", lat: 51.5032, lng: -0.1017 },
    { title: "Peckham (SE15 5JR)", tag: "London Area", lat: 51.4742, lng: -0.0691 },
    { title: "Dulwich (SE21 7AD)", tag: "London Area", lat: 51.4452, lng: -0.0863 },
    { title: "Blackheath (SE3 0TL)", tag: "London Area", lat: 51.4673, lng: 0.0076 },
    { title: "Woolwich (SE18 6QB)", tag: "London Area", lat: 51.4884, lng: 0.063 },
    { title: "Lewisham (SE13 6EE)", tag: "London Area", lat: 51.4615, lng: -0.0105 },
    { title: "Heathrow Airport Terminal 2 & 3 (TW6 1AP)", tag: "Airport", lat: 51.47, lng: -0.4543 },
    { title: "Heathrow Airport Terminal 4 (TW6 3XA)", tag: "Airport", lat: 51.4586, lng: -0.4449 },
    { title: "Heathrow Airport Terminal 5 (TW6 2GA)", tag: "Airport", lat: 51.4723, lng: -0.4879 },
    { title: "Gatwick Airport North Terminal (RH6 0PJ)", tag: "Airport", lat: 51.1578, lng: -0.1772 },
    { title: "Gatwick Airport South Terminal (RH6 0NP)", tag: "Airport", lat: 51.1541, lng: -0.1625 },
    { title: "Stansted Airport (CM24 1QW)", tag: "Airport", lat: 51.886, lng: 0.2389 },
    { title: "Luton Airport (LU2 9LY)", tag: "Airport", lat: 51.8763, lng: -0.3717 },
    { title: "London City Airport (E16 2PB)", tag: "Airport", lat: 51.5048, lng: 0.0495 },
    { title: "Stockley Park, Uxbridge (UB11 1FW)", tag: "J Transport HQ", lat: 51.5165, lng: -0.4362 },
    { title: "Hexham and Allendale Branch, Colliery Lane, Allendale (NE47 9DF)", tag: "Branch", lat: 54.8967, lng: -2.2541 },
    { title: "Uxbridge Town Centre (UB8 1QQ)", tag: "Side Area", lat: 51.5465, lng: -0.4777 },
    { title: "Slough Town & Station (SL1 1XU)", tag: "Side Area", lat: 51.5105, lng: -0.594 },
    { title: "Langley, Slough (SL3 8DJ)", tag: "Side Area", lat: 51.5074, lng: -0.5482 },
    { title: "Staines-upon-Thames (TW18 4SU)", tag: "Side Area", lat: 51.4338, lng: -0.5147 },
    { title: "Windsor & Eton (SL4 1PJ)", tag: "Side Area", lat: 51.4839, lng: -0.6044 },
    { title: "Maidenhead (SL6 1ND)", tag: "Side Area", lat: 51.5218, lng: -0.7198 },
    { title: "Reading Town Centre (RG1 7RH)", tag: "Town", lat: 51.4543, lng: -0.9781 },
    { title: "High Wycombe (HP11 2BL)", tag: "Town", lat: 51.6287, lng: -0.7482 },
    { title: "Watford Town Centre (WD17 2RA)", tag: "Side Area", lat: 51.6565, lng: -0.3903 },
    { title: "Harrow & Wealdstone (HA1 2DR)", tag: "Side Area", lat: 51.5806, lng: -0.334 },
    { title: "Richmond upon Thames (TW9 1HU)", tag: "Side Area", lat: 51.4613, lng: -0.3037 },
    { title: "Kingston upon Thames (KT1 1SW)", tag: "Side Area", lat: 51.4123, lng: -0.3007 },
    { title: "Croydon Town Centre (CR0 9XY)", tag: "Side Area", lat: 51.3762, lng: -0.0982 },
    { title: "Bromley Town Centre (BR1 1RN)", tag: "Side Area", lat: 51.406, lng: 0.0152 },
    { title: "Dartford (DA1 1ED)", tag: "Side Area", lat: 51.4464, lng: 0.2184 },
    { title: "Romford Town Centre (RM1 3JT)", tag: "Side Area", lat: 51.5768, lng: 0.1837 },
    { title: "Enfield Town (EN1 3TN)", tag: "Side Area", lat: 51.6538, lng: -0.0798 },
    { title: "Central London (WC2N 5DU)", tag: "Central Hub", lat: 51.5074, lng: -0.1278 },
    { title: "King's Cross & St Pancras Station (N1C 4QP)", tag: "Station", lat: 51.532, lng: -0.1261 },
    { title: "Paddington Station (W2 1HB)", tag: "Station", lat: 51.5154, lng: -0.1755 },
    { title: "Victoria Station (SW1V 1JT)", tag: "Station", lat: 51.4952, lng: -0.1441 },
    { title: "London Bridge Station (SE1 9SP)", tag: "Station", lat: 51.5055, lng: -0.086 },
    { title: "Waterloo Station (SE1 8SW)", tag: "Station", lat: 51.5031, lng: -0.1132 },
    { title: "Euston Station (NW1 2RT)", tag: "Station", lat: 51.5282, lng: -0.1338 },
    { title: "Liverpool Street Station (EC2M 7PY)", tag: "Station", lat: 51.5188, lng: -0.0814 },
    { title: "Birmingham (B1 1BB)", tag: "UK City", lat: 52.4862, lng: -1.8904 },
    { title: "Manchester (M1 1AD)", tag: "UK City", lat: 53.4808, lng: -2.2426 },
    { title: "Oxford (OX1 3HY)", tag: "UK City", lat: 51.752, lng: -1.2577 },
    { title: "Cambridge (CB1 1NP)", tag: "UK City", lat: 52.2053, lng: 0.1218 },
    { title: "Brighton (BN1 1FN)", tag: "UK City", lat: 50.8225, lng: -0.1372 },
    { title: "Bristol (BS1 6WS)", tag: "UK City", lat: 51.4545, lng: -2.5879 },
    { title: "Cardiff (CF10 2AF)", tag: "UK City", lat: 51.4816, lng: -3.1791 },
    { title: "Edinburgh (EH1 3EG)", tag: "UK City", lat: 55.9533, lng: -3.1883 },
    { title: "Glasgow (G1 2FF)", tag: "UK City", lat: 55.8642, lng: -4.2518 },
    { title: "Liverpool (L1 8JQ)", tag: "UK City", lat: 53.4084, lng: -2.9916 },
    { title: "Leeds (LS1 5RG)", tag: "UK City", lat: 53.7997, lng: -1.5492 },
    { title: "Newcastle upon Tyne (NE1 4LQ)", tag: "UK City", lat: 54.9783, lng: -1.6178 },
    { title: "Nottingham (NG1 5AU)", tag: "UK City", lat: 52.9548, lng: -1.1581 },
    { title: "Sheffield (S1 1RQ)", tag: "UK City", lat: 53.3811, lng: -1.4701 },
    { title: "Bournemouth (BH1 1AA)", tag: "UK City", lat: 50.7192, lng: -1.8808 },
    { title: "Bath (BA1 1NN)", tag: "UK City", lat: 51.3811, lng: -2.359 },
    { title: "Canterbury (CT1 2AU)", tag: "UK City", lat: 51.2802, lng: 1.0789 },
    { title: "Folkestone (CT20 2UQ)", tag: "Town", lat: 51.0814, lng: 1.1695 },
    { title: "Norwich (NR1 1RE)", tag: "UK City", lat: 52.6309, lng: 1.2974 },
    { title: "Ipswich (IP1 2AP)", tag: "Town", lat: 52.0567, lng: 1.1482 },
    { title: "Exeter (EX1 1HS)", tag: "UK City", lat: 50.726, lng: -3.5309 },
    { title: "Plymouth (PL1 5EJ)", tag: "UK City", lat: 50.3755, lng: -4.1427 },
    { title: "Leicester (LE1 4NR)", tag: "UK City", lat: 52.6369, lng: -1.1398 },
    { title: "Derby (DE1 2AW)", tag: "UK City", lat: 52.9225, lng: -1.4746 },
    { title: "Coventry (CV1 3LD)", tag: "UK City", lat: 52.4068, lng: -1.5197 },
    { title: "York (YO1 6HU)", tag: "UK City", lat: 53.9599, lng: -1.0873 },
    { title: "Milton Keynes (MK9 3DX)", tag: "Town", lat: 52.0406, lng: -0.7594 },
    { title: "Southampton Port (SO14 2AQ)", tag: "Seaport", lat: 50.9097, lng: -1.4044 },
    { title: "Dover Port (CT17 9TF)", tag: "Seaport", lat: 51.1279, lng: 1.3134 },
    { title: "Portsmouth Port (PO2 8RU)", tag: "Seaport", lat: 50.8198, lng: -1.088 },
    { title: "Tilbury Cruise Terminal (RM18 7HX)", tag: "Seaport", lat: 51.4608, lng: 0.3621 },
    { title: "Harwich International Port (CO12 4SR)", tag: "Seaport", lat: 51.9463, lng: 1.2526 },
    { title: "Bicester Village (OX26 6WD)", tag: "Attraction", lat: 51.8918, lng: -1.1537 },
    { title: "Stonehenge, Salisbury (SP4 7DE)", tag: "Attraction", lat: 51.1789, lng: -1.8262 },
    { title: "Warner Bros. Studio Tour, Leavesden (WD25 7LR)", tag: "Attraction", lat: 51.6904, lng: -0.4181 },
    { title: "London E - East London (E3 4SS)", tag: "London Area", lat: 51.525, lng: -0.034 },
    { title: "London EC - City of London / Central (EC2V 5AA)", tag: "Central Hub", lat: 51.5155, lng: -0.0922 },
    { title: "London N - North London (N5 1EX)", tag: "London Area", lat: 51.56, lng: -0.1 },
    { title: "London NW - North West London (NW6 3HB)", tag: "London Area", lat: 51.545, lng: -0.18 },
    { title: "London SE - South East London (SE15 2RW)", tag: "London Area", lat: 51.48, lng: -0.06 },
    { title: "London SW - South West London (SW4 9BD)", tag: "London Area", lat: 51.46, lng: -0.16 },
    { title: "London W - West London / West End (W11 4LQ)", tag: "London Area", lat: 51.51, lng: -0.21 },
    { title: "London WC - West Central London (WC2B 5AY)", tag: "Central Hub", lat: 51.516, lng: -0.12 },
    { title: "Ilford Town Centre (IG1 2DG)", tag: "Side Area", lat: 51.5588, lng: 0.0685 },
    { title: "Sutton Town Centre (SM1 9SD)", tag: "Side Area", lat: 51.3618, lng: -0.1945 },
    { title: "Twickenham Town Centre (TW1 4QY)", tag: "Side Area", lat: 51.4443, lng: -0.334 },
    { title: "Southall Town Centre (UB1 1PZ)", tag: "Side Area", lat: 51.5123, lng: -0.378 },
    { title: "Hayes Town Centre (UB3 1AD)", tag: "Side Area", lat: 51.5034, lng: -0.421 },
    { title: "Woking Town Centre (GU21 6XT)", tag: "Town", lat: 51.319, lng: -0.559 },
    { title: "Guildford Town Centre (GU1 3HW)", tag: "Town", lat: 51.2362, lng: -0.5704 },
    { title: "Guildford & Surrey (GU1 3HW)", tag: "Town", lat: 51.2362, lng: -0.5704 },
    { title: "Redhill & Surrey (RH1 1PL)", tag: "Town", lat: 51.24, lng: -0.17 },
    { title: "Crawley Town Centre (RH10 1JB)", tag: "Town", lat: 51.113, lng: -0.183 },
    { title: "Hemel Hempstead (HP1 1ER)", tag: "Town", lat: 51.753, lng: -0.472 },
    { title: "Aylesbury Town Centre (HP20 1TX)", tag: "Town", lat: 51.8156, lng: -0.8124 },
    { title: "St Albans City Centre (AL1 3DH)", tag: "UK City", lat: 51.7527, lng: -0.3394 },
    { title: "St Albans & Hertfordshire (AL1 3DH)", tag: "UK City", lat: 51.7527, lng: -0.3394 },
    { title: "Stevenage Town Centre (SG1 1BP)", tag: "Town", lat: 51.9017, lng: -0.2019 },
    { title: "Stevenage & Hertfordshire (SG1 1BP)", tag: "Town", lat: 51.9017, lng: -0.2019 },
    { title: "Luton Town Centre (LU1 5BL)", tag: "Town", lat: 51.8787, lng: -0.42 },
    { title: "Luton & Bedfordshire (LU1 5BL)", tag: "Town", lat: 51.8787, lng: -0.42 },
    { title: "Bedford Town Centre (MK40 1SL)", tag: "Town", lat: 52.1359, lng: -0.4667 },
    { title: "Chelmsford City Centre (CM1 1PG)", tag: "UK City", lat: 51.7356, lng: 0.4685 },
    { title: "Chelmsford & Essex (CM1 1PG)", tag: "UK City", lat: 51.7356, lng: 0.4685 },
    { title: "Harlow Town Centre (CM20 3GA)", tag: "Town", lat: 51.772, lng: 0.103 },
    { title: "Colchester City Centre (CO1 1PJ)", tag: "UK City", lat: 51.8959, lng: 0.8919 },
    { title: "Colchester & Essex (CO3 3LG)", tag: "UK City", lat: 51.8959, lng: 0.8919 },
    { title: "Southend-on-Sea City Centre (SS1 1ND)", tag: "UK City", lat: 51.5459, lng: 0.7077 },
    { title: "London Southend Airport (SS2 6YF)", tag: "Airport", lat: 51.5714, lng: 0.6956 },
    { title: "Basildon Town Centre (SS14 2BD)", tag: "Town", lat: 51.576, lng: 0.457 },
    { title: "Southend & Essex (SS2 6EJ)", tag: "UK City", lat: 51.5459, lng: 0.7077 },
    { title: "Maidstone Town Centre (ME14 1TF)", tag: "Town", lat: 51.272, lng: 0.526 },
    { title: "Rochester & Medway (ME1 1JN)", tag: "Town", lat: 51.3879, lng: 0.5055 },
    { title: "Medway Towns (ME1 1JN)", tag: "Town", lat: 51.3879, lng: 0.5055 },
    { title: "Royal Tunbridge Wells (TN1 1XR)", tag: "Town", lat: 51.1324, lng: 0.2637 },
    { title: "Tonbridge & Kent (TN9 1DR)", tag: "Town", lat: 51.196, lng: 0.275 },
    { title: "Ashford Town Centre (TN23 1PH)", tag: "Town", lat: 51.1465, lng: 0.875 },
    { title: "Hastings Town Centre (TN34 1LB)", tag: "Town", lat: 50.855, lng: 0.573 },
    { title: "Southampton SO - Hampshire (SO14 7DW)", tag: "UK City", lat: 50.9097, lng: -1.4044 },
    { title: "Southampton SO14 - City Centre (SO14 7DW)", tag: "UK City", lat: 50.9097, lng: -1.4044 },
    { title: "Southampton Airport (SO18 2NL)", tag: "Airport", lat: 50.9503, lng: -1.3568 },
    { title: "Winchester City Centre (SO23 8EA)", tag: "UK City", lat: 51.0632, lng: -1.308 },
    { title: "Portsmouth PO - Hampshire (PO2 8RR)", tag: "UK City", lat: 50.8198, lng: -1.088 },
    { title: "Portsmouth PO1 - City Centre (PO1 2EG)", tag: "UK City", lat: 50.8198, lng: -1.088 },
    { title: "Portsmouth PO4 - Southsea (PO4 0LT)", tag: "UK City", lat: 50.788, lng: -1.076 },
    { title: "Brighton BN - Sussex (BN1 1FN)", tag: "UK City", lat: 50.8225, lng: -0.1372 },
    { title: "Brighton BN1 - City Centre (BN1 1FN)", tag: "UK City", lat: 50.8225, lng: -0.1372 },
    { title: "Brighton BN3 - Hove (BN3 3LW)", tag: "UK City", lat: 50.835, lng: -0.175 },
    { title: "Eastbourne Town Centre (BN21 4QX)", tag: "Town", lat: 50.768, lng: 0.28 },
    { title: "Worthing Town Centre (BN11 1BY)", tag: "Town", lat: 50.8179, lng: -0.3729 },
    { title: "Reading RG - Berkshire (RG1 7RH)", tag: "Town", lat: 51.4543, lng: -0.9781 },
    { title: "Basingstoke Town Centre (RG21 7QA)", tag: "Town", lat: 51.2625, lng: -1.087 },
    { title: "Milton Keynes MK - Buckinghamshire (MK9 3DX)", tag: "Town", lat: 52.0406, lng: -0.7594 },
    { title: "Oxford OX - Oxfordshire (OX1 3HY)", tag: "UK City", lat: 51.752, lng: -1.2577 },
    { title: "Bristol BS - Avon & Bristol (BS1 6WS)", tag: "UK City", lat: 51.4545, lng: -2.5879 },
    { title: "Bristol BS1 - City Centre (BS1 6WS)", tag: "UK City", lat: 51.4545, lng: -2.5879 },
    { title: "Bristol Airport (BS48 3DY)", tag: "Airport", lat: 51.3827, lng: -2.7191 },
    { title: "Bristol BS8 - Clifton (BS8 3BS)", tag: "UK City", lat: 51.458, lng: -2.62 },
    { title: "Bath BA - North East Somerset (BA1 1NN)", tag: "UK City", lat: 51.3811, lng: -2.359 },
    { title: "Poole Town Centre (BH15 1LZ)", tag: "Town", lat: 50.715, lng: -1.987 },
    { title: "Bournemouth BH - Dorset (BH2 5EL)", tag: "UK City", lat: 50.7192, lng: -1.8808 },
    { title: "Dorchester DT - Dorset (DT1 1RG)", tag: "Town", lat: 50.7112, lng: -2.4412 },
    { title: "Dorchester Town Centre (DT1 1RG)", tag: "Town", lat: 50.7112, lng: -2.4412 },
    { title: "Swindon SN - Wiltshire (SN1 3JU)", tag: "Town", lat: 51.5558, lng: -1.7797 },
    { title: "Swindon Town Centre (SN1 3JU)", tag: "Town", lat: 51.5558, lng: -1.7797 },
    { title: "Salisbury SP - Wiltshire (SP1 1EX)", tag: "UK City", lat: 51.0688, lng: -1.7945 },
    { title: "Salisbury City Centre (SP1 1EX)", tag: "UK City", lat: 51.0688, lng: -1.7945 },
    { title: "Gloucester GL - Gloucestershire (GL1 1AG)", tag: "UK City", lat: 51.8642, lng: -2.2461 },
    { title: "Gloucester City Centre (GL1 1AG)", tag: "UK City", lat: 51.8642, lng: -2.2461 },
    { title: "Cheltenham Town Centre (GL50 1DQ)", tag: "Town", lat: 51.9, lng: -2.073 },
    { title: "Taunton TA - Somerset (TA1 1FE)", tag: "Town", lat: 51.018, lng: -3.103 },
    { title: "Taunton Town Centre (TA1 1FE)", tag: "Town", lat: 51.018, lng: -3.103 },
    { title: "Exeter EX - Devon (EX4 3PU)", tag: "UK City", lat: 50.726, lng: -3.5309 },
    { title: "Exeter Airport (EX5 2BD)", tag: "Airport", lat: 50.7344, lng: -3.4139 },
    { title: "Torquay TQ - Torbay (TQ1 2DF)", tag: "Town", lat: 50.4619, lng: -3.5253 },
    { title: "Torquay Town Centre (TQ1 2DF)", tag: "Town", lat: 50.4619, lng: -3.5253 },
    { title: "Plymouth PL - Devon (PL1 5EJ)", tag: "UK City", lat: 50.3755, lng: -4.1427 },
    { title: "Truro TR - Cornwall (TR1 2EL)", tag: "UK City", lat: 50.2632, lng: -5.051 },
    { title: "Truro City Centre (TR1 2EL)", tag: "UK City", lat: 50.2632, lng: -5.051 },
    { title: "Cambridge CB - Cambridgeshire (CB2 3BU)", tag: "UK City", lat: 52.2053, lng: 0.1218 },
    { title: "Peterborough PE - Cambridgeshire (PE1 1EJ)", tag: "UK City", lat: 52.5695, lng: -0.2405 },
    { title: "Peterborough City Centre (PE1 1EJ)", tag: "UK City", lat: 52.5695, lng: -0.2405 },
    { title: "Ipswich IP - Suffolk (IP1 2AP)", tag: "Town", lat: 52.0567, lng: 1.1482 },
    { title: "Norwich NR - Norfolk (NR3 1FH)", tag: "UK City", lat: 52.6309, lng: 1.2974 },
    { title: "Norwich Airport (NR6 6JA)", tag: "Airport", lat: 52.6758, lng: 1.2828 },
    { title: "Birmingham B - West Midlands (B4 7DL)", tag: "UK City", lat: 52.4862, lng: -1.8904 },
    { title: "Birmingham B1 - City Centre (B1 1BB)", tag: "UK City", lat: 52.4862, lng: -1.8904 },
    { title: "Birmingham Airport & NEC (B26 3QJ)", tag: "Airport", lat: 52.4539, lng: -1.7481 },
    { title: "Birmingham B15 - Edgbaston (B15 3AS)", tag: "UK City", lat: 52.463, lng: -1.922 },
    { title: "Birmingham B91 - Solihull (B91 3TA)", tag: "Town", lat: 52.4128, lng: -1.7782 },
    { title: "Birmingham B72 - Sutton Coldfield (B72 1XX)", tag: "Town", lat: 52.563, lng: -1.823 },
    { title: "Coventry CV - Warwickshire (CV1 3LD)", tag: "UK City", lat: 52.4068, lng: -1.5197 },
    { title: "Wolverhampton WV - West Midlands (WV1 1TS)", tag: "UK City", lat: 52.5862, lng: -2.1288 },
    { title: "Wolverhampton City Centre (WV1 1TS)", tag: "UK City", lat: 52.5862, lng: -2.1288 },
    { title: "Walsall WS - West Midlands (WS1 1LR)", tag: "Town", lat: 52.584, lng: -1.982 },
    { title: "Walsall Town Centre (WS1 1LR)", tag: "Town", lat: 52.584, lng: -1.982 },
    { title: "Dudley DY - Black Country (DY1 4AN)", tag: "Town", lat: 52.5123, lng: -2.0811 },
    { title: "Dudley Town Centre (DY1 4AN)", tag: "Town", lat: 52.5123, lng: -2.0811 },
    { title: "Worcester WR - Worcestershire (WR1 3QT)", tag: "UK City", lat: 52.1936, lng: -2.2216 },
    { title: "Worcester City Centre (WR1 3QT)", tag: "UK City", lat: 52.1936, lng: -2.2216 },
    { title: "Hereford HR - Herefordshire (HR1 2AB)", tag: "UK City", lat: 52.0564, lng: -2.716 },
    { title: "Hereford City Centre (HR1 2AB)", tag: "UK City", lat: 52.0564, lng: -2.716 },
    { title: "Shrewsbury SY - Shropshire (SY1 1LE)", tag: "Town", lat: 52.7073, lng: -2.7553 },
    { title: "Shrewsbury Town Centre (SY1 1LE)", tag: "Town", lat: 52.7073, lng: -2.7553 },
    { title: "Telford TF - Shropshire (TF3 4HX)", tag: "Town", lat: 52.6776, lng: -2.4497 },
    { title: "Telford Town Centre (TF3 4HX)", tag: "Town", lat: 52.6776, lng: -2.4497 },
    { title: "Stoke-on-Trent ST - Staffordshire (ST1 1DB)", tag: "UK City", lat: 53.0027, lng: -2.1794 },
    { title: "Stoke-on-Trent City Centre (ST1 1DB)", tag: "UK City", lat: 53.0027, lng: -2.1794 },
    { title: "Nottingham NG - Nottinghamshire (NG1 5AU)", tag: "UK City", lat: 52.9548, lng: -1.1581 },
    { title: "Mansfield Town Centre (NG18 1EA)", tag: "Town", lat: 53.143, lng: -1.196 },
    { title: "Leicester LE - Leicestershire (LE1 4NR)", tag: "UK City", lat: 52.6369, lng: -1.1398 },
    { title: "Derby DE - Derbyshire (DE1 2AW)", tag: "UK City", lat: 52.9225, lng: -1.4746 },
    { title: "Chesterfield Town Centre (S40 1PQ)", tag: "Town", lat: 53.235, lng: -1.428 },
    { title: "Northampton NN - Northamptonshire (NN1 2JH)", tag: "Town", lat: 52.2405, lng: -0.9027 },
    { title: "Northampton Town Centre (NN1 2JH)", tag: "Town", lat: 52.2405, lng: -0.9027 },
    { title: "Lincoln LN - Lincolnshire (LN2 1HN)", tag: "UK City", lat: 53.2307, lng: -0.5406 },
    { title: "Lincoln City Centre (LN1 1ER)", tag: "UK City", lat: 53.2307, lng: -0.5406 },
    { title: "Manchester M - Greater Manchester (M2 4NG)", tag: "UK City", lat: 53.4808, lng: -2.2426 },
    { title: "Manchester M1 - City Centre (M1 1AD)", tag: "UK City", lat: 53.4808, lng: -2.2426 },
    { title: "Manchester Airport (M90 1QX)", tag: "Airport", lat: 53.3588, lng: -2.2727 },
    { title: "Manchester M5 - Salford & Quays (M5 3WW)", tag: "UK City", lat: 53.4735, lng: -2.2741 },
    { title: "Manchester M16 - Trafford & Old Trafford (M16 0ZP)", tag: "UK City", lat: 53.456, lng: -2.285 },
    { title: "Manchester M20 - Didsbury & South (M20 6UH)", tag: "UK City", lat: 53.415, lng: -2.233 },
    { title: "Liverpool L - Merseyside (L2 3PS)", tag: "UK City", lat: 53.4084, lng: -2.9916 },
    { title: "Liverpool L1 - City Centre (L1 8JQ)", tag: "UK City", lat: 53.4084, lng: -2.9916 },
    { title: "Liverpool John Lennon Airport (L24 1YD)", tag: "Airport", lat: 53.3336, lng: -2.8497 },
    { title: "Preston PR - Lancashire (PR1 2QT)", tag: "UK City", lat: 53.7632, lng: -2.7031 },
    { title: "Preston City Centre (PR1 2QT)", tag: "UK City", lat: 53.7632, lng: -2.7031 },
    { title: "Blackpool FY - Fylde (FY1 1EJ)", tag: "Town", lat: 53.8175, lng: -3.0538 },
    { title: "Blackpool Town Centre (FY1 1EJ)", tag: "Town", lat: 53.8175, lng: -3.0538 },
    { title: "Blackburn BB - East Lancashire (BB1 5AL)", tag: "Town", lat: 53.748, lng: -2.482 },
    { title: "Blackburn Town Centre (BB1 5AL)", tag: "Town", lat: 53.748, lng: -2.482 },
    { title: "Bolton BL - Greater Manchester (BL1 1RT)", tag: "Town", lat: 53.578, lng: -2.429 },
    { title: "Bolton Town Centre (BL1 1RT)", tag: "Town", lat: 53.578, lng: -2.429 },
    { title: "Oldham OL - Greater Manchester (OL1 1PS)", tag: "Town", lat: 53.5409, lng: -2.1114 },
    { title: "Oldham Town Centre (OL1 1PS)", tag: "Town", lat: 53.5409, lng: -2.1114 },
    { title: "Wigan WN - Greater Manchester (WN1 1BB)", tag: "Town", lat: 53.545, lng: -2.6325 },
    { title: "Wigan Town Centre (WN1 1BB)", tag: "Town", lat: 53.545, lng: -2.6325 },
    { title: "Stockport SK - Cheshire & Manchester (SK1 1JT)", tag: "Town", lat: 53.4106, lng: -2.1575 },
    { title: "Stockport Town Centre (SK1 1JT)", tag: "Town", lat: 53.4106, lng: -2.1575 },
    { title: "Warrington WA - Cheshire (WA1 1QP)", tag: "Town", lat: 53.39, lng: -2.597 },
    { title: "Warrington Town Centre (WA1 1QP)", tag: "Town", lat: 53.39, lng: -2.597 },
    { title: "Chester CH - Cheshire (CH1 2HG)", tag: "UK City", lat: 53.1905, lng: -2.8916 },
    { title: "Chester City Centre (CH1 2HG)", tag: "UK City", lat: 53.1905, lng: -2.8916 },
    { title: "Crewe CW - Cheshire (CW1 2BZ)", tag: "Town", lat: 53.099, lng: -2.441 },
    { title: "Crewe Town Centre (CW1 2BZ)", tag: "Town", lat: 53.099, lng: -2.441 },
    { title: "Carlisle CA - Cumbria (CA3 8SQ)", tag: "UK City", lat: 54.8925, lng: -2.9329 },
    { title: "Carlisle City Centre (CA1 1QN)", tag: "UK City", lat: 54.8925, lng: -2.9329 },
    { title: "Lancaster LA - Morecambe & Cumbria (LA1 1RQ)", tag: "UK City", lat: 54.047, lng: -2.801 },
    { title: "Lancaster City Centre (LA1 1RQ)", tag: "UK City", lat: 54.047, lng: -2.801 },
    { title: "Leeds LS - West Yorkshire (LS1 5RG)", tag: "UK City", lat: 53.7997, lng: -1.5492 },
    { title: "Leeds LS1 - City Centre (LS1 5RG)", tag: "UK City", lat: 53.7997, lng: -1.5492 },
    { title: "Leeds Bradford Airport (LS19 7TU)", tag: "Airport", lat: 53.8659, lng: -1.6606 },
    { title: "Leeds LS6 - Headingley (LS6 3AL)", tag: "UK City", lat: 53.818, lng: -1.577 },
    { title: "Sheffield S - South Yorkshire (S1 1RQ)", tag: "UK City", lat: 53.3811, lng: -1.4701 },
    { title: "Sheffield S1 - City Centre (S1 1RQ)", tag: "UK City", lat: 53.3811, lng: -1.4701 },
    { title: "Sheffield S9 - Meadowhall (S9 1EN)", tag: "UK City", lat: 53.414, lng: -1.411 },
    { title: "Rotherham Town Centre (S60 1FF)", tag: "Town", lat: 53.43, lng: -1.357 },
    { title: "York YO - North Yorkshire (YO1 6HU)", tag: "UK City", lat: 53.9599, lng: -1.0873 },
    { title: "Bradford BD - West Yorkshire (BD1 2RE)", tag: "UK City", lat: 53.796, lng: -1.7594 },
    { title: "Bradford City Centre (BD1 2RE)", tag: "UK City", lat: 53.796, lng: -1.7594 },
    { title: "Huddersfield HD - West Yorkshire (HD1 2EX)", tag: "Town", lat: 53.6458, lng: -1.785 },
    { title: "Huddersfield Town Centre (HD1 2EX)", tag: "Town", lat: 53.6458, lng: -1.785 },
    { title: "Halifax HX - Calderdale (HX1 1YR)", tag: "Town", lat: 53.725, lng: -1.863 },
    { title: "Halifax Town Centre (HX1 1YR)", tag: "Town", lat: 53.725, lng: -1.863 },
    { title: "Wakefield WF - West Yorkshire (WF1 1TA)", tag: "UK City", lat: 53.6833, lng: -1.4977 },
    { title: "Wakefield City Centre (WF1 1TA)", tag: "UK City", lat: 53.6833, lng: -1.4977 },
    { title: "Hull HU - East Yorkshire (HU1 3AL)", tag: "UK City", lat: 53.7457, lng: -0.3367 },
    { title: "Hull City Centre (HU1 3AL)", tag: "UK City", lat: 53.7457, lng: -0.3367 },
    { title: "Doncaster DN - South Yorkshire (DN1 3LU)", tag: "UK City", lat: 53.5228, lng: -1.1312 },
    { title: "Doncaster City Centre (DN1 3LU)", tag: "UK City", lat: 53.5228, lng: -1.1312 },
    { title: "Harrogate HG - North Yorkshire (HG1 1LA)", tag: "Town", lat: 53.9921, lng: -1.5418 },
    { title: "Harrogate Town Centre (HG1 1LA)", tag: "Town", lat: 53.9921, lng: -1.5418 },
    { title: "Newcastle NE - Tyne and Wear (NE1 4LQ)", tag: "UK City", lat: 54.9783, lng: -1.6178 },
    { title: "Newcastle NE1 - City Centre (NE1 4LQ)", tag: "UK City", lat: 54.9783, lng: -1.6178 },
    { title: "Newcastle Airport (NE13 8BZ)", tag: "Airport", lat: 55.0375, lng: -1.6917 },
    { title: "Sunderland SR - Tyne and Wear (SR1 3BT)", tag: "UK City", lat: 54.9069, lng: -1.3838 },
    { title: "Sunderland SR1 - City Centre (SR1 3BT)", tag: "UK City", lat: 54.9069, lng: -1.3838 },
    { title: "Durham DH - County Durham (DH1 4EE)", tag: "UK City", lat: 54.7753, lng: -1.5849 },
    { title: "Durham City Centre (DH1 4EE)", tag: "UK City", lat: 54.7753, lng: -1.5849 },
    { title: "Darlington DL - County Durham (DL1 5RP)", tag: "Town", lat: 54.5236, lng: -1.554 },
    { title: "Darlington Town Centre (DL1 5RP)", tag: "Town", lat: 54.5236, lng: -1.554 },
    { title: "Teesside & Middlesbrough (TS1 2PP)", tag: "Town", lat: 54.5742, lng: -1.235 },
    { title: "Middlesbrough Town Centre (TS1 2PP)", tag: "Town", lat: 54.5742, lng: -1.235 },
    { title: "Edinburgh EH - Lothian (EH1 3EG)", tag: "UK City", lat: 55.9533, lng: -3.1883 },
    { title: "Edinburgh EH1 - City Centre (EH1 3EG)", tag: "UK City", lat: 55.9533, lng: -3.1883 },
    { title: "Edinburgh Airport (EH12 9DN)", tag: "Airport", lat: 55.9508, lng: -3.3615 },
    { title: "Glasgow G - Greater Glasgow (G1 2FF)", tag: "UK City", lat: 55.8642, lng: -4.2518 },
    { title: "Glasgow G1 - City Centre (G1 2FF)", tag: "UK City", lat: 55.8642, lng: -4.2518 },
    { title: "Glasgow Airport (PA3 2SW)", tag: "Airport", lat: 55.8719, lng: -4.4331 },
    { title: "Aberdeen AB - Aberdeenshire (AB10 1AN)", tag: "UK City", lat: 57.1497, lng: -2.0943 },
    { title: "Aberdeen AB10 - City Centre (AB10 1AN)", tag: "UK City", lat: 57.1497, lng: -2.0943 },
    { title: "Aberdeen Dyce Airport (AB21 7DU)", tag: "Airport", lat: 57.2019, lng: -2.1978 },
    { title: "Dundee DD - Tayside (DD1 2AJ)", tag: "UK City", lat: 56.462, lng: -2.9707 },
    { title: "Dundee DD1 - City Centre (DD1 2AJ)", tag: "UK City", lat: 56.462, lng: -2.9707 },
    { title: "Inverness IV - Highlands (IV1 1HY)", tag: "UK City", lat: 57.4778, lng: -4.2247 },
    { title: "Inverness IV1 - City Centre (IV1 1HY)", tag: "UK City", lat: 57.4778, lng: -4.2247 },
    { title: "Inverness Airport (IV2 7JB)", tag: "Airport", lat: 57.5425, lng: -4.0475 },
    { title: "Perth PH - Perthshire (PH2 8PA)", tag: "UK City", lat: 56.395, lng: -3.4308 },
    { title: "Perth City Centre (PH1 5TY)", tag: "UK City", lat: 56.395, lng: -3.4308 },
    { title: "Falkirk & Stirling (FK1 9HT)", tag: "Town", lat: 56.0019, lng: -3.7839 },
    { title: "Stirling City Centre (FK8 2EW)", tag: "UK City", lat: 56.1165, lng: -3.9369 },
    { title: "Dunfermline City Centre (KY12 7XL)", tag: "UK City", lat: 56.0718, lng: -3.4398 },
    { title: "Kirkcaldy & Fife (KY1 1RS)", tag: "Town", lat: 56.1107, lng: -3.1674 },
    { title: "Paisley PA - Renfrewshire (PA1 1BG)", tag: "Town", lat: 55.8456, lng: -4.4239 },
    { title: "Paisley Town Centre (PA1 1BG)", tag: "Town", lat: 55.8456, lng: -4.4239 },
    { title: "Ayr Town Centre (KA7 2EA)", tag: "Town", lat: 55.4586, lng: -4.6292 },
    { title: "Glasgow Prestwick Airport (KA9 2PL)", tag: "Airport", lat: 55.5094, lng: -4.5867 },
    { title: "Kilmarnock & Ayrshire (KA1 1LU)", tag: "Town", lat: 55.6111, lng: -4.4958 },
    { title: "Motherwell ML - Lanarkshire (ML1 1PF)", tag: "Town", lat: 55.789, lng: -3.987 },
    { title: "Motherwell Town Centre (ML1 1PF)", tag: "Town", lat: 55.789, lng: -3.987 },
    { title: "Dumfries DG - Galloway (DG1 1HE)", tag: "Town", lat: 55.0709, lng: -3.6053 },
    { title: "Dumfries Town Centre (DG1 1HE)", tag: "Town", lat: 55.0709, lng: -3.6053 },
    { title: "Galashiels TD - Scottish Borders (TD1 1RY)", tag: "Town", lat: 55.6174, lng: -2.8106 },
    { title: "Galashiels Town Centre (TD1 1RY)", tag: "Town", lat: 55.6174, lng: -2.8106 },
    { title: "Cardiff CF - South Wales (CF10 2AF)", tag: "UK City", lat: 51.4816, lng: -3.1791 },
    { title: "Cardiff CF10 - Bay & City (CF10 4PZ)", tag: "UK City", lat: 51.464, lng: -3.164 },
    { title: "Cardiff Airport (CF62 3BD)", tag: "Airport", lat: 51.3967, lng: -3.3433 },
    { title: "Swansea SA - West Wales (SA1 5HF)", tag: "UK City", lat: 51.6214, lng: -3.9436 },
    { title: "Swansea SA1 - City Centre (SA1 5HF)", tag: "UK City", lat: 51.6214, lng: -3.9436 },
    { title: "Newport NP - South Wales (NP20 1JS)", tag: "UK City", lat: 51.5842, lng: -2.9977 },
    { title: "Newport City Centre (NP20 1JS)", tag: "UK City", lat: 51.5842, lng: -2.9977 },
    { title: "Wrexham City Centre (LL11 1AY)", tag: "UK City", lat: 53.043, lng: -2.9925 },
    { title: "Bangor City Centre (LL57 2TQ)", tag: "UK City", lat: 53.2274, lng: -4.1293 },
    { title: "Llandudno LL - North Wales (LL30 2LH)", tag: "Town", lat: 53.3242, lng: -3.8276 },
    { title: "Llandrindod Wells LD - Powys (LD1 5BB)", tag: "Town", lat: 52.2415, lng: -3.3789 },
    { title: "Belfast BT - Northern Ireland (BT1 5GA)", tag: "UK City", lat: 54.5973, lng: -5.9301 },
    { title: "Belfast BT1 - City Centre (BT1 5GA)", tag: "UK City", lat: 54.5973, lng: -5.9301 },
    { title: "Belfast International Airport (BT29 4AB)", tag: "Airport", lat: 54.6575, lng: -6.2158 },
    { title: "George Best Belfast City Airport (BT3 9JH)", tag: "Airport", lat: 54.618, lng: -5.8725 },
    { title: "Derry / Londonderry BT48 - City Centre (BT48 6HN)", tag: "UK City", lat: 54.9966, lng: -7.3086 },
    { title: "City of Derry Airport (BT47 3GY)", tag: "Airport", lat: 55.0428, lng: -7.1611 },
    { title: "Lisburn City Centre (BT28 1XG)", tag: "UK City", lat: 54.5126, lng: -6.0425 },
    { title: "Newry City Centre (BT34 1JB)", tag: "UK City", lat: 54.1754, lng: -6.3377 },
    { title: "Armagh City Centre (BT61 9DJ)", tag: "UK City", lat: 54.3503, lng: -6.6528 }
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
    const existingMap = document.querySelector('#map-card-wrapper');
    if (existingMap) existingMap.remove();

    const formEl = document.querySelector('#booking-form');
    if (formEl) {
      formEl.classList.remove('has-side-map');
      const side = formEl.querySelector('.form-inputs-side');
      if (side) {
        while (side.firstChild) {
          formEl.insertBefore(side.firstChild, side);
        }
        side.remove();
      }
    }

    return null;
  }

  function getCoordsForPlace(placeName, inputEl) {
    if (!placeName) return null;

    if (inputEl && inputEl.dataset.lat && inputEl.dataset.lng) {
      return {
        lat: parseFloat(inputEl.dataset.lat),
        lng: parseFloat(inputEl.dataset.lng)
      };
    }

    const lowered = placeName.toLowerCase().trim();

    const preset = UK_PRESET_LOCATIONS.find(item =>
      item.title.toLowerCase().includes(lowered) ||
      lowered.includes(item.title.toLowerCase())
    );

    if (preset) {
      return {
        lat: preset.lat,
        lng: preset.lng
      };
    }

    if (lowered.includes('manchester')) return { lat: 53.4808, lng: -2.2426 };
    if (lowered.includes('birmingham')) return { lat: 52.4862, lng: -1.8904 };
    if (lowered.includes('liverpool')) return { lat: 53.4084, lng: -2.9916 };
    if (lowered.includes('leeds')) return { lat: 53.8008, lng: -1.5491 };
    if (lowered.includes('bristol')) return { lat: 51.4545, lng: -2.5879 };
    if (lowered.includes('sheffield')) return { lat: 53.3811, lng: -1.4701 };
    if (lowered.includes('nottingham')) return { lat: 52.9548, lng: -1.1581 };
    if (lowered.includes('newcastle')) return { lat: 54.9783, lng: -1.6178 };
    if (lowered.includes('edinburgh')) return { lat: 55.9533, lng: -3.1883 };
    if (lowered.includes('glasgow')) return { lat: 55.8642, lng: -4.2518 };
    if (lowered.includes('cardiff')) return { lat: 51.4816, lng: -3.1791 };
    if (lowered.includes('brighton')) return { lat: 50.8225, lng: -0.1372 };
    if (lowered.includes('southampton')) return { lat: 50.9097, lng: -1.4044 };
    if (lowered.includes('oxford')) return { lat: 51.7520, lng: -1.2577 };
    if (lowered.includes('cambridge')) return { lat: 52.2053, lng: 0.1218 };
    if (lowered.includes('reading')) return { lat: 51.4543, lng: -0.9781 };
    if (lowered.includes('bournemouth')) return { lat: 50.7192, lng: -1.8808 };
    if (lowered.includes('plymouth')) return { lat: 50.3755, lng: -4.1427 };
    if (lowered.includes('exeter')) return { lat: 50.7260, lng: -3.5309 };
    if (lowered.includes('norwich')) return { lat: 52.6309, lng: 1.2974 };
    if (lowered.includes('york')) return { lat: 53.9590, lng: -1.0815 };

    if (lowered.includes('heathrow')) {
      return { lat: 51.4700, lng: -0.4543 };
    }

    if (lowered.includes('gatwick')) {
      return { lat: 51.1578, lng: -0.1772 };
    }

    if (lowered.includes('stansted')) {
      return { lat: 51.8860, lng: 0.2389 };
    }

    if (lowered.includes('luton')) {
      return { lat: 51.8763, lng: -0.3717 };
    }

    if (lowered.includes('city airport')) {
      return { lat: 51.5048, lng: 0.0495 };
    }

    if (lowered.includes('stockley')) {
      return { lat: 51.5165, lng: -0.4362 };
    }

    if (lowered.includes('paddington')) {
      return { lat: 51.5154, lng: -0.1755 };
    }

    if (lowered.includes('victoria')) {
      return { lat: 51.4952, lng: -0.1441 };
    }

    if (lowered.includes('king') && lowered.includes('cross')) {
      return { lat: 51.5320, lng: -0.1261 };
    }

    const h = hashString(lowered);

    const latOffset =
      (((Math.abs(h) % 1000) / 1000) - 0.5) * 0.15;

    const lngOffset =
      (((Math.abs(h * 13) % 1000) / 1000) - 0.5) * 0.20;

    return {
      lat: 51.5074 + latOffset,
      lng: -0.1278 + lngOffset
    };
  }

  function calculateDistanceMiles(coord1, coord2) {
    if (!coord1 || !coord2) return 0;

    const R = 3958.8;

    const dLat =
      (coord2.lat - coord1.lat) * Math.PI / 180;

    const dLng =
      (coord2.lng - coord1.lng) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.lat * Math.PI / 180) *
      Math.cos(coord2.lat * Math.PI / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

    const c =
      2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const miles = R * c * 1.25;

    return Math.max(1, Math.round(miles * 10) / 10);
  }

    function updateRouteMap() {
    initMapContainer();

    const pickupInput = document.querySelector('#pickup');
    const dropoffInput = document.querySelector('#dropoff');
    const pickupVal = pickupInput?.value.trim() || '';
    const dropoffVal = dropoffInput?.value.trim() || '';

    if (path.toLowerCase() === 'booking.html' && form) {
      clearTimeout(window._autoQuoteTimer);
      window._autoQuoteTimer = setTimeout(() => {
        if (pickupVal.length >= 3 && dropoffVal.length >= 3) {
          form.dispatchEvent(new Event('submit', { cancelable: true }));
        }
      }, 600);
    }
  }

  
  function formatUkPostcode(text) {
    if (!text || typeof text !== 'string') return text;
    return text.replace(/\b([A-Z]{1,2}[0-9][0-9A-Z]?)\s*([0-9][A-Z]{2})\b/gi, (match, p1, p2) => {
      return p1.toUpperCase() + ' ' + p2.toUpperCase();
    });
  }

  function setupLocationAutocomplete(inputEl) {
    if (!inputEl) return;

    const parent = inputEl.parentElement;
    if (!parent) return;

    let dropdown =
      parent.querySelector('.autocomplete-dropdown');

    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'autocomplete-dropdown';
      dropdown.hidden = true;

      parent.classList.add('autocomplete-wrapper');
      parent.appendChild(dropdown);
    }

    let debounceTimer;

    const renderItems = items => {
      dropdown.replaceChildren();

      if (!items.length) {
        dropdown.hidden = true;
        return;
      }

      items.forEach(item => {
        const el = document.createElement('div');

        el.className = 'autocomplete-item';

        el.innerHTML = `
          <i class="bi bi-geo-alt-fill"></i>
          <span class="item-title">${item.title}</span>
          <span class="item-tag">${item.tag || 'UK'}</span>
        `;

        el.addEventListener('mousedown', e => {
          e.preventDefault();

          const val = formatUkPostcode(item.title);
          inputEl.value = val;
          inputEl.title = val;

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
        renderItems(UK_PRESET_LOCATIONS);
      }
    });

    inputEl.addEventListener('input', () => {
      clearTimeout(debounceTimer);

      delete inputEl.dataset.lat;
      delete inputEl.dataset.lng;

      const query = inputEl.value.trim().toLowerCase();

      if (!query) {
        renderItems(UK_PRESET_LOCATIONS);
        return;
      }

      const matches = UK_PRESET_LOCATIONS.filter(item =>
        item.title.toLowerCase().includes(query) ||
        (item.tag && item.tag.toLowerCase().includes(query))
      );

      renderItems(matches);

      if (query.length >= 2) {
        debounceTimer = setTimeout(async () => {
          try {
            if (activeNominatimController) {
              activeNominatimController.abort();
            }

            activeNominatimController =
              new AbortController();

            const timeoutId = setTimeout(
              () => activeNominatimController.abort(),
              2000
            );

            const res = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&countrycodes=gb&addressdetails=1&q=${encodeURIComponent(query)}&limit=5`,
              {
                signal: activeNominatimController.signal
              }
            );

            clearTimeout(timeoutId);

            if (!res.ok) return;

            const data = await res.json();

            if (data && data.length) {
              const liveItems = data.map(place => {
                const addr = place.address || {};
                const postcode = (addr.postcode || '').trim();
                const parts = place.display_name.split(',').map(s => s.trim());
                const mainName = parts[0] || '';
                const locality = parts.slice(1, 3).filter(p => !/\b(united kingdom|england|scotland|wales|northern ireland)\b/i.test(p)).join(', ');
                let formattedTitle;
                if (postcode) {
                  const base = locality ? `${mainName}, ${locality}` : mainName;
                  if (!base.toUpperCase().includes(postcode.toUpperCase())) {
                    formattedTitle = `${base} (${postcode})`;
                  } else {
                    formattedTitle = base;
                  }
                } else {
                  const pcMatch = place.display_name.match(/\b([A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2})\b/i);
                  const base = parts.slice(0, 3).join(', ');
                  if (pcMatch && !base.toUpperCase().includes(pcMatch[1].toUpperCase())) {
                    formattedTitle = `${base} (${pcMatch[1].toUpperCase()})`;
                  } else {
                    formattedTitle = base;
                  }
                }
                return {
                  title: formattedTitle,
                  tag: 'UK Address',
                  lat: parseFloat(place.lat),
                  lng: parseFloat(place.lon)
                };
              });

              const combined = [
                ...matches,
                ...liveItems
              ];

              const unique =
                Array.from(
                  new Map(
                    combined.map(item => [item.title, item])
                  ).values()
                );

              renderItems(unique.slice(0, 7));
            }

          } catch (_) {}
        }, 300);
      }
    });

    inputEl.addEventListener('blur', () => {
      const formatted = formatUkPostcode(inputEl.value);
      if (formatted !== inputEl.value) {
        inputEl.value = formatted;
        inputEl.title = formatted;
      }
      setTimeout(() => {
        dropdown.hidden = true;
      }, 220);
    });
    inputEl.addEventListener('change', () => {
      const formatted = formatUkPostcode(inputEl.value);
      if (formatted !== inputEl.value) {
        inputEl.value = formatted;
        inputEl.title = formatted;
      }
    });
  }

  const form = document.querySelector('#booking-form');

  const pickupDate =
    document.querySelector('#pickup-date');

  const pickupTime =
    document.querySelector('#pickup-time');

  const returnDate =
    document.querySelector('#return-date');

  const returnTime =
    document.querySelector('#return-time');

  const today = new Date();

  today.setMinutes(
    today.getMinutes() - today.getTimezoneOffset()
  );

  if (pickupDate) {
    pickupDate.min =
      today.toISOString().slice(0, 10);
  }

  if (returnDate) {
    returnDate.min =
      today.toISOString().slice(0, 10);
  }

  document.querySelector('.swap')?.addEventListener('click', () => {
    const from = document.querySelector('#pickup');
    const to = document.querySelector('#dropoff');

    if (from && to) {
      [from.value, to.value] =
        [to.value, from.value];

      updateRouteMap();
    }
  });

  document.querySelector('.add-destination')?.addEventListener('click', () => {
    const existing =
      document.querySelector('.destination-row');

    if (existing) {
      existing.querySelector('input').focus();
      return;
    }

    const row = document.createElement('div');

    row.className = 'destination-row';

    row.innerHTML = `
      <label class="field">
        <span class="visually-hidden">
          Additional destination
        </span>

        <div>
          <i class="bi bi-geo-alt"></i>
          <input
            id="via"
            placeholder="Add a stop on your journey"
          >
        </div>
      </label>

      <button
        type="button"
        class="remove-destination"
        aria-label="Remove destination"
      >
        <i class="bi bi-x-lg"></i>
      </button>
    `;

    const routes =
      form.querySelector('.route-fields');

    if (routes) {
      routes.insertBefore(
        row,
        routes.querySelector('.swap')
      );
    } else {
      form.append(row);
    }

    row
      .querySelector('.remove-destination')
      .addEventListener('click', () => row.remove());

    row.querySelector('input').focus();

    setupLocationAutocomplete(
      row.querySelector('input')
    );
  });

  const pickupIn =
    document.querySelector('#pickup');

  const dropoffIn =
    document.querySelector('#dropoff');

  setupLocationAutocomplete(pickupIn);
  setupLocationAutocomplete(dropoffIn);

  pickupIn?.addEventListener(
    'change',
    updateRouteMap
  );

  dropoffIn?.addEventListener(
    'change',
    updateRouteMap
  );

  const readForm = () => {
    const pickupVal = document.querySelector('#pickup')?.value || '';
    const dropoffVal = document.querySelector('#dropoff')?.value || '';
    const pickupEl = document.querySelector('#pickup');
    const dropoffEl = document.querySelector('#dropoff');
    const c1 = getCoordsForPlace(pickupVal, pickupEl);
    const c2 = getCoordsForPlace(dropoffVal, dropoffEl);
    const computedMiles = (c1 && c2) ? calculateDistanceMiles(c1, c2) : null;

    return {
      pickup: formatUkPostcode(pickupVal),
      dropoff: formatUkPostcode(dropoffVal),
      pickupDate:
        document.querySelector('#pickup-date')?.value || '',
      pickupTime:
        document.querySelector('#pickup-time')?.value || '',
      returnDate:
        document.querySelector('#return-date')?.value || '',
      returnTime:
        document.querySelector('#return-time')?.value || '',
      promo:
        document.querySelector('#promo')?.value || '',
      passengers:
        document.querySelector('#passengers')?.value ||
        '1 passenger',
      via:
        document.querySelector('#via')?.value || '',
      distanceMiles: computedMiles
    };
  };

  const params =
    new URLSearchParams(location.search);

  Object.entries({
    pickup: 'pickup',
    dropoff: 'dropoff',
    pickupDate: 'pickup-date',
    pickupTime: 'pickup-time',
    returnDate: 'return-date',
    returnTime: 'return-time',
    promo: 'promo',
    passengers: 'passengers',
    via: 'via'
  }).forEach(([key, id]) => {
    const control =
      document.getElementById(id);

    const value = params.get(key);

    if (control && value) {
      control.value = value;
    }
  });

  if (
    params.get('via') &&
    form &&
    !document.getElementById('via')
  ) {
    document.querySelector('.add-destination')?.click();

    const via =
      document.getElementById('via');

    if (via) {
      via.value = params.get('via');
    }
  }

  if (
    path.toLowerCase() === 'booking.html' &&
    params.get('pickup') &&
    params.get('dropoff') &&
    form
  ) {
    setTimeout(() => {
      if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      } else {
        form.dispatchEvent(
          new Event('submit', { cancelable: true })
        );
      }
    }, 200);
  }

  setTimeout(updateRouteMap, 400);

  const pounds = pence => {
    const val = (pence || 0) / 100;
    return '£' + (val % 1 === 0 ? val.toFixed(0) : val.toFixed(2));
  };

    function generateClientFallbackQuotes(info) {
    const pickupVal = info.pickup || 'London';
    const dropoffVal = info.dropoff || 'Airport';
    const combo = (pickupVal + ' ' + dropoffVal).toLowerCase();

    let basePrice = 90.00;
    let distanceBracket = null;

    if (combo.includes('gatwick')) {
      basePrice = 110.00;
    } else if (combo.includes('stansted') || combo.includes('luton')) {
      basePrice = 95.00;
    } else if (combo.includes('city airport') || combo.includes('london city')) {
      basePrice = 50.00;
    } else if (combo.includes('heathrow')) {
      basePrice = 90.00;
    } else if (combo.includes('manchester')) {
      basePrice = 307.00;
    } else if (combo.includes('birmingham')) {
      basePrice = 180.00;
    } else if (combo.includes('liverpool')) {
      basePrice = 322.00;
    } else if (combo.includes('bristol')) {
      basePrice = 157.00;
    } else if (combo.includes('salisbury')) {
      basePrice = 180.00;
    } else if (combo.includes('southampton')) {
      basePrice = 160.00;
    } else if (combo.includes('dover')) {
      basePrice = 175.00;
    }

    // Check estimated distance for Low (30-50), Medium (50-80), High (80-90), Maximum (90+) miles brackets
    const pickupEl = document.querySelector('#pickup');
    const dropoffEl = document.querySelector('#dropoff');
    const c1 = getCoordsForPlace(pickupVal, pickupEl);
    const c2 = getCoordsForPlace(dropoffVal, dropoffEl);
    let miles = Number(info.distanceMiles || info.miles) || ((c1 && c2) ? calculateDistanceMiles(c1, c2) : 0);

    if (!miles) {
      const milesMatch = combo.match(/\b(\d+(?:\.\d+)?)\s*(?:miles|mile|mi)\b/i);
      if (milesMatch) {
        miles = parseFloat(milesMatch[1]);
      }
    }

    if (!miles) {
      const UK_CITY_MILES = [
        { name: "manchester", miles: 205 }, { name: "liverpool", miles: 220 },
        { name: "birmingham", miles: 120 }, { name: "bristol", miles: 115 },
        { name: "leeds", miles: 195 }, { name: "sheffield", miles: 170 },
        { name: "nottingham", miles: 130 }, { name: "leicester", miles: 105 },
        { name: "coventry", miles: 105 }, { name: "derby", miles: 130 },
        { name: "newcastle", miles: 280 }, { name: "brighton", miles: 60 },
        { name: "southampton", miles: 80 }, { name: "portsmouth", miles: 75 },
        { name: "oxford", miles: 55 }, { name: "cambridge", miles: 60 },
        { name: "reading", miles: 40 }, { name: "bournemouth", miles: 110 },
        { name: "plymouth", miles: 220 }, { name: "exeter", miles: 175 },
        { name: "norwich", miles: 115 }, { name: "york", miles: 200 },
        { name: "milton keynes", miles: 55 }, { name: "salisbury", miles: 85 },
        { name: "slough", miles: 22 }, { name: "luton", miles: 32 },
        { name: "stansted", miles: 36 }, { name: "gatwick", miles: 28 },
        { name: "heathrow", miles: 18 }
      ];
      for (const city of UK_CITY_MILES) {
        if (combo.includes(city.name)) {
          miles = city.miles;
          break;
        }
      }
    }

    if (miles > 30 && miles <= 50) {
      distanceBracket = 'minimum';
      basePrice = 110.00;
    } else if (miles > 50 && miles <= 80) {
      distanceBracket = 'high';
      basePrice = 130.00;
    } else if (miles > 80 && miles <= 90) {
      distanceBracket = 'maximum';
      basePrice = 150.00;
    } else if (miles > 90) {
      distanceBracket = 'long_distance';
    }

    const nowMs = Date.now();
    const expiresMs = nowMs + 15 * 60 * 1000;
    const quoteId = 'q_' + nowMs + '_' + Math.random().toString(36).substring(2, 8);

    const makeBreakdown = (vehBase) => {
      let oneWayVal = vehBase;
      if (info.returnDate) {
        oneWayVal = vehBase;
      }
      const oneWay = Math.round(oneWayVal * 100);
      const retOrig = oneWay * 2;
      const retTot = Math.round(retOrig * 0.95);
      const retSave = retOrig - retTot;
      return {
        totalPence: oneWay,
        oneWayTotalPence: oneWay,
        returnOriginalPence: retOrig,
        returnTotalPence: retTot,
        returnSavingsPence: retSave,
      };
    };

    // Official PDF Fare Levels:
    // Minimum Fare (30-50 mi): Saloon 110, Estate 120, Exec 125, MPV5 120, Minivan8 140, Exec MPV 160, Sprinter 250
    // High Fare (50-80 mi): Saloon 130, Estate 140, Exec 150, MPV5 150, Minivan8 180, Exec MPV 220, Sprinter 340
    // Maximum Fare (80-90 mi): Saloon 150, Estate 160, Exec 175, MPV5 175, Minivan8 220, Exec MPV 280, Sprinter 500
    // Long distance (>90 mi per Note 2): Saloon 1.50/mi, Estate 1.80/mi, Exec 2.00/mi, MPV 2.00/mi, Minivan8 2.70/mi, Exec MPV 3.00/mi, Sprinter 4.50/mi
    const PDF_FARES = {
      // Minimum Fare: 30-50 Miles
      minimum: {
        saloon: 110.00,
        estate: 120.00,
        mpv: 120.00,
        executive: 125.00,
        'exec-mpv': 160.00,
        minivan8: 140.00,
        sprinter: 250.00,
      },
      // High Fare: 50-80 Miles
      high: {
        saloon: 130.00,
        estate: 140.00,
        mpv: 150.00,
        executive: 150.00,
        'exec-mpv': 220.00,
        minivan8: 180.00,
        sprinter: 340.00,
      },
      // Maximum Fare: 80-90 Miles
      maximum: {
        saloon: 150.00,
        estate: 160.00,
        mpv: 175.00,
        executive: 175.00,
        'exec-mpv': 280.00,
        minivan8: 220.00,
        sprinter: 500.00,
      },
    };
    PDF_FARES.low = PDF_FARES.minimum;
    PDF_FARES.medium = PDF_FARES.high;

    // Exact Official PDF Airport & Local Rates
    let pSaloon = 90.00;
    let pEstate = 100.00;
    let pMpv = 110.00;
    let pExec = 110.00;
    let pExecMpv = 150.00;
    let pMinivan8 = 130.00;
    let pSprinter = 230.00;

    if (combo.includes('gatwick')) {
      pSaloon = 110.00;
      pEstate = 120.00;
      pMpv = 130.00;
      pExec = 130.00;
      pExecMpv = 170.00;
      pMinivan8 = 150.00;
      pSprinter = 270.00;
    } else if (combo.includes('stansted') || combo.includes('luton')) {
      pSaloon = 95.00;
      pEstate = 100.00;
      pMpv = 120.00;
      pExec = 120.00;
      pExecMpv = 150.00;
      pMinivan8 = 130.00;
      pSprinter = 240.00;
    } else if (combo.includes('city airport') || combo.includes('london city')) {
      pSaloon = 50.00;
      pEstate = 60.00;
      pMpv = 70.00;
      pExec = 70.00;
      pExecMpv = 100.00;
      pMinivan8 = 90.00;
      pSprinter = 120.00;
    } else if (combo.includes('heathrow')) {
      pSaloon = 90.00;
      pEstate = 100.00;
      pMpv = 110.00;
      pExec = 110.00;
      pExecMpv = 150.00;
      pMinivan8 = 130.00;
      pSprinter = 230.00;
    } else if (miles > 0 && miles <= 30) {
      // Non-airport local trip (<= 30 miles) from Official J TRANSPORT GROUP LTD Short Distance Price List
      const shortTier = miles <= 5 ? '0-5' : miles <= 10 ? '6-10' : miles <= 20 ? '11-20' : '21-30';
      const rates = {
        '0-5': { saloon: 45.00, estate: 55.00, executive: 65.00, mpv: 65.00, minivan8: 75.00, 'exec-mpv': 100.00, sprinter: 150.00 },
        '6-10': { saloon: 55.00, estate: 70.00, executive: 75.00, mpv: 75.00, minivan8: 85.00, 'exec-mpv': 130.00, sprinter: 170.00 },
        '11-20': { saloon: 70.00, estate: 85.00, executive: 85.00, mpv: 85.00, minivan8: 95.00, 'exec-mpv': 145.00, sprinter: 190.00 },
        '21-30': { saloon: 85.00, estate: 95.00, executive: 105.00, mpv: 105.00, minivan8: 120.00, 'exec-mpv': 150.00, sprinter: 220.00 },
      }[shortTier];
      pSaloon = rates.saloon;
      pEstate = rates.estate;
      pMpv = rates.mpv;
      pExec = rates.executive;
      pExecMpv = rates['exec-mpv'];
      pMinivan8 = rates.minivan8;
      pSprinter = rates.sprinter;
    }

    if (PDF_FARES[distanceBracket]) {
      const t = PDF_FARES[distanceBracket];
      pSaloon = t.saloon;
      pEstate = t.estate;
      pMpv = t.mpv;
      pExec = t.executive;
      pExecMpv = t['exec-mpv'];
      pMinivan8 = t.minivan8;
      pSprinter = t.sprinter;
    } else if (distanceBracket === 'long_distance' || miles > 90) {
      // Official PDF Page 1: Maximum distance (>90 miles) per-mile rates
      // Saloon rate is preserved; larger/premium vehicles use their own PDF-listed per-mile rates
      pSaloon = Math.round(miles * 1.70);
      pEstate = Math.round(miles * 1.80);
      pMpv = Math.round(miles * 2.00);
      pExec = Math.round(miles * 2.00);
      pMinivan8 = Math.round(miles * 2.70);
      pExecMpv = Math.round(miles * 3.00);
      pSprinter = Math.round(miles * 4.50);
    }

    const vehicles = [
      {
        code: 'saloon',
        name: 'Saloon Car',
        image: 'assets/images/saloon.png',
        luggage: 'Up to 2 Large Suitcases',
        examples: 'Toyota Corolla, VW Golf, Prius',
        breakdown: makeBreakdown(pSaloon)
      },
      {
        code: 'estate',
        name: 'Estate Car',
        image: 'assets/images/estate.png',
        luggage: 'Up to 3 Large Suitcases',
        examples: 'VW Passat Estate, Skoda Superb',
        breakdown: makeBreakdown(pEstate)
      },
      {
        code: 'mpv',
        name: 'MPV (People Carrier)',
        image: 'assets/images/mpv.png',
        luggage: 'Up to 4 Large Suitcases',
        examples: 'VW Multivan or Ford Tourneo',
        breakdown: makeBreakdown(pMpv)
      },
      {
        code: 'executive',
        name: 'Executive Saloon',
        image: 'assets/images/executive-saloon.png',
        luggage: 'Premium Leather Interior',
        examples: 'Mercedes-Benz E-Class, BMW 5 Series',
        breakdown: makeBreakdown(pExec)
      },
      {
        code: 'exec-mpv',
        name: 'Executive MPV (6 Seater)',
        image: 'assets/images/mpv-plus.png',
        luggage: 'Luxury Chauffeur Minivan',
        examples: 'Mercedes-Benz V-Class',
        breakdown: makeBreakdown(pExecMpv)
      },
      {
        code: 'minivan8',
        name: '8 Seater Minivan',
        image: 'assets/images/minivan.png',
        luggage: 'Up to 8 Large Suitcases',
        examples: 'Mercedes-Benz Vito 8 Seater',
        breakdown: makeBreakdown(pMinivan8)
      },
      {
        code: 'sprinter',
        name: 'Mercedes Sprinter',
        image: 'assets/images/14-seater.png',
        luggage: 'Up to 16 Luggage Pieces',
        examples: 'Luxury Minibus for Group Travel',
        breakdown: makeBreakdown(pSprinter)
      }
    ];

    return {
      id: quoteId,
      quoteId,
      createdAt: nowMs,
      expiresAt: expiresMs,
      quoteCreatedAt: new Date(nowMs).toISOString(),
      quoteExpiresAt: new Date(expiresMs).toISOString(),
      vehicles
    };
  }

  const renderQuotes = quote => {
    const host =
      document.querySelector('#quote-results');

    if (!host) return;

    host.hidden = false;
    host.replaceChildren();

    const title =
      document.createElement('h3');

    title.textContent =
      'Choose a vehicle for your transfer';

    host.append(title);

    const validQuoteId =
      quote.id || quote.quoteId;

    quote.vehicles.forEach(vehicle => {

      const card =
        document.createElement('article');

      card.className = 'quote-card';

      const image =
        document.createElement('img');

      image.src = vehicle.image;
      image.alt = vehicle.name;

      const copy =
        document.createElement('div');
      copy.className = 'quote-copy';

      const heading =
        document.createElement('h4');

      heading.textContent =
        vehicle.name;

      const luggage =
        document.createElement('p');

      luggage.textContent =
        vehicle.luggage +
        ' · ' +
        vehicle.examples;

      const bd = vehicle.breakdown || {};
      const oneWayPence = bd.oneWayTotalPence || bd.totalPence || 5000;
      const returnOrigPence = bd.returnOriginalPence || (oneWayPence * 2);
      const returnTotPence = bd.returnTotalPence || Math.round(returnOrigPence * 0.95);
      const returnSavePence = bd.returnSavingsPence || (returnOrigPence - returnTotPence);

      const price =
        document.createElement('strong');
      price.className = 'quote-price';
      price.textContent = pounds(oneWayPence);

      copy.append(
        heading,
        price,
        luggage
      );

      const btnGroup = document.createElement('div');
      btnGroup.className = 'quote-trip-options';

      const oneWayLink = document.createElement('a');
      oneWayLink.className = 'trip-option-btn trip-btn-oneway';
      oneWayLink.href = 'checkout.html?quote=' + encodeURIComponent(validQuoteId) + '&vehicle=' + encodeURIComponent(vehicle.code) + '&method=card&type=oneway';
      oneWayLink.innerHTML = `
        <span class="trip-opt-label">One Way</span>
        <span class="trip-opt-price">${pounds(oneWayPence)}</span>
      `;

      const returnLink = document.createElement('a');
      returnLink.className = 'trip-option-btn trip-btn-return';
      returnLink.href = 'checkout.html?quote=' + encodeURIComponent(validQuoteId) + '&vehicle=' + encodeURIComponent(vehicle.code) + '&method=card&type=return';
      returnLink.innerHTML = `
        <span class="trip-opt-label">Return</span>
        <div class="trip-opt-pricing">
          <span class="trip-opt-strike">${pounds(returnOrigPence)}</span>
          <span class="trip-opt-price">${pounds(returnTotPence)}</span>
        </div>
        <span class="trip-discount-badge">-${pounds(returnSavePence)}</span>
      `;

      btnGroup.append(oneWayLink, returnLink);

      card.append(
        image,
        copy,
        btnGroup
      );

      host.append(card);
    });

    host.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  form?.addEventListener('submit', async event => {

    event.preventDefault();

    if (returnDate && returnTime) {
      returnDate.setCustomValidity(
        returnTime.value && !returnDate.value
          ? 'Please select a return date.'
          : ''
      );

      returnTime.setCustomValidity(
        returnDate.value && !returnTime.value
          ? 'Please select a return time.'
          : ''
      );
    }

    if (!form.reportValidity()) return;

    const button =
      form.querySelector('.search-button');

    const message =
      form.querySelector('.form-message');

    const originalButton =
      button.innerHTML;

    const info =
      readForm();

    button.disabled = true;
    button.classList.add('is-loading');

    button.innerHTML =
      '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Checking…';

    if (path.toLowerCase() !== 'booking.html') {
      window.setTimeout(() => {
        window.location.href =
          'booking.html?' +
          new URLSearchParams(info).toString();
      }, 350);

      return;
    }

    try {

      const response =
        await fetch('/api/quotes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(info)
        });

      if (response.ok) {

        const data =
          await response.json().catch(() => ({}));

        renderQuotes(data);

      } else {

        const fallback =
          generateClientFallbackQuotes(info);

        renderQuotes(fallback);
      }

      if (message) {
        message.textContent =
          'Prices are fixed for this search. Choose a vehicle to pay securely.';

        message.classList.add('success');
      }

    } catch (error) {

      const fallback =
        generateClientFallbackQuotes(info);

      renderQuotes(fallback);

      if (message) {
        message.textContent =
          'Prices are fixed for this search. Choose a vehicle to pay securely.';

        message.classList.add('success');
      }

    } finally {

      button.disabled = false;
      button.classList.remove('is-loading');
      button.innerHTML = originalButton;
    }
  });


  // =========================================================
  // AIRPORT TRANSFER IMAGES
  // =========================================================
  // IMPORTANT:
  // Airport tabs now use DIRECT image URLs.
  // No local airport JPG files are required.
  // =========================================================

  const airportDetails = {

    'Heathrow': {
      desc:
        'Your driver tracks your inbound flight and adjusts pickup timing if you land early or late. Serving Terminals 2, 3, 4 and 5 with 60 mins free waiting time.',

      img:
        'assets/images/airports/heathrow.jpg',

      fromPrice: '£90',
      code: 'LHR · Terminals 2, 3, 4 & 5'
    },

    'Gatwick': {
      desc:
        'Take the direct, comfortable route between Gatwick North/South terminals and London. Flight tracking and meet & greet included.',

      img:
        'assets/images/airports/gatwick.jpg',

      fromPrice: '£110',
      code: 'LGW · North & South Terminals'
    },

    'Stansted': {
      desc:
        'Make your Stansted arrival easier with a pre-booked private transfer and a driver ready to meet you at arrivals.',

      img:
        'assets/images/airports/stansted.jpg',

      fromPrice: '£95',
      code: 'STN · Main Terminal'
    },

    'Luton': {
      desc:
        'Avoid extra connections after landing. Your driver will be ready to help with luggage and take you directly into London.',

      img:
        'assets/images/airports/luton.jpg',

      fromPrice: '£95',
      code: 'LTN · Main Terminal'
    },

    'London City': {
      desc:
        'A smooth pickup from London City Airport in Docklands, whether heading to a financial meeting, hotel or home.',

      img:
        'assets/images/airports/london_city.jpg',

      fromPrice: '£50',
      code: 'LCY · Docklands Terminal'
    }
  };


  // =========================================================
  // AIRPORT TAB CLICK
  // =========================================================

  document.querySelectorAll('.airport-tab').forEach(tab => {

    tab.addEventListener('click', () => {

      document.querySelectorAll('.airport-tab').forEach(item => {

        item.classList.toggle(
          'active',
          item === tab
        );

        item.setAttribute(
          'aria-selected',
          String(item === tab)
        );
      });

      const name =
        tab.dataset.airport;

      const detail =
        airportDetails[name];

      const copy =
        document.querySelector('.airport-copy');

      if (copy && detail) {

        copy.innerHTML = `
          <div class="airport-card-inner">

            <div class="airport-copy-text">

              <span class="section-kicker">
                ${detail.code}
              </span>

              <h3>
                ${name} Airport Transfers
              </h3>

              <p>
                ${detail.desc}
              </p>

              <div class="airport-price-tag">
                <i class="bi bi-tag-fill"></i>
                Fixed Fares from
                <b>${detail.fromPrice}</b>
                (5% Discount Included)
              </div>

              <a
                class="yellow-pill mt-3"
                href="booking.html?pickup=${encodeURIComponent(name + ' Airport')}"
              >
                Book ${name} Transfer
                <i class="bi bi-arrow-right"></i>
              </a>

            </div>

            <div class="airport-copy-media">

              <img
                src="${detail.img}"
                alt="${name} Airport"
                loading="lazy"
                referrerpolicy="no-referrer"
              >

            </div>

          </div>
        `;
      }
    });
  });


  // =========================================================
  // OPEN AIRPORT FROM URL
  // =========================================================

  const airportParam =
    new URLSearchParams(location.search).get('airport');

  const initialAirport =
    [
      ...document.querySelectorAll('.airport-tab')
    ].find(
      tab =>
        tab.dataset.airport.toLowerCase() ===
        (airportParam || '').toLowerCase()
    );

  initialAirport?.click();


  // =========================================================
  // CHAT
  // =========================================================

  const chat =
    document.querySelector('.chat-float');

  const popover =
    document.querySelector('.chat-popover');

  chat?.addEventListener('click', () => {
    chat.setAttribute(
      'aria-expanded',
      String(
        popover.classList.toggle('open')
      )
    );
  });

  popover?.querySelector('button')?.addEventListener(
    'click',
    () => {
      popover.classList.remove('open');

      chat?.setAttribute(
        'aria-expanded',
        'false'
      );
    }
  );


  // =========================================================
  // CAROUSELS
  // =========================================================

  document.querySelectorAll('[data-carousel]').forEach(carousel => {

    const track =
      carousel.querySelector(
        '.fleet-track,.seat-track,.service-track'
      );

    const dots =
      carousel.querySelector('.carousel-dots');

    if (!track || !dots) return;

    const cards =
      [...track.children];

    const getStep = () => {

      const first = cards[0];

      if (!first) {
        return track.clientWidth;
      }

      const gap =
        parseFloat(
          getComputedStyle(track).gap
        ) || 0;

      return (
        first.getBoundingClientRect().width +
        gap
      );
    };

    const perPage = () =>
      Math.max(
        1,
        Math.round(
          track.clientWidth / getStep()
        )
      );

    const pageCount = () =>
      Math.max(
        1,
        Math.ceil(
          cards.length / perPage()
        )
      );

    let active = 0;

    const renderDots = () => {

      dots.replaceChildren();

      for (
        let i = 0;
        i < pageCount();
        i++
      ) {

        const dot =
          document.createElement('button');

        dot.type = 'button';

        dot.className =
          i === active
            ? 'active'
            : '';

        dot.setAttribute(
          'aria-label',
          `Show ${
            carousel.dataset.carousel
          } items ${
            i * perPage() + 1
          } to ${
            Math.min(
              cards.length,
              (i + 1) * perPage()
            )
          }`
        );

        dot.addEventListener(
          'click',
          () => {

            active = i;

            track.scrollTo({
              left:
                i *
                perPage() *
                getStep(),

              behavior: 'smooth'
            });

            update();
          }
        );

        dots.append(dot);
      }
    };

    const update = () => {

      active = Math.min(
        pageCount() - 1,
        Math.round(
          track.scrollLeft /
          (perPage() * getStep())
        )
      );

      [
        ...dots.children
      ].forEach((dot, i) => {

        dot.classList.toggle(
          'active',
          i === active
        );

        dot.setAttribute(
          'aria-current',
          i === active
            ? 'true'
            : 'false'
        );
      });
    };

    renderDots();
    update();

    track.addEventListener(
      'scroll',
      () => requestAnimationFrame(update),
      { passive: true }
    );

    carousel
      .querySelectorAll('[data-move]')
      .forEach(button => {

        button.addEventListener(
          'click',
          () => {

            const delta =
              button.dataset.move === 'next'
                ? 1
                : -1;

            active =
              (
                active +
                delta +
                pageCount()
              ) %
              pageCount();

            track.scrollTo({
              left:
                active *
                perPage() *
                getStep(),

              behavior: 'smooth'
            });
          }
        );
      });

    window.addEventListener(
      'resize',
      () => {

        active = 0;

        renderDots();

        track.scrollTo({
          left: 0
        });

        update();
      }
    );
  });


  // =========================================================
  // REVEAL ANIMATIONS
  // =========================================================

  if (
    'IntersectionObserver' in window &&
    !matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
  ) {

    const observer =
      new IntersectionObserver(
        entries =>
          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                'visible'
              );

              observer.unobserve(
                entry.target
              );
            }
          }),
        {
          threshold: 0.12
        }
      );

    document
      .querySelectorAll('.reveal')
      .forEach(element =>
        observer.observe(element)
      );

  } else {

    document
      .querySelectorAll('.reveal')
      .forEach(element =>
        element.classList.add('visible')
      );
  }

})();


