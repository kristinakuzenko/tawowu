const MainPage = ({ ...rest }) => {
       return (
              <div>
                     <div className="main-block ">        </div>
                     <div className="main-header">
                            <div>
                                   <span>Welcome </span>
                                   <span>to </span>
                                   <span>Tawowu </span>
                            </div>
                            <div>
                                   <span>travel </span>
                                   <span>world</span>
                            </div>

                            <h2><button type="button" className="btn discover">Discover the World</button></h2>

                     </div>
                     <div id="container"></div>
              </div>
       );
};

export default MainPage;
