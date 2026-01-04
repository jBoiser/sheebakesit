document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.getElementById('gallery-wrapper');
    const modalElement = document.getElementById('galleryModal');
    
    if (!galleryContainer || !modalElement) return;

    const modal = new bootstrap.Modal(modalElement);
    
    async function loadGallery() {
        try {
            // Path matches the public route in web.php
            const response = await fetch('/api/public-gallery', {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const contentType = response.headers.get("content-type");
            
            if (contentType && contentType.includes("text/html")) {
                console.error("The server returned HTML instead of JSON. Check your routes.");
                galleryContainer.innerHTML = `
                    <div class="text-center text-muted py-5">
                        <p>Gallery configuration error. Please try again later.</p>
                    </div>`;
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === 'success') {
                // Filter only active status
                const activeItems = result.data.filter(item => 
                    item.status.toLowerCase() === 'active'
                );
                renderGallery(activeItems);
            }
        } catch (error) {
            console.error("Gallery Load Error:", error);
            galleryContainer.innerHTML = '<p class="text-center text-muted">Unable to connect to the gallery database.</p>';
        }
    }

    function renderGallery(items) {
        if (!items || items.length === 0) {
            galleryContainer.innerHTML = '<p class="text-center text-muted">No active photos to display.</p>';
            return;
        }

        let html = '';
        items.forEach(item => {
            html += `
                <div class="swiper-slide" 
                     data-title="${item.title}" 
                     data-desc="${item.description || 'Simply delicious bakes.'}" 
                     data-img="${item.image_url}">
                    <img src="${item.image_url}" alt="${item.title}" loading="lazy">
                </div>
            `;
        });

        galleryContainer.innerHTML = html;

        initSwiper();
        
        // Use event delegation for better performance
        galleryContainer.addEventListener('click', function(e) {
            const slide = e.target.closest('.swiper-slide');
            if (slide) {
                openGalleryModal(slide.dataset);
            }
        });
    }

    function initSwiper() {
        const slideCount = document.querySelectorAll('.gallery-swiper .swiper-slide').length;
        
        new Swiper(".gallery-swiper", {
            loop: slideCount > 3, 
            centeredSlides: true,
            slidesPerView: 1.2, // Show a peek of the next slide on mobile
            spaceBetween: 10,
            speed: 800,
            observer: true,
            observeParents: true,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            // Responsive breakpoints
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 15,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
                1440: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                }
            }
        });
    }

    function openGalleryModal(data) {
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');

        if (modalImg) modalImg.src = data.img;
        if (modalTitle) modalTitle.innerText = data.title;
        if (modalDesc) modalDesc.innerText = data.desc;
        
        // Ensure the modal dialog has the 'modal-dialog-centered' class 
        // through Javascript if it was missing in the HTML for any reason
        const dialog = modalElement.querySelector('.modal-dialog');
        if (dialog && !dialog.classList.contains('modal-dialog-centered')) {
            dialog.classList.add('modal-dialog-centered');
        }

        modal.show();
    }

    loadGallery();
});