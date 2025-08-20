import { createTRPCRouter } from '@/lib/trpc/server'
import { authRouter } from './routers/auth'
import { productRouter } from './routers/product'
import { transactionRouter } from './routers/transaction'
import { userRouter } from './routers/user'
import { messageRouter } from './routers/message'
import { escrowRouter } from './routers/escrow'

export const appRouter = createTRPCRouter({
  auth: authRouter,
  product: productRouter,
  transaction: transactionRouter,
  user: userRouter,
  message: messageRouter,
  escrow: escrowRouter,
})

export type AppRouter = typeof appRouter
