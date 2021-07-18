
import "/__/firebase/8.6.8/firebase-app.js"
import "/__/firebase/8.6.8/firebase-auth.js"
import "/__/firebase/8.6.8/firebase-firestore.js"
import "/__/firebase/init.js?useEmulator=true"

let firestore = firebase.firestore()

firestore.enablePersistence().catch((err) => {
	if (err.code == 'failed-precondition') {
		console.error("Attempted to turn on persistence but the app is open in more than one tab")
	} else if (err.code == 'unimplemented') {
		console.error("Attempted to turn on persistence but the browser does not support this")
	} else {
		console.error(err)
	}
})

class DB {

	constructor() {
		this.jobcounter = 1
		this.jobs = {}
		this.authenticate = this.authenticate.bind(this) // bind more aggressively...
	}

	///
	/// volatile() helps provide transient volatile information on an object so that it is more useful for the display layer
	///
	/// I've found it is useful to populate retrieved data objects with extra state
	/// For example local artifacts may have a hyperlink or path in the web app
	/// Or they may have associated images that are used for layout
	/// Or it is nice to provide an insitu copy of a related object, say to decorate a post with the parent areas glyph
	/// Because firebase uses dynamic urls it isn't always possible to statically embed all facts related to this artifact
	///
	/// Because this routine involves high level layout choices, it is a stub here, that can be overridden.
	///

	volatile(obj) { return obj }

	///
	/// sanitize
	/// some of this should be on server

	sanitize(obj) {
		// TODO actual field limitations should not be in core but rather in userland - ideally schema managed.
		// sanitize and tidy up
		// other approaches:
		// 		replace(/(\r\n|\n|\r)/gm, "")
		//		replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
		let text_sanitize = (field) => {
			if (typeof field === 'string' || field instanceof String) {
				return field.trim().substring(0,2000).replace(/(<([^>]+)>)/ig, '')
			}
			throw "Field is not a string"
		}

		let permitted = {
			id:0,
			table:0,
			title:text_sanitize,
			descr:text_sanitize,
			image:0,
			visibility:0,
			created:0,
			updated:0,
			uid:0,

			// for activity
			parent:0,
			start:0,
			end:0,
			location:0,

		}
		let saveme = {}
		Object.entries(obj).forEach( ([key,value]) => {
			if(!permitted.hasOwnProperty(key)) throw `Illegal field name ${key}`
			let helper = permitted[key]
			saveme[key] = helper ? helper(value) : value
		})

		return saveme
	}

	///
	/// client side posting of data
	/// note that this posts *differences* -> so you can post a partial object to update part of an object
	/// note also this whole routine really should be a server side function!
	///
	/// there are so many chores here to do this well, and so many security issues that it is best to do on server
	/// things like:
	///		- make sure no illegal fields are set and throw an error if so
	///		- triggers to increment counters in other objects
	///		- permisssions
	///		- rate limiting
	///		- object specific tests such as are fields in the right range, does parent exist and so on
	/// firebase has a philosophy of using a separate special database constraint grammar
	/// but that simply cannot capture the range of tests and related details that are needed; and it is a new grammar
	/// may as well just do everything in javascript on the server side
	///

	async post(obj) {

		// sanity checks
		let auth = firebase.auth().currentUser
		if(!auth) throw "User not logged in"
		if(!obj || !obj instanceof Object) throw "Invalid post no content"

		// id is optional; will create new otherwise - note that id is *not* actually a property of the object on the server; firebase stores id outside of the object
		let id = obj.hasOwnProperty("id") && obj.id && obj.id.length ? obj.id : 0

		// table is required - note that the table is *not* actually a property in the object on the server but is just passed here because we need it
		let table = obj.hasOwnProperty("table") && obj.table && obj.table.length ? obj.table : 0
		if(!table) throw "Invalid post no table"

		// sanitize... TODO
		let saveme = obj

		// create or update?
		let doc = 0
		let previous = 0
		let firestore_table = firestore.collection(table)
		if(id) {
			doc = await firestore_table.doc(id)
			previous = await doc.get()
			previous = previous && previous.exists ? previous.data() : 0
console.log(previous)
		} else {
			doc = firestore_table.doc()
		}

		// prepare for writing; clear a few fields that should not be stored inside the table
		saveme.uid = auth.uid
		delete saveme.id
		delete saveme.table
		delete saveme.volatile
		delete saveme.change

		// set timestamps
		saveme.updated = firebase.firestore.Timestamp.now() // admin.firestore.FieldValue.serverTimestamp()
		if(!previous) saveme.created = saveme.updated

		// write and then wait for entire document to return (get merges)
		let result = 0
		await doc.set(saveme,{merge:true})
		let doc2 = await firestore_table.doc(doc.id).get()
		if(!doc2) throw "Could not fetch data after write"
		result = doc2.data()
		if(!result) return 0

		// - this is a good time to update counts of related objects
		// - this is also a good time to log any actions for analytics; or notify anybody else who cares

		// stuff these properties back in for convenience
		result.id = doc2.id
		result.table = table
		this.volatile(result)

		return result
	}

	/// remove

	async remove(obj) {

// TODO

	}

	///
	/// query by example
	///

	async query(obj) {
		let table = obj.table
		if(!table || !table.length) throw "must supply table"

		// query by id
		if(obj.id) {
			let doc = await firestore.collection(table).doc(obj.id).get()
			if(!doc || !doc.exists) {
				return []
			}
			let result = doc.data()
			result.id = doc.id
			result.table = table
			result.change = "query"
			this.volatile(result)
			return [result]
		}

		let query = firestore.collection(table)
		Object.entries(obj).forEach( ([k,v]) => {
			if(k == "table") return
			query = query.where(k,"==",v)
		})
		let snapshot = await query.get()
		let results = []
		snapshot.docs.forEach(doc=>{
			let result = doc.data()
			result.id = doc.id
			result.table = table
			result.change = "query"
			this.volatile(result)
			results.push(result)
		})

		return results
	}

	///
	/// observe or stop observing server side changes on a query by example; returning an array of results
	///

	async observe(job,rules=0,callback=0) {

		// no changes to rule itself? just update callback and get out
		if(job && rules && JSON.stringify(rules) === JSON.stringify(job.rules)) {
			job.callback = callback
			job.status = "stale"
			return job
		}

		// always stop job if any
		if(job && job.stop) {
			job.stop()
			job.stop = 0
		}

		// caller may have just wanted to stop observing - so return no job
		if(!callback) return 0

		// caller has supplied an empty query; doesn't seem useful to do this here?
		if(!rules) return 0

		// - todo peel out offset, limit, order
		let table = rules.table
		let ordering = rules.ordering
		if(!table) throw "must supply table"

		// make a new job
		job = {
			stop:0,
			myquery:0,
			rules:rules,
			callback:callback,
			table:table,
			status:"fresh"
		}

		// reconstitute queuy
		job.myquery = firestore.collection(table)

		//rules.forEach(trigram=>{ job.myquery = job.myquery.where(...trigram) })
		Object.entries(rules).forEach( ([k,v]) => {
			if(k == "table") return
			job.myquery = job.myquery.where(k,"==",v)
		})

		// todo improve - note current default ordering produces newest results first - which is nicest for mindlessly painting to current display layout
		if(ordering) job.myquery = job.myquery.orderBy(ordering,"desc").limit(100)

		// run new till stopped
		job.stop = job.myquery.onSnapshot(async snapshot=>{
			let changes = snapshot.docChanges()
			let results = []
			changes.forEach(change => {
				let id = change.doc.id
				let thing = change.doc.data()
				if(!thing) {
					console.warn("Hmm, observed a deletion on " + doc.id)
					if(callback)callback({id:doc.id,change:"removed"})
				} else {
					thing.id = change.doc.id
					thing.table = table
					thing.change = change.type
					this.volatile(thing)
					results.push(thing)
				}
			})
			job.callback(results)
		})

		return job
	}

	authenticate(user=0) {
		// do not handle login at all - firebase will fire an onauthstatechanged through its ux element
		if(user) return 0
		// logout... (which will trigger an onauth as well by firebase)
		return firebase.auth().signOut()
	}

	onauth(callback) {
		firebase.auth().onAuthStateChanged(user => { callback(user) })
	}
}

export let db = new DB();
