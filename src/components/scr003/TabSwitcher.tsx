'use client';

import { useState, type ReactNode } from 'react';

/**
 * Flight / Hotel / Mate Tab Switcher Shell
 * UI structure only — no REQ-FUNC tied directly to this Task.
 *
 * All three tab panels stay mounted at all times; switching tabs only
 * toggles the `hidden` attribute. This is what keeps each tab's input,
 * validation, and completion state fully independent — a form error or
 * partially-filled field in one tab is never affected by visiting another
 * tab, since nothing unmounts.
 */

export type TabId = 'flight' | 'hotel' | 'mate';

const TABS: { id: TabId; label: string }[] = [
  { id: 'flight', label: '항공편' },
  { id: 'hotel', label: '숙소' },
  { id: 'mate', label: '동행 구하기' },
];

export interface TabSwitcherProps {
  flightPanel: ReactNode;
  hotelPanel: ReactNode;
  matePanel: ReactNode;
  defaultTab?: TabId;
}

export function TabSwitcher({ flightPanel, hotelPanel, matePanel, defaultTab = 'flight' }: TabSwitcherProps) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  return (
    <div>
      <div role="tablist" aria-label="여행 준비 탭" className="flex gap-xs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-pill${activeTab === tab.id ? ' active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-lg">
        <div id="tabpanel-flight" role="tabpanel" aria-labelledby="tab-flight" hidden={activeTab !== 'flight'}>
          {flightPanel}
        </div>
        <div id="tabpanel-hotel" role="tabpanel" aria-labelledby="tab-hotel" hidden={activeTab !== 'hotel'}>
          {hotelPanel}
        </div>
        <div id="tabpanel-mate" role="tabpanel" aria-labelledby="tab-mate" hidden={activeTab !== 'mate'}>
          {matePanel}
        </div>
      </div>
    </div>
  );
}
