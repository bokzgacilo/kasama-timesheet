"use client";

import {
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  SimpleGrid,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import {
  addDays,
  addMonths,
  cloneDate,
  formatDateKey,
  formatMonthLabel,
  formatWeekLabel,
  getMonthDates,
  getVisibleWeekdays,
  getWeekDates,
} from "./CalendarHelpers";
import LogTimeModal, { Log } from "./LogTimeModal";

export type DayData = {
  date: string;
  logs: Log[];
};

type CalendarView = "month" | "week";

export default function Calendar() {
  const today = cloneDate(new Date());
  const [currentDate, setCurrentDate] = useState(today);
  const [view, setView] = useState<CalendarView>("month");
  const [showWeekends, setShowWeekends] = useState(true);
  const [data, setData] = useState<Record<string, DayData>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const visibleWeekdays = getVisibleWeekdays(showWeekends);
  const visibleDates =
    view === "month"
      ? getMonthDates(currentDate, showWeekends)
      : getWeekDates(currentDate, showWeekends);
  const periodLabel =
    view === "month" ? formatMonthLabel(currentDate) : formatWeekLabel(currentDate);

  const handleSaveLog = (date: string, log: Log) => {
    setData((prev) => {
      const existing = prev[date] || { date, logs: [] };

      return {
        ...prev,
        [date]: {
          ...existing,
          logs: [...existing.logs, log],
        },
      };
    });
  };

  const handleNavigate = (direction: "previous" | "next") => {
    const step = direction === "previous" ? -1 : 1;

    setCurrentDate((prev) =>
      view === "month" ? addMonths(prev, step) : addDays(prev, step * 7),
    );
  };

  return (
    <Stack gap={4}>
      <Flex
        alignItems={{ base: "flex-start", md: "center" }}
        justifyContent="space-between"
        gap={4}
        flexWrap="wrap"
      >
        <Stack gap={0}>
          <Text fontSize="xl" fontWeight="semibold">
            Calendar
          </Text>
          <Text color="fg.muted" fontSize="sm">
            Switch between monthly planning and weekly focus.
          </Text>
        </Stack>

        <Flex alignItems="center" gap={2} flexWrap="wrap">
          <Flex
            bg="bg.muted"
            borderRadius="lg"
            p={1}
            gap={1}
          >
            <Button
              size="xs"
              variant={view === "month" ? "solid" : "ghost"}
              onClick={() => setView("month")}
            >
              Month
            </Button>
            <Button
              size="xs"
              variant={view === "week" ? "solid" : "ghost"}
              onClick={() => setView("week")}
            >
              Week
            </Button>
          </Flex>

          <Switch.Root
            size="sm"
            checked={showWeekends}
            onCheckedChange={(event) => setShowWeekends(event.checked)}
          >
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Label>Show weekends</Switch.Label>
          </Switch.Root>
        </Flex>
      </Flex>

      <Stack
        border="1px solid"
        borderColor="border"
        overflow="hidden"
        gap={0}
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          p={2}
          borderBottom="1px solid"
          borderColor="border"
          bg="bg.subtle"
        >
          <Flex alignItems="center" gap={2}>
            <IconButton
              aria-label={`Previous ${view}`}
              variant="outline"
              size="xs"
              onClick={() => handleNavigate("previous")}
            >
              <LuChevronLeft />
            </IconButton>
            <IconButton
              aria-label={`Next ${view}`}
              variant="outline"
              size="xs"
              onClick={() => handleNavigate("next")}
            >
              <LuChevronRight />
            </IconButton>
          </Flex>

          <Text fontWeight="semibold">
            {periodLabel}
          </Text>
        </Flex>

        <SimpleGrid columns={visibleWeekdays.length} gap={0}>
          {visibleWeekdays.map((day) => (
            <Box
              key={day.label}
              px={3}
              py={2}
              borderBottom="1px solid"
              borderColor="border"
              bg="bg"
            >
              <Text color="fg.muted" fontSize="xs" fontWeight="semibold">
                {day.label}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        <SimpleGrid columns={visibleWeekdays.length} gap={0}>
          {visibleDates.map((day) => {
            const dateKey = formatDateKey(day);
            const logs = data[dateKey]?.logs || [];
            const inCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = dateKey === formatDateKey(today);

            return (
              <Stack
                key={dateKey}
                minH={view === "month" ? "132px" : "180px"}
                p={3}
                gap={3}
                cursor="pointer"
                borderRight="1px solid"
                borderBottom="1px solid"
                borderColor="border"
                bg={
                  view === "month" && !inCurrentMonth
                    ? "bg.subtle"
                    : isToday
                      ? "bg.muted"
                      : "bg"
                }
                _hover={{ bg: "bg.muted" }}
                onClick={() => {
                  setSelectedDate(dateKey);
                  setOpen(true);
                }}
              >
                <Flex
                  alignItems="flex-start"
                  justifyContent="space-between"
                  gap={2}
                >
                  <Stack gap={0}>
                    <Text color={inCurrentMonth ? "fg" : "fg.muted"} fontSize="sm">
                      {day.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                    <Text color="fg.muted" fontSize="xs">
                      {day.toLocaleDateString("en-US", { weekday: "long" })}
                    </Text>
                  </Stack>
                  {isToday && (
                    <Badge colorPalette="blue" variant="subtle">
                      Today
                    </Badge>
                  )}
                </Flex>

                <Stack gap={2}>
                  {logs.length > 0 ? (
                    logs.slice(0, view === "month" ? 2 : 4).map((log) => (
                      <Box
                        key={log.id}
                        px={2}
                        py={1.5}
                        borderRadius="md"
                        bg={log.type === "leave" ? "orange.subtle" : "blue.subtle"}
                      >
                        <Text fontSize="xs" fontWeight="medium" truncate>
                          {log.project || "Leave"}
                        </Text>
                        <Text color="fg.muted" fontSize="xs" truncate>
                          {log.task}
                        </Text>
                        <Text color="fg.muted" fontSize="xs">
                          {log.hours}h
                        </Text>
                      </Box>
                    ))
                  ) : (
                    <Text color="fg.muted" fontSize="xs">
                      No entries
                    </Text>
                  )}

                  {logs.length > (view === "month" ? 2 : 4) && (
                    <Text color="fg.muted" fontSize="xs">
                      +{logs.length - (view === "month" ? 2 : 4)} more
                    </Text>
                  )}
                </Stack>
              </Stack>
            );
          })}
        </SimpleGrid>
      </Stack>

      {
        selectedDate && (
          <LogTimeModal
            key={`${selectedDate}-${open ? "open" : "closed"}`}
            date={selectedDate}
            logs={data[selectedDate]?.logs || []}
            open={open}
            setOpen={setOpen}
            onSave={(log) => handleSaveLog(selectedDate, log)}
          />
        )
      }
    </Stack >
  );
}
