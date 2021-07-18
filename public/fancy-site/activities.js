
export class ActivitiesPage extends SugarElement {
	// must be associated with group
	render() {
		if(!this.parent || !this.parent.id) throw "must have a parent"
		return htmlify`
			<sugar-page>
				<sugar-content>
					<h1>Group: ${this.parent.title}</h1>
					<sugar-card artifact=${this.parent}></sugar-card>
					<h3>Activities in this group:</h3>
					<a href="/group/${this.parent.id}/activity/create">[Create a new activity in this group]</a>
					<br/>
					<sugar-collection
						observe=${Services.db.observe.bind(Services.db)}
						query=${{table:"activity",parentid:this.parent.id}}
						card="sugar-card">
					</sugar-collection>
				</sugar-content>
			</sugar-page>
			`
	}
}
customElements.define('activities-page', ActivitiesPage )

export class ActivityDetailPage extends SugarElement {
	static defaults = {
		subject:0 // if subject changes then force update
	}
	render() {
		if(!this.parent || !this.parent.id) throw "must have a parent"
		if(!this.subject || !this.subject.id) throw "must exist"
		let parentid = this.parent.id
		let id = this.subject.id

		return htmlify`
			<sugar-page>
				<sugar-content>
					<h1>Activity: ${this.subject.title}</h1>
					<sugar-card artifact=${this.subject}></sugar-card>
					<a href="/group/${parentid}/activity/${id}/edit">[Edit this activity]</a>
					<br/>
					<h3>Comments on this activity:</h3>
					<sugar-collection
						observe=${Services.db.observe.bind(Services.db)}
						query=${{table:"response",parentid:id}}
						card="sugar-card">
					</sugar-collection>
				</sugar-content>
			</sugar-page>


<sticky-note contenteditable="true">
<h2>An activity</h2>
<br/>
Activities are something that can happen within a group.
An admin can make an activity.
Activities may have a start and end date and a room.
Everybody in the group is always invited to every activity in the group.
</sticky-note>


			`
	}
}
customElements.define('activity-detail-page', ActivityDetailPage )


///
/// Caller is expected to inject a subject
///

export class ActivityEditPage extends SugarElement {
	static defaults = {
		subject:0 // if subject changes then force update
	}
	render() {

		let subject = this.subject
		if(!subject) subject = {table:"activity",parentid:this.parent.id}

		let schema = {
			id:     {rule:"id",       },
			title:  {rule:"string",   label:"Title"  },
			descr:  {rule:"textarea", label:"Description" },
			image:  {rule:"image",    label:"Image"},
			start:  {rule:"date",     label:"Begins at"},
			end:    {rule:"date",     label:"Ends at"},
			location: {rule:"string",   label:"Takes place in room named:"},
			submit: {rule:"submit",   label:"Submit" },
			remove: {rule:"remove",   label:"Delete" },
			cancel: {rule:"cancel",   label:"Cancel" },
		}

		let submit = async (subject) => {
			let result = await Services.db.post(subject)
			if(result && result.id) {
				window.history.pushState({},result.volatile.url,result.volatile.url)
			} else {
				alert("Could not post!")
			}
		}

		return htmlify`
			<sugar-page>
				<sugar-content>
					<h1>${subject.id?"Edit":"Create"} Activity</h1>
					<sugar-form subject=${subject} schema=${schema} submit=${submit}></sugar-form>
				</sugar-content>
			</sugar-page>`
	}
}

customElements.define('activity-edit-page', ActivityEditPage )
