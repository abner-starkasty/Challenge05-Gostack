/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, Request, Response, NextFunction } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

function typeIsAllowed(
  request: Request,
  response: Response,
  next: NextFunction,
): Response | void {
  const { type } = request.body;

  const typesAllowed = ['income', 'outcome'];

  if (!typesAllowed.includes(type)) {
    return response
      .status(400)
      .json({ error: 'Only is allowed type income or outcome!' });
  }

  return next();
}

transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();
    const balance = transactionsRepository.getBalance();

    return response.json({ transactions, balance });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', typeIsAllowed, (request, response) => {
  try {
    const { title, value, type } = request.body;

    const balance = transactionsRepository.getBalance();
    const haveEnoughMoney = balance.total >= value;

    if (type === 'outcome' && !haveEnoughMoney) {
      return response
        .status(400)
        .json({ error: "You don't have enough money to pay this bill!" });
    }

    const transactionService = new CreateTransactionService(
      transactionsRepository,
    );

    const transaction = transactionService.execute({ title, value, type });

    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
