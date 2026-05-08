# ⚖️ Web Equality - RIKO Parts Internal System

<p align="left">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Algolia-003DFF?style=for-the-badge&logo=algolia&logoColor=white" />
</p>

An integrated product equality management system designed specifically for **Web Equality** operations. This application simplifies the mapping of relationships between items (*item equality*), catalog management, and real-time activity monitoring through a modern interface.

---

## 🛠️ Tech Stack

**Frontend:**
- **Framework:** React.js (Vite)
- **Styling:** CSS V3
- **State Management:** React Context API
- **Search Engine:** **Algolia Search** (High-performance product discovery)
- **Iconography:** Lucide React

**Backend:**
- **Runtime:** Node.js & Express
- **Cloud Service:** **Firebase Services** (Real-time Data Handling)
- **Authentication:** Firebase Auth & Firebase Admin SDK
- **Search Integration:** Algolia API Synchronization

---

## 🔍 Key Features & Documentation

### 1. Operational Dashboard
A summary of system activities and product statistics presented in an informative visual format.
<p align="center">
  <img src="frontend/public/assets/preview/activity.png" width="800" alt="Dashboard Activity"/>
</p>

### 2. Equality Products Management
The core feature to link products with equivalent specifications. Powered by **Algolia** to provide instant search results even with large product databases.
<p align="center">
  <img src="frontend/public/assets/preview/equal.png" width="800" alt="Equality List"/>
</p>

### 3. Product Data Processing
An intuitive interface for managing equality data with a seamless user experience using glassmorphism components.
<p align="center">
  <img src="public/assets/preview/add_equal.png" width="400" alt="Add Equality"/>
  <img src="frontend/public/assets/preview/edit_equal.png" width="400" alt="Edit Equality"/>
</p>

### 4. Sales Analysis
Tracking related sales data to ensure accurate stock synchronization across departments.
<p align="center">
  <img src="frontend/public/assets/preview/sales.png" width="800" alt="Sales Monitoring"/>
</p>

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (Version 18 or higher)
- Firebase Project & Service Account Key
- Algolia Application ID & Admin API Key

### Getting Started

**1. Setup Backend:**
```bash
cd backend
npm install
node app.js
```

**1. Setup Frontend:**
```bash
cd frontend
npm install
npm run dev
