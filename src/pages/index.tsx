import { useUser } from '@clerk/nextjs'
import { api } from '~/utils/api';
import SignInComponent from '~/components/SignInComponent';
import Product from '~/components/Product';
import { LoadingSpinner } from '~/components/LoadingSpinner';

export default function Home() {
  const { isSignedIn, isLoaded } = useUser()
  const { data, isLoading: productsLoading } = api.products.getAll.useQuery()

  if (!isLoaded) return <div />

  if (productsLoading) return <>
    <SignInComponent isSignedIn={isSignedIn} />
    <div className='flex justify-center mt-10'>
      <LoadingSpinner size={60} />
    </div></>
  if (!data) return <div>Something went wrong</div>

  return (
    <>
      <SignInComponent isSignedIn={isSignedIn} />
      <main className="flex  flex-col text-white px-20 py-10">
        <section className='flex flex-col'>
          <h1 className='text-xl sm:text-3xl font-bold my-4'>Products</h1>
          <div className='flex flex-wrap gap-4'>
            {data.map(item =>
              <Product product={item} key={item.id} />
            )}
          </div>
        </section>
      </main>
    </>
  );
}
