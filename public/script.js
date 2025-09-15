

// generate todays date in YYMMDD format
const yymmdd = () => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

// generate todays date in human readable format
const today = () => {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return now.toLocaleDateString('en-US', options);
}

document.querySelector('header').innerHTML =
  `<h1>Departures </h1>
  <h2>Stockholm Arlanda Airport (ARN)</h2>
  <p>${today()}</p>`

const url = `/departures/${yymmdd()}`
const response = await fetch(url)
const json = await response.json()

console.log(json)

json.flights.forEach(flight => {

  const dep = flight.departure;
  const airline = dep.airlineOperator?.name || '';
  const terminal = dep.locationAndStatus?.terminal || '';
  const gate = dep.locationAndStatus?.gate || '';
  const status = dep.locationAndStatus?.flightLegStatusEnglish || '';

  const scheduled = dep.departureTime?.scheduledUtc || '';
  const codeShares = dep.codeShareData && dep.codeShareData.length ? dep.codeShareData.join(', ') : '';
  const remarks = dep.remarksEnglish && dep.remarksEnglish.length ? dep.remarksEnglish.map(r => r.text).join('; ') : '';
  const destination = dep.arrivalAirportEnglish || dep.arrivalAirportSwedish || '';

  const statusColor = status === 'Cancelled' ? 'red' : (status === 'Departed' ? 'green' : 'black');

  const div = document.createElement('div');
  div.classList.add('flight');
  div.innerHTML = `
    <div style="border:1px solid #ccc; border-radius:8px; padding:1em; margin-bottom:1em; background:#f9f9f9;">
      <h2 style="margin:0 0 0.2em 0;">${dep.flightId} <span style="font-size:0.8em; color:#555;">${airline}</span></h2>
      <p style="margin:0.2em 0;"><strong>Destination:</strong> ${destination}</p>
      <p style="margin:0.2em 0;"><strong>Scheduled:</strong> ${scheduled}</p>
      <p style="margin:0.2em 0;"><strong>Terminal:</strong> ${terminal}${gate ? ', Gate ' + gate : ''}</p>
      <p style="margin:0.2em 0;"><strong>Status:</strong> <span style="color:${statusColor}; font-weight:bold;">${status}</span></p>
      ${codeShares ? `<p style='margin:0.2em 0;'><strong>Code Share:</strong> ${codeShares}</p>` : ''}
      ${remarks ? `<p style='margin:0.2em 0;'><strong>Remarks:</strong> ${remarks}</p>` : ''}
    </div>
  `;
  document.querySelector('main').appendChild(div);

}) 
