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
    const mobileMenu = document.getElementById('mobile-menu');
    const mainNav = document.getElementById('mainNav');
    const dropdownLinks = document.querySelectorAll('.has-dropdown > a');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            document.querySelectorAll('.has-dropdown.expanded').forEach(dropdown => {
                dropdown.classList.remove('expanded');
            });
        });
    }

    dropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parentLi = link.parentElement;
                parentLi.classList.toggle('expanded');
            }
        });
    });

    document.querySelectorAll('#mainNav a').forEach(item => {
        item.addEventListener('click', (event) => {
            if (window.innerWidth <= 768) {
                const parentLi = item.closest('li.has-dropdown');
                if (!parentLi) {
                    mainNav.classList.remove('active');
                }
            }
        });
    });

    // --- ACTIVE NAVIGATION LINK ---
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.main-nav > ul > li > a');
    const dropdownSubLinks = document.querySelectorAll('.dropdown-menu a');

    navLinks.forEach(link => {
        const linkPath = link.href.split('/').pop();
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    dropdownSubLinks.forEach(subLink => {
        const subLinkPath = subLink.href.split('/').pop();
        if (subLinkPath === currentPath) {
            subLink.classList.add('active');
            const parentLink = subLink.closest('.has-dropdown').querySelector(':scope > a');
            if (parentLink) {
                parentLink.classList.remove('active');
            }
        } else {
            subLink.classList.remove('active');
        }
    });

    // --- SLIDER INITIALIZATION ---
    sliderContainer = document.querySelector(".slider-container");
    slides = document.querySelectorAll(".slide");
    dots = document.querySelectorAll(".dot");
    
    if (slides.length > 0) {
        showSlides(slideIndex);
    }

    // --- MODAL ZOOM GAMBAR (diperbaiki) ---
    // Ambil elemen-elemen modal dari DOM
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const closeBtn = document.querySelector(".close");
    
    // Ambil semua gambar yang memiliki class 'zoomable-img'
    const zoomableImages = document.querySelectorAll(".zoomable-img");

    // Loop melalui setiap gambar dan tambahkan event listener
    zoomableImages.forEach(img => {
        img.addEventListener("click", () => {
            modal.style.display = "flex"; // Kunci: Ubah dari "block" menjadi "flex"
            modalImg.src = img.src;
        });
    });

    // Event listener untuk tombol close (X)
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Event listener untuk klik di luar gambar modal (latar belakang gelap)
    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // Event listener untuk tombol 'Esc' pada keyboard
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal.style.display === "flex") { // Kunci: Cek apakah modal.style.display adalah "flex"
            modal.style.display = "none";
        }
    });
});