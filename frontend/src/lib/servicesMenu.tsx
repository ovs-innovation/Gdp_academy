import type { ReactNode } from "react";
import {
  getServiceIcon,
  OnlineComboFitnessIcon,
  OnlineDanceClassesIcon,
  WeddingChoreographyIcon,
} from "../components/home/ServiceIcons";

export type ServicesMenuItem = {
  title: string;
  subtitle?: string;
  href: string;
  image?: string;
  tagline?: string;
};

export type ServicesMenuGroup = {
  label: string;
  viewAllHref: string;
  sectionId: string;
  items: ServicesMenuItem[];
};

const WELLNESS_IMG = {
  pcod: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&h=700&q=80",
  thyroid: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&h=700&q=80",
  postPregnancy: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=900&h=700&q=80",
  zumba: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&h=700&q=80",
  hiit: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&h=700&q=80",
  yoga: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&h=700&q=80",
};

/** Navbar mega-menu + services page sections */
export const SERVICES_MEGA_MENU: ServicesMenuGroup[] = [
  {
    label: "Disease and Disorder Management",
    viewAllHref: "/services",
    sectionId: "disorder-management",
    items: [
      {
        title: "PCOD / PCOS Wellness",
        subtitle: "Department of Gynaecology",
        href: "/services#disorder-management",
        image: WELLNESS_IMG.pcod,
        tagline: "Balance hormones the fun way — movement-led wellness for women.",
      },
      {
        title: "Thyroid Wellness",
        subtitle: "Department of Endocrinology",
        href: "/services#disorder-management",
        image: WELLNESS_IMG.thyroid,
        tagline: "Boost metabolism and energy through joyful dance movement.",
      },
      {
        title: "Post Pregnancy Wellness",
        subtitle: "Department of Post Pregnancy Wellness",
        href: "/services#disorder-management",
        image: WELLNESS_IMG.postPregnancy,
        tagline: "Safe, joyful movement for new mothers — rebuild strength with dance.",
      },
    ],
  },
  {
    label: "Fitness Classes",
    viewAllHref: "/services",
    sectionId: "fitness-classes",
    items: [
      {
        title: "Zumba",
        href: "/services#fitness-classes",
        image: WELLNESS_IMG.zumba,
        tagline: "Latin-inspired dance cardio — sweat, smile, repeat.",
      },
      {
        title: "HIIT",
        href: "/services#fitness-classes",
        image: WELLNESS_IMG.hiit,
        tagline: "High-intensity dance intervals — short, powerful, effective.",
      },
      {
        title: "Yoga",
        href: "/services#fitness-classes",
        image: WELLNESS_IMG.yoga,
        tagline: "Flexibility, breath, and flow — movement that heals from within.",
      },
    ],
  },
];

export const EXPLORE_PROGRAMS: {
  key: string;
  title: string;
  subtitle: string;
  href: string;
  icon: ReactNode;
}[] = [
  {
    key: "wedding-choreography",
    title: "Wedding Choreography",
    subtitle: "Virtual & In-Person Services Worldwide",
    href: "/contact",
    icon: <WeddingChoreographyIcon />,
  },
  {
    key: "online-dance-classes",
    title: "Online Dance Classes",
    subtitle: "Live Interactive Zoom Classes",
    href: "/contact",
    icon: <OnlineDanceClassesIcon />,
  },
  {
    key: "pre-recorded-courses",
    title: "Pre-Recorded Dance Courses",
    subtitle: "Learn At Your Own Pace",
    href: "/contact",
    icon: <OnlineComboFitnessIcon />,
  },
];

/** Resolve icon for CMS-driven or dynamic service entries */
export { getServiceIcon };
