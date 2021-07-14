
- federated version of this? so that people can deploy their own copy
- 


# TODO CORE DEMO

	-> i think a nav bar should basically be something like: [home/flocks][map][network][...]

	-> home page -> use flocks page

	- many flocks page
		- i feel like i will show the most relevant flocks to you (yours or interesting); which you can set filters on -> maybe view as map

	- a single flock page lists activities in that flock
		- and a flock also has a general edit page for its various basic settings; and maybe admins can add or remove people here
		- and probably a link to see members
		- may have a map mode

	- many activities page
		- i will probably have an activities widget that can enumerate many activities; but i may only use it in a group

	- a single activity page is basically just a detail on some activity; more or less a post or an event
		it can have a location, and a time, and participants (people who have chosen or have been invited to participate)
		it can have a reward; and it can be a pretty random kind of thing like "show me 3 silver onyx to get a brass obleisk"
		there may also be a conversation here; basically responses; but pretty deprecated, pretty simple; should basically be realtime chat

		- single activity editing page
			- show activity name/title
			- let you see people in your group that you can specifically invite to this activity? or i can simply not bother (invite entire group)??

	-> your network page
		- list your follows and followers and so on
		- can you favorite posts as well?

	- notifications

	- many profiles
		- this may be used bo the network page for example

	- a single profile
		- this is for the benefit of others as well as oneself
		- show a large depiction
		- float some useful information such as important upcoming activities and flocks that party is in and their collections
		- your collectables will be in a sub page here
		- there is a simple edit page here too

	- picker for page of art assets

# TODO WIDGETS

	* 3d spinner
		- try move a few dependencies out of main index.html to modules
	- 3d picker
	- finish image uploader
	- 3d map
	- firebase

# TODO OTHERWISE

	- render() is doing a full rebuild (as per my design) but this is incredibly expensive if page has expensive components.

	- bread crumbs?

	- write actual permissions based security layer for posting on client and server

	- there are more re-renders than i like; such as on forms on each prop change...?

	- right now i use "static defaults" and I write props directly onto the object
		both preact and react do this differently; I should use of their name spaces...
		for example it may make more sense to write to .state or .props to separate concerns

	- there is an idea of volatile; this may need to be pulled up to the top level or something
		- this is also important for images

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

