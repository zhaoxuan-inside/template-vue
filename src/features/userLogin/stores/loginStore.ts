import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLoginDomain } from '../composables/domain'
import type { User } from '@entities/user'

export const useLoginStore = defineStore('login', () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentUser = ref<User | null>(null)
  const isLoggedIn = computed(() => !!currentUser.value)

  const login = async (email: string, password: string): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      const { login: domainLogin } = useLoginDomain()
      currentUser.value = await domainLogin(email, password)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '登录失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = (): void => {
    currentUser.value = null
    error.value = null
    localStorage.removeItem('token')
  }

  const clearError = (): void => {
    error.value = null
  }

  return {
    isLoading,
    error,
    currentUser,
    isLoggedIn,
    login,
    logout,
    clearError,
  }
})
