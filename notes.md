#Need to do:
* Auto Scrolling to top when clicking on a new page. Can be done in Angular. Home FAQ link takes you to bottom of FAQ page. (HMN)
* Teach Page: wrap IM in a box to look like an IM (TJW)
* Request a class, takes you to request page instead of modal (AR)
* Categories lists need to all be pulled from the same place (in database). (HMN)
* Need to convert date of class to numeric number in order to sort by date in Angular. Create a custom filter? https://docs.angularjs.org/api/ng/filter/orderBy (look into Moment.js) (HMN/TJW/AR)
* Submit button on Host page should do something eventually? (HMN/TJW/AR)
* Feedback/contact page should be functional (HMN/TJW/AR)
* Category Select Filter isn’t set up to read/show All Categories. Since Angular is filtering based on category, there is no class associated with 'All Categories'
* Changed class category property values on backend (lowercase, hyphenated); corresponding values need to be added to front-end category filter (AR)
* When there are no classes to display, default apology message should appear and offer a link to suggest a class (Awesome idea)
* ClassCtrl should be a Controller of its own since it will also be used on another page (Upcoming Classes)
* Replace dummy data with meetup data (HMN/TJW/AR)
* Revise script for video (TJW)
* Make AE anim for intro graphic and lower thirds (TJW)
* Revamp "about" statement on Meetup (Leah)

#Want to do:
* Kick ass awesome Video thingy
* Map of event locations
* Have an administration page to make updates to site remotely without having to re-deploy code.
* Investigate custom @locallearners.net email (HMN)

#Nice to have:
* Modals should appear at ~33% from the top of page (currently too close to top) (AR)
* Terms

#Functionality

Homepage: Click upcoming box of a class and modal with more details appears, you can join/attend/rsvp.
Homepage: Under upcoming is a "Most requested" section with a filter and is 2 or 3 columns with a icon and thumbs up.
Teach: Select a category first, then list of requested courses appears, if you click on the requested course then the rest of the teach form appears, with the title prefilled out. You can change the title. There is a notice saying, X number of people have requested this class to show that you are fulfilling that request.
Request: This page should just be a modal that appears whenever "request a class" is clicked. Title, Category, and submit button are the only parts, then it should take them to the Requested page, sorted by "newest" so they see their post.
Requested: Have the URL be able to handle sorting and filtering. locallearners.net/#/requested?category=music&sort=popular
Upcoming Classes: URL to hand sorting and filtering. locallearners.net/#/classes?category=history&sort=oldest


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
* ~~Connect to database (HMN)~~
* ~~Connect to Meetup using API (HMN/TJW)~~
* ~~Implement logout (HMN)~~
* ~~When modals pop up, click-off should escape out of window. (TJW)~~
* Page markup and content assignments
 * ~~About (AR)~~
 * ~~Account (TJW)~~
 * ~~Classes (AR)~~
 * ~~Contact (AR)~~
 * ~~Help (AR)~~
 * ~~Host (TJW)~~
 * ~~Logout (TJW)~~
 * ~~Privacy (TJW)~~