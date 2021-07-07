/// stuff some fake data into db

export async function fakedata(db) {

	let george = await db.post({
		id:1000,
		table:"party",
		title:"Blake Jenkins",
		image:"https://upload.wikimedia.org/wikipedia/en/9/91/George_%28novel%29.jpg",
	})

	// member is definitely a distinct concept... right? per group? evaluate
	await db.post({
		id:1001,
		table:"member",
		title:"Blake Jenkins",
		image:"https://upload.wikimedia.org/wikipedia/en/9/91/George_%28novel%29.jpg",
	})

	// a perm on a member
	await db.post({
		id:1002,
		table:"perm",
		title:"Megaphone",
		image:"https://upload.wikimedia.org/wikipedia/en/9/91/George_%28novel%29.jpg",
		parent:1001,
	})

	await db.post({
		id:1010,
		table:"group",
		title:"The Ganymede People",
		image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Ganymede_-_Perijove_34_Composite.png/1280px-Ganymede_-_Perijove_34_Composite.png",
		visibility: "public",
		uid:george.id,
	})

	await db.post({
		id:1011,
		table:"group",
		title:"The Sun People",
		image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/1280px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg",
		visibility: "private",
		uid:george.id,
	})

	await db.post({
		id:1015,
		parentid:1010,
		table:"activity",
		title:"Walking in the rain on Ganymede",
		image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Ganymede_-_Perijove_34_Composite.png/1280px-Ganymede_-_Perijove_34_Composite.png",
		age:"new",
		uid:george.id,
	})

	await db.post({
		id:1020,
		parentid:1010,
		table:"activity",
		title:"Skydiving on Jupiter",
		image:"https://upload.wikimedia.org/wikipedia/commons/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg",
		age:"new",
		uid:george.id,
	})

	await db.post({
		id:1030,
		parentid:1010,
		table:"activity",
		title:"Caving on Mars",
		image:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/1280px-OSIRIS_Mars_true_color.jpg",
		age:"old",
		uid:george.id,
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

