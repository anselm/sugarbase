
class NavBarComponent extends HTMLElement {

	constructor() {
		super()
		window.appstate.observe("currentParty",this.redraw.bind(this));
	}

	redraw() {

		let option = window.appstate.currentParty ? "signout" : "login"
		let message = window.appstate.currentParty ? `Welcome ${window.appstate.currentParty.displayName}` : "Please Login"

		this.style="width:100%;height:40px"
		this.innerHTML =
			`
			<div class='subpage' style="background:rgba(235,235,255,0.7);font-size:2em;">
				<a href="/">/Home</a>
				${message}
				<a style="float:right" href="/${option}">${option}</a>
			</div>
			`
	}

}

customElements.define('nav-bar-component', NavBarComponent )

