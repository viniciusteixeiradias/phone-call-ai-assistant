import 'dotenv/config';
import Retell from 'retell-sdk';

const client = new Retell({
  apiKey: process.env.RETELL_API_KEY!,
});

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

async function createAgent() {
  if (!process.env.RETELL_API_KEY) {
    console.error('Error: RETELL_API_KEY environment variable is required');
    process.exit(1);
  }

  if (!process.env.WEBHOOK_URL) {
    console.error('Error: WEBHOOK_URL environment variable is required');
    process.exit(1);
  }

  const webhookUrl = process.env.WEBHOOK_URL;

  console.log('Creating Retell LLM configuration...');

  const llm = await client.llm.create({
    model: 'gpt-4.1-mini',
    begin_message: "Thanks for calling! I'm here to help you place an order. Would you like to hear our menu, or do you already know what you'd like?",
    general_prompt: systemPrompt,
    general_tools: [
      {
        type: 'custom',
        name: 'get_menu',
        description: "Get the restaurant menu with all available items and prices. Call this when the customer asks what's available or wants to hear the menu.",
        url: `${webhookUrl}/tools/get_menu`,
        speak_after_execution: true,
        parameters: {
          type: 'object',
          properties: {}
        }
      },
      {
        type: 'custom',
        name: 'add_to_order',
        description: "Add an item to the customer's order. Use this each time the customer wants to order something.",
        url: `${webhookUrl}/tools/add_to_order`,
        speak_after_execution: true,
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
      },
      {
        type: 'custom',
        name: 'get_order_total',
        description: "Get the current order summary showing all items and the total price. Use this when the customer asks for their total or wants to review their order.",
        url: `${webhookUrl}/tools/get_order_total`,
        speak_after_execution: true,
        parameters: {
          type: 'object',
          properties: {}
        }
      },
      {
        type: 'custom',
        name: 'confirm_order',
        description: "Finalize and confirm the order. Use this only after the customer has confirmed they're ready to place the order.",
        url: `${webhookUrl}/tools/confirm_order`,
        speak_after_execution: true,
        parameters: {
          type: 'object',
          properties: {
            customer_name: {
              type: 'string',
              description: "The customer's name for the order"
            },
            pickup_time: {
              type: 'string',
              description: 'When the customer wants to pick up (optional)'
            }
          },
          required: ['customer_name']
        }
      }
    ]
  });

  console.log(`LLM created with ID: ${llm.llm_id}`);

  console.log('Creating Retell Agent...');

  const agent = await client.agent.create({
    response_engine: {
      type: 'retell-llm',
      llm_id: llm.llm_id
    },
    agent_name: 'Restaurant Order Assistant',
    voice_id: '11labs-Adrian',
    language: 'en-US',
    max_call_duration_ms: 300000,
    end_call_after_silence_ms: 30000,
    enable_backchannel: true,
    backchannel_frequency: 0.8,
    backchannel_words: ['yeah', 'uh-huh', 'okay', 'got it']
  });

  console.log('\nAgent created successfully!');
  console.log(`Agent ID: ${agent.agent_id}`);
  console.log(`LLM ID: ${llm.llm_id}`);
  console.log(`\nAdd these to your .env file:`);
  console.log(`RETELL_AGENT_ID=${agent.agent_id}`);
  console.log(`RETELL_LLM_ID=${llm.llm_id}`);

  return { agent, llm };
}

createAgent().catch(console.error);
