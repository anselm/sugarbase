/// stuff some fake data into db

export async function somedata(db) {

	let george = await db.post({
		table:"party",
		title:"Blake Jenkins",
		image:"https://upload.wikimedia.org/wikipedia/en/9/91/George_%28novel%29.jpg",
		id:1000,
	})

	await db.post({
		table:"member",
		title:"Blake Jenkins",
		image:"https://upload.wikimedia.org/wikipedia/en/9/91/George_%28novel%29.jpg",
		id:1001,
	})

	await db.post({
		table:"perm",
		title:"Megaphone",
		image:"https://upload.wikimedia.org/wikipedia/en/9/91/George_%28novel%29.jpg",
		id:1002,
	})

	await db.post({
		table:"group",
		title:"The Sky People",
		image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Ganymede_-_Perijove_34_Composite.png/1280px-Ganymede_-_Perijove_34_Composite.png",
		sponsor:1,
		uid:george.id,
		id:1010,
	})

	await db.post({
		table:"event",
		title:"Walking in the rain on Ganymede",
		image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Ganymede_-_Perijove_34_Composite.png/1280px-Ganymede_-_Perijove_34_Composite.png",
		sponsor:1,
		uid:george.id,
		id:1010,
	})

	await db.post({
		table:"event",
		title:"Skydiving on Jupiter",
		image:"https://upload.wikimedia.org/wikipedia/commons/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg",
		sponsor:1,
		uid:george.id,
		id:1020,
	})

	await db.post({
		table:"event",
		title:"Caving on Mars",
		image:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/1280px-OSIRIS_Mars_true_color.jpg",
		sponsor:1,
		uid:george.id,
		id:1030,
	})
}

export async function testdb(db) {
	// internal test
	let job = await db.observe(0,{
		table:"party",
		title:"Blake Jenkins",
	},(results)=>{
		//console.log("Test success: observe got results")
	})

	// paranoia validation test of code
	let results = await db.query({table:"party",title:"Blake Jenkins"})
	if(!results.length) throw "Error: should have matched"	
}

