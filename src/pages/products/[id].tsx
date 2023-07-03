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
import { type Order } from "@prisma/client";
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



  const { data: orders, isLoading: ordersLoading } = api.orders.getOrdersOnProduct.useQuery({id:id, productSellerId:product.sellerId})

  const placeOrder = () => {
    if (!user) return
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
      <main className="flex flex-col px-5 items-center sm:px-20 py-10">

        <section className="flex w-5/6  gap-10 mb-10  flex-wrap justify-center">
          <Image src={product.imageUrl} alt="product picture" height={100} width={300} style={{ objectFit: "cover" }} />
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold mb-2">{product.name}</h1>
              <p className="sm:text-lg mb-1">{`Description: ${product.description}`}</p>
              <p className="sm:text-lg mb-2">{`Price: $${product.price}`}</p>
              <p className="bg-blue-900 rounded-full text-center mb-4 w-32">{product.category}</p>
              <p className="font-thin ">{`Posted ~${dayjs(product.createdAt).fromNow()}`}</p>
            </div>
            {isSignedIn && user.id != product.sellerId &&
              <button className="bg-blue-800 hover:bg-blue-500 rounded-lg py-4" onClick={placeOrder} >Place order</button>
            }
          </div>
        </section>

        <section className="flex w-full sm:w-1/2 flex-col">

          {isSignedIn && user.id == product.sellerId && ordersLoading && <div className="w-full text-center">Loading orders...</div>}
          {isSignedIn && user.id == product.sellerId && orders && <TableOfOrders orders={orders} />}
        </section>
      </main>
    </>
  )
}

const TableOfOrders = (props: { orders: Order[] }) => {
  if (props.orders.length == 0) {
    return <>
      <h2 className="py-4 text-xl font-bold sm:text-3xl">Orders</h2>
      <div>No Orders found</div>
    </>
  }
  return (

    <div className="relative overflow-x-auto rounded-lg">
      <h2 className="py-4 text-xl font-bold sm:text-3xl">Orders</h2>
      <table className="w-full text-sm text-left text-gray-400">
        <thead className="text-xs uppercase bg-gray-700 text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Index
            </th>
            <th scope="col" className="px-6 py-3">
              Buyer Name
            </th>
            <th scope="col" className="px-6 py-3">
              Time since order
            </th>
          </tr>
        </thead>
        <tbody>
          {props.orders.map((order, index) => <tr key={order.buyerId} className="border-b bg-gray-900 border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
              {index + 1}
            </th>
            <td className="px-6 py-4">
              {order.buyerName}
            </td>
            <td className="px-6 py-4">
              {dayjs(order.createdAt).fromNow()}
            </td>
          </tr>)}
        </tbody>
      </table>
    </div>

  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
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