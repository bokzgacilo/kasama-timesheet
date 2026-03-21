"use client";

import {
  Badge,
  Box,
  Button,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  chakra,
} from "@chakra-ui/react";
import { useEffect, useState, type ChangeEvent } from "react";


type LogType = "work" | "leave";
type RangeFilter = "month" | "90d";

type ProjectTask = {
  id: string;
  label: string;
};

type ProjectOption = {
  id: string;
  label: string;
  client: string;
  tasks: ProjectTask[];
};

type TimeLog = {
  id: string;
  date: string;
  project: string;
  description: string;
  hours: number;
  type: LogType;
};

type LeaveBalance = {
  label: string;
  remaining: number;
  total: number;
  tint: string;
};

type UpcomingEvent = {
  id: string;
  title: string;
  startsOn: string;
  endsOn?: string;
  category: "PTO" | "Meeting" | "Quarterly" | "Holiday";
  scope: string;
};

const SelectField = chakra("select");
const NotesField = chakra("textarea");

const projectOptions: ProjectOption[] = [
  {
    id: "kasama-product",
    label: "Kasama Product",
    client: "Internal",
    tasks: [
      { id: "dashboard-build", label: "Dashboard build" },
      { id: "calendar-refine", label: "Calendar refinement" },
      { id: "bug-triage", label: "Bug triage" },
    ],
  },
  {
    id: "client-onboarding",
    label: "Client Onboarding",
    client: "Operations",
    tasks: [
      { id: "kickoff-prep", label: "Kickoff preparation" },
      { id: "automation-setup", label: "Automation setup" },
      { id: "billing-review", label: "Billing review" },
    ],
  },
  {
    id: "people-ops",
    label: "People Ops",
    client: "Internal",
    tasks: [
      { id: "timesheet-audit", label: "Timesheet audit" },
      { id: "leave-planning", label: "Leave planning" },
      { id: "quarterly-review", label: "Quarterly review" },
    ],
  },
];

const leaveBalances: LeaveBalance[] = [
  { label: "Vacation", remaining: 8, total: 12, tint: "blue.subtle" },
  { label: "Sick", remaining: 4, total: 6, tint: "orange.subtle" },
  { label: "Emergency", remaining: 2, total: 3, tint: "red.subtle" },
];

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function addDays(date: Date, amount: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);

  return nextDate;
}

function startOfWeek(date: Date) {
  const nextDate = new Date(date);
  const weekday = nextDate.getDay();
  const difference = weekday === 0 ? -6 : 1 - weekday;

  nextDate.setHours(0, 0, 0, 0);
  nextDate.setDate(nextDate.getDate() + difference);

  return nextDate;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatDisplayDate(value: string) {
  return parseDateKey(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
}

function formatCompactDate(value: string) {
  return parseDateKey(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatHours(value: number) {
  return `${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)}h`;
}

function formatTimer(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function isOnOrAfter(date: Date, target: Date) {
  return date.getTime() >= target.getTime();
}

function sumHours(logs: TimeLog[]) {
  return logs.reduce((total, log) => total + log.hours, 0);
}

function createInitialLogs(today: Date): TimeLog[] {
  const createLog = (
    id: string,
    offset: number,
    project: string,
    description: string,
    hours: number,
    type: LogType,
  ): TimeLog => ({
    id,
    date: formatDateKey(addDays(today, offset)),
    project,
    description,
    hours,
    type,
  });

  return [
    createLog("log-1", -1, "Kasama Product", "Dashboard layout polish", 6.5, "work"),
    createLog("log-2", -2, "Client Onboarding", "Billing review and handoff", 8, "work"),
    createLog("log-3", -3, "Kasama Product", "Dashboard wireframe QA", 9.5, "work"),
    createLog("log-4", -4, "Kasama Product", "Calendar bug triage", 8.5, "work"),
    createLog("log-5", -5, "Client Onboarding", "Automation setup", 8, "work"),
    createLog("log-6", -6, "Sick Leave", "Doctor visit and recovery", 4, "leave"),
    createLog("log-7", -9, "Vacation Leave", "Family trip", 8, "leave"),
    createLog("log-8", -11, "Kasama Product", "Design system cleanup", 7.5, "work"),
    createLog("log-9", -14, "People Ops", "Leave planning sync", 6, "work"),
    createLog("log-10", -18, "Client Onboarding", "Payroll reconciliation", 8.5, "work"),
    createLog("log-11", -24, "Emergency Leave", "Personal errand", 8, "leave"),
    createLog("log-12", -33, "People Ops", "Quarterly review prep", 7, "work"),
    createLog("log-13", -47, "Kasama Product", "Sprint retro and planning", 6.5, "work"),
    createLog("log-14", -61, "Client Onboarding", "Docs and handoff", 5.5, "work"),
    createLog("log-15", -73, "Vacation Leave", "Annual leave", 8, "leave"),
  ];
}

function createUpcomingEvents(today: Date): UpcomingEvent[] {
  return [
    {
      id: "event-1",
      title: "Angela Santos PTO",
      startsOn: formatDateKey(addDays(today, 2)),
      endsOn: formatDateKey(addDays(today, 4)),
      category: "PTO",
      scope: "PH team",
    },
    {
      id: "event-2",
      title: "Biweekly company meeting",
      startsOn: formatDateKey(addDays(today, 4)),
      category: "Meeting",
      scope: "Remote",
    },
    {
      id: "event-3",
      title: "Rico Morales PTO",
      startsOn: formatDateKey(addDays(today, 9)),
      endsOn: formatDateKey(addDays(today, 10)),
      category: "PTO",
      scope: "US team",
    },
    {
      id: "event-4",
      title: "Araw ng Kagitingan",
      startsOn: formatDateKey(addDays(today, 18)),
      category: "Holiday",
      scope: "Philippines",
    },
    {
      id: "event-5",
      title: "Quarterly town hall",
      startsOn: formatDateKey(addDays(today, 27)),
      category: "Quarterly",
      scope: "All hands",
    },
    {
      id: "event-6",
      title: "Memorial Day",
      startsOn: formatDateKey(addDays(today, 64)),
      category: "Holiday",
      scope: "United States",
    },
  ];
}

export default function DashboardPage() {
  const [today] = useState(() => new Date());
  const [logs, setLogs] = useState<TimeLog[]>(() => createInitialLogs(today));
  const [rangeFilter, setRangeFilter] = useState<RangeFilter>("month");
  const [selectedProjectId, setSelectedProjectId] = useState(projectOptions[0].id);
  const [selectedTaskId, setSelectedTaskId] = useState(projectOptions[0].tasks[0].id);
  const [note, setNote] = useState("Prep the dashboard summary and clean up the day log list.");
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const selectedProject =
    projectOptions.find((project) => project.id === selectedProjectId) ?? projectOptions[0];
  const selectedTask =
    selectedProject.tasks.find((task) => task.id === selectedTaskId) ?? selectedProject.tasks[0];

  useEffect(() => {
    if (!isTracking) {
      return;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((currentValue) => currentValue + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isTracking]);

  const weekStart = startOfWeek(today);
  const monthStart = startOfMonth(today);
  const rangeStart = rangeFilter === "month" ? monthStart : addDays(today, -89);
  const todayKey = formatDateKey(today);

  const logsThisWeek = logs.filter((log) => isOnOrAfter(parseDateKey(log.date), weekStart));
  const workThisWeek = logsThisWeek.filter((log) => log.type === "work");
  const logsInRange = logs.filter((log) => isOnOrAfter(parseDateKey(log.date), rangeStart));
  const todayHours = sumHours(logs.filter((log) => log.date === todayKey && log.type === "work"));
  const remainingLeaveDays = leaveBalances.reduce((total, balance) => total + balance.remaining, 0);

  const summaryRows = [
    {
      label: "Logged this week",
      value: formatHours(sumHours(logsThisWeek)),
      detail: `${workThisWeek.length} work entries and ${logsThisWeek.length - workThisWeek.length} leave entries`,
    },
    {
      label: "Overtime",
      value: formatHours(Math.max(sumHours(workThisWeek) - 40, 0)),
      detail: "Based on a 40-hour work week",
    },
    {
      label: "Leave balance",
      value: `${remainingLeaveDays} days`,
      detail: "Vacation, sick, and emergency combined",
    },
    {
      label: rangeFilter === "month" ? "This month" : "Last 90 days",
      value: formatHours(sumHours(logsInRange)),
      detail: rangeFilter === "month" ? "Running total for the current month" : "Rolling workload view",
    },
  ];

  const handleProjectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextProject =
      projectOptions.find((project) => project.id === event.target.value) ?? projectOptions[0];

    setSelectedProjectId(nextProject.id);
    setSelectedTaskId(nextProject.tasks[0].id);
  };

  const handleStopTracking = () => {
    setIsTracking(false);

    if (elapsedSeconds < 60) {
      setElapsedSeconds(0);
      return;
    }

    const trackedHours = Number(Math.max(elapsedSeconds / 3600, 0.1).toFixed(1));

    setLogs((currentLogs) => [
      {
        id: `tracked-${Date.now()}`,
        date: formatDateKey(new Date()),
        project: selectedProject.label,
        description: `${selectedTask.label}${note ? ` • ${note}` : ""}`,
        hours: trackedHours,
        type: "work",
      },
      ...currentLogs,
    ]);
    setElapsedSeconds(0);
  };

  const upcomingEvents = createUpcomingEvents(today);

  return (
    <Stack
      h="100%"
      overflow="auto"
      bg="linear-gradient(180deg, var(--chakra-colors-bg-subtle) 0%, var(--chakra-colors-bg) 18%)"
      p={{ base: 4, md: 6 }}
      gap={6}
    >
      <Flex
        alignItems={{ base: "flex-start", lg: "center" }}
        justifyContent="space-between"
        gap={3}
        flexWrap="wrap"
      >
        <Stack gap={1}>
          <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="semibold" letterSpacing="-0.03em">
            Dashboard
          </Text>
          <Text color="fg.muted" maxW="2xl">
            Track active work, review your weekly totals, and keep upcoming leave and company events in one place.
          </Text>
        </Stack>

        <Badge colorPalette="blue" variant="subtle" px={3} py={1.5} borderRadius="full">
          {today.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Badge>
      </Flex>

      <Flex direction={{ base: "column", xl: "row" }} gap={6} align="stretch">
        <Stack flex="1" minW={0} gap={6}>
          <Stack
            border="1px solid"
            borderColor="border"
            bg="bg"
            px={{ base: 4, md: 5 }}
            py={{ base: 4, md: 5 }}
            gap={5}
          >
            <Flex
              justifyContent="space-between"
              alignItems={{ base: "flex-start", md: "center" }}
              flexWrap="wrap"
              gap={3}
            >
              <Stack gap={1}>
                <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.12em" color="fg.muted">
                  Active time
                </Text>
                <Text fontSize={{ base: "4xl", md: "5xl" }} fontWeight="semibold" letterSpacing="-0.05em">
                  {formatTimer(elapsedSeconds)}
                </Text>
              </Stack>

              <Stack gap={1} alignItems={{ base: "flex-start", md: "flex-end" }}>
                <Badge
                  colorPalette={isTracking ? "green" : "gray"}
                  variant="subtle"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {isTracking ? "Tracking now" : "Idle"}
                </Badge>
                <Text color="fg.muted" fontSize="sm">
                  {todayHours > 0 ? `${formatHours(todayHours)} already logged today` : "No work logged yet today"}
                </Text>
              </Stack>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
              <Stack gap={1.5}>
                <Text color="fg.muted" fontSize="sm">
                  Project
                </Text>
                <SelectField
                  value={selectedProject.id}
                  onChange={handleProjectChange}
                  border="1px solid"
                  borderColor="border"
                  bg="bg.subtle"
                  borderRadius="lg"
                  px={3}
                  py={3}
                  fontSize="sm"
                >
                  {projectOptions.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.label} · {project.client}
                    </option>
                  ))}
                </SelectField>
              </Stack>

              <Stack gap={1.5}>
                <Text color="fg.muted" fontSize="sm">
                  Task
                </Text>
                <SelectField
                  value={selectedTask.id}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) => setSelectedTaskId(event.target.value)}
                  border="1px solid"
                  borderColor="border"
                  bg="bg.subtle"
                  borderRadius="lg"
                  px={3}
                  py={3}
                  fontSize="sm"
                >
                  {selectedProject.tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.label}
                    </option>
                  ))}
                </SelectField>
              </Stack>
            </SimpleGrid>

            <Stack gap={1.5}>
              <Text color="fg.muted" fontSize="sm">
                Notes
              </Text>
              <NotesField
                value={note}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setNote(event.target.value)}
                minH="96px"
                resize="vertical"
                border="1px solid"
                borderColor="border"
                bg="bg.subtle"
                borderRadius="lg"
                px={3}
                py={3}
                fontSize="sm"
              />
            </Stack>

            <Flex alignItems={{ base: "flex-start", md: "center" }} justifyContent="space-between" gap={3} flexWrap="wrap">
              <Stack gap={0.5}>
                <Text fontSize="sm" fontWeight="medium">
                  {selectedProject.label}
                </Text>
                <Text color="fg.muted" fontSize="sm">
                  {selectedTask.label}
                  {note ? ` • ${note}` : ""}
                </Text>
              </Stack>

              <Flex gap={2} flexWrap="wrap">
                {isTracking ? (
                  <Button onClick={handleStopTracking}>Stop timer</Button>
                ) : (
                  <Button
                    onClick={() => {
                      setElapsedSeconds(0);
                      setIsTracking(true);
                    }}
                  >
                    Start timer
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsTracking(false);
                    setElapsedSeconds(0);
                  }}
                >
                  Reset
                </Button>
              </Flex>
            </Flex>
          </Stack>

          <Stack
            border="1px solid"
            borderColor="border"
            bg="bg"
            overflow="hidden"
          >
            <Flex
              alignItems={{ base: "flex-start", md: "center" }}
              justifyContent="space-between"
              px={{ base: 4, md: 5 }}
              py={4}
              borderBottom="1px solid"
              borderColor="border"
              gap={3}
              flexWrap="wrap"
            >
              <Stack gap={0.5}>
                <Text fontSize="lg" fontWeight="semibold">
                  Time log history
                </Text>
                <Text color="fg.muted" fontSize="sm">
                  Recent work and leave entries for quick review.
                </Text>
              </Stack>
              <Badge colorPalette="gray" variant="subtle" px={3} py={1} borderRadius="full">
                {logs.length} total entries
              </Badge>
            </Flex>

            <Box display={{ base: "none", md: "block" }}>
              <Box
                px={{ md: 5 }}
                py={3}
                borderBottom="1px solid"
                borderColor="border"
                bg="bg.subtle"
              >
                <Box
                  display="grid"
                  gridTemplateColumns="160px minmax(0, 1.5fr) 90px 96px"
                  gap={4}
                >
                  <Text color="fg.muted" fontSize="xs" textTransform="uppercase" letterSpacing="0.12em">
                    Date
                  </Text>
                  <Text color="fg.muted" fontSize="xs" textTransform="uppercase" letterSpacing="0.12em">
                    Project / description
                  </Text>
                  <Text color="fg.muted" fontSize="xs" textTransform="uppercase" letterSpacing="0.12em">
                    Hours
                  </Text>
                  <Text color="fg.muted" fontSize="xs" textTransform="uppercase" letterSpacing="0.12em">
                    Type
                  </Text>
                </Box>
              </Box>
            </Box>

            <Stack gap={0}>
              {logs.slice(0, 8).map((log) => (
                <Box
                  key={log.id}
                  px={{ base: 4, md: 5 }}
                  py={4}
                  borderBottom="1px solid"
                  borderColor="border"
                >
                  <Box
                    display="grid"
                    gridTemplateColumns={{ base: "1fr", md: "160px minmax(0, 1.5fr) 90px 96px" }}
                    gap={{ base: 2, md: 4 }}
                    alignItems="start"
                  >
                    <Text color="fg.muted" fontSize="sm">
                      {formatDisplayDate(log.date)}
                    </Text>

                    <Stack gap={0.5}>
                      <Text fontWeight="medium">
                        {log.project}
                      </Text>
                      <Text color="fg.muted" fontSize="sm">
                        {log.description}
                      </Text>
                    </Stack>

                    <Text fontWeight="medium">
                      {formatHours(log.hours)}
                    </Text>

                    <Badge
                      w="fit-content"
                      colorPalette={log.type === "work" ? "blue" : "orange"}
                      variant="subtle"
                      borderRadius="full"
                      px={2.5}
                      py={1}
                    >
                      {log.type}
                    </Badge>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Stack>

        <Stack w={{ base: "full", xl: "360px" }} gap={6} flexShrink={0}>
          <Stack
            border="1px solid"
            borderColor="border"
            bg="bg"
            overflow="hidden"
          >
            <Flex
              px={4}
              py={4}
              borderBottom="1px solid"
              borderColor="border"
              justifyContent="space-between"
              alignItems={{ base: "flex-start", md: "center" }}
              gap={3}
              flexWrap="wrap"
            >
              <Stack gap={0.5}>
                <Text fontSize="lg" fontWeight="semibold">
                  Summary
                </Text>
                <Text color="fg.muted" fontSize="sm">
                  Weekly totals plus a wider time range.
                </Text>
              </Stack>

              <Flex bg="bg.subtle" borderRadius="full" p={1} gap={1}>
                <Button
                  size="xs"
                  variant={rangeFilter === "month" ? "solid" : "ghost"}
                  onClick={() => setRangeFilter("month")}
                >
                  This month
                </Button>
                <Button
                  size="xs"
                  variant={rangeFilter === "90d" ? "solid" : "ghost"}
                  onClick={() => setRangeFilter("90d")}
                >
                  Last 90d
                </Button>
              </Flex>
            </Flex>

            <Stack gap={0}>
              {summaryRows.map((row, index) => (
                <Flex
                  key={row.label}
                  justifyContent="space-between"
                  gap={4}
                  px={4}
                  py={4}
                  borderBottom={index === summaryRows.length - 1 ? "none" : "1px solid"}
                  borderColor="border"
                  alignItems="flex-start"
                >
                  <Stack gap={0.5}>
                    <Text color="fg.muted" fontSize="sm">
                      {row.label}
                    </Text>
                    <Text fontSize="sm">
                      {row.detail}
                    </Text>
                  </Stack>
                  <Text fontSize="2xl" fontWeight="semibold" letterSpacing="-0.04em">
                    {row.value}
                  </Text>
                </Flex>
              ))}
            </Stack>
          </Stack>

          <Stack
            border="1px solid"
            borderColor="border"
            bg="bg"
            overflow="hidden"
          >
            <Box px={4} py={4} borderBottom="1px solid" borderColor="border">
              <Text fontSize="lg" fontWeight="semibold">
                Leave balance
              </Text>
              <Text color="fg.muted" fontSize="sm">
                Remaining days across available leave types.
              </Text>
            </Box>

            <Stack gap={0}>
              {leaveBalances.map((balance, index) => {
                const progress = `${(balance.remaining / balance.total) * 100}%`;

                return (
                  <Box
                    key={balance.label}
                    px={4}
                    py={4}
                    borderBottom={index === leaveBalances.length - 1 ? "none" : "1px solid"}
                    borderColor="border"
                  >
                    <Flex justifyContent="space-between" alignItems="center" gap={3}>
                      <Stack gap={0.5}>
                        <Text fontWeight="medium">
                          {balance.label}
                        </Text>
                        <Text color="fg.muted" fontSize="sm">
                          {balance.remaining} of {balance.total} days left
                        </Text>
                      </Stack>
                      <Text fontSize="xl" fontWeight="semibold" letterSpacing="-0.04em">
                        {balance.remaining}
                      </Text>
                    </Flex>

                    <Box mt={3} h="2" bg="bg.subtle" borderRadius="full" overflow="hidden">
                      <Box h="full" w={progress} bg={balance.tint} borderRadius="full" />
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Stack>

          <Stack
            border="1px solid"
            borderColor="border"
            bg="bg"
            overflow="hidden"
          >
            <Box px={4} py={4} borderBottom="1px solid" borderColor="border">
              <Text fontSize="lg" fontWeight="semibold">
                Upcoming events
              </Text>
              <Text color="fg.muted" fontSize="sm">
                Workmate PTO, company cadence, and PH/US holidays.
              </Text>
            </Box>

            <Stack gap={0}>
              {upcomingEvents.map((event, index) => (
                <Flex
                  key={event.id}
                  justifyContent="space-between"
                  gap={3}
                  px={4}
                  py={4}
                  borderBottom={index === upcomingEvents.length - 1 ? "none" : "1px solid"}
                  borderColor="border"
                  alignItems="flex-start"
                >
                  <Stack gap={1}>
                    <Flex gap={2} alignItems="center" flexWrap="wrap">
                      <Text fontWeight="medium">
                        {event.title}
                      </Text>
                      <Badge
                        colorPalette={event.category === "Holiday" ? "purple" : event.category === "PTO" ? "orange" : "blue"}
                        variant="subtle"
                        borderRadius="full"
                        px={2.5}
                        py={1}
                      >
                        {event.category}
                      </Badge>
                    </Flex>
                    <Text color="fg.muted" fontSize="sm">
                      {event.scope}
                    </Text>
                  </Stack>

                  <Stack gap={0.5} alignItems="flex-end">
                    <Text fontWeight="medium">
                      {formatCompactDate(event.startsOn)}
                    </Text>
                    <Text color="fg.muted" fontSize="sm">
                      {event.endsOn
                        ? `${formatCompactDate(event.startsOn)} to ${formatCompactDate(event.endsOn)}`
                        : "Single day"}
                    </Text>
                  </Stack>
                </Flex>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Flex>
    </Stack>
  );
}
