
import SearchRounded from "@material-ui/icons/SearchRounded";


const SearchInput = ({ ...rest }) => {
  return (
    <div className="wrapper">
      <SearchRounded color="inherit" />
      <input className="input" {...rest} />
    </div>
  );
};

export default SearchInput;