import type {
  FinanceState,
  GameState,
  GameTime,
  IncomeCategory,
  ExpenseCategory,
  Transaction,
} from "@/types/game";
import { generateId } from "@/lib/utils/id";

export function netWorth(state: GameState): number {
  const cash = state.finances.cash + state.finances.bank;
  const properties = state.properties.reduce((sum, p) => sum + p.currentValue, 0);
  const vehicles = state.vehicles.reduce((sum, v) => sum + v.currentValue, 0);
  return cash + properties + vehicles;
}

export function addIncome(
  finances: FinanceState,
  category: IncomeCategory,
  amount: number,
  timestamp: GameTime,
  description: string,
): FinanceState {
  const transaction: Transaction = {
    id: generateId("txn"),
    type: "income",
    category,
    amount,
    timestamp,
    description,
  };
  return {
    cash: finances.cash,
    bank: finances.bank + amount,
    transactions: [transaction, ...finances.transactions].slice(0, 200),
  };
}

export function addExpense(
  finances: FinanceState,
  category: ExpenseCategory,
  amount: number,
  timestamp: GameTime,
  description: string,
): FinanceState {
  const transaction: Transaction = {
    id: generateId("txn"),
    type: "expense",
    category,
    amount,
    timestamp,
    description,
  };
  return {
    cash: finances.cash,
    bank: finances.bank - amount,
    transactions: [transaction, ...finances.transactions].slice(0, 200),
  };
}

export function monthlyIncome(finances: FinanceState): number {
  return sumRecent(finances, "income");
}

export function monthlyExpenses(finances: FinanceState): number {
  return sumRecent(finances, "expense");
}

function sumRecent(finances: FinanceState, type: "income" | "expense"): number {
  return finances.transactions
    .filter((t) => t.type === type)
    .slice(0, 30)
    .reduce((sum, t) => sum + t.amount, 0);
}
