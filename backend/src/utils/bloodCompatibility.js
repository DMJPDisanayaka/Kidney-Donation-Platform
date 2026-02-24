export const bloodCompatibility = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['A-', 'O-'],
  'A+': ['A-', 'O-', 'A+', 'O+'],
  'B-': ['B-', 'O-'],
  'B+': ['B-', 'O-', 'B+', 'O+'],
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'AB+': ['AB-', 'A-', 'B-', 'O-', 'AB+', 'A+', 'B+', 'O+']
};

// Calculates age from a date of birth value.
export const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
};
