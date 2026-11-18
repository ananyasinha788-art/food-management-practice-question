import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

const foodItems = [
  { itemId: 1, itemName: "Veg Burger", price: 120 },
  { itemId: 2, itemName: "Paneer Pizza", price: 350 },
  { itemId: 3, itemName: "Masala Dosa", price: 100 },
  { itemId: 4, itemName: "Cold Coffee", price: 90 }
];

const placedOrders = [];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data, null, 2));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1e6) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON request body."));
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const route = url.pathname;

  if (req.method === "GET" && route === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Food Order Management</title></head>
<body>
  <h1>Welcome to Online Food Order Management</h1>
  <p>Use <a href="/menu">/menu</a> to view available food items.</p>
  <p>Visit <a href="/about">/about</a> for application information or <a href="/home">/home</a> for the home page.</p>
</body>
</html>`);
    return;
  }

  if (req.method === "GET" && route === "/menu") {
    sendJson(res, 200, foodItems);
    return;
  }

  if (req.method === "GET" && route === "/about") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>About</h1><p>This application demonstrates online food ordering using Node.js HTTP, FS and Express modules.</p>");
    return;
  }

  if (req.method === "GET" && route === "/home") {
    const indexPath = path.join(__dirname, "public", "index.html");
    fs.readFile(indexPath, "utf8", (error, html) => {
      if (error) {
        sendJson(res, 500, { message: "Unable to read the home page." });
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
    return;
  }

  if (req.method === "POST" && route === "/place-order") {
    try {
      const order = await readRequestBody(req);
      const requiredFields = ["orderId", "customerName", "itemName", "quantity"];
      const missingFields = requiredFields.filter(field =>
        order[field] === undefined || order[field] === null || order[field] === ""
      );

      if (missingFields.length > 0) {
        sendJson(res, 400, { message: "Missing required order details.", missingFields });
        return;
      }
      if (!Number.isInteger(Number(order.orderId)) ||
          !Number.isInteger(Number(order.quantity)) || Number(order.quantity) <= 0) {
        sendJson(res, 400, { message: "orderId and quantity must be valid integers; quantity must be greater than zero." });
        return;
      }

      const newOrder = {
        orderId: Number(order.orderId),
        customerName: String(order.customerName).trim(),
        itemName: String(order.itemName).trim(),
        quantity: Number(order.quantity)
      };
      if (!newOrder.customerName || !newOrder.itemName) {
        sendJson(res, 400, { message: "customerName and itemName cannot be empty." });
        return;
      }
      placedOrders.push(newOrder);
      sendJson(res, 201, { message: "Order placed successfully.", order: newOrder });
    } catch (error) {
      sendJson(res, 400, { message: error.message });
    }
    return;
  }

  sendJson(res, 404, { message: "Route not found." });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
