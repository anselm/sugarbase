
# TODO

- demo
	* a splash page
	* a menu
	* a concept of groups overall; with CRUD on groups
	* a concept of group events
	- event edit polish -> mimic group stuff
	- a concept of group members
		- should i have a separate table entry for each member per group - separate from party?
	- a concept of group member permissions (associated with this group only!)

	- go through all the kinds and change usage from table to kind
		(i want to reserve table for actual tables)

	- cards: improve the cards and make them different for different areas
	- person: pick avatar

	- finesse volatile support and url building

**********************

- core improvements to do

	- bread crumbs

	- write actual permissions based security layer for posting on client and server

	- there are more re-renders than i like; such as on forms on each prop change...?

	- right now i use "static defaults" and I write props directly onto the object
		both preact and react do this differently; I should use of their name spaces...
		for example it may make more sense to write to .state or .props to separate concerns

	- router now does stuff args into page constructors -> remove need for globals entirely
		- nav bar and main page could then trust they have access to state

	- there is an idea of volatile; this may need to be pulled up to the top level or something
		- this is also important for images

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


