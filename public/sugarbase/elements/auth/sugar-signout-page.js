export class SugarSignoutPage extends SugarElement {
	connectedCallback() {
		this.innerHTML =
			`<sugar-page>
				<sugar-content>
					<h1>You have been signed out</h1>
				</sugar-content>
			</sugar-page>`
		if(this.signout) this.signout()
	}
}
SugarElement.register(SugarSignoutPage) // same as customElement.define
