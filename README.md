# MyShop 🛒

A full‑stack **MERN e-commerce platform** with an **ML-powered hybrid recommender system** (content-based + image-based).  
Designed as a **portfolio-ready, production-aware project** focusing on clean architecture, scalability, and deployment.

🔗 **Live Demo**: [https://myshop-76pn.onrender.com/]

---

## 🖼️ Screenshots

![Home Page](screenshots/home.png)
![Product Page](screenshots/product.png)
![Cart Page](screenshots/cart.png)
![Admin Dashboard](screenshots/admin-dashboard.png)
![Advanced Filter Demo](screenshots/filter-demo.gif)

---

## ✨ Key Features

### 🧩 Core E-Commerce

* Product CRUD with image uploads (Cloudinary)
* Category, brand, price, and rating support
* Shopping cart and checkout
* Secure backend (JWT + Refresh Token)
* PayPal Sandbox integration with webhook verification
* Full admin dashboard
* Responsive UI with React Bootstrap & Redux Toolkit
* MongoDB Atlas deployment

### 🤖 Hybrid Recommendation System

* Content-based embeddings (title, brand, category, metadata)
* Image-based embeddings (visual product similarity)
* FAISS vector indexing for efficient similarity search
* **Independent ML microservice (FastAPI)**, **separate repository**
* Currently **static embedding index**, with architecture supporting dynamic updates on product create/update/delete

---

## 🧠 System Architecture

Client (React)
      ↓
Node.js / Express API
      ↓──────────────→ MongoDB
      ↓
FastAPI (ML Service)
      ↓
MongoDB
      ↓
FAISS (Static Index)


* ML service is **decoupled from the main backend** (separate repo)
* Communication via HTTP (Axios)
* Clear separation between application logic and ML logic

---

## 🛠️ Tech Stack

### Frontend
* React
* Axios
* Redux Toolkit
* React Bootstrap

### Backend
* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT + Refresh Token Authentication
* PayPal Sandbox Integration

### Machine Learning Service
* FastAPI
* NumPy
* FAISS (CPU)
* Sentence Transformers (Text Embeddings)
* Torch / Torchvision (Image Embeddings)

### Deployment
* Render (Free Tier)
* MongoDB Atlas
* Cloudinary for image storage

---

## 📦 Repository Structure

myshop/
├── backend/ # MERN backend (API, DB, business logic)
├── frontend/ # React client
├── recommender/ # ML microservice (FastAPI, separate repo)
└── README.md

> ⚠️ Note: The recommender is in a separate repository and currently serves a static index, but the system supports dynamic updates.

---

## 🚀 Getting Started (Local)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/FatimaAhmadinejad/MyShop
cd MyShop

2️⃣ Backend Setup

cd backend
npm install
npm run dev

3️⃣ ML Service Setup (Separate Repo)

git clone https://github.com/FatimaAhmadinejad/Recommender
cd Recommender
pip install -r requirements.txt
python build_embeddings.py
uvicorn api:app --reload

🔮 Future Improvements

Fully dynamic embedding updates using event-driven pipelines

Real-time recommendations for new products

Cloud-based media storage for scalability

User notification system (SMS / Email)

Lightweight model optimization

Advanced hybrid ranking using user interactions

🎯 Project Motivation
This project was built as a portfolio-ready, application-focused system to demonstrate:

Real-world architectural decisions

Scalable full-stack design

Integration of ML into production-level applications

👩‍💻 Author
Fatemeh Ahmadinejad
Computer Engineering – Software Engineering

📄 License
For educational and portfolio purposes.
