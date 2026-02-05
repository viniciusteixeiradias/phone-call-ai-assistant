import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import type { Order, OrderItem } from './types.js';
import { menu, findMenuItem, formatMenuForDisplay } from './menu.js';

const app = express();
app.use(express.json());

const orders = new Map<string, Order>();

interface ToolCall {
  id: string;
  function: {
    name: string;
    arguments: Record<string, unknown>;
  };
}

interface VapiWebhookMessage {
  type: string;
  toolCallList?: ToolCall[];
  call: {
    id: string;
    status?: string;
  };
}

function getOrCreateOrder(callId: string): Order {
  if (!orders.has(callId)) {
    orders.set(callId, { items: [], total: 0 });
  }
  return orders.get(callId)!;
}

function calculateTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function executeToolCall(callId: string, toolCall: ToolCall): string {
  const name = toolCall.function.name;
  const params = toolCall.function.arguments;

  switch (name) {
    case 'get_menu': {
      return JSON.stringify({
        menu: formatMenuForDisplay(),
        items: menu
      });
    }

    case 'add_to_order': {
      const itemName = params.item as string;
      const quantity = (params.quantity as number) || 1;
      const notes = params.notes as string | undefined;

      const menuItem = findMenuItem(itemName);
      if (!menuItem) {
        return JSON.stringify({
          success: false,
          message: `Sorry, I couldn't find "${itemName}" on our menu. Would you like me to read the menu options?`
        });
      }

      const order = getOrCreateOrder(callId);
      const orderItem: OrderItem = {
        menuItemId: menuItem.id,
        name: menuItem.name,
        quantity,
        price: menuItem.price,
        notes
      };

      order.items.push(orderItem);
      order.total = calculateTotal(order.items);

      return JSON.stringify({
        success: true,
        message: `Added ${quantity} ${menuItem.name} to your order.`,
        currentTotal: order.total.toFixed(2),
        itemCount: order.items.length
      });
    }

    case 'get_order_total': {
      const order = getOrCreateOrder(callId);

      if (order.items.length === 0) {
        return JSON.stringify({
          message: "You haven't added anything to your order yet.",
          items: [],
          total: '0.00'
        });
      }

      const summary = order.items
        .map(item => `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}${item.notes ? ` (${item.notes})` : ''}`)
        .join(', ');

      return JSON.stringify({
        summary,
        items: order.items,
        total: order.total.toFixed(2)
      });
    }

    case 'confirm_order': {
      const order = getOrCreateOrder(callId);
      const customerName = params.customer_name as string;
      const pickupTime = params.pickup_time as string | undefined;

      if (order.items.length === 0) {
        return JSON.stringify({
          success: false,
          message: "There's nothing in your order to confirm. Would you like to add something?"
        });
      }

      order.customerName = customerName;
      order.pickupTime = pickupTime || '20 minutes';

      const orderId = `ORD-${Date.now()}`;
      console.log(`Order confirmed: ${orderId}`, JSON.stringify(order, null, 2));

      orders.delete(callId);

      return JSON.stringify({
        success: true,
        orderId,
        customerName,
        pickupTime: order.pickupTime,
        total: order.total.toFixed(2),
        message: `Your order has been confirmed. Order number ${orderId}. Total is $${order.total.toFixed(2)}. It will be ready for pickup in ${order.pickupTime}.`
      });
    }

    default:
      return JSON.stringify({ error: `Unknown function: ${name}` });
  }
}

function handleToolCalls(message: VapiWebhookMessage, res: Response): void {
  const { toolCallList, call } = message;
  if (!toolCallList || toolCallList.length === 0) {
    res.status(400).json({ error: 'Missing tool calls' });
    return;
  }

  const results = toolCallList.map(toolCall => {
    console.log(`Executing tool: ${toolCall.function.name}`, toolCall.function.arguments);
    const result = executeToolCall(call.id, toolCall);
    return {
      toolCallId: toolCall.id,
      result
    };
  });

  res.json({ results });
}

app.post('/webhook/vapi', (req: Request, res: Response) => {
  const { message } = req.body as { message: VapiWebhookMessage };

  console.log(`Received: ${message.type}`);

  switch (message.type) {
    case 'tool-calls':
      handleToolCalls(message, res);
      return;

    case 'status-update':
      console.log(`Call ${message.call.id}: ${message.call.status}`);
      if (message.call.status === 'ended') {
        orders.delete(message.call.id);
      }
      break;

    case 'end-of-call-report':
      console.log(`Call ended: ${message.call.id}`);
      orders.delete(message.call.id);
      break;
  }

  res.status(200).json({ received: true });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Webhook endpoint: POST /webhook/vapi`);
});
