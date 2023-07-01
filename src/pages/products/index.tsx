import { useUser } from "@clerk/nextjs";
import Product from "~/components/Product";
import SignInComponent from "~/components/SignInComponent";
import { api } from "~/utils/api";

export default function MyProducts() {
    const { isSignedIn } = useUser()

    if (!isSignedIn) return (
        <SignInComponent isSignedIn={false} />
    )

    const { data } = api.products.getUserProducts.useQuery()
    if (!data) return <div>404</div>

    return (
        <>
            <SignInComponent isSignedIn />
            <main className="flex flex-col px-20 py-10">
                {isSignedIn && <div className='flex flex-wrap gap-4'>
                    {data.map(product =>
                        <Product key={product.id} product={product} />
                    )}
                </div>}
            </main>
        </>
    );
}
