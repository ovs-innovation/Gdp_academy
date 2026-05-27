import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import CourseSidebar from './CourseSidebar';
import CourseTop from './CourseTop';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchPrograms, type Program } from '../../../services/programService';
import { useTranslation } from 'react-i18next';
import { useWishlist } from '../../../contexts/WishlistContext';
import { usePriceFormatter } from '../../../hooks/usePriceFormatter';
import { TranslatedContent } from '../../common/TranslatedContent';

const CourseArea = () => {
   const { t } = useTranslation();
   const { formatPriceDirect } = usePriceFormatter();
   const [searchParams, setSearchParams] = useSearchParams();
   const danceStyleId = searchParams.get('dance-style');
   const searchQuery = searchParams.get('search');

   const [programs, setPrograms] = useState<Program[]>([]);
   const [loading, setLoading] = useState(true);
   const [selectedDanceStyle, setSelectedDanceStyle] = useState<string | null>(danceStyleId);
   const { toggleWishlist, isInWishlist } = useWishlist();

   useEffect(() => {
      if (danceStyleId) {
         setSelectedDanceStyle(danceStyleId);
      }
   }, [danceStyleId]);

   const handleDanceStyleChange = (danceStyleId: string | null) => {
      setSelectedDanceStyle(danceStyleId);
      const newParams: { 'dance-style'?: string; search?: string } = {};
      if (danceStyleId) newParams['dance-style'] = danceStyleId;
      if (searchQuery) newParams.search = searchQuery;
      setSearchParams(newParams);
   };

   useEffect(() => {
      const loadPrograms = async () => {
         try {
            setLoading(true);
            const params: { status: string; DanceStyle?: string; search?: string } = {
               status: 'active'
            };
            if (selectedDanceStyle) {
               params.DanceStyle = selectedDanceStyle;
            }
            if (searchQuery) {
               params.search = searchQuery;
            }
            const response = await fetchPrograms(params);
            setPrograms(response.programs);
         } catch (err) {
            console.error('Failed to load programs:', err);
         } finally {
            setLoading(false);
         }
      };

      loadPrograms();
   }, [selectedDanceStyle, searchQuery]);

   const itemsPerPage = 12;
   const [itemOffset, setItemOffset] = useState(0);
   const endOffset = itemOffset + itemsPerPage;
   const currentItems = programs.slice(itemOffset, endOffset);
   const pageCount = Math.ceil(programs.length / itemsPerPage);

   const startOffset = itemOffset + 1;
   const totalItems = programs.length;

   const handlePageClick = (event: { selected: number }) => {
      const newOffset = (event.selected * itemsPerPage) % programs.length;
      setItemOffset(newOffset);
   };

   const [activeTab, setActiveTab] = useState(0);

   const handleTabClick = (index: number) => {
      setActiveTab(index);
   };

   if (loading) {
      return (
         <section className="all-courses-area section-py-120 glow-bg">
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-12 text-center">
                     <div className="spinner-border text-primary" role="status"></div>
                     <p className="mt-3">{t('common.loading')}</p>
                  </div>
               </div>
            </div>
         </section>
      );
   }

   return (
      <section className="all-courses-area section-pt-120 pb-120 glow-bg">
         <div className="container">
            <div className="row">
               <CourseSidebar setSelectedDanceStyle={handleDanceStyleChange} selectedDanceStyle={selectedDanceStyle} />
               <div className="col-xl-9 col-lg-8">
                  <CourseTop
                     startOffset={startOffset}
                     endOffset={Math.min(endOffset, totalItems)}
                     totalItems={totalItems}
                     programs={programs}
                     setPrograms={setPrograms}
                     handleTabClick={handleTabClick}
                     activeTab={activeTab}
                  />
                  <div className="tab-content" id="myTabContent">
                     <div className={`tab-pane fade ${activeTab === 0 ? 'show active' : ''}`} id="grid" role="tabpanel" aria-labelledby="grid-tab">
                        <div className="row g-4 mb-50">
                           {currentItems.length === 0 ? (
                              <div className="col-12 text-center py-5">
                                 <h3 className="opacity-30">{t('common.no_programs_found')}</h3>
                              </div>
                           ) : (
                              currentItems.map((item) => (
                                 <div key={item._id} className="col-xl-4 col-md-6">
                                    <div className="glass-panel h-100 shadow-sm overflow-hidden border-0 bg-white hover-scale">
                                       <div className="position-relative">
                                          <Link to={`/program/${item.slug || item._id}`}>
                                             <img src={item.image || '/assets/img/courses/course_default.jpg'} alt={typeof item.name === 'string' ? item.name : (item.name as any)?.en || ''} className="w-100" style={{ height: '220px', objectFit: 'cover' }} />
                                          </Link>
                                          <button
                                             onClick={(e) => {
                                                e.preventDefault();
                                                toggleWishlist(item._id);
                                             }}
                                             className="position-absolute top-0 end-0 m-3 shadow-sm border-0 d-flex align-items-center justify-content-center"
                                             style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', zIndex: 10 }}
                                          >
                                             <i className={isInWishlist(item._id) ? "fas fa-heart text-danger" : "far fa-heart"}></i>
                                          </button>
                                          <div className="position-absolute bottom-0 start-0 m-3">
                                             <span className="badge bg-white text-dark px-3 py-2 rounded-pill small fw-bold shadow-sm">
                                                <TranslatedContent>{item.DanceStyle || 'General'}</TranslatedContent>
                                             </span>
                                          </div>
                                       </div>
                                       <div className="p-4">
                                          <div className="d-flex align-items-center gap-2 mb-2 text-warning small">
                                             <i className="fas fa-star"></i>
                                             <span className="text-dark fw-bold">5.0</span>
                                             <span className="text-muted">(120 Reviews)</span>
                                          </div>
                                          <h5 className="title mb-4 fw-900" style={{ fontSize: '1.2rem', minHeight: '3rem' }}>
                                             <Link to={`/program/${item.slug || item._id}`} className="text-dark text-decoration-none">
                                                <TranslatedContent>{item.name}</TranslatedContent>
                                             </Link>
                                          </h5>
                                          <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                                             <Link to={`/program/${item.slug || item._id}`} className="btn-neon-primary py-2 px-4 small" style={{ fontSize: '0.85rem' }}>
                                                {t('common.book_session')}
                                             </Link>
                                             <div className="price fw-900 text-primary">{formatPriceDirect((item as any).price || 49)}</div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              ))
                           )}
                        </div>
                     </div>

                     <div className={`tab-pane fade ${activeTab === 1 ? 'show active' : ''}`} id="list" role="tabpanel" aria-labelledby="list-tab">
                        <div className="row g-4 mb-50">
                           {currentItems.map((item) => (
                              <div key={item._id} className="col-12">
                                 <div className="glass-panel p-3 shadow-sm overflow-hidden border-0 bg-white hover-scale">
                                    <div className="row align-items-center g-4">
                                       <div className="col-md-4">
                                          <div className="position-relative rounded-4 overflow-hidden">
                                             <Link to={`/program/${item.slug || item._id}`}>
                                                <img src={item.image || '/assets/img/courses/course_default.jpg'} alt={typeof item.name === 'string' ? item.name : (item.name as any)?.en || ''} className="w-100" style={{ height: '200px', objectFit: 'cover' }} />
                                             </Link>
                                          </div>
                                       </div>
                                       <div className="col-md-8">
                                          <div className="pe-4">
                                             <div className="d-flex align-items-center justify-content-between mb-2">
                                                <span className="badge bg-primary px-3 py-2 rounded-pill small fw-bold">
                                                   <TranslatedContent>{item.DanceStyle || 'General'}</TranslatedContent>
                                                </span>
                                                <button 
                                                   onClick={() => toggleWishlist(item._id)}
                                                   className="border-0 bg-transparent text-muted"
                                                >
                                                   <i className={isInWishlist(item._id) ? "fas fa-heart text-danger" : "far fa-heart"}></i>
                                                </button>
                                             </div>
                                             <h4 className="fw-900 mb-3">
                                                <Link to={`/program/${item.slug || item._id}`} className="text-dark text-decoration-none">
                                                   <TranslatedContent>{item.name}</TranslatedContent>
                                                </Link>
                                             </h4>
                                             <p className="opacity-60 small mb-4">
                                                <TranslatedContent>{item.description}</TranslatedContent>
                                             </p>
                                             <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center gap-3">
                                                   <Link to={`/program/${item.slug || item._id}`} className="btn-neon-primary py-2 px-4">{t('common.book_session') || 'Book Now'}</Link>
                                                   <span className="fw-900 text-primary">{formatPriceDirect((item as any).price || 49)}</span>
                                                </div>
                                                <div className="text-warning small">
                                                   <i className="fas fa-star"></i> 5.0 (120)
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {pageCount > 1 && (
                     <div className="pagination-wrap mt-50 d-flex justify-content-center">
                        <ReactPaginate
                           breakLabel="..."
                           onPageChange={handlePageClick}
                           pageRangeDisplayed={3}
                           pageCount={pageCount}
                           renderOnZeroPageCount={null}
                           className="pagination d-flex gap-2 p-0 m-0"
                           pageClassName="page-item"
                           pageLinkClassName="page-link rounded-3 border-0 shadow-sm fw-bold px-4 py-2"
                           activeClassName="active"
                           activeLinkClassName="bg-primary text-white"
                           previousLabel="<"
                           nextLabel=">"
                           previousClassName="page-item"
                           nextClassName="page-item"
                           previousLinkClassName="page-link rounded-3 border-0 shadow-sm fw-bold px-4 py-2"
                           nextLinkClassName="page-link rounded-3 border-0 shadow-sm fw-bold px-4 py-2"
                        />
                     </div>
                  )}
               </div>
            </div>
         </div>
      </section>
   );
};

export default CourseArea;

