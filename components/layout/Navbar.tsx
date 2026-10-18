"use client";
import { Show, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="w-full my-6">
      <nav className="container flex items-center justify-between">
        <Link href="/">Home</Link>
        <ul className="flex items-center gap-2">
          <Show when="signed-out">
            <li>
              <Link href="/auth/sign-in">Login</Link>
            </li>
            <li>
              <Link href="/auth/sign-up">Register</Link>
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
