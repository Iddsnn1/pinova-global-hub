import React, { useState } from 'react';
import { formatPiAmount } from '../../../utils/formatters';
import { Users, Search, ShieldCheck } from 'lucide-react';
import { Order } from '../../../types';

interface CustomersTabProps {
  orders: Order[];
}

export const CustomersTab: React.FC<CustomersTabProps> = ({ orders }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const customerMap = new Map<string, {
    username: string;
    orderCount: number;
    totalSpentPi: number;
    lastOrderDate: string;
  }>();

  orders.forEach((order) => {
    const username = order.buyerUsername?.trim();
    if (!username) return;

    const existing = customerMap.get(username);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpentPi += order.totalPi || 0;
      if (
        order.createdAt &&
        (!existing.lastOrderDate || new Date(order.createdAt) > new Date(existing.lastOrderDate))
      ) {
        existing.lastOrderDate = order.createdAt;
      }
    } else {
      customerMap.set(username, {
        username,
        orderCount: 1,
        totalSpentPi: order.totalPi || 0,
        lastOrderDate: order.createdAt || '',
      });
    }
  });

  const customers = Array.from(customerMap.values());
  const filteredCustomers = customers.filter((customer) =>
    customer.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="seller-customers-tab">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Customer Directory
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Customers identified from authorized orders with your store
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold">
            {customers.length} Customers
          </span>
        </div>
      </div>

      {customers.length > 0 && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search customers by Pioneer username..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
        </div>
      )}

      {filteredCustomers.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl py-16 px-6 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            {customers.length === 0 ? 'No customer history yet' : 'No matching customers found'}
          </h4>
          <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1.5">
            {customers.length === 0
              ? 'Customers who place authorized orders with your store will appear here with order history and Pi volume.'
              : 'Try clearing your search query.'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xs">
          <div className="overflow-x-auto -mx-5 md:mx-0 px-5 md:px-0">
            <table className="w-full text-left text-xs min-w-[550px]">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500">
                  <th className="font-semibold py-2">Customer</th>
                  <th className="font-semibold py-2">Status</th>
                  <th className="font-semibold py-2">Total Orders</th>
                  <th className="font-semibold py-2">Total Volume (π)</th>
                  <th className="font-semibold py-2">Last Purchase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.username} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                    <td className="py-3 font-semibold text-neutral-900 dark:text-neutral-100">
                      @{customer.username}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center gap-1 w-fit">
                        <ShieldCheck className="w-3 h-3" />
                        Order Customer
                      </span>
                    </td>
                    <td className="py-3 font-medium text-neutral-800 dark:text-neutral-200">
                      {customer.orderCount} order(s)
                    </td>
                    <td className="py-3 font-bold text-neutral-900 dark:text-neutral-100">
                      {formatPiAmount(customer.totalSpentPi, { minDecimals: 2 })} π
                    </td>
                    <td className="py-3 text-neutral-500 text-[11px]">
                      {customer.lastOrderDate
                        ? new Date(customer.lastOrderDate).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
