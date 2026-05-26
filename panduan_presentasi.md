# 🎓 PANDUAN PRESENTASI VIDEO: SITTA UT (VUE.JS)
*Panduan ini disusun ringkas untuk membantu Anda menjelaskan inti sistem dalam rekaman video (maksimal 15 menit).*

---

## 📽️ STRUKTUR PRESENTASI (Ambil Intinya Saja)

### 1. Pembukaan (Durasi: ~2 Menit)
*   **Slide/Tampilan**: Halaman Beranda (`index.html`).
*   **Narasi Inti**:
    > *"Halo dosen penguji dan rekan-rekan. Pada video ini, saya akan mempresentasikan Tugas Praktik 2 tentang implementasi Vue.js untuk membangun **SITTA UT** (Sistem Informasi Tiras & Transaksi Bahan Ajar Universitas Terbuka). Aplikasi ini terdiri dari dua halaman utama: Manajemen Stok dan Tracking Delivery Order. Stack yang digunakan adalah HTML5, Vanilla CSS dengan tema korporat UT (biru-kuning), dan framework Vue 3 browser-based tanpa bundler."*

### 2. Arsitektur Proyek (Durasi: ~1.5 Menit)
*   **Slide/Tampilan**: Tunjukkan struktur folder di VS Code.
*   **Poin Penting**:
    *   **Pemisahan Concern**: File HTML bersih dari CSS dan JS rumit.
    *   **Database Dummy**: `dataBahanAjar.js` sebagai pusat penyimpanan array global (`upbjjList`, `paketBahanAjar`, `defaultBahanAjar`).
    *   **Logika Vue Terpisah**: `stok-app.js` dan `tracking-app.js` diletakkan di folder `js/` agar mudah dibaca dan dipelihara.

### 3. Demonstrasi Fitur 1: Stok Bahan Ajar (Durasi: ~4 Menit)
*   **Slide/Tampilan**: Halaman `stok.html` di browser.
*   **Yang Harus Ditunjukkan & Dijelaskan**:
    *   **Data Rendering**: Tunjukkan baris tabel yang dirender menggunakan `v-for`. Kolom Catatan menggunakan `v-html` sehingga tag format HTML dari dummy data muncul dengan baik.
    *   **Indikator Status (Kondisional)**: Tunjukkan badge warna warni menggunakan `v-if` untuk memetakan status **Aman** (stok >= safety), **Menipis** (stok < safety), dan **Kosong** (stok = 0).
    *   **Dependent Options (Paling Penting!)**: Pilih daerah **UT Jakarta**, lalu tunjukkan dropdown Kategori baru muncul secara reaktif (`v-if` aktif) dan opsi kategorinya disesuaikan otomatis dari daerah terpilih.
    *   **Filter & Sorting Tanpa Recompute**: Tunjukkan pencarian, sorting (judul, qty, harga), dan centang "Stok Kritis". Jelaskan bahwa semua filter ini dikelola oleh satu *computed property* bernama `filteredBahanAjarList` sehingga Vue melakukan caching dan **tidak ada recompute ulang** saat render ulang.
    *   **Edit & Tambah Kuantitas**: 
        *   Klik "Edit" di salah satu baris, ubah angkanya di modal popup. Tekan simpan, tunjukkan statusnya ter-update reaktif.
        *   Jelaskan penggunaan **deep cloning** agar input modal tidak merusak data baris tabel sebelum tombol "Simpan" ditekan.
        *   Uji form tambah data dengan kode yang salah (misal: huruf kecil) untuk mendemonstrasikan **pesan validasi reaktif**.

### 4. Demonstrasi Fitur 2: Tracking Delivery Order (Durasi: ~4 Menit)
*   **Slide/Tampilan**: Halaman `tracking.html` di browser.
*   **Yang Harus Ditunjukkan & Dijelaskan**:
    *   **Auto-generated DO**: Jelaskan *computed property* `nextDoNumber` yang otomatis mengambil tahun saat ini (contoh: 2026) dan mendeteksi sequence terakhir (misal: `DO2026-003`).
    *   **Dynamic Package Detail**: Pilih salah satu paket (misal: *Sistem Informasi*). Tunjukkan di bawah dropdown muncul detail daftar isi buku dan harga paket secara otomatis via *watcher*.
    *   **Harga Read-Only**: Kolom total harga dikunci (`readonly`) karena nilainya diikat otomatis dari paket terpilih.
    *   **Validasi NIM**: Ketik NIM sembarang (kurang dari 9 digit), tunjukkan pesan error reaktif merah menyala. Isi NIM dengan benar (`043219876`), isi Nama, lalu klik submit. DO langsung masuk ke tabel kiri dalam status "Diproses", dan form mereset otomatis dengan Nomor DO baru (`DO2026-004`).

### 5. Di Balik Layar: Watchers & Persistensi Data (Durasi: ~2.5 Menit)
*   **Slide/Tampilan**: Tunjukkan kode `js/stok-app.js` dan `js/tracking-app.js` bagian `watch` di VS Code.
*   **Penjelasan Teknis**:
    *   **Watcher 1 (stok-app.js -> `selectedUpbjj`)**: Membersihkan filter Kategori saat daerah UPBJJ diganti agar tidak terjadi error filter yatim.
    *   **Watcher 2 (stok-app.js -> `bahanAjarList` - Deep Watch)**: Menangkap semua modifikasi tabel stok dan menyimpannya secara otomatis ke `localStorage`. Serta memantau stok kosong di konsol log.
    *   **Watcher 3 (tracking-app.js -> `selectedPaketCode`)**: Mengambil detail item paket dan memetakan harga ke form saat user memilih paket.
    *   **Watcher 4 (tracking-app.js -> `trackingList` - Deep Watch)**: Sinkronisasi daftar DO ke `localStorage` agar tidak hilang jika di-refresh.
    *   *Buktikan data tidak hilang dengan merefresh browser Anda setelah menambah data stok/DO baru.*

### 6. Penutup (Durasi: ~1 Menit)
*   **Tampilan**: Kembali ke Beranda (`index.html`).
*   **Narasi**:
    > *"Kesimpulannya, aplikasi SITTA UT ini telah mengimplementasikan seluruh konsep sistem pengorganisasian kode Vue.js dengan data binding, logical conditional, computed properties, watchers, serta validasi formulir. Terima kasih atas perhatiannya!"*
