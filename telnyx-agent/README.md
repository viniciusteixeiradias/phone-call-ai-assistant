# Telnyx Restaurant Order Agent

AI phone agent for taking restaurant orders using Telnyx Voice AI.

## Setup

1. Create account at [telnyx.com](https://telnyx.com)
2. Buy a phone number (~$1-2/month)
3. Create a "Call Control Application":
   - Go to Voice → Call Control → Applications
   - Create new application
   - Set webhook URL to your ngrok URL + `/webhooks/call`
4. Assign your phone number to the application
5. Get your API key from API Keys section
6. Configure environment:
   ```bash
   cp .env.example .env
   # Add your TELNYX_API_KEY
   ```
7. Install dependencies: `npm install`
8. Start server: `npm run dev`
9. Expose with ngrok: `ngrok http 3002`
10. Update your Call Control Application webhook URL
11. Call your Telnyx phone number!

## How It Works

Unlike Vapi/Retell which are "AI-agent-first" platforms, Telnyx is **telephony-first**:

```
Customer calls your Telnyx number
         ↓
Telnyx sends webhook: call.initiated
         ↓
Your server: answer the call
         ↓
Telnyx sends webhook: call.answered
         ↓
Your server: start AI assistant
         ↓
AI handles the conversation (menu in prompt)
         ↓
Telnyx sends webhook: call.ai_gather.ended
         ↓
Telnyx sends webhook: call.hangup
```

## Architecture Difference

| Aspect | Vapi/Retell | Telnyx |
|--------|-------------|--------|
| Approach | AI-agent first | Telephony first |
| Phone numbers | Platform-managed | You own them |
| Call control | Limited | Full lifecycle control |
| Function calling | Built-in webhooks | Prompt engineering |

## Cost Comparison

| Platform | Cost/min | 50 calls/day × 5 min |
|----------|----------|----------------------|
| Vapi (optimized) | $0.08-0.12 | $600-900/mo |
| Retell (optimized) | $0.09-0.15 | $675-1,125/mo |
| **Telnyx** | **$0.06-0.09** | **$450-675/mo** |

**Telnyx saves ~25-30%** with bundled pricing (STT + TTS + LLM + telephony).

## Project Structure

```
telnyx-agent/
├── package.json
├── tsconfig.json
├── .env.example
└── src/
    ├── index.ts      # Express server + webhook handlers
    └── types.ts      # Telnyx webhook types
```

## Running All Three Agents

```bash
# Terminal 1 - Vapi (port 3000)
cd ../vapi-agent && npm run dev

# Terminal 2 - Retell (port 3001)
cd ../retell-agent && npm run dev

# Terminal 3 - Telnyx (port 3002)
cd ../telnyx-agent && npm run dev
```

## Environment Variables

```
TELNYX_API_KEY=your_api_key
PORT=3002
```
