// Dummy user data
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  // Jobseeker fields
  skills?: string;
  bio?: string;
  yearsOfExperience?: number;
  // Recruiter fields
  company?: string;
  role?: string;
}

export const dummyJobseekerUser: User = {
  id: 'js1',
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
  skills: 'React Native, TypeScript, Node.js, AWS',
  bio: 'Passionate mobile developer with 5 years of experience building scalable applications.',
  yearsOfExperience: 5,
};

export const dummyRecruiterUser: User = {
  id: 'rec1',
  name: 'Sarah Williams',
  email: 'sarah.williams@techcorp.com',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
  company: 'TechCorp Inc.',
  role: 'Senior Talent Acquisition Manager',
};
