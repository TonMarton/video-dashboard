# Marton's Solution for the Video Library Dashboard

Original task description: [link](https://veed.notion.site/VEED-Full-Stack-Engineering-Challenge-Video-Library-Dashboard-1f2cd2433784804099c6c6632e998de1)

## Running the project

- have Docker Desktop installed
- go to the project root and execute `npm run start` or `docker compose up`

This should build all the components, host a postgres db and seed it with the video.json data.

You should either go to see how the project works:

- [API docs](http://localhost:8000/docs)
- [Video Dashboard UI](http://localhost:3000)

**Enjoy!**

## What need more polishing

I spent about 5-6 hours on the project in the end, with planning and documentation reading before the start.

In short I was focusing to give a more complete backend implementation, the UI is lacking more. I hope to show that eventhough I am working in Python on the backend, I can deliver a pretty polished backend solution in a different stack in a short amount of time.

If I spent more time I would have also:

- added React frontend tests - integration style tests, with msw network call mocks.
- cleaned up the Docker files more. I am doing multi-staged docker builds, which is good, but there are some shortcuts I took to make the swagger docs to work and the symlinks for the shared package can not be the best approach.
- finished the video creation page with error handling, toasts, form validation on the frontend, succcess screen.
- added the tag based search.
- added some detail page for the video - or some pop up modal with details - so that even if a video has 50 tags, we can display all of them to the user.
- added some animations that make the UI really pop
- added custom themeing to the UI
- added a GA workflow to run my tests when I push to remote
- added a 404 page to the router
- added indexing to optimizing the searches from the backend
- built the shared types as a separate artifact and made it available to the builds in a cleaner way

I hope that you will like the submission regardless of these shortcomings and I have spent time on the right things.

## Assumptions

- The site would likely have many more videos -> it is not an option to load them all at once, we need some kind of pagination.

## Technology choices

### Monorepo

I have not worked with a monorepo on this stack before, so the package.json and tsconfig inheritance caused some headaches and had to ditch it in the end, as I did not want to spend an extra 30 mins on it. I am aware, that duplicating the dependencies and the configs is not desirable and surely can be solved.

### Docker

I assume everyone has it on their machine already and so it simplifies the building and procurement of dependencies, such as node versions, npm packages, or the database server. I could use an in memory database for testing

### Prisma + PostgreSQL

In production we use alembic + SQLAlchemy with Python, and Prisma provides a very similar experience. I use this always with Node projects. PostgreSQL is my to go relational database.

### Vitest

I use Jest on a day-to-day basis, but it always takes some time to set up everything, especially with fake timers and such extras.
I read a lot of good things about vitest, when trouble shooting our Jest configs, so I wanted to experiment a bit.

### Shared-types package

Made an extra package to share types with between the frontend and backend. I think this is an overkill on this project, but thought it is a nice touch.

### React + RTKQ

We do not need any internal state almost, so best is to use the React Toolkit Query for convenient data fetching in my opinion.

### Tailwind + Flowbite

I wanted to spend 0 time on design and this felt like a good option. I do not use this in production, our design system is built on mui.

## Testing Strategy

### Backend

#### Unit tests

Thanks to DI I can use mock data repositories and mock data services to only test the unit under test. I like to do this to avoid many functional level mocks that can quickly become a nightmare to keep track of.

I also test endpoints using supertest, which I think is a must. This way, I almost never have issues when I am connecting from the frontend, as I covered the main cases with my tests already.

#### Integration tests

The data layer is mocked for the unit tests that test the service layer, but the data layer can only be tested effectively by using a real db instance. I am using the same db engine as in "production". This means harder set-up, I spent more then 20 minutes trying to figure out a setup that I was somewhat happy with. But, this way we can completely avoid scenarios, where the tests pass for some transaction that would behave differently on a production instance that communicate with a PostgresDB. Luckily, CI/CD providers make integration testing with containerized db instance very easy as well.
