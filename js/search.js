document.addEventListener('DOMContentLoaded', () => {

    // --- Elemen DOM utama untuk pencarian dan layout ---
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResultsContainer = document.getElementById('search-results');
    const allCategorySections = document.querySelectorAll('.main-content .category-section');
    const heroSlider = document.querySelector('.hero-slider');
    const sectionTitleH1 = document.querySelector('.main-content .section-title');

    // --- Data dan Fuse.js ---
    let productsData = [];
    let fuse;

    // --- Elemen DOM untuk Modal Detail Produk Lengkap (#product-modal) ---
    const productModal = document.getElementById('product-modal');
    const productModalCloseButton = productModal ? productModal.querySelector('.close-button') : null;
    const productModalBody = productModal ? productModal.querySelector('.modal-body') : null;

    // --- Elemen DOM untuk Modal Gambar Saja (#imageModal) ---
    const imageModal = document.getElementById('imageModal');
    const imageModalCloseButton = imageModal ? imageModal.querySelector('.close') : null;
    const modalImgElement = imageModal ? document.getElementById('modalImg') : null;

    // === VARIABEL UNTUK MENGELOLA STATE MODAL & DEBOUNCING ===
    let isModalTransitioning = false;
    let activeModal = null;
    let debounceTimer;

    // --- Validasi elemen penting ada di DOM ---
    if (!searchInput || !searchButton || !searchResultsContainer || !productModal || !productModalCloseButton || !productModalBody || !imageModal || !imageModalCloseButton || !modalImgElement) {
        console.error('Error: One or more *essential* DOM elements for search or modals are missing. Please check your HTML IDs and classes.');
        return;
    }

    // === FUNGSI UTAMA UNTUK SANITASI DATA ===
    function sanitizeText(input) {
        if (!input) return '';
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // --- Fungsi untuk menutup MODAL DETAIL PRODUK LENGKAP (#product-modal) ---
    function closeProductModal() {
        if (isModalTransitioning) return;
        isModalTransitioning = true;
        productModal.classList.remove('active');
        productModalBody.innerHTML = '';
        setTimeout(() => {
            isModalTransitioning = false;
            activeModal = null;
        }, 300);
    }

    // --- Fungsi untuk menutup MODAL GAMBAR SAJA (#imageModal) ---
    function closeImageModal() {
        if (isModalTransitioning) return;
        isModalTransitioning = true;
        imageModal.classList.remove('active');
        modalImgElement.src = '';
        setTimeout(() => {
            isModalTransitioning = false;
            activeModal = null;
        }, 300);
    }

    // --- Event Listeners untuk tombol close masing-masing modal ---
    if (productModalCloseButton) productModalCloseButton.addEventListener('click', closeProductModal);
    if (imageModalCloseButton) imageModalCloseButton.addEventListener('click', closeImageModal);

    // --- Event Listeners untuk klik di luar modal (overlay) ---
    if (productModal) productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeProductModal();
        }
    });
    if (imageModal) imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            closeImageModal();
        }
    });

    // --- Event Listener untuk tombol ESC (menutup modal yang aktif) ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeModal) {
            if (activeModal === 'product') {
                closeProductModal();
            } else if (activeModal === 'image') {
                closeImageModal();
            }
        }
    });

    // --- Memuat data produk dan menginisialisasi Fuse.js (Hanya sekali!) ---
    fetch('data/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - Could not load products.json.`);
            }
            return response.json();
        })
        .then(data => {
            productsData = data;
            const options = {
                keys: [
                    { name: 'name', weight: 0.9 },
                    { name: 'brand', weight: 0.7 },
                    { name: 'model', weight: 0.6 },
                    { name: 'category', weight: 0.5 },
                    { name: 'protocol', weight: 0.5 },
                    { name: 'frequency_band', weight: 0.4 },
                    { name: 'description', weight: 0.3 },
                    { name: 'short_description', weight: 0.8 },
                    { name: 'keywords', weight: 1.0 }
                ],
                threshold: 0.3,
                ignoreLocation: true,
                includeScore: true
            };
            fuse = new Fuse(productsData, options);
            console.log("Products data loaded and Fuse.js initialized.");
            showMainContentSections();
        })
        .catch(error => {
            console.error("Error loading products data:", error);
            if (searchResultsContainer) {
                searchResultsContainer.innerHTML = `
                    <div class="no-results-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Gagal memuat data produk untuk pencarian. Silakan coba lagi nanti.</p>
                    </div>
                `;
                searchResultsContainer.style.display = 'block';
                searchResultsContainer.classList.remove('category-products');
                hideMainContentSections();
            }
        });

    // --- Fungsi untuk menyembunyikan bagian konten utama ---
    function hideMainContentSections() {
        if (heroSlider) { heroSlider.style.display = 'none'; }
        if (sectionTitleH1) { sectionTitleH1.style.display = 'none'; }
        allCategorySections.forEach(section => { section.style.display = 'none'; });
    }

    // --- Fungsi untuk menampilkan bagian konten utama ---
    function showMainContentSections() {
        if (heroSlider) { heroSlider.style.display = 'block'; }
        if (sectionTitleH1) { sectionTitleH1.style.display = 'block'; }
        allCategorySections.forEach(section => { section.style.display = 'block'; });
        if (searchResultsContainer) {
            searchResultsContainer.innerHTML = '';
            searchResultsContainer.style.display = 'none';
            searchResultsContainer.classList.remove('category-products');
        }
    }

    // --- FUNGSI UTAMA UNTUK MENAMPILKAN HASIL PENCARIAN (VERSI DIPERBAIKI) ---
    function displayResults(results) {
        if (!searchResultsContainer) return;

        searchResultsContainer.innerHTML = '';
        const query = searchInput.value.trim();

        if (query.length > 0) {
            hideMainContentSections();
            searchResultsContainer.style.display = 'grid';
            searchResultsContainer.classList.add('category-products');
        } else {
            showMainContentSections();
            return;
        }

        if (results.length > 0) {
            let htmlContent = '';
            results.forEach(({ item }, index) => {
                const badge = item.discontinued ? '<span class="product-badge discontinue">Discontinued</span>' : '';
                const featuresList = item.features && item.features.length > 0 ? `
                    <ul>
                        ${item.features.map(f => `<li>${sanitizeText(f)}</li>`).join('')}
                    </ul>` : '';
                const brochureButton = item.brochure_url ? `<a href="${sanitizeText(item.brochure_url)}" target="_blank" class="btn-download"><i class="fas fa-download"></i> Download Brochure</a>` : '';

                htmlContent += `
                    <div class="product-card" style="transition-delay: ${index * 50}ms;">
                        <div class="image-wrapper">
                            <img src="${sanitizeText(item.main_image_url)}" alt="${sanitizeText(item.name)}">
                        </div>
                        <div class="product-info">
                            <h3>${sanitizeText(item.name)}${badge}</h3>
                            <p>${sanitizeText(item.short_description)}</p>
                            ${featuresList}
                            ${brochureButton}
                        </div>
                    </div>
                `;
            });
            searchResultsContainer.innerHTML = htmlContent;

            // Memastikan browser memiliki waktu untuk merender elemen sebelum menambahkan kelas animasi
            // Ini adalah metode paling andal untuk memicu transisi CSS.
            setTimeout(() => {
                const cards = searchResultsContainer.querySelectorAll('.product-card');
                cards.forEach(card => {
                    card.classList.add('fade-in');
                });
            }, 10);

        } else {
            const noResultDiv = document.createElement('div');
            noResultDiv.classList.add('no-results-message');
            const icon = document.createElement('i');
            icon.classList.add('fas', 'fa-frown');
            noResultDiv.appendChild(icon);
            const messageText = document.createElement('p');
            messageText.textContent = `Tidak ada produk yang cocok ditemukan untuk "${sanitizeText(query)}".`;
            noResultDiv.appendChild(messageText);
            searchResultsContainer.appendChild(noResultDiv);
            searchResultsContainer.style.display = 'block';
            searchResultsContainer.classList.remove('category-products');
        }
    }

    // --- FUNGSI: Menampilkan hanya gambar di #imageModal ---
    function displayProductImageOnlyInModal(imageUrl) {
        if (isModalTransitioning || activeModal === 'image') {
            console.log('Modal sedang dalam transisi atau sudah aktif, klik diabaikan.');
            return;
        }

        if (activeModal === 'product') {
            closeProductModal();
            setTimeout(() => {
                _openImageModal(imageUrl);
            }, 300);
        } else {
            _openImageModal(imageUrl);
        }
    }

    // Fungsi internal untuk membuka modal gambar
    function _openImageModal(imageUrl) {
        isModalTransitioning = true;
        if (modalImgElement) modalImgElement.src = sanitizeText(imageUrl);
        if (imageModal) imageModal.classList.add('active');
        activeModal = 'image';
        setTimeout(() => {
            isModalTransitioning = false;
        }, 300);
    }

    // --- FUNGSI: Menampilkan detail produk lengkap di #product-modal ---
    window.displayProductInModal = function(product) {
        if (isModalTransitioning || activeModal === 'product') {
            console.log('Modal sedang dalam transisi atau sudah aktif, klik diabaikan.');
            return;
        }

        if (activeModal === 'image') {
            closeImageModal();
            setTimeout(() => {
                _openProductModal(product);
            }, 300);
        } else {
            _openProductModal(product);
        }
    }

    // Fungsi internal untuk membuka modal produk
    function _openProductModal(product) {
        isModalTransitioning = true;
        if (productModalBody) {
            productModalBody.innerHTML = '';
            const featuresList = product.features ? product.features.map(feature => `<li>${sanitizeText(feature)}</li>`).join('') : '';
            const modalContentHTML = `
                <div class="modal-product-detail">
                    <img src="${sanitizeText(product.main_image_url)}" alt="${sanitizeText(product.name)}" class="modal-product-image">
                    <div class="modal-product-info">
                        <h2>${sanitizeText(product.name)}</h2>
                        ${product.discontinued ? '<p class="product-badge discontinue">Discontinued</p>' : ''}
                        <p><strong>Merek:</strong> ${sanitizeText(product.brand)}</p>
                        <p><strong>Model:</strong> ${sanitizeText(product.model)}</p>
                        <p><strong>Kategori:</strong> ${sanitizeText(product.category)}</p>
                        <p><strong>Protokol:</strong> ${sanitizeText(product.protocol)}</p>
                        <p><strong>Frekuensi:</strong> ${sanitizeText(product.frequency_band)}</p>
                        ${product.power_output && product.power_output !== "N/A" ? `<p><strong>Daya Output:</strong> ${sanitizeText(product.power_output)}</p>` : ''}
                        ${product.channels && product.channels !== "N/A" ? `<p><strong>Channels:</strong> ${sanitizeText(product.channels)}</p>` : ''}
                        <p>${sanitizeText(product.description)}</p>
                        ${featuresList ? `<h4>Fitur Utama:</h4><ul>${featuresList}</ul>` : ''}
                        ${product.discontinued && product.replaced_by ? `<p class="replacement-info">Produk ini telah digantikan oleh: <strong>${sanitizeText(product.replaced_by)}</strong></p>` : ''}
                        <div class="modal-actions">
                            <a href="${sanitizeText(product.page_url)}" class="button primary-button">Lihat Halaman Produk</a>
                            ${product.brochure_url ? `<a href="${sanitizeText(product.brochure_url)}" target="_blank" class="button secondary-button">Download Brosur</a>` : ''}
                            <a href="https://wa.me/6281119727887?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(sanitizeText(product.name))}%20(${sanitizeText(product.model)})." target="_blank" class="button whatsapp-button"><i class="fab fa-whatsapp"></i> Hubungi via WhatsApp</a>
                        </div>
                    </div>
                </div>
            `;
            productModalBody.innerHTML = modalContentHTML;
        }
        if (productModal) productModal.classList.add('active');
        activeModal = 'product';
        setTimeout(() => {
            isModalTransitioning = false;
        }, 300);
    }

    // --- FUNGSI: Melakukan pencarian (didebounce) ---
    function performSearch() {
        const query = searchInput.value.trim();
        if (query.length > 1 && fuse) {
            let result = fuse.search(query);
            displayResults(result.slice(0, 10));
        } else {
            displayResults([]);
        }
    }

    // --- Event Listener untuk input pencarian (saat user mengetik, dengan debouncing) ---
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(performSearch, 300);
        });
    }

    // --- Event Listener untuk tombol cari (saat user mengklik tombol) ---
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query.length > 1 && fuse) {
                let result = fuse.search(query);
                displayResults(result.slice(0, 10));
            } else {
                if (searchResultsContainer) {
                    searchResultsContainer.innerHTML = `
                        <div class="no-results-message">
                            <i class="fas fa-info-circle"></i>
                            <p>Silakan masukkan minimal 2 karakter untuk mencari.</p>
                        </div>
                    `;
                    searchResultsContainer.style.display = 'block';
                    searchResultsContainer.classList.remove('category-products');
                    hideMainContentSections();
                }
            }
        });
    }

    // --- Event Listener untuk tombol Enter di input pencarian ---
    if (searchInput && searchButton) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchButton.click();
            }
        });
    }
    
    // --- MENGGUNAKAN EVENT DELEGATION UNTUK MENGURANGI EVENT LISTENER ---
    // Event listener untuk klik pada hasil pencarian (baik gambar atau detail)
    if (searchResultsContainer) {
        searchResultsContainer.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (!productCard) return;

            if (e.target.closest('.btn-download')) {
                return;
            }

            e.preventDefault();
            const productName = productCard.querySelector('h3').textContent.replace('Discontinued', '').trim();
            const product = productsData.find(p => p.name === productName);
            
            if (product) {
                displayProductImageOnlyInModal(product.main_image_url);
            }
        });
    }
    
    // --- Event listener untuk gambar produk di halaman utama ---
    document.querySelectorAll('.category-products .product-card img').forEach(img => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            displayProductImageOnlyInModal(e.target.src);
        });
    });

    // --- Event listener untuk tombol "Lihat Detail" di halaman utama ---
    document.querySelectorAll('.category-products .product-card .btn-download').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const productCard = e.target.closest('.product-card');
            const productName = productCard ? productCard.querySelector('h3').textContent.replace('Discontinued', '').trim() : null;
            if (productName && productsData) {
                const product = productsData.find(p => p.name === productName);
                if (product) {
                    window.displayProductInModal(product);
                } else {
                    console.warn('Produk tidak ditemukan untuk detail modal.');
                }
            }
        });
    });
});