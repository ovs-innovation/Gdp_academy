import FooterOne from "../../../layouts/footers/FooterOne"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import BreadcrumbOne from "../../common/breadcrumb/BreadcrumbOne"
// import Features from "../../homes/home-one/Features"
import Newsletter from "../../homes/home-one/Newsletter"
import Feature from "../../homes/home-two/Feature"
import About from "./About"
import Testimonial from "./Testimonial"

import { useTranslation } from "react-i18next";

const AboutUs = () => {
   const { t } = useTranslation();
   return (
      <>
         <HeaderOne />
         <main className="main-area fix glow-bg">
            <BreadcrumbOne
               title={t('about_page.breadcrumb.title', 'Where Learning Meets Excellence')}
               sub_title={t('about_page.breadcrumb.subtitle', 'About Us')}
               description={t('about_page.hero.description', 'GDP Studio is a global movement dedicated to bridging the gap between world-class expertise and ambitious learners.')}
               image="/assets/img/others/inner_about_img.png"
               overlayItems={['Professional Dancers', 'Global Learning Community', 'Personalized Paths']}
               features={['Trusted by 10,000+ students', 'Live Zoom classes', 'Multi-language support']}
            />
            <About />
            <Feature style={true} />
            <Newsletter />
            <Testimonial />
         </main>
         <FooterOne style={false} style_2={false} />
      </>
   )
}

export default AboutUs

