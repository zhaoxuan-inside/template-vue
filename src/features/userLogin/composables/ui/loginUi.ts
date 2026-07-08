import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'

export function useLoginUi() {
  const message = useMessage()
  const router = useRouter()

  const showLoginSuccess = (): void => {
    message.success('登录成功')
  }

  const showLoginError = (error: string): void => {
    message.error(error)
  }

  const navigateToDashboard = (): void => {
    router.push('/dashboard')
  }

  const navigateToRegister = (): void => {
    router.push('/register')
  }

  const navigateToForgotPassword = (): void => {
    router.push('/forgot-password')
  }

  return {
    showLoginSuccess,
    showLoginError,
    navigateToDashboard,
    navigateToRegister,
    navigateToForgotPassword,
  }
}
