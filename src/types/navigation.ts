export type MainSection = 
  | 'home'
  | 'marketplace'
  | 'utilities'
  | 'services'
  | 'future_services'
  | 'ai_search'
  | 'finance_analytics'
  | 'admin_governance'
  | 'security_trust'
  | 'developer_platform'
  | 'seller_studio'
  | 'cart'
  | 'orders'
  | 'community'
  | 'profile';

export type MarketplaceCategory = 
  | 'phones_mobile'
  | 'smartphones'
  | 'computers_technology'
  | 'computers'
  | 'electronics'
  | 'automotive_transport'
  | 'vehicles'
  | 'home_living'
  | 'fashion_beauty'
  | 'fashion'
  | 'beauty'
  | 'food_groceries'
  | 'groceries'
  | 'industrial_construction'
  | 'industrial_equipment'
  | 'agriculture'
  | 'education'
  | 'books'
  | 'professional_services'
  | 'technology_services'
  | 'travel_transport'
  | 'entertainment_creative'
  | 'pets_animals'
  | 'baby_kids'
  | 'toys'
  | 'health_wellness'
  | 'health'
  | 'sports'
  | 'business_office'
  | 'other_general'
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
