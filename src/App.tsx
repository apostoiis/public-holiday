import React from 'react';
import './App.css';

const VALID_FROM = '2024-01-01';
const VALID_TO = '2024-12-31';

const baseUrl = 'https://openholidaysapi.org';

interface Country {
  isoCode: string;
  name: Array<{ text: string }>;
}

interface Holiday {
  startDate: string;
  name: Array<{ language: string; text: string }>;
}

const App = () => {
  const [countries, setCountries] = React.useState<Country[]>([]);
  const [value, setValue] = React.useState('');
  const [holidays, setHolidays] = React.useState<Holiday[]>([]);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    const response = await fetch(
      `${baseUrl}/PublicHolidays?countryIsoCode=${newValue}&validFrom=${VALID_FROM}&validTo=${VALID_TO}&languageIsoCode=EN`,
    );

    const holidays: Holiday[] = await response.json();
    setHolidays(holidays);
  };

  React.useEffect(() => {
    async function fetchCountries() {
      const response = await fetch(`${baseUrl}/Countries?languageIsoCode=EN`);
      const countries = await response.json();
      setCountries(countries);
    }

    fetchCountries();
  }, []);

  React.useEffect(() => {
    if (!countries.length) return;

    const theNL = countries.find((c: Country) => c.isoCode === 'NL');

    async function fetchDataForNL() {
      const response = await fetch(
        `${baseUrl}/PublicHolidays?countryIsoCode=${theNL?.isoCode}&validFrom=${VALID_FROM}&validTo=${VALID_TO}&languageIsoCode=EN`,
      );
      const holidays: Holiday[] = await response.json();
      setHolidays(holidays);
    }

    fetchDataForNL();
  }, [countries, countries.length]);

  return (
    <div>
      <div>
        <label htmlFor="country-select">Choose a country:</label>
      </div>
      <select id="country-select" value={value ? value : 'NL'} onChange={handleChange}>
        {countries.map((country: Country) => {
          return (
            <option key={country.isoCode} value={country.isoCode}>
              {country.name[0].text}
            </option>
          );
        })}
      </select>
      <ol>
        {holidays.map((holiday: Holiday) => {
          return (
            <li key={holiday.name[0].text} style={{ display: 'flex' }}>
              {holiday.startDate} - {holiday.name[0].text}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default App;
