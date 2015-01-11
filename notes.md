#Need to do:
* Connect to database (HMN)
* Revamp "about" statement on Meetup (Leah)
* Connect to Meetup using API (HMN/TJW)
* Revise script for video (TJW)
* Make AE anim for intro graphic and lower thirds (TJW)
* Categories lists need to all be pulled from the same place. (HMN)
* Investigate custom @locallearners.net email (HMN)
* Auto Scrolling stuff in Angular (HMN)
*

#Want to do:
* Kick ass awesome Video thingy
* Map of event locations

#Nice to have:
* Terms

#Functionality

Homepage: click upcoming box of a class and modal with more details appears, you can join/attend/rsvp.
Homepage: under upcoming is a "Most requested" section with a filter and is 2 or 3 columns with a icon and thumbs up.
Teach: Select a category first, then list of requested courses appears, if you click on the requested course then the rest of the teach form appears, with the title prefilled out. You can change the title. There is a notice saying, X number of people have requested this class to show that you are fulfilling that request.
Request: This page should just be a modal that appears whenever "request a class" is clicked. Title, Category, and submit button are the only parts, then it should take them to the Requested page, sorted by "newest" so they see their post.
Requested: Have the URL be able to handle sorting and filtering. locallearners.net/#/requested?category=music&sort=popular
Upcoming Classes: URL to hand sorting and filtering. locallearners.net/#/classes?category=history&sort=oldest

#Alissa Ponderings
Main
▪	Category Select Filter isn’t set up to read/show All Categories
	⁃	Since Angular is filtering based on category, there is no class associated with ‘All Categories’
▪	Changed class category property values on backend (lowercase, hyphenated); corresponding values need to be added to front-end category filter
▪	Need to convert date of class to numeric number in order to sort by date in Angular
	⁃	Create a custom filter? https://docs.angularjs.org/api/ng/filter/orderBy
▪	When there are no classes to display, default apology message should appear and offer a link to suggest a class
▪	ClassCtrl should be a Controller of its own since it will also be used on another page (Upcoming Classes)
▪	When modals pop up, click-off should escape out of window
	⁃	“The modal plugin toggles your hidden content on demand, via data attributes or JavaScript. It also adds.modal-open to the <body> to override default scrolling behavior and generates a .modal-backdrop to provide a click area for dismissing shown modals when clicking outside the modal.” - Bootstrap Reference
		⁃	This isn’t the case. When .modal-backdrop is added to the DOM, it is done so as a separate div below the modal’s div, and it has no height, thus making it unclickable. I’ve read once that it’s a Bootstrap version issue — not sure if this is the case.
▪	Modals should appear at ~33% from the top of page (currently too close to top)

#Done
* ~~Finish user stories (TJW/AR/HMN)~~
* ~~Create Balsamiq Mockups (AR)~~
* ~~Set up Bower (HMN)~~
* ~~Set up Twitter-Bootstrap (TJW)~~
* ~~Set up Sass Boilerplate (TJW)~~
* ~~OAUTH login (HMN)~~
* ~~Set up site in Angular (HMN)~~
* ~~Narrow down Categories (TJW/AR)~~
* ~~Convert markup to be bootstrap compliant (AR)~~
* ~~Finish Logo (TJW)~~
* ~~Biz Card (TJW)~~
* ~~Create default category backgrounds. (TJW/AR)~~
* ~~JS the FAQ list (AR)~~
* ~~Modals (AR)~~
* Page markup and content assignments
 * ~~About (AR)~~
 * ~~Account (TJW)~~
 * ~~Classes (AR)~~
 * ~~Contact (AR)~~
 * ~~Help (AR)~~
 * ~~Host (TJW)~~
 * ~~Logout (TJW)~~
 * ~~Privacy (TJW)~~