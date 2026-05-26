// Shared dummy data for UT Bahan Ajar SITTA

const upbjjList = [
  { id: 'UPBJJ-1', nama: 'UT Jakarta', kategoriTersedia: ['Umum', 'Ekonomi', 'Hukum', 'MIPA'] },
  { id: 'UPBJJ-2', nama: 'UT Bandung', kategoriTersedia: ['Umum', 'Ekonomi', 'Keguruan', 'Sains'] },
  { id: 'UPBJJ-3', nama: 'UT Surabaya', kategoriTersedia: ['Umum', 'Hukum', 'Keguruan', 'Sosial'] },
  { id: 'UPBJJ-4', nama: 'UT Medan', kategoriTersedia: ['Umum', 'Ekonomi', 'Sosial', 'Hukum'] }
];

const paketBahanAjar = [
  {
    kode: 'PKT-001',
    nama: 'Paket Semester 1 Ekonomi Pembangunan',
    harga: 150000,
    isi: ['ESPA4110 Pengantar Ekonomi Makro', 'MKDU4110 Bahasa Indonesia', 'ADPU4130 Pengantar Ilmu Administrasi']
  },
  {
    kode: 'PKT-002',
    nama: 'Paket Semester 1 Ilmu Hukum',
    harga: 185000,
    isi: ['HKUM4101 Pengantar Ilmu Hukum', 'MKDU4110 Bahasa Indonesia', 'ISIP4110 Pengantar Sosiologi']
  },
  {
    kode: 'PKT-003',
    nama: 'Paket Semester 1 Sistem Informasi',
    harga: 220000,
    isi: ['MSIM4101 Pengantar Sistem Informasi', 'MATA4101 Pengantar Matematika', 'MKDU4110 Bahasa Indonesia']
  }
];

const ekspedisiList = [
  { id: 'EXP-1', nama: 'JNE Regular' },
  { id: 'EXP-2', nama: 'JNE Express' }
];

const defaultBahanAjar = [
  {
    id: 1,
    kode: 'MKDU4110',
    judul: 'Bahasa Indonesia',
    Kategori: 'Umum',
    upbjj: 'UT Jakarta',
    lokasiRak: 'Rak A-1',
    qty: 45,
    safety: 15,
    harga: 45000,
    catatanHTML: 'Stok dipasok langsung dari UT Pusat. <span class="badge-tag info">Prioritas</span>'
  },
  {
    id: 2,
    kode: 'ESPA4110',
    judul: 'Pengantar Ekonomi Makro',
    Kategori: 'Ekonomi',
    upbjj: 'UT Jakarta',
    lokasiRak: 'Rak B-3',
    qty: 8,
    safety: 12,
    harga: 65000,
    catatanHTML: 'Permintaan tinggi awal semester. <span class="badge-tag warning">Segera re-order</span>'
  },
  {
    id: 3,
    kode: 'HKUM4101',
    judul: 'Pengantar Ilmu Hukum',
    Kategori: 'Hukum',
    upbjj: 'UT Surabaya',
    lokasiRak: 'Rak C-2',
    qty: 0,
    safety: 10,
    harga: 75000,
    catatanHTML: '<strong>KOSONG!</strong> Distribusi tertunda dari penerbit.'
  },
  {
    id: 4,
    kode: 'MSIM4101',
    judul: 'Pengantar Sistem Informasi',
    Kategori: 'Sains',
    upbjj: 'UT Bandung',
    lokasiRak: 'Rak D-1',
    qty: 30,
    safety: 10,
    harga: 80000,
    catatanHTML: 'Stok aman terkendali.'
  }
];

// Attach variables to window for easy browser loading in vanilla script context
if (typeof window !== 'undefined') {
  window.upbjjList = upbjjList;
  window.paketBahanAjar = paketBahanAjar;
  window.ekspedisiList = ekspedisiList;
  window.defaultBahanAjar = defaultBahanAjar;
}
