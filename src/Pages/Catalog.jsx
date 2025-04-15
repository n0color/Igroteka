import { useLocation } from "react-router-dom";
import Header from "../Components/Header";
import queryString from "query-string";
import Footer from "../Components/Footer";


export default function Catalog() {
  const location = useLocation();
  const query = queryString.parse(location.search);

  return (
    <>
      <Header />
      <div> Вы искали: {query.search} </div>
      <Footer />
    </>
  )
}