# Project

Set of activities that, when executed support the compliance of a strategic goal (Provision of Key Services, Management Evolution, Close contact with Territory, Enterprises Boosting, Focused Investment, Social/Cultural/Sports Promotion, etc.). This goal itself is composed of one or more project,s and address one of the strategic axes (Work model, Economic development, Social development, Environmental Development) that give a high level shape to the Strategic Plan
-  `address`: The mailing address
    -  Attribute type: **Property**. [address](https://schema.org/address)
    -  Optional
-  `alternateName`: An alternative name for this item
    -  Attribute type: **Property**.
    -  Optional
-  `areaServed`: The geographic area where a service or offered item is provided
    -  Attribute type: **Property**. [Text](https://schema.org/Text)
    -  Optional
-  `axis`: Strategic axis the project belongs to
    -  Attribute type: **Property**.
    -  Optional
-  `challenges`: Challenges to be faced by the project
    -  Attribute type: **Property**.
    -  Optional
-  `dataProvider`: A sequence of characters identifying the provider of the harmonised data entity
    -  Attribute type: **Property**.
    -  Optional
-  `image`: Link adn alternative description to the file wth the picture
    -  Attribute type: **Property**.
    -  Optional
-  `dateCreated`: Entity creation timestamp. This will usually be allocated by the storage platform
    -  Attribute type: **Property**.
    -  Optional
-  `dateModified`: Timestamp of the last modification of the entity. This will usually be allocated by the storage platform
    -  Attribute type: **Property**.
    -  Optional
-  `delegations`: Delegations or internal departments the project belongs to
    -  Attribute type: **Property**.
    -  Optional
-  `delegationsInvolved`: Delegations or internal departments involved in the project
    -  Attribute type: **Property**.
    -  Optional
-  `category`: Property. Category of the Project. Enum:'E-Payment, E-Identity, E-Health. One of : `E-Payment`, `E-Identity`, `E-Health`.
    -  Attribute type: **Property**.
    -  Optional
-  `funding`: Property. Category of the Project. Enum:'E-Payment, E-Identity, E-Health. One of : `Offering`, `Co-Funding`.
    -  Attribute type: **Property**.
    -  Optional
-  `description`: A description of this item
    -  Attribute type: **Property**.
    -  Optional
-  `id`: Unique identifier of the entity
    -  Attribute type: **Property**.
    -  Required
-  `interestGroups`: Delegations or internal departments involved in the project
    -  Attribute type: **Property**.
    -  Optional
-  `location`: Geojson reference to the item. It can be Point, LineString, Polygon, MultiPoint, MultiLineString or MultiPolygon
    -  Attribute type: **GeoProperty**.
    -  Optional
-  `modifications`: Changes that the project has incorporated in a possible update
    -  Attribute type: **Property**.
    -  Optional
-  `name`: The name of this item
    -  Attribute type: **Property**.
    -  Optional
-  `observations`: Free text about specific characteristics of the project
    -  Attribute type: **Property**.
    -  Optional
-  `author`: The publisher or creator of this Item
    -  Attribute type: **Property**.
    -  Optional
-  `owner`: A List containing a JSON encoded sequence of characters referencing the unique Ids of the owner(s)
    -  Attribute type: **Property**.
    -  Optional
-  `plan`: Subtype of project. Enum:'EDS, PPE'. One of : `EDS`, `PPE`.
    -  Attribute type: **Property**.
    -  Optional
-  `refDevice`: Device(s) used to obtain the measurement
    -  Attribute type: **Relationship**.
    -  Optional
-  `sdg`: Sustainable Development goal the project belongs to
    -  Attribute type: **Property**.
    -  Optional
-  `seeAlso`: list of uri pointing to additional resources about the item
    -  Attribute type: **Property**.
    -  Optional
-  `source`: A sequence of characters giving the original source of the entity data as a URL. Recommended to be the fully qualified domain name of the source provider, or the URL to the source object
    -  Attribute type: **Property**.
    -  Optional
-  `strategicObjective`: Strategic objective the project belongs to
    -  Attribute type: **Property**.
    -  Optional
-  `type`: It must be equal to Project. One of : `Project`.
    -  Attribute type: **Property**.
    -  Required



# Canvas

A Canvas Section specifies a topic stakeholders can collaborate on to reach commitments and ultimately an agreement. A Canvas Section might contain sub-sections.
-  `id`: Unique identifier of the entity
    -  Attribute type: **Property**.
    -  Required
-  `title`: A title for this item
    -  Attribute type: **Property**.
    -  Optional
-  `topicsGroup`: The mailing address
    -  Attribute type: **Property**.
    -  Optional
-  `order`: The order of Canvas section in a group of topics
    -  Attribute type: **Property**. [Number](https://schema.org/Number)
    -  Optional
-  `description`: A description of this item
    -  Attribute type: **Property**. [Text](https://schema.org/Text)
    -  Optional
-  `belongsTo`: Relationship. Reference to the entity Project that this Canvas belongs to .
    -  Attribute type: **Relationship**.
    -  Optional
-  `type`: It must be equal to Canvas. One of : `Canvas`.
    -  Attribute type: **Property**.
    -  Required



# Post

Stakeholders discuss topics by posting Post that form a thread.A post can be marked as commitment to indicate finality of a thread.
-  `id`: Unique identifier of the entity
    -  Attribute type: **Property**.
    -  Required
-  `title`: A title for this item
    -  Attribute type: **Property**.
    -  Optional
-  `author`: The publisher of this Post
    -  Attribute type: **Property**.
    -  Optional
-  `auth0AuthorID`: The publisher auth0 sub claim from token
    -  Attribute type: **Property**.
    -  Optional
-  `content`: The content of this Post
    -  Attribute type: **Property**. [Text](https://schema.org/Text)
    -  Optional
-  `postedUnder`: Relationship. Reference to the entity Project, that this Post belongs to
    -  Attribute type: **Relationship**.
    -  Optional
-  `belongsTo`: Relationship. Reference to the entity Canvas that this Post item belongs to .
    -  Attribute type: **Relationship**.
    -  Optional
-  `postedIn`: Relationship. Reference to the entity Project that this Post item created in.
    -  Attribute type: **Relationship**.
    -  Optional
-  `allowedOrgs`: Organizations allowed to see this Item. Empty array means this Item is public.
    -  Attribute type: **Property**.
    -  Optional
-  `keyData`: An item selected by user to be used as Commitment Key Data.
    -  Attribute type: **Property**.
    -  Optional
-  `isCommitment`: True when this Item converted to Commitment, based on user request. False if its not(default)
    -  Attribute type: **Property**. [Boolean](https://schema.org/Boolean)
    -  Optional
-  `dateCreated`: Entity creation timestamp. This will usually be allocated by the storage platform
    -  Attribute type: **Property**.
    -  Optional
-  `dateModified`: Timestamp of the last modification of the entity. This will usually be allocated by the storage platform
    -  Attribute type: **Property**.
    -  Optional
-  `type`: It must be equal to Post. One of : `Post`.
    -  Attribute type: **Property**.
    -  Required



# Milestone

A milestone is the translation of legal text into an entity or unit that can be used in project management.
-  `id`: Unique identifier of the entity
    -  Attribute type: **Property**.
    -  Required
-  `title`: A title for this item
    -  Attribute type: **Property**.
    -  Optional
-  `author`: The publisher of this Post
    -  Attribute type: **Property**.
    -  Optional
-  `description`: The content of this Post
    -  Attribute type: **Property**. [Text](https://schema.org/Text)
    -  Optional
-  `dateCreated`: Entity creation timestamp. This will usually be allocated by the storage platform
    -  Attribute type: **Property**.
    -  Optional
-  `dateModified`: Timestamp of the last modification of the entity. This will usually be allocated by the storage platform
    -  Attribute type: **Property**.
    -  Optional
-  `dateFinalization`: Milestone finalization timestamp.
    -  Attribute type: **Property**.
    -  Optional
-  `percentageOfCompletion`: The percentage that represents terminated tasks in a milestone
    -  Attribute type: **Property**.
    -  Read-Only. Automatically generated.
-  `budget`: The allocated budget to a Milestone
    -  Attribute type: **Property**.
    -  Read-Only. Automatically generated.
-  `contributors`: All Contributors involved in the Milestone of a Project.
    -  Attribute type: **Property**.
    -  Optional
-  `deliveryStatus`: Property. The current Delivery status of the Entity Milestone. Enum:'pending, execution, achieved'. One of : `PENDING`, `EXECUTION`, `ACHIEVED`.
    -  Attribute type: **Property**.
    -  Optional
-  `belongsTo`: Relationship. Reference to the entity Project, that this Milestone belongs to
    -  Attribute type: **Relationship**.
    -  Optional
-  `type`: It must be equal to Milestone. One of : `Milestone`.
    -  Attribute type: **Property**.
    -  Required



# Comment

A Comment is the reply pushed by user to a specific Post in order to discuss a particular posted topic.
-  `id`: Unique identifier of the entity
    -  Attribute type: **Property**.
    -  Required
-  `title`: A title for this item
    -  Attribute type: **Property**.
    -  Optional
-  `author`: The publisher of this Reply
    -  Attribute type: **Property**.
    -  Optional
-  `auth0AuthorID`: The publisher auth0 sub claim from token
    -  Attribute type: **Property**.
    -  Optional
-  `content`: The content of this Reply
    -  Attribute type: **Property**. [Text](https://schema.org/Text)
    -  Optional
-  `dateCreated`: Entity creation timestamp. This will usually be allocated by the storage platform
    -  Attribute type: **Property**.
    -  Optional
-  `dateModified`: Timestamp of the last modification of the entity. This will usually be allocated by the storage platform
    -  Attribute type: **Property**.
    -  Optional
-  `isCommitment`: True when this Item converted to Commitment, based on user request. False if its not(default)
    -  Attribute type: **Property**. [Boolean](https://schema.org/Boolean)
    -  Optional
-  `keyData`: An item selected by user to be used as Commitment Key Data.
    -  Attribute type: **Property**.
    -  Optional
-  `postedUnder`: Relationship. Reference to the entity Project, that this Reply belongs to
    -  Attribute type: **Relationship**.
    -  Optional
-  `replyTo`: Relationship. Reference to the entity Comment or Post, that this Reply belongs to
    -  Attribute type: **Relationship**.
    -  Optional
-  `type`: It must be equal to Comment. One of : `Comment`.
    -  Attribute type: **Property**.
    -  Required



# Organization

An Organization is a a representation contributor or part of the process.
-  `id`: Unique identifier of the entity
    -  Attribute type: **Property**.
    -  Required
-  `name`: A title for this item
    -  Attribute type: **Property**.
    -  Optional
-  `displayName`: The publisher of this Reply
    -  Attribute type: **Property**.
    -  Optional
-  `logoUrl`: The log of this Organization
    -  Attribute type: **Property**. [Text](https://schema.org/Text)
    -  Optional
-  `org_id`: The organization identifier metadata
    -  Attribute type: **Property**. [Text](https://schema.org/Text)
    -  Optional
-  `dateCreated`: Entity creation timestamp. This will usually be allocated by the storage platform
    -  Attribute type: **Property**.
    -  Optional
-  `dateModified`: Timestamp of the last modification of the entity. This will usually be allocated by the storage platform
    -  Attribute type: **Property**.
    -  Optional
-  `type`: It must be equal to Organization. One of : `Organization`.
    -  Attribute type: **Property**.
    -  Required

   