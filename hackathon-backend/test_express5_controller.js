import express from 'express';

const app = express();
app.use(express.json());

const protect = async (req, res, next) => {
  try {
    console.log("Protect running");
    next();
  } catch (error) {
    console.error("PROTECT CATCH BLOCK EXECUTED", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const expenseController = async (req, res) => {
  try {
    console.log("Inside expense controller");
    const { title } = req.body;
    if (!title) {
        throw new Error("Missing title");
    }
    
    // Simulating Expense.create
    const expense = await Promise.reject(new Error("Database error"));
    
    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: expense
    });

  } catch (error) {
    console.log("Controller catch block");
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const router = express.Router();
router.post("/", protect, expenseController);
app.use("/api/expenses", router);

app.listen(3002, async () => {
  console.log("Testing POST /api/expenses...");
  try {
    const res = await fetch("http://localhost:3002/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ }) 
    });
    console.log("POST /api/expenses status:", res.status, await res.json());
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
});
