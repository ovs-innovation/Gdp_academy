import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchPrograms, type Program } from "../../../services/programService";
import { fetchDanceStyles, type DanceStyle } from "../../../services/danceStyleService";
import { useWishlist } from "../../../contexts/WishlistContext";

const setting = {
  slidesPerView: 4,
  loop: true,
  spaceBetween: 30,
  observer: true,
  observeParents: true,
  autoplay: false,
  navigation: {
    nextEl: '.courses-button-next',
    prevEl: '.courses-button-prev',
  },
  breakpoints: {
    '1500': {
      slidesPerView: 4,
    },
    '1200': {
      slidesPerView: 4,
    },
    '992': {
      slidesPerView: 3,
      spaceBetween: 24,
    },
    '768': {
      slidesPerView: 2,
      spaceBetween: 24,
    },
    '576': {
      slidesPerView: 1,
    },
    '0': {
      slidesPerView: 1,
    },
  },
};

interface CourseProps {
  style: boolean;
}

const getLocalizedValue = (val: any): string => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    return val.en || val.hi || Object.values(val)[0] || '';
  }
  return String(val);
};

const CourseArea = ({ style }: CourseProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [danceStyles, setDanceStyles] = useState<DanceStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDanceStyle, setSelectedDanceStyle] = useState<string | null>(null);
  const { toggleWishlist, isInWishlist } = useWishlist();

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
        const params: { status: string; limit?: number; DanceStyle?: string } = {
          status: 'active',
          limit: 12
        };
        if (selectedDanceStyle) {
          params.DanceStyle = selectedDanceStyle;
        }
        const response = await fetchPrograms(params);
        setPrograms(response.Programs);
      } catch (err) {
        console.error('Failed to load programs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
  }, [selectedDanceStyle]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    if (index === 0) {
      setSelectedDanceStyle(null);
    } else if (danceStyles[index - 1]) {
      setSelectedDanceStyle(danceStyles[index - 1]._id);
    }
  };

  const tabTitles = [
    t('common.all_programs'),
    ...danceStyles.map(cat => t(`common.category_list.${cat.name.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`, cat.name))
  ];

  if (loading) {
    return (
      <section className={`courses-area ${style ? "section-py-120" : "section-pt-120 section-pb-90"}`} >
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

  return (
    <section className={`courses-area ${style ? "section-py-120" : "section-pt-120 section-pb-90"}`} >
      <div className="container">
        <div className="section__title-wrap">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="section__title text-center mb-40">
                <span className="sub-title">{t('common.top_class_courses')}</span>
                <h2 className="title">{t('common.best_exciting_class_experience')}</h2>
                <p className="desc">{t('common.category_description')}</p>
              </div>
              <div className="courses__nav">
                <ul className="nav nav-tabs" id="courseTab" role="tablist">
                  {tabTitles.map((tab, index) => (
                    <li key={index} onClick={() => handleTabClick(index)} className="nav-item" role="presentation">
                      <button className={`nav-link ${activeTab === index ? "active" : ""}`}>{tab}</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="tab-content" id="courseTabContent">
          <div className={`tab-pane fade ${activeTab === activeTab ? 'show active' : ''}`} id="all-tab-pane" role="tabpanel" aria-labelledby="all-tab">
            {programs.length === 0 ? (
              <div className="row justify-content-center">
                <div className="col-12 text-center">
                  <p>{t('common.no_programs_found')}</p>
                </div>
              </div>
            ) : (
              <Swiper {...setting} modules={[Autoplay, Navigation]} className="swiper courses-swiper-active">
                {programs.map((item) => (
                  <SwiperSlide key={item._id} className="swiper-slide">
                    <div className="courses__item shine__animate-item">
                      <div className="courses__item-thumb" style={{ position: 'relative' }}>
                        <Link to={`/program/${item.slug || item._id}`} className="shine__animate-link">
                           <img src={item.image || '/assets/img/courses/course_default.jpg'} alt={typeof item.name === 'string' ? item.name : (item.name as any)?.en || ''} />
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(item._id);
                          }}
                          className="wishlist-btn"
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            zIndex: 9,
                            background: '#fff',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                          }}
                        >
                          <i className={isInWishlist(item._id) ? "fas fa-heart" : "far fa-heart"} style={{ color: isInWishlist(item._id) ? "#e91e63" : "#1A202C", fontSize: '15px' }}></i>
                        </button>
                      </div>
                      <div className="courses__item-content">
                        <ul className="courses__item-meta list-wrap">
                          <li className="courses__item-tag">
                            <Link to={`/programs?dance-style=${selectedDanceStyle || ''}`}>
                              {item.DanceStyle ? t(`common.category_list.${item.DanceStyle.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`, item.DanceStyle) : t('common.categories')}
                            </Link>
                          </li>
                          <li className="avg-rating"><i className="fas fa-star"></i> (5.0 {t('common.reviews')})</li>
                        </ul>
                        <h5 className="title"><Link to={`/program/${item.slug || item._id}`}>{getLocalizedValue(item.name)}</Link></h5>
                        {item.description && <p className="info">{getLocalizedValue(item.description)}</p>}
                        <div className="courses__item-bottom">
                          <div className="button">
                            <Link to={`/program/${item.slug || item._id}`}>
                              <span className="text">{t('common.book_session')}</span>
                              <i className="flaticon-arrow-right"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
            {!style && (
              <div className="courses__nav">
                <div className="courses-button-prev"><i className="flaticon-arrow-right"></i></div>
                <div className="courses-button-next"><i className="flaticon-arrow-right"></i></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CourseArea

