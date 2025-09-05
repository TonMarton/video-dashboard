# Marton's Solution for the Video Library Dashboard

Original task description: [link](https://veed.notion.site/VEED-Full-Stack-Engineering-Challenge-Video-Library-Dashboard-1f2cd2433784804099c6c6632e998de1)

## Assumptions
- The site would likely have many more videos -> it is not an option to load them all at once, we need some kind of pagination.

## Technology choices
### Docker
I assume everyone has it on their machine already and so it simplifies the building and procurement of dependencies, such as node versions, npm packages, or the database server. I could use an in memory database for testing

### Prisma + PostgreSQL
In production we use alembic + SQLAlchemy with Python, and Prisma provides a very similar experience. I use this always with Node projects. PostgreSQL is my to go relational database. 

### Vitest
I use Jest on a day-to-day basis, but it always takes some time to set up everything, especially with fake timers and such extras. 
I read a lot of good things about vitest, when trouble shooting our Jest configs, so I wanted to experiment a bit.

## Testing Strategy
### Backend
#### Unit tests
Thanks to DI I can use mock data repositories and mock data services to only test the unit under test. I like to do this to avoid many functional level mocks that can quickly become a nightmare to keep track of.

#### Integration tests
The data layer is mocked for the unit tests that test the service layer, but the data layer can only be tested effectively by using a real db instance. I am using the same db engine as in "production". This means harder set-up, I spent more then 20 minutes trying to figure out a setup that I was somewhat happy with. But, this way we can completely avoid scenarios, where the tests pass for some transaction that would behave differently on a production instance that communicate with a PostgresDB. Luckily, CI/CD providers make integration testing with containerized db instance very easy as well.

#### API tests
# TODO

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

## Development
- install `node` (version from[.nvmrc](.nvmrc))
- `npm i` in both apps
- ## TODO