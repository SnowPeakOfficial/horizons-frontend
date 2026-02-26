import React from 'react';
import { Outlet } from 'react-router-dom';
import { ScrollToTop } from '../common/ScrollToTop';

export const RootLayout: React.FC = () => (
  <>
    <ScrollToTop />
    <Outlet />
  </>
);
