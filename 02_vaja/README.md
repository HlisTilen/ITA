
# 🛠️ Naloga 2: Implementacija onCall funkcije za dodajanje zahtevka za dopust

---

## Kaj je onCall funkcija?

**onCall funkcije** so del **Firebase Cloud Functions**, ki omogočajo neposredno komunikacijo med odjemalsko aplikacijo in funkcijo v oblaku.

### Kako deluje?
- `onCall` funkcija je klicana neposredno iz odjemalske aplikacije z uporabo Firebase SDK.
- Funkcija obdeluje podatke, ki jih odjemalec pošlje, in vrne odgovor odjemalcu.
- Firebase samodejno poskrbi za avtentikacijo in validacijo klicev (če je vključena).

### Primer uporabe
- Kadar potrebujete hitro in varno komunikacijo med aplikacijo in strežnikom, npr.:
  - Oddaja obrazcev (npr. zahtevek za dopust, naročilo izdelka).
  - Spreminjanje stanja v bazi.

### Prednosti onCall funkcij
- **Enostavna uporaba**: Brez potrebe po upravljanju HTTP zahtevkov in odgovorov. Firebase sam poskrbi za vse.
- **Vgrajena varnost**: Funkcije lahko dostopajo do avtentikacijskih podatkov odjemalca, če je avtentikacija vključena.
- **Hitro testiranje**: Funkcije lahko preprosto testirate z uporabo Firebase Emulatorja.

---

## 🎯 Cilji naloge

1. Naučiti se pisati **onCall** funkcijo z uporabo Firebase.
2. Razumeti, kako delati z zbirko podatkov **Firestore**.
3. Preizkusiti delovanje funkcij v lokalnem emulatorju.

---

## 1. 📁 Priprava

1. Odprite mapo projekta in se premaknite v mapo `functions`:
   ```bash
   cd functions
   ```

2. Prepričajte se, da so vse odvisnosti nameščene:
   ```bash
   npm install
   ```

3. Odprite datoteko `index.js` in vanjo dodajte naslednji klic na Firebase Admin SDK, če še ni dodan:
   ```javascript
   const { onCall } = require("firebase-functions/v2/https");
   const admin = require("firebase-admin");
   admin.initializeApp();
   const db = admin.firestore();
   ```

---

## 2. ✍️ Implementacija funkcije

V datoteko `index.js` dodajte funkcijo za oddajo zahtevka za dopust:

```javascript
exports.requestLeave = onCall(async (request) => {
  try {
    const { name, startDate, endDate } = request.data;

    // Preverjanje obveznih polj
    if (!name || !startDate || !endDate) {
      throw new Error("Missing required fields: name, startDate, endDate");
    }

    // Dodajanje zahtevka v Firestore
    await db.collection("leaveRequests").add({
      name,
      startDate,
      endDate,
      status: "pending",
      timestamp: new Date(),
    });

    return { message: "Leave request submitted successfully" };
  } catch (error) {
    console.error("Error submitting leave request:", error);
    throw new Error("Error submitting leave request.");
  }
});
```

---

## 3. 💡 Nastavitev Firestore rules

### Kaj so Firestore rules?

Firestore security rules omogočajo nadzor nad tem, kdo lahko dostopa do podatkov v zbirki in kdo lahko izvaja operacije, kot so **branje**, **pisanje**, **posodabljanje** ali **brisanje**. Te pravila so ključna za zaščito občutljivih podatkov.

### Kako jih nastaviti?

1. Odprite datoteko `firestore.rules` v korenski mapi projekta.
2. Nastavite pravila, da dovolijo vsem uporabnikom pisanje v zbirko `leaveRequests`:

```plaintext
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaveRequests/{requestId} {
      allow write: if true; // Dovoljuje pisanje vsem
    }
  }
}
```

3. Če želite omejiti pisanje le na avtenticirane uporabnike:

```plaintext
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaveRequests/{requestId} {
      allow write: if request.auth != null; // Dovoljuje pisanje samo avtenticiranim uporabnikom
    }
  }
}
```

4. Po spremembi pravil naložite nova pravila v emulator:
   ```bash
   firebase deploy --only firestore:rules
   ```

---

## 4. 🚀 Zagon emulatorja

1. Zaženite emulatorje v korenski mapi projekta:
   ```bash
   firebase emulators:start
   ```

2. V konzoli boste videli URL za **Functions Emulator** (npr. `http://127.0.0.1:5001`). Uporabite ga za testiranje.

---

## 5. 🧪 Testiranje funkcije

### Testiranje oddaje zahtevka za dopust

Uporabite **Postman**, **cURL**, ali Firebase SDK za testiranje.

```bash
curl -X POST http://127.0.0.1:5001/<PROJECT_ID>/us-central1/requestLeave -H "Content-Type: application/json" -d '{"data": {"name": "Janez Novak", "startDate": "2024-12-01", "endDate": "2024-12-10"}}'
```

---

## 6. 📚 Uporabne povezave

- Firebase Functions: [Dokumentacija](https://firebase.google.com/docs/functions)
- Firestore: [Dokumentacija](https://firebase.google.com/docs/firestore)
- Firestore Security Rules: [Dokumentacija](https://firebase.google.com/docs/firestore/security/get-started)

---

🎉 **Čestitke!** Zdaj ste uspešno implementirali in testirali funkcijo za oddajo zahtevkov za dopust.
