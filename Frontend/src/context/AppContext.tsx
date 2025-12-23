import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Job, dummyJobs } from '../data/jobs';
import { User, dummyJobseekerUser, dummyRecruiterUser } from '../data/user';

type Role = 'jobseeker' | 'recruiter' | null;

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: User | null;
  setUser: (user: User) => void;
  jobs: Job[];
  addJob: (job: Job) => void;
  likedJobs: Job[];
  likeJob: (job: Job) => void;
  swipedJobIds: string[];
  addSwipedJob: (jobId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<Role>(null);
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>(dummyJobs);
  const [likedJobs, setLikedJobs] = useState<Job[]>([]);
  const [swipedJobIds, setSwipedJobIds] = useState<string[]>([]);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    // Auto-set appropriate dummy user
    if (newRole === 'jobseeker') {
      setUser(dummyJobseekerUser);
    } else if (newRole === 'recruiter') {
      setUser(dummyRecruiterUser);
    }
  };

  const addJob = (job: Job) => {
    setJobs((prev) => [job, ...prev]);
  };

  const likeJob = (job: Job) => {
    setLikedJobs((prev) => [...prev, job]);
  };

  const addSwipedJob = (jobId: string) => {
    setSwipedJobIds((prev) => [...prev, jobId]);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        user,
        setUser,
        jobs,
        addJob,
        likedJobs,
        likeJob,
        swipedJobIds,
        addSwipedJob,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
