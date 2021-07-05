
export class EventsPage extends SugarElement {
	render() {
		return htmlify`
			<sugar-page>
				<sugar-content>
					<h1>A bunch of events</h1>
					<a href="/event/edit">Create an event (in a group)</a>
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

export class EventDetailPage extends SugarElement {
	render() {
		return htmlify`
			<sugar-page>
				<sugar-content>
					<h1>Event Detail Page</h1>
					<a href="/event/edit/1234">Link to edit this event</a>
					<br/>
					<a href="/response/create">Add a response on this event</a>
					<br/>
					<h1>Responses on Event</h1>
					<sugar-collection
						observe=${Services.db.observe.bind(Services.db)}
						query=${{table:"response"}}
						card="sugar-card">
					</sugar-collection>
					<br/>
				</sugar-content>
			</sugar-page>`
	}
}
customElements.define('event-detail-page', EventDetailPage )


export class EventEditPage extends SugarElement {
	render() {


		let subject = {
			id:0,
			table:"event",
			title:"my event",
			url:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/1920px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg",
			image:"my image"
		}

		let schema = {
			id:     {rule:"id",       },
			title:  {rule:"string",   },
			url:    {rule:"string",   },
			image:  {rule:"image",    },
			map:    {rule:"map",      },
			descr:  {rule:"textarea", },
			start:  {rule:"date",     },
			end:    {rule:"date",     },
			submit: {rule:"submit",   },
			remove: {rule:"remove",   },
			cancel: {rule:"cancel",   },
		}

		return htmlify`
			<sugar-page>
				<sugar-content>
					<h1>Event Edit</h1>
					<sugar-form subject=${subject} schema=${schema}></sugar-form>
				</sugar-content>
			</sugar-page>`
	}
}
customElements.define('event-edit-page', EventEditPage )
