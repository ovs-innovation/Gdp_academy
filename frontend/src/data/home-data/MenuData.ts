export interface MenuItem {
    id: number;
    title: string;
    titleKey?: string;
    link: string;
    menu_class?: string;
    home_sub_menu?: {
        menu_details: {
            link: string;
            title: string;
            titleKey?: string;
            badge?: string;
            badge_class?: string;
        }[];
    }[];
    sub_menus?: {
        link: string;
        title: string;
        titleKey?: string;
        dropdown?: boolean;
        mega_menus?: {
            link: string;
            title: string;
            titleKey?: string;
        }[];
    }[];
};

const menu_data: MenuItem[] = [
    {
        id: 1,
        title: "Home",
        titleKey: "common.home",
        link: "/",
    },
    {
        id: 2,
        title: "About",
        titleKey: "common.about_us",
        link: "/about",
    },
    {
        id: 3,
        title: "Programs",
        titleKey: "common.programs",
        link: "/programs",
    },
    {
        id: 4,
        title: "Services",
        title: "Services",
        link: "/services",
    },
    {
        id: 5,
        title: "FAQ",
        titleKey: "FAQ",
        link: "/faq",
    },
    {
        id: 6,
        title: "Blog",
        title: "Blog",
        link: "/blog",
    },
    {
        id: 7,
        title: "Gallery",
        title: "Gallery",
        link: "/gallery",
    },
    {
        id: 8,
        title: "Contact Us",
        title: "Contact Us",
        link: "/contact",
    }
];
export default menu_data;
