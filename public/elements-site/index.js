
// a page with elements
import './pages/elements-page.js'

export async function run() {

	document.body.innerHTML="<elements-page></elements-page>"

}

// minimalist mobile friendly styling - just stuff this in right now - typically you should put it in index.html to reduce flickering

document.head.innerHTML += `<link type="text/css" rel="stylesheet" href="/styles-site/style/mobile/basic.css">`
