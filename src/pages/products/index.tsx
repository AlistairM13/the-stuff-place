import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import NotSignedInText from "~/components/notSignedInMsg";
import { api } from "~/utils/api";

export default function MyProducts() {
    const {  isSignedIn } = useUser()
    const { data } = api.products.getUserProducts.useQuery()
    if (!data) return <div>Something went wrong</div>
    return (
        <>
            <header className="flex justify-between py-10 px-20">
                <Link href="/">The Stuff Store</Link>
                <nav className="flex gap-4">
                    <Link href="/sell">Sell Product</Link>
                    <Link href="/products">My Products</Link>
                    {!isSignedIn && <SignInButton />}
                    {isSignedIn && <SignOutButton />}
                </nav>
            </header>
            <main className="flex flex-col px-20 py-10">
                {isSignedIn && <div className='flex flex-wrap gap-4'>
                    {data.map(item => <div key={item.id} className='h-32 w-32 bg-slate-800 flex justify-center items-center'>{item.name}</div>)}
                </div>}
                {!isSignedIn && <div className="flex justify-center items-center"><NotSignedInText /></div>}
            </main>
        </>
    );
}
