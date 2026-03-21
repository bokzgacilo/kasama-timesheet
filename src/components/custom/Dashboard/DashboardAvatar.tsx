"use client";

import { signout } from "@/lib/supabase/simpleHelpers";
import { Avatar, IconButton, Menu, Portal } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function DashboardAvatar() {
  const supabase = createClient();
  const [userDisplayName, setUserDisplayName] = useState<string>("");

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserDisplayName(user.user_metadata.display_name);
      }
    }
    fetchUserRole();
  }, [])

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton
          rounded="full"
          variant="ghost"
        >
          <Avatar.Root
            size="xs"
            cursor="pointer"
          >
            <Avatar.Fallback name={userDisplayName} />
          </Avatar.Root>
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="logout" onClick={() => signout()}>Logout</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}