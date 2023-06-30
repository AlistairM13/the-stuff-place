import { createTRPCRouter } from "~/server/api/trpc";
import { productRouter } from "./routers/products";
import { orderRouter } from "./routers/orders";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  products: productRouter,
  orders: orderRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
