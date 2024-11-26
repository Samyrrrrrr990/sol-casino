const { Connection, Keypair, PublicKey, Transaction } = require('@solana/web3.js');

const connection = new Connection('https://api.devnet.solana.com');
app.post('/generate-wallet', (req, res) => {
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toString();
    res.send({ publicKey });
});

app.post('/transfer', async (req, res) => {
    const { fromPrivateKey, toPublicKey, amount } = req.body;
    const fromKeypair = Keypair.fromSecretKey(Uint8Array.from(fromPrivateKey));
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: fromKeypair.publicKey,
            toPubkey: new PublicKey(toPublicKey),
            lamports: amount,
        })
    );
    await connection.sendTransaction(transaction, [fromKeypair]);
    res.send({ message: 'Transfer complete' });
});
