# MT1-LABEXAM — Online Food Order Management

This project follows the supplied Full Stack Development lab examination brief.

## Project structure

```text
MT1-LABEXAM/
├── package.json
├── httpServer.js
├── expressApp.js
├── public/
│   └── index.html
└── screenshots/
    └── .gitkeep
```

## Requirements

- Node.js (LTS recommended)
- npm

## Install dependencies

Open a terminal in this folder and run:

```bash
npm install
```

## Part A — Node.js HTTP + FS server

Run:

```bash
node httpServer.js
```

Server URL: `http://localhost:3000`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Welcome page in HTML |
| GET | `/menu` | Food items in JSON |
| GET | `/about` | Application information |
| GET | `/home` | Reads and serves `public/index.html` using `fs` |
| POST | `/place-order` | Validates and stores an order in an array |

Example POST body for `/place-order`:

```json
{
  "orderId": 1,
  "customerName": "Neha Verma",
  "itemName": "Paneer Pizza",
  "quantity": 1
}
```

## Part B — Express REST API

Open a second terminal in this folder and run:

```bash
node expressApp.js
```

Server URL: `http://localhost:4000`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/orders` | Get all orders |
| GET | `/orders/:id` | Get one order |
| POST | `/orders` | Create an order (201) |
| PUT | `/orders/:id` | Update an order |
| DELETE | `/orders/:id` | Delete an order |

Example POST body:

```json
{
  "orderId": 4,
  "customerName": "Neha Verma",
  "itemName": "Paneer Pizza",
  "quantity": 1,
  "status": "Pending",
  "totalAmount": 350
}
```

Example PUT body for `/orders/1`:

```json
{
  "customerName": "Aarav Sharma",
  "itemName": "Veg Burger",
  "quantity": 3,
  "status": "Preparing",
  "totalAmount": 360
}
```

All request bodies for the Express API should be sent as raw JSON with the
`Content-Type: application/json` header.

## EchoAPI / Postman testing

Test these URLs while the Express server is running:

- `GET http://localhost:4000/orders`
- `GET http://localhost:4000/orders/1`
- `POST http://localhost:4000/orders`
- `PUT http://localhost:4000/orders/1`
- `DELETE http://localhost:4000/orders/1`

The `screenshots/` folder is intentionally provided for your own screenshots
of the running servers, `/home` page, API requests/responses, and GitHub commit
history. No screenshots are fabricated or included.

## GitHub submission

Create a repository named `MT1-LABEXAM`, then from this folder run:

```bash
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

After completing/testing modules, commit meaningful updates, for example:

```bash
git add .
git commit -m "Implement Node.js HTTP server and FS routing"
git push
git add .
git commit -m "Add Express food order CRUD APIs"
git push
```
