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
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            // Menutup semua dropdown jika menu utama ditutup
            if (!mainNav.classList.contains('active')) {
                document.querySelectorAll('.has-dropdown.expanded').forEach(dropdown => {
                    dropdown.classList.remove('expanded');
                });
            }
        });
    }

    // Menggabungkan logika dropdown dan penutupan menu mobile
    mainNav.addEventListener('click', (e) => {
        // Logika untuk dropdown
        if (e.target.closest('.has-dropdown') && window.innerWidth <= 768) {
            e.preventDefault();
            const parentLi = e.target.closest('.has-dropdown');
            parentLi.classList.toggle('expanded');
        }

        // Logika untuk penutupan menu saat klik tautan non-dropdown
        if (e.target.tagName === 'A' && !e.target.closest('.has-dropdown')) {
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('active');
            }
        }
    });

    // --- ACTIVE NAVIGATION LINK ---
    const allNavLinks = document.querySelectorAll('#mainNav a');
    // Jika path kosong (halaman utama), default ke 'index.html'
    const currentPath = window.location.pathname.split('/').pop() || 'index.html'; 

    allNavLinks.forEach(link => {
        const linkPath = link.href.split('/').pop();
        
        if (linkPath === currentPath) {
            link.classList.add('active');
            
            // Jika yang aktif adalah sub-link, hapus class 'active' dari parent-nya
            const parentLi = link.closest('.has-dropdown');
            if (parentLi) {
                const parentLink = parentLi.querySelector(':scope > a');
                if (parentLink) {
                    parentLink.classList.remove('active');
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
    
    // Ambil semua gambar yang memiliki class 'zoomable-img' (pastikan Anda menambahkan kelas ini di HTML)
    const zoomableImages = document.querySelectorAll(".zoomable-img");

    if (modal && modalImg && closeBtn) {
        zoomableImages.forEach(img => {
            img.addEventListener("click", () => {
                modal.style.display = "flex"; // Gunakan 'flex' agar gambar bisa di-align
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
});