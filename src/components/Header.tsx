import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Menu, X } from "lucide-react";
// import { useAppSelector } from "@/store";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isLoggingOut: boolean;
  handleLogout: () => void;
}

export const Header = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  isLoggingOut,
  handleLogout,
}: HeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 sm:py-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg cursor-pointer">
              {/* <Scissors className="h-5 w-5 sm:h-6 sm:w-6 text-white" /> */}
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">TailorPro</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                Welcome, {user?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          <div className="hidden sm:flex items-center space-x-4">
            <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs sm:text-sm cursor-default">
              Professional Edition
            </Badge>
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center space-x-2 text-sm cursor-pointer"
              size="sm"
            >
              {isLoggingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  <span className="hidden lg:inline">Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:inline">Logout</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden border-t bg-white pb-3">
            <div className="pt-3 space-y-3">
              <p className="text-sm text-gray-600 px-1">Welcome, {user?.name}</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs cursor-default">
                  Professional Edition
                </Badge>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  disabled={isLoggingOut}
                  className="flex items-center space-x-2 cursor-pointer"
                  size="sm"
                >
                  {isLoggingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};