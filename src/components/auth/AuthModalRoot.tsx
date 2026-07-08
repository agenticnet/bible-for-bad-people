"use client";

import { useAuthModal } from "./AuthModalProvider";
import SignUpModal from "./SignUpModal";

export default function AuthModalRoot() {
  const { modalState, closeSignUp } = useAuthModal();
  return (
    <SignUpModal
      open={modalState.open}
      onClose={closeSignUp}
      context={modalState.context}
      nextPath={modalState.nextPath}
    />
  );
}
