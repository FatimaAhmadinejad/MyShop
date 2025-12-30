# MyShop 🛒

A full-stack **MERN e-commerce platform** with an **ML-powered hybrid recommender system** (content-based + image-based).  
Designed as a **portfolio-ready, production-aware project** with a focus on clean architecture, scalability, and real-world deployment.

🔗 **Live Demo**: https://myshop-76pn.onrender.com/

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
- Product CRUD with image uploads
- Category, brand, price, and rating filters
- Shopping cart and checkout flow
- Secure authentication (JWT + Refresh Token)
- PayPal Sandbox integration with webhook verification
- Admin dashboard
- Responsive UI (React Bootstrap + Redux Toolkit)
- MongoDB Atlas integration

### 🤖 Hybrid Recommendation System
- Content-based embeddings (title, brand, category, metadata)
- Image-based embeddings (visual similarity)
- FAISS vector indexing for fast similarity search
- Independent ML microservice built with FastAPI
- Static embedding index (architecture supports dynamic updates)

---

🧠 System Architecture
flowchart LR
    A[Client<br/>React] --> B[Node.js / Express API]

    B --> C[(MongoDB Atlas)]

    B --> D[FastAPI ML Service]
    D --> C
    D --> E[FAISS Vector Index]

    subgraph ML Service
      D
      E
    end

Architecture Notes

Backend and ML service are fully decoupled

Communication between services happens via HTTP

Both backend and ML service connect independently to MongoDB

Current recommender uses a static index, but supports dynamic updates on product lifecycle events

🛠️ Tech Stack
Frontend

React

Redux Toolkit

Axios

React Bootstrap

Backend

Node.js

Express.js

MongoDB (Mongoose)

JWT + Refresh Token Authentication

PayPal Sandbox

Machine Learning Service

FastAPI

NumPy

FAISS (CPU)

Sentence Transformers

Torch / Torchvision

Deployment

Render (Free Tier)

MongoDB Atlas

Cloudinary (image storage)

📦 Repository Structure
myshop/
├── backend/        # Node.js / Express API
├── frontend/       # React client
├── recommender/    # ML microservice (separate repository)
└── README.md


⚠️ The recommender service is maintained in a separate repository.

🚀 Getting Started (Local)
1️⃣ Clone Repository
git clone https://github.com/FatimaAhmadinejad/MyShop
cd MyShop

2️⃣ Frontend Setup
cd frontend
npm install
npm start

3️⃣ Backend Setup
cd backend
npm install
npm run dev


4️⃣ ML Service Setup (Separate Repo)
git clone https://github.com/FatimaAhmadinejad/Recommender
cd Recommender
pip install -r requirements.txt
python build_embeddings.py
uvicorn api:app --reload


🔮 Future Improvements

Fully dynamic embedding updates (event-driven)

Real-time recommendations for new products

Advanced hybrid ranking using user interaction signals

Model optimization and inference latency reduction

Notification system (Email / SMS)

🎯 Project Motivation

This project was built to demonstrate:

Real-world system architecture

Scalable full-stack application design

Practical integration of machine learning into production systems

👩‍💻 Author

Fatemeh Ahmadinejad
Computer Engineering – Software Engineering

📄 License
For educational and portfolio purposes.

Copy code

