# 🎓 SITTA UT - Portal Sistem Informasi Transaksi Bahan Ajar

[![Platform](https://img.shields.io/badge/Platform-Web-blue.svg)](#)
[![Framework](https://img.shields.io/badge/Framework-Vue.js%203-green.svg)](https://vuejs.org/)
[![Styling](https://img.shields.io/badge/Design-macOS%20Clean%202026-orange.svg)](#)
[![OS-Compatible](https://img.shields.io/badge/OS--Compatible-Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20Mobile-brightgreen.svg)](#)

**SITTA UT** (Sistem Informasi Tiras & Transaksi Bahan Ajar) adalah sebuah portal aplikasi berbasis web terpadu yang dirancang khusus untuk mengelola persediaan tiras (stok) bahan ajar di gudang UT Daerah (UPBJJ) dan melacak pengiriman *Delivery Order (DO)* paket bahan ajar mahasiswa Universitas Terbuka secara *real-time*.

Aplikasi ini didevelop sebagai pemenuhan **Tugas Praktik 2 (Semester 2)** dengan mengimplementasikan arsitektur reaktif modern **Vue.js 3 (Options API)** tanpa bundler (browser CDN), dipadukan dengan kemasan visual premium berkelas industri **macOS Clean 2026 Design System** yang sangat dinamis dan responsif.

---

## 🖥️ Estetika Desain & Fitur Visual Premium (macOS Clean 2026)

Aplikasi ini didesain dengan standar tinggi kegagahan UI/UX tahun 2026, menyajikan transisi yang mulus, bersih, dan memukau:

1. **macOS System Bootloader (Layar Pemuatan Premium)**:
   * Setiap memuat halaman, pengguna akan disambut layar booting hitam elegan khas macOS.
   * Logo topi wisuda emas `🎓` UT memancarkan cahaya halus di atas *horizontal progress bar* pengisian dinamis (0% ke 100%).
   * Layar memudar keluar (*fade-out* 600ms) secara otomatis ketika seluruh pustaka dan aset selesai termuat sempurna.
   * Mendukung skema tema adaptif (Latar perak akrilik dan progress bar biru langit pada mode Light).

2. **Tema Ganda Dinamis (🌓 macOS Light & Dark Mode)**:
   * Beralih secara instan dan mulus melalui tombol toggle khusus di pojok kanan navbar atas.
   * **Space Gray Dark Mode**: Memancarkan pesona malam luar angkasa dengan kaca frosted semi-transparan (`backdrop-filter`) dan batas putih halus.
   * **Silver Light Mode**: Menampilkan kesan perak akrilik putih bersih yang elegan dengan kontras teks tajam dan bayangan lembut yang alami.
   * Disimpan secara persisten di `localStorage` peramban guna mencegah kedipan unstyled (*Zero FOUC*).

3. **Efek Transisi Sinematik ("Wah")**:
   * Memanfaatkan teknologi mutakhir **View Transitions API** hardware-accelerated.
   * Saat tema beralih, seluruh halaman melakukan efek pemudaran berskala sinematik (*smooth zoom scaling transition* 350ms) di mana jendela utama `.mac-window` sedikit menyusut lembut (`scale(0.98)`) lalu kembali mengembang secara anggun.

4. **macOS Floating App Dock**:
   * Menu navigasi melayang reaktif di bagian bawah layar yang mensimulasikan Apple Dock.
   * Menampilkan animasi pembesaran ikon dinamis (*hover zoom expansion* dengan kurva pantul `cubic-bezier`).
   * Dilengkapi titik bersinar indikator aktif dan secara cerdas disembunyikan pada layar mobile untuk efisiensi ruang baca.

5. **Antarmuka Desktop 100% Responsif**:
   * Dibungkus dalam cangkang visual jendela aplikasi native macOS (`.mac-window`) lengkap dengan dekorasi tombol kontrol *traffic lights* (Merah 🔴, Kuning 🟡, Hijau 🟢).
   * **Tampilan Mobile**: Otomatis melebur menjadi aplikasi layar penuh dengan navigasi navbar yang menyusun secara vertikal agar mudah diketuk oleh ibu jari.
   * **Grid Statistik 2x2**: Khusus layar sangat kecil (ponsel pintar), grid data diatur menjadi 2 baris dan 2 kolom yang padat dan estetik guna menghindari tumpukan memanjang vertikal yang monoton.

---

## ⚙️ Fitur Fungsionalitas & Reaktivitas (Vue.js 3)

### 🏬 1. Manajemen Stok Bahan Ajar
* **Dependent Category Selector (Paling Penting!)**: Pemilihan wilayah UT-Daerah (UPBJJ) akan memicu pembaruan reaktif opsi kategori mata kuliah yang tersedia di wilayah tersebut secara dinamis.
* **Filter & Pengurutan Terpadu**: Pencarian reaktif kata kunci, filter khusus stok kritis (menipis/kosong), serta pengurutan data berdasarkan nama (A-Z), sisa kuantitas, atau harga satuan. Seluruh fitur dikelola oleh satu computed property caching berkinerja tinggi (`filteredBahanAjarList`).
* **Indikator Kritis Kondisional**: Status stok dipetakan otomatis menggunakan badge warna kondisional (`v-if`): **Aman** (qty >= safety), **Menipis** (qty < safety), dan **Kosong** (qty = 0).
* **Entri Data Cepat & Aman**: Penambahan komoditas baru dengan validasi reaktif ketat (format kode MK wajib 4 Kapital + 4 Angka). Edit kuantitas/rak menggunakan modal dialog yang dibentengi *deep cloning* objek agar tidak merusak data baris tabel sebelum disimpan.

### 🚚 2. Pelacakan Delivery Order (DO)
* **Auto-generated DO Serial**: Generator nomor urut DO otomatis berdasarkan tahun berjalan (contoh: `DO2026-003`) menggunakan pencarian sequence dinamis.
* **Detail Paket Dinamis (Watcher)**: Memilih jenis paket bahan ajar mahasiswa otomatis memicu watcher untuk memunculkan detail isi buku paket, harga satuan paket, serta mengunci nilai input total harga pesanan (*read-only*).
* **Validasi NIM**: Formulir pendaftaran mewajibkan pengisian NIM mahasiswa 9 digit numerik, memunculkan notifikasi error reaktif instan jika tidak sesuai ketentuan.
* **Real-Time Toast**: Notifikasi pop-up macOS terpadu yang muncul reaktif setiap kali transaksi edit stok atau DO baru sukses terdaftar.

---

## 📂 Struktur Direktori Proyek

```bash
tugas-joki/
│
├── css/
│   └── style.css            # Tulang punggung macOS Clean 2026 Design System & Media Queries
│
├── js/
│   ├── stok-app.js          # Logika Vue.js 3 untuk Manajemen Inventaris Stok
│   └── tracking-app.js      # Logika Vue.js 3 untuk Pelacakan Delivery Order (DO)
│
├── dataBahanAjar.js         # Pusat Database Dummy (Shared Global Array Variables)
├── index.html               # Halaman Utama (Beranda Portal SITTA UT & Ringkasan Tiras)
├── stok.html                # Halaman Manajemen Persediaan Rak UT Daerah
├── tracking.html            # Halaman Pendaftaran & Pelacakan Delivery Order
├── panduan_presentasi.md    # Panduan Ringkas Alur Rekaman Video Ujian Tugas
└── README.md                # Dokumentasi Resmi Proyek (File ini)
```

---

## 🛠️ Stack Teknologi yang Digunakan

* **Core Structure**: HTML5 (Semantic Elements) & JavaScript ES6+
* **Aesthetic Styling**: Vanilla CSS3 Custom Properties (CSS Variables) & CSS Animations
* **Reactivity Framework**: Vue.js 3 (Options API via Browser CDN)
* **Data Persistence**: HTML5 LocalStorage API (Penyimpanan instan reaktif lintas-halaman)
* **Typography**: Inter (Google Fonts) & macOS Default Apple-System Fonts

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini didevelop sepenuhnya secara *client-side* murni, sehingga **tidak memerlukan instalasi dependensi, bundler (npm/yarn), ataupun konfigurasi database lokal**. 

Untuk menjalankan aplikasi:
1. Unduh atau salin seluruh direktori proyek ini ke komputer Anda.
2. Navigasikan ke root folder proyek.
3. Klik ganda berkas `index.html` untuk membukanya secara langsung di peramban web modern kesayangan Anda (Google Chrome, Microsoft Edge, Safari, atau Firefox).
4. *Selesai! Aplikasi siap dioperasikan.*

---

## 💼 Informasi Commission & Pengerjaan (Premium Joki Tugas)

Proyek premium ini dikembangkan dan diselesaikan secara khusus sebagai **Jasa Pembuatan Tugas Praktik (Joki Tugas)** untuk memenuhi persyaratan akademis klien:

* **Mata Kuliah**: Praktik Sistem Informasi Terdistribusi / Pemrograman Berbasis Web
* **Institusi Klien**: Universitas Terbuka
* **Semester**: 2 (Tugas Praktik 2)
* **Developer Joki (Penyedia Jasa)**: **Satria Mahatir** (UI/UX Developer & Reactivity Specialist)
* **Status Pengerjaan**: Selesai 100% (Overhaul total UI macOS Clean 2026, Penyelarasan Reaktivitas Vue 3, Integrasi Bootloader, Transisi Sinematis, Dokumentasi Lengkap, dan Optimasi Mobile Responsif).

> [!NOTE]
> Proyek ini diserahkan kepada klien dalam kondisi siap pakai, siap didemonstrasikan via rekaman video presentasi, dan siap dikumpulkan langsung ke portal akademik Universitas Terbuka dengan jaminan fungsionalitas penuh.

---
*© 2026 SITTA UT - Premium Commission Work by Satria Mahatir. All Rights Reserved.*
