import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import './App.css';
const VALID_FROM = '2024-01-01';
const VALID_TO = '2024-12-31';
const baseUrl = 'https://openholidaysapi.org';
const App = () => {
    const [countries, setCountries] = React.useState([]);
    const [value, setValue] = React.useState('');
    const [holidays, setHolidays] = React.useState([]);
    const handleChange = async (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        const response = await fetch(`${baseUrl}/PublicHolidays?countryIsoCode=${newValue}&validFrom=${VALID_FROM}&validTo=${VALID_TO}&languageIsoCode=EN`);
        const holidays = await response.json();
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
        if (!countries.length)
            return;
        const theNL = countries.find((c) => c.isoCode === 'NL');
        async function fetchDataForNL() {
            const response = await fetch(`${baseUrl}/PublicHolidays?countryIsoCode=${theNL?.isoCode}&validFrom=${VALID_FROM}&validTo=${VALID_TO}&languageIsoCode=EN`);
            const holidays = await response.json();
            setHolidays(holidays);
        }
        fetchDataForNL();
    }, [countries, countries.length]);
    return (_jsxs("div", { children: [_jsx("div", { children: _jsx("label", { htmlFor: "country-select", children: "Choose a country:" }) }), _jsx("select", { id: "country-select", value: value ? value : 'NL', onChange: handleChange, children: countries.map((country) => {
                    return (_jsx("option", { value: country.isoCode, children: country.name[0].text }, country.isoCode));
                }) }), _jsx("ol", { children: holidays.map((holiday) => {
                    return (_jsxs("li", { children: [holiday.startDate, " - ", holiday.name[0].text] }, holiday.name[0].text));
                }) })] }));
};
export default App;
