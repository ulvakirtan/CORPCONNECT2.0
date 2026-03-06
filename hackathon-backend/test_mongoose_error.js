import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const JWT_SECRET = "test_secret";
process.env.JWT_SECRET = JWT_SECRET;

const User = {
  // If id is not an ObjectId, mongoose might throw a synchronous error
  // Let's see if this throws
  findById: (id) => {
    return {
      select: (fields) => {
         throw new Error("CastError: Cast to ObjectId failed");
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
      
      // THIS is where the error might be!
      req.user = await User.findById(decoded.id).select("-password");
      
      next();
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error("PROTECT CATCH BLOCK EXECUTED", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const expenseController = async (req, res) => {
  try {
    console.log("Inside expense controller");
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const router = express.Router();
router.post("/", protect, expenseController);
app.use("/api/expenses", router);

app.listen(3003, async () => {
  console.log("Testing POST /api/expenses...");
  try {
    const token = jwt.sign({ id: "123" }, JWT_SECRET);
    const res = await fetch("http://localhost:3003/api/expenses", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ }) 
    });
    console.log("POST /api/expenses status:", res.status, await res.json());
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
});
