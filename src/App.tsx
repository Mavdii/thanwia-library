import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AmbientBackground } from '@/components/layout/AmbientBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Toast } from '@/components/ui/Toast';

// Public Pages
import { Home } from '@/pages/public/Home';
import { SectionPage } from '@/pages/public/SectionPage';
import { SubjectBooks } from '@/pages/public/SubjectBooks';
import { BookPage } from '@/pages/public/BookPage';
import { SearchResults } from '@/pages/public/SearchResults';
import { RequestBook } from '@/pages/public/RequestBook';
import { NotFound } from '@/pages/public/NotFound';

// Admin Pages
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { Dashboard } from '@/pages/admin/Dashboard';
import { AddBook } from '@/pages/admin/AddBook';
import { EditBook } from '@/pages/admin/EditBook';
import { ManageBooks } from '@/pages/admin/ManageBooks';
import { ManageSubjects } from '@/pages/admin/ManageSubjects';
import { BookRequests } from '@/pages/admin/BookRequests';
import { DatabaseManager } from '@/pages/admin/DatabaseManager';

// Public Layout
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AmbientBackground />
      <Navbar />
      <main className="relative z-10">
        {children}
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Toast />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          <Route
            path="/thanawya-amma"
            element={
              <PublicLayout>
                <SectionPage />
              </PublicLayout>
            }
          />
          <Route
            path="/thanawya-azhar"
            element={
              <PublicLayout>
                <SectionPage />
              </PublicLayout>
            }
          />
          <Route
            path="/:sectionSlug/:subjectSlug"
            element={
              <PublicLayout>
                <SubjectBooks />
              </PublicLayout>
            }
          />
          <Route
            path="/books/:sectionSlug/:subjectSlug/:bookSlug"
            element={
              <PublicLayout>
                <BookPage />
              </PublicLayout>
            }
          />
          <Route
            path="/search"
            element={
              <PublicLayout>
                <SearchResults />
              </PublicLayout>
            }
          />
          <Route
            path="/request"
            element={
              <PublicLayout>
                <RequestBook />
              </PublicLayout>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/books"
            element={
              <AdminLayout>
                <ManageBooks />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/books/add"
            element={
              <AdminLayout>
                <AddBook />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/books/edit/:bookId"
            element={
              <AdminLayout>
                <EditBook />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/subjects"
            element={
              <AdminLayout>
                <ManageSubjects />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/database"
            element={
              <AdminLayout>
                <DatabaseManager />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/requests"
            element={
              <AdminLayout>
                <BookRequests />
              </AdminLayout>
            }
          />

          {/* Redirects */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* 404 */}
          <Route
            path="*"
            element={
              <PublicLayout>
                <NotFound />
              </PublicLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
