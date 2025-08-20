import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/lib/trpc/server'

export const escrowRouter = createTRPCRouter({
  getMyAccount: protectedProcedure
    .input(z.object({ currency: z.string().default('USD') }))
    .query(async ({ input, ctx }) => {
      const account = await ctx.db.escrowAccount.findUnique({
        where: {
          userId_currency: {
            userId: ctx.session.user.id,
            currency: input.currency,
          },
        },
      })

      if (!account) {
        // Create account if it doesn't exist
        return await ctx.db.escrowAccount.create({
          data: {
            userId: ctx.session.user.id,
            currency: input.currency,
            balance: 0,
          },
        })
      }

      return account
    }),

  getTransactions: protectedProcedure
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
          escrowAccountId: {
            not: null,
          },
          OR: [
            { buyerId: ctx.session.user.id },
            { sellerId: ctx.session.user.id },
          ],
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          product: true,
          escrowAccount: true,
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
