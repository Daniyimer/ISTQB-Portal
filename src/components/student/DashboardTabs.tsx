'use client';

import { useState } from 'react';

type Tab = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

export function DashboardTabs({ 
  tabs, 
  children 
}: { 
  tabs: Tab[]; 
  children: React.ReactNode[] 
}) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="space-y-6">
      <div className="flex overflow-x-auto pb-2 border-b border-border gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-3 px-1 border-b-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {children[tabs.findIndex(t => t.id === activeTab)]}
      </div>
    </div>
  );
}
