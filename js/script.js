// =======================================================
// GLOBAL VARIABLES & FUNCTIONS FOR SLIDER
// =======================================================
let slideIndex = 1;
let sliderContainer;
let slides;
let dots;

/**
 * Mengubah slide ke indeks berikutnya atau sebelumnya.
 * @param {number} n - Jumlah pergeseran slide (1 untuk next, -1 untuk prev).
 */
function plusSlides(n) {
    showSlides(slideIndex += n);
}

/**
 * Mengubah slide ke indeks spesifik dari dot navigasi.
 * @param {number} n - Indeks slide yang akan ditampilkan.
 */
function currentSlide(n) {
    showSlides(slideIndex = n);
}

/**
 * Menampilkan slide yang dipilih dan memperbarui dot navigasi.
 * @param {number} n - Indeks slide yang akan ditampilkan.
 */
function showSlides(n) {
    if (!sliderContainer || slides.length === 0) {
        console.error("Slider elements are not initialized correctly.");
        return;
    }
    
    // Periksa batas indeks slide.
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    
    // Hitung offset dan terapkan transform untuk pergerakan slide.
    const offset = -(slideIndex - 1) * 100;
    sliderContainer.style.transform = `translateX(${offset}%)`;

    // Perbarui status 'active' pada dot navigasi.
    dots.forEach(dot => dot.classList.remove("active-dot"));
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add("active-dot");
    }
}

// =======================================================
// DOMContentLoaded Listener - Semua inisialisasi diletakkan di sini
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    
    // --- SLIDER INITIALIZATION ---
    // Inisialisasi variabel untuk slider setelah DOM siap.
    sliderContainer = document.querySelector('.slider-wrapper');
    slides = document.querySelectorAll('.hero-slider .slide');
    dots = document.querySelectorAll('.hero-dots .dot');

    // Pastikan slider ada sebelum memulai otomatisasi
    if (slides && slides.length > 0) {
        showSlides(slideIndex);
        setInterval(function() { plusSlides(1); }, 5000); // Ganti slide setiap 5 detik
    }
    
    // Tambahkan event listener untuk tombol next/prev slider.
    const prevBtn = document.querySelector('.hero-buttons .prev');
    const nextBtn = document.querySelector('.hero-buttons .next');

    if (prevBtn) prevBtn.addEventListener('click', () => plusSlides(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => plusSlides(1));
    
    // Tambahkan event listener untuk dot navigasi.
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => currentSlide(index + 1));
    });


    const mobileMenuToggle = document.querySelector('#mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const hasDropdownLi = document.querySelectorAll('.has-dropdown');
    const hasSubDropdowns = document.querySelectorAll('.has-sub-dropdown');

    // --- TOGGLE MENU MOBILE & DROPDOWN NESTED ---
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Mencegah event click menyebar ke body
            mainNav.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');

            // Tutup semua dropdown saat menu utama ditutup
            if (!mainNav.classList.contains('active')) {
                hasDropdownLi.forEach(li => li.classList.remove('expanded'));
                hasSubDropdowns.forEach(li => li.classList.remove('expanded'));
            }
        });
    }

    // Toggle untuk dropdown utama di mobile
    hasDropdownLi.forEach(li => {
        const dropdownLink = li.querySelector('.dropdown-link');
        if (dropdownLink) {
            dropdownLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation(); // Mencegah event click menyebar
                    // Menutup dropdown lain yang sedang terbuka
                    hasDropdownLi.forEach(otherLi => {
                        if (otherLi !== li && otherLi.classList.contains('expanded')) {
                            otherLi.classList.remove('expanded');
                            otherLi.querySelectorAll('.has-sub-dropdown').forEach(subLi => subLi.classList.remove('expanded'));
                        }
                    });
                    li.classList.toggle('expanded');
                }
            });
        }
    });

    // Toggle untuk nested dropdown di mobile
    hasSubDropdowns.forEach(li => {
        const subDropdownLink = li.querySelector('.dropdown-link');
        if (subDropdownLink) {
            subDropdownLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation(); // Mencegah event click menyebar
                    // Menutup sub-dropdown lain dalam dropdown yang sama
                    li.parentNode.querySelectorAll('.has-sub-dropdown').forEach(otherLi => {
                        if (otherLi !== li) {
                            otherLi.classList.remove('expanded');
                        }
                    });
                    li.classList.toggle('expanded');
                }
            });
        }
    });

    // --- MENUTUP MOBILE NAV SAAT KLIK DI LUAR AREA NAV ---
    document.addEventListener('click', function(e) {
        if (!mobileMenuToggle || !mainNav) return;

        const isClickInsideNav = mainNav.contains(e.target) || mobileMenuToggle.contains(e.target);
        if (window.innerWidth <= 768 && mainNav.classList.contains('active') && !isClickInsideNav) {
            mainNav.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');

            // Tutup semua dropdown saat menu mobile ditutup
            hasDropdownLi.forEach(li => li.classList.remove('expanded'));
            hasSubDropdowns.forEach(li => li.classList.remove('expanded'));
        }
    });
    
    // --- MENUTUP MENU SAAT UKURAN LAYAR BERUBAH ---
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (mainNav) {
                mainNav.classList.remove('active');
            }
            hasDropdownLi.forEach(li => li.classList.remove('expanded'));
            hasSubDropdowns.forEach(li => li.classList.remove('expanded'));
            if (mobileMenuToggle) {
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // --- LOGIKA MODAL GAMBAR ---
    const imageModal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const closeBtn = document.querySelector("#imageModal .close");
    const productImages = document.querySelectorAll('.product-card img');
    
    if (imageModal && modalImg && closeBtn && productImages.length > 0) {
        productImages.forEach((img) => {
            img.addEventListener("click", () => {
                imageModal.style.display = "flex";
                modalImg.src = img.src;
            });
        });
        
        closeBtn.addEventListener("click", () => {
            imageModal.style.display = "none";
        });
        
        imageModal.addEventListener("click", function (e) {
            if (e.target === imageModal) {
                imageModal.style.display = "none";
            }
        });
        
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && imageModal.style.display === "flex") {
                imageModal.style.display = "none";
            }
        });
    }


    // --- MENUTUP MOBILE NAV KETIKA RESIZE LAYAR KE DESKTOP ---
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Pastikan elemen ada sebelum mencoba mengakses propertinya.
            if (mainNavContainer) {
                mainNavContainer.classList.remove('active');
            }
            // Tutup semua dropdown di semua level.
            const expandedDropdowns = document.querySelectorAll('.main-nav .expanded');
            expandedDropdowns.forEach(li => li.classList.remove('expanded'));

            if (mobileMenuToggle) {
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });

    // --- MENUTUP MOBILE NAV SAAT KLIK DI LUAR AREA NAV ---
    document.addEventListener('click', function(e) {
        if (!mobileMenuToggle || !mainNavContainer) return;

        const isClickInsideNav = mainNavContainer.contains(e.target) || mobileMenuToggle.contains(e.target);
        if (window.innerWidth <= 768 && mainNavContainer.classList.contains('active') && !isClickInsideNav) {
            mainNavContainer.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');

            // Tutup semua dropdown di semua level saat menutup menu utama.
            const expandedDropdowns = mainNavContainer.querySelectorAll('.expanded');
            expandedDropdowns.forEach(li => li.classList.remove('expanded'));
        }
    });
});
