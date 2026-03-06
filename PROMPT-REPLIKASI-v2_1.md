# PROMPT REPLIKASI — Renovasi Tracker v2.1

Salin seluruh teks di bawah ini dan paste ke AI (Claude, ChatGPT, Gemini, dll) untuk membuat ulang aplikasi ini dari nol.

---

Buatkan saya aplikasi **single-file HTML** bernama **"Renovasi Tracker"** — aplikasi dokumentasi kerusakan rumah untuk persiapan renovasi. Semua kode (HTML + CSS + JavaScript) dalam **satu file `.html`** yang bisa langsung dibuka di browser tanpa instalasi apapun.

---

## TEKNOLOGI & KETENTUAN UMUM

- Single file HTML + CSS + JS — tidak ada file eksternal kecuali Google Fonts
- Font: `Plus Jakarta Sans` (400;500;600;700;800) + `DM Mono` (400;500) dari Google Fonts
- Data disimpan di `localStorage` — tidak hilang meski tab ditutup
- Mobile-first, max-width 480px terpusat
- Vanilla JS murni, tidak ada framework
- Tidak ada API key atau server — sepenuhnya offline
- Semua input wajib `font-size: 16px` agar tidak di-zoom iOS saat fokus
- PWA: sertakan `<link rel="manifest" href="manifest.json">` dan daftarkan service worker `sw.js`

---

## DESAIN & TEMA

```css
:root {
  --bg:#F4F1ED; --surf:#FDFAF7; --surf2:#EDE9E3;
  --ink:#1C1917; --ink2:#78716C; --ink3:#A8A29E;
  --acc:#C2410C; --acc-l:#FFF7ED;
  --grn:#15803D; --grn-l:#F0FDF4;
  --amb:#B45309; --amb-l:#FFFBEB;
  --red:#DC2626; --red-l:#FEF2F2;
  --pur:#7C3AED; --pur-l:#F5F3FF;
  --blu:#0369A1; --blu-l:#F0F9FF;
  --bdr:#E7E2DA; --r:14px; --rs:8px;
}
```

Layout: Topbar sticky (background `--ink`) + bar kota di bawah topbar + konten scroll + Bottom Navigation fixed **4 tab**.

---

## STRUKTUR NAVIGASI

**4 Tab Bottom Navigation:**
1. 🏠 **Kerusakan** — daftar semua item
2. 🤖 **AI Estimasi** — 3 sub-tab: Per Item | Gabungkan | Semua
3. 📄 **Laporan** — export laporan
4. ⚙️ **Setelan** — pengaturan, backup, duplikat

**FAB (+)** hanya muncul di tab Kerusakan.

**Topbar:** kiri tombol ← (di halaman Add/Detail), tengah judul, kanan tombol "🤖 Prompt Semua" (hanya di tab Kerusakan jika ada data).

**Bottom nav highlight:** saat di halaman Add/Detail, tab Kerusakan tetap aktif (highlight).

---

## BAR KOTA

Di bawah topbar, tampilkan selalu kecuali saat halaman Add dan Detail:

```html
<div class="citybar">
  <span class="citybar-label">📍 Kota</span>
  <input class="city-input" id="city-inp" placeholder="Bandung, Jakarta, Surabaya..."
    oninput="S.city=this.value;saveCity()" onfocus="this.select()">
</div>
```

Simpan ke `localStorage` key `rv3_city`. Dipakai di semua prompt AI sebagai pengganti nama kota hardcode.

---

## DATA MODEL

```javascript
// localStorage keys: rv3_items, rv3_global, rv3_city
function blank(){
  return {
    room:'Ruang Tamu', category:'Dinding', severity:'Sedang',
    description:'', size:'', materialGrade:'Menengah',
    notes:'', images:[], estimasi:null, includeInAI:true
  }
}
// Saved item juga punya: id, createdAt, updatedAt
```

---

## HALAMAN 1: LIST (TAB KERUSAKAN)

**Stats row 3 kartu:** Total kerusakan | Diestimasi (hanya yang includeInAI=true) | Total Budget AI (hanya item included)

**Tiap card:**
- Thumbnail foto / emoji 📷
- Badges: severity (warna), ruangan (abu), "✓ Est." jika ada estimasi & included, "💰 Ekonomis" atau "✨ Premium" jika bukan Menengah, "⊘ Skip AI" jika excluded
- Judul kategori, deskripsi truncated, total AI
- **Tap area atas** → ke Detail
- **Row bawah card** (border-top): checkbox "Sertakan dalam estimasi AI" di kiri + tombol 🗑️ di kanan
- `dcard.excluded` jika `includeInAI === false` → `opacity: 0.55`

**Zona Berbahaya** di bawah semua card:
```html
<div class="danger-zone">
  <button onclick="resetAllAI()">🔄 Reset Semua Estimasi AI</button>
  <button onclick="resetAllData()">🗑️ Hapus Semua Data</button>
</div>
```
`resetAllData()` harus konfirmasi dua kali. `resetAllAI()` hapus semua `.estimasi` + `rv3_global`, data kerusakan tetap.

---

## HALAMAN 2: FORM TAMBAH/EDIT

### KRITIS: GUARD DOUBLE-SUBMIT
```javascript
let _saving = false;

function saveItem() {
  if (_saving) return;
  _saving = true;

  const btn = document.querySelector('.btn.bp2');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Menyimpan...'; }

  const room = ($('f-room')?.value || S.form.room).trim();
  const cat  = ($('f-cat')?.value  || S.form.category).trim();
  const desc = ($('f-desc')?.value || S.form.description).trim();
  if (!room || !cat || !desc) {
    _saving = false;
    if (btn) { btn.disabled = false; btn.textContent = S.editingId ? '✅ Simpan Perubahan' : '➕ Tambah Kerusakan'; }
    return;
  }

  setTimeout(() => {
    try {
      if (S.editingId) {
        const idx = S.items.findIndex(i => i.id === S.editingId);
        if (idx >= 0) S.items[idx] = { ...S.items[idx], ...S.form, updatedAt: new Date().toISOString() };
      } else {
        S.items.push({ ...S.form, id: uid(), createdAt: new Date().toISOString() });
      }
      saveItems();
      S.form = blank(); S.editingId = null;
      setTimeout(() => { _saving = false; }, 300);
      go('list');
    } catch(err) {
      _saving = false;
      if (btn) { btn.disabled = false; btn.textContent = S.editingId ? '✅ Simpan Perubahan' : '➕ Tambah Kerusakan'; }
    }
  }, 30);
}
```

### Field 1 — Ruangan *
**WAJIB custom dropdown — JANGAN pakai `<datalist>` native.** Datalist native overlap di Android Chrome.

```javascript
// Gunakan onmousedown + e.preventDefault() pada item dropdown
function pickDrop(e, wrapId, val) {
  e.preventDefault();
  const inp = document.querySelector('#' + wrapId + ' .fi');
  if (inp) { inp.value = val; inp.dispatchEvent(new Event('input')); }
  closeDrop(wrapId);
}
```

Default ruangan: Ruang Tamu, Kamar Tidur Utama, Kamar Tidur 2, Kamar Tidur 3, Dapur, Kamar Mandi Utama, Kamar Mandi 2, Garasi, Teras, Gudang + dari data existing.

`rebuildDropLists()` dipanggil di awal `vForm()`.

### Field 2 — Kategori *
Sama dengan Field 1. Default: Dinding, Lantai, Atap / Plafon, Pintu / Jendela, Instalasi Listrik, Instalasi Air, Cat, Struktur.

### Field 3 — Tingkat Kerusakan *
3 tombol toggle. `min-height: 48px`.

```javascript
// BENAR — gunakan lookup object:
const sevClass = { Ringan: 'ar', Sedang: 'as', Parah: 'ap' };
// class: `sb ${f.severity === s ? sevClass[s] : ''}`
// SALAH — jangan expression chaining bersyarat yang menghasilkan class ganda
```

### Field 4 — Deskripsi *
Textarea `min-height: 100px`. Tip amber di bawah: sertakan ukuran area.

### Field 5 — Ukuran Area Rusak
Input text opsional.

### Field 6 — Kelas Material
3 tombol visual: Ekonomis (biru) | Menengah (amber, default) | Premium (ungu). Masing-masing punya icon, label, dan sub-teks.

### Field 7 — Catatan untuk Tukang/Kontraktor
Textarea `min-height: 80px`. Tombol `?` toggle tooltip gelap berisi 5 contoh penggunaan.

### Field 8 — Foto
📷 Kamera + 🖼️ Galeri (multiple). Kompres ke max 800px, quality 0.72. Tombol × hapus (min 28×28px).

---

## HALAMAN 3: DETAIL

- Foto scroll horizontal
- Badges: severity + ruangan + kategori + kelas material (dengan icon)
- Info: Deskripsi | Ukuran Area | Catatan Kontraktor
- Blok estimasi AI (ungu jika ada, dashed jika belum) + tombol "🔄 Perbarui"
- Tombol: ✏️ Edit | 🗑️ Hapus
- **Bug fix:** Gunakan `setTimeout(() => go('list'), 0)` jika item tidak ditemukan

---

## HALAMAN 4: AI ESTIMASI

### Sub-Tab: Per Item
List semua item → Bottom Sheet 3 langkah (copy prompt → buka AI → paste hasil).

### Sub-Tab: Gabungkan
Checklist ≥2 item → prompt gabungan dengan penghematan biaya → paste hasil → simpan ke tiap item (`combined: true`).

### Sub-Tab: Semua
Prompt semua item included → paste → simpan ke `S.globalAI` / `rv3_global`. Tampilkan hasil jika sudah ada.

---

## PROMPT AI — TEMPLATE

### Per Item
```
Kamu adalah konsultan renovasi rumah berpengalaman di [CITY].

DETAIL KERUSAKAN:
- Lokasi      : [room]
- Jenis       : [category]
- Tingkat     : [severity]
- Ukuran Area : [size, jika ada]
- Deskripsi   : [description]
- Catatan     : [notes, jika ada]

PREFERENSI MATERIAL: [teks kelas sesuai materialGrade]

REFERENSI HARGA [CITY] 2025-2026:
- Upah tukang harian: Rp 150.000–300.000/hari
- Borongan jasa saja: Rp 600.000–800.000/m²
- Borongan penuh ringan: Rp 500.000–800.000/m²
- Borongan penuh sedang: Rp 900.000–1.500.000/m²
- Borongan penuh besar/struktural: Rp 1.500.000–2.000.000/m²
- Cat tembok: Rp 50.000–200.000/m²
- Pasang keramik: Rp 150.000–500.000/m²
- Pasang/perbaiki atap: Rp 200.000–1.000.000/m²

Format output PERSIS:
## ANALISIS
---
## KEBUTUHAN MATERIAL
| Material | Merek / Tipe | Jumlah | Satuan | Harga Satuan | Total |
**Subtotal Material: Rp [jumlah]**
---
## JASA PENGERJAAN
| Pekerjaan | Volume | Satuan | Harga Satuan | Total |
**Subtotal Jasa: Rp [jumlah]**
---
**GRAND TOTAL: Rp [total]**
DURASI: [estimasi]
## CATATAN PENTING
```

### Prompt Gabungan
- List semua item terpilih + penghematan (mobilisasi 1x, material sekaligus)
- Tabel perbandingan: dikerjakan terpisah vs bersamaan + selisih penghematan

### Prompt Semua Item
- List semua item included
- Minta: Ringkasan Eksekutif → Urutan Prioritas → Estimasi per Area → Rekapitulasi → Tips Hemat

---

## MARKDOWN RENDERER

Fungsi `renderMD(raw)` tanpa library:
- Headers (`#`/`##`/`###`), bold, italic, code, hr, ul, ol
- Tabel dengan header gelap, baris genap, kolom terakhir kanan monospace
- `GRAND TOTAL` + Rp → `.total-line` (highlight merah, flex space-between)
- `Subtotal` / `Total Material` / `Total Jasa` + Rp → `.subtotal-line` (abu-abu)

---

## HALAMAN 5: LAPORAN

### Laporan Pemilik (HTML)
Header oranye + estimasi AI per item (background ungu) + analisis global.

### Instruksi Tukang (HTML)
Header hijau + checklist ringkasan + detail per item + foto besar. **Tanpa harga dan RAB.**

### Export RTF (`dlDocx()`)
File `.rtf` — bisa dibuka Word/Google Docs. **UI harus jelas menyebut ".rtf", bukan ".docx".**

---

## HALAMAN 6: SETELAN (TAB 4)

```css
/* WAJIB didefinisikan di CSS — dipakai di set-row */
.set-row-action { flex-shrink: 0; margin-left: 8px; }
```

Konten halaman Setelan (dalam `set-section` + `set-card`):

1. **Kota Renovasi** — input sync dengan `S.city`

2. **Backup & Transfer Data**
   - Export JSON: `{version, exportedAt, city, items, globalAI}` → `renovasi-backup-YYYY-MM-DD.json`
   - Import JSON: parse → merge (skip ID existing, tambah ID baru) → toast jumlah item baru

3. **Gabungkan Duplikat** (tampil hanya jika ada duplikat)
   ```javascript
   function findDuplicates() {
     // grup berdasarkan: room+category sama ATAU 30 char pertama desc sama
   }
   function mergeGroup(gi) {
     // skor: gambar×3 + panjang desc + estimasi×100
     // gabung images (deduplikasi by slice(0,100))
     // gabung notes dengan " | "
   }
   ```

4. **Install PWA** — banner install (jika `_installPrompt`) / instruksi manual / badge sudah install

5. **Tentang Aplikasi** — versi + statistik (kerusakan, estimasi, foto)

6. **Zona Berbahaya** — reset estimasi + hapus semua data

---

## BOTTOM SHEET

- Overlay `rgba(28,25,23,.6)`, sheet dari bawah, `border-radius: 20px 20px 0 0`
- `max-height: 92vh`, `overscroll-behavior: contain`, padding bottom `env(safe-area-inset-bottom)`
- **closeSheet:** `if(e && e.target !== $('ov')) return;`

---

## FORMAT ANGKA

```javascript
function fmt(n) {
  if (!n && n !== 0) return '—';
  if (n >= 1e9) return 'Rp ' + (n/1e9).toFixed(1) + ' M';
  if (n >= 1e6) return 'Rp ' + (n/1e6).toFixed(1) + ' jt';
  return new Intl.NumberFormat('id-ID', {style:'currency',currency:'IDR',minimumFractionDigits:0}).format(n);
}
```

---

## MOBILE UX — WAJIB

| Area | Spesifikasi |
|---|---|
| Semua tombol | `touch-action: manipulation; -webkit-tap-highlight-color: transparent` |
| Tombol nav/back | min 44×44px |
| Tombol utama | min-height 52px |
| Input/textarea | font-size 16px |
| Topbar padding-top | `calc(env(safe-area-inset-top, 0px) + 14px)` |
| Bottom nav padding-bottom | `env(safe-area-inset-bottom)` |
| FAB | `bottom: calc(env(safe-area-inset-bottom, 0px) + 72px); right: 16px` |
| FAB di ≥512px | `right: calc(50% - 240px + 16px)` |
| Body | `overscroll-behavior-y: contain` |

---

## BUG KRITIS YANG HARUS DIHINDARI

1. **Double submit** — WAJIB flag `_saving` + disable button.
2. **Datalist native** — pakai custom dropdown.
3. **Render loop** — `vDetail()` gunakan `setTimeout(()=>go('list'),0)`.
4. **Back button duplikat** — hapus existing `$('tb-back')` sebelum buat baru.
5. **Severity class ganda** — gunakan lookup object `{Ringan:'ar',Sedang:'as',Parah:'ap'}`.
6. **render() terlalu awal** — panggil `render()` SETELAH semua fungsi view terdefinisi.
7. **CSS set-row-action hilang** — wajib didefinisikan.
8. **Label .docx vs .rtf** — sesuaikan label UI dengan format file sebenarnya.
9. **closeSheet** — kondisi: `if(e && e.target !== $('ov')) return;`

---

## STATE UTAMA

```javascript
let S = {
  view: 'list',        // 'list'|'add'|'detail'|'ai'|'report'|'settings'
  items: load('rv3_items', []),
  globalAI: load('rv3_global', null),
  city: load('rv3_city', 'Bandung'),
  editingId: null, detailId: null, pasteFor: null,
  aiTab: 'item',       // 'item'|'combo'|'global'
  combineIds: [],
  form: blank()
};
```

---

## PWA FILES

### manifest.json
```json
{
  "name":"Renovasi Tracker","short_name":"Renovasi",
  "description":"Dokumentasi kerusakan rumah & estimasi biaya renovasi",
  "start_url":"./","scope":"./","display":"standalone",
  "orientation":"portrait","background_color":"#1C1917","theme_color":"#1C1917","lang":"id",
  "icons":[
    {"src":"icon-192.png","sizes":"192x192","type":"image/png","purpose":"any maskable"},
    {"src":"icon-512.png","sizes":"512x512","type":"image/png","purpose":"any maskable"}
  ]
}
```

### sw.js
```javascript
const CACHE = 'renovasi-v2';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', '<google-fonts-url>'];
// Install: Promise.allSettled agar satu gagal tidak blok lain + skipWaiting
// Activate: hapus cache lama + clients.claim()
// Fetch: cache-first, dinamis cache response valid, offline fallback ke index.html
```

---

## LINK AI GRATIS (4 chip, grid 2×2)

| Nama | Sub | Icon | URL | Tag |
|---|---|---|---|---|
| Gemini | Google | ✨ | https://gemini.google.com | Gratis |
| ChatGPT | OpenAI | 💬 | https://chat.openai.com | Gratis* |
| Claude | Anthropic | 🧠 | https://claude.ai | Gratis* |
| Copilot | Microsoft | 🪟 | https://copilot.microsoft.com | Gratis |

---

Hasilkan **satu file HTML lengkap**. Checklist wajib:
- [ ] Guard double-submit di `saveItem()`
- [ ] Custom dropdown (bukan datalist)
- [ ] Severity class via lookup object
- [ ] `render()` dipanggil setelah SEMUA fungsi view terdefinisi
- [ ] CSS `.set-row-action` didefinisikan
- [ ] 4 tab bottom nav (Kerusakan, AI, Laporan, Setelan)
- [ ] Export/Import JSON di Setelan
- [ ] Merge duplikat di Setelan
- [ ] Export RTF berlabel `.rtf`
- [ ] PWA manifest + service worker
- [ ] Touch target ≥44px, input font-size 16px

---

## CHANGELOG v2.1 (vs v2.0)

### Bug Fixes
1. **Toast `.ok` type** — kondisi ternary `isErr?'err':type==='ok'?'ok':''` tidak berfungsi benar. Fix: gunakan `const cls=isErr?'err':type==='ok'?'ok':'';` lalu append `' '+cls`.
2. **`clearGlobal()` tanpa toast** — tambahkan `toast('🗑️ Analisis global dihapus')` sebelum `render()`.
3. **Dead code `dupBlock`** — variabel dibuat tapi tidak dipakai di template return. Hapus variabel, gunakan inline template langsung.
4. **Empty `onchange=""`** pada checkbox duplikat di settings — hapus handler kosong atau ganti `disabled`.

### UX Improvements
5. **Empty state** — tambahkan tombol aksi langsung dan teks lebih deskriptif untuk pengguna awam.
6. **Statistik Parah** — stat tengah ganti dari "Diestimasi" ke "🔴 Parah" (lebih actionable untuk pemilik rumah).
7. **Validasi form** — setelah toast warning, tambahkan `.focus()` ke field yang kosong.
8. **Tombol Batal** — label ganti menjadi "← Batal, Kembali ke Daftar" agar lebih jelas.

### New Feature
9. **Export RTF** — fungsi `dlRTF()` menghasilkan file `.rtf` yang bisa dibuka di Word/Google Docs/LibreOffice. Tambahkan di halaman Laporan.

---

## EXPORT RTF — TAMBAHKAN KE HALAMAN LAPORAN

```html
<div style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:var(--r);padding:14px 16px;margin-bottom:12px">
  <div style="font-size:13px;font-weight:700;color:#0369A1;margin-bottom:4px">📝 Format RTF (Word/Google Docs)</div>
  <div style="font-size:12px;color:var(--ink2);margin-bottom:10px">File <strong>.rtf</strong> — bisa langsung dibuka di Microsoft Word, Google Docs, LibreOffice.</div>
  <button class="btn" style="border-color:#0369A1;color:#0369A1;background:none" onclick="dlRTF()">📝 Download File .RTF</button>
</div>
```

```javascript
function dlRTF(){
  if(!S.items.length){toast('⚠️ Belum ada data',true);return;}
  const city=S.city||'Kota';
  const date=new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});
  let rtf='{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0\\fswiss Plus Jakarta Sans;}}\n';
  rtf+='{\\colortbl;\\red194\\green65\\blue12;\\red120\\green113\\blue108;}\n';
  rtf+='\\pard\\qc\\b\\fs36 LAPORAN RENOVASI\\b0\\par\n';
  rtf+=`\\pard\\qc\\cf2 ${city} \\bullet ${date}\\cf0\\par\\par\n`;
  S.items.forEach((it,idx)=>{
    rtf+=`\\pard\\b ${idx+1}. ${it.room} \\emdash ${it.category}\\b0\\par\n`;
    rtf+=`\\pard Tingkat: ${it.severity}${it.size?' | '+it.size:''}\\par\n`;
    rtf+=`\\pard ${it.description}\\par\n`;
    if(it.notes)rtf+=`\\pard\\i Catatan: ${it.notes}\\i0\\par\n`;
    if(it.estimasi?.grand_total&&it.includeInAI!==false)
      rtf+=`\\pard\\cf1\\b Estimasi: ${fmt(it.estimasi.grand_total)}\\b0\\cf0\\par\n`;
    rtf+='\\pard\\par\n';
  });
  rtf+='}';
  const a=Object.assign(document.createElement('a'),{
    href:URL.createObjectURL(new Blob([rtf],{type:'application/rtf'})),
    download:`laporan-renovasi-${new Date().toISOString().slice(0,10)}.rtf`
  });
  a.click();URL.revokeObjectURL(a.href);
  toast('📝 File .RTF berhasil diunduh!',false,'ok');
}
```
