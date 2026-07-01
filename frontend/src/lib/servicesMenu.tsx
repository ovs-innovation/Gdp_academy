import type { ReactNode } from "react";

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
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="12" cy="5" r="2.2" />
        <path d="M8 21l2.5-7.5M16 21l-2.5-7.5M9.5 10.5l2.5 4 2.5-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "online-dance-classes",
    title: "Online Dance Classes",
    subtitle: "Live Interactive Zoom Classes",
    href: "/contact",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="7" y="3" width="10" height="18" rx="2" />
        <path d="M10 18h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "pre-recorded-courses",
    title: "Pre-Recorded Dance Courses",
    subtitle: "Learn At Your Own Pace",
    href: "/contact",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M10.2 8.8v6.4L15.8 12z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "kids-teens-programs",
    title: "Kids & Teens Programs",
    subtitle: "Confidence & Creative Expression",
    href: "/contact",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="9" cy="7" r="2.2" />
        <circle cx="15" cy="7" r="2.2" />
        <path d="M6 20c.5-3 2-5 3-5s2.5 2 3 5M12 20c.5-3 2-5 3-5s2.5 2 3 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];
