# Cosmos Odyssey

Welcome to Cosmos Odyssey! 🎉 This is a full-stack web application that fetches and stores the best solar system flight deals, letting you search routes, filter companies, and reserve your journey with ease.

## Features

- Fetch and store only the latest 15 solar system pricelists from an external API.
- Display flight legs with filtering (by company) and sorting (price, travel time).
- Combine legs into route options from planet to planet.
- Make reservations with user details, total price, travel time, and company names.
- Responsive UI built with React and TypeScript.
- Node.js, Express, and Prisma backend connected to MongoDB.

---

## Project Structure

```plaintext
Cosmos-Odyssey/
│
├── api/                 # Backend code
│   ├── prisma/          # Prisma schema file
│   ├── src/
│   │   ├── controllers/ # API controllers
│   │   ├── lib/         # Database connection (Prisma client)
│   │   ├── routes/      # API routes
│   │   ├── services/    # Service functions
│   │   ├── types/       # TypeScript types
│   │   ├── app.ts       # Entry point for the backend
│   │   └── .env         # Backend environment variables
│   │
│   ├── .env             # Frontend environment variables
│   └── package.json     # Frontend dependencies
│
├── client/
│   ├── public/          # Images and assets
│   ├── src/
│   │   ├── components/  # Reusable components (e.g., Header, Button)
│   │   ├── hooks/       # Custom hooks
│   │   ├── routes/      # Pages (e.g., prices, reservations)
│   │   ├── services/    # Service functions
│   │   ├── styles/      # Global style files
│   │   ├── types/       # TypeScript types
│   │   ├── App.tsx      # Root Component
│   │   └── main.tsx     # Entry point for the frontend
│   │
│   ├── .env             # Frontend environment variables
│   └── package.json     # Frontend dependencies
│
└── README.md            # Project overview
```

## Technologies Used

### Frontend

- React with TypeScript
- Vite for fast development
- SCSS for styling
- Axios for API calls

### Backend

- Node.js with TypeScript
- Express for API routing
- Prisma as an ORM
- MongoDB for the database
- dotenv for environment variable management

---

## Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/mjarviste/Cosmos-Odyssey.git
cd Cosmos-Odyssey
```

### 2.Set Up MongoDB:

1. Go to MongoDB Atlas and create a free cluster.
2. Create a database named cosmos-odyssey (or your preferred name).
3. Add a user with access credentials.
4. Whitelist your IP address or allow access from anywhere (0.0.0.0/0) for testing purposes.

### 3. Backend Setup

- Navigate to the `api` directory:

```bash
cd api
```

- Install dependencies:

```bash
npm install
```

- Create .env file:

```bash
touch .env
```

- Set up the .env files:

```bash
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
COSMOS_ODYSSEY_API_URL="https://cosmosodyssey.azurewebsites.net/api/v1.0/TravelPrices"
CLIENT_URL=http://localhost:5173
```

Replace `<username>`, `<password>`, `<cluster-name>`, and `<database-name>` with your MongoDB details.

- Run the Prisma migration:

```bash
npx prisma db push
```

- Start the backend:

```bash
npm run dev
```

The backend will be running at http://localhost:3000.

### 4. Frontend Setup

- Navigate to the `client` directory:

```bash
cd client
```

- Install dependencies:

```bash
npm install
```

- Create .env file:

```bash
touch .env
```

- Set up the .env file:

```bash
VITE_API_URL=http://localhost:3000
```

- Start the frontend development server:

```bash
npm run dev
```

The frontend will be running at http://localhost:5173.

## Future Improvements

- Add tests for the project
- Implement authentication for secure access.
- Improve error handling and validation.
- Improve UI/UX design

Thanks for checking out this project! Feel free to reach out with any questions.
