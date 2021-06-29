/// stuff some fake data into our fake db

let services = window.Services

async function populate() {

	let george = await services.post({
		table:"party",
		title:"Blake Jenkins",
		image:"https://upload.wikimedia.org/wikipedia/en/9/91/George_%28novel%29.jpg",
	})

	await services.post({
		table:"event",
		title:"Walking in the rain on Ganymede",
		image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Ganymede_-_Perijove_34_Composite.png/1280px-Ganymede_-_Perijove_34_Composite.png",
		sponsor:1,
		uid:george.id,
	})

	await services.post({
		table:"event",
		title:"Skydiving on Jupiter",
		image:"https://upload.wikimedia.org/wikipedia/commons/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg",
		sponsor:1,
		uid:george.id,
	})

	await services.post({
		table:"event",
		title:"Caving on Mars",
		image:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/1280px-OSIRIS_Mars_true_color.jpg",
		sponsor:1,
		uid:george.id,
	})

	// internal test
	let job = await services.observe(0,{
		table:"party",
		title:"Blake Jenkins",
	},(results)=>{
		//console.log("Test success: observe got results")
	})

	// paranoia validation test of code
	let results = await services.query({table:"party",title:"Blake Jenkins"})
	if(!results.length) throw "Error: should have matched"

}

populate()

