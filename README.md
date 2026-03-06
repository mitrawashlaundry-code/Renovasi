# 🏠 Renovasi Tracker v2.1

Aplikasi dokumentasi kerusakan rumah dan estimasi biaya renovasi berbasis AI — **single-file PWA**, bisa digunakan offline.

## ✨ Fitur Utama

- 📸 **Dokumentasi Kerusakan** — foto, deskripsi, ruangan, kategori, tingkat kerusakan
- 🤖 **Estimasi AI** — generate prompt untuk Gemini/ChatGPT/Claude/Copilot (gratis!)
- 💰 **Estimasi Gabungan** — hitung penghematan jika beberapa pekerjaan dikerjakan bersamaan
- 📄 **Export Laporan** — HTML untuk pemilik, instruksi untuk tukang, file RTF untuk Word/Docs
- 💾 **Backup JSON** — export/import data antar perangkat
- 📱 **PWA** — bisa diinstall ke homescreen, bekerja offline

## 🚀 Cara Pakai

1. Buka `index.html` di browser (Chrome/Safari disarankan)
2. Tap **+** untuk tambah kerusakan pertama
3. Isi detail, foto kondisi kerusakan
4. Ke tab **🤖 AI Estimasi** → copy prompt → paste ke AI gratis → paste hasilnya kembali
5. Ke tab **📄 Laporan** untuk download laporan siap cetak

## 📦 File Struktur

```
├── index.html          # Aplikasi utama (semua kode dalam 1 file)
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker untuk offline support
├── icon-192.png        # App icon 192×192 (sediakan sendiri)
├── icon-512.png        # App icon 512×512 (sediakan sendiri)
└── README.md           # Dokumentasi ini
```

> **Catatan:** `icon-192.png` dan `icon-512.png` perlu disediakan sendiri. Bisa buat di [favicon.io](https://favicon.io) atau gunakan emoji 🏠 sebagai icon.

## 🔧 Deploy ke GitHub Pages

1. Fork/clone repo ini
2. Aktifkan GitHub Pages di Settings → Pages → Deploy from branch `main`
3. Akses di `https://[username].github.io/[repo-name]/`

## 🔄 Changelog v2.1

- **Fix:** Toast notification `ok` type tidak tampil hijau (bug kondisi)
- **Fix:** `clearGlobal()` kini menampilkan toast konfirmasi
- **Fix:** Dead code `dupBlock` variable dihapus di Settings
- **Fix:** Validasi form kini fokus otomatis ke field yang kosong
- **New:** Export file `.RTF` untuk Microsoft Word / Google Docs
- **UX:** Empty state lebih informatif dengan tombol aksi langsung
- **UX:** Statistik kini menampilkan hitungan kerusakan Parah
- **UX:** Tombol Batal di form lebih jelas labelnya

## 📄 Lisensi

MIT — bebas digunakan, dimodifikasi, dan didistribusikan.
