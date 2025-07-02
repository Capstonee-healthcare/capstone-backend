const { db } = require("../config/firebaseAdmin");

exports.completeSession = async (req, res) => {
	const { uid } = req.params;
	const userRef = db.collection("users").doc(uid);
	const userDoc = await userRef.get();

	if (!userDoc.exists) {
		await userRef.set({
			streak: 1,
			badges: {
				day7: false,
				day14: false,
				day30: false,
				day60: false,
				day100: false,
			},
		});
		return res.status(200).json({ message: "User created and streak started" });
	}

	const data = userDoc.data();
	const newStreak = (data.streak || 0) + 1;
	const badges = data.badges || {};

	const updateBadges = { ...badges };

	// Check for milestones
	if (newStreak === 7) updateBadges.day7 = true;
	if (newStreak === 14) updateBadges.day14 = true;
	if (newStreak === 30) updateBadges.day30 = true;
	if (newStreak === 60) updateBadges.day60 = true;
	if (newStreak === 100) updateBadges.day100 = true;

	await userRef.update({
		streak: newStreak,
		badges: updateBadges,
	});

	res
		.status(200)
		.json({ message: "Streak updated", newStreak, badges: updateBadges });
};
