# Bangalore Pincode Explorer

A small full-stack web application that maps a Bangalore pincode to its area/post-office names.

## Features

- Search any 6-digit Bangalore pincode beginning with `56`.
- Express backend exposes REST endpoints under `/api`.
- Live postal lookup through the public India Post pincode API.
- Bangalore-focused filtering plus a small fallback dataset for resilience.
- Responsive, polished UI with validation, loading and error states.
- No frontend framework required; easy to run and deploy.

## Tech Stack

- **Frontend:** HTML, CSS, vanilla JavaScript
- **Backend:** Node.js, Express
- **Data:** India Post public pincode API + local fallback data

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:3000`.

For development with Node 18+:

```bash
npm run dev
```

## API

### `GET /api/pincodes/:pincode`

Example: `GET /api/pincodes/560001`

Returns matching Bangalore post-office records and metadata.

### `GET /api/pincodes`

Returns the built-in fallback dataset.

### `GET /api/health`

Simple health check.

## Project structure

```text
bangalore-pincode-explorer/
├── public/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── server.js
├── package.json
├── .gitignore
└── README.md
```

## Deployment

The app can be deployed to any Node.js host that supports an Express server. Set `PORT` if the platform provides its own port.

## Notes

The India Post endpoint is an external public service, so the app includes a local fallback dataset for common Bangalore pincodes. Postal data may change over time and should be treated as lookup data rather than an official address-verification source.

## Author

Honey Chandragiri
