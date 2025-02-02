import { useRef, useState } from "react";

const useErrorHandler = (animationUnmountTime = 2000) => {
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [errorInAnimation, setErrorInAnimation] = useState<boolean>(false);

  const handleError = (newError: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setError(newError);
    setErrorInAnimation(true);
    timeoutRef.current = setTimeout(() => {
      setErrorInAnimation(false);
      setTimeout(() => {
        setError(null);
      }, 250);
    }, animationUnmountTime);
  };

  return { error, errorInAnimation, handleError };
};

export default useErrorHandler;
