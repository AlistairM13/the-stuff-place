import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { api } from "~/utils/api";
import type { GetStaticProps, NextPage } from "next";
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";

const SingleProductPage: NextPage<{ id: string }> = ({ id }) => {

  const { isSignedIn } = useUser()
  const { data, isLoading } = api.products.getProductById.useQuery(id)
  if (isLoading) return <div>Loading</div>
  if (!data) return <div>404</div>
  return (
    <>
      <header className="flex justify-between py-10 px-20">
        <Link href="/">The Stuff Store</Link>
        <nav className="flex gap-4">
          <Link href="/sell">Sell Product</Link>
          <Link href="/products">My Products</Link>
          {!isSignedIn && <SignInButton />}
          {isSignedIn && <SignOutButton />}
        </nav>
      </header>
      <main className="flex flex-col items-center px-20 py-10">
        <div className="flex flex-col w-1/2">
          <h1>{data.name}</h1>
          <p>{data.description}</p>
          <p>{data.price}</p>
          <p>{data.category}</p>
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