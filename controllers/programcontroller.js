const { db } = require("../config/firebaseAdmin");

const getProgramById = async (req, res) => {
	const { id } = req.params;

	try {
		const docRef = db.collection("programs").doc(id);
		const doc = await docRef.get();

		if (!doc.exists) {
			return res.status(404).json({ message: "Program not found" });
		}

		return res.status(200).json({ id: doc.id, ...doc.data() });
	} catch (error) {
		console.error("🔥 Error fetching program:", error); // <-- Log error here
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

module.exports = { getProgramById };
