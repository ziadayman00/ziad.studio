import LoginForm from '@/components/admin/LoginForm'
import { redirectIfAdmin } from '@/lib/admin/panel'

type Props = {
  params: Promise<{ adminSecret: string }>
}

export default async function AdminLoginPage({ params }: Props) {
  const { adminSecret } = await params
  await redirectIfAdmin(adminSecret)

  return <LoginForm secret={adminSecret} />
}
