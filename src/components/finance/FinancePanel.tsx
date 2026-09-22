"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { GameState } from "@/types/game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { FadeInUp } from "@/components/ui/Motion";
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

  const summaryCards = [
    { label: "Cash", value: state.finances.cash },
    { label: "Bank", value: state.finances.bank },
    { label: "Income (30d)", value: income, tone: "text-success" },
    { label: "Expenses (30d)", value: expenses, tone: "text-danger" },
    { label: "Net Worth", value: netWorth(state) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Finance</h1>
        <p className="mt-1 text-sm text-muted">Track every dirham in and out.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {summaryCards.map((card, index) => (
          <FadeInUp key={card.label} index={index}>
            <Card>
              <CardHeader>
                <CardTitle>{card.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-xl font-semibold ${card.tone ?? ""}`}>
                  <AnimatedNumber value={card.value} format={(n) => formatCurrency(n)} />
                </p>
              </CardContent>
            </Card>
          </FadeInUp>
        ))}
      </div>

      <FadeInUp index={5}>
        <Card>
          <CardHeader>
            <CardTitle>Savings Rate (last 30 transactions)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-lg font-semibold ${savings >= 0 ? "text-success" : "text-danger"}`}>
              <AnimatedNumber value={savings} format={(n) => formatCurrency(n)} />
            </p>
          </CardContent>
        </Card>
      </FadeInUp>

      <FadeInUp index={6}>
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {state.finances.transactions.length === 0 && (
                <p className="py-4 text-sm text-muted">No transactions yet.</p>
              )}
              <AnimatePresence initial={false}>
                {state.finances.transactions.map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center justify-between py-3"
                  >
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
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </FadeInUp>
    </div>
  );
}
