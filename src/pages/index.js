import Head from "next/head";
import { useState } from "react";
import CountriesTable from "../components/CountriesTable/CountriesTable";
import Layout from "../components/Layout/Layout";
import SearchInput from "../components/MainPage/MainPage";
import styles from "../styles/Home.module.css";

export default function Home({ countries }) {
  const [keyword, setKeyword] = useState("");

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(keyword) ||
      country.region.toLowerCase().includes(keyword) ||
      country.subregion.toLowerCase().includes(keyword)
  );

  const onInputChange = (e) => {
    e.preventDefault();

    setKeyword(e.target.value.toLowerCase());
  };

  return (
    <Layout>
<SearchInput></SearchInput>

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
