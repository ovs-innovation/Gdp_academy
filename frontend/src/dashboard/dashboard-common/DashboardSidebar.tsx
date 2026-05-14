import React from "react";
import { Link } from "react-router-dom";

interface DataType {
   id: number;
   title: string;
   class_name?: string;
   sidebar_details: {
      id: number;
      link: string;
      icon: string;
      title: string;
   }[];
};

const sidebar_data: DataType[] = [
   {
      id: 1,
      title: "MEMBER ACCESS",
      sidebar_details: [
         {
            id: 1,
            link: "/dashboard",
            icon: "fas fa-home",
            title: "PORTAL HOME",
         },
         {
            id: 2,
            link: "/profile",
            icon: "skillgro-avatar",
            title: "MY PROFILE",
         },
         {
            id: 3,
            link: "/programs",
            icon: "skillgro-book",
            title: "ENROLLED PROGRAMS",
         },
         {
            id: 4,
            link: "/wishlist",
            icon: "skillgro-label",
            title: "WISHLIST",
         },
         {
            id: 7,
            link: "/history",
            icon: "skillgro-satchel",
            title: "ORDER HISTORY",
         },
      ],
   },
   {
      id: 2,
      title: "DANCE COACH",
      class_name: "mt-40",
      sidebar_details: [
         {
            id: 1,
            link: "/coach-programs",
            icon: "skillgro-video-tutorial",
            title: "MY PROGRAMS",
         },
         {
            id: 2,
            link: "/announcements",
            icon: "skillgro-marketing",
            title: "ANNOUNCEMENTS",
         },
         {
            id: 4,
            link: "/assignments",
            icon: "skillgro-list",
            title: "ASSIGNMENTS",
         },
      ],
   },
   {
      id: 3,
      title: "ACCOUNT",
      class_name: "mt-30",
      sidebar_details: [
         {
            id: 1,
            link: "/settings",
            icon: "skillgro-settings",
            title: "SETTINGS",
         },
         {
            id: 2,
            link: "/",
            icon: "skillgro-logout",
            title: "LOGOUT",
         },
      ],
   },
];

const DashboardSidebar = () => {

   return (
      <div className="col-lg-3">
         <div className="dashboard__sidebar-wrap">
            {sidebar_data.map((item) => (
               <React.Fragment key={item.id}>
                  <div className={`dashboard__sidebar-title mb-20 ${item.class_name}`}>
                     <h6 className="title">{item.title}</h6>
                  </div>
                  <nav className="dashboard__sidebar-menu">
                     <ul className="list-wrap">
                        {item.sidebar_details.map((list) => (
                           <li key={list.id}>
                              <Link to={list.link}>
                                 <i className={list.icon}></i>
                                 {list.title}
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </nav>
               </React.Fragment>
            ))}
         </div>
      </div>
   )
}

export default DashboardSidebar
