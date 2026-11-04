'use client';

import { createContext, useContext } from 'react';

// Portalled dialogs retain this context, keeping system presentation scoped.
const SystemExperienceContext = createContext(false);
const useSystemExperience = () => useContext(SystemExperienceContext);

export { SystemExperienceContext, useSystemExperience };
