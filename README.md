# ⚖️ Web Equality - RIKO Parts Internal System

Sistem manajemen kesetaraan produk dan inventaris terintegrasi yang dirancang khusus untuk operasional **RIKO Parts Indonesia**. Aplikasi ini mempermudah pemetaan hubungan antar item (*item equality*), pengelolaan katalog produk, serta pemantauan data penjualan secara real-time.
<p align="left">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>
---

## 🛠️ Tech Stack

**Frontend:**
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS & Shadcn/UI (Dark Glassmorphism Theme)
- **State Management:** React Context API
- **Search Engine:** MeiliSearch Integration (Fast Search)
- **Iconography:** Lucide React

**Backend:**
- **Runtime:** Node.js & Express
- **Database:** PostgreSQL (Supabase Management)
- **Real-time:** PostgreSQL Listeners
- **Authentication:** Firebase Auth

---

## 🔍 Fitur Utama & Dokumentasi

### 1. Dashboard Operasional
Ringkasan aktivitas sistem dan statistik produk dalam format visual yang informatif.
<p align="center">
  <img src="public/assets/preview/activity.png" width="800" alt="Dashboard Activity"/>
</p>

### 2. Manajemen Kesetaraan (Equality Products)
Fitur inti untuk menghubungkan produk-produk yang memiliki spesifikasi setara. Dilengkapi dengan pencarian berbasis MeiliSearch untuk performa instan.
<p align="center">
  <img src="public/assets/preview/equal.png" width="800" alt="Equality List"/>
</p>

### 3. Pengolahan Data Produk
Halaman intuitif untuk menambah dan mengubah data kesetaraan dengan antarmuka berbasis modal yang bersih.
<p align="center">
  <img src="public/assets/preview/add_equal.png" width="400" alt="Add Equality"/>
  <img src="public/assets/preview/edit_equal.png" width="400" alt="Edit Equality"/>
</p>

### 4. Analisis Penjualan
Memantau tren penjualan produk terkait untuk sinkronisasi inventaris yang lebih akurat.
<p align="center">
  <img src="public/assets/preview/sales.png" width="800" alt="Sales Monitoring"/>
</p>

---

## ⚙️ Persiapan & Instalasi

### Prasyarat
- Node.js (Versi 18 ke atas)
- PostgreSQL Instance
- Firebase Project (untuk Autentikasi)

### Struktur Penting
1. **Frontend Env:** Konfigurasi `.env` di folder `frontend` untuk koneksi API dan Firebase.
2. **Backend Env:** Konfigurasi `.env` di folder `backend` untuk kredensial database dan MeiliSearch.

### Langkah Menjalankan Aplikasi

**1. Jalankan Backend:**
```bash
cd backend
npm install
node app.js
```

**2. Jalankan Frontend:**
```bash
cd frontend
npm install
npm run dev
