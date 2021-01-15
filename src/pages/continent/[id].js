import Layout from "../../components/Layout/Layout";
const Continent=({continent})=>{
    console.log(continent);
  return <Layout >
<div>hhh</div>
<div>hhh</div>
<div>hhh</div>
<div>hhh</div>
<div>hhh</div>
<div>{continent}</div>
  </Layout>;

}
export default Continent;
export const getServerSideProps = async({params})=>{
    const continent = params.id;
    return{
        props:{
          continent,
        },
    };
  };
