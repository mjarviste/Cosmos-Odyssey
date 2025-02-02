import { useRef, useState } from "react";

const useConfirmHandler = (animationUnmountTime = 2000) => {
  const [confirm, setConfirm] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [confirmInAnimation, setConfirmInAnimation] = useState<boolean>(false);

  const handleConfirm = (newConfirm: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setConfirm(newConfirm);
    setConfirmInAnimation(true);
    timeoutRef.current = setTimeout(() => {
      setConfirmInAnimation(false);
      setTimeout(() => {
        setConfirm(null);
      }, 250);
    }, animationUnmountTime);
  };

  return { confirm, confirmInAnimation, handleConfirm };
};

export default useConfirmHandler;
