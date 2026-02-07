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
 - When deployed, the app no longer defaults to contacting `http://localhost:4000` (which triggers browser "local network" permission prompts). To connect to an external API, set the `VITE_API_BASE` environment variable in your deployment (for example `https://api.example.com`). If you run the mock locally with `npm run mock-api`, set `VITE_API_BASE=http://localhost:4000` for local testing.
- Minimal styling with CSS and MUI included (for future enhancement).
