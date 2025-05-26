
# 🛠️ Naloga 5: Pošiljanje e-pošte ob spremembah v Firestore

---

## 🎯 Cilji naloge

1. Naučiti se vzpostaviti lokalni SMTP strežnik za testiranje pošiljanja e-pošte.
2. Nadgraditi Firestore triggerje za pošiljanje e-pošte ob dogodkih.
3. Implementirati `onRequest` funkcijo za obdelavo odobritev in zavrnitev zahtevkov.

---

## 1. 📧 Vzpostavitev lokalnega pošiljanja e-pošte

### 1.1 Namestitev in zagon lokalnega SMTP strežnika

Uporabimo **[MailHog](https://github.com/mailhog/MailHog)**, ki omogoča zajemanje e-pošte na lokalnem strežniku.

#### **Namestitev za macOS/Linux**

1. Namestite MailHog z **Homebrew**:
   ```bash
   brew install mailhog
   ```

2. Zaženite MailHog:
   ```bash
   mailhog
   ```

#### **Namestitev za Windows**

1. Obiščite stran za [MailHog Releases](https://github.com/mailhog/MailHog/releases).
2. Prenesite najnovejšo različico za Windows (datoteka s končnico `.exe`).
3. Postavite preneseno datoteko v mapo, kjer jo lahko enostavno zaženete (npr. `C:\Tools\MailHog`).
4. Odprite **Command Prompt** ali **PowerShell**, premaknite se v mapo z MailHog:
   ```bash
   cd C:\Tools\MailHog
   ```
5. Zaženite MailHog:
   ```bash
   MailHog.exe
   ```

#### Dostop do MailHog UI
- Ko je MailHog zagnan, lahko dostopate do njegovega uporabniškega vmesnika na:
  - URL: `http://localhost:8025`

---

### 1.2 Namestitev Nodemailer knjižnice

Nodemailer je knjižnica za pošiljanje e-pošte. Namestite jo v projektu:

1. Premaknite se v mapo `functions`:
   ```bash
   cd functions
   ```

2. Namestite Nodemailer:
   ```bash
   npm install nodemailer
   ```

3. Preverite, ali je knjižnica uspešno nameščena v datoteki `package.json` pod `dependencies`.

---

### 1.3 Integracija MailHog s Firebase funkcijami

Dodajte konfiguracijo za SMTP strežnik v `functions/index.js`:

```javascript
const nodemailer = require("nodemailer");

// Nastavitev lokalnega SMTP strežnika (MailHog)
const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025, // Port MailHog strežnika
  secure: false,
  ignoreTLS: true,
});
```

---

## 2. ✍️ Nadgradnja Firestore triggerjev

Nadgradite obstoječe Firestore triggerje, da pošiljajo e-pošto ob določenih dogodkih.

### 2.1 Pošiljanje e-pošte ob ustvarjanju zahtevka (`onDocumentCreate`)

Posodobite `onLeaveRequestCreated`, da pošlje e-pošto z gumbi za odobritev/zavrnitev dopusta:

```javascript
exports.onLeaveRequestCreated = onDocumentCreated(
  "leaveRequests/{requestId}",
  async (event) => {
    const requestData = event.data.data();
    const requestId = event.params.requestId;

    try {
      // Povezave za odobritev/zavrnitev
      const approveLink = `http://localhost:5001/<PROJECT_ID>/us-central1/processLeaveRequest?action=approve&requestId=${requestId}`;
      const declineLink = `http://localhost:5001/<PROJECT_ID>/us-central1/processLeaveRequest?action=decline&requestId=${requestId}`;

      // Nastavitev e-pošte
      const mailOptions = {
        from: "no-reply@yourdomain.com",
        to: "manager@example.com", // Nadomestite z ustreznim e-poštnim naslovom
        subject: "New Leave Request",
        html: `
          <p>A new leave request has been created:</p>
          <ul>
            <li><b>Name:</b> ${requestData.name}</li>
            <li><b>Start Date:</b> ${requestData.startDate}</li>
            <li><b>End Date:</b> ${requestData.endDate}</li>
          </ul>
          <p>Click the links below to approve or decline the request:</p>
          <a href="${approveLink}">Approve</a> | <a href="${declineLink}">Decline</a>
        `,
      };

      // Pošlji e-pošto
      await transporter.sendMail(mailOptions);
      console.log(`Email sent for leave request ${requestId}`);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
);
```

---

## 3. ✋ Implementacija `onRequest` funkcije za obdelavo odobritev/zavrnitev

Dodajte novo funkcijo `processLeaveRequest`, ki bo obdelala odobritve in zavrnitve dopusta:

```javascript
exports.processLeaveRequest = onRequest(async (req, res) => {
  try {
    const { action, requestId } = req.query;

    if (!action || !requestId) {
      res.status(400).send("Missing required query parameters: action or requestId");
      return;
    }

    // Posodobitev statusa v Firestore
    const requestRef = db.collection("leaveRequests").doc(requestId);
    await requestRef.update({
      status: action === "approve" ? "approved" : "declined",
    });

    console.log(`Leave request ${requestId} has been ${action}`);
    res.status(200).send(`Leave request has been ${action}`);
  } catch (error) {
    console.error("Error processing leave request:", error);
    res.status(500).send("Error processing leave request.");
  }
});
```

---

## 4. 🚀 Zagon in testiranje

### 4.1 Zagon MailHog in emulatorjev
- Zaženite MailHog:
  - **macOS/Linux**: 
    ```bash
    mailhog
    ```
  - **Windows**:
    ```bash
    MailHog.exe
    ```

- Zaženite Firebase emulatorje:
  ```bash
  firebase emulators:start
  ```

### 4.2 Testiranje

1. **Ustvarjanje zahtevka za dopust**:
   - Dodajte nov dokument v zbirko `leaveRequests`.
   - Preverite v MailHog, ali je bila e-pošta poslana.

2. **Klik na gumb za odobritev/zavrnitev**:
   - Kliknite povezavo za odobritev ali zavrnitev v e-pošti.
   - Preverite, ali se status v zbirki `leaveRequests` posodobi.

---

## 5. 📚 Uporabne povezave

- [MailHog](https://github.com/mailhog/MailHog)
- [Firebase Functions Dokumentacija](https://firebase.google.com/docs/functions)
- [Nodemailer Dokumentacija](https://nodemailer.com/about/)

---

🎉 **Čestitke!** Uspešno ste implementirali funkcijo za pošiljanje e-pošte in obdelavo odobritev/zavrnitev zahtevkov.
