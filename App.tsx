import React, { useState } from 'react';
import { FarmProvider, useFarm } from './context/FarmContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DashboardView } from './components/DashboardView';
import { FlockView } from './components/FlockView';
import { SheepProfileView } from './components/SheepProfileView';
import { RationView } from './components/RationView';
import { HealthView } from './components/HealthView';
import { WarehouseView } from './components/WarehouseView';
import { ShepherdsView } from './components/ShepherdsView';
import { FinanceView } from './components/FinanceView';
import { SettingsView } from './components/SettingsView';
import { LoginModal } from './components/LoginModal';
import { QuickAddModal } from './components/QuickAddModal';
import { BirthModal } from './components/BirthModal';
import { QuickActionsModal } from './components/QuickActionsModal';
import { ActivitiesView } from './components/ActivitiesView';
import { PWAInstallModal } from './components/PWAInstallModal';
import { OfflineSyncBanner } from './components/OfflineSyncBanner';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedSheepId, setSelectedSheepId] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isBirthModalOpen, setIsBirthModalOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isPWAInstallModalOpen, setIsPWAInstallModalOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'sheep' | 'tx' | 'health' | 'feed'>('sheep');

  const { farmProfile } = useFarm();

  const [navHistory, setNavHistory] = useState<string[]>(['dashboard']);

  const handleOpenQuickAdd = (type: 'sheep' | 'tx' | 'health' | 'feed' = 'sheep') => {
    setQuickAddType(type);
    setIsQuickAddOpen(true);
  };

  const handleSelectSheepForProfile = (sheepId: string) => {
    setSelectedSheepId(sheepId);
    setNavHistory((prev) => [...prev, 'sheep-profile']);
    setActiveTab('sheep-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToFlock = () => {
    setSelectedSheepId(null);
    setActiveTab('flock');
    setNavHistory((prev) => [...prev.filter((t) => t !== 'sheep-profile'), 'flock']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: string) => {
    setSelectedSheepId(null);
    setNavHistory((prev) => [...prev, tab]);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (activeTab === 'sheep-profile') {
      handleBackToFlock();
      return;
    }

    if (navHistory.length > 1) {
      const remaining = [...navHistory];
      remaining.pop();
      const prevTab = remaining[remaining.length - 1] || 'dashboard';
      setNavHistory(remaining);
      setSelectedSheepId(null);
      setActiveTab(prevTab === 'sheep-profile' ? 'flock' : prevTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (activeTab !== 'dashboard') {
      setSelectedSheepId(null);
      setActiveTab('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (typeof window !== 'undefined' && window.history.length > 1) {
        window.history.back();
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-900">
      {/* Top Bar adhering to Top Bar Contract */}
      <Navbar
        activeTab={activeTab === 'sheep-profile' ? 'flock' : activeTab === 'activities' ? 'dashboard' : activeTab}
        setActiveTab={handleTabChange}
        onGoBack={handleGoBack}
        onOpenQuickAdd={() => handleOpenQuickAdd('sheep')}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenInstallModal={() => setIsPWAInstallModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-16 space-y-5">
        {/* Real-time Offline & Sync Indicator Banner */}
        <OfflineSyncBanner onOpenInstallModal={() => setIsPWAInstallModalOpen(true)} />

        {activeTab === 'dashboard' && (
          <DashboardView
            setActiveTab={handleTabChange}
            onOpenQuickAdd={handleOpenQuickAdd}
            onOpenBirthModal={() => setIsBirthModalOpen(true)}
            onSelectSheepForProfile={handleSelectSheepForProfile}
            onOpenAllActivities={() => handleTabChange('activities')}
            onOpenInstallModal={() => setIsPWAInstallModalOpen(true)}
          />
        )}

        {/* All Activities & Movement Search Page */}
        {activeTab === 'activities' && (
          <ActivitiesView
            onBackToDashboard={() => handleTabChange('dashboard')}
            onSelectSheepForProfile={handleSelectSheepForProfile}
          />
        )}

        {activeTab === 'flock' && (
          <FlockView
            onSelectSheepForProfile={handleSelectSheepForProfile}
            onOpenBirthModal={() => setIsBirthModalOpen(true)}
          />
        )}

        {/* Dedicated Full Page View for Animal Profile */}
        {activeTab === 'sheep-profile' && selectedSheepId && (
          <SheepProfileView
            sheepId={selectedSheepId}
            onBackToFlock={handleBackToFlock}
            onEditSheep={() => {
              // Switch to flock tab where user can edit or use quick action
              handleTabChange('flock');
            }}
            onSelectAnotherSheep={(anotherSheepId) => {
              setSelectedSheepId(anotherSheepId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAddHealth={() => {
              handleOpenQuickAdd('health');
            }}
          />
        )}

        {activeTab === 'ration' && <RationView />}
        {activeTab === 'health' && <HealthView />}
        {activeTab === 'warehouse' && <WarehouseView />}
        {activeTab === 'shepherds' && <ShepherdsView />}
        {activeTab === 'finance' && <FinanceView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Clean quiet footer */}
      <footer className="border-t border-stone-200 bg-white py-6 text-xs text-stone-500 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">{farmProfile.farmName}</span>
            <span>·</span>
            <span>Küçükbaş Sürü & Çiftlik Yönetim Sistemi</span>
            <span>·</span>
            <span>{farmProfile.city} / {farmProfile.district}</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Tescil: {farmProfile.registrationNo}</span>
            <span>·</span>
            <span>Tamamen Ücretsiz Yerel Veri Tabanı</span>
          </div>
        </div>
      </footer>

      {/* Touch-Friendly Mobile Fixed Bottom Tab Bar */}
      <MobileBottomNav
        activeTab={activeTab === 'sheep-profile' ? 'flock' : activeTab === 'activities' ? 'dashboard' : activeTab}
        setActiveTab={handleTabChange}
        onOpenMoreMenu={() => handleTabChange('settings')}
      />

      {/* Modals & Dialogs */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        defaultType={quickAddType}
        onNavigateTab={(tab) => {
          handleTabChange(tab);
          setIsQuickAddOpen(false);
        }}
      />

      <BirthModal
        isOpen={isBirthModalOpen}
        onClose={() => setIsBirthModalOpen(false)}
        onNavigateToFlock={() => handleTabChange('flock')}
      />

      {/* Universal Quick Actions Menu Modal */}
      <QuickActionsModal
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onNavigateTab={handleTabChange}
        onOpenAddSheep={() => handleOpenQuickAdd('sheep')}
        onOpenBirthModal={() => setIsBirthModalOpen(true)}
        onOpenAddHealth={() => handleOpenQuickAdd('health')}
        onOpenAddTx={() => handleOpenQuickAdd('tx')}
      />

      {/* Progressive Web App (PWA) Offline & Install Modal */}
      <PWAInstallModal
        isOpen={isPWAInstallModalOpen}
        onClose={() => setIsPWAInstallModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <FarmProvider>
      <MainApp />
    </FarmProvider>
  );
}
