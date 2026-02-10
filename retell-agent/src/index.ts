import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import type { Order, OrderItem, RetellToolRequest } from './types.js';
import { menu, findMenuItem, formatMenuForDisplay } from './menu.js';

const app = express();
app.use(express.json());

const orders = new Map<string, Order>();

function getOrCreateOrder(callId: string): Order {
  if (!orders.has(callId)) {
    orders.set(callId, { items: [], total: 0 });
  }
  return orders.get(callId)!;
}

function calculateTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

app.post('/webhook/inbound', (req: Request, res: Response) => {
  const { call_inbound } = req.body;
  console.log(`Inbound call from ${call_inbound.from_number} to ${call_inbound.to_number}`);

  res.json({
    call_inbound: {
      dynamic_variables: {
        restaurant_name: 'FoodInn',
        website_url: 'foodinn.ie/menu'
      }
    }
  });
});

app.post('/tools/get_restaurant_name', (_req: Request, res: Response) => {
  // res.json({ result: 'FoodInn' });
  // res.json({ result: 'Chef Kebab' });
  res.json({ result: 'Brugo Pizza and Kebab' });
});

app.post('/tools/get_website_url', (_req: Request, res: Response) => {
  // res.json({ result: 'foodinn.ie' });
  // res.json({ result: 'chefkebabkinnegad.ie' });
  res.json({ result: 'burgoopizza.ie' });
});

app.post('/tools/get_menu', (req: Request, res: Response) => {
  const body = req.body as RetellToolRequest;
  console.log(`[${body.call.call_id}] get_menu called`);

  res.json({
    menu: formatMenuForDisplay(),
    items: menu
  });
});

app.post('/tools/add_to_order', (req: Request, res: Response) => {
  const body = req.body as RetellToolRequest;
  const { args, call } = body;
  console.log(`[${call.call_id}] add_to_order called:`, args);

  const itemName = args.item as string;
  const quantity = (args.quantity as number) || 1;
  const notes = args.notes as string | undefined;

  if (quantity > 10) {
    console.warn(`[${call.call_id}] ALERT: Large quantity requested - ${quantity}x "${itemName}"`);
  }

  const menuItem = findMenuItem(itemName);
  if (!menuItem) {
    res.json({
      success: false,
      message: `Sorry, I couldn't find "${itemName}" on our menu. Would you like me to read the menu options?`
    });
    return;
  }

  const order = getOrCreateOrder(call.call_id);
  const orderItem: OrderItem = {
    menuItemId: menuItem.id,
    name: menuItem.name,
    quantity,
    price: menuItem.price,
    notes
  };

  order.items.push(orderItem);
  order.total = calculateTotal(order.items);

  res.json({
    success: true,
    message: `Added ${quantity} ${menuItem.name} to your order.`,
    currentTotal: order.total.toFixed(2),
    itemCount: order.items.length
  });
});

app.post('/tools/get_order_total', (req: Request, res: Response) => {
  const body = req.body as RetellToolRequest;
  const { call } = body;
  console.log(`[${call.call_id}] get_order_total called`);

  const order = getOrCreateOrder(call.call_id);

  if (order.items.length === 0) {
    res.json({
      message: "You haven't added anything to your order yet.",
      items: [],
      total: '0.00'
    });
    return;
  }

  const summary = order.items
    .map(item => `${item.quantity}x ${item.name} - €${(item.price * item.quantity).toFixed(2)}${item.notes ? ` (${item.notes})` : ''}`)
    .join(', ');

  res.json({
    summary,
    items: order.items,
    total: order.total.toFixed(2)
  });
});

app.post('/tools/confirm_order', (req: Request, res: Response) => {
  const body = req.body as RetellToolRequest;
  const { args, call } = body;
  console.log(`[${call.call_id}] confirm_order called:`, args);

  const order = getOrCreateOrder(call.call_id);
  const customerName = args.customer_name as string;
  const orderType = args.order_type as string;
  const pickupTime = args.pickup_time as string | undefined;

  if (order.items.length === 0) {
    res.json({
      success: false,
      message: "There's nothing in your order to confirm. Would you like to add something?"
    });
    return;
  }

  order.customerName = customerName;
  order.orderType = orderType;
  order.pickupTime = pickupTime || '20 minutes';

  const orderId = `ORD-${Date.now()}`;
  console.log(`Order confirmed: ${orderId}`, JSON.stringify(order, null, 2));

  orders.delete(call.call_id);

  const isDelivery = orderType?.toLowerCase().includes('delivery');
  const estimatedTime = isDelivery ? '30-40 minutes' : '15-20 minutes';

  res.json({
    success: true,
    orderId,
    customerName,
    orderType,
    estimatedTime,
    total: order.total.toFixed(2),
    message: `Order confirmed for ${customerName}. Order number ${orderId}. Total is €${order.total.toFixed(2)}. Estimated time: ${estimatedTime} for ${orderType}.`
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Retell agent server running on port ${PORT}`);
  console.log(`Tool endpoints:`);
  console.log(`  POST /tools/get_restaurant_name`);
  console.log(`  POST /tools/get_website_url`);
  console.log(`  POST /tools/get_menu`);
  console.log(`  POST /tools/add_to_order`);
  console.log(`  POST /tools/get_order_total`);
  console.log(`  POST /tools/confirm_order`);
});
