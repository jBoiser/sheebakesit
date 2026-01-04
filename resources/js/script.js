let cart = [];

/* ---------- PUBLIC FUNCTIONS (Exported to Global Window) ---------- */

/**
 * Generic Add to Cart for Cookies (Called from HTML onclick)
 */
window.addToCart = function(id, escapedName, price, img) {
    const qtyInput = document.getElementById(`qty-${id}`);
    const qty = Math.max(1, parseInt(qtyInput?.value || 1));

    const name = (typeof escapedName === 'string') ? escapedName.replace(/\\'/g, "'") : escapedName;

    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty += qty;
    else cart.push({ id, name, price: Number(price), qty, img });

    updateCartCount();
    updateCardBadges();
    updateCakeBadges(); 
    visualButtonTick(id);
    if (qtyInput) qtyInput.value = 1;
}

/**
 * Add Cake to Cart (Handles variants/sizes) (Called from HTML onclick)
 */
window.addCakeToCart = function(mainId, escapedName, img) {
    const selectedHidden = document.getElementById(`selected-id-${mainId}`);
    if (!selectedHidden) return;
    const variantId = selectedHidden.value; // real ca id of selected variant
    const priceText = document.getElementById(`price-${mainId}`).innerText || '$0.00';
    const price = parseFloat(priceText.replace('$', '')) || 0;
    const qtyInput = document.getElementById(`qty-${mainId}`);
    const qty = Math.max(1, parseInt(qtyInput?.value || 1));

    // size label (if any)
    let sizeLabel = '';
    const checked = document.querySelector(`input[name="size-${mainId}"]:checked`);
    if (checked) {
        const lab = document.querySelector(`label[for="${checked.id}"]`);
        if (lab) sizeLabel = ` (${lab.innerText})`;
    }

    const name = (typeof escapedName === 'string') ? escapedName.replace(/\\'/g, "'") : escapedName;
    const fullName = name + sizeLabel;

    const existing = cart.find(i => i.id === variantId);
    if (existing) existing.qty += qty;
    else cart.push({ id: variantId, name: fullName, price, qty, img });

    updateCartCount();
    updateCardBadges();
    updateCakeBadges();
    visualButtonTick(variantId);
    if (qtyInput) qtyInput.value = 1;
}

/**
 * Opens the Cart Modal
 */
window.openCart = function() {
    const tbody = document.getElementById('cartTableBody');
    let html = '', total = 0;
    
    // Ensure Bootstrap is available
    if (typeof bootstrap === 'undefined' || typeof bootstrap.Modal === 'undefined') {
        console.error("Bootstrap 5 JS is required for modals.");
        return;
    }

    if (!cart.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4">Your cart is empty</td></tr>';
        document.getElementById('grandTotal').innerText = '0.00';
    } else {
        cart.forEach((it, idx) => {
            const sub = it.price * it.qty;
            total += sub;
            html += `<tr>
                <td><img src="${it.img}" class="cart-item-img" alt="item"></td>
                <td><span class="fw-semibold text-dark">${escapeHtml(it.name)}</span></td>
                <td class="col-price">$${Number(it.price).toFixed(2)}</td>
                <td>
                    <div class="input-group input-group-sm" style="width:100px">
                        <button class="btn btn-outline-secondary" type="button" onclick="changeCartQty(${idx},-1)">-</button>
                        <input type="text" class="form-control text-center bg-white" value="${it.qty}" readonly>
                        <button class="btn btn-outline-secondary" type="button" onclick="changeCartQty(${idx},1)">+</button>
                    </div>
                </td>
                <td class="fw-bold">$${sub.toFixed(2)}</td>
                <td><button class="btn btn-sm btn-outline-danger rounded-circle" style="width:30px;height:30px;padding:0" onclick="removeFromCart(${idx})"><i class="fas fa-times"></i></button></td>
            </tr>`;
        });
        tbody.innerHTML = html;
        document.getElementById('grandTotal').innerText = total.toFixed(2);
    }
    new bootstrap.Modal(document.getElementById('cartModal')).show();
}

/**
 * Opens the Checkout Modal
 */
window.openCheckout = function() {
    // Ensure Bootstrap is available
    if (typeof bootstrap === 'undefined' || typeof bootstrap.Modal === 'undefined') {
        console.error("Bootstrap 5 JS is required for modals.");
        return;
    }
    
    if (!cart.length) { 
        window.showMessage('Cart Status', 'Your cart is empty!');
        return; 
    }
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const totalEl = document.getElementById('checkoutTotalAmount');
    if (totalEl) totalEl.innerText = total.toFixed(2);
    
    // Hide Cart Modal
    const cartModalEl = document.getElementById('cartModal');
    if (cartModalEl) bootstrap.Modal.getInstance(cartModalEl)?.hide();
    
    // Show Checkout Modal
    new bootstrap.Modal(document.getElementById('checkoutModal')).show();
}

window.scrollToSection = function(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

window.submitOrder = function() {
    // Ensure Bootstrap is available
    if (typeof bootstrap === 'undefined' || typeof bootstrap.Modal === 'undefined') {
        console.error("Bootstrap 5 JS is required for modals.");
        return;
    }

    const form = document.getElementById('checkoutForm');
    if (!form) return;
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const fileInput = document.getElementById('proofFile');
    if (fileInput && fileInput.files.length > 0) {
        const sizeMB = fileInput.files[0].size / 1024 / 1024;
        if (sizeMB > 5) { 
            window.showMessage('File Error', 'File is too large (max 5MB)');
            return; 
        }
    }

    const checkoutModalEl = document.getElementById('checkoutModal');
    if (checkoutModalEl) bootstrap.Modal.getInstance(checkoutModalEl)?.hide();
    
    const cartModalEl = document.getElementById('cartModal');
    if (cartModalEl) bootstrap.Modal.getInstance(cartModalEl)?.hide();

    const loadingModalEl = document.getElementById('loadingModal');
    const loadingModal = new bootstrap.Modal(loadingModalEl);
    loadingModal.show();

    const formData = new FormData(form);

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    formData.append('total', total.toFixed(2));

    cart.forEach((it, idx) => {
        formData.append(`items[${idx}][item_id]`, it.id);
        formData.append(`items[${idx}][item_name]`, it.name);
        formData.append(`items[${idx}][price]`, Number(it.price).toFixed(2));
        formData.append(`items[${idx}][quantity]`, it.qty);
        formData.append(`items[${idx}][total]`, (it.price * it.qty).toFixed(2));
    });

    if (fileInput && fileInput.files.length > 0) {
        formData.append('proof_image', fileInput.files[0]);
    }

    // Call the API
    fetch('/api/place-order', { method: 'POST', body: formData })
     .then(r => r.json())
     .then(data => {
         const loadingInstance = bootstrap.Modal.getInstance(loadingModalEl);
         if (loadingInstance) loadingInstance.hide();

         setTimeout(() => {
             if (data.status === 'success') {
                 document.getElementById('successReference').innerText =
                     data.reference_no || data.order_id || '';

                 const successModalEl = document.getElementById('successModal');
                 const successModal = bootstrap.Modal.getOrCreateInstance(successModalEl);

                 cleanupStaleModals();

                 successModal.show();

                 successModalEl.addEventListener(
                     'hidden.bs.modal',
                     () => location.reload(),
                     { once: true }
                 );
             } else {
                 window.showMessage('Error', 'Error: ' + (data.message || data.error || 'Unknown'));
             }
         }, 500); 
     })
     .catch(err => {
         const loadingInstance = bootstrap.Modal.getInstance(loadingModalEl);
         if (loadingInstance) loadingInstance.hide();
         
         console.error(err);
         setTimeout(() => {
             window.showMessage('Error', 'An error occurred. Please try again.');
         }, 500);
     });
} 

window.showMessage = function(title, body) {
    if (typeof bootstrap === 'undefined' || typeof bootstrap.Modal === 'undefined') {
        console.error("Bootstrap 5 JS is required for modals.");
        return;
    }
    
    const el = document.getElementById('messageModal');
    if (!el) {
        console.error(`Cannot show message: ${title} - ${body}. Modal element #messageModal not found.`);
        return;
    }
    document.getElementById('messageModalTitle').innerText = title;
    document.getElementById('messageModalBody').innerText = body;
    new bootstrap.Modal(el).show();
}

window.updateCakeSelection = function(mainId, variantId, price) {
    const priceEl = document.getElementById(`price-${mainId}`);
    if (priceEl) priceEl.innerText = `$${Number(price).toFixed(2)}`;

    const hidden = document.getElementById(`selected-id-${mainId}`);
    if (hidden) hidden.value = variantId;

    updateCakeBadges();
}

window.changeCartQty = function(index, change) {
    if (!cart[index]) return;
    const next = cart[index].qty + change;
    if (next <= 0) return;
    cart[index].qty = next;
    updateCartCount();
    updateCardBadges();
    updateCakeBadges();
    openCart(); 
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCardBadges();
    updateCakeBadges();
    openCart(); 
}


/* ---------- BOOT ---------- */
async function loadAllData() {
    try {
        const res = await fetch('/api/data/all');
        
        if (!res.ok) {
            throw new Error(`Server returned ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        if (data.error) {
            console.error('DB Error:', data.error);
            return;
        }

        renderFooter(data.footer || {});
        
        // Store data globally so we can access it during resize events
        window.__CAROUSEL_DATA = data.carousel || []; 
        renderCarousel(window.__CAROUSEL_DATA);

        renderMarquee(data.marquee || []);
        renderPage(data);
        
    } catch (err) {
        console.error('Error loading data:', err);
    } finally {
        hideLoader();
    }
}


function hideLoader() {
    const loader = document.getElementById('loader-overlay');
    if (!loader) return;
    
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.visibility = 'hidden';
        document.body.style.overflow = ''; 
        window.scrollTo(0, 0);
    }, 900);
}

/* ---------- RENDER HELPERS ---------- */
function setSrcIfExists(id, url) {
    if (!url) return;
    const el = document.getElementById(id);
    if (!el) return;
    el.src = url;
    el.classList.remove('d-none');
}

function renderFooter(assets) {
    const logoUrl = assets.logo || assets.logo1;
    if (logoUrl) {
        setSrcIfExists('nav-logo', logoUrl);
        setSrcIfExists('footer-logo', logoUrl);

        const loaderLogo = document.getElementById('loader-logo-img');
        const loaderSpinner = document.getElementById('loader-spinner');
        if (loaderLogo) {
            loaderLogo.src = logoUrl;
            loaderLogo.classList.remove('d-none');
            if (loaderSpinner) loaderSpinner.classList.add('d-none');
        }
        const ph = document.getElementById('footer-logo-placeholder');
        if (ph) ph.classList.add('d-none');
    }

    setSrcIfExists('nav-brand-img', assets.logo2);
    if (assets.logo2) {
        const txt = document.getElementById('nav-brand-text');
        if (txt) txt.classList.add('d-none');
    }

    setSrcIfExists('footer-qr1', assets.qr1);
    setSrcIfExists('footer-qr2', assets.qr2);
    setSrcIfExists('about-img-1', assets.about1);
    setSrcIfExists('about-img-2', assets.about2);
    setSrcIfExists('about-img-3', assets.about3);
}

function renderPage(data) {
    if (data.cookies) {
        renderCards(data.cookies.filter(c => c.category === 'Best Seller'), 'best-seller-container');
        renderCards(data.cookies.filter(c => c.category === 'Featured'), 'featured-container');
        renderCards(data.cookies.filter(c => c.category === 'Classic'), 'classic-container');
    }
    if (data.cakes) {
        renderCakeCards(data.cakes, 'cake-container');
    }
}

function renderMarquee(items) {
    const top = document.getElementById('marquee-track-top');
    const bottom = document.getElementById('marquee-track-bottom');
    if (!items || items.length === 0) return;
    const loopItems = [...items, ...items, ...items];
    const html = loopItems.map(row => `<div class="marquee-item"><img src="${row.img}" alt="${escapeHtml(row.name)}"></div>`).join('');
    if (top) top.innerHTML = html;
    if (bottom) bottom.innerHTML = html;
}

/* ---------- CAROUSEL LOGIC ---------- */
let resizeTimeout = null;
let lastIsMobile = window.innerWidth <= 768;

window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
        const isMobile = window.innerWidth <= 768;

        if (isMobile !== lastIsMobile) {
            lastIsMobile = isMobile;
            renderCarousel(window.__CAROUSEL_DATA || []);
        }
    }, 250); 
});


function renderCarousel(items) {
    const isMobile = window.innerWidth <= 768;
    const desktopContainer = document.getElementById('desktop-carousel-items');
    const mobileContainer = document.getElementById('mobile-carousel-items');
    
    if (desktopContainer) desktopContainer.innerHTML = '';
    if (mobileContainer) mobileContainer.innerHTML = '';

    if (!items || items.length === 0) return;

    const desktopItems = items.filter(i => i.type?.toLowerCase() === 'desktop');
    const mobileItems = items.filter(i => i.type?.toLowerCase() === 'mobile');

    if (!isMobile && desktopContainer && desktopItems.length) {
        desktopContainer.innerHTML = desktopItems
            .map((it, idx) => carouselItemHtml(it, idx, 'desktop-carousel-img'))
            .join('');
    } else if (isMobile && mobileContainer && mobileItems.length) {
        mobileContainer.innerHTML = mobileItems
            .map((it, idx) => carouselItemHtml(it, idx, 'mobile-carousel-img'))
            .join('');
    }
}

function carouselItemHtml(item, index, className) {
    const active = index === 0 ? 'active' : '';
    const file = item.img || '';

    if (!file) {
        return ''
    }

    const lower = file.toLowerCase();
    const isVideo = lower.endsWith('.mp4') || lower.endsWith('.webm');

    if (isVideo) {
        return `
            <div class="carousel-item ${active}">
                <video class="${className} d-block w-100" autoplay loop muted playsinline>
                    <source src="${file}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        `;
    }

    return `
        <div class="carousel-item ${active}">
            <img src="${file}" class="${className} d-block w-100" alt="${item.name}">
        </div>
    `;
}


/* ---------- COOKIE CARDS (Updated with custom Row Logic) ---------- */
function renderCards(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!items || items.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-muted">Coming Soon</div>';
        return;
    }

    const count = items.length;
    // Always use col-lg-2 to maintain consistent card width (standard 6-per-row size)
    // and standard small gaps.
    const colClass = 'col-lg-2'; 

    // LOGIC to force line breaks for specific counts:
    // 7 items: 4 top, 3 bottom -> break after index 3
    // 8 items: 4 top, 4 bottom -> break after index 3
    // 9 items: 5 top, 4 bottom -> break after index 4
    // 10 items: 5 top, 5 bottom -> break after index 4
    // 11 items: 6 top, 5 bottom -> Natural break for col-lg-2 (no forced break needed)

    let breakAtIndex = -1;
    if (count === 7 || count === 8) {
        breakAtIndex = 3; 
    } else if (count === 9 || count === 10) {
        breakAtIndex = 4;
    }

    const html = items.map((item, index) => {
        let extraHtml = '';
        // If this index is the breakpoint, add a full-width div to force the next items to a new line
        // Only apply this on desktop (d-lg-block), let mobile flow naturally
        if (index === breakAtIndex) {
            extraHtml = '<div class="w-100 d-none d-lg-block"></div>';
        }

        return `
            <div class="col-4 col-md-4 ${colClass}">
                <div class="product-card h-100 d-flex flex-column position-relative">
                    <span id="card-badge-${item.id}" class="card-qty-badge d-none">0</span>
                    <img src="${item.img}" alt="${escapeHtml(item.name)}" loading="lazy">
                    <div class="card-body d-flex flex-column p-2">
                        <h6 class="card-title mb-1" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</h6>
                        <p class="price-tag mb-2">$${Number(item.price).toFixed(2)}</p>
                        <div class="mt-auto">
                            <div class="input-group input-group-sm mb-2">
                                <input type="number" id="qty-${item.id}" value="1" min="1" class="form-control text-center px-1">
                            </div>
                            <button data-item-id="${item.id}" class="btn btn-custom w-100" onclick="addToCart('${item.id}','${escapeJs(item.name)}',${Number(item.price)},'${item.img}')">Add</button>
                        </div>
                    </div>
                </div>
            </div>${extraHtml}`;
    }).join('');

    container.innerHTML = html;
}


/* ---------- CAKE CARDS ---------- */
function renderCakeCards(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!items || items.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-muted">Coming Soon</div>';
        return;
    }

    // Group by name
    const grouped = {};
    items.forEach(it => {
        if (!grouped[it.name]) grouped[it.name] = { name: it.name, img: it.img, variants: [] };
        grouped[it.name].variants.push({ id: it.id, size: it.size || '', price: Number(it.price) });
    });

    let html = '';
    Object.values(grouped).forEach(group => {
        const mainId = group.variants[0].id;
        const first = group.variants[0];
        const hasSizes = group.variants.length > 1;

        let radiosHtml = '';
        if (hasSizes) {
            radiosHtml = group.variants.map((v, i) => {
                const checked = i === 0 ? 'checked' : '';
                return `
                    <input type="radio" class="btn-check" name="size-${mainId}" id="opt-${mainId}-${i}" autocomplete="off" ${checked} onchange="updateCakeSelection('${mainId}','${v.id}',${v.price})">
                    <label class="btn btn-outline-pink" for="opt-${mainId}-${i}">${escapeHtml(v.size || 'Regular')}</label>`;
            }).join('');
            radiosHtml = `<div class="mb-1 small fw-bold" style="font-size:0.75rem;color:var(--dark-pink)">Size</div><div class="d-flex flex-wrap justify-content-center mb-2">${radiosHtml}</div>`;
        }

        const controlHtml = radiosHtml + `<input type="hidden" id="selected-id-${mainId}" value="${first.id}">`;

        html += `
            <div class="col-4 col-md-4 col-lg-2">
                <div class="product-card h-100 d-flex flex-column position-relative">
                    <span id="badge-wrapper-${mainId}"></span>
                    <img src="${group.img}" alt="${escapeHtml(group.name)}" loading="lazy">
                    <div class="card-body d-flex flex-column p-2">
                        <h6 class="card-title mb-1" title="${escapeHtml(group.name)}">${escapeHtml(group.name)}</h6>
                        <p class="price-tag mb-2" id="price-${mainId}">$${first.price.toFixed(2)}</p>
                        <div class="mt-auto">
                            ${controlHtml}
                            <div class="input-group input-group-sm mb-2">
                                <input type="number" id="qty-${mainId}" value="1" min="1" class="form-control text-center px-1">
                            </div>
                            <button data-item-id="${mainId}" class="btn btn-custom w-100" onclick="addCakeToCart('${mainId}','${escapeJs(group.name)}','${group.img}')">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    updateCakeBadges();
}

function visualButtonTick(itemId) {
    const btn = document.querySelector(`[data-item-id="${itemId}"]`);
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.innerHTML = '✓';
    setTimeout(() => { btn.innerHTML = orig; }, 800);
}

function updateCartCount() {
    const el = document.getElementById('cartCount');
    if (el) el.innerText = cart.reduce((s, i) => s + i.qty, 0);
}

function updateCardBadges() {
    document.querySelectorAll('.card-qty-badge').forEach(b => {
        b.classList.add('d-none');
        b.innerText = '';
    });

    cart.forEach(item => {
        const badge = document.getElementById(`card-badge-${item.id}`);
        if (badge) {
            badge.innerText = item.qty;
            badge.classList.remove('d-none');
        }
    });
}

function updateCakeBadges() {
    document.querySelectorAll('[id^="selected-id-"]').forEach(input => {
        const mainId = input.id.replace('selected-id-', '');
        const wrapper = document.getElementById(`badge-wrapper-${mainId}`);
        if (!wrapper) return;
        const selectedVariantId = input.value; 
        const cartItem = cart.find(c => c.id === selectedVariantId);
        if (cartItem) {
            wrapper.innerHTML = `<span class="card-qty-badge">${cartItem.qty}</span>`;
            const b = wrapper.querySelector('.card-qty-badge');
            if (b) b.classList.remove('d-none');
        } else {
            wrapper.innerHTML = '';
        }
    });
}

function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"'`=\/]/g, function (c) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
}

function escapeJs(s) {
    if (!s) return '';
    return String(s).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function cleanupStaleModals() {
    document.body.classList.remove('modal-open');
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
}

document.addEventListener('DOMContentLoaded', loadAllData);