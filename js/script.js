// =======================================
// GLOBAL VARIABLES & FUNCTIONS FOR SLIDER
// =======================================
let slideIndex = 1;
let sliderContainer;
let slides;
let dots;

// Fungsi untuk navigasi tombol "Next" dan "Previous"
// Fungsi ini harus berada di scope global agar bisa diakses dari onclick di HTML
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Fungsi untuk navigasi dot
// Fungsi ini juga harus berada di scope global
function currentSlide(n) {
    showSlides(slideIndex = n);
}

// Fungsi utama untuk menampilkan slide
// Fungsi ini juga harus di scope global
function showSlides(n) {
    if (!sliderContainer || slides.length === 0) {
        return; // Menghentikan fungsi jika elemen tidak ditemukan
    }
    
    // Loop kembali ke slide pertama jika sudah di akhir
    if (n > slides.length) {
        slideIndex = 1;
    }
    // Loop ke slide terakhir jika sudah di awal
    if (n < 1) {
        slideIndex = slides.length;
    }
    
    // Perbarui posisi slider dengan efek geser
    const offset = -(slideIndex - 1) * 100;
    sliderContainer.style.transform = `translateX(${offset}%)`;

    // Perbarui indikator dot
    dots.forEach(dot => dot.classList.remove("active-dot"));
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add("active-dot");
    }
}


// =======================================
// DOMContentLoaded Listener
// Semua inisialisasi diletakkan di sini
// =======================================
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
    // Menginisialisasi variabel slider setelah DOM dimuat
    sliderContainer = document.querySelector(".slider-container");
    slides = document.querySelectorAll(".slide");
    dots = document.querySelectorAll(".dot");
    
    // Menjalankan fungsi slider untuk pertama kali
    if (slides.length > 0) {
        showSlides(slideIndex);
    }
    
    // --- IMAGE MODAL / LIGHTBOX ---
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("zoomedImage");
    const closeBtn = document.querySelector(".close-modal");

    document.querySelectorAll(".product-card img").forEach(img => {
        img.addEventListener("click", function() {
            if (modal && modalImg) {
                modal.style.display = "flex";
                modalImg.src = this.src;
                modalImg.alt = this.alt;
            }
        });
    });

    if (closeBtn) {
        closeBtn.onclick = function() {
            if (modal) modal.style.display = "none";
        };
    }

    if (modal) {
        modal.addEventListener("click", function(e) {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }

    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && modal && modal.style.display === "flex") {
            modal.style.display = "none";
        }
    });
});