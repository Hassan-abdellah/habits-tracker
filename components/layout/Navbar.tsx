"use client";
import { Show, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <header className="w-full h-(--nav-height) pt-2">
      <nav className="container flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <ul className="flex items-center gap-2">
          <Show when="signed-out">
            <li>
              <Link
                href="/auth/sign-in"
                className="text-desert-sand font-medium"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/auth/sign-up"
                className="text-desert-sand font-medium"
              >
                Register
              </Link>
            </li>
          </Show>

          <Show when="signed-in">
            <li>
              <UserButton />
            </li>
          </Show>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
