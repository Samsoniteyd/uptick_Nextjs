// pages/UsersPage.tsx
"use client";
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerList from "@/components/CustomerList";
import CustomerForm from "@/components/CustomerForm";
import ProtectedRoute from '@/components/ProtectedRoute';
import { Customer } from "@/types/customer";
import { PlusCircle } from "lucide-react";
import { useRequisitions } from '@/hooks/useRequisitions';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Requisition } from '@/types';
import { Header } from '@/components/Header';
import { StatsCards } from '@/components/StatsCards';
import { WelcomeCard } from '@/components/WelcomeCard';
import { CustomerViewModal } from '@/components/CustomerViewModal';

const UsersPage = () => {
  const { logout } = useAuth();
  const { 
    requisitions = [], 
    isLoading, 
    createRequisition, 
    updateRequisition, 
    deleteRequisition,
    operationLoading,
    operationError,
    refetch
  } = useRequisitions();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomers, setViewingCustomers] = useState<Customer[] | null>(null);
  const [viewingRequisitions, setViewingRequisitions] = useState<Requisition[] | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCreating = operationLoading.create;
  const isUpdating = operationLoading.update;
  const isDeleting = operationLoading.delete;

  const toNumber = (value: string): number | undefined => {
    if (!value || value.trim() === '') return undefined;
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  };

  const customers = requisitions.map(req => ({
    id: req.id,
    name: req.name,
    email: req.contactInfo?.email || '',
    phone: req.contactInfo?.phone || '',
    dateOfOrder: req.createdAt?.split('T')[0] || '',
    dateOfCollection: req.dueDate?.split('T')[0] || '',
    status: req.status || 'PENDING',
    priority: req.priority || 'MEDIUM',
    measurements: {
      tops: {
        chest: req.measurements?.chest?.toString() || '',
        shoulders: req.measurements?.shoulders?.toString() || '',
        sleeveLength: req.measurements?.sleeveLengthLong?.toString() || '',
        sleeveLengthShort: req.measurements?.sleeveLengthShort?.toString() || '',
        topLength: req.measurements?.topLength?.toString() || '',
        neck: req.measurements?.neck?.toString() || '',
        tommy: req.measurements?.tommy?.toString() || '',
        hip: req.measurements?.hip?.toString() || '',
      },
      trouser: {
        waist: req.measurements?.waist?.toString() || '',
        length: req.measurements?.length?.toString() || '',
        lap: req.measurements?.lap?.toString() || '',
        hip: req.measurements?.hip?.toString() || '',
        base: req.measurements?.base?.toString() || '',
      },
      agbada: {
        length: req.measurements?.agbadaLength?.toString() || '',
        sleeve: req.measurements?.agbadaSleeve?.toString() || '',
      }
    },
    notes: req.description || '',
    createdAt: req.createdAt || new Date().toISOString()
  }));

  const stats = {
    totalCustomers: customers.length,
    pendingOrders: customers.filter(c => c.status === 'PENDING').length,
    readyForCollection: customers.filter(c => c.status === 'COMPLETED').length,
    collected: customers.filter(c => c.status === 'CANCELLED').length,
    inProgressOrders: customers.filter(c => c.status === 'IN_PROGRESS').length,
    completedOrders: customers.filter(c => c.status === 'COMPLETED').length,
    cancelledOrders: customers.filter(c => c.status === 'CANCELLED').length
  };

  const handleSaveCustomer = async (customer: Customer) => {
    const requisitionData = {
      name: customer.name,
      description: customer.notes || '',
      measurements: {
        chest: toNumber(customer.measurements.tops.chest),
        shoulders: toNumber(customer.measurements.tops.shoulders),
        sleeveLengthLong: toNumber(customer.measurements.tops.sleeveLength),
        sleeveLengthShort: toNumber(customer.measurements.tops.sleeveLengthShort),
        topLength: toNumber(customer.measurements.tops.topLength),
        neck: toNumber(customer.measurements.tops.neck),
        tommy: toNumber(customer.measurements.tops.tommy),
        hip: toNumber(customer.measurements.tops.hip),
        waist: toNumber(customer.measurements.trouser.waist),
        length: toNumber(customer.measurements.trouser.length),
        lap: toNumber(customer.measurements.trouser.lap),
        base: toNumber(customer.measurements.trouser.base),
        agbadaLength: toNumber(customer.measurements.agbada.length),
        agbadaSleeve: toNumber(customer.measurements.agbada.sleeve),
      },
      contactInfo: {
        email: customer.email || '',
        phone: customer.phone || '',
      },
      dueDate: customer.dateOfCollection || undefined,
      status: customer.status as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
      priority: customer.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
    };
    
    try {
      if (editingCustomer && editingCustomer.id) {
        await updateRequisition(
          { id: editingCustomer.id, data: requisitionData }
        );
        setEditingCustomer(null);
        setActiveTab("customers");
        toast.success("Customer Updated Successfully!", {
          description: `${customer.name}'s details have been updated successfully.`,
        });
      } else {
        await createRequisition(requisitionData);
        setActiveTab("customers");
        toast.success("New Customer Created Successfully!", {
          description: `${customer.name}'s measurements and details have been saved successfully.`,
        });
      }
    } catch (error) {
      toast.error("Operation Failed", {
        description: "There was an error processing your request.",
      });
    }
  };

  const handleEditRequisition = (requisition: Requisition) => {
    const customer: Customer = {
      id: requisition.id,
      name: requisition.name,
      email: requisition.contactInfo?.email || '',
      phone: requisition.contactInfo?.phone || '',
      dateOfOrder: requisition.createdAt?.split('T')[0] || '',
      dateOfCollection: requisition.dueDate?.split('T')[0] || '',
      status: requisition.status || 'PENDING',
      priority: requisition.priority || 'MEDIUM',
      measurements: {
        tops: {
          chest: requisition.measurements?.chest?.toString() || '',
          shoulders: requisition.measurements?.shoulders?.toString() || '',
          sleeveLength: requisition.measurements?.sleeveLengthLong?.toString() || '',
          sleeveLengthShort: requisition.measurements?.sleeveLengthShort?.toString() || '',
          topLength: requisition.measurements?.topLength?.toString() || '',
          neck: requisition.measurements?.neck?.toString() || '',
          tommy: requisition.measurements?.tommy?.toString() || '',
          hip: requisition.measurements?.hip?.toString() || '',
        },
        trouser: {
          waist: requisition.measurements?.waist?.toString() || '',
          length: requisition.measurements?.length?.toString() || '',
          lap: requisition.measurements?.lap?.toString() || '',
          hip: requisition.measurements?.hip?.toString() || '',
          base: requisition.measurements?.base?.toString() || '',
        },
        agbada: {
          length: requisition.measurements?.agbadaLength?.toString() || '',
          sleeve: requisition.measurements?.agbadaSleeve?.toString() || '',
        }
      },
      notes: requisition.description || '',
      createdAt: requisition.createdAt || new Date().toISOString()
    };
    setEditingCustomer(customer);
    setActiveTab("new-customer");
  };

  const handleDeleteRequisition = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteRequisition(id);
        toast.success("Customer Deleted Successfully!");
      } catch (error) {
        toast.error("Failed to Delete Customer");
      }
    }
  };

  const handleViewRequisition = (requisitions: Requisition[]) => {
    const customers = requisitions.map(req => ({
      id: req.id,
      name: req.name,
      email: req.contactInfo?.email || '',
      phone: req.contactInfo?.phone || '',
      dateOfOrder: req.createdAt?.split('T')[0] || '',
      dateOfCollection: req.dueDate?.split('T')[0] || '',
      status: req.status || 'PENDING',
      priority: req.priority || 'MEDIUM',
      measurements: {
        tops: {
          chest: req.measurements?.chest?.toString() || '',
          shoulders: req.measurements?.shoulders?.toString() || '',
          sleeveLength: req.measurements?.sleeveLengthLong?.toString() || '',
          sleeveLengthShort: req.measurements?.sleeveLengthShort?.toString() || '',
          topLength: req.measurements?.topLength?.toString() || '',
          neck: req.measurements?.neck?.toString() || '',
          tommy: req.measurements?.tommy?.toString() || '',
          hip: req.measurements?.hip?.toString() || '',
        },
        trouser: {
          waist: req.measurements?.waist?.toString() || '',
          length: req.measurements?.length?.toString() || '',
          lap: req.measurements?.lap?.toString() || '',
          hip: req.measurements?.hip?.toString() || '',
          base: req.measurements?.base?.toString() || '',
        },
        agbada: {
          length: req.measurements?.agbadaLength?.toString() || '',
          sleeve: req.measurements?.agbadaSleeve?.toString() || '',
        }
      },
      notes: req.description || '',
      createdAt: req.createdAt || new Date().toISOString()
    }));
    setViewingCustomers(customers);
    setViewingRequisitions(requisitions);
  };

  const handleEditIndividualOrder = (orderId: string) => {
    const requisition = viewingRequisitions?.find(req => req.id === orderId);
    if (requisition) {
      handleEditRequisition(requisition);
      setViewingCustomers(null);
      setViewingRequisitions(null);
    }
  };

  const handleDeleteIndividualOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to delete this specific order?')) {
      try {
        await deleteRequisition(orderId);
        if (viewingRequisitions) {
          const updatedRequisitions = viewingRequisitions.filter(req => req.id !== orderId);
          if (updatedRequisitions.length === 0) {
            setViewingCustomers(null);
            setViewingRequisitions(null);
          } else {
            const updatedCustomers = updatedRequisitions.map(req => ({
              id: req.id,
              name: req.name,
              email: req.contactInfo?.email || '',
              phone: req.contactInfo?.phone || '',
              dateOfOrder: req.createdAt?.split('T')[0] || '',
              dateOfCollection: req.dueDate?.split('T')[0] || '',
              status: req.status || 'PENDING',
              priority: req.priority || 'MEDIUM',
              measurements: {
                tops: {
                  chest: req.measurements?.chest?.toString() || '',
                  shoulders: req.measurements?.shoulders?.toString() || '',
                  sleeveLength: req.measurements?.sleeveLengthLong?.toString() || '',
                  sleeveLengthShort: req.measurements?.sleeveLengthShort?.toString() || '',
                  topLength: req.measurements?.topLength?.toString() || '',
                  neck: req.measurements?.neck?.toString() || '',
                  tommy: req.measurements?.tommy?.toString() || '',
                  hip: req.measurements?.hip?.toString() || '',
                },
                trouser: {
                  waist: req.measurements?.waist?.toString() || '',
                  length: req.measurements?.length?.toString() || '',
                  lap: req.measurements?.lap?.toString() || '',
                  hip: req.measurements?.hip?.toString() || '',
                  base: req.measurements?.base?.toString() || '',
                },
                agbada: {
                  length: req.measurements?.agbadaLength?.toString() || '',
                  sleeve: req.measurements?.agbadaSleeve?.toString() || '',
                }
              },
              notes: req.description || '',
              createdAt: req.createdAt || new Date().toISOString()
            }));
            setViewingCustomers(updatedCustomers);
            setViewingRequisitions(updatedRequisitions);
          }
        }
        toast.success("Order Deleted Successfully!");
      } catch (error) {
        toast.error("Failed to Delete Order");
      }
    }
  };

  const closeViewModal = () => {
    setViewingCustomers(null);
    setViewingRequisitions(null);
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading your dashboard...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <div className="w-full overflow-x-auto">
              <TabsList className="grid w-full grid-cols-3 min-w-[300px] sm:w-auto lg:w-[400px] h-11 sm:h-auto">
                <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-4 cursor-pointer">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="customers" className="text-xs sm:text-sm px-2 sm:px-4 cursor-pointer">
                  Customers
                </TabsTrigger>
                <TabsTrigger value="new-customer" className="text-xs sm:text-sm px-1 sm:px-4 cursor-pointer">
                  <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">New Order</span>
                  <span className="sm:hidden">New</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-4 sm:space-y-6">
              <StatsCards stats={stats} />
              <WelcomeCard setActiveTab={setActiveTab} isCreating={isCreating} />
            </TabsContent>

            <TabsContent value="customers">
              <CustomerList 
                requisitions={requisitions}
                onEdit={handleEditRequisition}
                onView={handleViewRequisition}
                onDelete={handleDeleteRequisition}
                onCreate={() => setActiveTab("new-customer")}
              />
              {(isUpdating || isDeleting) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white p-6 rounded-lg max-w-sm w-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-3 text-center text-sm sm:text-base">
                      {isUpdating ? 'Updating customer...' : 'Deleting customer...'}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="new-customer">
              <CustomerForm 
                customer={editingCustomer}
                onSave={handleSaveCustomer} // Added missing onSave prop
                onCancel={() => {
                  setEditingCustomer(null);
                  setActiveTab("customers");
                }}
              />
            </TabsContent>
          </Tabs>
        </main>

        {viewingCustomers && viewingRequisitions && (
          <CustomerViewModal
            viewingCustomers={viewingCustomers}
            viewingRequisitions={viewingRequisitions}
            closeViewModal={closeViewModal}
            handleEditIndividualOrder={handleEditIndividualOrder}
            handleDeleteIndividualOrder={handleDeleteIndividualOrder}
          />
        )}
      </div>
  );
};

export default UsersPage;