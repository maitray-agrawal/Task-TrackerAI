import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const AllTasks = lazy(() => import('../pages/AllTasks'));
const TaskDetails = lazy(() => import('../pages/TaskDetails'));
const NotFound = lazy(() => import('../pages/NotFound'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<AllTasks />} />
        <Route path="tasks/:id" element={<TaskDetails />} />
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
