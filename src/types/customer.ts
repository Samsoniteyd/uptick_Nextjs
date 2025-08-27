// types/customer.ts
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfOrder: string;
  dateOfCollection: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
  measurements: {
    tops: {
      chest: string;
      shoulders: string;
      sleeveLength: string;
      sleeveLengthShort: string;
      topLength: string;
      neck: string;
      tommy: string;
      hip: string;
    };
    trouser: {
      waist: string;
      length: string;
      lap: string;
      hip: string;
      base: string;
    };
    agbada: {
      length: string;
      sleeve: string;
    };
  };
  notes: string;
  createdAt: string;
}
export interface CustomerFormProps {
  isEditing?: boolean;
  initialData?: Customer;
  onSubmit: (data: Customer) => void;
}
// types/index.ts
export interface Requisition {
  id: string; // Changed from _id to match backend
  name: string;
  description?: string;
  measurements: string; // This matches backend structure
  contactInfo?: string;
  status: Status;
  priority?: Priority;
  dueDate?: string;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name?: string;
    email?: string;
  };
}

export interface CreateRequisitionData {
  name: string;
  description?: string;
  measurements: {
    chest?: number;
    shoulders?: number;
    sleeveLengthLong?: number;
    sleeveLengthShort?: number;
    topLength?: number;
    neck?: number;
    tommy?: number;
    hip?: number;
    waist?: number;
    length?: number;
    lap?: number;
    base?: number;
    agbadaLength?: number;
    agbadaSleeve?: number;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  status?: Status;
  priority?: Priority;
  dueDate?: string;
  notes?: any[];
}

// Add these enums to match backend
export enum Status {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'

}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}
