const SearchInput = ({ ...rest }) => {
  return (
    <div className="wrapper">
      <input className="input" {...rest} />
    </div>
  );
};

export default SearchInput;