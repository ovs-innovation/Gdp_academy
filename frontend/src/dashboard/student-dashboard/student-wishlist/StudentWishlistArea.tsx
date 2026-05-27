import { useMemberStats } from "../../../hooks/useMemberStats"
import DashboardBannerTwo from "../../dashboard-common/DashboardBannerTwo"
import DashboardSidebarTwo from "../../dashboard-common/DashboardSidebarTwo"
import StudentWishlistContent from "./StudentWishlistContent"

const StudentWishlistArea = () => {
   const { totalClasses, completedClasses } = useMemberStats()
   return (
      <section className="dashboard__area section-pb-120">
         <div className="container">
            <DashboardBannerTwo totalSessions={totalClasses} completedSessions={completedClasses} />
            <div className="dashboard__inner-wrap">
               <div className="row">
                  <DashboardSidebarTwo />
                  <StudentWishlistContent />
               </div>
            </div>
         </div>
      </section>
   )
}

export default StudentWishlistArea

