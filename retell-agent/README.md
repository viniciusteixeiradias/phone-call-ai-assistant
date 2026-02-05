# Retell AI Restaurant Order Agent

AI phone agent for taking restaurant orders using Retell AI.

## Setup

1. Create account at [retellai.com](https://retellai.com)
2. Get your API key from the dashboard
3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your RETELL_API_KEY
   ```
4. Install dependencies: `npm install`
5. Start the server: `npm run dev`
6. Expose with ngrok: `ngrok http 3001`
7. Update `WEBHOOK_URL` in `.env` with ngrok URL
8. Create the agent: `npm run create-agent`
9. Test via Retell dashboard

## Project Structure

```
retell-agent/
├── package.json
├── tsconfig.json
├── .env.example
└── src/
    ├── index.ts      # Express server with tool endpoints
    ├── agent.ts      # Creates Retell agent + LLM
    ├── menu.ts       # Menu data
    └── types.ts      # TypeScript types
```

## Tool Endpoints

Each tool has its own endpoint (Retell calls them directly):

| Endpoint | Tool | Description |
|----------|------|-------------|
| `POST /tools/get_menu` | get_menu | Returns restaurant menu |
| `POST /tools/add_to_order` | add_to_order | Adds item to order |
| `POST /tools/get_order_total` | get_order_total | Returns order summary |
| `POST /tools/confirm_order` | confirm_order | Finalizes order |

## Cost Comparison with Vapi

| Aspect | Vapi | Retell |
|--------|------|--------|
| Base platform | $0.05/min | $0.07/min |
| Total (optimized) | $0.08-0.12/min | $0.09-0.15/min |
| Max duration | `maxDurationSeconds` | `max_call_duration_ms` |
| Silence timeout | Via hooks | Built-in `end_call_after_silence_ms` |

## Running Both Agents

You can run Vapi and Retell agents simultaneously:

```bash
# Terminal 1 - Vapi (port 3000)
cd ../vapi-agent && npm run dev

# Terminal 2 - Retell (port 3001)
cd ../retell-agent && npm run dev

# Terminal 3 - ngrok for Vapi
ngrok http 3000

# Terminal 4 - ngrok for Retell
ngrok http 3001
```

## Environment Variables

```
RETELL_API_KEY=your_api_key
WEBHOOK_URL=https://your-ngrok-url.ngrok.io
PORT=3001
```

## More

Telnyx Agent Created

telnyx-agent/
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── README.md
└── src/
  ├── index.ts      # Express server (port 3002)
  └── types.ts      # Webhook types

Key Differences
┌───────────────┬─────────────────────────┬────────────────────┐
│               │       Vapi/Retell       │       Telnyx       │
├───────────────┼─────────────────────────┼────────────────────┤
│ Architecture  │ AI-agent first          │ Telephony first    │
├───────────────┼─────────────────────────┼────────────────────┤
│ Menu handling │ Webhooks to your server │ Menu in prompt     │
├───────────────┼─────────────────────────┼────────────────────┤
│ Phone numbers │ Platform provides       │ You buy & own them │
├───────────────┼─────────────────────────┼────────────────────┤
│ Pricing       │ $0.08-0.15/min          │ $0.06-0.09/min     │
└───────────────┴─────────────────────────┴────────────────────┘
To Get Started

1. Create account at https://telnyx.com
2. Buy a phone number (~$1-2/month)
3. Create a Call Control Application with webhook URL
4. Configure .env with your TELNYX_API_KEY
5. Run: npm run dev
6. Expose: ngrok http 3002
7. Update webhook URL in Telnyx dashboard
8. Call your phone number!

All Three Platforms Ready

# You now have:
vapi-agent/    # Port 3000 - $0.08-0.12/min
retell-agent/  # Port 3001 - $0.09-0.15/min
telnyx-agent/  # Port 3002 - $0.06-0.09/min (cheapest!)
