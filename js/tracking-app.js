/**
 * SITTA UT - Delivery Order (DO) Tracking Vue.js Application Logic
 * Implements Vue 3 Options API
 */

const { createApp } = Vue;

// Predefined initial Delivery Orders to show a populated system at first boot
const defaultTrackingList = [
  {
    nomorDO: "DO2026-001",
    nim: "043219876",
    nama: "Budi Santoso",
    ekspedisi: "JNE Express",
    paketCode: "PKT-001",
    paketNama: "Paket Semester 1 Ekonomi Pembangunan",
    paketIsi: ["ESPA4110 Pengantar Ekonomi Makro", "MKDU4110 Bahasa Indonesia", "ADPU4130 Pengantar Ilmu Administrasi"],
    tanggalKirim: "2026-05-24",
    totalHarga: 150000,
    status: "Selesai"
  },
  {
    nomorDO: "DO2026-002",
    nim: "048123456",
    nama: "Siti Rahma",
    ekspedisi: "JNE Regular",
    paketCode: "PKT-003",
    paketNama: "Paket Semester 1 Sistem Informasi",
    paketIsi: ["MSIM4101 Pengantar Sistem Informasi", "MATA4101 Pengantar Matematika", "MKDU4110 Bahasa Indonesia"],
    tanggalKirim: "2026-05-25",
    totalHarga: 220000,
    status: "Dikirim"
  }
];

createApp({
  data() {
    return {
      // Load tracking list from localStorage or use defaults
      trackingList: [],
      paketBahanAjar: window.paketBahanAjar || [],
      ekspedisiList: window.ekspedisiList || [],
      
      // Form Input Object
      formData: {
        nim: "",
        nama: "",
        ekspedisi: "",
        selectedPaketCode: "",
        tanggalKirim: "",
        totalHarga: 0
      },
      
      // Selected Package details helper
      selectedPaketObj: null,
      
      // Form Validation Errors
      errors: {},
      
      // Success feedback toast
      successToast: ""
    }
  },
  
  mounted() {
    // 1. Initialize tracking list from localStorage
    const savedDO = localStorage.getItem('sitta_tracking_list');
    if (savedDO) {
      try {
        this.trackingList = JSON.parse(savedDO);
      } catch (e) {
        this.trackingList = [...defaultTrackingList];
      }
    } else {
      this.trackingList = [...defaultTrackingList];
    }
    
    // 2. Set default local date to YYYY-MM-DD
    this.setDefaultDate();
  },
  
  computed: {
    // Dynamic DO Number Sequence Generator
    // Format: DO + Current Year + Sequence (e.g. DO2026-003)
    nextDoNumber() {
      const currentYear = new Date().getFullYear();
      const prefix = `DO${currentYear}`;
      
      // Filter DO items that belong to the current year
      const currentYearItems = this.trackingList.filter(item => item.nomorDO.startsWith(prefix));
      
      if (currentYearItems.length === 0) {
        return `${prefix}-001`;
      }
      
      // Extract numeric sequence suffix (e.g. 001, 002 -> 1, 2)
      const sequences = currentYearItems.map(item => {
        const parts = item.nomorDO.split('-');
        return parts.length > 1 ? parseInt(parts[1], 10) : 0;
      });
      
      // Get the highest sequence and increment by 1
      const highestSeq = Math.max(...sequences);
      const nextSeq = highestSeq + 1;
      
      // Format to 3 digits sequence number
      const paddedSeq = String(nextSeq).padStart(3, '0');
      return `${prefix}-${paddedSeq}`;
    },
    
    // Total price visual feedback binding
    formattedTotalHarga() {
      return `Rp ${this.formatRupiah(this.formData.totalHarga)}`;
    }
  },
  
  methods: {
    // Toggle Light/Dark Theme
    toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      if (!document.startViewTransition) {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('sitta_theme', newTheme);
        return;
      }
      
      document.startViewTransition(() => {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('sitta_theme', newTheme);
      });
    },
    
    // Set default local time date picker
    setDefaultDate() {
      const today = new Date();
      // Format as YYYY-MM-DD compensating for timezone offset
      const offset = today.getTimezoneOffset();
      const localDate = new Date(today.getTime() - (offset * 60 * 1000));
      this.formData.tanggalKirim = localDate.toISOString().split('T')[0];
    },
    
    // Submit delivery order
    submitDO() {
      this.errors = {};
      
      // 1. Validate NIM (exactly 9 digits)
      const nimRegex = /^\d{9}$/;
      if (!this.formData.nim) {
        this.errors.nim = "NIM Mahasiswa wajib diisi.";
      } else if (!nimRegex.test(this.formData.nim)) {
        this.errors.nim = "NIM tidak valid (Harus berupa 9 digit angka, contoh: 043219876).";
      }
      
      // 2. Validate Nama (min 3 chars)
      if (!this.formData.nama || this.formData.nama.trim().length < 3) {
        this.errors.nama = "Nama Lengkap wajib diisi (minimal 3 karakter).";
      }
      
      // 3. Validate Ekspedisi
      if (!this.formData.ekspedisi) {
        this.errors.ekspedisi = "Ekspedisi Pengiriman wajib dipilih.";
      }
      
      // 4. Validate Paket selection
      if (!this.formData.selectedPaketCode) {
        this.errors.paket = "Paket Bahan Ajar wajib dipilih.";
      }
      
      // 5. Validate Tanggal
      if (!this.formData.tanggalKirim) {
        this.errors.tanggalKirim = "Tanggal Kirim wajib diisi.";
      }
      
      // Abort if form contains validation errors
      if (Object.keys(this.errors).length > 0) return;
      
      // Generate current next DO code
      const generatedDoNum = this.nextDoNumber;
      
      // Create new Delivery Order object
      const newDO = {
        nomorDO: generatedDoNum,
        nim: this.formData.nim,
        nama: this.formData.nama.trim(),
        ekspedisi: this.formData.ekspedisi,
        paketCode: this.formData.selectedPaketCode,
        paketNama: this.selectedPaketObj.nama,
        paketIsi: [...this.selectedPaketObj.isi],
        tanggalKirim: this.formData.tanggalKirim,
        totalHarga: this.formData.totalHarga,
        status: "Diproses" // Initial status when registered
      };
      
      // Add DO to the beginning of the list for quick visibility
      this.trackingList.unshift(newDO);
      
      // Reset form fields
      this.formData.nim = "";
      this.formData.nama = "";
      this.formData.ekspedisi = "";
      this.formData.selectedPaketCode = "";
      this.setDefaultDate();
      
      // Trigger Toast notification
      this.triggerToast(`Sukses membuat Delivery Order ${generatedDoNum}!`);
    },
    
    // Format numbers as currency string
    formatRupiah(value) {
      if (!value) return "0";
      return new Intl.NumberFormat('id-ID').format(value);
    },
    
    // Trigger Success feedback toast
    triggerToast(message) {
      this.successToast = message;
      setTimeout(() => {
        this.successToast = "";
      }, 3000);
    }
  },
  
  watch: {
    // WATCHER 1: Watch package selection code to auto-extract detail objects and map total prices
    "formData.selectedPaketCode"(newCode) {
      console.log(`[Watcher] Pilihan paket berubah ke: ${newCode || 'Kosong'}`);
      if (newCode) {
        // Find matching package metadata
        const matched = this.paketBahanAjar.find(x => x.kode === newCode);
        if (matched) {
          this.selectedPaketObj = matched;
          this.formData.totalHarga = matched.harga;
        }
      } else {
        this.selectedPaketObj = null;
        this.formData.totalHarga = 0;
      }
    },
    
    // WATCHER 2: Deep watcher to synchronize all DOs to browser localStorage in real-time
    trackingList: {
      handler(newVal) {
        console.log("[Watcher] Daftar Delivery Order berubah. Menyinkronkan ke localStorage...");
        localStorage.setItem('sitta_tracking_list', JSON.stringify(newVal));
      },
      deep: true
    }
  }
}).mount('#tracking-app');
