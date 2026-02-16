'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AIProviderName } from '@/lib/ai/types';

const STORAGE_KEY = 'opencarbox.ai.settings';

type SettingsState = {
  provider: AIProviderName;
  model: string;
};

const DEFAULT_SETTINGS: SettingsState = {
  provider: 'mock',
  model: 'mock-small',
};

export function SettingsClient(): JSX.Element {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [result, setResult] = useState<string>('');

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      setSettings(JSON.parse(raw) as SettingsState);
    }
  }, []);

  const saveSettings = (event: FormEvent) => {
    event.preventDefault();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setResult('Settings saved locally.');
  };

  const runProviderTest = async () => {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: settings.provider,
        model: settings.model,
        message: 'Health check ping',
      }),
    });

    const payload = (await response.json()) as { response?: string; error?: string };
    setResult(payload.response ?? payload.error ?? 'No response');
  };

  return (
    <Card className="mx-auto mt-10 max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">AI Provider Settings</h1>
      <form className="space-y-4" onSubmit={saveSettings}>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Provider</span>
          <select
            className="w-full rounded-md border p-2"
            value={settings.provider}
            onChange={(event) =>
              setSettings((current) => ({ ...current, provider: event.target.value as AIProviderName }))
            }
          >
            <option value="mock">Mock</option>
            <option value="deepseek">DeepSeek</option>
            <option value="openai_compat">OpenAI Compatible</option>
          </select>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Model</span>
          <Input
            value={settings.model}
            onChange={(event) => setSettings((current) => ({ ...current, model: event.target.value }))}
          />
        </label>
        <div className="flex gap-3">
          <Button type="submit">Save</Button>
          <Button type="button" variant="secondary" onClick={runProviderTest}>
            Test Call
          </Button>
        </div>
      </form>
      {result ? <p className="rounded bg-muted p-3 text-sm">{result}</p> : null}
    </Card>
  );
}
