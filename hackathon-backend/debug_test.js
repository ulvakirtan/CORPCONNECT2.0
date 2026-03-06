import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const JWT_SECRET = "test_secret";
process.env.JWT_SECRET = JWT_SECRET;

const User = {
  findById: async (id) => {
    return { _id: id, select: () => ({ _id: id }) };
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
      req.user = await User.findById(decoded.id).select("-password"); // Wait, User.findById returns an object? Does it have a select method?
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
  res.json({ success: true, message: "Expense route" });
};

const router = express.Router();
router.post("/", protect, expenseController);
app.use("/api/expenses", router);

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Protected", user: req.user });
});

const token = jwt.sign({ id: "123" }, JWT_SECRET);

console.log(`Token: Bearer ${token}`);
