// variale declarations
const navItems = document.querySelectorAll('.nav-item button');
const contentDivs = document.querySelectorAll('.content');
const headerHomeButton = document.getElementById("homeBtn");
const headerAboutUsButton = document.getElementById("aboutBtn");
const firstContentDiv = document.getElementById(navItems[0].dataset.content);
firstContentDiv.style.display = 'block'; // Show the first content div
let genPublicBtn = document.getElementById("genPublicKey");
genPublicBtn.disabled = false;
let genPrivateBtn = document.getElementById("genPrivateKey");
genPrivateBtn.disabled = false;
let clearAllBtn = document.getElementById("clearAll");
clearAllBtn.disabled = false;
clearAllBtn.addEventListener("click", () => {
  msg.disabled = false;
  msg.value = "";
  publicKeyInput.innerText = "";
  encPublicKeyBtn.disabled = true;
  privateKeyInput.innerText = "";
  decPrivateKeyBtn.disabled = true;
  encMessageInput.innerText = "";
  encMessage64Input.innerText = "";
  decMessageInput.innerText = "";
})
let encPublicKeyBtn = document.getElementById("encPublicKey");
encPublicKeyBtn.disabled = true;
let decPrivateKeyBtn = document.getElementById("decPrivateKey");
decPrivateKeyBtn.disabled = true;
let msg = document.getElementById("message");
let publicKeyInput = document.getElementById("publicKey");
let privateKeyInput = document.getElementById("privateKey");
let encMessageInput = document.getElementById("encryptedMessage");
let encMessage64Input = document.getElementById("encryptedMessage64");
let decMessageInput = document.getElementById("decryptedMessage");
let keyPair;
let publicKey;
let privateKey;
let encryptedMessage;
let decryptedMessage;

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

async function convertKeyPairToString(keyPair) {
  // Export the public key to JWK format
  const publicKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
  
  // Export the private key to JWK format
  const privateKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);
  
  // Serialize the JWKs to a string
  const serializedKeys = {
      publicKey: publicKeyJwk,
      privateKey: privateKeyJwk,
  };

  return serializedKeys;
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

genPublicBtn.addEventListener('click', () => {
  // alert(`Message: ${msg.value}`);
  (async () => {
    try {
      // Step 1: Generate an RSA key pair
      keyPair = await generateRSAKeyPair();

      // convert keypair to string
      const keyPairString = await convertKeyPairToString(keyPair);

      publicKeyInput.innerText = JSON.stringify(keyPairString.publicKey);

      encPublicKeyBtn.disabled = false;
      genPrivateBtn.disabled = false;
    } catch (error) {
      console.error("Error:", error);
    }
  })();
});

genPrivateBtn.addEventListener('click', () => {
  (async () => {
    try {
      // Step 1: Generate an RSA key pair
      keyPair = await generateRSAKeyPair();

      // convert keypair to string
      const keyPairString = await convertKeyPairToString(keyPair);

      privateKeyInput.innerText = JSON.stringify(keyPairString.privateKey);

      decPrivateKeyBtn.disabled = false;
      genPrivateBtn.disabled = false;
    } catch (error) {
      console.error("Error:", error);
    }
  })();
});

encPublicKeyBtn.addEventListener("click", () => {
  if(msg.value !== ""){
    (async () => {
      try {
        encryptedMessage = await encryptMessage(keyPair.publicKey, msg.value);
        encMessageInput.innerText = JSON.stringify(new Uint8Array(encryptedMessage));
        encMessage64Input.innerText = uint8ArrayToBase64(new Uint8Array(encryptedMessage));
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

decPrivateKeyBtn.addEventListener("click", () => {
  if(msg.value !== "" && encMessageInput.value !== "" && encryptedMessage !== ""){
    (async () => {
      try {
        // Step 3: Decrypt the encrypted message with the private key
        decryptedMessage = await decryptMessage(keyPair.privateKey, encryptedMessage);

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