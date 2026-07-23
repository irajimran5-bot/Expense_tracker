# SpendWise - Expense Tracker

SpendWise is a full-stack MERN (MongoDB, Express.js, React, Node.js) web application designed to help users efficiently track their daily expenses, manage their income, and visualize their spending habits through interactive charts.

🌐 **Live Demo:** [SpendWise on Vercel](https://spendwise-8uw56gzmb-irajimran5-bots-projects.vercel.app/)

---

## ✨ Features

* **User Authentication:** Secure registration and login functionality powered by JWT (JSON Web Tokens) and bcrypt password hashing.
* **Income Management:** Easily set and update total income with real-time balance recalculation.
* **Expense Tracking:** Add, edit, and delete transactions with custom categories (Food & Dining, Transport, Bills, Entertainment, Shopping, etc.).
* **Visual Analytics:** Interactive Donut charts (powered by Recharts) showing category-wise spending breakdowns with percentage calculations.
* **Search & Filters:** Instantly search transactions by title or filter them by category.
* **Responsive Design:** Clean, modern user interface styled with Tailwind CSS for seamless usage across all devices.

---

## 🛠️ Tech Stack

### Frontend

* **React.js** (with Vite)
* **Tailwind CSS** for styling
* **Recharts** for data visualization
* **Axios** for API requests
* **React Router** for navigation

### Backend

* **Node.js** & **Express.js**
* **MongoDB** & **Mongoose** for database management
* **JWT** for authentication middleware
* **Bcryptjs** for secure password hashing
* **CORS** & **Dotenv** for configuration

---

## 🚀 Getting Started Locally

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

* Node.js installed on your system
* MongoDB database instance (Local or Atlas URL)

### 1. Clone the Repository

```bash
git clone https://github.com/irajimran5/spendwise.git
cd spendwise

```

### 2. Backend Setup

Navigate to the backend directory, install dependencies, and configure your environment variables.

```bash
cd backend
npm install

```

Create a `.env` file in the backend root directory and add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

```

Start the backend server:

```bash
npm run dev

```

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install

```

Create a `.env` file in the frontend root directory if needed for your API base URL:

```env
VITE_API_URL=http://localhost:5000/api

```

Start the frontend development server:

```bash
npm run dev

```
