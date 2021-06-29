
// css
document.head.innerHTML += `
	<link type="text/css" rel="stylesheet" href="/basic-site/basic-mobile.css">
	<link type="text/css" rel="stylesheet" href="/basic-site/basic-forms-large.css">
	<link type="text/css" rel="stylesheet" href="/elements-site/sugar-sigils.css">
	`

// grab an example services layer
import '/data-site/data-services.js'

// stuff some data in it
import '/data-site/data-somedata.js'

// elements used here
import "/basic-site/sugar-element.js"
import "./sugar-collection.js"
import "./sugar-image-card.js"
import './elements-page.js'

// run on demand
export async function run() {
	setTimeout(()=>{
		document.body.innerHTML="<elements-page></elements-page>"

	},1000)
}
