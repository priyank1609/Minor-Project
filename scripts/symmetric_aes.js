// variale declarations
const navItems = document.querySelectorAll('.nav-item button');
const contentDivs = document.querySelectorAll('.content');
const headerHomeButton = document.getElementById("homeBtn");
const headerAboutUsButton = document.getElementById("aboutBtn");
const firstContentDiv = document.getElementById(navItems[0].dataset.content);
firstContentDiv.style.display = 'block'; // Show the first content div
let genSecretBtn = document.getElementById("genSecretKey");
genSecretBtn.disabled = false;
let clearAllBtn = document.getElementById("clearAll");
clearAllBtn.disabled = false;
clearAllBtn.addEventListener("click", () => {
  msg.disabled = false;
  msg.value = "";
  secretKeyInput.innerText = "";
  encSecretKeyBtn.disabled = true;
  decSecretKeyBtn.disabled = true;
  encMessageInput.innerText = "";
  decMessageInput.innerText = "";
})
let encSecretKeyBtn = document.getElementById("encSecretKey");
encSecretKeyBtn.disabled = true;
let decSecretKeyBtn = document.getElementById("decSecretKey");
decSecretKeyBtn.disabled = true;
let msg = document.getElementById("message");
let secretKeyInput = document.getElementById("encSecretKeyInput");
let encMessageInput = document.getElementById("encryptedMessage");
let decMessageInput = document.getElementById("decryptedMessage");
let aesKey;
let publicKey;
let privateKey;
let encryptedMessage;
let decryptedMessage;

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

async function aesKeyToString(key) {
  try {
    // Export the CryptoKey to an ArrayBuffer
    const exportedKey = await window.crypto.subtle.exportKey("raw", key);
    
    // Convert the ArrayBuffer to a Base64 string
    const base64Key = arrayBufferToBase64(exportedKey);
    
    return base64Key;
  } catch (error) {
    console.error("Error exporting key:", error);
    throw error; // Rethrow or handle as appropriate
  }
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
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

navItems.forEach(navItem => {
  navItem.addEventListener('click', () => {
    const contentId = navItem.dataset.content;
    contentDivs.forEach(div => div.style.display = 'none');
    document.getElementById(contentId).style.display = 'block';

    // Remove "selected" class from previously selected item
    const previouslySelected = document.querySelector('.nav-item.selected');
    if (previouslySelected) {
      previouslySelected.classList.remove('selected');
    }

    // Add "selected" class to the clicked navigation item's parent element
    navItem.parentElement.classList.add('selected');
  });
});

headerHomeButton.addEventListener('click', () => {
  window.location.href = 'index.html'; // Redirect to index.html
});

headerAboutUsButton.addEventListener('click', () => {
  window.location.href = 'aboutUs.html'; // Redirect to aboutUs.html
});

genSecretBtn.addEventListener('click', () => {
  (async () => {
    try {
      // Step 1: Generate an AES Key
      aesKey = await generateAESKey();

      // convert key to string
      const keyString = await aesKeyToString(aesKey);

      secretKeyInput.innerText = JSON.stringify(keyString);

      encSecretKeyBtn.disabled = false;
      decSecretKeyBtn.disabled = false;
    } catch (error) {
      console.error("Error:", error);
    }
  })();
});

encSecretKeyBtn.addEventListener("click", () => {
  if(msg.value !== ""){
    (async () => {
      try {
        encryptedMessage = await encryptMessage(aesKey, msg.value);
        encMessageInput.innerText = encryptedMessage;
        msg.disabled = true;
      } catch (error) {
        console.error("Error:", error);
      }
    })();
  }
  else{
    alert("kindly enter a message to encrypt");
  }
})

decSecretKeyBtn.addEventListener("click", () => {
  if(msg.value !== "" && encMessageInput.value !== "" && encryptedMessage !== ""){
    (async () => {
      try {
        decryptedMessage = await decryptMessage(aesKey, encryptedMessage);
        decMessageInput.innerText = decryptedMessage;
      } catch (error) {
        console.error("Error:", error);
      }
    })();
  }
  else{
    alert("kindly encrypt a message first to decrypt.")
  }
})
