# Swedavia API Demo

## Context
This is a demo page to fetch and display data from the [Swedavia API](https://apideveloper.swedavia.se/). The API has endpoints for departures and arrivals. However it lacks headers to allow [Cross Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS). As such we cannot call it directly from frontend JavaScript. We therefore use a NodeJS [Express](https://expressjs.com) server as a relay to call the Swedavia API. 

## Environment Variables
We use Environment Variables to safely store API Keys. You could place something like the following in a `.env` file while working locally. If deploying to the web, (e.g. to [Vercel](https://vercel.com/)) you would need to configure the Environment Variables as part of your deployment.
```
API_KEY=a1b2c3d4e5f6g7h8*****
```

## About 
Created by [Harold Sikkema](https://nsitu.ca) in the context of Systems Design in the [Interaction Design](https://ixd.sheridancollege.ca/program.html) program at [Sheridan College.](https://www.sheridancollege.ca/) Fonts via [Sharing Sweden](https://sharingsweden.se/).