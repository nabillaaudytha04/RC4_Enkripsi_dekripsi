function KSA(key) {
    var keyLength = key.length;
    var S = Array.from(Array(256).keys());
    var j = 0;
    for (var i = 0; i < 256; i++) {
        j = (j + S[i] + key.charCodeAt(i % keyLength)) % 256;
        [S[i], S[j]] = [S[j], S[i]];
    }
    return S;
}

function PRGA(S) {
    var i = 0;
    var j = 0;
    return function () {
        i = (i + 1) % 256;
        j = (j + S[i]) % 256;
        [S[i], S[j]] = [S[j], S[i]];
        var K = S[(S[i] + S[j]) % 256];
        return K;
    }
}

function RC4(key) {
    var S = KSA(key);
    return PRGA(S);
}

function encrypt() {
    var key = document.getElementById("key").value;
    var message = document.getElementById("message").value;
    
    var keystream = RC4(key);
    var encrypted = "";
    for (var i = 0; i < message.length; i++) {
        var charCode = message.charCodeAt(i) ^ keystream();
        encrypted += charCode.toString(16).padStart(2, '0');
    }
    document.getElementById("output").value = encrypted.toUpperCase();
}

function decrypt() {
    var key = document.getElementById("key").value;
    var ciphertext = document.getElementById("message").value;
    
    ciphertext = ciphertext.match(/.{2}/g).map(hex => parseInt(hex, 16));
    var keystream = RC4(key);
    var decrypted = "";
    for (var i = 0; i < ciphertext.length; i++) {
        var char = String.fromCharCode(ciphertext[i] ^ keystream());
        decrypted += char;
    }
    document.getElementById("output").value = decrypted;
}

function clearFields() {
    document.getElementById("key").value = "";
    document.getElementById("message").value = "";
    document.getElementById("output").value = ""; 
}