# 🏠 Renovasi Tracker v1.0

Aplikasi dokumentasi kerusakan rumah untuk persiapan renovasi. Bantu pemilik rumah mendokumentasikan kerusakan, mendapat estimasi biaya dari AI gratis, dan menghasilkan laporan siap pakai untuk tukang.

**Single-file HTML** — tidak perlu instalasi, server, atau koneksi internet (kecuali membuka AI untuk estimasi).

---

## ✨ Fitur Utama

### 📋 Dokumentasi Kerusakan
- Tambah, edit, hapus item kerusakan per ruangan
- Upload foto langsung dari kamera atau galeri
- Tingkat kerusakan: Ringan / Sedang / Parah
- Input ukuran area rusak untuk estimasi lebih akurat
- Kelas material: 💰 Ekonomis / ⚖️ Menengah / ✨ Premium
- Catatan khusus untuk tukang per item

### 🤖 Estimasi AI (Copy-Paste, Gratis)
- Prompt siap pakai — tinggal copy → paste ke Gemini/ChatGPT/Claude/Copilot
- Tiga mode estimasi:
  - **Per Item** — estimasi satu kerusakan spesifik
  - **Gabungkan** — hemat biaya dengan estimasi beberapa item sekaligus
  - **Semua** — analisis komprehensif seluruh kerusakan
- Prompt menyertakan referensi harga kota yang dipilih (2025–2026)
- Rekomendasi merek & tipe material spesifik sesuai kelas
- **Include / Exclude per item** — kerusakan kecil bisa dikecualikan dari estimasi AI

### 📄 Laporan Export
- **Laporan Pemilik** — lengkap dengan estimasi AI, untuk arsip pribadi
- **Instruksi Tukang** — daftar pekerjaan + foto + catatan, tanpa harga, siap dikirim ke tukang
- Kedua laporan diunduh sebagai file `.html` yang bisa dibuka di browser manapun

### 🔧 Utilitas
- Input kota renovasi — mempengaruhi semua prompt AI
- Reset semua estimasi AI (data kerusakan tetap)
- Hapus semua data (dengan konfirmasi ganda)
- Semua data tersimpan di `localStorage` browser

---

## 🚀 Cara Pakai

1. **Download** file `renovasi-tracker.html`
2. **Buka** di browser (Chrome/Safari/Firefox)
3. **Isi kota** di bar atas (misal: Bandung, Jakarta, Surabaya)
4. **Tap +** untuk tambah kerusakan
5. Isi form → simpan
6. Di tab **AI Estimasi** → copy prompt → paste ke AI gratis → paste hasilnya kembali
7. Di tab **Laporan** → download versi Pemilik atau Tukang

---

## 📁 Struktur File

```
renovasi-tracker.html   ← satu-satunya file yang dibutuhkan
README.md               ← dokumentasi ini
PROMPT-REPLIKASI.md     ← prompt untuk membuat ulang aplikasi dengan AI
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
Foto kerusakan   →   Copy prompt        →   Laporan Pemilik
Deskripsi detail →   Paste ke AI gratis →     (+ estimasi AI)
Ukuran area      →   Copy jawaban AI    →
Kelas material   →   Paste ke app       →   Instruksi Tukang
Catatan tukang   →   Estimasi tersimpan →     (foto + instruksi)
```

---

## 🗂️ Data Model

Setiap item kerusakan menyimpan:

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

## 🐛 Bug yang Diperbaiki di v1.0

| Bug | Penyebab | Fix |
|---|---|---|
| Double entry saat tap tombol simpan 2x | Tidak ada guard double-submit | Flag `_saving` + disable button saat proses |
| Dua entry terhapus sekaligus | Entry duplikat punya data sama, filter menghapus keduanya | Cegah duplikat dari akar (guard submit) |
| Syntax error JS (`Illegal return statement`) | Sisa kode lama tertinggal di luar function | Bersihkan semua dead code |
| Dropdown Android overlap form di bawahnya | `<datalist>` native bermasalah di Android Chrome | Custom dropdown buatan sendiri |

---

## ⚙️ Kompatibilitas

- ✅ Chrome (Android & Desktop)
- ✅ Safari (iOS & macOS)
- ✅ Firefox
- ✅ Edge
- ❌ Internet Explorer (tidak didukung)

Tidak membutuhkan: server, database, instalasi, internet (kecuali untuk AI dan Google Fonts)

---

## 📝 Lisensi

Free to use, modify, and distribute. Dibuat dengan bantuan Claude (Anthropic).

---

## 🔄 Changelog

### v1.0 (2025)
- Rilis pertama
- Dokumentasi kerusakan + foto
- 3 mode estimasi AI (per item, gabungan, semua)
- Kelas material dengan rekomendasi merek spesifik
- Include/exclude per item dari estimasi AI
- Input kota renovasi (prompt AI menyesuaikan kota)
- Laporan Pemilik + Instruksi Tukang
- Reset estimasi AI & hapus semua data
- Fix bug double-submit pada form tambah kerusakan
