export interface TelnyxWebhookPayload {
  call_control_id: string;
  call_leg_id: string;
  call_session_id: string;
  connection_id: string;
  from: string;
  to: string;
  direction: 'incoming' | 'outgoing';
  state: string;
  client_state?: string;
  message_history?: Array<{
    role: 'assistant' | 'user';
    content: string;
  }>;
}

export interface TelnyxWebhookEvent {
  data: {
    event_type: string;
    id: string;
    occurred_at: string;
    payload: TelnyxWebhookPayload;
    record_type: string;
  };
}
