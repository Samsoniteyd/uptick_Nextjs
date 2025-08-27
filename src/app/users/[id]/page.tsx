"use client";
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import CustomerForm from '../../../components/CustomerForm';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useRequisitions } from '../../../hooks/useRequisitions';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Customer } from '../../../types/customer';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const { requisitions, updateRequisition, operationLoading } = useRequisitions();
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const isUpdating = operationLoading.update;
  const isLoading = false; // Your hook doesn't have isLoading state

  // Helper function to convert requisition to customer format
  const requisitionToCustomer = (req: any): Customer => {
    const measurements = req.measurements as any;
    const contactInfo = req.contactInfo as any;
    
    return {
      id: req.id,
      name: req.name,
      email: contactInfo?.email || '',
      phone: contactInfo?.phone || '',
      dateOfOrder: req.createdAt?.split('T')[0] || '',
      dateOfCollection: req.dueDate?.split('T')[0] || '',
      status: req.status || 'PENDING',
      priority: req.priority || 'MEDIUM',
      measurements: {
        tops: {
          chest: measurements?.chest?.toString() || '',
          shoulders: measurements?.shoulders?.toString() || '',
          sleeveLength: measurements?.sleeveLengthLong?.toString() || '',
          sleeveLengthShort: measurements?.sleeveLengthShort?.toString() || '',
          topLength: measurements?.topLength?.toString() || '',
          neck: measurements?.neck?.toString() || '',
          tommy: measurements?.tommy?.toString() || '',
          hip: measurements?.hip?.toString() || '',
        },
        trouser: {
          waist: measurements?.waist?.toString() || '',
          length: measurements?.length?.toString() || '',
          lap: measurements?.lap?.toString() || '',
          hip: measurements?.hip?.toString() || '',
          base: measurements?.base?.toString() || '',
        },
        agbada: {
          length: measurements?.agbadaLength?.toString() || '',
          sleeve: measurements?.agbadaSleeve?.toString() || '',
        }
      },
      notes: req.description || '',
      createdAt: req.createdAt
    };
  };

  // Find the specific requisition by ID
  const requisition = useMemo(() => {
    if (!requisitions || !params.id) return null;
    return requisitions.find(req => req.id === params.id);
  }, [requisitions, params.id]);

  const handleSave = async (customerData: Customer) => {
    setSaveError(null);
    
    // Convert customer data back to requisition format
    const toNumber = (value: string): number | undefined => {
      if (!value || value.trim() === "") return undefined;
      const num = parseFloat(value);
      return isNaN(num) ? undefined : num;
    };

    const requisitionData = {
      name: customerData.name,
      description: customerData.notes || undefined,
      measurements: {
        chest: toNumber(customerData.measurements.tops.chest),
        shoulders: toNumber(customerData.measurements.tops.shoulders),
        sleeveLengthLong: toNumber(customerData.measurements.tops.sleeveLength),
        sleeveLengthShort: toNumber(customerData.measurements.tops.sleeveLengthShort),
        topLength: toNumber(customerData.measurements.tops.topLength),
        neck: toNumber(customerData.measurements.tops.neck),
        tommy: toNumber(customerData.measurements.tops.tommy),
        hip: toNumber(customerData.measurements.tops.hip),
        waist: toNumber(customerData.measurements.trouser.waist),
        length: toNumber(customerData.measurements.trouser.length),
        lap: toNumber(customerData.measurements.trouser.lap),
        base: toNumber(customerData.measurements.trouser.base),
        agbadaLength: toNumber(customerData.measurements.agbada.length),
        agbadaSleeve: toNumber(customerData.measurements.agbada.sleeve),
      },
      contactInfo: {
        email: customerData.email || undefined,
        phone: customerData.phone || undefined,
      },
      priority: customerData.priority,
      status: customerData.status,
      dueDate: customerData.dateOfCollection || undefined,
    };

    try {
      await updateRequisition({ 
        id: params.id as string, 
        data: requisitionData 
      });
      router.push('/users');
    } catch (error: any) {
      let errorMessage = 'Failed to update customer';
      if (error?.response?.status === 404) {
        errorMessage = 'Customer not found. It may have been deleted.';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setSaveError(errorMessage);
    }
  };

  const handleCancel = () => {
    router.push('/users');
  };

  // Show loading state while data is being fetched
  if (!requisitions) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600 text-center text-sm sm:text-base">
                Loading customer details...
              </p>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  // Show error state if requisition not found
  if (!requisition) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mb-4" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
                Customer Not Found
              </h1>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                The customer you're looking for doesn't exist or has been deleted.
              </p>
              <Button 
                onClick={() => router.push('/users')}
                className="w-full sm:w-auto h-11 bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Customers
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  // Convert requisition to customer format for the form
  const customer = requisitionToCustomer(requisition);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Mobile header with back button */}
        <div className="sticky top-0 z-10 bg-white border-b shadow-sm sm:hidden">
          <div className="flex items-center px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="mr-3 p-2 cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-gray-900">Edit Customer</h1>
              <p className="text-sm text-gray-600 truncate max-w-[200px]">
                {customer.name}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden sm:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Customers</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Customer</h1>
                <p className="text-gray-600">{customer.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {saveError && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Update Failed</h3>
                  <p className="text-sm text-red-700 mt-1">{saveError}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSaveError(null)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ×
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Form content */}
        <div className="pb-4 sm:pb-8">
          <CustomerForm 
            customer={customer}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>

        {/* Loading overlay */}
        {isUpdating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-sm">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
                <p className="text-center text-sm sm:text-base text-gray-700">
                  Updating customer...
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}