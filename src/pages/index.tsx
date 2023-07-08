import { useUser } from '@clerk/nextjs'
import { api } from '~/utils/api';
import SignInComponent from '~/components/SignInComponent';
import Product from '~/components/Product';
import { LoadingSpinner } from '~/components/LoadingSpinner';
import { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { BsChevronUp } from 'react-icons/bs'
import { Disclosure } from '@headlessui/react';

export default function Home() {
  const [selectedCat, setSelectedCat] = useState<string[]>([])
  const [filteredCat, setFilteredCat] = useState<string[]>([])
  const { isSignedIn, isLoaded } = useUser()
  const { data, isLoading: productsLoading } = api.products.getAll.useQuery({ categories: filteredCat })

  if (!isLoaded) return <div />

  if (productsLoading) return <>
    <SignInComponent isSignedIn={isSignedIn} />
    <div className='flex justify-center mt-10'>
      <LoadingSpinner size={60} />
    </div></>
  if (!data) return <div>Something went wrong</div>

  function selectItem(selectedCategory: string) {
    let updated = [...selectedCat]
    if (selectedCat.includes(selectedCategory)) {
      updated = selectedCat.filter(cat => cat !== selectedCategory)
    } else {
      updated.push(selectedCategory)
    }
    setSelectedCat(updated)
  }
  function filterProducts() {
    setFilteredCat(selectedCat)
  }

  return (
    <>
      <SignInComponent isSignedIn={isSignedIn} />
      <main className="flex flex-col text-slate-200 px-5 sm:px-20 py-10">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between items-center rounded-lg bg-slate-800 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-slate-400 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                <h2 className='text-2xl text-slate-200'>Filter categories</h2>
                <BsChevronUp
                  className={`${open ? 'rotate-180 transform' : ''
                    } h-5 w-5 text-slate-200`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 bg-slate-900 mx-2 rounded-b-md pt-4 pb-2 text">
                <div className='flex flex-wrap'>
                  {["Household essentials", "Electronics", "Clothes"].map(item =>
                    <div className={`${selectedCat.includes(item) ? 'bg-blue-950' : ' border-2 border-blue-700'} mr-4 mb-2 p-2 rounded-lg cursor-pointer `} onClick={() => selectItem(item)} >{item}</div>
                  )}
                </div>
                <div className='flex justify-end '>
                  {!!selectedCat.length && <button
                    className='flex gap-2 items-center bg-blue-950 hover:bg-blue-800 px-4 py-2 rounded-lg'
                    onClick={filterProducts}
                  >
                    <FaFilter size={20} />
                    Filter products
                  </button>}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
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