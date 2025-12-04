const { db } = require("../config/firebaseAdmin");

exports.completeSession = async (req, res) => {
	// Get UID from authenticated user (from JWT token)
	const authenticatedUid = req.user.uid;
	
	// Get UID from URL params
	const { uid } = req.params;

	// Security check: Ensure the authenticated user matches the requested UID
	if (authenticatedUid !== uid) {
		return res.status(403).json({
			error: "Forbidden",
			message: "You can only update your own data.",
		});
	}

	const userRef = db.collection("users").doc(uid);
	const userDoc = await userRef.get();

	const today = new Date().toLocaleDateString("en-CA", {
		timeZone: "America/Vancouver", // 👈 Vancouver date
	}); // format: YYYY-MM-DD

	if (!userDoc.exists) {
		const newUserData = {
			streak: 1,
			exerciseCompleted: true,
			lastCompletedDate: today,
			badges: {
				day7: false,
				day14: false,
				day30: false,
				day60: false,
				day100: false,
			},
		};

		await userRef.set(newUserData);
		return res.status(200).json({
			message: "User created and streak started",
			...newUserData,
		});
	}

	const data = userDoc.data();
	const lastDate = data.lastCompletedDate || null;

	// Reset exerciseCompleted to false if it's a new day
	if (lastDate !== today && data.exerciseCompleted === true) {
		await userRef.update({
			exerciseCompleted: false,
		});
	}

	// Already done today
	if (lastDate === today && data.exerciseCompleted === true) {
		return res.status(200).json({
			message: "Exercise already completed today",
			streak: data.streak,
			exerciseCompleted: true,
			badges: data.badges,
		});
	}

	// Increment streak if yesterday was last completed
	let newStreak = 1;
	if (lastDate) {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		const expected = yesterday.toLocaleDateString("en-CA", {
			timeZone: "America/Vancouver",
		});
		if (lastDate === expected) {
			newStreak = data.streak + 1;
		}
	}

	//  Badge milestone logic
	const badges = data.badges || {};
	if (newStreak === 7) badges.day7 = true;
	if (newStreak === 14) badges.day14 = true;
	if (newStreak === 30) badges.day30 = true;
	if (newStreak === 60) badges.day60 = true;
	if (newStreak === 100) badges.day100 = true;

	await userRef.update({
		streak: newStreak,
		exerciseCompleted: true,
		lastCompletedDate: today,
		badges,
	});

	res.status(200).json({
		message: "Streak updated",
		streak: newStreak,
		exerciseCompleted: true,
		badges,
	});
};
