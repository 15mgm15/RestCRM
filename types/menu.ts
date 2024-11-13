export interface MenuItem {
    id: number;
    name: string;
    price: number;
    isEconoplatillo?: boolean;
  }
  
  export interface Appetizer extends MenuItem {}
  export interface Soup extends MenuItem {}
  export interface SideDish extends MenuItem {}
  export interface MainCourse extends MenuItem {
    isEconoplatillo: boolean;
  }
  export interface Drink extends MenuItem {}
  export interface Dessert extends MenuItem {}
  
  export interface DailyMenu {
    date: string;
    appetizers: Appetizer[];
    soups: Soup[];
    sideDishes: SideDish[];
    mainCourses: MainCourse[];
    drinks: Drink[];
    desserts: Dessert[];
  }
  
  export interface Order {
    id: number;
    items: MenuItem[];
    total: number;
    notes: string;
  }