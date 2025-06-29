export const validateUser = (user) => {
  if (!user.username || !user.email || !user.password || !user.college_id) {
    return false;
  }
  // Add more validation as needed
  return true;
};
