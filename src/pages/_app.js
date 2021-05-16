import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
import { Provider } from 'next-auth/client';
import key from "../components/GoogleApiKey/GoogleApiKey";
import Head from 'next/head'
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

function MyApp({ Component, pageProps }) {
    const { session } = pageProps;
    return (
        <>
            <Provider options={{ site: process.env.SITE }} session={session}>
                <Head>
                    <head>
                        <link href='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css' rel='stylesheet' />
                    </head>
                    <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.min.js"></script>
                    <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.css" type="text/css" />

                    <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.min.js"></script>
                    <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"></script>
                    <link
                        rel="stylesheet"
                        href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
                        crossorigin="anonymous"
                    />
                    <script
                        src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"
                        crossorigin="anonymous"
                    />
                    <script
                        src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
                        crossorigin="anonymous"
                    />
                    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCp7BwWMHA_ZfhMSTSTs2QxW1_vocqb1k4&libraries=places"></script>

                </Head>
                <Component {...pageProps} />
            </Provider>
        </>
    );
}

export default MyApp;
