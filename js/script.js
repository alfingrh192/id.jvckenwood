// =======================================================
// GLOBAL VARIABLES & FUNCTIONS FOR SLIDER
// =======================================================
let slideIndex = 1;
let sliderContainer;
let slides;
let dots;

// Fungsi untuk navigasi tombol "Next" dan "Previous"
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Fungsi untuk navigasi dot
function currentSlide(n) {
    showSlides(slideIndex = n);
}

// Fungsi utama untuk menampilkan slide
function showSlides(n) {
    if (!sliderContainer || slides.length === 0) {
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

    dots.forEach(dot => dot.classList.remove("active-dot"));
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add("active-dot");
    }
}

// =======================================================
// DOMContentLoaded Listener
// Semua inisialisasi diletakkan di sini
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    
    // --- MOBILE MENU & DROPDOWN TOGGLE ---
    const mobileMenuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const hasDropdownLi = document.querySelector('.main-nav .has-dropdown');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            
            // Menutup dropdown saat mobile menu ditutup
            if (hasDropdownLi && !mainNav.classList.contains('active')) {
                hasDropdownLi.classList.remove('expanded');
            }
        });
    }

    // --- LOGIKA KLIK DROPDOWN UNTUK MOBILE ---
    // Aturan hover untuk desktop ditangani sepenuhnya oleh CSS.
    if (hasDropdownLi) {
        // Dapatkan link dropdown, bukan list item-nya.
        const dropdownLink = hasDropdownLi.querySelector('.dropdown-link');
        
        dropdownLink.addEventListener('click', function(e) {
            // Mencegah link pindah halaman hanya di mode mobile.
            if (window.innerWidth <= 768) {
                e.preventDefault(); 
                hasDropdownLi.classList.toggle('expanded');
            }
        });
    }
    
    // =======================================================
    // LOGIKA HOVER DROPDOWN MENU UNTUK DESKTOP (TAMBAHAN)
    // =======================================================
    const dropdownParent = document.getElementById('products-dropdown-parent');
    const dropdownMenu = document.getElementById('products-dropdown');

    if (dropdownParent && dropdownMenu) {
        let timeout;

        function activateDropdown() {
            clearTimeout(timeout);
            dropdownParent.classList.add('hover-active');
        }

        function deactivateDropdown() {
            timeout = setTimeout(() => {
                dropdownParent.classList.remove('hover-active');
            }, 300);
        }

        dropdownParent.addEventListener('mouseenter', activateDropdown);
        dropdownParent.addEventListener('mouseleave', deactivateDropdown);
        dropdownMenu.addEventListener('mouseenter', activateDropdown);
        dropdownMenu.addEventListener('mouseleave', deactivateDropdown);
    }
    
    // --- LOGIKA ACTIVE NAVIGATION LINK ---
    const allNavLinks = document.querySelectorAll('.main-nav a');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    allNavLinks.forEach(link => {
        const linkPath = link.href.split('/').pop();
        
        if (linkPath === currentPath) {
            link.classList.add('active');
            
            const parentLi = link.closest('.has-dropdown');
            if (parentLi) {
                const parentLink = parentLi.querySelector(':scope > a');
                if (parentLink) {
                    parentLink.classList.add('active');
                }
            }
        } else {
            link.classList.remove('active');
        }
    });

    // --- SLIDER INITIALIZATION ---
    sliderContainer = document.querySelector(".slider-container");
    slides = document.querySelectorAll(".slide");
    dots = document.querySelectorAll(".dot");
    
    if (slides && slides.length > 0) {
        showSlides(slideIndex);
    }

    // --- MODAL ZOOM GAMBAR ---
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const closeBtn = document.querySelector(".close");
    
    const zoomableImages = document.querySelectorAll(".zoomable-img");

    if (modal && modalImg && closeBtn) {
        zoomableImages.forEach(img => {
            img.addEventListener("click", () => {
                modal.style.display = "flex";
                modalImg.src = img.src;
            });
        });
        
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
        
        modal.addEventListener("click", function (e) {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
        
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && modal.style.display === "flex") {
                modal.style.display = "none";
            }
        });
    }

    // --- MENUTUP MOBILE NAV DAN DROPDOWN KETIKA RESIZE LAYAR ---
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mainNav.classList.remove('active');
            if (hasDropdownLi) {
                hasDropdownLi.classList.remove('expanded');
            }
        }
    });

    // --- MENUTUP MOBILE NAV SAAT KLIK DI LUAR AREA NAV ---
    document.addEventListener('click', function(e) {
        const isClickInsideNav = mainNav.contains(e.target) || (mobileMenuToggle && mobileMenuToggle.contains(e.target));
        if (window.innerWidth <= 768 && mainNav.classList.contains('active') && !isClickInsideNav) {
            mainNav.classList.remove('active');
            if (hasDropdownLi) {
                hasDropdownLi.classList.remove('expanded');
            }
        }
    });
});