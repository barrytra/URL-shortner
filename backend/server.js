require("dotenv").config();
const express = require("express");
const redis = require("redis");
const shortid = require("shortid");

const app = express();
app.use(express.json());

// Configure Redis client
const redisClient = redis.createClient();
redisClient.connect();

redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("error", (err) => console.error("Redis error:", err));

const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

const cors = require("cors");
app.use(cors());

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));


// Endpoint to shorten a URL
app.post("/shorten", async (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
        return res.status(400).json({ error: "URL is required" });
    }

    // Generate a unique short ID
    const shortCode = shortid.generate();
    const shortUrl = `${BASE_URL}/${shortCode}`;

    // Store in Redis
    await redisClient.set(shortCode, longUrl);

    res.json({ shortUrl });
});

// Catch-all route for redirection
app.get("/:shortCode", async (req, res) => {
    const { shortCode } = req.params;

    // Retrieve long URL from Redis
    const longUrl = await redisClient.get(shortCode);

    if (longUrl) {
        res.redirect(longUrl);
    } else {
        res.status(404).json({ error: "Short URL not found" });
    }
});

client.get("shortURL", (err, data) => {
    if (err) console.error(err);
    else console.log("Stored URL:", data);
});
// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
