import Layout from "../../components/Layout/Layout";
import Link from "next/link";
import {useState} from "react";
import SearchInput from "../../components/SearchInput/SearchInput";

const Country = ({country, countries, cities}) => {
  const [keyword, setKeyword] = useState("");

  // Pick the country from the list by its name
  const filteredCountries = () => countries.filter((country) => country.name === country);

  // Here we filter out the cities that don't belong to current country
  const countryCities = cities.filter((city) => city.country.toLowerCase() === country.toLowerCase());

  // Here we filter out the cities that don't match the keyword selected
  // If there is no keyword selected we simply return the countryCities array as it is
  const filteredCities = () => {
    const needle = keyword ? keyword.toLowerCase() : '';
    return countryCities.filter((city) => city.city.toLowerCase().indexOf(needle) !== -1);
  };

  // Let's track the input change event and set keyword
  // Once keyword is set -- it will effect the filteredCities() above
  const onInputChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value);
  };

  return <Layout countries={countries} title={country}>
    <div className="country-page">
      <div className="country-page2">
        {filteredCountries().map((country) => (
            <div className="country-h" key="{country.name}">
              <div>
                Discover {country.name}
              </div>
            </div>
        ))}
        <div className="input-div">
          <SearchInput
              placeholder="Search for city"
              onChange={onInputChange}
          />
        </div>

        <div className="container-fluid cities">
          <div className="row">
          {filteredCities().map((city) => (
            <div className="city-descr col-6 col-sm-6 col-md-6 col-lg-4 col-xl-4" key={city.city}>
              <Link href={`/city/${city.city}`} key={city.city}>
                <img className="city-icon" src={city.icon} />
              </Link>
              <h1 className="country-city">{city.city}</h1>
              <p className="country-desc">{city.description}</p>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  </Layout>;
}
export default Country;

export const getServerSideProps = async ({params}) => {
  const country = params.id;
  const res = await fetch("https://kristinakuzenko.github.io/cities.json");
  const cities = await res.json();
  const res2 = await fetch("https://kristinakuzenko.github.io/countries.json");
  const countries = await res2.json();
  return {
    props: {
      country,
      cities,
      countries
    },
  };
};
