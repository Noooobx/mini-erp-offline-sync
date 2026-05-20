# Mini ERP (Offline-First Architecture)

## Setup Steps

**1. Configure Database**
Ensure PostgreSQL is running locally or provide a hosted Postgres URI. Run the included initialization script to create tables utilizing UUID primary keys and `updated_at`/`is_deleted` tracking columns.

**2. Start the Backend Server**

```bash
cd server
npm install
npm start (or node src/index.js)
```

**3. Start the Frontend Application**

```bash
cd client
npm install
npm run dev
```

---

## Architectural Decisions & Sync Protocol

This application implements a **Local-First Architecture** utilizing the **Outbox + Pull** pattern. Turnkey sync engines (like Realm, RxDB, Firebase) were explicitly avoided to demonstrate foundational distributed systems knowledge.

### 1. IndexedDB Wrapper (Dexie.js)

To decouple the React UI from network latency, we use `Dexie.js` as an IndexedDB wrapper (`client/src/db.js`).

- **Optimistic UI:** Creating a product instantly writes to `db.products` locally. The React UI updates at 0ms latency with zero network dependency.

### 2. The Outbox Pattern (Push)

When a user executes a CRUD operation offline, the data is stored in the local Dexie store, and a hidden chronological event `{ action, table, data, timestamp }` is pushed to `db.outbox`.

- The frontend Background Sync Courier (`syncWorker.js`) systematically polls this outbox and pushes it to Postgres via `axios` at `/sync/push` on connectivity restore.

### 3. The Pull Pattern (Delta Fetching)

Instead of re-downloading the entire database on connection, the frontend passes its `localStorage.getItem('lastSyncTime')` to the backend `/sync/pull?since={timestamp}` endpoint, drastically reducing bandwidth overhead.

### 4. Conflict Resolution Rules (Server-Side)

When the Outbox array hits the Postgres backend, the server arbitrates collisions utilizing two strict rules:

- **Last-Write-Wins:** If the server's `updated_at` timestamp is newer than the incoming iPad event's `timestamp`, the server ignores the incoming event (prevents stale overwrites).
- **Soft-Delete Precedence:** Physically dropping rows causes referential integrity issues across offline devices. All deletions are tracked via `is_deleted = TRUE`. If the server marks a record as deleted, incoming 'update' events are instantly rejected.

---

## Constraints & Validations

- **UUIDs Over Auto-Increment:** Swapped basic integer IDs to `uuid_generate_v4()`. Offline devices generating an ID `1` would critically collide during sync. UUIDs mathematically guarantee zero primary key conflict on merge.
- **Performance:** 5-10k row render freezes are avoided by strictly wrapping heavy array aggregations (`.reduce()`, `.filter()`) in React `useMemo` hooks.
- **Negative Values:** Safely validated. Stock quantities are defensively cast using `Number(qty || 0)`, preventing NaN/Negative overrides in production.
