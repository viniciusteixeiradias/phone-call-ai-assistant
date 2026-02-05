import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import Telnyx from 'telnyx';
import type { TelnyxWebhookEvent } from './types.js';

const client = new Telnyx({
  apiKey: process.env.TELNYX_API_KEY!
});

const app = express();
app.use(express.json());

const systemPrompt = `You are a friendly phone order assistant for a restaurant called "The Local Kitchen".

MENU:
Appetizers:
- Spring Rolls: $8.99 - Crispy vegetable spring rolls with sweet chili sauce
- Chicken Wings: $12.99 - Crispy wings with buffalo or BBQ sauce

Main Courses:
- Classic Burger: $15.99 - Angus beef patty with lettuce, tomato, onion, and fries
- Grilled Salmon: $24.99 - Atlantic salmon with lemon butter sauce and vegetables
- Chicken Parmesan: $18.99 - Breaded chicken with marinara and mozzarella, served with pasta
- Caesar Salad: $12.99 - Romaine lettuce, parmesan, croutons. Add chicken for $5

Drinks:
- Soft Drink: $2.99 - Coke, Sprite, or Fanta
- Fresh Lemonade: $4.99 - House-made lemonade

Desserts:
- Chocolate Brownie: $7.99 - Warm brownie with vanilla ice cream
- Cheesecake: $8.99 - New York style with berry compote

INSTRUCTIONS:
1. Greet the customer warmly
2. Ask what they'd like to order
3. If they ask about the menu, briefly describe available items
4. For each item ordered, confirm it and keep a running total
5. When they're done ordering, summarize the complete order with the total
6. Ask for their name for the order
7. Confirm pickup will be ready in about 20 minutes
8. Thank them and say goodbye

GUIDELINES:
- Be concise - this is a phone call
- Speak naturally and conversationally
- Always confirm items to make sure you heard correctly
- If you're unsure about an item, ask for clarification
- Calculate totals accurately`;

app.post('/webhooks/call', async (req: Request, res: Response) => {
  const event = req.body as TelnyxWebhookEvent;
  const { data } = event;
  const eventType = data.event_type;
  const payload = data.payload;
  const callControlId = payload.call_control_id;

  console.log(`[${callControlId}] Event: ${eventType}`);

  try {
    switch (eventType) {
      case 'call.initiated': {
        if (payload.direction === 'incoming') {
          console.log(`[${callControlId}] Incoming call from ${payload.from}, answering...`);
          await client.calls.actions.answer(callControlId, {});
        }
        break;
      }

      case 'call.answered': {
        console.log(`[${callControlId}] Call answered, starting AI assistant...`);
        await client.calls.actions.startAIAssistant(callControlId, {
          assistant: {
            instructions: systemPrompt
          },
          voice: 'Telnyx.KokoroTTS.af_sarah',
          greeting: "Thanks for calling The Local Kitchen! I can help you place an order. What would you like today?",
          interruption_settings: {
            enable: true
          },
          transcription: {
            model: 'distil-whisper/distil-large-v2'
          }
        });
        break;
      }

      case 'call.ai_gather.ended': {
        console.log(`[${callControlId}] AI conversation ended`);
        if (payload.message_history) {
          console.log('Conversation transcript:');
          payload.message_history.forEach((msg, i) => {
            console.log(`  ${i + 1}. [${msg.role}]: ${msg.content}`);
          });
        }
        break;
      }

      case 'call.hangup': {
        console.log(`[${callControlId}] Call ended`);
        break;
      }

      default: {
        console.log(`[${callControlId}] Unhandled event: ${eventType}`);
      }
    }
  } catch (error) {
    console.error(`[${callControlId}] Error handling ${eventType}:`, error);
  }

  res.sendStatus(200);
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Telnyx agent server running on port ${PORT}`);
  console.log(`Webhook endpoint: POST /webhooks/call`);
});
