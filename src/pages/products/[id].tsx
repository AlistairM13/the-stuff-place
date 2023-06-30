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
  const { data, isLoading } = api.products.getProductById.useQuery(id)

  if (!data) return <div>404</div>
  const { mutate } = api.orders.placeOrder.useMutation({
    onSuccess: () => {
      toast.success("Order placed successfully")
    }
  })


  const placeOrder = () => {
    if (!user) return
    mutate({
      buyerId: user.id,
      productId: id,
      buyerName: user.firstName ? user.firstName : "",
      sellerId: data.sellerId
    })
  }



  if (isLoading) return <div>Loading</div>
  if (!data) return <div>404</div>
  return (
    <>
      <SignInComponent isSignedIn={!!isSignedIn} />
      <main className="flex flex-col items-center px-20 py-10">
        <div className="flex w-5/6 gap-10 flex-wrap h-96 justify-center">
            <Image src={data.imageUrl} alt="product picture" height={100} width={300} style={{ objectFit: "cover" }}  />
          <div className="flex flex-col justify-between ">
            <div>
              <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
              <p className="text-lg mb-1">{`Description: ${data.description}`}</p>
              <p className="text-lg mb-1">{`Price: $${data.price}`}</p>
              <p className="bg-blue-900 rounded-full text-center mb-4 w-32">{data.category}</p>
              <p className="font-thin ">{`Posted ~${dayjs(data.createdAt).fromNow()}`}</p>
            </div>
            {isSignedIn && user.id != data.sellerId &&
              <button className="bg-blue-800 hover:bg-blue-500 rounded-lg py-4" onClick={placeOrder} >Place order</button>
            }
          </div>
        </div>
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