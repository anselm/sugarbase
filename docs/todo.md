
# TODO

- demo

	- router could actually stuff args into page constructors -> remove need for globals entirely
		- nav bar and main page could then trust they have access to state

	- there is an idea of volatile; this may need to be pulled up to the top level or something

	* fake login is a bit richer; this is desirable for tests
	* menu bar is in
	* groups; shows a list of groups
		* you can add a group
		- paginate
		- search / filter

		- unless i make the card smarter i feel like i would like a custom group card? debate

		- there is kind of an idea of a group detail but the url for it needs volatile support
		- can you edit a group yet? can you delete a group?

		- a group detail should enumerate its events or 'sparks' and also let you add an event

		- a group detail page should link to member list? -> and allow add remove of

	- group people
		- from group detail you can see members in a list of some kind possibly with +/-
		- from group detail you can invite a person by email i presume; or search?
		- you can also click on a person detail
		- from a person detail you can add or remove permissions

	- person settings in general for youself
		- let you pick an avatar
		-

	- event detail
		- show facts about an event
		- edit an event

**********************

- router polish
	- i do make a separate instance of a page per url - examine this a bit closer

- basic elements polish
	* form builder

	- image uploaders with thumb generators

	- cards non critical features to do
		- test out side by side
		- add sigils

	- collections non critical features to add
		- sort order on client regardless of arrival order!
		- search
		- paging
		- mark and sweep
		- delete

- 3d components
	- individual objects
	- 3d map
	- 3d multiplayer space

***************************

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

- refining the fancy demo; firebase issues

	- test real firebase -> does it mirror the ramdb api?
	- test real logging in

	- joined query support? volatile data
		- synthesize nodes together; provide consistent wrapper to firebase, use rxfire?
		- often we want to fill out some extra information when we get say an event, or a room or a post; such as the sponsor profile
		- these can be separate queries on the back end and it is arguable if we should join them on the back or the front
		- i am not sure what sugar does or if firebase can do this itself

	- get profile (a third party may want to get not just a uid but a filled out object on a profile associated with an auth id)
		- i probably needed an extended profile concept

	- database schema permissions

************************

generic crud

	- generic list widget
		[button: search/filter][paging][sort] -> may want to sort by stuff you made versus stuff you are associated with
		[button: create] -> if permitted to make groups/events or so on
		{ list } -> show list of cards of this item... in a short form with various layouts, maybe with an age+activity indicator

		- card view
			[button: edit/del] -> button to these if user has perms (and if we wish to show this here - sometimes may not want that)
			{ image, descr, sponsor-sigil }
			{ age indicator }
			{ activity indicator }

	- detail
		[button: edit/delete ] -> link to these if user has perms
		{ image, descr, sponsor-sigil }

		{ detail activity }?

	- detail activity???

		- this can be just a list widget of a thing
		- for a group this would list recent posts
		- or for an event it could just be recent joins / leaves

		{ a feed of recent activity } -> in a group this can list posts, 
		{ individual posts? }	-> in some senses of the term group, a group manages some content; such as people, posts, activity
		{ participants }		-> in other senses a group just manages participants

	- detail edit
		form editor -> round trip
		private / public / perms


	- detail edit related -> an event or group needs something like this?

		{ add }
		{ participants }(+/-) 		-> it seems like this is the only thing that we need to control here - for groups only


	- 


