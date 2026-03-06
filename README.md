# 🏠 Renovasi Tracker v2.0

Aplikasi dokumentasi kerusakan rumah untuk persiapan renovasi. Bantu pemilik rumah mendokumentasikan kerusakan, mendapat estimasi biaya dari AI gratis, dan menghasilkan laporan siap pakai untuk tukang.

**Single-file HTML + PWA** — tidak perlu instalasi, server, atau koneksi internet (kecuali membuka AI untuk estimasi). Bisa diinstall ke homescreen seperti aplikasi sungguhan.

---

## ✨ Fitur Utama

### 📋 Dokumentasi Kerusakan
- Tambah, edit, hapus item kerusakan per ruangan
- Upload foto langsung dari kamera atau galeri (kompres otomatis)
- Tingkat kerusakan: Ringan / Sedang / Parah
- Input ukuran area rusak untuk estimasi lebih akurat
- Kelas material: 💰 Ekonomis / ⚖️ Menengah / ✨ Premium
- Catatan khusus untuk tukang/kontraktor per item

### 🤖 Estimasi AI (Copy-Paste, Gratis)
- Prompt siap pakai — tinggal copy → paste ke Gemini/ChatGPT/Claude/Copilot
- Tiga mode estimasi:
  - **Per Item** — estimasi satu kerusakan spesifik
  - **Gabungkan** — hemat biaya dengan estimasi beberapa item sekaligus (mobilisasi 1x)
  - **Semua** — analisis komprehensif seluruh kerusakan
- Prompt menyertakan referensi harga kota yang dipilih (2025–2026)
- Rekomendasi merek & tipe material spesifik sesuai kelas
- **Include / Exclude per item** — kerusakan kecil bisa dikecualikan dari estimasi AI

### 📄 Laporan Export
- **Laporan Pemilik** (HTML) — lengkap dengan estimasi AI, untuk arsip pribadi
- **Instruksi Tukang** (HTML) — daftar pekerjaan + foto + catatan, tanpa harga
- **Export RTF** — buka di Microsoft Word atau Google Docs

### ⚙️ Setelan & Utilitas
- Input kota renovasi — mempengaruhi semua prompt AI
- **Export / Import JSON** — backup data atau pindah ke HP lain
- **Deteksi & gabungkan duplikat** — otomatis temukan item serupa
- Reset semua estimasi AI (data kerusakan tetap)
- Hapus semua data (konfirmasi ganda)

### 📲 PWA (Progressive Web App)
- Install ke homescreen Android/iOS
- Berjalan seperti aplikasi native, bisa offline
- Semua data tersimpan di `localStorage` browser

---

## 🚀 Cara Pakai

1. **Download** file `index.html`
2. **Buka** di browser (Chrome/Safari/Firefox)
3. **Isi kota** di bar atas (misal: Bandung, Jakarta, Surabaya)
4. **Tap +** untuk tambah kerusakan
5. Isi form → simpan
6. Di tab **AI Estimasi** → copy prompt → paste ke AI gratis → paste hasilnya kembali
7. Di tab **Laporan** → download versi Pemilik, Tukang, atau RTF
8. Di tab **Setelan** → export backup, import, atau install ke homescreen

---

## 📁 Struktur File

```
index.html                    ← aplikasi utama (single-file)
manifest.json                 ← konfigurasi PWA
sw.js                         ← service worker (offline support)
icon-192.png                  ← ikon PWA 192×192
icon-512.png                  ← ikon PWA 512×512
README.md                     ← dokumentasi ini
PROMPT-REPLIKASI-v2_0.md      ← prompt untuk membuat ulang aplikasi dengan AI
```

---

## 🤖 AI yang Didukung (Gratis)

| AI | Provider | Link |
|---|---|---|
| Gemini | Google | gemini.google.com |
| ChatGPT | OpenAI | chat.openai.com |
| Claude | Anthropic | claude.ai |
| Copilot | Microsoft | copilot.microsoft.com |

---

## 📊 Alur Penggunaan Lengkap

```
Dokumentasi          Estimasi AI            Laporan
─────────────────    ────────────────────   ──────────────────────
Foto kerusakan   →   Copy prompt        →   Laporan Pemilik (HTML)
Deskripsi detail →   Paste ke AI gratis →     + estimasi AI
Ukuran area      →   Copy jawaban AI    →   Instruksi Tukang (HTML)
Kelas material   →   Paste ke app       →     foto + instruksi
Catatan tukang   →   Estimasi tersimpan →   Export RTF (Word)
```

---

## 🗂️ Data Model

```json
{
  "id": "string (unik)",
  "room": "nama ruangan",
  "category": "jenis kerusakan",
  "severity": "Ringan | Sedang | Parah",
  "description": "deskripsi detail",
  "size": "ukuran area (opsional)",
  "materialGrade": "Ekonomis | Menengah | Premium",
  "notes": "catatan untuk tukang",
  "images": ["base64..."],
  "estimasi": {
    "raw_text": "teks jawaban AI",
    "grand_total": 5000000,
    "saved_at": "ISO timestamp",
    "combined": false
  },
  "includeInAI": true,
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

`localStorage` keys: `rv3_items`, `rv3_global`, `rv3_city`

---

## 🐛 Bug yang Diperbaiki

| Bug | Penyebab | Fix |
|---|---|---|
| Double entry saat tap simpan 2x | Tidak ada guard double-submit | Flag `_saving` + disable button |
| Dropdown Android overlap form | `<datalist>` native bermasalah | Custom dropdown buatan sendiri |
| Severity button dapat 2 class sekaligus | Expression chaining bersyarat | Lookup object `{Ringan:'ar',...}` |
| `render()` error (`vSettings` belum ada) | `render()` dipanggil terlalu awal | Pindahkan ke setelah semua fungsi view |
| Set-row-action tidak ter-style | CSS class tidak didefinisikan | Tambahkan `.set-row-action` di CSS |
| Tombol "Download .docx" unduh .rtf | Label UI tidak sesuai output | Update label menjadi ".rtf" |
| Offline fallback SW miss `index-2.html` | Hanya cek `index.html` | SW cek kedua nama file |

---

## ⚙️ Kompatibilitas

- ✅ Chrome (Android & Desktop)
- ✅ Safari (iOS & macOS)
- ✅ Firefox
- ✅ Edge
- ❌ Internet Explorer (tidak didukung)

---

## 📝 Lisensi

Free to use, modify, and distribute. Dibuat dengan bantuan Claude (Anthropic).

---

## 🔄 Changelog

### v2.0 (2026)
- Tab **Setelan** baru (tab ke-4) — kota, backup, duplikat, PWA install
- **Export / Import JSON** — backup data + pindah HP
- **Deteksi & merge duplikat** otomatis
- **Export RTF** — Word/Google Docs, label diperbaiki dari ".docx" ke ".rtf"
- **PWA penuh** — manifest, service worker v2, install banner
- Fix: severity button class ganda
- Fix: `render()` dipanggil sebelum `vSettings` terdefinisi
- Fix: CSS `.set-row-action` tidak ada
- Fix: SW offline fallback untuk `index-2.html`

### v1.0 (2025)
- Rilis pertama
- Dokumentasi kerusakan + foto
- 3 mode estimasi AI (per item, gabungan, semua)
- Kelas material + rekomendasi merek spesifik
- Include/exclude per item
- Laporan Pemilik + Instruksi Tukang
