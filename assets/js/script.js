function stringToArrayBuffer(str) {
    const encoder = new TextEncoder();
    return encoder.encode(str);
}

function arrayBufferToString(buffer) {
    const decoder = new TextDecoder();
    return decoder.decode(buffer);
}

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i);
    }
    return buffer.buffer;
}

async function deriveKey(passkey) {
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        stringToArrayBuffer(passkey),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: stringToArrayBuffer("https://www.google.com"), 
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-CBC", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

async function enc(plaintext, passkey) {
    const key = await deriveKey(passkey);
    const iv = stringToArrayBuffer("http://google.eu"); 
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-CBC", iv: iv },
        key,
        stringToArrayBuffer(plaintext)
    );
    return arrayBufferToBase64(encrypted);
}

async function dec(ciphertextBase64, passkey) {
    const key = await deriveKey(passkey);
    const iv = stringToArrayBuffer("http://google.eu"); 
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-CBC", iv: iv },
        key,
        base64ToArrayBuffer(ciphertextBase64)
    );
    return arrayBufferToString(decrypted);
}
