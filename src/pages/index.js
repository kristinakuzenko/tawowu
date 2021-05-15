import React from 'react';
import CountriesTable from "../components/CountriesTable/CountriesTable";
import Layout from "../components/Layout/Layout";
import MainPage from "../components/MainPage/MainPage";
import MapWorld from "../components/MapWorld/MapWorld";
import { useState } from "react";


export default function Home() {

  const [isTooltipVisible, setTooltipVisibility] = React.useState(false);
  const [content, setContent] = useState("");

  React.useEffect(() => {
    setTooltipVisibility(true);
  }, []);

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



