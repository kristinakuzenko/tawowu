import Head from "next/head";
import { useState } from "react";
import CountriesTable from "../components/CountriesTable/CountriesTable";
import SearchInput from "../components/SearchInput/SearchInput";
import Layout from "../components/Layout/Layout";
import MainPage from "../components/MainPage/MainPage";
import MapChart from "../components/MapChart/MapChart";
import ReactTooltip from "react-tooltip";


import styles from "../styles/Home.module.css";

export default  function Home({ countries }) {
  const [keyword, setKeyword] = useState("");

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(keyword) ||
      country.region.toLowerCase().includes(keyword) ||
      country.subregion.toLowerCase().includes(keyword)
  );

  const [content, setContent] = useState("");
  return (
    <Layout countries={countries}>
<MainPage></MainPage>
<div className="map">
      <MapChart setTooltipContent={setContent} />
      <ReactTooltip  place='right' className="tooltip">{content}</ReactTooltip>
      </div>
      <CountriesTable countries={countries} />


    </Layout>
  );
}

export const getStaticProps = async () => {
  const res = await fetch("https://kristinakuzenko.github.io/countries.json");
  const countries = await res.json();

  return {
    props: {
      countries,
    },
  };
};
