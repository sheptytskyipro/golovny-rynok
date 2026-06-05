import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export interface TelegramAuthRequest extends Request {
  telegramUser?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
  };
}

function validateTelegramInitData(initData: string, botToken: string): boolean {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) return false;

    // Remove hash from params
    params.delete('hash');

    // Sort params alphabetically and create data check string
    const sortedParams = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // HMAC-SHA256 with key = HMAC-SHA256("WebAppData", BOT_TOKEN)
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    const expectedHash = crypto
      .createHmac('sha256', secretKey)
      .update(sortedParams)
      .digest('hex');

    return expectedHash === hash;
  } catch {
    return false;
  }
}

export function telegramAuth(req: TelegramAuthRequest, res: Response, next: NextFunction): void {
  const initData = req.headers['x-telegram-init-data'] as string;
  const botToken = process.env.BOT_TOKEN;

  if (!botToken) {
    // In dev mode without bot token, skip validation
    if (process.env.NODE_ENV === 'development') {
      req.telegramUser = {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'test_user',
      };
      next();
      return;
    }
    res.status(500).json({ error: 'Server misconfigured' });
    return;
  }

  if (!initData) {
    res.status(401).json({ error: 'Missing Telegram init data' });
    return;
  }

  if (!validateTelegramInitData(initData, botToken)) {
    res.status(401).json({ error: 'Invalid Telegram auth' });
    return;
  }

  try {
    const params = new URLSearchParams(initData);
    const userParam = params.get('user');
    if (userParam) {
      req.telegramUser = JSON.parse(decodeURIComponent(userParam));
    }
  } catch {
    res.status(400).json({ error: 'Invalid user data' });
    return;
  }

  next();
}
