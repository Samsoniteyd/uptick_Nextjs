import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, X, Edit, Trash2 } from "lucide-react";
import { Customer, Requisition } from "@/types";

interface CustomerViewModalProps {
  viewingCustomers: Customer[];
  viewingRequisitions: Requisition[];
  closeViewModal: () => void;
  handleEditIndividualOrder: (orderId: string) => void;
  handleDeleteIndividualOrder: (orderId: string) => void;
}

export const CustomerViewModal = ({
  viewingCustomers,
  viewingRequisitions,
  closeViewModal,
  handleEditIndividualOrder,
  handleDeleteIndividualOrder,
}: CustomerViewModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-4xl lg:max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
            <Eye className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
            <span className="hidden sm:inline">Customer Details</span>
            <span className="sm:hidden">Details</span>
            {viewingCustomers.length > 1 && (
              <Badge className="ml-2 bg-blue-100 text-blue-800">
                {viewingCustomers.length} orders
              </Badge>
            )}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeViewModal}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          <div className="space-y-4 sm:grid sm:grid-cols-1 md:grid-cols-2 sm:gap-6 sm:space-y-0">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 border-b pb-2">
                Customer Information
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500">Name</label>
                  <p className="text-sm sm:text-base font-medium text-gray-900">{viewingCustomers[0].name}</p>
                </div>
                {viewingCustomers[0].email && (
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm sm:text-base text-gray-900 break-all">{viewingCustomers[0].email}</p>
                  </div>
                )}
                {viewingCustomers[0].phone && (
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-sm sm:text-base text-gray-900">{viewingCustomers[0].phone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 border-b pb-2">
              All Measurements ({viewingCustomers.length} {viewingCustomers.length === 1 ? 'order' : 'orders'})
            </h3>
            
            {viewingCustomers.map((customer, index) => (
              <Card key={customer.id} className="border-2 border-gray-200">
                <CardHeader className="bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-sm sm:text-base">
                        Order #{index + 1} - {new Date(customer.dateOfOrder).toLocaleDateString()}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge className={`text-xs ${
                          customer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          customer.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          customer.status === 'ready' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {customer.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                        {customer.dateOfCollection && (
                          <span className="text-xs text-gray-500">
                            Collection: {new Date(customer.dateOfCollection).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditIndividualOrder(customer.id)}
                        className="flex items-center space-x-1 h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="h-3 w-3" />
                        <span className="text-xs">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteIndividualOrder(customer.id)}
                        className="flex items-center space-x-1 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="text-xs">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* TOPS */}
                    <Card className="border">
                      <CardHeader className="pb-2 px-3">
                        <CardTitle className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
                          TOPS
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 px-3">
                        {Object.entries(customer.measurements.tops).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                            <span className="text-xs font-medium text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                            <span className="text-xs text-gray-900 font-medium">
                              {value || '0'}"
                            </span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="border">
                      <CardHeader className="pb-2 px-3">
                        <CardTitle className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
                          TROUSER/SKIRT
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 px-3">
                        {Object.entries(customer.measurements.trouser).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                            <span className="text-xs font-medium text-gray-600 capitalize">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </span>
                            <span className="text-xs text-gray-900 font-medium">
                              {value || '0'}"
                            </span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="border">
                      <CardHeader className="pb-2 px-3">
                        <CardTitle className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
                          AGBADA
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 px-3">
                        {Object.entries(customer.measurements.agbada).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                            <span className="text-xs font-medium text-gray-600 capitalize">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </span>
                            <span className="text-xs text-gray-900 font-medium">
                              {value || '0'}"
                            </span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  {customer.notes && (
                    <div className="mt-4 pt-3 border-t">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{customer.notes}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 pt-3 sm:pt-4 border-t">
            <Button
              variant="outline"
              onClick={closeViewModal}
              className="flex items-center justify-center space-x-2 h-10 sm:h-auto"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};