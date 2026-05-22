# Mini ERP (Offline-First Architecture)

## Setup Steps

**1. Configure Environment Variables**
In the `/server` directory, create a `.env` file with your PostgreSQL connection string and JWT authentication secret:

```
DATABASE_URL=postgresql://user:password@localhost:5432/erp
JWT_SECRET=your_super_secret_key_here
PORT=5000
```

**2. Configure Database & Migrations**
Ensure PostgreSQL is running. Run the included initialization and migration scripts to create tables utilizing UUID primary keys, user accounts, and `updated_at`/`is_deleted` tracking columns.

```bash
cd server
node src/db/migrate.js           # Initial schema
node src/db/migrate_multishop.js # Multi-tenant upgrades
```

**3. Start the Backend Server**

```bash
cd server
npm install
npm start
```

**4. Start the Frontend Application**

```bash
cd client
npm install
npm run dev
```

---

## Architectural Decisions & Sync Protocol

This application implements a **Local-First Architecture** utilizing the **Outbox + Pull** pattern. Turnkey sync engines (like Realm, RxDB, Firebase) were explicitly avoided to demonstrate foundational distributed systems knowledge.

### 1. Multi-Tenant SaaS Isolation (Auth & JWT)

Users register dedicated "Shops". All API requests carry encrypted JSON Web Tokens (JWT) validating their identity. The PostgreSQL backend cryptographically enforces that Shop A cannot query, update, or sync any data belonging to Shop B at a strict Row-Level utilizing `shop_id`.

### 2. IndexedDB Wrapper (Dexie.js)

To decouple the React UI from network latency, we use `Dexie.js` as an IndexedDB wrapper (`client/src/db.js`). Creating a product or processing an invoice instantly writes to the local device. The React UI updates at 0ms latency with zero network dependency.

### 3. The Outbox Pattern (Push)

When a user executes a CRUD operation offline, the data is stored locally, and a hidden chronological event `{ action, table, data, timestamp }` is pushed to `db.outbox`. The frontend Background Sync Courier (`syncWorker.js`) systematically polls this outbox and pushes it to Postgres via `axios` at `/sync/push` upon connectivity restore.

### 4. The Pull Pattern (Delta Fetching)

Instead of re-downloading the entire database on connection, the frontend passes its `localStorage.getItem('lastSyncTime')` to the backend `/sync/pull?since={timestamp}` endpoint. This differential fetch drastically reduces bandwidth overhead.

### 5. Conflict Resolution Rules (Server-Side)

When the Outbox array hits the Postgres backend, the server arbitrates collisions utilizing two strict rules:

- **Last-Write-Wins:** If the server's `updated_at` timestamp is newer than the incoming offline event's timestamp, the server ignores the incoming event to prevent stale overwrites.
- **Soft-Delete Precedence:** Physically dropping rows causes referential integrity issues across offline devices. All deletions are tracked via `is_deleted = TRUE`. If the server marks a record as deleted, incoming 'update' events are instantly rejected.

---

## Constraints, Security & Validations

- **Strict Input Validation:** To prevent database corruption and logic errors, the `product.service.js` and `sync.service.js` core endpoints structurally enforce valid numerical data. Any attempt to sync a negative price, negative total_amount, or zero-qty stock results in an intercepted Node.js Error which securely rolls back that specific malicious queue event without breaking the larger synchronization loop.
- **Data Sweeping on Logout:** When a user explicitly logs out, the frontend triggers `db.delete()` to entirely wipe the IndexedDB. This prevents cross-tenant data leakage if another manager logs into the same physical device.
- **UUIDs Over Auto-Increment:** Swapped basic integer IDs to `uuid_generate_v4()`. Offline devices generating an ID `1` would critically collide during sync. UUIDs mathematically guarantee zero primary key conflict on merge.
- **Performance:** Rendering massive tables is handled through strict 10-item-per-page UI pagination arrays. Dashboard calculations (`inStockCount`, `inventoryValue`, etc.) are heavily wrapped in React `useMemo` hooks to prevent React from hanging during array loops.
- **Client-Side PDF Generation (Bonus):** Rather than straining the backend server with PDF buffer processing, the Sales History Ledger utilizes `html2canvas` and `jsPDF` to parse the localized DOM elements and snapshot physical receipt boundaries directly on the user's processor.

---

## Database Schema

The core relational architecture securely separates multi-tenant shops and maintains referential integrity even upon deletion using `is_deleted` flags.

```mermaid
erDiagram
    users ||--o{ shops : owns
    shops ||--o{ products : contains
    shops ||--o{ customers : contains
    shops ||--o{ sales : generates

    users {
        uuid id PK
        string username
        string password
    }

    shops {
        uuid id PK
        string name
        uuid owner_id FK
    }

    products {
        uuid id PK
        string name
        string barcode
        numeric price
        integer stock_qty
        boolean is_deleted
        uuid shop_id FK
    }

    customers {
        uuid id PK
        string name
        string phone
        string address
        boolean is_deleted
        uuid shop_id FK
    }

    sales {
        uuid id PK
        uuid customer_id FK "nullable"
        uuid user_id FK
        uuid shop_id FK
        numeric total_amount
        timestamp created_at
    }

    sale_items {
        uuid id PK
        uuid sale_id FK
        uuid product_id FK
        integer quantity
        numeric unit_price
        numeric subtotal
    }

    sales ||--|{ sale_items : contains
    products ||--o{ sale_items : referenced_by
```
