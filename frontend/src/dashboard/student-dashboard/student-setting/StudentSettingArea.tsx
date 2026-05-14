import { useMemberStats } from "../../../hooks/useMemberStats"
import DashboardBannerTwo from "../../dashboard-common/DashboardBannerTwo"
import DashboardSidebarTwo from "../../dashboard-common/DashboardSidebarTwo"
import InstructorSettingContent from "../../instructor-dashboard/instructor-setting/InstructorSettingContent"

const StudentSettingArea = () => {
   const { totalClasses, completedClasses } = useMemberStats()
   return (
      <section className="dashboard__area section-pb-120">
         <div className="container">
            <DashboardBannerTwo totalClasses={totalClasses} completedClasses={completedClasses} />
            <div className="dashboard__inner-wrap">
               <div className="row">
                  <DashboardSidebarTwo />
                  <InstructorSettingContent />
               </div>
            </div>
         </div>
      </section>
   )
}

export default StudentSettingArea

