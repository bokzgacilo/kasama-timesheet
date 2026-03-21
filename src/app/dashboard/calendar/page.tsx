import Calendar from "@/components/custom/Calendar/Calendar"
import { Box } from "@chakra-ui/react"

export default function Page() {
  return (
    <Box
      p={4}
      overflow="auto"
      bg="bg.subtle"
    >
      <Calendar />
    </Box>
  )
}