const { onCall, onRequest } = require("firebase-functions/v2/https");

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

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

