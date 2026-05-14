import FooterOne from "../../../layouts/footers/FooterOne"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import BreadcrumbOne from "../../common/breadcrumb/BreadcrumbOne"
import CourseArea from "./CourseArea"
import { useTranslation } from "react-i18next"

const Program = () => {
   const { t } = useTranslation();
   return (
      <>
         <HeaderOne />
         <main className="main-area fix">
            <BreadcrumbOne 
               title={t('common.all_programs')} 
               sub_title={t('common.programs')} 
               sub_title_2="" 
               style={false} 
               image="/assets/img/courses/courses_details.jpg"
            />
            <CourseArea />
         </main>
         <FooterOne style={false} style_2={true} />
      </>
   )
}

export default Program

