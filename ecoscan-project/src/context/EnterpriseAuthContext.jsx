import React, { createContext, useState, useContext } from 'react'; 

const EnterpriseAuthContext = createContext(null);

export function EnterpriseAuthProvider({ children }) {
  const [enterprise, setEnterprise] = useState(null);

  const loginEnterprise = (enterpriseData) => {
    setEnterprise(enterpriseData);
  };

  const logoutEnterprise = () => {
    setEnterprise(null);
  };

  return (
    <EnterpriseAuthContext.Provider value={{ enterprise, loginEnterprise, logoutEnterprise }}>
      {children}
    </EnterpriseAuthContext.Provider>
  );
}

export function useEnterpriseAuth() {
  return useContext(EnterpriseAuthContext);
}