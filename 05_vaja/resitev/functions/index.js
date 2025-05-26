const { onCall, onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated, onDocumentUpdated, onDocumentDeleted } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

// Nastavitev lokalnega SMTP strežnika
const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025, // Port MailHog strežnika
  secure: false,
  ignoreTLS: true,
});

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

exports.onLeaveRequestCreated = onDocumentCreated(
  "leaveRequests/{requestId}",
  async (event) => {
    const requestData = event.data.data();
    const requestId = event.params.requestId;

    try {
      // Povezave za odobritev/zavrnitev
      const approveLink = `http://localhost:5001/faasnaloge/us-central1/processLeaveRequest?action=approve&requestId=${requestId}`;
      const declineLink = `http://localhost:5001/faasnaloge/us-central1/processLeaveRequest?action=decline&requestId=${requestId}`;

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

exports.onLeaveRequestUpdated = onDocumentUpdated(
  "leaveRequests/{requestId}",
  (event) => {
    console.log("Leave request updated:");
    console.log("Before:", event.data.before.data());
    console.log("After:", event.data.after.data());
  }
);

exports.onLeaveRequestDeleted = onDocumentDeleted(
  "leaveRequests/{requestId}",
  (event) => {
    console.log("Leave request deleted:", event.data);
  }
);
