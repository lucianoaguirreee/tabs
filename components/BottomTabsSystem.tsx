'use client';

import React, { useState } from 'react';
import { Home, Layout, BarChart3, Settings } from 'lucide-react';

export interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface BottomTabsSystemProps {
  tabs: TabConfig[];
}

export default function BottomTabsSystem({ tabs }: BottomTabsSystemProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className="flex flex-col h-screen w-full bg-zinc-50 dark:bg-zinc-950">
      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTabContent}
      </div>

      {/* Bottom Tabs Bar */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg">
        <div className="flex items-center justify-around px-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex flex-col items-center justify-center py-3 px-6 min-w-[100px] transition-all duration-200
                ${activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }
              `}
            >
              <div className={`
                transition-all duration-200
                ${activeTab === tab.id ? 'scale-110' : 'scale-100'}
              `}>
                {tab.icon}
              </div>
              <span className={`
                text-xs mt-1 font-medium
                ${activeTab === tab.id ? 'opacity-100' : 'opacity-70'}
              `}>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
