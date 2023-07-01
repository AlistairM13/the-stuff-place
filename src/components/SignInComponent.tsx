import { SignInButton, SignOutButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

export default function SignInComponent(props: { isSignedIn: boolean }) {
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
            {!props.isSignedIn && <div className='flex w-full justify-center '>
                You cannot buy or sell without an account, please sign in
            </div>}
        </>
    )
}