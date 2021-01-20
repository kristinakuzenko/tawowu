import Layout from "../../components/Layout/Layout";
const Country=({country,countries})=>{
  const myCountry = countries.filter(
    (country1) =>
      country1.name.includes(country) 
  );
  return <Layout countries={countries} title={country}>

        {myCountry.map((countries) =>(
            <div className="country">
              <div>{countries.name}</div>
              <img className="image"  src={countries.image} ></img>
            </div>
        ))}
  </Layout>;
}
export default Country;

export const getServerSideProps = async({params})=>{
  const country = params.id;
  const res = await fetch("https://kristinakuzenko.github.io/countries.json");
  const countries = await res.json();

  return{
      props:{
        country,
        countries
      },
  };
};
