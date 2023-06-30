import { useUser } from '@clerk/nextjs'
import { SignOutButton } from "@clerk/clerk-react";
import Link from "next/link";
import { type FormEvent, useState } from 'react';
import { api } from '~/utils/api';
import { LoadingSpinner } from '../../components/loading';
import NotSignedInContent from '~/components/notSignedInContent';


export default function SellerPage() {
  const { isSignedIn } = useUser()

  if (!isSignedIn) return <NotSignedInContent />

  const [product, setProduct] = useState({
    productName: "",
    price: "",
    category: "Clothes",
    description: ""
  })

  const { mutate: sellProduct, isLoading: isCreating } = api.products.sell.useMutation({
    onSuccess: () => {
      setProduct({
        productName: "",
        price: "",
        category: "Clothes",
        description: ""
      })
    }
  })

  function formSubmit(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault()
    sellProduct(product)
  }

  return (
    <>
      <header className="flex justify-between py-10 px-20">
        <Link href="/">The Stuff Store</Link>
        <nav className="flex gap-4">
          <Link href="/sell">Sell Product</Link>
          <Link href="/products">My Products</Link>
          <SignOutButton />
        </nav>
      </header>
      <main className="flex flex-col  items-center">
        {!isCreating &&
          <form onSubmit={(e) => formSubmit(e)} className="w-full px-10 sm:px-4 max-w-lg">
            <div className="flex flex-wrap -mx-3 ">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="productName">
                  Product Name
                </label>
                <input
                  value={product.productName}
                  onChange={(e) => setProduct(prevItems => {
                    return { ...prevItems, productName: e.target.value }
                  }
                  )}
                  autoComplete='off'
                  className="appearance-none placeholder-slate-600 block w-full bg-gray-400 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="productName" type="text" placeholder="What are you selling?" />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3  mb-4">
              <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="price">
                  Price
                </label>
                <input
                  value={product.price}
                  onChange={(e) => setProduct(prevItems => {
                    return { ...prevItems, price: e.target.value }
                  }
                  )}
                  autoComplete='off'

                  className="appearance-none placeholder-slate-600 block w-full bg-gray-400 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="price" type="number" placeholder="20 USD" />
              </div>
              <div className="w-full md:w-1/2 px-3 mb-2">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="category">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={product.category}
                    onChange={(e) => setProduct(prevItems => {
                      return { ...prevItems, category: e.target.value }
                    }
                    )} className="block appearance-none w-full bg-gray-400 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="category">
                    <option value="Clothes">Clothes</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Household essentials">Household essentials</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                  </div>
                </div>
              </div>
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  autoComplete='off'
                  value={product.description}
                  onChange={(e) => setProduct(prevItems => {
                    return { ...prevItems, description: e.target.value }
                  }
                  )}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      if (product.price !== "" && product.description !== "" && product.productName !== "") {
                        formSubmit()
                      }
                    }
                  }
                  }
                  className="appearance-none placeholder-slate-600 block w-full bg-gray-400 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="description" placeholder="Describe it further" />
              </div>
            </div>
            <button
              onClick={() => console.log(product)}
              className="w-full  bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 rounded focus:outline-none focus:shadow-outline" type="submit">
              Sell
            </button>
          </form>
        }
        {isCreating && <div className='flex justify-center items-center mt-20'><LoadingSpinner size={60} /></div>}
      </main>
    </>
  );
}

