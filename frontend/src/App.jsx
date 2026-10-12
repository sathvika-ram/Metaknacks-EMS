import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { API_CONFIGURED } from './utils/api';

const Login = lazy(() => import('./pages/Login'));
const CoordinatorDashboard = lazy(() => import('./pages/CoordinatorDashboard'));
const SuperAdminDashboard = lazy(() => import('./pages/SuperAdminDashboard'));
const LeaderDashboard = lazy(() => import('./pages/LeaderDashboard'));

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return children;
};

const NotFound = () => <div className="flex min-h-screen items-center justify-center p-6 text-center"><div><h1 className="text-3xl font-bold text-slate-900">Page not found</h1><p className="mt-2 text-sm text-slate-500">The requested page does not exist.</p><a className="mt-5 inline-block text-sm font-semibold text-teal-700" href="/">Return to workspace</a></div></div>;

const DefaultRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'super_admin') return <Navigate to="/admin/analytics" replace />;
  if (user.role === 'party_leader') return <Navigate to="/leader" replace />;
  if (user.role === 'constituency_coordinator') return <Navigate to="/coordinator" replace />;
  
  return <Navigate to="/login" replace />;
};

function App() {
  if (!API_CONFIGURED) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-900"><section className="max-w-lg rounded-lg border border-amber-300 bg-white p-6 shadow-sm"><h1 className="text-lg font-bold">Backend URL is not configured</h1><p className="mt-2 text-sm leading-6 text-slate-600">Set <code>VITE_API_BASE_URL</code> in this Vercel project to the Render backend URL, then redeploy.</p></section></main>;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading workspace...</div>}>
          <Routes>
            <Route path="/" element={<DefaultRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Navigate to="/admin/analytics" replace />} />
            <Route
              path="/coordinator/*"
              element={
                <ProtectedRoute allowedRoles={['constituency_coordinator']}>
                  <CoordinatorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leader/*"
              element={
                <ProtectedRoute allowedRoles={['party_leader']}>
                  <LeaderDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
