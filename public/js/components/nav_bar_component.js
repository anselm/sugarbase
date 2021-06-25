
class NavBarComponent extends HTMLElement {

	constructor() {
		super()
		let scope = this
		window.appstate.observe("currentParty",this.redraw.bind(this));
	}

	async redraw() {

		let party = window.appstate.currentParty ? "party" : "login"

		this.style="width:100%;height:40px"
		this.innerHTML =
			`
			<div class='subpage' style="background:rgba(235,235,255,0.7);font-size:2em;">
				<a href="/">/Home</a>
				<a style="float:right" href="/${party}">${party}</a>
			</div>
			`
	}
}

customElements.define('nav-bar-component', NavBarComponent )

