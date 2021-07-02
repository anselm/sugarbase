
export class EventsPage extends SugarElement {
	render() {
		return htmlify`
			<sugar-page>
				<sugar-content>
					<h1>A collection example</h1>
					<sugar-form></sugar-form>
					<sugar-collection
						db=${Services.db.observe.bind(Services.db)}
						query=${{table:"event"}}
						card="sugar-card">
					</sugar-collection>
				</sugar-content>
			</sugar-page>`
	}
}
customElements.define('events-page', EventsPage )

