export type MainSection = 
  | 'home'
  | 'marketplace'
  | 'utilities'
  | 'services'
  | 'ai_search'
  | 'finance_analytics'
  | 'admin_governance'
  | 'security_trust'
  | 'developer_platform'
  | 'cart'
  | 'orders'
  | 'community'
  | 'profile';

export type MarketplaceCategory = 
  | 'smartphones'
  | 'computers'
  | 'fashion'
  | 'home_living'
  | 'electronics'
  | 'beauty'
  | 'groceries'
  | 'vehicles'
  | 'books'
  | 'sports'
  | 'health'
  | 'toys'
  | 'industrial_equipment'
  | 'deals'
  | 'all';

export type UtilityCategory = 
  | 'airtime'
  | 'mobile_data'
  | 'electricity'
  | 'water_bills'
  | 'cable_tv'
  | 'internet_services'
  | 'exam_cards'
  | 'education_payments'
  | 'gift_cards'
  | 'vouchers'
  | 'betting'
  | 'gaming'
  | 'streaming'
  | 'government_services'
  | 'insurance'
  | 'transport'
  | 'event_tickets'
  | 'ecommerce';

export type ServiceCategory =
  | 'consultation'
  | 'freelance_tech'
  | 'repairs_maintenance'
  | 'home_cleaning'
  | 'events_photography';

export interface BreadcrumbItem {
  label: string;
  section: MainSection;
  category?: MarketplaceCategory | UtilityCategory | ServiceCategory | 'all';
}

export interface VisitedCategory {
  id: string;
  name: string;
  type: 'marketplace' | 'utility' | 'service';
  iconName: string;
  timestamp: string;
}
