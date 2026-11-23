export type Role = 'admin' | 'waiter' | 'kitchen'

export interface User {
  id: number
  name: string
  username: string
  role: Role
  is_active: boolean
  must_change_password: boolean
  created_at?: string
}

export interface Category {
  id: number
  name: string
  slug?: string
}

export type DishArtworkKind = 'bowl' | 'plate' | 'glass' | 'dessert'

export interface MenuItem {
  id: number
  category_id: number
  name: string
  description?: string
  price: number
  is_available: boolean
  is_popular?: boolean
  image?: string
  artwork?: DishArtworkKind
}

export type TableStatus = 'available' | 'occupied'

export interface DiningTable {
  id: number
  table_number: string
  capacity: number
  status: TableStatus
  active_order_id?: number | null
  active_order_ref?: string | null
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'paid'
export type PaymentMethod = 'cash' | 'gcash' | 'card'

export interface OrderItem {
  id?: number
  client_key?: string
  order_id?: number
  menu_item_id: number
  menu_item?: MenuItem
  name: string
  unit_price: number
  quantity: number
  notes?: string
  image?: string
  artwork?: DishArtworkKind
}

export interface Order {
  id: number
  order_ref: string
  table_id: number
  table?: DiningTable
  table_number: string
  user_id: number
  server_name: string
  status: OrderStatus
  payment_status?: PaymentStatus
  subtotal?: number
  service_charge?: number | null
  total: number
  payment_method?: PaymentMethod | null
  amount_paid?: number | null
  change_amount?: number | null
  cancellation_reason?: string | null
  cancelled_by?: number | null
  paid_at?: string | null
  created_at: string
  updated_at?: string
  items: OrderItem[]
}

export interface SalesReport {
  date: string
  total_revenue: number
  settled_orders_count: number
  average_ticket_value: number
  cancelled_orders_count: number
  revenue_by_method: {
    cash: number
    gcash: number
    card: number
  }
  top_selling_items: {
    item_id: number
    name: string
    quantity_sold: number
    revenue: number
  }[]
}
