
# 🛠️ Naloga 4: Implementacija Firestore triggerjev za spremljanje sprememb v zbirki

---

## Kaj so Firestore triggerji?

Firestore triggerji so funkcije, ki se sprožijo, ko pride do določenih sprememb v Firestore bazi podatkov. Firebase ponuja več vrst triggerjev, kot so:
- **onDocumentCreate**: Sproži se, ko se v zbirki ustvari nov dokument.
- **onDocumentUpdate**: Sproži se, ko se obstoječi dokument posodobi.
- **onDocumentDelete**: Sproži se, ko se dokument izbriše iz zbirke.

---

## 🎯 Cilji naloge

1. Naučiti se uporabljati Firestore triggerje.
2. Implementirati osnovne funkcije, ki spremljajo dogodke v Firestore zbirki.
3. Razumeti, kako delujejo **onDocumentCreate**, **onDocumentUpdate** in **onDocumentDelete**.

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

3. Odprite datoteko `index.js` in preverite, ali so Firebase knjižnice vključene:
   ```javascript
   const { onDocumentCreated, onDocumentUpdated, onDocumentDeleted } = require("firebase-functions/v2/firestore");
   const admin = require("firebase-admin");
   admin.initializeApp();
   ```

---

## 2. ✍️ Implementacija triggerjev

Dodajte naslednje funkcije v datoteko `index.js`. Trenutno naj te funkcije samo izpisujejo podatke v konzolo, ko pride do spremembe.

### 2.1 onDocumentCreate

Sproži se, ko se v zbirki `leaveRequests` ustvari nov dokument:

```javascript
exports.onLeaveRequestCreated = onDocumentCreated(
  "leaveRequests/{requestId}",
  (event) => {
    console.log("New leave request created:", event.data);
  }
);
```

### 2.2 onDocumentUpdate

Sproži se, ko se obstoječi dokument v zbirki `leaveRequests` posodobi:

```javascript
exports.onLeaveRequestUpdated = onDocumentUpdated(
  "leaveRequests/{requestId}",
  (event) => {
    console.log("Leave request updated:");
    console.log("Before:", event.data.before.data());
    console.log("After:", event.data.after.data());
  }
);
```

### 2.3 onDocumentDelete

Sproži se, ko se dokument iz zbirke `leaveRequests` izbriše:

```javascript
exports.onLeaveRequestDeleted = onDocumentDeleted(
  "leaveRequests/{requestId}",
  (event) => {
    console.log("Leave request deleted:", event.data);
  }
);
```

---

## 3. 🚀 Zagon emulatorja

1. Zaženite emulatorje v korenski mapi projekta:
   ```bash
   firebase emulators:start
   ```

2. V konzoli preverite, ali so funkcije pravilno registrirane. Videti bi morali naslednje:
   ```
   Functions: onLeaveRequestCreated
   Functions: onLeaveRequestUpdated
   Functions: onLeaveRequestDeleted
   ```

---

## 4. 🧪 Testiranje funkcij

1. Odprite **Emulator UI** v brskalniku (npr. `http://127.0.0.1:4000`).
2. V zbirki **leaveRequests**:
   - Dodajte nov dokument in preverite, ali se sproži **onDocumentCreate**.
   - Posodobite obstoječi dokument in preverite, ali se sproži **onDocumentUpdate**.
   - Izbrišite dokument in preverite, ali se sproži **onDocumentDelete**.
3. Spremljajte konzolo, kjer boste videli izpise, ki jih ustvarijo te funkcije.

---

## 5. 📚 Uporabne povezave

- Firestore Triggers: [Dokumentacija](https://firebase.google.com/docs/functions/firestore-events)
- Firebase Emulator Suite: [Dokumentacija](https://firebase.google.com/docs/emulator-suite)

---

🎉 **Čestitke!** Uspešno ste implementirali in testirali Firestore triggerje. V naslednji nalogi bomo nadgradili te funkcije, da bodo namesto izpisa v konzolo poslale e-poštna obvestila.
