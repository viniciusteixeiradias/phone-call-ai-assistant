# Vapi Restaurant Order Agent

AI phone agent for taking restaurant orders using Vapi.ai.

## Project Structure

```
vapi-agent/
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript config
├── .env.example          # Environment template
├── .gitignore
└── src/
    ├── index.ts          # Express webhook server
    ├── assistant.ts      # Creates Vapi assistant
    ├── menu.ts           # Menu data & helpers
    └── types.ts          # TypeScript types
```

## Setup

1. Create Vapi account at https://vapi.ai and get your API key
2. Configure environment:
   ```bash
   cd vapi-agent
   cp .env.example .env
   # Edit .env with your VAPI_API_KEY
   ```
3. Install dependencies: `npm install`
4. Start the webhook server: `npm run dev`
5. Expose your server with ngrok: `ngrok http 3000`
6. Update `.env` with ngrok URL:
   ```
   WEBHOOK_URL=https://your-id.ngrok.io/webhook/vapi
   ```
7. Create the assistant: `npm run create-assistant`
8. Test via Vapi dashboard using the web call feature

## Features

- 4 function tools: `get_menu`, `add_to_order`, `get_order_total`, `confirm_order`
- In-memory order tracking per call
- Sample menu with appetizers, mains, drinks, desserts
- ElevenLabs voice integration

## Test Conversation

1. **Menu inquiry**: "What's on the menu?"
2. **Add items**: "I'd like a classic burger", "And a lemonade"
3. **Special requests**: "Can I get the burger with no onions?"
4. **Check total**: "What's my total?"
5. **Confirm order**: "That's everything" → (give your name)

---

## Cost Estimates

### Per-Minute Breakdown

| Component | Cost/min | Notes |
|-----------|----------|-------|
| **Vapi Platform** | $0.05 | Base hosting fee |
| **Transcription (STT)** | ~$0.01 | Deepgram default |
| **LLM (GPT-4o)** | ~$0.03-0.10 | Depends on conversation length |
| **Voice (TTS)** | ~$0.04 | ElevenLabs default |
| **Telephony** | ~$0.01 | Twilio/Vapi numbers |
| **Total** | **$0.14 - $0.21/min** | Typical restaurant order call |

### Monthly Cost Projections

**Default Stack** ($0.14 - $0.21/min):

| Daily Calls | Avg Duration | Minutes/Month | Monthly Cost |
|-------------|--------------|---------------|--------------|
| 20 calls | 5 min | 3,000 | **$420 - $630** |
| 50 calls | 5 min | 7,500 | **$1,050 - $1,575** |
| 100 calls | 5 min | 15,000 | **$2,100 - $3,150** |

**Optimized Stack** ($0.08 - $0.12/min):

| Daily Calls | Avg Duration | Minutes/Month | Monthly Cost |
|-------------|--------------|---------------|--------------|
| 20 calls | 5 min | 3,000 | **$240 - $360** |
| 50 calls | 5 min | 7,500 | **$600 - $900** |
| 100 calls | 5 min | 15,000 | **$1,200 - $1,800** |

**Savings with optimized stack: ~40-45%**

### Additional Costs

- Phone number: ~$2-5/month
- Extra concurrent lines: $10/line/month
- HIPAA compliance (if needed): $1,000/month add-on

### Free Credits

New Vapi accounts get **$10 in free credits** (~50-70 minutes of calls).

---

## Cost Optimization Strategies

### 1. Use Cheaper Providers (Within Vapi)

| Component | Default | Cheaper Alternative | Savings |
|-----------|---------|---------------------|---------|
| STT | Deepgram ($0.01) | OpenAI Whisper ($0.006) | ~40% |
| TTS | ElevenLabs ($0.04) | Azure ($0.011) or PlayHT | ~70% |
| LLM | GPT-4o ($0.03-0.10) | GPT-4o-mini or Claude Haiku | ~50-80% |

**Optimized stack could reduce costs to ~$0.08-0.12/min**

To change providers, update the assistant configuration:

```typescript
const assistant = await vapi.assistants.create({
  // Use cheaper transcriber
  transcriber: {
    provider: 'deepgram',
    model: 'nova-2',  // or try 'openai' with 'whisper'
  },
  // Use cheaper voice
  voice: {
    provider: 'azure',  // instead of '11labs'
    voiceId: 'en-US-JennyNeural'
  },
  // Use cheaper LLM
  model: {
    provider: 'openai',
    model: 'gpt-4o-mini',  // instead of 'gpt-4o'
    // ...
  }
});
```

### 2. Share One Assistant Across Multiple Restaurants

Use dynamic configuration via the `assistant-request` webhook:

```typescript
app.post('/webhook/vapi', (req, res) => {
  const { message } = req.body;

  // Dynamic assistant based on phone number called
  if (message.type === 'assistant-request') {
    const phoneNumber = message.call?.phoneNumber?.number;
    const restaurant = getRestaurantByPhone(phoneNumber);

    return res.json({
      assistant: {
        firstMessage: `Thanks for calling ${restaurant.name}!`,
        model: {
          provider: 'openai',
          model: 'gpt-4o-mini',
          messages: [{
            role: 'system',
            content: `You are an order assistant for ${restaurant.name}.
                      Menu: ${JSON.stringify(restaurant.menu)}`
          }]
        }
      }
    });
  }
  // ... handle other message types
});
```

This way:
- One server handles all restaurants
- Each restaurant gets its own phone number
- Menu and branding are loaded dynamically

### 3. Optimize Call Duration

- Keep assistant responses concise
- Use numbered menu options for faster ordering
- Set `maxDurationSeconds` on the assistant
- Confirm orders efficiently

### 4. Volume Pricing

- Agency plan ($500/mo) includes packed minutes
- Contact Vapi for enterprise rates at higher volumes

---

## Alternative Platforms

| Platform | Pricing Model | Notes |
|----------|---------------|-------|
| [Retell AI](https://www.retellai.com) | Per-minute | Claims lower latency |
| [Bland.ai](https://bland.ai) | Per-minute | Simpler API |
| [Deepgram](https://deepgram.com) | Component-based | Full pipeline control |

---

## Sources

- [Vapi Pricing Page](https://vapi.ai/pricing)
- [Vapi AI Pricing Guide 2025 - CallPod](https://www.callpod.ai/blog/vapi-pricing)
- [Vapi AI Plans & Pricing - CloudTalk](https://www.cloudtalk.io/blog/vapi-ai-pricing/)
- [Vapi Pricing Breakdown - Dograh](https://blog.dograh.com/vapi-pricing-breakdown-2025-plans-hidden-costs-what-to-expect/)
- [VAPI pricing - Telnyx](https://telnyx.com/resources/vapi-pricing)


## Future Enhancements
{
    maxDurationSeconds: 300,        // Max call length (5 min)
    silenceTimeoutSeconds: 30,      // Hang up after 30s of silence
    responseDelaySeconds: 0.5,      // How fast assistant responds
    endCallPhrases: ["goodbye", "bye", "that's all"],  // Trigger end call
}
