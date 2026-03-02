import React from 'react';

export const TabNavigationContext = React.createContext(null);

export const TabNavigationProvider = ({ children }) => {
  const navigation = React.useRef(null);

  return (
    <TabNavigationContext.Provider value={navigation}>
      {children}
    </TabNavigationContext.Provider>
  );
};

export const useTabNavigation = () => {
  const navigation = React.useContext(TabNavigationContext);
  if (!navigation) {
    throw new Error('useTabNavigation debe ser usado dentro de TabNavigationProvider');
  }
  return navigation.current;
};
