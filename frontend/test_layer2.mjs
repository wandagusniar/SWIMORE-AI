// Layer 2: Ephemeral WebCrypto AES-GCM-256 Verification

async function verifyCrypto() {
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const rawData = JSON.stringify({
    threadId: "thr_99812",
    title: "Quantum Simulation Prompt",
    messages: [
      { role: "user", content: "Explain quantum teleportation protocol in 3 bullets." },
      { role: "assistant", content: "1. Entanglement sharing\n2. Bell-state measurement\n3. Classical bit transmission" }
    ],
    timestamp: Date.now()
  });

  // 1. Generate AES-GCM 256-bit key
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // 2. Encrypt
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(rawData)
  );

  // 3. Decrypt
  const decryptedBuf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  const decryptedText = dec.decode(decryptedBuf);

  if (decryptedText !== rawData) {
    throw new Error("Decrypted payload does not match original!");
  }

  console.log("================================================================================");
  console.log("   SWIMORE.AI — LAYER 2 CLIENT ENCRYPTION VERIFICATION");
  console.log("================================================================================");
  console.log(" [x] AES-GCM-256 Key Generation: OK");
  console.log(" [x] 12-byte Nonce IV Vector: OK");
  console.log(" [x] Plaintext payload size:", rawData.length, "bytes");
  console.log(" [x] Ciphertext payload size:", ciphertext.byteLength, "bytes");
  console.log(" [x] Zero-knowledge Decryption Roundtrip: 100% MATCH");
  console.log("================================================================================");
}

verifyCrypto().catch(err => {
  console.error("Crypto test failed:", err);
  process.exit(1);
});

