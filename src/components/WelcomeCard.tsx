import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface WelcomeCardProps {
  setActiveTab: (tab: string) => void;
  isCreating: boolean;
}

export const WelcomeCard = (
    { setActiveTab, isCreating }: WelcomeCardProps

) => {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-xl">Welcome to TailorPro</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6">
        <p className="text-gray-600 text-sm sm:text-base">
          Professional tailoring management system to help you manage your customers, orders, and measurements efficiently.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button 
            onClick={() => setActiveTab("new-customer")}
            className="bg-blue-600 hover:bg-blue-700 h-11 flex-1 sm:flex-initial cursor-pointer"
            disabled={isCreating}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            {isCreating ? 'Creating...' : 'Create New Order'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setActiveTab("customers")}
            className="h-11 flex-1 sm:flex-initial cursor-pointer"
          >
            View All Customers
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};