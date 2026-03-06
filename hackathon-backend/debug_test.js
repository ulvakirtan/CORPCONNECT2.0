import express from 'express';
import jwt from 'jsonwebtoken';
import http from 'http';

const app = express();
app.use(express.json());

const JWT_SECRET = "test_secret";
process.env.JWT_SECRET = JWT_SECRET;

const User = {
  findById: (id) => {
    return {
      select: async (fields) => {
        return { _id: id };
      }
    };
  }
};

const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error("PROTECT ERROR:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const expenseController = async (req, res) => {
  console.log("Inside expense controller");
  const { title } = req.body;
  if (!title) {
    throw new Error("Some error in controller");
  }
  res.json({ success: true, title });
};

const getExpenseController = async (req, res) => {
  res.json({ success: true, user: req.user._id });
};

const router = express.Router();
router.post("/", protect, expenseController);
router.get("/", protect, getExpenseController);
app.use("/api/expenses", router);

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Protected", user: req.user });
});

const server = http.createServer(app);
server.listen(3000, async () => {
  const token = jwt.sign({ id: "123" }, JWT_SECRET);
  
  console.log("Testing POST /api/expenses...");
  const res2 = await fetch("http://localhost:3000/api/expenses", {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ }) // missing title
  });
  console.log("POST /api/expenses status:", res2.status, await res2.json());

  console.log("Testing GET /api/expenses...");
  const res3 = await fetch("http://localhost:3000/api/expenses", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log("GET /api/expenses status:", res3.status, await res3.json());

  server.close();
});
