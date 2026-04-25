import { Router, Request, Response } from 'express';
import { getReferralByToken, bookAppointment } from '../services/patient.service';

const router = Router();

router.get('/:token', async (req: Request, res: Response) => {
  const { token } = req.params;

  const referral = await getReferralByToken(token);
  res.status(200).json(referral);
});

router.post('/:token/appointments', async (req: Request, res: Response) => {
  const { token } = req.params;
  const { preferred_date, time_slot, notes } = req.body;

  if (!preferred_date || !time_slot) {
    res.status(400).json({ error: 'preferred_date and time_slot are required' });
    return;
  }

  const appointment = await bookAppointment(token, { preferred_date, time_slot, notes });
  res.status(201).json(appointment);
});

export default router;
