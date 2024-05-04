import { useEffect, useState } from "react";

/**
 * 지정된 지연 시간에 따라 값을 디바운스하는 커스텀 훅
 *
 * @param value - 디바운스할 값
 * @param delay - 지연 시간(밀리초 단위)
 * @returns 지정된 지연 시간 이후의 디바운스된 값
 *
 * 이 훅은 원래 값이 마지막으로 변경된 후 지정된 지연 시간이 지나아먄 변경되는 디바운스된 값을 생성한다.
 * 이는 사용자 입력을 처리할 때와 같이 함수가 실행되는 빈도를 제한하는 데 유용할 수 있다.
 *
 * 이 훅은 디바운스된 값을 업데이트하기 위해 타임아웃을 설정하고,
 * 값이나 지연 시간이 타임아웃이 완료되기 전에 변경되면 타임아웃을 취소한다.
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};