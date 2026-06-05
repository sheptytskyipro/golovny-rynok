import { Router } from 'express';
import { telegramAuth, TelegramAuthRequest } from '../middleware/telegramAuth.js';

const router = Router();

// POST /api/auth/telegram - authenticate via Telegram initData
router.post('/telegram', telegramAuth, (req: TelegramAuthRequest, res) => {
  const user = req.telegramUser;
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // In a real app, upsert user in DB here
  res.json({
    success: true,
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      photo_url: user.photo_url,
    },
  });
});

// GET /api/auth/me - get current user
router.get('/me', telegramAuth, (req: TelegramAuthRequest, res) => {
  res.json({ user: req.telegramUser });
});

export default router;
