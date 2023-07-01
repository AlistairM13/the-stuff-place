import { Product } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Product = (props: { product: Product }) => {
    return (
        <Link href={`/products/${props.product.id}`} className='relative h-60 w-60 hover:scale-110 hover:m-2 transition-all duration-300 rounded-lg'>
            <Image src={props.product.imageUrl} alt="" fill={true} className='object-cover rounded-lg' />
            <div className='absolute top-0 right-0 h-60 w-60 bg-transparent text-transparent transition-all text-xl duration-300  hover:bg-black/80 hover:text-white flex justify-center items-center'>{props.product.name}</div>
        </Link>
    )
}

export default Product