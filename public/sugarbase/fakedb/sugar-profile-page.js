export class SugarProfilePage extends HTMLElement {
	connectedCallback() {
		this.innerHTML =
			`<sugar-page>
				<sugar-content>
					<h1>Your profile page</h1>
				</sugar-content>
			</sugar-page>
<sticky-note contenteditable="true">
<h2>Your Page</h2>
<br/>
Typically this can show your own recent activity and link to other useful pages.
</sticky-note>
			`
	}
}
customElements.define('sugar-profile-page', SugarProfilePage )

