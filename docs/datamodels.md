
# Data models for typical multiplayer apps

There are many theories of how databases should represent state; should classes of objects be disjoint, should tables be fully normalized and so on. But loosely speaking what are the distinct kinds of data objects typical multiplayer apps are concerned with? What are the disjoint database tables that are needed at a minimum to capture these kinds of typical apps?

Let's think about a typical many player web service/app such as a say EventBrite, Zoom, Reddit or even Mozilla Hubs (a 3d virtual multiplayer space) - what are the kinds of database tables an experience like these ones needs?

## Authentication Table

Authentication is often is conflated with a participant profile but in fact cloud database systems (namely firebase) are going to be focused on simply validating user emails and passwords. They do not allow extended information on the raw authentication account - so extended information about the user (their avatar, their dietary preferences, is kept elsewhere). It's best to think of authentication as separate from the rest of an app - even though it technically is often a "table" or class of objects. It typically looks something like this:

```javascript
class auth {
	id,
	displayName,
	depiction,
	email,
	created,
	updated,
}
```

## Artifact Table

I use the term "Artifacts" to indicate content that is created by participants - that is not built in.

Artifacts are often self-similar having a creator, permissions, title, an associated image, a description, creation date, last update. The primary feature of artifacts is that they are often related to each another: such as a person is in one or more teams, or a person is in one or more chat sessions, or a post is in one group.

What kinds of artifacts do typical systems have? In Eventbrite we have users and events and tickets. In Zoom we have users and events and actual zoom sessions (which are in effect a proxy of the event). In Reddit we have users, subs, posts and responses. In Mozilla Hubs we have users, abstract rooms, and room instances - as well as the products of user activity such as created objects and user movement.

While separate database tables can be used to represent each kind of artifact, because artifacts are so self-similar it can make sense to use a beefy-base-class anti-pattern to capture the concept.

The main win with a beefy-base-class is that relationships can be created without having to manage complex inter-table relationships. Also ux components can then generally present the single concept without having many variations of ux components for each slight variation in schema.

 A typical catch all schema here might be:

```javascript
class artifact {
	id,
	authid, // nominally who owns it
	fromid,	// sometimes an artifact is a clone of some other artifact
	kind,	// is a cluster, is a room, is a team, is an event, is a player?
	title,
	descr,
	url,  	// art assets
	xyz,	// position
	ypr,	// rotation
	whd,	// scale
	parent,	// is it inside some other object?
	created,
	updated,
}
```

Let's classify typical artifacts:

1. Participants - authenticated users are typified by having a title, an associated image, a description. Effectively a participant is the "in game" proxy or representation of an authenticated log-in account - it's the equivalent of your character in a D&D game or a monopoly player piece; in a 3d game this would be a persons avatar. It's just one more in-game object that is a place-holder to visually represent your state for yourself and for other users.

2. Lobbies, Spaces, Rooms, Forums - a "place" where participants engage in interactions also appears to be a kind of content itself. A space may collect participants briefly, or persistently. A space may be transient or not. Spaces may restrict participation.

3. Teams - aggregates of related people also are arguably a kind of grouping mechanism; but may be redundant. Not all products have a separate concept of teams because it is close to the concept of a space in general (why group as a team when you can just group people in a room?). Many apps only have a literal grouping concept of a game world; such as a "sub" - rather than a distinct concept of a grouping of people and then separately a place where they can go to. In a sense a team is always in a place in a service like Reddit.

4. Larger clusterings - another sometimes present clustering concept is to group "groups of teams" or "groups of rooms" together into a constellation of related parties. This can be used to indicate concepts like "a company" that has "teams". It implies some trust and some relationship. It may make sense to generally support some level of grouping abstraction.

5. Posts. Humans often mediate interaction with each other not directly but through a mediation object. This is a well known phenomena from child psychology where we see young children typically learning to interact with other humans by first both interacting through a third proxy object that they're both manipulating. Often in games or digital experiences there is a similar kind of anchoring spark or impetus for other interactions. For some systems an "event" is the spark, for other systems (such as Reddit) a "post" is the spark around which other responses or activities happen. A post can also be thought of as an in-game artifact or object; a placeholder for engagement or interaction. Posts can be decorated with responses as well.

6. Events - events are a conceptually important concept. They pin down a fourth dimension of location: time. For example one person may take a private group of people who are clustered together and fire off an invitation for a meetup in a certain room at a certain time of day for a certain period. They're not strictly an artifact but they do relate other artifacts to each other.

7. 3D Objects. For a 3D game such as Hubs we see that some artifacts can also be prototypical, such as a prototypical 3d fireball object, or an instance of a 3d fireball object with a dynamic location in space with position, yaw pitch rotation and scale and other modifiers possibly. Other artifacts include the idea of a room, or actual rooms themselves. Objects may also be children of other artifacts - a chair may be in a room, a player may be on a chair - while also still in a room (a person should not vanish from a room db query if they sit in a chair).

## Activity Table

There's a class of alerts, reminders, analytics logging and suchlike that is distinct from other state. It can be a beefy base-class as well; capturing a few extra fields that are not always used. It makes sense to have a separate table for tracking this state. The value here is multifold. A user can review their own state to find something they want to rememeber or go back to. Analytics on aggregates of user state are useful for examining user sentiment and engagement with product.

```javascript
class activity {
	id,
	authid,
	artifactid,
	invitationid,
	relationid,
	kind,
	descr,
	created,
	updated,
}
```

## Favorites, Bookmarks, Upvotes Table

There's a class of lightweight marking up of in game artifacts - upvotes, saving a bookmark and so on. It makes sense to have a separate table to enumerate a relationship between a person and an artifact. This can actually be done in a relations table rather than having a private table.

## Invitation Table

Often a person wants to invite other people to join in on an experience. There's a class of deep-linking invites where you want to be able to compose an URL that has a limited duration invitation, or extends a participation privilege to a person based on an email, or a limited cap set of participants - or even just an open invitation to a specific group or event. It makes sense to provide a table for tracking all extended invites, and then chaperoning new participants who visit the site with the invite token.

## Relationships and Permissions Table

The engine has many relational questions that it is constantly asking such as:

	What objects are in a room?
	What events is a person in?
	What rooms did a person create?
	What events is a person a member of?

	Can I create an event?
	Can I delete a room?
	Can I make a team?
	Can I move everybody to a new room?
	Can I create objects?
	Can I talk?
	Can I kick somebody out of the current room?
	Can I use a megaphone?
	Can I elevate privileges of somebody else?
	Is person A blocking person b?

It's hard to know ahead of time all of the relationships, permissions or pairwise privileges that a product will have. In fact as new features are added to a product, new kinds of permissions are needed. What is needed is a system that flexibly allows definition of new kinds of relationships without refactoring the core schemas.

Note that Non-relational questions are also asked; but these can be trivial properties on an object such as:

	Is a room public?

There many are different ways of tracking relationships and permissions in commercial products.

1. Some relationships are implicit; perhaps there is a design choice that a given instance of an artifact may only be in one room (a disjoint directed acyclic graph). In this case it is possible to have a parent property on an artifact - which is a simple fast database query. Is a room public is a good example also. In this case the attribute is directly on the object. This isn't that useful however.

2. Some relationships can be grouped; an object may be associated with an admin group, people associated with that group have powers over that object. UNIX often uses this metaphor with individual perms and then group perms. This can be useful to change a groups permissions and have that affect all members.

3. Some relationships are explicit; a person may specifically be granted a specific power in a group - in a pairwise relationship table. This is the most flexible. It's easiest in some senses to formally define all relationships and all privileges in one "catch all table" basically. A table can be defined that captures a superset of all these cases explicitly - and this gives us maximum flexibility. Relationship qualifiers could be strings such as:

	"public"
	"child"
	"megaphone"
	"superuser"

Application logic on both the server and client side can then check with the relations table for many kinds of situations. The server side checks to block actions, the client side checks more as a nicety - to show a nice user experience - hiding actions that a user successfully cannot do:

	if(relations.query(currentRoom,0,"public")) {
		// show on public home page
	}

	relations.query(currentRoom,*,"child").forEach(child => {
		add this child to the room
	})

	if( relations.query(currentUser,targetRoom,"megaphone")) {
		render a megaphone button so the user has access to the megaphone
	} else P
		render a megaphone button with an X through it or greyed out
	}

	if(relations.query(currentUser,targetRoom,"admin")) {
		render a button that lets this player grant privileges to another player
	}

Other points here are that such a relation table effectively denormalizes a database and can be used to decorate arbitrary objects with arbitrary properties - HOWEVER it can be expensive to do this. It's mostly useful for cases where properties are not singletons, not unique on one object. If a property is unique (such as say "this event starts at 3:00 pm" then it is best stored on the object for speed).

Also there's also a class of relations that involve "trust" and typically a "trust line" is extended between one party and another. For example an employee at a company effectively "trusts" an administrator to have powers over them vis a vis their business related activity. Trustlines can be easily captured in this way as well.

Overall this class or table may look like this:

```javascript
class relations {
	id,
	authid, // nominally who made the relation
	id1,  // the pairwise relation
	id2,
	kind, // the relation itself: "id1 trusts id2" or "id1 blocks id2"
	created,
	updated,
}
```

## API

For application developers they typically don't want to be conscious of all of the "business logic" all the time. Systems like the above are necessary to be able to capture the requirements of an app, but as well it can be quite nice to abstract away a high level API that isolates developers from risks - writing the evaluation logic in one place - and allowing developers at the surface to trust that any errant unprivileged or illegal relationship activity is caught and stopped lower down. An API exposes the highest level intention of an app, in many ways defining what the application "is".

class backend_api {

	authentication api:

		login
		signup
		signout
		delete account

	artifacts api:

		get an enumerate kinds of entities()

		make new prototype or instance - of a set of kinds()

		save new

		update

		delete

		query by id

		query by some complex set of terms such as properties, an offset, a limit, and return results in a specific sorted order

		observe (similar to a query but effectively opens a listener on specific query - listening for any changes to it)

	set a relationship or permission

		set a relationship

		query a relationship

		delete a relationship

	invites

		invite a person by email, with a specific token, and a timeout on that token
		confirm a token; if somebody shows up at the site with a token, decide if it is valid, and what it applies to

	helpers

		join an object to other related objects, returning a bundle (this is extremely useful - such as get a post AND details about the author)

		join an object to art assets (again this is very useful such as getting a database object AND the depiction as once)

		delete relationships on an object (when objects are deleted sometimes it is helpful to delete all the related children)

		update counts (sometimes objects have convenience counts such as a counter that says how many children that object has at all times)
}

