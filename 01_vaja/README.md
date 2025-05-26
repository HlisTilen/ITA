
# 🚀 Navodila za nastavitev Firebase Emulatorja in Cloud Functions

Navodila, kako nastaviti Firebase Emulator Suite in Cloud Functions za lokalni razvoj.

---

## 1. ✅ Predpogoji

Pred začetkom poskrbite za naslednje:
1. **Node.js**: Prepričajte se, da imate nameščen Node.js. Priporočena različica je **18.x**.
   - Prenesite Node.js z [uradne strani](https://nodejs.org/).
   - Preverite verzijo:
     ```bash
     node -v
     ```
2. **Firebase CLI**: Namestite Firebase CLI, če še ni nameščen:
   ```bash
   npm install -g firebase-tools
   ```
3. **Prijava v Firebase**: Če to še niste storili, se prijavite:
   ```bash
   firebase login
   ```
   (Ta korak lahko preskočite, če ste že prijavljeni.)

---

## 2. 🌐 Ustvarjanje Firebase projekta

1. Obiščite [Firebase Console](https://console.firebase.google.com/) in ustvarite nov projekt.
2. Poimenujte projekt (npr. "faasnaloge").
3. Shranite ID projekta za nadaljnjo uporabo.

---

## 3. ⚙️ Inicializacija Firebase v projektu

### 3.1 Začetna inicializacija
1. Odprite terminal in se premaknite v mapo svojega projekta:
   ```bash
   cd /pot/do/projekta
   ```
2. Zaženite inicializacijo Firebase:
   ```bash
   firebase init
   ```
3. Izberite, katere funkcionalnosti želite nastaviti:
   - S puščicami se premaknite na **Emulators**.
   - Pritisnite **Space** za izbiro, nato **Enter** za potrditev.

### 3.2 Povezava z obstoječim Firebase projektom
Po izbiri **Emulators**:
1. Izberite možnost **Use an existing project**.
2. Izberite svoj projekt iz seznama (npr. "faasnaloge").

---

## 4. 🔄 Nastavitev emulatorjev

Ko vas sistem vpraša, katere emulatorje želite uporabljati, izberite:
- **Functions Emulator**: Za izvajanje Cloud Functions.
- **Firestore Emulator**: Za shranjevanje podatkov.

Potrdite privzete porte (npr. **5001** za Functions, **8080** za Firestore) ali jih prilagodite po želji.

4. Po zaključku inicializacije preverite, da sta datoteki `firebase.json` in `.firebaserc` pravilno ustvarjeni.

---

## 5. 🛠️ Nastavitev Cloud Functions

### 5.1 Inicializacija funkcij
1. Premaknite se v mapo za funkcije:
   ```bash
   mkdir functions
   cd functions
   ```
2. Inicializirajte funkcije:
   ```bash
   firebase init functions
   ```
3. Izberite naslednje možnosti:
   - **Language**: JavaScript.
   - **ESLint**: Ne izberite (v tej delavnici ni potrebno).
   - **Install dependencies now**: Yes.

### 5.2 Pregled in testiranje
Po inicializaciji bodo ustvarjene naslednje datoteke:
- `functions/index.js`: Tukaj dodate funkcije.
- `functions/package.json`: Upravljanje odvisnosti.

---

## 6. 🏃‍♂️ Zagon emulatorjev

1. V korenski mapi projekta zaženite emulatorje:
   ```bash
   firebase emulators:start
   ```
2. Konzola bo prikazala informacije o delujočih emulatorjih, vključno z URL-ji za dostop:
   - **Functions Emulator**: `http://127.0.0.1:5001`
   - **Firestore Emulator**: `http://127.0.0.1:8080`
   - **Emulator UI**: `http://127.0.0.1:4000`

---

## 7. 📚 Uporabne povezave

- Firebase Emulator Suite: [Dokumentacija](https://firebase.google.com/docs/emulator-suite)
- Cloud Functions: [Dokumentacija](https://firebase.google.com/docs/functions)
- Firestore Emulator: [Dokumentacija](https://firebase.google.com/docs/firestore)

---

🎉 Sedaj imate nastavljen Firebase Emulator za lokalni razvoj.
