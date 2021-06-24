import { useTranslation } from 'next-i18next'

const MainPage = ({ ...rest }) => {
       const { t } = useTranslation('common')
       return (
              <div>
                     <div className="main-block "> 
                     </div>
                     <div className="main-header">
                            <div>
                                   <span>{t('main-h-1')}</span>
                            </div>
                            <div>
                                   <span>{t('main-h-2')}</span>
                            </div>
                            <div className="btn filter-p filter-btn ">
                            {t('change-language')}
                            </div>
                     </div>
                     <div id="container"></div>
              </div>
       );
};

export default MainPage;
