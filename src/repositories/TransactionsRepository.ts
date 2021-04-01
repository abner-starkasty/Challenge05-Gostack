import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionServiceDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions.reduce(
      (acc, transaction) =>
        transaction.type === 'income' ? acc + transaction.value : acc,
      0,
    );

    const outcome = this.transactions.reduce(
      (acc, transaction) =>
        transaction.type === 'outcome' ? acc + transaction.value : acc,
      0,
    );

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }

  public create({
    title,
    value,
    type,
  }: CreateTransactionServiceDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
