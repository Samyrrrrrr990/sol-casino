const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mock database
let users = {};
let sessions = {};

// Helper functions
function generateSessionId() {
    return Math.random().toString(36).substring(2, 15);
}

// User Registration
app.post("/register", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ error: "Email and password are required" });
    }
    if (users[email]) {
        return res.status(400).send({ error: "Email is already registered" });
    }
    users[email] = { password, balance: 1000 }; // Default balance
    res.send({ message: "Registration successful" });
});

// User Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const user = users[email];
    if (!user || user.password !== password) {
        return res.status(401).send({ error: "Invalid email or password" });
    }
    const sessionId = generateSessionId();
    sessions[sessionId] = email;
    res.send({ sessionId, balance: user.balance });
});

// Fetch User Balance
app.get("/balance", (req, res) => {
    const sessionId = req.headers.authorization;
    const email = sessions[sessionId];
    if (!email || !users[email]) {
        return res.status(401).send({ error: "Unauthorized" });
    }
    res.send({ balance: users[email].balance });
});

// Limbo Game Logic
app.post("/play-limbo", (req, res) => {
    const sessionId = req.headers.authorization;
    const email = sessions[sessionId];
    if (!email || !users[email]) {
        return res.status(401).send({ error: "Unauthorized" });
    }

    const { bet, multiplier } = req.body;
    if (bet > users[email].balance) {
        return res.status(400).send({ error: "Insufficient balance" });
    }

    const result = Math.random() * 10;
    const payout = result < multiplier ? bet * multiplier : 0;
    users[email].balance = users[email].balance - bet + payout;

    res.send({
        result: result.toFixed(2),
        payout: payout.toFixed(2),
        newBalance: users[email].balance.toFixed(2),
    });
});

// Logout
app.post("/logout", (req, res) => {
    const sessionId = req.headers.authorization;
    delete sessions[sessionId];
    res.send({ message: "Logged out successfully" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
