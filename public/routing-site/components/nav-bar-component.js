
class NavBarComponent extends HTMLElement {

	constructor() {
		super()
		Services.observe("currentParty",this.connectedCallback.bind(this));
		Services.observe("appName",this.connectedCallback.bind(this));
	}

	connectedCallback() {
//		super.connectedCallback()

		let option = Services.currentParty ? "signout" : "login"
		this.className = "sugar-nav"

		this.innerHTML =
			`<a href="/">/Home</a>
			${Services.appName}
			<a style="float:right" href="/${option}">/${option}</a>
			`

		if(!this.latch)
		this.children[0].animate([ {opacity:0}, {opacity:1}], 1500);
		this.latch = 1

	}

}

customElements.define('nav-bar-component', NavBarComponent ) //, {extends: 'div'} )
