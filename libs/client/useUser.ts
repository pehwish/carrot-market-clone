import useSWR from 'swr';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { User } from '@prisma/client';
/**
 * SWR
 * stale-while-revalidate HTTP 캐시 무효화 전략
 * url 이 API 요청할 url 이기 하면서 캐시를 저장할 때 사용하는 Key 이기도 함
 */

interface ProfileResponse {
  ok: boolean;
  profile: User;
}

export default function useUser(publicPages?: string[]) {
  const router = useRouter();
  const { data, error } = useSWR<ProfileResponse>('/api/users/me');

  useEffect(() => {
    if (data && !data.ok && !publicPages?.includes(router.pathname)) {
      router.replace('/enter');
    }
  }, [data, router]);
  return { user: data?.profile, isLoading: !data && !error };
}
