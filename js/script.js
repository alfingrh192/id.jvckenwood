// =======================================================
// GLOBAL VARIABLES & FUNCTIONS
// =======================================================

// --- SLIDER ---
let slideIndex = 1;

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.hero-slider .dot');
    const sliderContainer = document.querySelector('.hero-slider .slider-container');

    if (!sliderContainer || slides.length === 0) {
        console.warn("Slider elements are not initialized correctly.");
        return;
    }
    
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    
    const offset = -(slideIndex - 1) * 100;
    sliderContainer.style.transform = `translateX(${offset}%)`;

    if (dots.length > 0) {
        dots.forEach(dot => dot.classList.remove("active-dot"));
        if (dots[slideIndex - 1]) {
            dots[slideIndex - 1].classList.add("active-dot");
        }
    }
}

// =======================================================
// EVENT LISTENERS & INITIALIZATION
// =======================================================

// Pastikan skrip slider berjalan setelah seluruh halaman dimuat
window.onload = function() {
    const slides = document.querySelectorAll('.hero-slider .slide');
    const prevButton = document.querySelector('.hero-slider .prev');
    const nextButton = document.querySelector('.hero-slider .next');
    const dots = document.querySelectorAll('.hero-slider .dot');

    if (slides.length > 0) {
        showSlides(slideIndex);
    }

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => plusSlides(-1));
        nextButton.addEventListener('click', () => plusSlides(1));
    }

    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => currentSlide(index + 1));
        });
    }
};

// Gunakan DOMContentLoaded untuk kode yang hanya membutuhkan DOM
document.addEventListener('DOMContentLoaded', function() {
    // --- NAVIGASI DAN DROPDOWN ---
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    // --- DROPDOWN DESKTOP (hover) ---
    const dropdownParents = document.querySelectorAll('.has-dropdown');
    dropdownParents.forEach(function (parent) {
        parent.addEventListener('mouseenter', function () {
            if (window.innerWidth > 768) {
                const dropdown = parent.querySelector('.dropdown-menu');
                if (dropdown) dropdown.style.display = 'block';
            }
        });
        parent.addEventListener('mouseleave', function () {
            if (window.innerWidth > 768) {
                const dropdown = parent.querySelector('.dropdown-menu');
                if (dropdown) dropdown.style.display = 'none';
            }
        });
    });

    // --- SUB-DROPDOWN DESKTOP (hover) ---
    const subDropdownParents = document.querySelectorAll('.has-sub-dropdown');
    subDropdownParents.forEach(function (parent) {
        parent.addEventListener('mouseenter', function () {
            if (window.innerWidth > 768) {
                const subDropdown = parent.querySelector('.sub-dropdown-menu');
                if (subDropdown) subDropdown.style.display = 'block';
            }
        });
        parent.addEventListener('mouseleave', function () {
            if (window.innerWidth > 768) {
                const subDropdown = parent.querySelector('.sub-dropdown-menu');
                if (subDropdown) subDropdown.style.display = 'none';
            }
        });
    });

    // --- DROPDOWN MOBILE (klik) ---
    const topLevelDropdowns = document.querySelectorAll('.main-nav > ul > .has-dropdown > a');
    const subDropdownToggles = document.querySelectorAll('.has-sub-dropdown > a');
    
    // Logika untuk dropdown utama (level 1)
    topLevelDropdowns.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) { 
                const parentLi = this.closest('li');
                e.preventDefault();
                parentLi.classList.toggle('expanded');

                // Menutup semua dropdown utama lainnya
                document.querySelectorAll('.main-nav > ul > .has-dropdown').forEach(p => {
                    if (p !== parentLi) {
                        p.classList.remove('expanded');
                    }
                });
            }
        });
    });
    
    // Logika untuk sub-dropdown (level 2)
    subDropdownToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parentLi = this.closest('li');
                parentLi.classList.toggle('expanded');
            }
        });
    });

    // --- TOGGLE MOBILE MENU ---
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
            
            // Mengubah ikon
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
            
            // Menutup semua dropdown saat menu utama ditutup
            if (!mainNav.classList.contains('active')) {
                document.querySelectorAll('.has-dropdown, .has-sub-dropdown').forEach(p => {
                    p.classList.remove('expanded');
                });
            }
        });
    }

    // --- MODAL IMAGE (Event Delegation) ---
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const closeSpan = document.querySelector(".modal .close");

    document.addEventListener("click", function (e) {
        // Jika klik gambar produk
        if (e.target && e.target.matches(".product-card .image-wrapper img")) {
            modal.style.display = "flex";
            modalImg.src = e.target.src;
        }
        // Jika klik tombol close
        if (e.target === closeSpan) {
            modal.style.display = "none";
        }
    });

    // Tutup modal jika klik di luar gambar
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Tutup modal dengan tombol ESC
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            modal.style.display = "none";
        }
    });
});