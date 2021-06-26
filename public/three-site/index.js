
// use some basic site parts

import '/basicsite/basicsite.js'

// start site

export async function run() {

	// set app name

	Services.set({appName:"threedsite"})

	document.body.innerHTML="<sugar-gltf></sugar-gltf>"

}
