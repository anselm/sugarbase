
export class NavBarElement extends HTMLElement {

	connectedCallback() {
		this.obs = Services.state.observe(this.obs,"currentParty",this.connectedCallback.bind(this))
		let party = Services.state.currentParty
		this.innerHTML=
					`<sugar-page><sugar-content><sugar-nav>
					<a href="/">/</a>
					<a style="float:right;${party?"display:none":""}" href="/login">/Login</a>
					<a style="float:right;${!party?"display:none":""}" href="/menu">/Menu</a>
					</sugar-nav></sugar-content></sugar-page>`

	}

	disconnectedCallback() {
		// this.obs = Services.state.observe(this.obs)
	}

}

customElements.define('nav-bar-element', NavBarElement ) 
