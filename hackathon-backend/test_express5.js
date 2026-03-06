import express from 'express';

const app = express();

const protect = async (req, res, next) => {
  try {
    next();
  } catch (error) {
    console.log("CATCH BLOCK EXECUTED", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const controller = async (req, res) => {
  throw new Error("Controller error");
};

const syncController = (req, res) => {
  throw new Error("Sync controller error");
};

const router = express.Router();
router.post("/async", protect, controller);
router.post("/sync", protect, syncController);
app.use("/", router);

app.use((err, req, res, next) => {
    console.log("GLOBAL ERROR HANDLER", err.message);
    res.status(500).json({ error: 'Global error handler' });
});

app.listen(3001, async () => {
    try {
        console.log("Testing POST /async...");
        const resA = await fetch("http://localhost:3001/async", { method: "POST" });
        console.log("Async response:", resA.status, await resA.json());
        
        console.log("Testing POST /sync...");
        const resB = await fetch("http://localhost:3001/sync", { method: "POST" });
        console.log("Sync response:", resB.status, await resB.json());
    } catch(e) {
        console.error(e);
    }
    process.exit(0);
});
