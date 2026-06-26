export type UserRole = 'user' | 'host' | 'admin';
export interface User {
    id: string;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    role: UserRole;
    profile_picture?: string;
    created_at: Date;
    updated_at: Date;
}
export interface HostProfile {
    id: string;
    user_id: string;
    bio?: string;
    verification_status: 'pending' | 'approved' | 'rejected';
    stripe_account_id?: string;
    created_at: Date;
    updated_at: Date;
}
export interface Category {
    id: string;
    name: string;
    description?: string;
}
export interface Listing {
    id: string;
    host_id: string;
    category_id: string;
    title: string;
    description: string;
    location_address: string;
    location_latitude?: number;
    location_longitude?: number;
    price: number;
    currency: string;
    duration_minutes?: number;
    start_date?: Date;
    end_date?: Date;
    capacity: number;
    status: 'draft' | 'published' | 'cancelled' | 'archived';
    created_at: Date;
    updated_at: Date;
}
export interface Booking {
    id: string;
    user_id: string;
    listing_id: string;
    booking_date: Date;
    start_date?: Date;
    end_date?: Date;
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
    stripe_payment_intent_id?: string;
    created_at: Date;
    updated_at: Date;
}
export interface Review {
    id: string;
    booking_id: string;
    user_id: string;
    listing_id: string;
    rating: number;
    comment?: string;
    created_at: Date;
}
export interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    listing_id?: string;
    content: string;
    read_at?: Date;
    created_at: Date;
}
export interface Notification {
    id: string;
    user_id: string;
    title: string;
    body: string;
    type: string;
    data?: string;
    read_at?: Date;
    created_at: Date;
}
export interface Transaction {
    id: string;
    booking_id?: string;
    user_id: string;
    amount: number;
    currency: string;
    type: 'payment' | 'refund' | 'payout';
    status: 'succeeded' | 'pending' | 'failed';
    stripe_transaction_id?: string;
    created_at: Date;
}
//# sourceMappingURL=types.d.ts.map