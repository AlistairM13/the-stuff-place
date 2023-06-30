import { useUser } from '@clerk/nextjs'
import { SignInButton, SignOutButton } from "@clerk/clerk-react";
import Link from "next/link";
import { api } from '~/utils/api';

export default function Home() {
  const { isSignedIn, isLoaded } = useUser()
  const { data, isLoading: productsLoading } = api.products.getAll.useQuery()


  if (!isLoaded) return <div />
  if (productsLoading) return <div>Loading...</div>

  if (!data) return <div>Something went wrong</div>

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
      <main className="flex  flex-col text-white px-20 py-10">
        <section className='flex bg-slate-900'>
          <div>Category here</div>
        </section>
        <section className='flex flex-col'>
          <h1>Products</h1>
          <div className='flex flex-wrap gap-4'>
            {data.map(item =>
              <Link href={`/products/${item.id}`}>
                <div key={item.id} className='h-32 w-32 bg-slate-800 flex justify-center items-center'>{item.name}</div>
              </Link>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
