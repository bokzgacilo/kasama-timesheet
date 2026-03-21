"use client";

import { Dialog, Portal, Text, Stack, Flex, Input, Badge, Box, Field, NativeSelect, CloseButton, Button, createListCollection } from "@chakra-ui/react";
import { useState } from "react";
import { parseDateKey } from "./CalendarHelpers";

export type Log = {
  id: string;
  project: string;
  task: string;
  hours: number;
  type: "work" | "leave";
};

const Projects = createListCollection({
  items: [
    { label: "Brand Junkie", value: "brand-junkie" }
  ]

})

export default function LogTimeModal({
  date,
  logs,
  open,
  setOpen,
  onSave,
}: {
  date: string;
  logs: Log[];
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: (log: Log) => void;
}) {
  const [project, setProject] = useState("");
  const [task, setTask] = useState("");
  const [hours, setHours] = useState("1");
  const [type, setType] = useState<"work" | "leave">("work");

  const handleSave = () => {
    const parsedHours = Number(hours);

    if (type === "work" && !project) {
      return;
    }

    if (!task.trim() || Number.isNaN(parsedHours) || parsedHours <= 0) {
      return;
    }

    onSave({
      id: crypto.randomUUID(),
      project: type === "leave" ? "" : project,
      task: task.trim(),
      hours: parsedHours,
      type,
    });

    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(event) => setOpen(event.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Stack gap={1}>
                <Dialog.Title>Log Time</Dialog.Title>
                <Text color="fg.muted" fontSize="sm">
                  {parseDateKey(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </Stack>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap={4}>
                <Stack gap={2}>
                  <Text fontSize="sm" fontWeight="medium">
                    Existing logs
                  </Text>
                  {logs.length > 0 ? (
                    <Stack gap={2}>
                      {logs.map((log) => (
                        <Flex
                          key={log.id}
                          alignItems="center"
                          justifyContent="space-between"
                          bg="bg.muted"
                          borderRadius="md"
                          px={3}
                          py={2}
                        >
                          <Box>
                            <Text fontSize="sm" fontWeight="medium">
                              {log.project || "Leave"}
                            </Text>
                            <Text color="fg.muted" fontSize="xs">
                              {log.task}
                            </Text>
                          </Box>
                          <Badge variant="subtle">
                            {log.hours}h {log.type}
                          </Badge>
                        </Flex>
                      ))}
                    </Stack>
                  ) : (
                    <Text color="fg.muted" fontSize="sm">
                      No logs for this day yet.
                    </Text>
                  )}
                </Stack>

                <Field.Root>
                  <Field.Label>Entry Type</Field.Label>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={type}
                      onChange={(event) =>
                        setType(event.currentTarget.value as "work" | "leave")
                      }
                    >
                      <option value="work">Work</option>
                      <option value="leave">Leave</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Project</Field.Label>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={project}
                      onChange={(event) => setProject(event.currentTarget.value)}
                    // isDisabled={type === "leave"}
                    >
                      <option value="">Select project</option>
                      {Projects.items.map((project) => (
                        <option key={project.value} value={project.value}>
                          {project.label}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Task</Field.Label>
                  <Input
                    size="sm"
                    placeholder={
                      type === "leave" ? "Reason or note" : "What did you work on?"
                    }
                    value={task}
                    onChange={(event) => setTask(event.currentTarget.value)}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Hours</Field.Label>
                  <Input
                    size="sm"
                    type="number"
                    min={0.5}
                    step={0.5}
                    value={hours}
                    onChange={(event) => setHours(event.currentTarget.value)}
                  />
                </Field.Root>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button size="sm" variant="outline">
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};