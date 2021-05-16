import React from 'react';
import CountriesTable from "../components/CountriesTable/CountriesTable";
import Layout from "../components/Layout/Layout";
import MainPage from "../components/MainPage/MainPage";
import MapWorld from "../components/MapWorld/MapWorld";

export default function Home() {
  return (
    <Layout>
      <MainPage />
      <div className="map">
        <MapWorld />
      </div>
      <CountriesTable />
    </Layout>
  );
}



