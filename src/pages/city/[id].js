import Layout from "../../components/Layout/Layout";
import Link from "next/link";
const City=({city,cities,countries})=>{
  return <Layout countries={countries} title={city}>


<div className="continent2">{city}     
</div>

  </Layout>;

}
export default City;
export const getServerSideProps = async({params})=>{
    const city = params.id;
    const res = await fetch("https://kristinakuzenko.github.io/cities.json");
    const cities = await res.json();
    const res2 = await fetch("https://kristinakuzenko.github.io/countries.json");
    const countries = await res2.json();
    return{
        props:{
          city,
          countries,
          cities
        },
    };
  };
