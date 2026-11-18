import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json());

let orders = [
  {
    orderId: 1,
    customerName: "Aarav Sharma",
    itemName: "Veg Burger",
    quantity: 2,
    status: "Pending",
    totalAmount: 240
  },
  {
    orderId: 2,
    customerName: "Diya Singh",
    itemName: "Masala Dosa",
    quantity: 1,
    status: "Preparing",
    totalAmount: 100
  },
  {
    orderId: 3,
    customerName: "Kabir Verma",
    itemName: "Cold Coffee",
    quantity: 2,
    status: "Delivered",
    totalAmount: 180
  }
];

function validateOrder(body, isUpdate = false) {
  const requiredFields = ["customerName", "itemName", "quantity", "status", "totalAmount"];
  if (!isUpdate && body.orderId === undefined) return "orderId is required.";
  for (const field of requiredFields) {
    if (!isUpdate && (body[field] === undefined || body[field] === null || body[field] === "")) {
      return `${field} is required.`;
    }
    if (isUpdate && body[field] !== undefined && body[field] === "") {
      return `${field} cannot be empty.`;
    }
  }
  if (body.quantity !== undefined &&
      (!Number.isInteger(Number(body.quantity)) || Number(body.quantity) <= 0)) {
    return "quantity must be a positive integer.";
  }
  if (body.totalAmount !== undefined &&
      (!Number.isFinite(Number(body.totalAmount)) || Number(body.totalAmount) < 0)) {
    return "totalAmount must be a non-negative number.";
  }
  return null;
}

// GET /orders - retrieve all orders
app.get("/orders", (req, res) => {
  res.status(200).json(orders);
});

// GET /orders/:id - retrieve one order
app.get("/orders/:id", (req, res) => {
  const order = orders.find(item => item.orderId === Number(req.params.id));
  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }
  res.status(200).json(order);
});

// POST /orders - create an order
app.post("/orders", (req, res) => {
  const error = validateOrder(req.body);
  if (error) return res.status(400).json({ message: error });

  const orderId = Number(req.body.orderId);
  if (!Number.isInteger(orderId)) {
    return res.status(400).json({ message: "orderId must be an integer." });
  }
  if (orders.some(item => item.orderId === orderId)) {
    return res.status(409).json({ message: "An order with this orderId already exists." });
  }

  const newOrder = {
    orderId,
    customerName: String(req.body.customerName).trim(),
    itemName: String(req.body.itemName).trim(),
    quantity: Number(req.body.quantity),
    status: String(req.body.status).trim(),
    totalAmount: Number(req.body.totalAmount)
  };
  if (!newOrder.customerName || !newOrder.itemName || !newOrder.status) {
    return res.status(400).json({ message: "Text fields cannot be empty." });
  }

  orders.push(newOrder);
  res.status(201).json({ message: "Order placed successfully", order: newOrder });
});

// PUT /orders/:id - update an order
app.put("/orders/:id", (req, res) => {
  const order = orders.find(item => item.orderId === Number(req.params.id));
  if (!order) return res.status(404).json({ message: "Order not found." });

  const error = validateOrder(req.body, true);
  if (error) return res.status(400).json({ message: error });

  const allowedFields = ["customerName", "itemName", "quantity", "status", "totalAmount"];
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      order[field] = ["quantity", "totalAmount"].includes(field)
        ? Number(req.body[field])
        : String(req.body[field]).trim();
    }
  }
  if (!order.customerName || !order.itemName || !order.status) {
    return res.status(400).json({ message: "Text fields cannot be empty." });
  }
  res.status(200).json({ message: "Order updated successfully.", order });
});

// DELETE /orders/:id - delete an order
app.delete("/orders/:id", (req, res) => {
  const orderIndex = orders.findIndex(item => item.orderId === Number(req.params.id));
  if (orderIndex === -1) {
    return res.status(404).json({ message: "Order not found." });
  }
  const deletedOrder = orders.splice(orderIndex, 1)[0];
  res.status(200).json({ message: "Order deleted successfully.", order: deletedOrder });
});

// Handle invalid JSON and other errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON request body." });
  }
  res.status(500).json({ message: "Internal server error." });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
