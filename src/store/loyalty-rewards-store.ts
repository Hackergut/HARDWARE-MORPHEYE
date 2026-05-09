import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface LoyaltyReward {
  id: string
  name: string
  description: string
  pointsCost: number
  type: 'discount' | 'product' | 'shipping'
  value: string
  active: boolean
  image: string | null
}

interface LoyaltyRewardsState {
  rewards: LoyaltyReward[]
  addReward: (reward: Omit<LoyaltyReward, 'id'>) => void
  updateReward: (id: string, data: Partial<LoyaltyReward>) => void
  deleteReward: (id: string) => void
  toggleActive: (id: string) => void
  getReward: (id: string) => LoyaltyReward | undefined
}

export const useLoyaltyRewardsStore = create<LoyaltyRewardsState>()(
  persist(
    (set, get) => ({
      rewards: [],
      addReward: (reward) => {
        const id = crypto.randomUUID()
        set({ rewards: [...get().rewards, { ...reward, id }] })
      },
      updateReward: (id, data) => {
        set({
          rewards: get().rewards.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        })
      },
      deleteReward: (id) => {
        set({ rewards: get().rewards.filter((r) => r.id !== id) })
      },
      toggleActive: (id) => {
        set({
          rewards: get().rewards.map((r) =>
            r.id === id ? { ...r, active: !r.active } : r
          ),
        })
      },
      getReward: (id) => get().rewards.find((r) => r.id === id),
    }),
    {
      name: 'morpheye-loyalty-rewards',
    }
  )
)
