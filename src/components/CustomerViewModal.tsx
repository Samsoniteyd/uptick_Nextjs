import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, X, Edit, Trash2, Calendar, User, Phone, Mail, Ruler, Clipboard, ChevronDown, ChevronUp } from "lucide-react";
import { Customer, Requisition } from "@/types";
import { useState } from "react";

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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const customer = viewingCustomers[0];
  const requisition = viewingRequisitions[0];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-4xl lg:max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center">
            <Eye className="h-5 w-5 mr-3 text-blue-600" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Customer Details
              </h2>
              {viewingCustomers.length > 1 && (
                <p className="text-sm text-gray-500 mt-1">
                  {viewingCustomers.length} orders found
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeViewModal}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 sm:p-6 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-2" />
                  Name
                </div>
                <p className="font-medium text-gray-900">{customer.name}</p>
              </div>
              
              {customer.email && (
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </div>
                  <p className="text-gray-900 break-all">{customer.email}</p>
                </div>
              )}
              
              {customer.phone && (
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </div>
                  <p className="text-gray-900">{customer.phone}</p>
                </div>
              )}
              
              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  Total Orders
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {viewingCustomers.length} {viewingCustomers.length === 1 ? 'order' : 'orders'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Ruler className="h-5 w-5 mr-2 text-blue-600" />
                Measurement Orders
              </h3>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(requisition?.status || 'PENDING')}>
                  {requisition?.status?.replace('_', ' ') || 'PENDING'}
                </Badge>
                {requisition?.priority && (
                  <Badge className={getPriorityColor(requisition.priority)}>
                    {requisition.priority}
                  </Badge>
                )}
              </div>
            </div>

            {viewingCustomers.map((customer, index) => {
              const isExpanded = expandedOrders[customer.id] || viewingCustomers.length === 1;
              
              return (
                <Card key={customer.id} className="border-2 border-gray-100 hover:border-blue-100 transition-colors">
                  <CardHeader className="pb-3 cursor-pointer" onClick={() => toggleOrder(customer.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base flex items-center">
                          Order #{index + 1}
                          {!isExpanded && (
                            <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
                          )}
                          {isExpanded && (
                            <ChevronUp className="h-4 w-4 ml-2 text-gray-400" />
                          )}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge className={getStatusColor(customer.status || 'PENDING')}>
                            {(customer.status || 'PENDING').replace('_', ' ')}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            Ordered: {formatDate(customer.dateOfOrder)}
                          </div>
                          {customer.dateOfCollection && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              Due: {formatDate(customer.dateOfCollection)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-row gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditIndividualOrder(customer.id);
                          }}
                          className="flex items-center space-x-1 h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-3 w-3" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteIndividualOrder(customer.id);
                          }}
                          className="flex items-center space-x-1 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {isExpanded && (
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* TOPS */}
                        <Card className="border-0 bg-gray-50">
                          <CardHeader 
                            className="pb-2 px-4 cursor-pointer" 
                            onClick={() => toggleSection(`tops-${customer.id}`)}
                          >
                            <CardTitle className="text-sm font-semibold flex items-center justify-between">
                              <span>TOPS</span>
                              {expandedSections[`tops-${customer.id}`] ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </CardTitle>
                          </CardHeader>
                          {expandedSections[`tops-${customer.id}`] !== false && (
                            <CardContent className="space-y-2 px-4">
                              {Object.entries(customer.measurements.tops).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center py-1 border-b border-gray-200 last:border-b-0">
                                  <span className="text-xs font-medium text-gray-600 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                  </span>
                                  <span className="text-xs text-gray-900 font-medium">
                                    {value || '0'}"
                                  </span>
                                </div>
                              ))}
                            </CardContent>
                          )}
                        </Card>

                        {/* TROUSER/SKIRT */}
                        <Card className="border-0 bg-gray-50">
                          <CardHeader 
                            className="pb-2 px-4 cursor-pointer" 
                            onClick={() => toggleSection(`trouser-${customer.id}`)}
                          >
                            <CardTitle className="text-sm font-semibold flex items-center justify-between">
                              <span>TROUSERS</span>
                              {expandedSections[`trouser-${customer.id}`] ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </CardTitle>
                          </CardHeader>
                          {expandedSections[`trouser-${customer.id}`] !== false && (
                            <CardContent className="space-y-2 px-4">
                              {Object.entries(customer.measurements.trouser).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center py-1 border-b border-gray-200 last:border-b-0">
                                  <span className="text-xs font-medium text-gray-600 capitalize">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                  </span>
                                  <span className="text-xs text-gray-900 font-medium">
                                    {value || '0'}"
                                  </span>
                                </div>
                              ))}
                            </CardContent>
                          )}
                        </Card>

                        {/* AGBADA */}
                        <Card className="border-0 bg-gray-50">
                          <CardHeader 
                            className="pb-2 px-4 cursor-pointer" 
                            onClick={() => toggleSection(`agbada-${customer.id}`)}
                          >
                            <CardTitle className="text-sm font-semibold flex items-center justify-between">
                              <span>AGBADA</span>
                              {expandedSections[`agbada-${customer.id}`] ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </CardTitle>
                          </CardHeader>
                          {expandedSections[`agbada-${customer.id}`] !== false && (
                            <CardContent className="space-y-2 px-4">
                              {Object.entries(customer.measurements.agbada).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center py-1 border-b border-gray-200 last:border-b-0">
                                  <span className="text-xs font-medium text-gray-600 capitalize">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                  </span>
                                  <span className="text-xs text-gray-900 font-medium">
                                    {value || '0'}"
                                  </span>
                                </div>
                              ))}
                            </CardContent>
                          )}
                        </Card>
                      </div>

                      {customer.notes && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Clipboard className="h-4 w-4 mr-2" />
                            Notes
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{customer.notes}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={closeViewModal}
              className="flex-1 sm:flex-none"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};