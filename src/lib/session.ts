export type UserRole = "basic" | "manager";

export type DummyUser = {
  id: string;
  employeeId: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  email: string;
  title: string;
  department: string;
  location: string;
};

export type DummySession = {
  isAuthenticated: true;
  authMethod: "dummy-selector";
  loggedInAt: string;
  user: DummyUser;
};

export const SESSION_STORAGE_KEY = "kasama-timesheet-session";

export const DUMMY_USERS: DummyUser[] = [
  {
    id: "usr_basic_001",
    employeeId: "KT-1001",
    first_name: "Ariel",
    last_name: "Gacilo",
    role: "basic",
    email: "ariel.gacilo@kasamadigital.com",
    title: "Full-Stack Developer",
    department: "Engineering",
    location: "Cebu",
  },
  {
    id: "usr_basic_002",
    employeeId: "KT-1002",
    first_name: "Mia",
    last_name: "Santos",
    role: "basic",
    email: "mia.santos@kasamadigital.com",
    title: "Salesforce Developer",
    department: "Engineering",
    location: "Manila",
  },
  {
    id: "usr_manager_001",
    employeeId: "KT-2001",
    first_name: "Leo",
    last_name: "Martinez",
    role: "manager",
    email: "leo@kasamadigital.com",
    title: "Project Manager",
    department: "Engineering",
    location: "Makati",
  },
];

export const createDummySession = (user: DummyUser): DummySession => ({
  isAuthenticated: true,
  authMethod: "dummy-selector",
  loggedInAt: new Date().toISOString(),
  user,
});

export const saveDummySession = (user: DummyUser) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify(createDummySession(user)),
  );
};

export const getDummySession = (): DummySession | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as DummySession;
  } catch {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
};

export const clearDummySession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
};
