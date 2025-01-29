import React, { createContext, useContext, useReducer } from 'react';

const ResourceContext = createContext(null);

const initialState = {
  resources: {},
  loading: false,
  error: null
};

function resourceReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_RESOURCES':
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.resourceType]: action.payload
        },
        loading: false,
        error: null
      };
    case 'CLEAR_RESOURCES':
      return initialState;
    default:
      return state;
  }
}

export function ResourceProvider({ children }) {
  const [state, dispatch] = useReducer(resourceReducer, initialState);

  return (
    <ResourceContext.Provider value={{ state, dispatch }}>
      {children}
    </ResourceContext.Provider>
  );
}

export function useResourceContext() {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error('useResourceContext must be used within a ResourceProvider');
  }
  return context;
} 