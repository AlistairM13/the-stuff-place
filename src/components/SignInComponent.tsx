import { SignInButton, SignOutButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

export default function SignInComponent(props: { isSignedIn: boolean }) {
    const [isBannerShowing, setIsBannerShowing] = React.useState(true)
    return (
        <>
            <header className="flex justify-between py-10 px-2 text-xl text-gray-400 sm:px-20">
                <Link href="/" className='hover:scale-110 hover:text-white transition-all duration-300'>The Stuff Store</Link>
                <nav className="flex gap-4">
                    <Link href="/sell" className='hover:scale-110 hover:text-white transition-all duration-300'>Sell Product</Link>
                    <Link href="/products" className='hover:scale-110 hover:text-white transition-all duration-300'>My Products</Link>
                    {!props.isSignedIn && <div className='hover:scale-110 hover:text-white transition-all duration-300'><SignInButton /></div>}
                    {props.isSignedIn && <div className='hover:scale-110 hover:text-white transition-all duration-300'><SignOutButton /></div>}
                </nav>
            </header>
            {isBannerShowing && !props.isSignedIn && <div className='flex w-full justify-between items-center px-5 sm:px-20 text-lg font-semibold bg-red-400 py-2 text-black'>
                <div></div>
                <div>You cannot buy or sell products without an account, please sign in</div>
                <AiOutlineClose size={20} className='hover:scale-125 cursor-pointer bg-red-600 rounded-full transition-all duration-300 h-9 w-9 sm:p-2' onClick={() => setIsBannerShowing(false)} />
            </div>}
        </>
    )
}