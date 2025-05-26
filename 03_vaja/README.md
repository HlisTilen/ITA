
# 🛠️ Naloga 3: Implementacija onRequest funkcije za pridobitev vseh zahtevkov za dopust

---

## Kaj je onRequest funkcija?

**onRequest funkcije** so del **Firebase Cloud Functions** in omogočajo uporabo splošnih HTTP zahtevkov za komunikacijo med odjemalcem in strežnikom.

### Kako deluje?
- `onRequest` funkcije delujejo kot klasični REST API-ji.
- Podpirajo vse HTTP metode, npr. **GET**, **POST**, **PUT**, **DELETE**.
- Lahko jih kličeš iz katerega koli HTTP odjemalca (npr. `curl`, Postman, brskalnik).

### Primer uporabe
- Pridobivanje podatkov iz baze (npr. seznam zahtevkov za dopust).
- Obdelava obrazcev poslanih prek HTTP zahtevkov.
- Izvajanje operacij na podatkih v bazi.

### Prednosti onRequest funkcij
- **Prilagodljivost**: Podpora za vse HTTP metode.
- **Široka združljivost**: Delujejo z vsemi orodji in knjižnicami za pošiljanje HTTP zahtev.
- **Brez omejitev glede telesa zahteve**: Delujejo tudi brez telesa ali posebne strukture.

---

## 🎯 Cilji naloge

1. Naučiti se pisati **onRequest** funkcijo z uporabo Firebase.
2. Razumeti, kako delati z zbirko podatkov **Firestore**.
3. Preizkusiti delovanje funkcij z različnimi HTTP metodami.

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
   const { onRequest } = require("firebase-functions/v2/https");
   const admin = require("firebase-admin");
   admin.initializeApp();
   const db = admin.firestore();
   ```

---

## 2. ✍️ Implementacija funkcije

V datoteko `index.js` dodajte funkcijo za pridobitev vseh zahtevkov za dopust:

```javascript
exports.getAllLeaveRequests = onRequest(async (req, res) => {
  try {
    // Preveri, ali je metoda GET
    if (req.method !== "GET") {
      res.status(405).send("Only GET requests are allowed.");
      return;
    }

    // Pridobi vse zahtevke iz Firestore
    const requestsSnapshot = await db
      .collection("leaveRequests")
      .orderBy("timestamp", "desc")
      .get();

    const requests = requestsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Pošlji seznam zahtevkov kot odgovor
    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).send("Error fetching leave requests.");
  }
});
```

---

## 3. 🚀 Zagon emulatorja

1. Zaženite emulatorje v korenski mapi projekta:
   ```bash
   firebase emulators:start
   ```

2. V konzoli boste videli URL za **Functions Emulator** (npr. `http://127.0.0.1:5001`). Uporabite ga za testiranje.

---

## 4. 🧪 Testiranje funkcije

### Testiranje pridobivanja vseh zahtevkov za dopust

1. **S `curl`**:
   ```bash
   curl -X GET http://127.0.0.1:5001/<PROJECT_ID>/us-central1/getAllLeaveRequests
   ```

2. **S Postmanom**:
   - Nastavite metodo na **GET**.
   - URL funkcije: `http://127.0.0.1:5001/<PROJECT_ID>/us-central1/getAllLeaveRequests`.
   - Pošljite zahtevo brez dodatnih nastavitev.

3. **V brskalniku**:
   - Odprite URL funkcije (npr. `http://127.0.0.1:5001/<PROJECT_ID>/us-central1/getAllLeaveRequests`) in preverite rezultat.

---

## 5. 📚 Uporabne povezave

- Firebase Functions: [Dokumentacija](https://firebase.google.com/docs/functions)
- Firestore: [Dokumentacija](https://firebase.google.com/docs/firestore)

---

🎉 **Čestitke!** Zdaj ste uspešno implementirali in testirali funkcijo za pridobivanje vseh zahtevkov za dopust.
