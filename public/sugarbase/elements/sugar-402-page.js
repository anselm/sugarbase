class Sugar402Page extends HTMLElement {
	connectedCallback() {
		this.innerHTML =
			`<sugar-page>
			<sugar-content>
			<h2>Payment Required: 402</h2>
			</sugar-content>
			</sugar-page>`
	}
}

customElements.define('sugar-402-page', Sugar402Page )
