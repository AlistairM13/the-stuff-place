import { SignInButton, SignOutButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

export default function SignInComponent(props: { isSignedIn: boolean }) {
    return (
        <>
            <header className="flex justify-between py-10 px-20">
                <Link href="/">The Stuff Store</Link>
                <nav className="flex gap-4">
                    <Link href="/sell">Sell Product</Link>
                    <Link href="/products">My Products</Link>
                    {!props.isSignedIn && <SignInButton />}
                    {props.isSignedIn && <SignOutButton />}
                </nav>
            </header>
            {!props.isSignedIn && <div className='flex w-full justify-center '>
                You cannot buy or sell without an account, please sign in
            </div>}
        </>
    )
}