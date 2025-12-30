MyShop 🛒

A full-stack MERN e-commerce platform with an ML-powered hybrid recommender system (content-based + image-based).
Designed as a portfolio-ready, production-aware project with focus on clean architecture, scalability, and real-world deployment.

🔗 Live Demo: https://myshop-76pn.onrender.com/

🖼️ Screenshots










✨ Key Features
🧩 Core E-Commerce

Product CRUD with image uploads

Categories, brands, price & rating filters

Shopping cart & checkout flow

JWT authentication (access + refresh tokens)

PayPal Sandbox integration

Admin dashboard

Responsive UI (React Bootstrap)

MongoDB Atlas

🤖 Hybrid Recommendation System

Content-based embeddings (title, brand, category, metadata)

Image-based embeddings (visual similarity)

FAISS vector search

Independent ML microservice (FastAPI) in a separate repository

Currently static index, with architecture ready for dynamic updates

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


Architecture notes

Backend and ML service are fully decoupled

Both services connect independently to MongoDB

Backend communicates with ML service via HTTP

ML logic is isolated from application logic

🛠️ Tech Stack
Frontend

React

Redux Toolkit

Axios

React Bootstrap

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

PayPal Sandbox

Machine Learning Service

FastAPI

FAISS (CPU)

NumPy

Sentence Transformers

Torch / Torchvision

Deployment

Render (Free Tier)

MongoDB Atlas

📦 Repository Structure
myshop/
├── backend/        # Express API, DB logic, auth, routes
├── frontend/       # React client
├── recommender/    # ML microservice (separate repository)
└── README.md


⚠️ The recommender service lives in a separate repository and currently serves a static FAISS index.

🚀 Getting Started (Local)
1️⃣ Clone Main Repository
git clone https://github.com/FatimaAhmadinejad/MyShop
cd MyShop

2️⃣ Backend Setup
cd backend
npm install
npm run dev

3️⃣ Frontend Setup
cd frontend
npm install
npm start

4️⃣ ML Service Setup (Separate Repo)
git clone https://github.com/FatimaAhmadinejad/Recommender
cd Recommender
pip install -r requirements.txt
python build_embeddings.py
uvicorn api:app --reload

🔮 Future Improvements

Dynamic embedding updates on product create/update/delete

Event-driven sync between backend & ML service

Real-time personalized recommendations

Cloud image optimization

Advanced hybrid ranking using user interactions

🎯 Project Motivation

This project demonstrates:

Real-world full-stack architecture

Clean separation of concerns

Practical ML integration in production systems

Scalable, deployment-ready design

👩‍💻 Author

Fatemeh Ahmadinejad
Computer Engineering – Software Engineering

📄 License

For educational and portfolio purposes only.
