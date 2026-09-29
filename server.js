
import express from 'express';

const app = express();                 // initialize express  
const responseCache = new Map();
const cacheDurationMs = 30_000;

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

const fetchFlightData = async date => {
  const cached = responseCache.get(date);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const url = new URL('https://api.swedavia.se/flightinfo/v2/query');
  url.searchParams.append('filter', `airport eq 'ARN' and scheduled eq '${date}' and flightType eq 'D'`);
  url.searchParams.append('count', '1000');

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.API_KEY
      }
    });

    if (response.ok) {
      const data = await response.json();
      responseCache.set(date, { data, expiresAt: Date.now() + cacheDurationMs });
      return data;
    }

    if (response.status !== 429 || attempt === 2) {
      const error = new Error(await response.text());
      error.status = response.status;
      throw error;
    }

    const retryAfter = Number(response.headers.get('Retry-After'));
    await wait((Number.isFinite(retryAfter) ? retryAfter : 2) * 1000 + 100);
  }
};

// Serve static files from /public folder (useful when running Node locally, optional on Vercel).
app.use(express.static('public'))
// Define index.html as the root explicitly (useful on Vercel, optional when running Node locally).
app.get('/', (req, res) => { res.redirect('/index.html') })

app.get('/departures/:date', async (req, res) => {
  try {
    const result = await fetchFlightData(req.params.date);

    res.json({
      numberOfFlights: result.numberOfFlights ?? 0,
      flights: result.flights ?? []
    });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ error: 'Unable to retrieve departures' });
  }
})



const port = 3000
// app.listen(...): starts the web server and prints a message when it's ready.
// You can then open the URL in your browser to use the app locally.
app.listen(port, () => {
  console.log(`Express is live at http://localhost:${port}`)
})
