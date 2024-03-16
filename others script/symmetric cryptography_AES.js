// Function to generate a random AES key
async function generateAESKey() {
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256, // Key length can be 128, 192, or 256 bits
    },
    true, // Whether the key is extractable (i.e., can be exported)
    ["encrypt", "decrypt"] // Key usages
  );
}

// Function to encrypt a message with the AES key
async function encryptMessage(aesKey, message) {
  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(message);

  // Generate a random initialization vector (IV)
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // Encrypt the message using AES-GCM
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    aesKey,
    encodedMessage
  );

  // Combine IV and encrypted data
  const encryptedData = new Uint8Array(iv.length + encrypted.byteLength);
  encryptedData.set(iv);
  encryptedData.set(new Uint8Array(encrypted), iv.length);

  // Convert encrypted data to a Base64 string for easy storage or transmission
  return window.btoa(String.fromCharCode(...encryptedData));
}

// Function to decrypt an encrypted message with the AES key
async function decryptMessage(aesKey, encryptedData) {
  // Convert the Base64 string back to a Uint8Array
  const encryptedBytes = Uint8Array.from(atob(encryptedData), (c) =>
    c.charCodeAt(0)
  );

  // Extract IV and encrypted message
  const iv = encryptedBytes.slice(0, 12);
  const encryptedMessage = encryptedBytes.slice(12);

  // Decrypt the message using AES-GCM
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    aesKey,
    encryptedMessage
  );

  // Convert the decrypted data to a string
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

// Main function
(async () => {
  try {
    // Step 1: Generate a random AES key
    const aesKey = await generateAESKey();

    // Step 2: Encrypt a message with the AES key
    const message = "Hello, Welcome To Cryptography Virtual LAB!";
    const encryptedData = await encryptMessage(aesKey, message);

    // Step 3: Decrypt the encrypted message with the AES key
    const decryptedMessage = await decryptMessage(aesKey, encryptedData);

    // Display results
    console.log("Original message:", message);
    console.log("AES Key:", aesKey);
    console.log("Encrypted message:", encryptedData);
    console.log("Decrypted message:", decryptedMessage);
  } catch (error) {
    console.error("Error:", error);
  }
})();
