import React from 'react';
import CountriesTable from "../components/CountriesTable/CountriesTable";
import Layout from "../components/Layout/Layout";
import MainPage from "../components/MainPage/MainPage";
import MapWorld from "../components/MapWorld/MapWorld";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const Home=()=> {
  const router = useRouter();
console.log(router);
  const { t } = useTranslation('common');
  return (
    <Layout>
      
      <MainPage />
      <div className="map">
        <MapWorld />
      </div>
      <Link
            href='/'
            locale={router.locale === 'en' ? 'de' : 'en'}
          >
            <button>
            go
            </button>
          </Link>
      <p>{t('h')}</p>
      <CountriesTable />
    </Layout>
  );
}
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common']),
  },
})
export default Home



