---
trigger: model_decision
description: Rules for creating queue-based async processing with PGMQ
---

# Queue System

## Creating a New Queue

### 1. SQL Schema (`supabase/schemas/XXX-my-feature.sql`)

```sql
-- Create queue
SELECT pgmq.create('my_feature_queue');

-- Processor function
CREATE OR REPLACE FUNCTION private.process_my_feature_queue()
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
    queue_result RECORD;
    message_id BIGINT;
    payload JSONB;
    effective_read_ct INTEGER;
BEGIN
    FOR queue_result IN SELECT * FROM pgmq.read('my_feature_queue', 30, 10)
    LOOP
        message_id := queue_result.msg_id;
        payload := queue_result.message;
        effective_read_ct := COALESCE((payload->>'_read_ct')::int, queue_result.read_ct);

        PERFORM private.invoke_edge_function('my-edge-function',
            payload || jsonb_build_object(
                '_queue_name', 'my_feature_queue',
                '_message_id', message_id,
                '_read_ct', effective_read_ct
            )
        );
    END LOOP;
END;
$$;

-- Cron job (every 10 seconds)
SELECT cron.schedule('process-my-feature-queue', '*/10 * * * * *',
    $$SELECT private.process_my_feature_queue()$$);
```

### 2. Edge Function (`supabase/functions/my-edge-function/index.ts`)

```typescript
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { reportError, archiveMessage, QueueMetadata } from '../_shared/queue-handler.ts';

interface MyRequest extends QueueMetadata {
  data: string;
}

Deno.serve(async (req: Request) => {
  let body: MyRequest | null = null;
  try {
    body = await req.json(); // Parse FIRST to capture queue metadata

    // ... your logic ...

    if (body._queue_name) await archiveMessage(body);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    if (body?._queue_name) {
      await reportError(body, error instanceof Error ? error.message : 'Unknown');
    }
    return new Response('Error', { status: 500 });
  }
});
```

### 3. Enqueue (trigger or helper)

```sql
-- Trigger on INSERT
CREATE OR REPLACE FUNCTION public.handle_new_my_record()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM pgmq.send('my_feature_queue', jsonb_build_object('id', NEW.id), 0);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_my_record_created
  AFTER INSERT ON public.my_table FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_my_record();
```

## Key Rules

- Parse `body` early so queue metadata is available in catch block
- Always include `_queue_name`, `_message_id`, `_read_ct` when invoking edge function
- Edge functions call `archiveMessage()` on success, `reportError()` on failure
- Max 3 retries, then message goes to DLQ (`private.dead_letter_queue`)
