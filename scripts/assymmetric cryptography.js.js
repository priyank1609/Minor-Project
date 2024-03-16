// Function to generate an RSA key pair
async function generateRSAKeyPair() {
  return await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // Equivalent to 65537
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
}

// Function to convert a Uint8Array to a string
function uint8ArrayToString(uint8Array) {
  return String.fromCharCode.apply(null, uint8Array);
}

// Function to convert a string to a Uint8Array
function stringToUint8Array(string) {
  const encoder = new TextEncoder();
  return encoder.encode(string);
}

// Function to convert a Uint8Array to a Base64 string
function uint8ArrayToBase64(uint8Array) {
  return btoa(String.fromCharCode.apply(null, uint8Array));
}

// Function to encrypt a message using the public key
async function encryptMessage(publicKey, message) {
  const encodedMessage = stringToUint8Array(message);
  const encryptedMessage = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    encodedMessage
  );
  return encryptedMessage;
}

// Function to decrypt a message using the private key
async function decryptMessage(privateKey, encryptedMessage) {
  const decryptedMessage = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    encryptedMessage
  );
  return uint8ArrayToString(new Uint8Array(decryptedMessage));
}

// Main function
(async () => {
  try {
    // Step 1: Generate an RSA key pair
    const keyPair = await generateRSAKeyPair();

    // Extract public and private keys
    const publicKey = keyPair.publicKey;
    const privateKey = keyPair.privateKey;

    // Step 2: Encrypt a message with the public key
    const originalMessage = "Hello, Welcome To Cryptography Virtual LAB!";
    const encryptedMessage = await encryptMessage(publicKey, originalMessage);

    // Step 3: Decrypt the encrypted message with the private key
    const decryptedMessage = await decryptMessage(privateKey, encryptedMessage);

    // Display results
    console.log("Original message:", originalMessage);
    console.log("Public Key:", publicKey);
    console.log("Private Key:", privateKey);
    console.log("Encrypted message:", new Uint8Array(encryptedMessage));
    console.log(
      "Encrypted message (Base64):",
      uint8ArrayToBase64(new Uint8Array(encryptedMessage))
    );
    console.log("Decrypted message:", decryptedMessage);
  } catch (error) {
    console.error("Error:", error);
  }
})();
