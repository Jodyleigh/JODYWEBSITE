/* =====================================================================
   Lumière Beauty — app.js
   WEDE5020 Part 2 | ST10533111 JODY'LEE GUMEDE
   Static academic prototype: cart, accounts, orders and tracking persist
   in this browser only. No real payment, email or courier API is used.
   ===================================================================== */
(() => {
  'use strict';

  /* ---------- Helpers and browser storage ---------- */
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  };
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const money = value => `R${Math.round(Number(value) || 0).toLocaleString('en-ZA')}`;
  const escapeHTML = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
  const hashPassword = value => {
    // Small demo-only hash so the password is not saved as plain text.
    // This is NOT a replacement for server-side password hashing.
    let hash = 2166136261;
    for (const char of value) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  };
  const toast = message => {
    let notice = $('#notice');
    if (!notice) {
      notice = document.createElement('div');
      notice.id = 'notice';
      notice.setAttribute('role', 'status');
      notice.setAttribute('aria-live', 'polite');
      document.body.append(notice);
    }
    notice.textContent = message;
    notice.hidden = false;
    clearTimeout(window.lumiereNoticeTimer);
    window.lumiereNoticeTimer = setTimeout(() => { notice.hidden = true; }, 3600);
  };

  const PRODUCTS = Array.isArray(window.LUMIERE_PRODUCTS) ? window.LUMIERE_PRODUCTS : [];
  let cart = read('lumiere_cart', []);
  const getOrders = () => read('lumiere_orders', []);
  const setOrders = orders => save('lumiere_orders', orders);

  /* ---------- Session and account navigation ---------- */
  const getSession = () => {
    const session = sessionStorage.getItem('lumiere_session') || localStorage.getItem('lumiere_session');
    return session ? readSession(session) : null;
  };
  const readSession = raw => {
    try { return JSON.parse(raw); } catch { return null; }
  };
  const setSession = (user, remember) => {
    const value = JSON.stringify({ name: user.name, email: user.email });
    sessionStorage.removeItem('lumiere_session');
    localStorage.removeItem('lumiere_session');
    (remember ? localStorage : sessionStorage).setItem('lumiere_session', value);
  };
  const clearSession = () => {
    sessionStorage.removeItem('lumiere_session');
    localStorage.removeItem('lumiere_session');
  };
  const updateAccountLinks = () => {
    const session = getSession();
    $$('[data-account-link]').forEach(link => {
      link.textContent = session?.name ? `Hi, ${session.name.split(/\s+/)[0]}` : 'Account'; link.href = 'account.html';
    });
  };

  /* ---------- Cart ---------- */
  const cartCount = () => cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  const persistCart = () => {
    save('lumiere_cart', cart);
    $$('[data-count]').forEach(node => { node.textContent = cartCount(); });
  };
  const productFrom = element => {
    const card = element.closest('.card, .deal, .detail');
    const name = card?.querySelector('h3,h1')?.textContent.trim() || 'Beauty item';
    const priceText = card?.querySelector('.price')?.textContent || '0';
    const firstPrice = priceText.match(/(?:R\s*)?([0-9][0-9,.]*)/);
    const price = Number((firstPrice?.[1] || '0').replace(/,/g, ''));
    const img = card?.querySelector('img')?.getAttribute('src') || '';
    return { name, price, img };
  };
  const addToCart = (product, qty = 1) => {
    if (!product || !Number(product.price)) {
      toast('This item could not be added. Please try again.');
      return;
    }
    const found = cart.find(item => item.name === product.name);
    if (found) found.qty += qty;
    else cart.push({ ...product, qty });
    persistCart();
    toast(`${product.name} added to your bag ✦`);
  };

  // Product cards and deal bundles.
  $$('.card button:not([data-wishlist])').forEach(button => button.addEventListener('click', () => addToCart(productFrom(button))));
  $$('.deal button:not([data-wishlist])').forEach(button => button.addEventListener('click', () => addToCart(productFrom(button))));

  // Product detail quantity controls.
  const buy = $('.detail .buy');
  if (buy) {
    let count = 1;
    const countLabel = $('.qty span', buy);
    $$('.qty button', buy).forEach((button, index) => button.addEventListener('click', () => {
      count = Math.max(1, count + (index === 0 ? -1 : 1));
      if (countLabel) countLabel.textContent = count;
    }));
    $('.btn', buy)?.addEventListener('click', () => addToCart(productFrom(buy), count));
  }

  const summary = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const delivery = subtotal >= 750 || subtotal === 0 ? 0 : 85;
    const discount = $('#code')?.value.trim().toUpperCase() === 'LUMIERE10' ? subtotal * 0.10 : 0;
    const total = subtotal + delivery - discount;
    if ($('#sub')) $('#sub').textContent = money(subtotal);
    if ($('#ship')) $('#ship').textContent = delivery ? money(delivery) : 'Free';
    if ($('#disc')) $('#disc').textContent = `-${money(discount)}`;
    if ($('#disc-row')) $('#disc-row').hidden = !discount;
    if ($('#tot')) $('#tot').textContent = money(total);
    return total;
  };

  const renderCart = () => {
    const box = $('#cart-lines');
    if (!box) return;
    box.replaceChildren();
    if (!cart.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML = '<span>♡</span><h3>Your bag is waiting for a little glow</h3><p>Add a favourite from the shop to continue.</p><a class="btn ghost" href="products.html">Browse products</a>';
      box.append(empty);
      summary();
      return;
    }
    cart.forEach((item, index) => {
      const line = document.createElement('div');
      line.className = 'line';
      const image = document.createElement('img');
      image.src = item.img;
      image.alt = item.name;
      image.loading = 'lazy';
      const body = document.createElement('div');
      const name = document.createElement('b');
      name.textContent = item.name;
      body.append(name);
      const unit = document.createElement('small');
      unit.textContent = `${item.qty} × ${money(item.price)}`;
      body.append(unit);
      if (!box.classList.contains('compact')) {
        const controls = document.createElement('div');
        controls.className = 'qty';
        const minus = document.createElement('button');
        minus.type = 'button'; minus.textContent = '−'; minus.setAttribute('aria-label', `Decrease ${item.name}`);
        const count = document.createElement('span'); count.textContent = item.qty;
        const plus = document.createElement('button');
        plus.type = 'button'; plus.textContent = '+'; plus.setAttribute('aria-label', `Increase ${item.name}`);
        const remove = document.createElement('button');
        remove.type = 'button'; remove.textContent = 'Remove'; remove.className = 'rm'; remove.setAttribute('aria-label', `Remove ${item.name}`);
        minus.addEventListener('click', () => {
          item.qty -= 1;
          if (item.qty <= 0) cart.splice(index, 1);
          persistCart(); renderCart();
        });
        plus.addEventListener('click', () => { item.qty += 1; persistCart(); renderCart(); });
        remove.addEventListener('click', () => { cart.splice(index, 1); persistCart(); renderCart(); });
        controls.append(minus, count, plus, remove);
        body.append(controls);
      }
      const price = document.createElement('span');
      price.className = 'price';
      price.textContent = money(item.price * item.qty);
      line.append(image, body, price);
      box.append(line);
    });
    summary();
  };

  renderCart();
  $('#code')?.addEventListener('input', summary);

  /* ---------- Product catalogue filters and product detail ---------- */
  const shopCards = $$('.card');
  if (location.pathname.endsWith('products.html') && shopCards.length) {
    const panel = document.createElement('div');
    panel.className = 'search-panel';
    panel.innerHTML = '<label for="product-search">Find your glow</label><div class="search-box"><span>⌕</span><input id="product-search" type="search" placeholder="Search products or categories"></div><p id="search-result" role="status"></p>';
    shopCards[0].closest('.grid')?.before(panel);
    const search = $('#product-search');
    const chips = $$('.chips .chip');
    const requested = new URLSearchParams(location.search).get('cat');
    let activeCategory = requested || 'All';
    const apply = () => {
      const term = search.value.trim().toLowerCase();
      let visible = 0;
      shopCards.forEach(card => {
        const category = card.querySelector('small')?.textContent.trim() || '';
        const text = card.textContent.toLowerCase();
        const matchesCategory = activeCategory === 'All' || category.toLowerCase() === activeCategory.toLowerCase();
        const matchesSearch = !term || text.includes(term);
        card.hidden = !(matchesCategory && matchesSearch);
        if (!card.hidden) visible += 1;
      });
      $('#search-result').textContent = `${visible} product${visible === 1 ? '' : 's'} shown${activeCategory !== 'All' ? ` in ${activeCategory}` : ''}`;
    };
    chips.forEach(chip => {
      if (chip.textContent.trim().toLowerCase() === activeCategory.toLowerCase()) chip.classList.add('active');
      else chip.classList.remove('active');
      chip.addEventListener('click', () => {
        activeCategory = chip.textContent.trim();
        chips.forEach(item => item.classList.toggle('active', item === chip));
        apply();
      });
    });
    search.addEventListener('input', apply);
    apply();
  }

  if (location.pathname.endsWith('product-details.html') && PRODUCTS.length) {
    const id = Number(new URLSearchParams(location.search).get('id'));
    const product = PRODUCTS.find(item => item.id === id) || PRODUCTS[0];
    const detail = $('.detail');
    if (detail && product) {
      const title = $('h1', detail); if (title) title.textContent = product.name;
      const eyebrow = $('.eyebrow', detail); if (eyebrow) eyebrow.textContent = product.category;
      const price = $('.price.big', detail); if (price) price.textContent = money(product.price);
      const mainImage = $('#main-img'); if (mainImage) { mainImage.src = product.img; mainImage.alt = product.name; }
      const descriptions = {
        Foundation: 'Buildable, skin-loving coverage with a luminous finish designed for comfortable everyday wear.',
        Concealer: 'Blendable coverage that brightens and perfects without feeling heavy on the skin.',
        Powder: 'A soft-focus finishing formula that helps smooth shine while keeping skin fresh.',
        Cheeks: 'A flattering flush of colour with easy-to-blend pigment for soft or statement glam.',
        Lips: 'Comfortable lip colour designed to define, layer and complete your look.',
        Eyes: 'Blendable eye colour with rich payoff for soft neutrals, shimmer and bold evening looks.',
        Tools: 'A beauty essential designed to make application easier, cleaner and more precise.',
        'Prep & Set': 'A lightweight prep-and-set essential that helps makeup look smoother and last longer.'
      };
      const copy = detail.querySelector('h1 + .price + p');
      if (copy) copy.textContent = descriptions[product.category] || 'A Lumière Beauty essential selected for effortless everyday glam.';
      const categoryImages = PRODUCTS.filter(item => item.category === product.category).slice(0, 4);
      $$('.thumb').forEach((button, index) => {
        const item = categoryImages[index] || product;
        const image = $('img', button);
        if (image) { image.src = item.img; image.alt = item.name; }
        button.setAttribute('aria-label', `Show ${item.name}`);
      });
      document.title = `${product.name} — Lumière Beauty`;
    }
    $$('.thumb').forEach(button => button.addEventListener('click', () => {
      const image = $('img', button);
      const main = $('#main-img');
      if (image && main) main.src = image.src;
      $$('.thumb').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
    }));
  }

  /* ---------- Video-inspired moving gallery showcase ---------- */
  const showcase = $('[data-gallery-showcase]');
  if (showcase) {
    const cards = $$('[data-showcase-card]', showcase);
    const dotsWrap = $('[data-showcase-dots]', showcase);
    const progress = $('[data-showcase-progress]', showcase);
    let current = 0;
    let timer = null;
    let pointerStart = null;
    const autoplayMs = 4200;

    cards.forEach((card, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'showcase-dot';
      dot.setAttribute('aria-label', `Show gallery product ${index + 1}`);
      dot.addEventListener('click', () => goTo(index, true));
      dotsWrap?.append(dot);

      const media = $('.showcase-media', card);
      media?.addEventListener('click', event => {
        if (!card.classList.contains('is-active')) {
          event.preventDefault();
          event.stopImmediatePropagation();
          goTo(index, true);
        }
      });
    });

    const dots = $$('.showcase-dot', showcase);
    const signedDistance = (index, active, length) => {
      let distance = index - active;
      if (distance > length / 2) distance -= length;
      if (distance < -length / 2) distance += length;
      return distance;
    };

    const render = () => {
      const mobile = window.innerWidth < 700;
      const spread = mobile ? Math.min(window.innerWidth * .56, 205) : Math.min(window.innerWidth * .22, 285);
      cards.forEach((card, index) => {
        const distance = signedDistance(index, current, cards.length);
        const abs = Math.abs(distance);
        const visible = abs <= (mobile ? 1 : 2);
        const scale = distance === 0 ? 1 : Math.max(.64, 1 - abs * .17);
        const x = distance * spread;
        const y = abs * (mobile ? 23 : 18);
        const rotate = distance * -7;
        card.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,${-abs * 90}px) rotateY(${rotate}deg) scale(${scale})`;
        card.style.opacity = visible ? String(distance === 0 ? 1 : Math.max(.28, .78 - abs * .23)) : '0';
        card.style.zIndex = String(20 - abs);
        card.style.filter = distance === 0 ? 'saturate(1) brightness(1) blur(0)' : `saturate(.72) brightness(${Math.max(.46,.78-abs*.1)}) blur(${abs > 1 ? 1.1 : .25}px)`;
        card.classList.toggle('is-active', distance === 0);
        card.classList.toggle('is-near', abs === 1);
        card.setAttribute('aria-hidden', visible ? 'false' : 'true');
        const media = $('.showcase-media', card);
        if (media) media.tabIndex = visible ? 0 : -1;
      });
      dots.forEach((dot, index) => dot.setAttribute('aria-current', index === current ? 'true' : 'false'));
    };

    const restartProgress = () => {
      showcase.classList.remove('is-playing');
      if (progress) progress.style.animation = 'none';
      void showcase.offsetWidth;
      if (progress) progress.style.animation = '';
      showcase.classList.add('is-playing');
    };

    const startAutoplay = () => {
      clearInterval(timer);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      restartProgress();
      timer = setInterval(() => {
        current = (current + 1) % cards.length;
        render();
        restartProgress();
      }, autoplayMs);
    };

    const pauseAutoplay = () => {
      clearInterval(timer);
      timer = null;
      showcase.classList.remove('is-playing');
    };

    function goTo(index, userInitiated = false) {
      current = (index + cards.length) % cards.length;
      render();
      if (userInitiated) startAutoplay();
    }

    $('[data-showcase-prev]', showcase)?.addEventListener('click', () => goTo(current - 1, true));
    $('[data-showcase-next]', showcase)?.addEventListener('click', () => goTo(current + 1, true));
    showcase.addEventListener('mouseenter', pauseAutoplay);
    showcase.addEventListener('mouseleave', startAutoplay);
    showcase.addEventListener('focusin', pauseAutoplay);
    showcase.addEventListener('focusout', event => { if (!showcase.contains(event.relatedTarget)) startAutoplay(); });
    showcase.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(current - 1, true); }
      if (event.key === 'ArrowRight') { event.preventDefault(); goTo(current + 1, true); }
    });
    showcase.tabIndex = 0;
    showcase.addEventListener('pointerdown', event => { pointerStart = { x: event.clientX, y: event.clientY }; });
    showcase.addEventListener('pointerup', event => {
      if (!pointerStart) return;
      const dx = event.clientX - pointerStart.x;
      const dy = event.clientY - pointerStart.y;
      pointerStart = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) goTo(current + (dx < 0 ? 1 : -1), true);
    });
    window.addEventListener('resize', render, { passive: true });
    document.addEventListener('visibilitychange', () => document.hidden ? pauseAutoplay() : startAutoplay());
    render();
    startAutoplay();
  }

  /* ---------- Gallery lightbox ---------- */
  const gallery = $$('.looks img, .gallery-grid img, .showcase-media img');
  if (gallery.length) {
    const dialog = document.createElement('dialog');
    dialog.className = 'lightbox';
    if (showcase) dialog.classList.add('showcase-lightbox');
    dialog.innerHTML = '<button type="button" aria-label="Close image">×</button><img alt=""><p></p>';
    document.body.append(dialog);
    $('button', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    gallery.forEach(image => {
      image.tabIndex = 0;
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', `Enlarge ${image.alt}`);
      const open = () => {
        $('img', dialog).src = image.src;
        $('img', dialog).alt = image.alt;
        $('p', dialog).textContent = image.alt;
        dialog.showModal();
      };
      image.addEventListener('click', open);
      image.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
      });
    });
  }

  /* ---------- Sign-up, sign-in and account dashboard ---------- */
  const tabs = $$('.tabs [data-tab]');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(item => item.classList.toggle('active', item === tab));
    if ($('#signin')) $('#signin').hidden = tab.dataset.tab !== 'signin';
    if ($('#signup')) $('#signup').hidden = tab.dataset.tab !== 'signup';
  }));

  $('#signup')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    const message = $('#signup-message');
    if (data.password !== data.confirm) {
      if (message) message.textContent = 'Passwords do not match.';
      return;
    }
    const users = read('lumiere_users', []);
    if (users.some(user => user.email.toLowerCase() === data.email.trim().toLowerCase())) {
      if (message) message.textContent = 'An account with this email already exists. Please sign in.';
      return;
    }
    const user = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      passwordHash: hashPassword(data.password),
      createdAt: new Date().toISOString()
    };
    users.push(user);
    save('lumiere_users', users);
    form.reset();
    if (message) message.textContent = '';
    toast('Account created successfully. You can sign in now ✦');
    $('[data-tab="signin"]')?.click();
    const emailInput = $('#signin input[name="email"]');
    if (emailInput) emailInput.value = user.email;
  });

  $('#signin')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    const users = read('lumiere_users', []);
    const user = users.find(item => item.email.toLowerCase() === data.email.trim().toLowerCase());
    const message = $('#signin-message');
    if (!user || user.passwordHash !== hashPassword(data.password)) {
      if (message) message.textContent = 'Email or password is incorrect.';
      return;
    }
    setSession(user, data.remember === 'on');
    if (message) message.textContent = '';
    toast(`Welcome back, ${user.name.split(/\s+/)[0]} ✦`);
    if (location.pathname.endsWith('login.html') && !$('#signup')?.hidden) { /* dual account page keeps user in place */ }
    renderAccountDashboard();
    updateAccountLinks();
  });

  const renderAccountDashboard = () => {
    const auth = $('#account-auth');
    const dashboard = $('#account-dashboard');
    if (!auth || !dashboard) return;
    const session = getSession();
    auth.hidden = Boolean(session);
    dashboard.hidden = !session;
    if (!session) return;
    $('#account-name').textContent = `Hello, ${session.name.split(/\s+/)[0]}`;
    $('#account-email').textContent = session.email;
    const ordersBox = $('#account-orders');
    const orders = getOrders().filter(order => String(order.email || '').toLowerCase() === session.email.toLowerCase());
    if (!orders.length) {
      ordersBox.innerHTML = '<div class="empty-state small"><span>✧</span><h3>No orders yet</h3><p>Your future Lumière orders will appear here.</p><a class="btn ghost" href="products.html">Start shopping</a></div>';
      return;
    }
    ordersBox.innerHTML = orders.map(order => {
      const status = getStatus(order.statusIndex).label;
      return `<article class="order-card"><div><small>${new Date(order.date).toLocaleDateString('en-ZA')}</small><h4>${escapeHTML(order.id)}</h4><p>${order.items.length} item${order.items.length === 1 ? '' : 's'} · ${money(order.total)}</p></div><div class="order-card-side"><span class="status-badge">${escapeHTML(status)}</span><a class="btn ghost" href="tracking.html?track=${encodeURIComponent(order.id)}">Track delivery</a></div></article>`;
    }).join('');
  };

  $('#logout')?.addEventListener('click', () => {
    clearSession();
    toast('You have signed out.');
    renderAccountDashboard();
    updateAccountLinks();
  });

  /* ---------- Checkout and order creation ---------- */
  const prefillCheckout = () => {
    const form = $('#checkout-form');
    const session = getSession();
    if (!form || !session) return;
    const users = read('lumiere_users', []);
    const user = users.find(item => item.email === session.email);
    const names = session.name.trim().split(/\s+/);
    const set = (name, value) => { const input = form.elements.namedItem(name); if (input && !input.value) input.value = value || ''; };
    set('firstName', names[0]);
    set('lastName', names.slice(1).join(' '));
    set('email', session.email);
    set('phone', user?.phone);
  };

  $('#checkout-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!cart.length) { toast('Your bag is empty. Add a product before checkout.'); return; }
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    const total = summary();
    const now = new Date();
    const eta = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const id = `LB-${String(Date.now()).slice(-8)}`;
    const order = {
      id,
      items: cart.map(item => ({ ...item })),
      total,
      date: now.toISOString(),
      statusIndex: 0,
      eta: eta.toISOString(),
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      street: data.street.trim(),
      city: data.city.trim(),
      postal: data.postal.trim(),
      province: data.province,
      payment: data.payment
    };
    const orders = getOrders();
    orders.unshift(order);
    setOrders(orders);
    save('lumiere_last_order', order);
    addNotification(`Order ${id} confirmed — tracking is ready.`, `tracking.html?track=${encodeURIComponent(id)}`);
    cart = [];
    persistCart();
    renderCart();
    form.reset();
    const result = $('#order-result');
    if (result) {
      result.hidden = false;
      result.innerHTML = `<div class="success-icon">✓</div><h3>Order placed beautifully</h3><p>Your order <b>${escapeHTML(id)}</b> has been created for ${money(total)}.</p><div class="success-actions"><a class="btn" href="order-confirmation.html?order=${encodeURIComponent(id)}">View confirmation</a><a class="btn ghost" href="tracking.html?track=${encodeURIComponent(id)}">Track delivery</a><a class="btn ghost" href="account.html">View account</a></div>`;
      result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    toast(`Order ${id} created. Tracking is ready ✦`);
  });

  /* ---------- Delivery tracking ---------- */
  const STATUSES = [
    { label: 'Order confirmed', note: 'We have received your order.' },
    { label: 'Packed with care', note: 'Your products are packed and ready.' },
    { label: 'On the way', note: 'Your parcel has left our Durban dispatch point.' },
    { label: 'Out for delivery', note: 'The courier is heading to your delivery address.' },
    { label: 'Delivered', note: 'Your Lumière order has arrived.' }
  ];
  function getStatus(index = 0) { return STATUSES[Math.max(0, Math.min(STATUSES.length - 1, Number(index) || 0))]; }

  const renderTracking = order => {
    if (!order) return;
    $('#tracking-empty').hidden = true;
    $('#tracking-result').hidden = false;
    $('#track-order-id').textContent = order.id;
    const statusIndex = Math.max(0, Math.min(4, Number(order.statusIndex) || 0));
    const status = getStatus(statusIndex);
    $('#track-status').textContent = status.label;
    $('#track-summary').textContent = status.note;
    const etaText = statusIndex >= 4 ? 'Delivered' : `Estimated ${new Date(order.eta).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}`;
    $('#track-eta').textContent = etaText;
    $$('.track-step').forEach(step => {
      const stepIndex = Number(step.dataset.step);
      step.classList.toggle('done', stepIndex < statusIndex);
      step.classList.toggle('active', stepIndex === statusIndex);
    });
    const address = [order.street, order.city, order.province, order.postal, 'South Africa'].filter(Boolean).join(', ');
    $('#map-address').textContent = address;
    const map = $('#delivery-map');
    if (map) map.src = `https://www.google.com/maps?q=${encodeURIComponent(address || 'Durban, South Africa')}&output=embed`;
    $('#track-details').innerHTML = `<div class="detail-row"><span>Recipient</span><b>${escapeHTML(order.name || 'Customer')}</b></div><div class="detail-row"><span>City</span><b>${escapeHTML(order.city || '—')}</b></div><div class="detail-row"><span>Items</span><b>${order.items?.length || 0}</b></div><div class="detail-row"><span>Order total</span><b>${money(order.total)}</b></div><div class="detail-row"><span>Last update</span><b>${new Date(order.lastUpdated || order.date).toLocaleString('en-ZA')}</b></div>`;
    const advance = $('#advance-status');
    if (advance) {
      advance.disabled = statusIndex >= 4;
      advance.textContent = statusIndex >= 4 ? 'Delivery complete' : 'Demo: advance status';
      advance.dataset.orderId = order.id;
    }
  };

  const findAndRenderTracking = id => {
    const clean = String(id || '').trim().toUpperCase();
    const order = getOrders().find(item => String(item.id).toUpperCase() === clean);
    if (!order) {
      $('#tracking-result').hidden = true;
      $('#tracking-empty').hidden = false;
      $('#tracking-empty').innerHTML = '<span>!</span><h3>Order not found</h3><p>Check the order number and try again. Demo orders are stored only in this browser.</p>';
      return false;
    }
    const input = $('#tracking-id'); if (input) input.value = order.id;
    renderTracking(order);
    return true;
  };

  $('#tracking-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const id = new FormData(event.currentTarget).get('trackingId');
    if (!findAndRenderTracking(id)) toast('No matching order was found on this device.');
  });

  $('#advance-status')?.addEventListener('click', event => {
    const id = event.currentTarget.dataset.orderId;
    const orders = getOrders();
    const order = orders.find(item => item.id === id);
    if (!order) return;
    order.statusIndex = Math.min(4, (Number(order.statusIndex) || 0) + 1);
    order.lastUpdated = new Date().toISOString();
    setOrders(orders);
    addNotification(`Order ${order.id}: ${getStatus(order.statusIndex).label}.`, `tracking.html?track=${encodeURIComponent(order.id)}`);
    renderTracking(order);
    renderNotifications();
    toast(`Order moved to: ${getStatus(order.statusIndex).label}`);
  });

  if (location.pathname.endsWith('tracking.html')) {
    const requested = new URLSearchParams(location.search).get('track');
    if (requested) findAndRenderTracking(requested);
  }

  /* ---------- Contact form ---------- */
  $('#contact-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const message = $('#contact-message');
    if (!form.reportValidity()) {
      if (message) message.textContent = 'Please correct the highlighted fields before sending.';
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    const enquiries = read('lumiere_enquiries', []);
    enquiries.unshift({ ...data, type: 'contact', date: new Date().toISOString() });
    save('lumiere_enquiries', enquiries.slice(0, 50));
    if (location.hostname.endsWith('netlify.app')) {
      const payload = new URLSearchParams(new FormData(form));
      payload.set('form-name', form.getAttribute('name') || 'contact');
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: payload.toString() }).catch(() => {});
    }
    form.reset();
    if (message) message.textContent = 'Message received. We will respond using your selected contact method.';
    toast('Thank you — your enquiry has been recorded ✦');
  });

  // Give immediate, user-friendly feedback on invalid required fields.
  $$('form').forEach(form => form.addEventListener('invalid', event => {
    const fieldName = event.target.closest('label')?.childNodes[0]?.textContent?.trim() || 'This field';
    toast(`${fieldName} needs attention before you continue.`);
  }, true));



  /* ---------- Wishlist application ---------- */
  const wishlistKey = item => `${item.name || ''}|${item.img || ''}`;
  const getWishlist = () => read('lumiere_wishlist', []);
  const setWishlist = items => save('lumiere_wishlist', items);
  const wishlistHas = product => getWishlist().some(item => wishlistKey(item) === wishlistKey(product));
  const updateWishlistCount = () => {
    const count = getWishlist().length;
    $$('[data-wishlist-count]').forEach(node => { node.textContent = count; });
  };
  const toggleWishlist = product => {
    if (!product) return;
    const list = getWishlist();
    const key = wishlistKey(product);
    const index = list.findIndex(item => wishlistKey(item) === key);
    if (index >= 0) { list.splice(index, 1); toast(`${product.name} removed from wishlist.`); }
    else { list.unshift(product); toast(`${product.name} saved to your wishlist ♡`); }
    setWishlist(list); updateWishlistCount(); renderWishlist(); refreshWishlistButtons();
  };
  const refreshWishlistButtons = () => {
    $$('[data-wishlist]').forEach(button => {
      const product = productFrom(button);
      const saved = wishlistHas(product);
      button.classList.toggle('saved', saved);
      button.textContent = saved ? '♥ Saved' : '♡ Wishlist';
      button.setAttribute('aria-pressed', saved ? 'true' : 'false');
    });
  };
  $$('[data-wishlist]').forEach(button => button.addEventListener('click', event => {
    event.preventDefault(); event.stopPropagation(); toggleWishlist(productFrom(button));
  }));
  const renderWishlist = () => {
    const box = $('#wishlist-grid'); if (!box) return;
    const list = getWishlist();
    if (!list.length) {
      box.innerHTML = '<div class="empty-state app-empty"><span>♡</span><h3>No favourites yet</h3><p>Save products from the shop and they will appear here.</p><a class="btn" href="products.html">Explore products</a></div>';
      return;
    }
    box.innerHTML = list.map(item => {
      const product = PRODUCTS.find(p => p.name === item.name && p.img === item.img) || PRODUCTS.find(p => p.name === item.name);
      const detail = product ? `product-details.html?id=${product.id}` : 'products.html';
      return `<article class="card wishlist-card"><a class="ph" href="${detail}"><img src="${escapeHTML(item.img)}" alt="${escapeHTML(item.name)}" loading="lazy"></a><div class="body"><small>${escapeHTML(product?.category || 'Beauty')}</small><h3><a href="${detail}">${escapeHTML(item.name)}</a></h3><div class="price">${money(item.price)}</div><button type="button" data-wishlist-remove="${escapeHTML(wishlistKey(item))}">Remove</button><button type="button" data-wishlist-cart="${escapeHTML(wishlistKey(item))}">Add to bag</button></div></article>`;
    }).join('');
    $$('[data-wishlist-remove]', box).forEach(button => button.addEventListener('click', () => {
      const list = getWishlist().filter(item => wishlistKey(item) !== button.dataset.wishlistRemove);
      setWishlist(list); renderWishlist(); updateWishlistCount(); refreshWishlistButtons(); toast('Removed from wishlist.');
    }));
    $$('[data-wishlist-cart]', box).forEach(button => button.addEventListener('click', () => {
      const item = getWishlist().find(product => wishlistKey(product) === button.dataset.wishlistCart); if (item) addToCart(item);
    }));
  };

  /* ---------- Standalone account page enhancements ---------- */
  const renderAccountExtras = () => {
    const session = getSession();
    const guest = $('#account-guest');
    const dashboard = $('#account-dashboard');
    if (guest) guest.hidden = Boolean(session);
    if (dashboard && $('#account-auth') == null) dashboard.hidden = !session;
    if (!session) return;
    if ($('#account-name')) $('#account-name').textContent = `Hello, ${session.name.split(/\s+/)[0]}`;
    if ($('#account-email')) $('#account-email').textContent = session.email;
    if ($('#account-wishlist-count')) $('#account-wishlist-count').textContent = getWishlist().length;
    const users = read('lumiere_users', []); const user = users.find(u => u.email === session.email);
    if ($('#account-phone')) $('#account-phone').textContent = user?.phone || 'Not supplied';
    const orders = getOrders().filter(order => String(order.email || '').toLowerCase() === session.email.toLowerCase());
    if ($('#account-order-count')) $('#account-order-count').textContent = orders.length;
    const box = $('#account-orders');
    if (box) {
      box.innerHTML = orders.length ? orders.map(order => `<article class="order-card"><div><small>${new Date(order.date).toLocaleDateString('en-ZA')}</small><h4>${escapeHTML(order.id)}</h4><p>${order.items.length} item${order.items.length===1?'':'s'} · ${money(order.total)}</p></div><div class="order-card-side"><span class="status-badge">${escapeHTML(getStatus(order.statusIndex).label)}</span><a class="btn ghost" href="tracking.html?track=${encodeURIComponent(order.id)}">Track</a><a class="btn ghost" href="order-confirmation.html?order=${encodeURIComponent(order.id)}">Receipt</a></div></article>`).join('') : '<div class="empty-state small"><span>✧</span><h3>No orders yet</h3><p>When you checkout, your order history appears here.</p><a class="btn ghost" href="products.html">Start shopping</a></div>';
    }
  };
  $('#account-logout')?.addEventListener('click', () => { clearSession(); toast('You have signed out.'); renderAccountExtras(); updateAccountLinks(); });

  /* ---------- Forgot password demo ---------- */
  $('#forgot-form')?.addEventListener('submit', event => {
    event.preventDefault(); const form=event.currentTarget; if (!form.reportValidity()) return;
    const data=Object.fromEntries(new FormData(form).entries()); const message=$('#forgot-message');
    if (data.password !== data.confirm) { message.textContent='The new passwords do not match.'; return; }
    const users=read('lumiere_users', []); const user=users.find(u=>u.email.toLowerCase()===data.email.trim().toLowerCase());
    if (!user) { message.textContent='No demo account was found for that email.'; return; }
    user.passwordHash=hashPassword(data.password); user.passwordUpdatedAt=new Date().toISOString(); save('lumiere_users', users);
    form.reset(); message.textContent='Password updated. You can sign in with the new demo password.'; toast('Password updated successfully ✦');
  });

  /* ---------- Enquiry application ---------- */
  $('#enquiry-form')?.addEventListener('submit', event => {
    event.preventDefault(); const form=event.currentTarget; const message=$('#enquiry-message'); if (!form.reportValidity()) return;
    const data=Object.fromEntries(new FormData(form).entries());
    const enquiries=read('lumiere_enquiries', []); enquiries.unshift({...data,type:'enquiry',date:new Date().toISOString()}); save('lumiere_enquiries',enquiries.slice(0,50));
    if (location.hostname.endsWith('netlify.app')) { const payload=new URLSearchParams(new FormData(form)); payload.set('form-name',form.getAttribute('name')||'enquiry'); fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:payload.toString()}).catch(()=>{}); }
    form.reset(); message.textContent='Your enquiry has been recorded. Reference: ENQ-'+String(Date.now()).slice(-6); toast('Enquiry sent successfully ✦');
  });

  /* ---------- Reviews application ---------- */
  const defaultReviews = [
    {name:'Amahle',rating:5,title:'Soft and luxurious',message:'The finish feels polished and the product pages made choosing a shade simple.',date:'2026-09-18T10:00:00Z'},
    {name:'Lerato',rating:5,title:'Beautiful shopping experience',message:'I love the clean layout, wishlist and easy order tracking flow.',date:'2026-10-02T10:00:00Z'},
    {name:'Zinhle',rating:4,title:'Great beauty edit',message:'The gallery and product details are easy to browse on my phone.',date:'2026-10-20T10:00:00Z'}
  ];
  const getReviews=()=>{const saved=read('lumiere_reviews',[]); return saved.length?saved:defaultReviews;};
  const renderReviews=()=>{const box=$('#reviews-list');if(!box)return;box.innerHTML=getReviews().map(r=>`<article class="review-card"><div class="review-stars" aria-label="${Number(r.rating)} out of 5 stars">${'★'.repeat(Number(r.rating)||0)}${'☆'.repeat(5-(Number(r.rating)||0))}</div><h3>${escapeHTML(r.title)}</h3><p>“${escapeHTML(r.message)}”</p><small>${escapeHTML(r.name)} · ${new Date(r.date).toLocaleDateString('en-ZA')}</small></article>`).join('');};
  $('#review-form')?.addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const data=Object.fromEntries(new FormData(form).entries());const saved=read('lumiere_reviews',[]);saved.unshift({...data,rating:Number(data.rating),date:new Date().toISOString()});save('lumiere_reviews',saved.slice(0,30));form.reset();$('#review-message').textContent='Thank you — your review is now displayed.';renderReviews();toast('Review published ✦');});

  /* ---------- Payment preference application ---------- */
  const savedPayment=read('lumiere_payment_method','card');
  const checkoutPayment=document.querySelector(`#checkout-form input[name="payment"][value="${savedPayment}"]`); if(checkoutPayment) checkoutPayment.checked=true;
  $('#payment-form')?.addEventListener('submit',event=>{event.preventDefault();const value=new FormData(event.currentTarget).get('payment');save('lumiere_payment_method',value);$('#payment-message').textContent='Preferred payment method saved for checkout.';toast('Payment preference saved ✦');});
  const pref=document.querySelector(`#payment-form input[value="${savedPayment}"]`); if(pref) pref.checked=true;

  /* ---------- Order confirmation / printable receipt ---------- */
  const renderConfirmation=()=>{const box=$('#confirmation-content');if(!box)return;const requested=new URLSearchParams(location.search).get('order');const orders=getOrders();const order=(requested&&orders.find(o=>o.id===requested))||read('lumiere_last_order',null);if(!order){box.innerHTML='<div class="empty-state"><span>⌁</span><h3>No order selected</h3><p>Complete checkout or choose an order from your account.</p><a class="btn" href="products.html">Shop now</a></div>';return;} const rows=(order.items||[]).map(item=>`<div class="receipt-item"><img src="${escapeHTML(item.img)}" alt="${escapeHTML(item.name)}"><div><b>${escapeHTML(item.name)}</b><small>${item.qty} × ${money(item.price)}</small></div><strong>${money(item.qty*item.price)}</strong></div>`).join('');box.innerHTML=`<div class="confirmation-hero"><span>✓</span><div><div class="eyebrow">Order confirmed</div><h2>Thank you, ${escapeHTML((order.name||'Customer').split(/\s+/)[0])}</h2><p>Your order <b>${escapeHTML(order.id)}</b> is ready for tracking.</p></div></div><div class="receipt-layout"><div class="receipt-card"><div class="panel-title"><div><div class="eyebrow">Items purchased</div><h3>Your beauty bag</h3></div><button type="button" class="btn ghost no-print" id="print-receipt">Print / Save PDF</button></div>${rows}<div class="receipt-total"><span>Total</span><b>${money(order.total)}</b></div></div><aside class="delivery-details"><h3>Delivery details</h3><div class="detail-row"><span>Recipient</span><b>${escapeHTML(order.name)}</b></div><div class="detail-row"><span>Email</span><b>${escapeHTML(order.email)}</b></div><div class="detail-row"><span>Address</span><b>${escapeHTML([order.street,order.city,order.province,order.postal].filter(Boolean).join(', '))}</b></div><div class="detail-row"><span>Payment</span><b>${escapeHTML(String(order.payment||'demo').toUpperCase())}</b></div><div class="detail-row"><span>Status</span><b>${escapeHTML(getStatus(order.statusIndex).label)}</b></div><a class="btn btn-block mt-1 no-print" href="tracking.html?track=${encodeURIComponent(order.id)}">Track delivery</a></aside></div>`;$('#print-receipt')?.addEventListener('click',()=>window.print());};

  /* ---------- Admin demo application ---------- */
  const renderAdmin=()=>{const root=$('#admin-app');if(!root)return;const orders=getOrders(),users=read('lumiere_users',[]),enquiries=read('lumiere_enquiries',[]),reviews=read('lumiere_reviews',[]);$('#admin-orders-count').textContent=orders.length;$('#admin-users-count').textContent=users.length;$('#admin-enquiries-count').textContent=enquiries.length;$('#admin-reviews-count').textContent=reviews.length||defaultReviews.length;const table=$('#admin-orders');table.innerHTML=orders.length?orders.map(o=>`<tr><td>${escapeHTML(o.id)}</td><td>${escapeHTML(o.name)}</td><td>${money(o.total)}</td><td><select data-admin-status="${escapeHTML(o.id)}">${STATUSES.map((s,i)=>`<option value="${i}" ${i===Number(o.statusIndex||0)?'selected':''}>${escapeHTML(s.label)}</option>`).join('')}</select></td><td><a href="tracking.html?track=${encodeURIComponent(o.id)}">Track</a></td></tr>`).join(''):'<tr><td colspan="5">No demo orders yet.</td></tr>';$$('[data-admin-status]',table).forEach(select=>select.addEventListener('change',()=>{const list=getOrders();const order=list.find(o=>o.id===select.dataset.adminStatus);if(order){order.statusIndex=Number(select.value);order.lastUpdated=new Date().toISOString();setOrders(list);addNotification(`Order ${order.id}: ${getStatus(order.statusIndex).label}.`,`tracking.html?track=${encodeURIComponent(order.id)}`);renderNotifications();toast('Delivery status updated.');}}));};
  $('#admin-refresh')?.addEventListener('click',renderAdmin);

  /* ---------- Track-order alias ---------- */
  $('#track-alias-form')?.addEventListener('submit',event=>{event.preventDefault();const id=new FormData(event.currentTarget).get('trackingId');location.href=`tracking.html?track=${encodeURIComponent(id)}`;});

  /* ---------- Product application / new arrivals ---------- */
  const renderProductApp=(selector,limit,start=0)=>{const box=$(selector);if(!box||!PRODUCTS.length)return;box.innerHTML=PRODUCTS.slice(start,start+limit).map(p=>`<article class="card"><a class="ph" href="product-details.html?id=${p.id}"><img src="${escapeHTML(p.img)}" alt="${escapeHTML(p.name)}" loading="lazy"></a><div class="body"><small>${escapeHTML(p.category)}</small><h3><a href="product-details.html?id=${p.id}">${escapeHTML(p.name)}</a></h3><div class="price">${money(p.price)}</div><button type="button" data-app-cart="${p.id}">Add to bag</button><button type="button" data-app-wish="${p.id}">♡ Wishlist</button></div></article>`).join('');$$('[data-app-cart]',box).forEach(btn=>btn.addEventListener('click',()=>{const p=PRODUCTS.find(x=>x.id===Number(btn.dataset.appCart));if(p)addToCart({...p});}));$$('[data-app-wish]',box).forEach(btn=>btn.addEventListener('click',()=>{const p=PRODUCTS.find(x=>x.id===Number(btn.dataset.appWish));if(p)toggleWishlist({...p});}));};

  /* ---------- Tiny notification centre ---------- */
  const addNotification=(message,href='account.html')=>{const list=read('lumiere_notifications',[]);list.unshift({message,href,date:new Date().toISOString(),read:false});save('lumiere_notifications',list.slice(0,20));};
  const renderNotifications=()=>{const box=$('#notification-list');if(!box)return;const list=read('lumiere_notifications',[]);box.innerHTML=list.length?list.map(n=>`<a class="notification-item" href="${escapeHTML(n.href)}"><span>✦</span><div><b>${escapeHTML(n.message)}</b><small>${new Date(n.date).toLocaleString('en-ZA')}</small></div></a>`).join(''):'<p class="fine-muted">No notifications yet.</p>';};



  /* ---------- Netlify form test page ---------- */
  $('#netlify-test-form')?.addEventListener('submit', event => {
    const form = event.currentTarget;
    if (!form.reportValidity()) { event.preventDefault(); return; }
    if (!location.hostname.endsWith('netlify.app')) {
      event.preventDefault();
      const message = $('#netlify-test-message');
      if (message) message.textContent = 'Local test passed. Deploy to Netlify to test server-side form capture.';
      toast('Netlify form structure is ready for deployment ✦');
    }
  });

  /* ---------- Page initializers for added applications ---------- */
  renderWishlist(); refreshWishlistButtons(); updateWishlistCount(); renderAccountExtras(); renderReviews(); renderConfirmation(); renderAdmin(); renderProductApp('#product-app-grid',8,0); renderProductApp('#new-arrivals-grid',8,8); renderNotifications();


  /* ---------- Initial page state ---------- */
  persistCart();
  updateAccountLinks();
  renderAccountDashboard();
  prefillCheckout();
})();
