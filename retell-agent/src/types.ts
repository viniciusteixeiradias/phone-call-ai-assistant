export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'drink' | 'dessert';
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  items: OrderItem[];
  customerName?: string;
  pickupTime?: string;
  total: number;
}

export interface RetellToolRequest {
  name: string;
  args: Record<string, unknown>;
  call: {
    call_id: string;
    agent_id: string;
    call_status: string;
    metadata?: Record<string, unknown>;
  };
}
