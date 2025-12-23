// Dummy job data for the app
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  companyLogo: string;
  interestedCount?: number;
}

export const dummyJobs: Job[] = [
  {
    id: '1',
    title: 'Senior React Native Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120k - $160k',
    description: 'Build amazing mobile experiences with React Native. Work with a talented team on cutting-edge projects.',
    companyLogo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=200',
    interestedCount: 12,
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'DesignHub',
    location: 'New York, NY',
    salary: '$100k - $140k',
    description: 'Create beautiful and intuitive user interfaces. Collaborate with product and engineering teams.',
    companyLogo: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=200',
    interestedCount: 8,
  },
  {
    id: '3',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    salary: '$110k - $150k',
    description: 'Join our early-stage startup building the next big thing. Work on both frontend and backend systems.',
    companyLogo: 'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=200',
    interestedCount: 15,
  },
  {
    id: '4',
    title: 'iOS Developer',
    company: 'Mobile Masters',
    location: 'Austin, TX',
    salary: '$115k - $155k',
    description: 'Develop native iOS applications using Swift. Work on apps used by millions of users.',
    companyLogo: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=200',
    interestedCount: 10,
  },
  {
    id: '5',
    title: 'Backend Engineer',
    company: 'CloudTech Solutions',
    location: 'Seattle, WA',
    salary: '$125k - $165k',
    description: 'Build scalable backend systems and APIs. Work with microservices and cloud infrastructure.',
    companyLogo: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=200',
    interestedCount: 7,
  },
  {
    id: '6',
    title: 'Data Scientist',
    company: 'AI Innovations',
    location: 'Boston, MA',
    salary: '$130k - $170k',
    description: 'Apply machine learning and data analysis to solve complex problems. Work with large datasets.',
    companyLogo: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=200',
    interestedCount: 20,
  },
  {
    id: '7',
    title: 'DevOps Engineer',
    company: 'Infrastructure Pro',
    location: 'Denver, CO',
    salary: '$120k - $160k',
    description: 'Manage CI/CD pipelines and cloud infrastructure. Ensure high availability and performance.',
    companyLogo: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=200',
    interestedCount: 9,
  },
  {
    id: '8',
    title: 'Frontend Developer',
    company: 'WebWorks',
    location: 'Los Angeles, CA',
    salary: '$105k - $145k',
    description: 'Create responsive and interactive web applications. Work with React, TypeScript, and modern tooling.',
    companyLogo: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=200',
    interestedCount: 11,
  },
];
