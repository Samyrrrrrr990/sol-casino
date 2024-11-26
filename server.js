const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let userBalance = 1000; // Initial mock balance in SOL

// Limbo Game Logic
app.post("/play-limbo", (req, res) => {
    const { bet, multiplier } = req.body;
    if (bet > userBalance) return res.status(400).send({ error: "Insufficient funds" });

    const result = Math.random() * 10; // Simulated result
    const payout = result < multiplier ? bet * multiplier : 0;
    userBalance = userBalance - bet + payout;

    res.send({
        result: result.toFixed(2),
        payout: payout.toFixed(2),
        newBalance: userBalance.toFixed(2),
    });
});

// Plinko Game Logic
app.post("/play-plinko", (req, res) => {
    const { bet } = req.body;
    if (bet > userBalance) return res.status(400).send({ error: "Insufficient funds" });

    const outcomes = [0, 0.5, 1, 1.5, 2, 5];
    const randomIndex = Math.floor(Math.random() * outcomes.length);
    const multiplier = outcomes[randomIndex];
    const payout = bet * multiplier;
    userBalance = userBalance - bet + payout;

    res.send({
        multiplier,
        payout: payout.toFixed(2),
        newBalance: userBalance.toFixed(2),
    });
});

// Blackjack Game Logic
app.post("/play-blackjack", (req, res) => {
    const { bet } = req.body;
    if (bet > userBalance) return res.status(400).send({ error: "Insufficient funds" });

    const drawCard = () => Math.floor(Math.random() * 10) + 1;
    const userCards = [drawCard(), drawCard()];
    const dealerCards = [drawCard(), drawCard()];
    const userScore = userCards.reduce((a, b) => a + b, 0);
    const dealerScore = dealerCards.reduce((a, b) => a + b, 0);

    let result = "";
    let payout = 0;
    if (userScore > dealerScore && userScore <= 21 || dealerScore > 21) {
        result = "win";
        payout = bet * 2;
    } else if (userScore === dealerScore) {
        result = "tie";
        payout = bet;
    } else {
        result = "lose";
    }

    userBalance = userBalance - bet + payout;

    res.send({
        result,
        payout: payout.toFixed(2),
        newBalance: userBalance.toFixed(2),
        userCards,
        dealerCards,
        userScore,
        dealerScore,
    });
});

// Get Balance
app.get("/balance", (req, res) => {
    res.send({ balance: userBalance.toFixed(2) });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
