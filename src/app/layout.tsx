import { Provider } from "@/components/ui/provider"
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
        <Analytics />
      </body>
    </html>
  )
}