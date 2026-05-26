/**
 * SITTA UT - Stock Management Vue.js Application Logic
 * Implements Vue 3 Options API
 */

const { createApp } = Vue;

createApp({
  data() {
    return {
      // Load from localStorage or fallback to default dummy data
      bahanAjarList: [],
      upbjjList: window.upbjjList || [],
      
      // Filters & Search
      selectedUpbjj: "",
      selectedKategori: "",
      searchQuery: "",
      showWarningOnly: false,
      sortBy: "judul",
      
      // Add Form Data
      newBahanAjar: {
        kode: "",
        judul: "",
        upbjj: "",
        Kategori: "",
        lokasiRak: "",
        qty: 0,
        safety: 10,
        harga: 50000,
        catatanHTML: ""
      },
      
      // Add Form Errors
      errors: {},
      
      // Edit Modal Data
      editingBahanAjar: null,
      modalErrors: {},
      
      // Feedback Toast
      successToast: ""
    }
  },
  
  mounted() {
    // Initialize list from local storage or defaults
    const savedData = localStorage.getItem('sitta_bahan_ajar');
    if (savedData) {
      try {
        this.bahanAjarList = JSON.parse(savedData);
      } catch (e) {
        this.bahanAjarList = [...window.defaultBahanAjar];
      }
    } else {
      this.bahanAjarList = [...window.defaultBahanAjar];
    }
  },
  
  computed: {
    // Memoized computed property for high-performance filtering & sorting
    // Vue caches this and only re-evaluates when its dependencies change
    filteredBahanAjarList() {
      return this.bahanAjarList
        .filter(item => {
          // 1. Search Query Filter (Matches Kode or Judul, Case Insensitive)
          const query = this.searchQuery.toLowerCase();
          const matchesSearch = item.kode.toLowerCase().includes(query) || 
                                item.judul.toLowerCase().includes(query);
          
          // 2. UT-Daerah (UPBJJ) Filter
          const matchesUpbjj = !this.selectedUpbjj || item.upbjj === this.selectedUpbjj;
          
          // 3. Category Filter (Dependent Option)
          const matchesKategori = !this.selectedKategori || item.Kategori === this.selectedKategori;
          
          // 4. Warning Stock Filter (qty < safety OR qty === 0)
          const matchesWarning = !this.showWarningOnly || item.qty === 0 || item.qty < item.safety;
          
          return matchesSearch && matchesUpbjj && matchesKategori && matchesWarning;
        })
        .sort((a, b) => {
          // Sort comparator based on sortBy selection
          if (this.sortBy === "judul") {
            return a.judul.localeCompare(b.judul);
          } else if (this.sortBy === "qty") {
            return a.qty - b.qty;
          } else if (this.sortBy === "harga") {
            return a.harga - b.harga;
          }
          return 0;
        });
    },
    
    // Dependent Options helper: returns dynamic category options based on chosen UPBJJ
    uniqueKategoriOptions() {
      if (!this.selectedUpbjj) return [];
      const matchedRegion = this.upbjjList.find(item => item.nama === this.selectedUpbjj);
      return matchedRegion ? matchedRegion.kategoriTersedia : [];
    },
    
    // Dynamic Stats Counters
    stats() {
      let safe = 0;
      let warning = 0;
      let danger = 0;
      
      this.bahanAjarList.forEach(item => {
        if (item.qty === 0) {
          danger++;
        } else if (item.qty < item.safety) {
          warning++;
        } else {
          safe++;
        }
      });
      
      return {
        total: this.bahanAjarList.length,
        safe,
        warning,
        danger
      }
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
    
    // Open glass modal for editing stock
    editStock(item) {
      // Perform a cloned copy so the visual table doesn't morph before saving
      this.editingBahanAjar = JSON.parse(JSON.stringify(item));
      this.modalErrors = {};
    },
    
    // Close glass modal
    closeEditModal() {
      this.editingBahanAjar = null;
      this.modalErrors = {};
    },
    
    // Save updated stock metrics
    saveStockUpdate() {
      this.modalErrors = {};
      
      // Perform modal validations
      if (!this.editingBahanAjar.lokasiRak || this.editingBahanAjar.lokasiRak.trim() === "") {
        this.modalErrors.lokasiRak = "Lokasi Rak wajib diisi.";
      }
      if (this.editingBahanAjar.qty === null || this.editingBahanAjar.qty === "" || this.editingBahanAjar.qty < 0) {
        this.modalErrors.qty = "Jumlah stok harus diisi dan minimal 0.";
      }
      if (this.editingBahanAjar.safety === null || this.editingBahanAjar.safety === "" || this.editingBahanAjar.safety < 0) {
        this.modalErrors.safety = "Safety stock harus diisi dan minimal 0.";
      }
      
      // If modal contains errors, abort save
      if (Object.keys(this.modalErrors).length > 0) return;
      
      // Find matching item in main reactive list and assign updated values
      const index = this.bahanAjarList.findIndex(x => x.id === this.editingBahanAjar.id);
      if (index !== -1) {
        // Capture old quantity for toast warning comparison
        const oldQty = this.bahanAjarList[index].qty;
        const newQty = this.editingBahanAjar.qty;
        
        this.bahanAjarList[index] = { ...this.editingBahanAjar };
        this.closeEditModal();
        
        // Show success notification
        this.triggerToast(`Sukses mengubah stok bahan ajar ${this.bahanAjarList[index].kode}!`);
      }
    },
    
    // Add new bahan ajar
    addBahanAjar() {
      this.errors = {};
      
      // 1. Validate Code
      const codeRegex = /^[A-Z]{4}[0-9]{4}$/; // Standard UT code, e.g. MKDU4110
      if (!this.newBahanAjar.kode) {
        this.errors.kode = "Kode Mata Kuliah wajib diisi.";
      } else if (!codeRegex.test(this.newBahanAjar.kode)) {
        this.errors.kode = "Format kode tidak valid (Harus 4 Huruf Kapital + 4 Angka, contoh: MKDU4110).";
      } else {
        // Check uniqueness in list
        const exists = this.bahanAjarList.some(item => item.kode === this.newBahanAjar.kode);
        if (exists) {
          this.errors.kode = "Kode Mata Kuliah ini sudah terdaftar dalam inventaris.";
        }
      }
      
      // 2. Validate Judul
      if (!this.newBahanAjar.judul || this.newBahanAjar.judul.trim().length < 3) {
        this.errors.judul = "Nama Mata Kuliah wajib diisi (minimal 3 karakter).";
      }
      
      // 3. Validate UPBJJ
      if (!this.newBahanAjar.upbjj) {
        this.errors.upbjj = "UT-Daerah (UPBJJ) wajib dipilih.";
      }
      
      // 4. Validate Kategori
      if (!this.newBahanAjar.Kategori) {
        this.errors.Kategori = "Kategori wajib dipilih.";
      }
      
      // 5. Validate Rak
      if (!this.newBahanAjar.lokasiRak || this.newBahanAjar.lokasiRak.trim() === "") {
        this.errors.lokasiRak = "Lokasi Rak wajib diisi.";
      }
      
      // 6. Validate Qty
      if (this.newBahanAjar.qty === null || this.newBahanAjar.qty === "" || this.newBahanAjar.qty < 0) {
        this.errors.qty = "Jumlah Stok wajib diisi (minimal 0).";
      }
      
      // 7. Validate Safety
      if (this.newBahanAjar.safety === null || this.newBahanAjar.safety === "" || this.newBahanAjar.safety < 0) {
        this.errors.safety = "Safety Stock wajib diisi (minimal 0).";
      }
      
      // 8. Validate Harga
      if (!this.newBahanAjar.harga || this.newBahanAjar.harga <= 0) {
        this.errors.harga = "Harga Satuan harus diisi dan lebih dari Rp 0.";
      }
      
      // Abort if form errors exist
      if (Object.keys(this.errors).length > 0) return;
      
      // Generate unique sequence ID
      const maxId = this.bahanAjarList.reduce((max, item) => item.id > max ? item.id : max, 0);
      const newItem = {
        id: maxId + 1,
        ...this.newBahanAjar,
        catatanHTML: this.newBahanAjar.catatanHTML.trim() || '<em>Tidak ada catatan tambahan</em>'
      };
      
      // Push into reactive list
      this.bahanAjarList.push(newItem);
      
      // Clear form inputs
      this.newBahanAjar = {
        kode: "",
        judul: "",
        upbjj: "",
        Kategori: "",
        lokasiRak: "",
        qty: 0,
        safety: 10,
        harga: 50000,
        catatanHTML: ""
      };
      
      this.triggerToast("Bahan Ajar baru berhasil ditambahkan!");
    },
    
    // Reset all filter inputs
    resetFilters() {
      this.searchQuery = "";
      this.selectedUpbjj = "";
      this.selectedKategori = "";
      this.showWarningOnly = false;
      this.sortBy = "judul";
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
    // WATCHER 1: Watch selectedUpbjj to implement dependent sub-options clearing
    selectedUpbjj(newVal) {
      console.log(`[Watcher] Wilayah UPBJJ berubah menjadi: ${newVal || 'Semua Daerah'}`);
      // Auto-reset Kategori filter to prevent choosing an orphan category not supported by the new UPBJJ
      this.selectedKategori = "";
    },
    
    // WATCHER 2: Deep watcher to achieve real-time localStorage persistence and alert notifications
    bahanAjarList: {
      handler(newVal, oldVal) {
        console.log("[Watcher] Daftar Inventaris terdeteksi berubah. Menyinkronkan ke localStorage...");
        localStorage.setItem('sitta_bahan_ajar', JSON.stringify(newVal));
        
        // Dynamic Alert Check: If any item is modified to qty == 0 or critical, show a special warning console log
        newVal.forEach(item => {
          if (item.qty === 0) {
            console.warn(`[PERINGATAN STOK] Buku ${item.kode} (${item.judul}) saat ini KOSONG! Rak: ${item.lokasiRak}`);
          } else if (item.qty < item.safety) {
            console.warn(`[PERINGATAN STOK] Stok buku ${item.kode} (${item.judul}) MENIPIS di rak: ${item.lokasiRak}. Sisa: ${item.qty}/${item.safety}`);
          }
        });
      },
      deep: true
    }
  }
}).mount('#stok-app');
