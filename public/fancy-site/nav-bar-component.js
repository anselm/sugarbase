
export class NavBarComponent extends SugarElement {

	static get observedAttributes() {
		return ['title'];
	}

	constructor() {
		super()
		Services.state.observe("currentParty",this.connectedCallback.bind(this));
		Services.state.observe("appName",this.connectedCallback.bind(this));
	}

	connectedCallback() {
		this.render()
	}

	disconnectedCallback() {
	}

	attributeChangedCallback() {
		// up to you do do whatever you want here
		this.render();
	}

	render() {
		console.log("********** drawing nav **********")
		let option = Services.state.currentParty ? "signout" : "login"
		let title = this.title ? this.title : "💣💣💣"
		this.innerHTML =
			`<sugar-nav>
			<a href="/">/Home</a>
			${Services.state.appName} ${title}
			<a style="float:right" href="/${option}">/${option}</a>
			</sugar-nav>`

		if(!this.latch)
		this.children[0].animate([ {opacity:0}, {opacity:1}], 1500);
		this.latch = 1
	}

}

customElements.define('nav-bar-component', NavBarComponent ) 
