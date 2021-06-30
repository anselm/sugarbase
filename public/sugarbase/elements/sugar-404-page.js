class Sugar404Page extends HTMLElement {
	connectedCallback() {
		this.innerHTML=`<img style="width:100%;height:100%;object-fit:cover" src="/art/sad404.jpg">`
	}
}

customElements.define('sugar-404-page', Sugar404Page )

