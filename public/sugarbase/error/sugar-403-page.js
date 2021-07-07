class Sugar403Page extends HTMLElement {
	connectedCallback() {
		this.innerHTML =
			`<sugar-page>
			<sugar-content>
			<h2>Not Authorized: 403</h2>
			</sugar-content>
			</sugar-page>`
	}
}

customElements.define('sugar-403-page', Sugar403Page )
