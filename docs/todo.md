
# TODO FOR CORE DEMO

	* splash area
	* menu area
	* groups (work)
		- the groups list page should focus on *YOUR* groups foremost; right now it doesn't care who you are
		- groups list area in general needs paging, search filters and so on
		- group editing doesn't let you set privacy of a group - it should
		- we should clarify that the group concept is basically "teams"

		* groups does let you create and register and edit activities - activities are basically "events"

		- group memberships; are we happy with a disjoint concept of a member? should it refer to a profile?

		- permissions per member

	- rooms (tbd); i need a way to list rooms, create them, delete them, manage them, edit their contents

	- artifacts (tbd); i need a way to list artifacts

	- profiles (tbd) in general needs work - right now there's really no ability to say goto /profile/1234 and change an avatar


	- hook up to firebase


	- ! may want to think more about style differentiators between groups, activities, members



# TODO OTHERWISE

- core improvements to do

	- bread crumbs

	- write actual permissions based security layer for posting on client and server

	- there are more re-renders than i like; such as on forms on each prop change...?

	- right now i use "static defaults" and I write props directly onto the object
		both preact and react do this differently; I should use of their name spaces...
		for example it may make more sense to write to .state or .props to separate concerns

	- there is an idea of volatile; this may need to be pulled up to the top level or something
		- this is also important for images


# TODO ELEMENTS

- basic elements polish
	* form builder

	- image uploaders with thumb generators

	- cards non critical features to do
		- test out side by side
		- add sigils

	- collections non critical features to add
		- sort order on client regardless of arrival order!
		- search fancy
		- paging
		- mark and sweep
		- delete
		- collection abstract away from services
		- collection detail url and edit url customized?

- 3d components
	- individual objects
	- 3d map
	- 3d multiplayer space

# TODO STYLE

- style issues?

	- consider simplifying and reducing the base css styles to be more minimal
	- rebassjs.org has some nice style ideas that could be used in cards
	- have a dark style
	- explore fun effects and layouts a bit - purely as a design exploration
		- ie; recreate things like https://www.domestika.org/en/courses/1373-psychedelic-animation-with-photoshop-and-after-effect
		- Also may be worth just enumerating practical transitions and effects:
		- also : https://www.youtube.com/watch?v=YHQ820W8FRw

	? delete style-site -> fold into base



******************************


// this is an unused idea for expressing routes in a more declarative way
router.bundle({
	splash:{
		conditions:(segments)=>{ return (!segments || segments.length<1 || !segments[0].length) },
		success:{element:"splash-page",state:state},
	},
	login:{
		conditions:()=>{ if(state.currentParty) return "/" } // should return a new choice
		success:{element:"login-element",login:db.login.bind(db)}
	},
	signup:{

	},
})

