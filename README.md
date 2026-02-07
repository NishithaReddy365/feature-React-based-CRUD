# React Schema-driven CRUD

This is a small React + TypeScript CRUD demo that uses a schema-driven form so new fields can be added with minimal code changes.

Quick start

1. Install dependencies:

```bash
npm install
```

2. Start the mock API (in a separate terminal):

```bash
npm run mock-api
```

3. Start the dev server:

```bash
npm run dev
```

Open http://localhost:5173 and the mock API runs at http://localhost:4000

How to add new fields

- Edit `src/App.tsx` and add a new entry into the `schema` array. Example:

```ts
{ name: 'dob', label: 'Date of Birth', type: 'date', required: false }
```

The `UserForm` reads the schema and will render the new field automatically. The backend (JSON-server) will store any additional properties.

Assumptions / design decisions

- Uses a schema-driven `UserForm` so adding fields is a one-line change to the `schema` array.
- Uses `json-server` as a mock API; replace `VITE_API_BASE` to point to a real API if provided.
- Minimal styling with CSS and MUI included (for future enhancement).
