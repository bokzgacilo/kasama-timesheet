"use client";

import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  NativeSelect,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DUMMY_USERS,
  type DummyUser,
} from "@/lib/session";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState(DUMMY_USERS[0]?.id ?? "");
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/dashboard")
      } else {
        setIsLoading(false)
      }
    }
    fetchUser();
  }, [])

  if (isLoading) {
    return <Stack p={4}>
      <Center>
        <Spinner />
      </Center>
    </Stack>
  }

  const selectedUser = DUMMY_USERS.find((user) => user.id === selectedUserId) ?? DUMMY_USERS[0];

  const handleLogin = async (user: DummyUser) => {
    const { data, error } = await supabase.auth.signInAnonymously({
      options: {
        data: {
          display_name: `${user.first_name} ${user.last_name}`,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          employee_id: user.employeeId,
          department: user.department,
          location: user.location,
          title: user.title,
        }
      }
    })

    if (data) {
      router.push("/dashboard")
    }
  };

  return (
    <Flex minH="100vh" bg="bg" alignItems="center" justifyContent="center" px={6}>
      <Stack w="full" maxW="440px" gap={8}>
        <Stack gap={2}>
          <Text
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="semibold"
            letterSpacing="-0.04em"
          >
            Timesheet Access
          </Text>
          <Text color="fg.muted" maxW="360px">
            Select a dummy account to develop and preview the basic and manager
            experiences.
          </Text>
        </Stack>

        <Stack
          gap={6}
          border="1px solid"
          borderColor="border"
          borderRadius="2xl"
          p={6}
          bg="bg.subtle"
        >
          <Stack gap={3}>
            <Text fontSize="sm" fontWeight="medium">
              User selector
            </Text>
            <NativeSelect.Root size="lg">
              <NativeSelect.Field
                value={selectedUserId}
                onChange={(event) => setSelectedUserId(event.currentTarget.value)}
              >
                {DUMMY_USERS.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} · {user.role}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Stack>

          {selectedUser && (
            <Stack
              gap={4}
              borderTop="1px solid"
              borderColor="border"
              pt={5}
            >
              <Flex alignItems="flex-start" justifyContent="space-between" gap={4}>
                <Stack gap={1}>
                  <Text fontSize="xl" fontWeight="semibold">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </Text>
                  <Text color="fg.muted" fontSize="sm">
                    {selectedUser.title}
                  </Text>
                </Stack>
                <Badge
                  colorPalette={selectedUser.role === "manager" ? "orange" : "blue"}
                  variant="subtle"
                >
                  {selectedUser.role}
                </Badge>
              </Flex>

              <Stack gap={3}>
                <SessionRow label="Employee ID" value={selectedUser.employeeId} />
                <SessionRow label="Email" value={selectedUser.email} />
                <SessionRow label="Department" value={selectedUser.department} />
                <SessionRow label="Location" value={selectedUser.location} />
                <SessionRow label="Session ID" value={selectedUser.id} />
              </Stack>
            </Stack>
          )}

          <Button
            size="lg"
            onClick={() => selectedUser && handleLogin(selectedUser)}
            loadingText="Opening dashboard"
          >
            Login
          </Button>
        </Stack>

        <Box>
          <Text color="fg.muted" fontSize="sm">
            The selected profile is stored in `sessionStorage` as a temporary
            dummy session until real authentication is implemented.
          </Text>
        </Box>
      </Stack>
    </Flex>
  );
}

function SessionRow({ label, value }: { label: string; value: string }) {
  return (
    <Flex alignItems="center" justifyContent="space-between" gap={4}>
      <Text color="fg.muted" fontSize="sm">
        {label}
      </Text>
      <Text fontSize="sm" fontWeight="medium" textAlign="right">
        {value}
      </Text>
    </Flex>
  );
}
