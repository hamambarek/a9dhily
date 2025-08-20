import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/lib/trpc/server'

export const transactionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        amount: z.number().positive(),
        currency: z.string().default('USD'),
        shippingAddress: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // This is a placeholder - actual implementation would include Stripe integration
      const transaction = await ctx.db.transaction.create({
        data: {
          ...input,
          buyerId: ctx.session.user.id,
          sellerId: '', // Would be fetched from product
          platformFee: input.amount * 0.05, // 5% platform fee
          status: 'PENDING',
        },
      })

      return transaction
    }),

  getMyTransactions: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { limit, cursor } = input

      const items = await ctx.db.transaction.findMany({
        take: limit + 1,
        where: {
          OR: [
            { buyerId: ctx.session.user.id },
            { sellerId: ctx.session.user.id },
          ],
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          product: true,
          buyer: {
            select: {
              id: true,
              name: true,
              country: true,
              city: true,
            },
          },
          seller: {
            select: {
              id: true,
              name: true,
              country: true,
              city: true,
            },
          },
        },
      })

      let nextCursor: typeof cursor | undefined = undefined
      if (items.length > limit) {
        const nextItem = items.pop()
        nextCursor = nextItem!.id
      }

      return {
        items,
        nextCursor,
      }
    }),
})
