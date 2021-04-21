import Head from "next/head";
import React from 'react';
import CountriesTable from "../components/CountriesTable/CountriesTable";
import SearchInput from "../components/SearchInput/SearchInput";
import Layout from "../components/Layout/Layout";
import styled from "styled-components";
import MainPage from "../components/MainPage/MainPage";
import MapChart from "../components/MapChart/MapChart";
import Map from "../components/MapWorld/MapWorld";
import ReactTooltip from "react-tooltip";
import dynamic from 'next/dynamic'
import styles from "../styles/Home.module.css";

//database import
import fire from '../config/fire-config';
import { useState } from "react";


export default  function Home() {

  const [isTooltipVisible, setTooltipVisibility] = React.useState(false);
  const [content, setContent] = useState("");
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/greggs.json?access_token=pk.eyJ1Ijoia3Jpc3RpbmFrdXplbmtvIiwiYSI6ImNrbnJpZDFtYjBwMG8ybnBmeG82a3Z0ejYifQ.GYQGZmk2Y0sSruGEpupdgw&bbox=-0.227654%2C51.464102%2C0.060737%2C51.553421&limit=10`;
  const [locations, setLocations] = React.useState([]);

  React.useEffect(() => {
    setTooltipVisibility(true);
    const fetchLocations = async () => {
      await fetch(url).then((response) =>
        response.text()).then((res) => JSON.parse(res))
      .then((json) => {
        setLocations(json.features);
      }).catch((err) => console.log({ err }));
    };
    fetchLocations();
  }, []);
  const Map = dynamic(() => import("../components/Map/Map"), {
    loading: () => "Loading...",
    ssr: false
  });


  return (
    <Layout>
      <MainPage />
      <div className="map">
        <MapChart setTooltipContent={setContent} />
        {isTooltipVisible && <ReactTooltip  place='right' className="tooltip">{content}</ReactTooltip>}
      </div>
      <Container><Map locations={locations} /></Container>
        
  
      <CountriesTable />

    </Layout>
  );
}
const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;


