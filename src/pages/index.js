import Head from "next/head";
import React from 'react';
import CountriesTable from "../components/CountriesTable/CountriesTable";
import SearchInput from "../components/SearchInput/SearchInput";
import Layout from "../components/Layout/Layout";
import MainPage from "../components/MainPage/MainPage";
import MapChart from "../components/MapChart/MapChart";
import ReactTooltip from "react-tooltip";
import MapWorld from "../components/MapWorld/MapWorld";
import styles from "../styles/Home.module.css";

//database import
import fire from '../config/fire-config';
import { useState } from "react";


export default  function Home() {

  const [isTooltipVisible, setTooltipVisibility] = React.useState(false);
  const [content, setContent] = useState("");


  React.useEffect(() => {
    setTooltipVisibility(true);
    
  }, []);
 


  return (
    <Layout>
      <MainPage />
      <div className="map2">
        <MapChart setTooltipContent={setContent} />
        {isTooltipVisible && <ReactTooltip  place='right' className="tooltip">{content}</ReactTooltip>}
      </div>
      <div className="map">
      <MapWorld/>
      </div>
      <CountriesTable />
    </Layout>
  );
}



