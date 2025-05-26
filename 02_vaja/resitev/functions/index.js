const { onCall } = require("firebase-functions/v2/https");

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
