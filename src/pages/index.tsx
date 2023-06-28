import { useUser } from '@clerk/nextjs'
import { SignInButton, SignOutButton } from "@clerk/clerk-react";
import Link from "next/link";

export default function Home() {
  const { user, isSignedIn } = useUser()
  console.log(user);

  return (
    <>
      <header className="flex justify-between py-10 px-20">
        <div>The Stuff Store</div>
        <nav className="flex gap-4">
          <Link href="/sell">Sell Product</Link>
          <Link href="/products">My Products</Link>
          {!isSignedIn && <SignInButton />}
          {isSignedIn && <SignOutButton />}
        </nav>
      </header>
      <main className="flex  flex-col bg-white text-white">

      </main>
    </>
  );
}
