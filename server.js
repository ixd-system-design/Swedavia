
import express from 'express';

const app = express();                 // initialize express  

// Serve static files from /public folder (useful when running Node locally, optional on Vercel).
app.use(express.static('public'))
// Define index.html as the root explicitly (useful on Vercel, optional when running Node locally).
app.get('/', (req, res) => { res.redirect('/index.html') })

app.get('/departures/:date', async (req, res) => {
  let url = new URL('https://api.swedavia.se/flightinfo/v2/query');
  url.searchParams.append('filter', `airport eq 'ARN' and scheduled eq '${req.params.date}' and flightType eq 'D'`);
  url.searchParams.append('count', '100');
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.API_KEY
      }
    })
    const json = await response.json();
    res.send(json);
  } catch (error) {
    console.error(error);
  }
})



const port = 3000
// app.listen(...): starts the web server and prints a message when it's ready.
// You can then open the URL in your browser to use the app locally.
app.listen(port, () => {
  console.log(`Express is live at http://localhost:${port}`)
})
