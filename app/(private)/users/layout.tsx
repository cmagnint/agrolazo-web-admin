import type { ReactNode } from "react";

type UsersLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default function UsersLayout({ children, modal }: UsersLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
