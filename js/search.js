document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen DOM yang dibutuhkan untuk pencarian dan hasil ---
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResultsContainer = document.getElementById('search-results'); // Container untuk menampilkan hasil pencarian
    const allCategorySections = document.querySelectorAll('.main-content .category-section'); // Ambil semua elemen category-section

    let productsData = []; // Variabel untuk menyimpan data produk dari JSON
    let fuse; // Variabel untuk instance Fuse.js

    // --- Elemen DOM untuk Modal Detail Produk ---
    const productModal = document.getElementById('product-modal');
    const closeModalButton = productModal.querySelector('.close-button');
    const modalBody = productModal.querySelector('.modal-body');

    // --- Fungsi untuk menutup modal detail produk ---
    function closeModal() {
        productModal.style.display = 'none';
        modalBody.innerHTML = ''; // Kosongkan konten modal saat ditutup
    }

    // --- Event listener untuk tombol tutup modal detail produk ---
    closeModalButton.addEventListener('click', closeModal);

    // --- Event listener untuk menutup modal detail produk dengan klik di luar konten ---
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) { // Jika klik pas di background modal
            closeModal();
        }
    });

    // --- Event listener untuk menutup modal detail produk dengan tombol ESC ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && productModal.style.display === 'flex') { // Pastikan modal sedang terbuka
            closeModal();
        }
    });

    // --- Ambil data produk dari JSON dan inisialisasi Fuse.js ---
    fetch('data/products.json') // Pastikan path ini benar!
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            productsData = data;
            // Opsi Fuse.js: Tentukan 'keys' mana saja yang akan dicari
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
                    { name: 'keywords', weight: 1.0 } // Kata kunci paling penting
                ],
                threshold: 0.3, // Toleransi kesalahan ketik (0.0 = exact match, 1.0 = fuzzy)
                ignoreLocation: true, // Tidak peduli posisi match di string
                includeScore: true // Sertakan skor relevansi dalam hasil
            };
            fuse = new Fuse(productsData, options);
            console.log("Products data loaded and Fuse.js initialized."); // Debugging
            
            // Inisialisasi tampilan saat halaman pertama kali dimuat
            displayResults([]); // Tampilkan konten asli di awal (karena query kosong)
        })
        .catch(error => {
            console.error("Error loading products data:", error);
            searchResultsContainer.innerHTML = '<div class="no-results-message">Gagal memuat data produk untuk pencarian. Silakan coba lagi nanti.</div>';
            // Pastikan konten asli tetap terlihat jika data gagal dimuat
            allCategorySections.forEach(section => {
                section.style.display = 'block';
            });
        });

    // --- Fungsi untuk menampilkan hasil pencarian sebagai card atau pesan kosong ---
    function displayResults(results) {
        searchResultsContainer.innerHTML = ''; // Hapus hasil sebelumnya
        const query = searchInput.value.trim();

        // Logika untuk menampilkan/menyembunyikan bagian kategori dan hasil pencarian
        if (query.length > 0) {
            // Jika ada query, sembunyikan semua section kategori asli
            allCategorySections.forEach(section => {
                section.style.display = 'none';
            });
            // Tampilkan container hasil pencarian
            searchResultsContainer.style.display = 'grid'; // Menggunakan grid untuk layout kartu
            searchResultsContainer.classList.add('category-products'); // Tambahkan kelas untuk grid CSS
        } else {
            // Jika query kosong, tampilkan kembali semua section kategori asli
            allCategorySections.forEach(section => {
                section.style.display = 'block';
            });
            // Sembunyikan dan kosongkan container hasil pencarian
            searchResultsContainer.innerHTML = '';
            searchResultsContainer.style.display = 'none';
            searchResultsContainer.classList.remove('category-products');
            return; // Keluar dari fungsi karena tidak ada query untuk menampilkan hasil
        }

        if (results.length > 0) {
            results.forEach(({ item }) => { 
                const productCardDiv = document.createElement('div');
                productCardDiv.classList.add('product-card');

                // --- START Perubahan Penting: Bungkus gambar dengan image-wrapper ---
                const imageWrapperDiv = document.createElement('div');
                imageWrapperDiv.classList.add('image-wrapper'); // Sesuai dengan CSS Anda

                const img = document.createElement('img');
                img.src = item.main_image_url;
                img.alt = item.name;
                imageWrapperDiv.appendChild(img); // Gambar dimasukkan ke dalam image-wrapper

                productCardDiv.appendChild(imageWrapperDiv); // image-wrapper ditambahkan ke product-card
                // --- END Perubahan Penting ---

                // Kontainer Detail Produk (sesuaikan dengan kelas CSS Anda: .product-info)
                const productInfoDiv = document.createElement('div'); // Ganti nama variabel menjadi productInfoDiv
                productInfoDiv.classList.add('product-info'); // **Penting:** Gunakan 'product-info' sesuai CSS Anda

                // Nama Produk (Judul)
                const title = document.createElement('h3');
                title.textContent = item.name;
                if (item.discontinued) {
                    const badge = document.createElement('span');
                    badge.classList.add('product-badge', 'discontinue');
                    badge.textContent = 'Discontinued';
                    title.appendChild(badge);
                }
                productInfoDiv.appendChild(title);

                // Deskripsi Singkat
                const shortDescription = document.createElement('p');
                shortDescription.textContent = item.short_description; 
                productInfoDiv.appendChild(shortDescription);

                // Fitur Utama (jika ada)
                if (item.features && item.features.length > 0) {
                    const featuresList = document.createElement('ul');
                    // Periksa apakah Anda punya styling spesifik untuk ini, jika tidak, cukup biarkan `product-info ul` di CSS Anda
                    // featuresList.classList.add('product-features-list'); // Opsional, tergantung CSS Anda
                    item.features.forEach(feature => {
                        const li = document.createElement('li');
                        li.textContent = feature;
                        featuresList.appendChild(li);
                    });
                    productInfoDiv.appendChild(featuresList);
                }

                // Tombol Download Brosur (jika ada)
                if (item.brochure_url) {
                    const brochureButton = document.createElement('a');
                    brochureButton.href = item.brochure_url;
                    brochureButton.target = "_blank";
                    brochureButton.classList.add('btn-download'); // **Penting:** Gunakan 'btn-download' sesuai CSS Anda
                    brochureButton.innerHTML = '<i class="fas fa-download"></i> Download Brochure'; // Ikon download
                    productInfoDiv.appendChild(brochureButton);
                }

                productCardDiv.appendChild(productInfoDiv); // Tambahkan kontainer info ke kartu produk
                searchResultsContainer.appendChild(productCardDiv); // Tambahkan kartu produk ke kontainer hasil

                // Tambahkan event listener untuk menampilkan modal saat card diklik
                productCardDiv.addEventListener('click', (e) => {
                    // Pastikan klik tidak berasal dari tombol download brochure atau link lainnya di dalam card
                    if (!e.target.closest('.btn-download') && !e.target.closest('a')) { // Hanya trigger modal jika bukan tombol/link yang diklik
                        e.preventDefault();
                        displayProductInModal(item);
                    }
                });
            });
        } else {
            // Tampilkan pesan "Tidak ada produk" HANYA jika query ada tapi tidak ada hasil
            const noResultDiv = document.createElement('div');
            noResultDiv.classList.add('no-results-message');
            noResultDiv.textContent = `Tidak ada produk yang cocok ditemukan untuk "${query}".`;
            searchResultsContainer.appendChild(noResultDiv);
            searchResultsContainer.style.display = 'block'; // Pastikan container hasil terlihat
        }
    }

    // --- Fungsi untuk menampilkan detail produk di dalam modal ---
    function displayProductInModal(product) {
        modalBody.innerHTML = ''; 

        const featuresList = product.features ? product.features.map(feature => `<li>${feature}</li>`).join('') : '';

        const modalContentHTML = `
            <div class="modal-product-detail">
                <img src="${product.main_image_url}" alt="${product.name}" class="modal-product-image">
                <div class="modal-product-info">
                    <h2>${product.name}</h2>
                    ${product.discontinued ? '<p class="product-badge discontinue">Discontinued</p>' : ''}
                    <p><strong>Merek:</strong> ${product.brand}</p>
                    <p><strong>Model:</strong> ${product.model}</p>
                    <p><strong>Kategori:</strong> ${product.category}</p>
                    <p><strong>Protokol:</strong> ${product.protocol}</p>
                    <p><strong>Frekuensi:</strong> ${product.frequency_band}</p>
                    ${product.power_output && product.power_output !== "N/A" ? `<p><strong>Daya Output:</strong> ${product.power_output}</p>` : ''}
                    ${product.channels && product.channels !== "N/A" ? `<p><strong>Channels:</strong> ${product.channels}</p>` : ''}
                    <p>${product.description}</p>
                    ${featuresList ? `<h4>Fitur Utama:</h4><ul>${featuresList}</ul>` : ''}
                    
                    ${product.discontinued && product.replaced_by ? `<p class="replacement-info">Produk ini telah digantikan oleh: <strong>${product.replaced_by}</strong></p>` : ''}

                    <div class="modal-actions">
                        <a href="${product.page_url}" class="button primary-button">Lihat Halaman Produk</a>
                        ${product.brochure_url ? `<a href="${product.brochure_url}" target="_blank" class="button secondary-button">Download Brosur</a>` : ''}
                        <a href="https://wa.me/6281119727887?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(product.name)}%20(${product.model})." target="_blank" class="button whatsapp-button"><i class="fab fa-whatsapp"></i> Hubungi via WhatsApp</a>
                    </div>
                </div>
            </div>
        `;
        modalBody.innerHTML = modalContentHTML;
        productModal.style.display = 'flex'; // Tampilkan modal
    }

    // --- Event listener untuk input pencarian ---
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 1 && fuse) { 
            let result = fuse.search(query);
            displayResults(result.slice(0, 10)); // Batasi 10 hasil teratas
        } else {
            // Jika input kosong atau <= 1 karakter, panggil displayResults tanpa hasil
            displayResults([]); // Ini akan memicu tampilan kategori asli
        }
    });

    // --- Event listener untuk tombol pencarian ---
    searchButton.addEventListener('click', (e) => {
        e.preventDefault(); // Mencegah form submit
        const query = searchInput.value.trim();
        if (query.length > 1 && fuse) {
            let result = fuse.search(query);
            displayResults(result.slice(0, 10));
        } else {
            // Jika query terlalu pendek saat tombol diklik, tampilkan pesan peringatan
            searchResultsContainer.innerHTML = '<div class="no-results-message">Silakan masukkan minimal 2 karakter untuk mencari.</div>';
            searchResultsContainer.style.display = 'block';
            allCategorySections.forEach(section => {
                section.style.display = 'none';
            });
        }
    });

    // --- Event listener untuk 'Enter' di input pencarian ---
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Mencegah form submit
            searchButton.click(); // Picu klik tombol pencarian
        }
    });

    // --- Inisialisasi tampilan awal: tampilkan konten asli ---
    // Pastikan ini dipanggil setelah `productsData` dimuat
    // agar `fuse` tidak null jika dipicu oleh `displayResults([])`
    // (Sudah dipindahkan ke dalam .then() dari fetch)
});