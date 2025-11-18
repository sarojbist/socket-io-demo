import { createContext, useContext, useState, type ReactNode } from "react";

type TSidebarContext = {
  isMobileSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<TSidebarContext | undefined>(undefined);

type SidebarProviderProps = {
  children: ReactNode;
};

// Provider component
export const SidebarContextProvider = ({ children }: SidebarProviderProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isMobileSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSidebarContext = (): TSidebarContext => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserContextProvider');
    }
    return context;
};
