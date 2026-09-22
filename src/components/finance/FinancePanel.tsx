"use client";

import type { GameState } from "@/types/game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { monthlyExpenses, monthlyIncome } from "@/game/finance";

function netWorth(state: GameState): number {
  const cash = state.finances.cash + state.finances.bank;
  const properties = state.properties.reduce((sum, p) => sum + p.currentValue, 0);
  const vehicles = state.vehicles.reduce((sum, v) => sum + v.currentValue, 0);
  return cash + properties + vehicles;
}

const CATEGORY_LABELS: Record<string, string> = {
  salary: "Salary",
  creator: "Creator Income",
  rental: "Rental Income",
  side: "Side Income",
  rent: "Rent",
  food: "Food",
  transportation: "Transportation",
  fuel: "Fuel",
  insurance: "Insurance",
  maintenance: "Maintenance",
  gym: "Gym",
  entertainment: "Entertainment",
  property: "Property",
  other: "Other",
};

export function FinancePanel({ state }: { state: GameState }) {
  const income = monthlyIncome(state.finances);
  const expenses = monthlyExpenses(state.finances);
  const savings = income - expenses;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Finance</h1>
        <p className="mt-1 text-sm text-muted">Track every dirham in and out.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Card>
          <CardHeader><CardTitle>Cash</CardTitle></CardHeader>
          <CardContent><p className="text-xl font-semibold">{formatCurrency(state.finances.cash)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Bank</CardTitle></CardHeader>
          <CardContent><p className="text-xl font-semibold">{formatCurrency(state.finances.bank)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Income (30d)</CardTitle></CardHeader>
          <CardContent><p className="text-xl font-semibold text-success">{formatCurrency(income)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Expenses (30d)</CardTitle></CardHeader>
          <CardContent><p className="text-xl font-semibold text-danger">{formatCurrency(expenses)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Net Worth</CardTitle></CardHeader>
          <CardContent><p className="text-xl font-semibold">{formatCurrency(netWorth(state))}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Savings Rate (last 30 transactions)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-lg font-semibold ${savings >= 0 ? "text-success" : "text-danger"}`}>
            {formatCurrency(savings)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {state.finances.transactions.length === 0 && (
              <p className="py-4 text-sm text-muted">No transactions yet.</p>
            )}
            {state.finances.transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{t.description}</p>
                  <p className="text-xs text-muted">
                    {CATEGORY_LABELS[t.category] ?? t.category} · {formatDate(t.timestamp)}
                  </p>
                </div>
                <p className={`text-sm font-semibold ${t.type === "income" ? "text-success" : "text-danger"}`}>
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
