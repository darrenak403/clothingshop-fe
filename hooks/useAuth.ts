/* eslint-disable @typescript-eslint/no-explicit-any */
import {useRouter} from 'next/navigation'
import {toast} from 'sonner'
import {useAppDispatch, useAppSelector} from '@/lib/redux/hooks'
import {loginAsync, logoutAsync, selectAuth} from '@/lib/redux/slices/authSlice'

export function useAuth() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const auth = useAppSelector(selectAuth)

  const login = async (credentials: {email: string; password: string}) => {
    try {
      const result = await dispatch(loginAsync(credentials)).unwrap()
      toast.success('Đăng nhập thành công')
      router.push('/dashboard')
      return result
    } catch (error: any) {
      toast.error(error || 'Đăng nhập thất bại')
      throw error
    }
  }

  const logout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap()
      toast.success('Đăng xuất thành công')
      router.push('/login')
    } catch (error: any) {
      toast.error('Có lỗi xảy ra')
    }
  }

  return {
    ...auth,
    login,
    logout,
  }
}
