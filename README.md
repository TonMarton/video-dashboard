# Marton's Solution for the Video Library Dashboard

Original task description: [link](https://veed.notion.site/VEED-Full-Stack-Engineering-Challenge-Video-Library-Dashboard-1f2cd2433784804099c6c6632e998de1)

## Assumptions
- The site would likely have many more videos -> it is not an option to load them all at once, we need some kind of pagination.

## Technology used
### Docker
I assume everyone has it on their machine already and so it simplifies the building and procurement of dependencies, such as node versions, npm packages, or the database server. I could use an in memory database for testing

## Planning
These are the behaviours to implement, to let me think the required functionality through from user perspective. 
The below double down as test cases for frontend as well.

### Core features
Checkout the [TODO.md](todo.md) and the commit history to see how these were implemented in order.

#### Video Grid
##### Video Grid Cards Loading
Given we have some videos to display.
When I open the Video Grid page
Then the page starts loading, indicated by skeleton cards.

##### Video Grid Cards
Given we have some videos to display
When I open the Video Grid page and the page loads.
I see a responsive grid of videos, where the `thumbnail` is just a static placeholder image, taking up the upper portion of the card.
The bottom of the card displays the `title`, `created_at`, `tags`.

##### Default sort is newest first
Given the library contains videos with different created_at timestamps
When I open the Video Grid page
Then I see a responsive grid of cards

##### Sort toggle oldest->newest
Given I am on the Video Grid page
When I set "Sort by" to "Oldest"
Then the grid reorders by created_at ascending

##### Infinite scroll (cursor-based pagination)
Given we have 50+ videos.
When I scroll to the bottom of the grid
Then the next page is fetched using a cursor
And new items append without losing my scroll position

#### Create video
##### Create button on Video Grid Page
Given I am on the Video Grid page
When I click the create video button on the top
Then a Modal is popped up showing the create Video form.

##### Create successfuly
Given I am on the Create Video page
When I enter a title and optional tags and submit
Then the video is created after a short loading and I see a success screen.

##### Can't interact during creation
Given I am on the Create Video page
When I create a video with correct input
It starts loading and the

### Nice to have
#### Filters and sorting
##### Filter by multiple tags AND a date range
Given videos exist with tags ["music","news","tech"] and various created_at dates
When I select tags "music" and "news" and choose a date range
Then only videos matching both tags within the range are shown

##### Title search
Given videos exist with various titles
When I type a search query into the title search box
Then only videos whose title contains the query are shown

#### Accessibility
Scenario: Labeled inputs and keyboard operation
Given I am using a keyboard only
When I tab through the form and filters
Then each input has an associated label
And I can activate controls via Enter/Space
And I can close dialogs with Escape

#### Video Detail page
##### Clicking a Video Grid Card Opens the page
Given am on the Video Grid page
When I click a loaded card
Then a new page opens with all the card data spread out more, including everything we have on the video.

##### Back navigation to Video Grid
Given I am on the Video Detail page
When I click the back facing arrow on the top left
I get sent back to the Video Grid page, with the original scroll position preserved.

#### Thumbnail
##### Video Grid Cards Thumbnail
Given we have some videos to display
When I open the Video Grid page
I see a responsive grid of videos, where the `thumbnail` is loaded from the webserver.