import { SignInButton, SignOutButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'

export default function SignInComponent(props: { isSignedIn: boolean }) {
    const [isBannerShowing, setIsBannerShowing] = React.useState(true)
    const [isMenuShowing, setIsMenuShowing] = React.useState(false)
    return (
        <>
            <header className="flex sm:sticky sm:top-0 bg-slate-800  justify-between text-xl text-gray-400 sm:px-20">
                <Link href="/" className=' hover:scale-110 my-10 uppercase  font-bold hover:text-white transition-all duration-300'>The Stuff Store</Link>
                <nav className="hidden md:flex my-10 gap-4">
                    <Link href="/sell" className='hover:scale-110 hover:text-white transition-all duration-300'>Sell Product</Link>
                    <Link href="/products" className='hover:scale-110 hover:text-white transition-all duration-300'>My Products</Link>
                    <div className='hover:scale-110 hover:text-white text-gray-200 font-semibold transition-all duration-300'>
                        {!props.isSignedIn && <SignInButton />}
                        {props.isSignedIn && <SignOutButton />}
                    </div>
                </nav>

                <div onClick={() => setIsMenuShowing(!isMenuShowing)} className='my-10 block md:hidden'>
                    {isMenuShowing ? <AiOutlineClose size={25} strokeWidth={25} className='bg-gray-600  h-9 w-9 p-2 rounded-full' /> : <AiOutlineMenu size={25} strokeWidth={25} className='h-9 w-9 p-2' />}
                </div>

                <div className={isMenuShowing ? `fixed uppercase flex justify-between flex-col z-10 left-0 w-[60%] h-full bg-black border-l border-l-gray-800 ease-in duration-300` : "fixed left-[-100%]"}>
                    <div className='flex flex-col'>
                        <Link href="/" onClick={() => setIsMenuShowing(false)} className='font-bold mt-10 ml-10 text-white'>The Stuff Store</Link>
                        <nav className="flex flex-col text-sm  pl-4 gap-4 mt-14 ">
                            <Link href="/sell" onClick={() => setIsMenuShowing(false)} className='text-white p-4 border-b border-b-gray-500'>Sell Product</Link>
                            <Link href="/products" onClick={() => setIsMenuShowing(false)} className='text-white p-4 border-b border-b-gray-500'>My Products</Link>
                        </nav>
                    </div>
                    <div className='text-white m-10 align-bottom font-semibold'>
                        {!props.isSignedIn && <SignInButton />}
                        {props.isSignedIn && <SignOutButton />}
                    </div>

                </div>
            </header>
            {isBannerShowing && !props.isSignedIn && <div className='flex w-full justify-between items-center px-5 sm:px-20  font-semibold bg-red-400 py-2 text-black'>
                <div></div>
                <div className='text-xs sm:text-lg'>You cannot buy or sell products without an account, please sign in</div>
                <AiOutlineClose size={20} className='hover:scale-125 cursor-pointer bg-red-600 rounded-full transition-all duration-300 h-9 w-9 p-2' onClick={() => setIsBannerShowing(false)} />
            </div>}
        </>
    )
}