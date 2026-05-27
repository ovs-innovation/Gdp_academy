interface DataType {
   id: number;
   page: string;
   question: string;
   answer: string;
   category: "general" | "student" | "tutor" | "member" | "coach";
};

const faq_data: DataType[] = [
   // General
   {
      id: 1,
      page: "home_1",
      question: "home.faq.questions.q1",
      answer: "home.faq.questions.a1",
      category: "general"
   },
   {
      id: 2,
      page: "home_1",
      question: "home.faq.questions.q3",
      answer: "home.faq.questions.a3",
      category: "general"
   },
   // Student
   {
      id: 3,
      page: "home_1",
      question: "home.faq.questions.q2",
      answer: "home.faq.questions.a2",
      category: "member"
   },
   {
      id: 4,
      page: "home_1",
      question: "home.faq.questions.q4",
      answer: "home.faq.questions.a4",
      category: "member"
   },
   // Tutor
   {
      id: 5,
      page: "home_1",
      question: "become_coach_page.faq.items.1.question",
      answer: "become_coach_page.faq.items.1.answer",
      category: "coach"
   },
   {
      id: 6,
      page: "home_1",
      question: "become_coach_page.faq.items.2.question",
      answer: "become_coach_page.faq.items.2.answer",
      category: "coach"
   },
   {
      id: 7,
      page: "home_1",
      question: "become_coach_page.faq.items.3.question",
      answer: "become_coach_page.faq.items.3.answer",
      category: "coach"
   },
   {
      id: 8,
      page: "home_1",
      question: "become_coach_page.faq.items.8.question",
      answer: "become_coach_page.faq.items.8.answer",
      category: "coach"
   }
];

export default faq_data;
