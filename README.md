# 🧑‍💻 Online Proctoring System

A secure and scalable web platform for conducting online examinations with built-in proctoring features. Developed as a full stack application using **Django**, **Django REST Framework**, and **React.js**.

## 📌 About the Project

This system enables:
- **Admins** to create and manage tests, assign test takers, monitor logs, and review video footage.
- **Test takers** to attempt exams, submit answers, and view their scores in real time.

The project demonstrates a complete implementation of a real-time, secure online testing system, with REST APIs and a responsive frontend.

> 🗓️ **Project Duration:** January 2025 – March 2025  
> 👨‍💻 **Owner & Developer:** [Mohamed Yunus](mailto:mohamed.yunus0502@gmail.com)

## 🚀 Features

- Admin dashboard for test and user management  
- Video recording and activity logging for proctoring  
- Real-time test participation and scoring  
- REST API backend with authentication  
- Responsive React.js frontend  

## 🛠️ Technologies Used

- **Backend:** Django, Django REST Framework  
- **Frontend:** React.js, Material UI
- **Version Control:** Git, GitHub  

## 📁 Project Structure

```
Online-Proctoring-System/
├── backend/
│ ├── Django_project/
│ ├── blog/
│ ├── media/
│ ├── migrations/
│ ├── myproject/
│ ├── newapp/
│ ├── staticfiles/
│ ├── db.sqlite3
│ ├── manage.py
│ ├── requirements.txt
│ ├── runtime.txt
│ ├── yolov5s.pt
│ └── yolov5su.pt
├── frontend/
│ ├── public/
│ └── src/
├── .gitignore
├── README.md
├── package-lock.json
└── package.json

## ⚙️ Setup Instructions

```bash
# Backend setup
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend setup
cd ../frontend
npm install
npm start
