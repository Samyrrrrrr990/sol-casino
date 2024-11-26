function playLimbo(multiplier) {
    const result = Math.random() * 100;
    if (result < multiplier) {
        return { win: true, payout: result * multiplier };
    }
    return { win: false, payout: 0 };
}
