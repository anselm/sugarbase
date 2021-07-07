
// css - you may want to statically declare these in header to reduce flickering
document.head.innerHTML += `<link href="https://fonts.googleapis.com/css2?family=Reenie+Beanie&display=swap" rel="stylesheet">`
//document.head.innerHTML += `<link type="text/css" rel="stylesheet" href="/sugarbase/sticky/sticky.css" />`

var style = document.createElement('style');
style.innerHTML = `
	sticky-note {
		position:absolute;
		right:20px;
		top:120px;

		text-decoration:none;
		color:blue;
		background:#ffc;
		display:block;
		xheight:10em;
		width:10em;
		padding:1em;
		box-shadow: -5px 5px 7px rgba(33,33,33,.7);
		transition: transform .15s linear;
		transform: rotate(-6deg);
		font-family: 'Reenie Beanie';
		font-weight: normal;
		font-size: 1.6rem;
	}

	sticky-note h2 {
		font-weight: bold;
		font-size: 2rem;
	}
	 
	sticky-note:hover {
	  box-shadow:-10px 10px 7px rgba(0,0,0,.7);
	  transform: scale(1.25);
	  z-index:5;
	}
	`		
document.head.prepend(style)

export class StickyNote extends HTMLElement {
}

customElements.define('sticky-note', StickyNote )
