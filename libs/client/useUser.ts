import useSWR from 'swr';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
/**
 * SWR
 * stale-while-revalidate HTTP 캐시 무효화 전략
 * url 이 API 요청할 url 이기 하면서 캐시를 저장할 때 사용하는 Key 이기도 함
 */

export default function useUser() {
  const { data, error } = useSWR('/api/users/me');
  const router = useRouter();
  useEffect(() => {
    if (data && !data.ok) {
      router.replace('/enter');
    }
  }, [data, router]);
  return { user: data?.profile, isLoading: !data && !error };
}
