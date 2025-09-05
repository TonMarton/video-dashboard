# Backend for Video Dashboard
## Local development
- Make sure you have nvm installed or procure your node version on your own.
- Start your Docker Desktop as it is required for the dev db server.
- Then execute in order:
```zsh
nvm install # (optional)
npm install
npm run dev:db:setup  # later enough to run: npm run dev:db:start 
npm run dev
```
- Check the console for a link to the Swagger UI and you start querying the API