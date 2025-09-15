# Swedavia API - CORS Demo

## Context and CORS
This demo displays today's flight departures for Stockholm Arlanda Airport (ARN) by fetching data from the the [Swedavia API](https://apideveloper.swedavia.se/). The API has great data, but lacks headers to allow [Cross Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS). As such we cannot call it directly from frontend JavaScript. We therefore use NodeJS [Express](https://expressjs.com) server as a relay to call the Swedavia API. 

## API KEY and Environment Variables
To get your API Key, you'll need to [Sign Up with Swedavia Airports](https://apideveloper.swedavia.se/). Then, use Environment Variables to safely store API Keys. You could place something like the following in a `.env` file while working locally. This file will be loaded when you run `npm start`. If deploying to the web, (e.g. to [Vercel](https://vercel.com/)) you'll need to configure the Environment Variables as part of your project settings. 
```
API_KEY=a1b2c3d4e5f6g7h8*****
```

## Vercel
This project uses the [Express](https://expressjs.com) framework in a manner [supported by Vercel](https://vercel.com/docs/frameworks/backend/express). You can host an Express app for free as a [Vercel Function](https://vercel.com/docs/functions) a on a [Hobby Plan](https://vercel.com/docs/plans/hobby).

## About 
Created by [Harold Sikkema](https://nsitu.ca) in the context of Systems Design in the [Interaction Design](https://ixd.sheridancollege.ca/program.html) program at [Sheridan College.](https://www.sheridancollege.ca/) Fonts via [Sharing Sweden](https://sharingsweden.se/).