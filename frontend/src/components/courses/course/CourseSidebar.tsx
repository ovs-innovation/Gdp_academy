import { useState, useEffect } from "react";
import { fetchDanceStyles, type DanceStyle } from "../../../services/danceStyleService";
import { useTranslation } from "react-i18next";

interface ProgramSidebarProps {
   setSelectedDanceStyle: (danceStyleSlug: string | null) => void;
   selectedDanceStyle: string | null;
}

const CourseSidebar = ({ setSelectedDanceStyle, selectedDanceStyle }: ProgramSidebarProps) => {
   const { t } = useTranslation();
   const [danceStyles, setDanceStyles] = useState<DanceStyle[]>([]);
   const [showMoreDanceStyle, setShowMoreDanceStyle] = useState(false);

   useEffect(() => {
      const loadDanceStyles = async () => {
         try {
            const response = await fetchDanceStyles('active');
            setDanceStyles(response.categories);
         } catch (err) {
            console.error('Failed to load Dance Styles:', err);
         }
      };
      loadDanceStyles();
   }, []);

   const handleDanceStyle = (danceStyleSlug: string | null) => {
      setSelectedDanceStyle(danceStyleSlug);
   };

   const danceStylesToShow = showMoreDanceStyle ? danceStyles : danceStyles.slice(0, 8);

   return (
      <div className="col-xl-3 col-lg-4">
         <aside className="courses__sidebar">
            <div className="courses-widget">
               <h4 className="widget-title">{t('common.categories')}</h4>
               <div className="courses-cat-list">
                  <ul className="list-wrap">
                      <li style={{ marginBottom: '8px' }}>
                        <div 
                           onClick={() => handleDanceStyle(null)} 
                           className={`form-check ${!selectedDanceStyle ? 'active-category-item' : ''}`} 
                           style={{ 
                              cursor: 'pointer', 
                              padding: '10px 15px', 
                              borderRadius: '12px', 
                              transition: 'all 0.3s ease',
                              background: !selectedDanceStyle ? 'var(--grad-primary)' : 'rgba(255,255,255,0.4)',
                              boxShadow: !selectedDanceStyle ? '0 8px 20px rgba(87, 81, 225, 0.3)' : 'none',
                              border: '1px solid var(--glass-border)'
                           }}
                        >
                           <input className="form-check-input d-none" type="checkbox" checked={!selectedDanceStyle} readOnly id="cat_all" />
                           <label 
                              className="form-check-label w-100" 
                              htmlFor="cat_all" 
                              style={{ 
                                 cursor: 'pointer', 
                                 color: !selectedDanceStyle ? '#fff' : 'var(--text-primary)',
                                 fontWeight: !selectedDanceStyle ? '800' : '500',
                                 margin: 0
                              }}
                           >
                              {t('common.all_programs')}
                           </label>
                        </div>
                      </li>
                     {danceStylesToShow.map((danceStyle) => (
                         <li key={danceStyle._id} style={{ marginBottom: '8px' }}>
                            <div 
                               onClick={() => handleDanceStyle(danceStyle.slug || danceStyle._id)} 
                               className={`form-check ${selectedDanceStyle === (danceStyle.slug || danceStyle._id) ? 'active-category-item' : ''}`}
                               style={{ 
                                  cursor: 'pointer', 
                                  padding: '10px 15px', 
                                  borderRadius: '12px', 
                                  transition: 'all 0.3s ease',
                                  background: selectedDanceStyle === (danceStyle.slug || danceStyle._id) ? 'var(--grad-primary)' : 'rgba(255,255,255,0.4)',
                                  boxShadow: selectedDanceStyle === (danceStyle.slug || danceStyle._id) ? '0 8px 20px rgba(87, 81, 225, 0.3)' : 'none',
                                  border: '1px solid var(--glass-border)'
                               }}
                            >
                               <input className="form-check-input d-none" type="checkbox" checked={selectedDanceStyle === (danceStyle.slug || danceStyle._id)} readOnly id={`cat_${danceStyle._id}`} />
                               <label 
                                  className="form-check-label w-100" 
                                  htmlFor={`cat_${danceStyle._id}`}
                                  style={{ 
                                     cursor: 'pointer', 
                                     color: selectedDanceStyle === (danceStyle.slug || danceStyle._id) ? '#fff' : 'var(--text-primary)',
                                     fontWeight: selectedDanceStyle === (danceStyle.slug || danceStyle._id) ? '800' : '500',
                                     margin: 0
                                  }}
                               >
                                  {danceStyle.name}
                               </label>
                            </div>
                         </li>
                     ))}
                  </ul>
                  {danceStyles.length > 8 && (
                     <div className="show-more">
                        <a className={`show-more-btn ${showMoreDanceStyle ? 'active' : ''}`} style={{ cursor: "pointer" }} onClick={() => setShowMoreDanceStyle(!showMoreDanceStyle)}>
                           {showMoreDanceStyle ? t('common.show_less') : t('common.show_more')}
                        </a>
                     </div>
                  )}
               </div>
            </div>
         </aside>
      </div>
   );
}

export default CourseSidebar;

