import { getUser } from "@/lib/auth/actions"
import { NavigationClient } from "./NavigationClient"

export async function Navigation() {
  const user = await getUser()

  return <NavigationClient user={user} />
}
