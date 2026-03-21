import DashboardAvatar from "@/components/custom/Dashboard/DashboardAvatar";
import DashboardGrid from "@/components/custom/Dashboard/DashboardGrid";
import { Sidebar } from "@/components/custom/Sidebar";
import { ColorModeButton } from "@/components/ui/color-mode";
import { createClient } from "@/lib/supabase/server";
import { signout } from "@/lib/supabase/simpleHelpers";
import { Avatar, Box, Button, Center, Flex, IconButton, Menu, Portal, SimpleGrid, Spinner, Stack, Text } from "@chakra-ui/react";
import type { Metadata } from 'next'
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Kasama Timesheet",
  description: "Kasama Timesheet",
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/")
  } else {
    console.log(user)
  }

  return (
    <Stack
      height="100vh"
      overflow="hidden"
      gap={0}
    >
      <Flex
        height="6vh"
        px={4}
        py={2}
        bg="bg"
        gap={2}
        borderBottom="1px solid"
        borderColor="border"
        alignItems="center"
      >
        <Text fontWeight="bold" mr="auto">Kasama Timesheet</Text>
        <ColorModeButton
          rounded="full"
        />

        <DashboardAvatar />
      </Flex>
      <DashboardGrid>
        {children}
      </DashboardGrid>
    </Stack>
  );
}
