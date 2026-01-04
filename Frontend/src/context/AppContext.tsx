import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Job, dummyJobs } from "../data/jobs";
import { User } from "../data/user";
import { CreateJobPayload, createJob as apiCreateJob } from "../jsr/jobs";

type Role = "jobseeker" | "recruiter" | null;

<<<<<<< Updated upstream
// If using phone: replace localhost with your PC LAN IP
=======
>>>>>>> Stashed changes
export const API_BASE = "http://localhost:8000";

const STORAGE_KEYS = {
  accessToken: "@accessToken",
  refreshToken: "@refreshToken",
  role: "@role",
  user: "@user",
};

interface AppContextType {
  isReady: boolean;

  role: Role;
  setRole: (role: Role) => Promise<void>;

  user: User | null;
  setUser: (user: User | null) => Promise<void>;

  accessToken: string | null;
  setAccessToken: (token: string | null) => Promise<void>;

  refreshToken: string | null;
  setRefreshToken: (token: string | null) => Promise<void>;

  refreshAccessToken: () => Promise<string | null>;
  fetchWithAuth: (input: RequestInfo, init?: RequestInit) => Promise<Response>;

  logout: () => Promise<void>;

  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  addJob: (job: Job) => void;

  likedJobs: Job[];
  likeJob: (job: Job) => void;

  swipedJobIds: string[];
  addSwipedJob: (jobId: string) => void;

  // NEW: recruiter-owned job offers
  myJobs: Job[];
  setMyJobs: (jobs: Job[]) => void;
  createJob: (payload: CreateJobPayload) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);

  const [role, setRoleState] = useState<Role>(null);
  const [user, setUserState] = useState<User | null>(null);

  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [refreshToken, setRefreshTokenState] = useState<string | null>(null);

  const [jobs, setJobs] = useState<Job[]>(dummyJobs);
  const [likedJobs, setLikedJobs] = useState<Job[]>([]);
  const [swipedJobIds, setSwipedJobIds] = useState<string[]>([]);

  // >>> ADD THESE LINES: state for recruiter jobs <<<
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  // <<<

  // create job via API and update myJobs
  const createJob = async (payload: CreateJobPayload) => {
    if (!accessToken) throw new Error("Not authenticated");
    const created = await apiCreateJob(accessToken, payload);
    setMyJobs((prev) => [created as Job, ...prev]);
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [storedAccess, storedRefresh, storedRole, storedUser] =
          await Promise.all([
            AsyncStorage.getItem(STORAGE_KEYS.accessToken),
            AsyncStorage.getItem(STORAGE_KEYS.refreshToken),
            AsyncStorage.getItem(STORAGE_KEYS.role),
            AsyncStorage.getItem(STORAGE_KEYS.user),
          ]);

        if (!mounted) return;

        setAccessTokenState(storedAccess);
        setRefreshTokenState(storedRefresh);

        setRoleState(
          storedRole === "jobseeker" || storedRole === "recruiter"
            ? storedRole
            : null
        );
        setUserState(storedUser ? JSON.parse(storedUser) : null);
      } catch {
        if (!mounted) return;
        setAccessTokenState(null);
        setRefreshTokenState(null);
        setRoleState(null);
        setUserState(null);
      } finally {
        if (mounted) setIsReady(true);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const setRole = async (newRole: Role) => {
    setRoleState(newRole);
    if (newRole == null) await AsyncStorage.removeItem(STORAGE_KEYS.role);
    else await AsyncStorage.setItem(STORAGE_KEYS.role, newRole);
  };

  const setUser = async (newUser: User | null) => {
    setUserState(newUser);
    if (newUser == null) await AsyncStorage.removeItem(STORAGE_KEYS.user);
    else await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(newUser));
  };

  const setAccessToken = async (token: string | null) => {
    setAccessTokenState(token);
    if (token == null) await AsyncStorage.removeItem(STORAGE_KEYS.accessToken);
    else await AsyncStorage.setItem(STORAGE_KEYS.accessToken, token);
  };

  const setRefreshToken = async (token: string | null) => {
    setRefreshTokenState(token);
    if (token == null) await AsyncStorage.removeItem(STORAGE_KEYS.refreshToken);
    else await AsyncStorage.setItem(STORAGE_KEYS.refreshToken, token);
  };

  const logout = async () => {
    setAccessTokenState(null);
    setRefreshTokenState(null);
    setRoleState(null);
    setUserState(null);

    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.accessToken),
      AsyncStorage.removeItem(STORAGE_KEYS.refreshToken),
      AsyncStorage.removeItem(STORAGE_KEYS.role),
      AsyncStorage.removeItem(STORAGE_KEYS.user),
    ]);
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    if (!refreshToken) return null;

    const res = await fetch(`${API_BASE}/api/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!res.ok) {
      await logout();
      return null;
    }

    const data = (await res.json()) as { access?: string; refresh?: string };
    if (data.access) await setAccessToken(data.access);
    if (data.refresh) await setRefreshToken(data.refresh);

    return data.access ?? null;
  };

  const fetchWithAuth = async (input: RequestInfo, init: RequestInit = {}) => {
    const mergeHeaders = (base?: HeadersInit, extra?: HeadersInit) => ({
      ...(base as any),
      ...(extra as any),
    });

    const withToken = (token: string | null): RequestInit => ({
      ...init,
      headers: mergeHeaders(
        init.headers,
        token ? { Authorization: `Bearer ${token}` } : undefined
      ),
    });

    let res = await fetch(input, withToken(accessToken));

    if (res.status === 401) {
      const newAccess = await refreshAccessToken();
      if (!newAccess) return res;
      res = await fetch(input, withToken(newAccess));
    }

    return res;
  };

  const addJob = (job: Job) => setJobs((prev) => [job, ...prev]);
  const likeJob = (job: Job) => setLikedJobs((prev) => [...prev, job]);
  const addSwipedJob = (jobId: string) =>
    setSwipedJobIds((prev) => [...prev, jobId]);

  const value = useMemo(
    () => ({
      isReady,
      role,
      setRole,
      user,
      setUser,
      accessToken,
      setAccessToken,
      refreshToken,
      setRefreshToken,
      refreshAccessToken,
      fetchWithAuth,
      logout,
      jobs,
      setJobs,
      addJob,
      likedJobs,
      likeJob,
      swipedJobIds,
      addSwipedJob,
      myJobs,
      setMyJobs,
      createJob,
    }),
    [
      isReady,
      role,
      user,
      accessToken,
      refreshToken,
      jobs,
      likedJobs,
      swipedJobIds,
      myJobs,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppProvider");
  return context;
};

