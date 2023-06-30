import { SignInButton } from "@clerk/nextjs"
import Link from "next/link"

const NotSignedInContent = () => {
    return <>
        <header className="flex justify-between py-10 px-20">
            <Link href="/">The Stuff Store</Link>
            <nav className="flex gap-4">
                <Link href="/sell">Sell Product</Link>
                <Link href="/products">My Products</Link>
                <SignInButton />
            </nav>
        </header>
        <main className="flex flex-col ">
            <div className="flex justify-center items-center">You don&apos;t have an acount to sell stuff, sign up now!</div>
        </main>
    </>
}
export default NotSignedInContent