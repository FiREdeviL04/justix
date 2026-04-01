export const getExperienceLevel = (years) => {
  if (years < 2) return "Beginner";
  if (years < 5) return "Intermediate";
  return "Experienced";
};
