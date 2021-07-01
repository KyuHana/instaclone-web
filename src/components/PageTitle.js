import propTypes from "prop-types";
import { Helmet } from "react-helmet-async";

function PageTitle({title}) {
  return <Helmet>{title} | Instaclone</Helmet>
}

PageTitle.propTypes = {
  title: propTypes.string.isRequired,
} 

export default PageTitle;