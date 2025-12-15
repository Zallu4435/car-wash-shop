// Complaint category options
export type ComplaintCategory =
    | 'service_quality'
    | 'staff_behavior'
    | 'damage_loss'
    | 'wrong_service'
    | 'overcharged'
    | 'other';

// Customer-friendly complaint status (simplified)
export type CustomerComplaintStatus = 'pending' | 'in_progress' | 'resolved';

// Customer-facing complaint interface
export interface Complaint {
    id: string;
    category: ComplaintCategory;
    description: string;
    status: CustomerComplaintStatus;
    statusLabel: string;
    adminResponse?: string | null;
    createdAt: string;
    resolvedAt?: string | null;
}

// Input for creating a complaint
export interface CreateComplaintInput {
    referenceType: 'booking' | 'productOrder';
    referenceId: string;
    category: ComplaintCategory;
    description: string;
}

// Eligibility check response
export interface CanFileComplaintResult {
    canFile: boolean;
    reason?: 'complaint_exists' | 'not_found' | 'not_completed' | 'not_delivered' | 'window_expired';
    daysAgo?: number;
    daysRemaining?: number;
}

// Category labels for display
export const COMPLAINT_CATEGORY_LABELS: Record<ComplaintCategory, string> = {
    service_quality: 'Service Quality',
    staff_behavior: 'Staff Behavior',
    damage_loss: 'Damage or Loss',
    wrong_service: 'Wrong Service Provided',
    overcharged: 'Overcharged',
    other: 'Other Issue',
};

// Category options for select dropdown
export const COMPLAINT_CATEGORY_OPTIONS = Object.entries(COMPLAINT_CATEGORY_LABELS).map(
    ([value, label]) => ({ value: value as ComplaintCategory, label })
);
