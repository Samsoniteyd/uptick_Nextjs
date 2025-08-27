"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Customer } from "@/types/customer";
import { Save, X, Search } from "lucide-react";
import { useRequisitions } from "@/hooks/useRequisitions";
import { toast } from "sonner";

interface CustomerFormProps {
  customer?: Customer | null;
  customers?: Customer[];
  onSave: (customer: Customer) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, customers = [], onSave, onCancel }) => {
  const { createRequisition, updateRequisition, operationLoading } = useRequisitions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const [formData, setFormData] = useState<Customer>({
    id: customer?.id || "",
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    dateOfOrder: customer?.dateOfOrder || new Date().toISOString().split("T")[0],
    dateOfCollection: customer?.dateOfCollection || "",
    status: customer?.status || "PENDING",
    priority: customer?.priority || "MEDIUM",
    measurements: customer?.measurements || {
      tops: {
        chest: '',
        shoulders: '',
        sleeveLength: '',
        sleeveLengthShort: '',
        topLength: '',
        neck: '',
        tommy: '',
        hip: ''
      },
      trouser: {
        waist: '',
        length: '',
        lap: '',
        hip: '',
        base: ''
      },
      agbada: {
        length: '',
        sleeve: ''
      }
    },
    notes: customer?.notes || '',
    createdAt: customer?.createdAt || new Date().toISOString(),
  });

  useEffect(() => {
    if (searchTerm.trim()) {
      const results = customers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setSearchResults(results);
      setShowSearchResults(results.length > 0);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchTerm, customers]);

  const clearForm = () => {
    setFormData({
      id: "",
      name: '',
      email: '',
      phone: '',
      dateOfOrder: new Date().toISOString().split('T')[0],
      dateOfCollection: '',
      status: 'PENDING',
      priority: 'MEDIUM',
      measurements: {
        tops: {
          chest: '',
          shoulders: '',
          sleeveLength: '',
          sleeveLengthShort: '',
          topLength: '',
          neck: '',
          tommy: '',
          hip: ''
        },
        trouser: {
          waist: '',
          length: '',
          lap: '',
          hip: '',
          base: ''
        },
        agbada: {
          length: '',
          sleeve: ''
        }
      },
      notes: '',
      createdAt: new Date().toISOString(),
    });
    setSearchTerm('');
    setShowSearchResults(false);
  };

  const loadCustomerData = (selectedCustomer: Customer) => {
    setFormData({
      id: selectedCustomer.id || "",
      name: selectedCustomer.name,
      email: selectedCustomer.email || '',
      phone: selectedCustomer.phone || '',
      dateOfOrder: new Date().toISOString().split('T')[0],
      dateOfCollection: '',
      status: 'PENDING',
      priority: selectedCustomer.priority || 'MEDIUM',
      measurements: selectedCustomer.measurements,
      notes: selectedCustomer.notes || '',
      createdAt: selectedCustomer.createdAt || new Date().toISOString(),
    });
    setSearchTerm('');
    setShowSearchResults(false);
  };

  const isFormValid = () => {
    if (!formData.name.trim() || !formData.dateOfOrder) {
      return false;
    }

    const allMeasurements = [
      ...Object.values(formData.measurements.tops),
      ...Object.values(formData.measurements.trouser),
      ...Object.values(formData.measurements.agbada)
    ];

    return allMeasurements.every(measurement => measurement.trim() !== '');
  };

  useEffect(() => {
    if (customer) {
      setFormData({
        id: customer.id || "",
        name: customer.name,
        email: customer.email || '',
        phone: customer.phone || '',
        dateOfOrder: customer.dateOfOrder,
        dateOfCollection: customer.dateOfCollection,
        status: customer.status,
        priority: customer.priority || 'MEDIUM',
        measurements: customer.measurements,
        notes: customer.notes || '',
        createdAt: customer.createdAt || new Date().toISOString(),
      });
    }
  }, [customer]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMeasurementChange = (section: keyof typeof formData.measurements, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [section]: {
          ...prev.measurements[section],
          [field]: value
        }
      }
    }));
  };

  const toNumber = (value: string): number | undefined => {
    if (!value || value.trim() === "") return undefined;
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requisitionData = {
      name: formData.name,
      description: formData.notes || undefined,
      measurements: {
        chest: toNumber(formData.measurements.tops.chest),
        shoulders: toNumber(formData.measurements.tops.shoulders),
        sleeveLengthLong: toNumber(formData.measurements.tops.sleeveLength),
        sleeveLengthShort: toNumber(formData.measurements.tops.sleeveLengthShort),
        topLength: toNumber(formData.measurements.tops.topLength),
        neck: toNumber(formData.measurements.tops.neck),
        tommy: toNumber(formData.measurements.tops.tommy),
        hip: toNumber(formData.measurements.tops.hip),
        waist: toNumber(formData.measurements.trouser.waist),
        length: toNumber(formData.measurements.trouser.length),
        lap: toNumber(formData.measurements.trouser.lap),
        base: toNumber(formData.measurements.trouser.base),
        agbadaLength: toNumber(formData.measurements.agbada.length),
        agbadaSleeve: toNumber(formData.measurements.agbada.sleeve),
      },
      contactInfo: {
        email: formData.email || undefined,
        phone: formData.phone || undefined,
      },
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dateOfCollection || undefined,
    };
        
    try {
      if (customer?.id) {
        await updateRequisition({ 
          id: customer.id, 
          data: requisitionData 
        });
        toast.success("Customer updated successfully!");
      } else {
        await createRequisition(requisitionData);
        toast.success("New customer created successfully!");
      }
      onCancel();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errors.forEach((err: any) => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else {
        toast.error("Failed to save customer");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white shadow-lg">
          <CardHeader className="bg-blue-50 border-b px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
                DETAILED REQUISITION CARD
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="sm:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
         <form onSubmit={handleSubmit} className="space-y-6">
              {!customer && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    Search Existing Customer
                  </h3>
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or email..."
                        className="pl-10 h-11 border-gray-300"
                      />
                    </div>
                    
                    {showSearchResults && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map((result) => (
                          <div
                            key={result.id}
                            onClick={() => loadCustomerData(result)}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">{result.name}</div>
                            {result.email && <div className="text-sm text-gray-600">{result.email}</div>}
                          </div>
                        ))}
                      </div>
                    )
                    }
                  </div>
                  <p className="text-sm text-gray-600">
                    Search to load existing customer measurements, or fill out the form below for a new customer.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 border-b pb-2">
                  Customer Information
                </h3>
                
                <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="border-gray-300 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="border-gray-300 h-11"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="border-gray-300 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfOrder" className="text-sm font-medium">Date Of Order *</Label>
                    <Input
                      id="dateOfOrder"
                      type="date"
                      value={formData.dateOfOrder}
                      onChange={(e) => handleInputChange('dateOfOrder', e.target.value)}
                      required
                      className="border-gray-300 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfCollection" className="text-sm font-medium">Date Of Collection</Label>
                    <Input
                      id="dateOfCollection"
                      type="date"
                      value={formData.dateOfCollection}
                      onChange={(e) => handleInputChange('dateOfCollection', e.target.value)}
                      className="border-gray-300 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: any) => handleInputChange('status', value)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                    <Select 
                      value={formData.priority || "MEDIUM"} 
                      onValueChange={(value: any) => handleInputChange('priority', value)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low Priority</SelectItem>
                        <SelectItem value="MEDIUM">Medium Priority</SelectItem>
                        <SelectItem value="HIGH">High Priority</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 border-b pb-2 sm:border-b-0 sm:pb-0">
                    Measurements
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 sm:mt-0">
                    * All fields required. Enter "0" for measurements not needed.
                  </p>
                </div>
                
                <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
                  <Card className="border border-gray-200">
                    <CardHeader className="pb-3 px-4">
                      <CardTitle className="text-base sm:text-lg font-semibold bg-gray-100 px-3 py-2 rounded">
                        TOPS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 px-4">
                      {Object.entries(formData.measurements.tops).map(([key, value]) => (
                        <div key={key} className="space-y-1 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3 sm:items-center">
                          <Label className="text-sm capitalize border-b pb-1 sm:border-b-0 sm:pb-0">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Label>
                          <Input
                            value={value}
                            onChange={(e) => handleMeasurementChange('tops', key, e.target.value)}
                            className="h-9 sm:h-8 border-gray-300"
                            placeholder="inches or 0"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardHeader className="pb-3 px-4">
                      <CardTitle className="text-base sm:text-lg font-semibold bg-gray-100 px-3 py-2 rounded">
                        TROUSER/SKIRT
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 px-4">
                      {Object.entries(formData.measurements.trouser).map(([key, value]) => (
                        <div key={key} className="space-y-1 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3 sm:items-center">
                          <Label className="text-sm capitalize border-b pb-1 sm:border-b-0 sm:pb-0">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </Label>
                          <Input
                            value={value}
                            onChange={(e) => handleMeasurementChange('trouser', key, e.target.value)}
                            className="h-9 sm:h-8 border-gray-300"
                            placeholder="inches or 0"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <Card className="border border-gray-200">
                  <CardHeader className="pb-3 px-4">
                    <CardTitle className="text-base sm:text-lg font-semibold bg-gray-100 px-3 py-2 rounded">
                      AGBADA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4">
                    <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                      {Object.entries(formData.measurements.agbada).map(([key, value]) => (
                        <div key={key} className="space-y-1 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3 sm:items-center">
                          <Label className="text-sm capitalize border-b pb-1 sm:border-b-0 sm:pb-0">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </Label>
                          <Input
                            value={value}
                            onChange={(e) => handleMeasurementChange('agbada', key, e.target.value)}
                            className="h-9 sm:h-8 border-gray-300"
                            placeholder="inches or 0"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="border-gray-300 min-h-[100px]"
                  rows={4}
                  placeholder="Any special requirements or notes..."
                />
              </div>

              <div className="pt-4 border-t">
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onCancel}
                    className="w-full sm:w-auto h-11"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={!isFormValid() || operationLoading.create || operationLoading.update}
                    className="w-full sm:w-auto h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {operationLoading.create || operationLoading.update ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {customer ? "Update Customer" : "Save Customer"}
                      </>
                    )}
                  </Button>
                  {!customer && (
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={clearForm}
                      className="w-full sm:w-auto h-11"
                    >
                      Clear Form
                    </Button>
                  )}
                </div>
              </div>
            </form>          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerForm;