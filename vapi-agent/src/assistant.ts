import 'dotenv/config';
import { VapiClient } from '@vapi-ai/server-sdk';

const vapi = new VapiClient({ token: process.env.VAPI_API_KEY! });

const systemPrompt = `You are a friendly phone order assistant for a restaurant.

Your job is to:
1. Greet customers warmly
2. Help them browse the menu (use get_menu tool)
3. Take their order (use add_to_order tool for each item)
4. Confirm quantities and any special requests
5. Provide the total (use get_order_total tool)
6. Confirm the order with their name (use confirm_order tool)

Guidelines:
- Be concise - this is a phone call, not a text chat
- Speak naturally and conversationally
- Always repeat back items to confirm you heard correctly
- Ask about special dietary needs or allergies when relevant
- Suggest popular items if customers are unsure
- Always confirm the complete order before finalizing`;

async function createAssistant() {
  if (!process.env.VAPI_API_KEY) {
    console.error('Error: VAPI_API_KEY environment variable is required');
    process.exit(1);
  }

  if (!process.env.WEBHOOK_URL) {
    console.error('Error: WEBHOOK_URL environment variable is required');
    process.exit(1);
  }

  const assistant = await vapi.assistants.create({
    name: 'Restaurant Order Assistant',
    model: {
      provider: 'openai',
      model: 'gpt-4o',
      messages: [{
        role: 'system',
        content: systemPrompt
      }],
      tools: [
        {
          type: 'function',
          function: {
            name: 'get_menu',
            description: 'Get the restaurant menu with all available items and prices. Call this when the customer asks what\'s available or wants to hear the menu.',
            parameters: {
              type: 'object',
              properties: {}
            }
          }
        },
        {
          type: 'function',
          function: {
            name: 'add_to_order',
            description: 'Add an item to the customer\'s order. Use this each time the customer wants to order something.',
            parameters: {
              type: 'object',
              properties: {
                item: {
                  type: 'string',
                  description: 'The name of the menu item to add'
                },
                quantity: {
                  type: 'number',
                  description: 'How many of this item (default 1)'
                },
                notes: {
                  type: 'string',
                  description: 'Special instructions or modifications'
                }
              },
              required: ['item', 'quantity']
            }
          }
        },
        {
          type: 'function',
          function: {
            name: 'get_order_total',
            description: 'Get the current order summary showing all items and the total price. Use this when the customer asks for their total or wants to review their order.',
            parameters: {
              type: 'object',
              properties: {}
            }
          }
        },
        {
          type: 'function',
          function: {
            name: 'confirm_order',
            description: 'Finalize and confirm the order. Use this only after the customer has confirmed they\'re ready to place the order.',
            parameters: {
              type: 'object',
              properties: {
                customer_name: {
                  type: 'string',
                  description: 'The customer\'s name for the order'
                },
                pickup_time: {
                  type: 'string',
                  description: 'When the customer wants to pick up (optional)'
                }
              },
              required: ['customer_name']
            }
          }
        }
      ]
    },
    voice: {
      provider: '11labs',
      voiceId: 'cgSgspJ2msm6clMCkdW9'
    },
    firstMessage: "Thanks for calling! I'm here to help you place an order. Would you like to hear our menu, or do you already know what you'd like?",
    maxDurationSeconds: 300, // 5 minute limit
    endCallMessage: "I'm sorry, we've reached our time limit. Please call back to complete your order. Goodbye!",
    server: {
      url: process.env.WEBHOOK_URL!
    }
  });

  console.log('Assistant created successfully!');
  console.log(`Assistant ID: ${assistant.id}`);
  console.log(`\nAdd this to your .env file:`);
  console.log(`VAPI_ASSISTANT_ID=${assistant.id}`);

  return assistant;
}

createAssistant().catch(console.error);
