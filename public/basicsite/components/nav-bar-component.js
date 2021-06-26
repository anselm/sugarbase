
class NavBarComponent extends HTMLElement {

	constructor() {
		super()
		Services.observe("currentParty",this.connectedCallback.bind(this));
		Services.observe("appName",this.connectedCallback.bind(this));
	}

	connectedCallback() {

		let option = Services.currentParty ? "signout" : "login"

		this.style="width:100%;height:40px"

		let childstyle=`
			background:rgba(235,235,255,0.7);
			font-size:2em;
    		`

		this.innerHTML =
			`<div class='subpage' style="${childstyle}">
				<a href="/">/Home</a>
				${Services.appName}
				<a style="float:right" href="/${option}">/${option}</a>
			</div>
			`

		if(!this.latch)
		this.children[0].animate([ {opacity:0}, {opacity:1}], 1500);
		this.latch = 1

	}

}

customElements.define('nav-bar-component', NavBarComponent )

