# Mini ERP - Offline First Retail Management System

A lightweight offline-first ERP system built for small retail shops to manage products, customers, sales, and inventory with automatic synchronization.

## Overview

This project is designed to work reliably even in unstable or disconnected network environments. The application stores data locally first and synchronizes changes with the remote server automatically when connectivity is restored.

The system includes:

* Product management
* Customer management
* Sales and invoice creation
* Inventory tracking
* Dashboard analytics
* Offline-first synchronization
* Automatic conflict handling
* Barcode scanning support

---

# Features

## Product Management

* Add, edit, delete, and view products
* Track stock quantities
* Barcode support for quick product lookup

## Customer Management

* Add and manage customer details
* Maintain purchase records linked to customers

## Sales & Billing

* Create invoices with multiple product items
* Automatic total calculation
* Automatic stock deduction after sales

## Dashboard

* Today's sales overview
* Inventory insights
* Low stock alerts

## Offline-First Architecture

* Fully functional without internet
* Local data persistence using IndexedDB
* Automatic sync when connectivity returns
* Optimistic UI updates

## Sync System

* Outbox pattern for offline writes
* Push/Pull synchronization
* Retry with backoff strategy
* Conflict resolution using last-write-wins

---

# Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* Zustand
* Dexie.js

## Backend

* Node.js
* Express.js

## Database

* PostgreSQL

## Authentication

* JWT Authentication

---

# Project Structure

```txt
mini-erp-offline-sync/
│
├── client/        # Frontend application
├── server/        # Backend API
├── docs/          # Documentation
└── README.md
```

---

# Getting Started

## Clone the Repository

```bash
git clone <repository-url>
cd mini-erp-offline-sync
```

---

# Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=your_postgres_connection_url
JWT_SECRET=your_secret
```

Run the backend:

```bash
npm run dev
```

---

# Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

# Offline Sync Flow

1. User actions are stored locally first
2. Changes are added to the outbox queue
3. Sync engine pushes pending changes to the server
4. Latest server updates are pulled automatically
5. Local database is updated after synchronization

---

# API Endpoints

```txt
POST   /sync/push
GET    /sync/pull
GET    /health
```

---

# Future Improvements

* Multi-shop support
* Advanced analytics
* Supplier management
* PWA installation support
* Receipt printing

---

