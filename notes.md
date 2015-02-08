#Need to do:
* Auto Scrolling to top when clicking on a new page. Can be done in Angular. Home FAQ link takes you to bottom of FAQ page. (HMN)
* WIP - Categories lists need to all be pulled from the same place (in database). (HMN)
* Category Select Filter isn’t set up to read/show All Categories. Since Angular is filtering based on category, there is no class associated with 'All Categories'
* Homepage>Upcoming Modal: Display an icon in top corner (below X) of category, 100x100px ish. (TJW)
* Homepage>Most Requested: Add a category filter. (TJW/AR)
* Homepage>Most Requested: Clicking a requested class opens a modal with Class Title, Category, icons of users that have +1'd, and buttons for "Request This Class" & "Recommend Teacher". (TJW/AR)
* Teach: Wrap IM in a box to look more like an IM (TJW)
* Teach>Form: Only Title and Category dropdown's are available. Below is the upcoming and top requested classes. As you type a name the Upc/Req classes filter. Selecting a category also filters down the list to match that category. If you click on the requested course then the rest of the teach form appears, with the title prefilled out. You can change the title. There is a notice saying, X number of people have requested this class to show that you are fulfilling that request. A button below the requested classes says something like "The class I want to teach has not been requested yet". But... in fewer words.
* Teach/Request: Research search algorithm (HMN)
* Request: Have the URL be able to handle sorting and filtering. locallearners.net/#/requested?category=music&sort=popular (HMN)
* Upcoming Classes: URL to hand sorting and filtering. locallearners.net/#/classes?category=history&sort=oldest (HMN)
* Host: Submit button should send info to a database (HMN/TJW)
* Feedback/Contact page should be functional. (HMN/TJW/AR)
* Changed class category property values on backend (lowercase, hyphenated); corresponding values need to be added to front-end category filter (AR)
* When there are no classes to display, default apology message should appear and offer a link to suggest a class (AR)
* Create Upcoming Class directive
* ClassCtrl should be a Controller of its own since it will also be used on another page (Upcoming Classes)
* WIP - Replace dummy data with meetup data (HMN/TJW/AR)
* Revise script for video (TJW)
* Make AE anim for intro graphic and lower thirds (TJW)
* Revamp "about" statement on Meetup (Leah)
* Homepage: console error GET http://localhost:5000/img/class/%7B%7BavailClass.image%7D%7D 404 (Not Found) (TJW)
* Login image not centered on inferior mac browser (AR)

#Want to do:
* Kick ass awesome Video thingy
* Map of event locations
* Map of availabloe venues
* Have an administration page to make updates to site remotely without having to re-deploy code.
* Investigate custom @locallearners.net email (HMN)
* Send alert emails when requested class is being taught. "A class you requested will be taught!"

#Nice to have:
* Modals should appear at ~33% from the top of page (currently too close to top) (AR)
* Terms



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
* ~~Homepage>Upcoming Modal: Data should come from meetup site based on EventID. (HMN)~~
* ~~Homepage: Request a class, takes you to request page instead of modal (TJW)~~
* Page markup and content assignments
 * ~~About (AR)~~
 * ~~Account (TJW)~~
 * ~~Classes (AR)~~
 * ~~Contact (AR)~~
 * ~~Help (AR)~~
 * ~~Host (TJW)~~
 * ~~Logout (TJW)~~
 * ~~Privacy (TJW)~~