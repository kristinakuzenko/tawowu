import Layout from "../../components/Layout/Layout";
const Country=({country,countries})=>{
  const australia = countries.filter(
    (country1) =>
      country1.name.includes(country) 
  );
  console.log(australia);
  return <Layout title={country}>

        {australia.map((countries) =>(
            <div className="country">
              <div >{countries.name}</div>
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
