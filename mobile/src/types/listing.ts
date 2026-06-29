export interface Listing {
  id: string;
  host_id: string;
  category_id: string;
  category_name: string;
  title: string;
  description: string;
  location_address: string;
  location_latitude: number | null;
  location_longitude: number | null;
  price: number;
  currency: string;
  duration_minutes: number | null;
  start_date: string | null;
  end_date: string | null;
  capacity: number;
  status: string;
  average_rating?: number;
  image_url?: string;
}
