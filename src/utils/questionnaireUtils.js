import { sections } from "../components/myRatings/data"; // or your correct path

export const sectionKeyMap = {
  "Teaching Style": "teachingStyle",
  "Responsiveness": "responsiveness",
  "Mentorship": "mentorship",
  "Overall Support": "overallSupport",
};

export const questionKeyMap = {
  "Did your admin effectively communicate complex concepts and methodologies?": "complexConcepts",
  "To what extent did your admin encourage critical thinking and independent research?": "criticalThinking",
  "Were you satisfied with the turnaround time for feedback on your work or queries?": "feedbackTurnaround",
  "Did your admin provide constructive feedback in a timely manner?": "constructiveFeedback",
  "How well did your admin mentor you in terms of research methodology and data analysis?": "methodologySupport",
  "Did your admin actively support your academic and professional development?": "professionalDevelopment",
  "Did your admin provide assistance in navigating academic challenges or administrative issues?": "academicChallenges",
  "In what ways did your admin contribute to your overall success as a PhD student?": "contributionToSuccess",
};


export const getSafeKey = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]/gi, "").replace(/\s+/g, "");

export const transformQuestionnaire = (flat, sections) => {
  const nested = {};
  sections.forEach((section) => {
    const sectionKey = getSafeKey(section.title);
    nested[sectionKey] = {
      description: flat[section.title] || "",
    };
    section.questions.forEach((q) => {
      const questionKey = questionKeyMap[q] || getSafeKey(q);
      if (!(q in flat)) {
        console.warn(`Missing answer for question: "${q}"`);
      }
      nested[sectionKey][questionKey] = flat[q] || "";
    });
  });
  return nested;
};




export const flattenQuestionnaire = (nested) => {
  const flat = {};
  sections.forEach((section) => {
    const sectionKey = getSafeKey(section.title);
    const sectionData = nested?.[sectionKey] || {};
    flat[section.title] = sectionData.description || "";
    section.questions.forEach((q) => {
      const questionKey = getSafeKey(q);
      flat[q] = sectionData[questionKey] || "";
    });
  });
  return flat;
};
