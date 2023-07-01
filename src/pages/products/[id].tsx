import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import type { GetStaticProps, NextPage } from "next";
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import { toast } from "react-hot-toast";
import SignInComponent from "~/components/SignInComponent";
import Image from "next/image";

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime)

const SingleProductPage: NextPage<{ id: string }> = ({ id }) => {

  const { user, isSignedIn } = useUser()
  const { data: product, isLoading: productLoading } = api.products.getProductById.useQuery(id)

  if (!product) return <div>404</div>
  const { mutate } = api.orders.placeOrder.useMutation({
    onSuccess: () => {
      toast.success("Order placed successfully")
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0])
      } else {
        toast.error("Failed to add product, please try again later.")
      }
    }
  })
  if (!user) return <SignInComponent isSignedIn={false} />

  const { data: orders, isLoading: ordersLoading } = api.orders.getOrdersOnProduct.useQuery(id)

  const placeOrder = () => {
    mutate({
      buyerId: user.id,
      productId: id,
      buyerName: user.firstName ? user.firstName : "",
      sellerId: product.sellerId
    })
  }

  if (productLoading) return <div>Loading</div>
  if (!product) return <div>404</div>
  return (
    <>
      <SignInComponent isSignedIn={!!isSignedIn} />
      <main className="flex flex-col items-center px-20 py-10">
        <div className="flex w-5/6 gap-10  mb-10 flex-wrap h-96 justify-center">
          <Image src={product.imageUrl} alt="product picture" height={100} width={300} style={{ objectFit: "cover" }} />
          <div className="flex flex-col justify-between ">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-lg mb-1">{`Description: ${product.description}`}</p>
              <p className="text-lg mb-1">{`Price: $${product.price}`}</p>
              <p className="bg-blue-900 rounded-full text-center mb-4 w-32">{product.category}</p>
              <p className="font-thin ">{`Posted ~${dayjs(product.createdAt).fromNow()}`}</p>
            </div>
            {isSignedIn && user.id != product.sellerId &&
              <button className="bg-blue-800 hover:bg-blue-500 rounded-lg py-4" onClick={placeOrder} >Place order</button>
            }
          </div>
        </div>
        {user.id == product.sellerId && ordersLoading && <div>Loading orders...</div>}
        {orders && <div className="flex gap-3">{orders.map(order =>
          <div className="flex flex-col">

            <div>{dayjs(order.createdAt).fromNow()}</div>
            <div>{order.buyerName}</div>
          </div>
        )}</div>}
        {user.id == product.sellerId && orders && orders.length == 0 && <div>No Orders found</div>}
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const id = context.params?.id

  if (typeof id !== "string") throw new Error("no id")
  await ssg.products.getProductById.prefetch(id)
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id
    }
  }
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" }
}
export default SingleProductPage