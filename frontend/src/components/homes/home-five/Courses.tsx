import { useDispatch } from "react-redux";
import { addToWishlist } from "../../../redux/features/wishlistSlice";
import InjectableSvg from "../../../hooks/InjectableSvg";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchPrograms, type Program } from "../../../services/programService";
import { fetchDanceStyles, type DanceStyle } from "../../../services/danceStyleService";

const Courses = () => {
   const dispatch = useDispatch();
   const { t } = useTranslation();
   const [searchParams] = useSearchParams();
   const categoryId = searchParams.get('category');
   const [programs, setPrograms] = useState<Program[]>([]);
   const [danceStyles, setDanceStyles] = useState<DanceStyle[]>([]);
   const [selectedDanceStyle, setSelectedDanceStyle] = useState<string | null>(categoryId);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

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

   useEffect(() => {
      const loadPrograms = async () => {
         try {
            setLoading(true);
            const params: { status: string; limit: number; DanceStyle?: string } = { 
               status: 'active', 
               limit: 8 
            };
            if (selectedDanceStyle) {
               params.DanceStyle = selectedDanceStyle;
            }
            const response = await fetchPrograms(params);
            setPrograms(response.Programs);
            setError(null);
         } catch (err) {
            setError(err instanceof Error ? err.message : t('common.error_loading_data'));
         } finally {
            setLoading(false);
         }
      };

      loadPrograms();
   }, [t, selectedDanceStyle]);

   const handleAddToWishlist = (item: Program) => {
      const wishlistItem = {
         id: parseInt(item._id.slice(-8), 16) || Math.floor(Math.random() * 1000000),
         title: item.name,
         thumb: item.image || '/assets/img/courses/course_default.jpg',
         price: 0,
      };
      dispatch(addToWishlist(wishlistItem));
   };

   if (loading) {
      return (
         <section className="courses-area-four courses__bg-three" style={{ backgroundImage: `url(/assets/img/bg/h5_courses_bg.jpg)` }}>
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-12 text-center">
                     <p>{t('common.loading')}</p>
                  </div>
               </div>
            </div>
         </section>
      );
   }

   if (error) {
      return (
         <section className="courses-area-four courses__bg-three" style={{ backgroundImage: `url(/assets/img/bg/h5_courses_bg.jpg)` }}>
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-12 text-center">
                     <p>{error}</p>
                  </div>
               </div>
            </div>
         </section>
      );
   }

   return (
      <section className="courses-area-four courses__bg-three" style={{ backgroundImage: `url(/assets/img/bg/h5_courses_bg.jpg)` }}>
         <div className="courses__bg-shape-one">
            <InjectableSvg src="/assets/img/courses/h5_courses_bg_shape01.svg" alt="" className="injectable" />
         </div>
         <div className="courses__bg-shape-two">
            <InjectableSvg src="/assets/img/courses/h5_courses_bg_shape02.svg" alt="" className="injectable" />
         </div>
         <div className="container">
            <div className="row justify-content-center">
               <div className="col-xl-5 col-lg-8">
                  <div className="section__title text-center mb-50">
                     <span className="sub-title">{t('common.top_class_courses')}</span>
                     <h2 className="title bold">{t('common.best_exciting_class_experience')}</h2>
                  </div>
               </div>
            </div>

            {danceStyles.length > 0 && (
               <div className="row justify-content-center mb-40">
                  <div className="col-12">
                     <div className="courses__filter" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        gap: '12px',
                        marginBottom: '30px'
                     }}>
                        <button
                           className={!selectedDanceStyle ? 'active' : ''}
                           onClick={() => setSelectedDanceStyle(null)}
                           style={{
                              padding: '10px 24px',
                              border: '2px solid #e0e0e0',
                              borderRadius: '30px',
                              background: !selectedDanceStyle ? '#6c5ce7' : 'transparent',
                              color: !selectedDanceStyle ? '#fff' : '#333',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              fontSize: '14px',
                              fontWeight: '500',
                              whiteSpace: 'nowrap'
                           }}
                           onMouseEnter={(e) => {
                              if (!selectedDanceStyle) return;
                              e.currentTarget.style.background = '#f5f5f5';
                              e.currentTarget.style.borderColor = '#6c5ce7';
                           }}
                           onMouseLeave={(e) => {
                              if (!selectedDanceStyle) return;
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.borderColor = '#e0e0e0';
                           }}
                        >
                           {t('common.all_programs')}
                        </button>
                        {danceStyles.map((cat) => (
                           <button
                              key={cat._id}
                              className={selectedDanceStyle === cat._id ? 'active' : ''}
                              onClick={() => setSelectedDanceStyle(cat._id)}
                              style={{
                                 padding: '10px 24px',
                                 border: '2px solid #e0e0e0',
                                 borderRadius: '30px',
                                 background: selectedDanceStyle === cat._id ? '#6c5ce7' : 'transparent',
                                 color: selectedDanceStyle === cat._id ? '#fff' : '#333',
                                 cursor: 'pointer',
                                 transition: 'all 0.3s ease',
                                 fontSize: '14px',
                                 fontWeight: '500',
                                 whiteSpace: 'nowrap'
                              }}
                              onMouseEnter={(e) => {
                                 if (selectedDanceStyle !== cat._id) {
                                    e.currentTarget.style.background = '#f5f5f5';
                                    e.currentTarget.style.borderColor = '#6c5ce7';
                                 }
                              }}
                              onMouseLeave={(e) => {
                                 if (selectedDanceStyle !== cat._id) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.borderColor = '#e0e0e0';
                                 }
                              }}
                           >
                              {cat.name}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            )}

            {programs.length === 0 && !loading && (
               <div className="row justify-content-center">
                  <div className="col-12 text-center">
                     <p>{t('common.no_programs_found')}</p>
                  </div>
               </div>
            )}

            <div className="row justify-content-center">
               {programs.map((item) => {
                  const courseSlug = (item as Program & { slug?: string }).slug || item._id;
                  return (
                     <div key={item._id} className="col-xl-3 col-lg-4 col-md-6">
                        <div className="courses__item-six shine__animate-item">
                           <div className="courses__item-thumb-five shine__animate-link">
                              <Link to={`/program/${courseSlug}`}>
                                 <img src={item.image || '/assets/img/courses/course_default.jpg'} alt={item.name} />
                              </Link>
                              <a onClick={() => handleAddToWishlist(item)} className="courses__wishlist-two course-heart-btn" style={{ cursor: "pointer" }}>
                                 <InjectableSvg src="/assets/img/icons/heart02.svg" alt="" className="injectable" />
                              </a>
                           </div>
                           <div className="courses__item-content-five">
                              <ul className="courses__item-meta list-wrap">
                                 <li className="courses__review courses__review-two">
                                    <div className="rating">
                                       <i className="fas fa-star"></i>
                                       <i className="fas fa-star"></i>
                                       <i className="fas fa-star"></i>
                                       <i className="fas fa-star"></i>
                                       <i className="fas fa-star"></i>
                                    </div>
                                    <span>(5.0 {t('common.reviews')})</span>
                                 </li>
                              </ul>
                              <h2 className="title">
                                 <Link to={`/program/${courseSlug}`}>{item.name}</Link>
                              </h2>
                              <p>{item.description || ''}</p>
                              <div className="courses__item-content-bottom-two">
                                 <div className="button">
                                    <Link to={`/program/${courseSlug}`}>
                                       <span className="text">{t('common.book_session')}</span>
                                       <i className="flaticon-arrow-right"></i>
                                    </Link>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
         <div className="courses__shape-wrap-three">
            <img src="/assets/img/courses/h5_courses_shape01.svg" alt="shape" data-aos="fade-right" data-aos-delay="400" />
            <img src="/assets/img/courses/h5_courses_shape01.svg" alt="shape" data-aos="fade-up-right" data-aos-delay="400" />
            <img src="/assets/img/courses/h5_courses_shape01.svg" alt="shape" className="alltuchtopdown" />
            <img src="/assets/img/courses/h5_courses_shape01.svg" alt="shape" data-aos="fade-up-left" data-aos-delay="400" />
         </div>
      </section>
   )
}

export default Courses

