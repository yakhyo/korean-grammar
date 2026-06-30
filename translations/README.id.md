# KIIP Grammar &amp; Vocabulary

[English](../README.md) · [Oʻzbekcha](README.uz.md) · [Русский](README.ru.md) · **Bahasa Indonesia**

Kumpulan referensi belajar mandiri untuk kurikulum bahasa Korea **Program Imigrasi dan Integrasi Korea (KIIP / 사회통합프로그램)**.

🔗 **Situs langsung:** https://yakhyo.github.io/korean-grammar/

## Daftar Isi

| Tingkat | Buku | Fokus |
|-------|------|--------|
| Tingkat 1 | 한국어와 한국문화 초급 1 | Pemula — Hangul, partikel inti, akhiran kata kerja dasar |
| Tingkat 2 | 한국어와 한국문화 초급 2 | Pemula Lanjut — konjungsi, kondisi, klausa relatif |
| Tingkat 3 | 한국어와 한국문화 중급 1 | Menengah — kalimat tidak langsung, dugaan, lampiran konjugasi |
| Tingkat 4 | 한국어와 한국문화 중급 2 | Menengah Atas — topik kemasyarakatan, tata bahasa abstrak |
| Tingkat 5 | 한국사회 이해 (기본·심화) | Memahami Masyarakat Korea — panduan kewarganegaraan |

## Fitur

- 🌐 **Pengalih bahasa** — menu pada setiap halaman untuk beralih antara bahasa Inggris, Uzbek, Rusia, dan Indonesia; teks Korea tetap, hanya penjelasan dan terjemahan yang berubah.
- 🧭 **Pengalih tingkat** — menu pada setiap halaman untuk langsung melompat ke tingkat mana pun (atau ke beranda) tanpa perlu kembali.
- 🌗 **Mode gelap / terang** — tombol pada setiap halaman, diingat antar kunjungan dan secara bawaan mengikuti pengaturan sistem Anda.
- ⭐ **Tombol bintang** — pranala cepat untuk memberi bintang pada proyek di GitHub.
- 🖨️ **Siap cetak** — saat mencetak (atau menyimpan ke PDF) selalu memakai tema terang agar hasilnya rapi, bahkan dalam mode gelap.
- 📦 **Tanpa build, tanpa dependensi** — HTML biasa + satu berkas CSS bersama, berfungsi luring (offline).

## Tentang

- Gaya tampilan disimpan dalam dua lembar gaya bersama (`assets/home.css` untuk halaman beranda, `assets/levels.css` untuk setiap halaman tingkat); setiap halaman tingkat memilih warna aksennya melalui kelas `html.lv1…lv5`. Halaman tetap berfungsi luring dan tercetak rapi ke PDF (`Ctrl`/`Cmd` + `P`).
- Tingkat 1–4 mengikuti edisi buku teks KIIP terkini; daftar kosakata merupakan referensi tematik yang diperluas, bukan salinan kata per kata dari daftar kata tiap pelajaran.
- Setiap poin tata bahasa dilengkapi **empat contoh kalimat** untuk menunjukkan polanya dalam berbagai konteks.
- Tingkat 5 mencakup kursus *Memahami Masyarakat Korea*.
- Edisi Uzbek, Rusia, dan Indonesia adalah terjemahan lengkap dari penjelasan, contoh, dan kosakata; teks Korea-nya sendiri sama persis dalam keempat bahasa.

## Struktur proyek

```
.
├── docs/                       # Situs yang dipublikasikan — GitHub Pages menyajikan folder ini
│   ├── index.html              # Pengalihan → /en/ (titik masuk netral bahasa)
│   ├── en/                     # Inggris — index.html (→ /en/) + level-1/ … level-5/ (→ /en/level-1/ …)
│   ├── uz/                     # Uzbek — index.html (→ /uz/) + level-1/ … level-5/ (→ /uz/level-1/ …)
│   ├── ru/                     # Rusia (tata letak sama seperti uz/)
│   ├── id/                     # Indonesia (tata letak sama seperti uz/)
│   ├── level-1/ … level-5/     # Stub pengalihan → /en/level-N/ (untuk URL Inggris lama)
│   ├── assets/                 # Lembar gaya bersama dan gambar pratinjau media sosial
│   │   ├── home.css            # Halaman beranda
│   │   ├── levels.css          # Halaman tingkat (aksen melalui kelas html.lvN)
│   │   └── og-image*.png       # Gambar pratinjau media sosial per bahasa
│   ├── sitemap.xml             # Daftar URL dengan alternatif hreflang
│   └── .nojekyll               # Menyajikan berkas apa adanya di GitHub Pages
├── tools/                      # Skrip pemeliharaan (tanpa dependensi)
│   └── check-korean-sync.mjs   # Memverifikasi Korea cocok di EN/UZ/RU/ID
├── translations/               # Terjemahan README (uz · ru · id)
└── README.md                   # Berkas ini (Inggris)
```

## Menjalankan secara lokal

Tidak ada tahap build — jalankan server untuk folder `docs/`:

```bash
python3 -m http.server 8000 --directory docs
# lalu buka http://localhost:8000
```

## Lisensi

Untuk pelajar Program Integrasi Sosial. Bebas digunakan untuk pembelajaran pribadi.
