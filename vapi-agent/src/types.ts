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

export interface VapiMessage {
  type: 'function-call' | 'status-update' | 'transcript' | 'end-of-call-report';
  call: {
    id: string;
    status?: string;
  };
  functionCall?: {
    name: string;
    parameters: Record<string, unknown>;
  };
}
