import { Request, Response } from 'express';
import User from '../models/User.js';

export const signInWithProvider = async (req: Request, res: Response) => {
  const { name, email, image } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, image });
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
};
