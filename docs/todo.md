
todos
	* hook up firebase at least crudely
		- test; can i make posts, can i browse, login, edit, do auth events work in a plausible way?
		- fix observability
		- see if there is a real time response

	- demonstrate permissions and powers in some way

	- switch to lit.dev

	- image uploading; and fleshing out volatile -> especially would be nice to have sponsor and so on

	- federated version of this? so that people can deploy their own copy; think about it


# DEMO UX

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

	- a single profile
		- this is for the benefit of others as well as oneself
		- show a large depiction
		- float some useful information such as important upcoming activities and flocks that party is in and their collections
		- your collectables will be in a sub page here
		- there is a simple edit page here too

	- picker for page of art assets

# TODO CORE PROPS

	- bread crumbs?

	- write actual permissions based security layer for posting on client and server

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
		- 3d map
		- 3d multiplayer space

# TODO STYLE

	- have a dark style
	- consider simplifying and reducing the base css styles to be more minimal
	- rebassjs.org has some nice style ideas that could be used in cards
	- explore fun effects and layouts a bit - purely as a design exploration
		- ie; recreate things like https://www.domestika.org/en/courses/1373-psychedelic-animation-with-photoshop-and-after-effect
		- Also may be worth just enumerating practical transitions and effects:
		- also : https://www.youtube.com/watch?v=YHQ820W8FRw
