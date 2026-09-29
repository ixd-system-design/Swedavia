

const stockholmTimeZone = 'Europe/Stockholm';

// Generate an API date in YYMMDD format using Stockholm time.
const yymmdd = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: stockholmTimeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const yy = values.year.slice(-2);
  const mm = values.month;
  const dd = values.day;
  return `${yy}${mm}${dd}`;
}

const stockholmDate = offsetDays => {
  const date = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: stockholmTimeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

  return `${values.year.slice(-2)}${values.month}${values.day}`;
};

const formatStockholmDateTime = utcDate => {
  if (!utcDate) return '';

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: stockholmTimeZone,
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(utcDate));
};

const formatStockholmTime = utcDate => {
  if (!utcDate) return '';

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: stockholmTimeZone,
    timeStyle: 'short'
  }).format(new Date(utcDate));
};

const stockholmDateInputValue = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: stockholmTimeZone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}).format(new Date());

const header = document.querySelector('header');
const main = document.querySelector('main');

header.innerHTML =
  `<h1>Departures</h1>
  <h2>Stockholm Arlanda Airport (ARN)</h2>
  <input id="departure-date" type="date" value="${stockholmDateInputValue()}">`;

const departureDateInput = document.querySelector('#departure-date');

const loadDepartures = async date => {
  main.replaceChildren();
  const response = await fetch(`/departures/${yymmdd(new Date(`${date}T12:00:00`))}`);
  const json = await response.json();

  if (!response.ok) {
    main.innerHTML = `<p>Unable to load departures: ${json.error ?? 'API request failed'}</p>`;
    return;
  }

  renderDepartures(json.flights ?? []);
};

departureDateInput.addEventListener('change', () => loadDepartures(departureDateInput.value));

const renderDepartures = flights => {
const now = Date.now();

const upcomingFlights = flights.filter(flight => {
  const departure = flight.departure;
  const departureTime = departure.departureTime ?? {};
  const expectedDeparture = Date.parse(
    departureTime.estimatedUtc ?? departureTime.scheduledUtc ?? ''
  );
  const statusCode = departure.locationAndStatus?.flightLegStatus;
  const hasDeparted = statusCode === 'DEP' || Boolean(departureTime.actualUtc);

  return (
    !hasDeparted &&
    !['DEL', 'CAN'].includes(statusCode) &&
    (expectedDeparture > now || statusCode === 'SEQ')
  );
}).sort((first, second) => {
  const firstDepartureTime = first.departure.departureTime ?? {};
  const secondDepartureTime = second.departure.departureTime ?? {};
  const firstTime = Date.parse(
    firstDepartureTime.estimatedUtc ?? firstDepartureTime.scheduledUtc ?? ''
  );
  const secondTime = Date.parse(
    secondDepartureTime.estimatedUtc ?? secondDepartureTime.scheduledUtc ?? ''
  );

  return firstTime - secondTime;
});

const renderFlight = flight => {

  const dep = flight.departure;
  const airline = dep.airlineOperator?.name || '';
  const terminal = dep.locationAndStatus?.terminal || '';
  const gate = dep.locationAndStatus?.gate || '';
  const status = dep.locationAndStatus?.flightLegStatusEnglish || '';

  const scheduledUtc = dep.departureTime?.scheduledUtc || '';
  const estimatedUtc = dep.departureTime?.estimatedUtc || '';
  const scheduled = formatStockholmTime(scheduledUtc);
  const dedicatedEstimated = estimatedUtc ? formatStockholmTime(estimatedUtc) : '';
  const statusEstimatedMatch = status.match(/estimated\s+(\d{1,2}:\d{2})/i);
  const statusEstimated = statusEstimatedMatch
    ? statusEstimatedMatch[1].padStart(5, '0')
    : '';
  const estimated = dedicatedEstimated || statusEstimated;
  const displayedEstimated = estimated && estimated !== scheduled ? estimated : '';
  const scheduledMinutes = scheduled ? Number(scheduled.split(':')[0]) * 60 + Number(scheduled.split(':')[1]) : NaN;
  const statusEstimatedMinutes = statusEstimated
    ? Number(statusEstimated.split(':')[0]) * 60 + Number(statusEstimated.split(':')[1])
    : NaN;
  const estimatedClass = dedicatedEstimated
    ? 'estimated-dedicated'
    : statusEstimated && statusEstimatedMinutes < scheduledMinutes
      ? 'estimated-early'
      : statusEstimated
        ? 'estimated-status'
        : '';
  const remarks = dep.remarksEnglish && dep.remarksEnglish.length ? dep.remarksEnglish.map(r => r.text).join('; ') : '';
  const destination = dep.arrivalAirportEnglish || dep.arrivalAirportSwedish || '';

  const div = document.createElement('div');
  div.classList.add('flight');
  div.innerHTML = `
    <div class="flight-card">
      <div class="flight-header">
        <div class="flight-airline">${airline}</div>
        <div class="flight-meta">
          ${remarks ? `<span class="flight-remarks">${remarks}</span>` : ''}
        </div>
      </div>
      <div class="flight-info-layout">
        <div class="flight-identity">
          <h2>${dep.flightId}</h2>
          <div class="flight-destination">${destination}</div>
        </div>
        <div class="flight-widgets" aria-label="Flight location">
          <div class="flight-widget">
            <span class="flight-widget-value">${terminal || '—'}</span>
            <span class="flight-widget-label">TERMINAL</span>
          </div>
          <div class="flight-widget">
            <span class="flight-widget-value">${gate || '—'}</span>
            <span class="flight-widget-label">GATE</span>
          </div>
          <div class="flight-widget">
            <span class="flight-widget-value${displayedEstimated ? ' scheduled-original' : ' scheduled-current'}">${scheduled || '—'}</span>
            <span class="flight-widget-label">SCHEDULED</span>
          </div>
          <div class="flight-widget">
            <span class="flight-widget-value${displayedEstimated ? ` ${estimatedClass}` : ''}">${displayedEstimated || '&nbsp;'}</span>
            <span class="flight-widget-label">${displayedEstimated ? 'ESTIMATED' : '&nbsp;'}</span>
          </div>
        </div>
      </div>
    </div>
  `;
  return div;
};

upcomingFlights.forEach(flight => {
  main.appendChild(renderFlight(flight));
});
};

loadDepartures(departureDateInput.value);
