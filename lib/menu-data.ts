import { MenuItem } from '@/types/menu'

// Esta función simularía la carga de datos desde una base de datos NoSQL
const menuItems = [
  {id: 1, category: "Postre", name: "Gelatinas de varios sabores", "price": 20},
  {id: 2, category: "Postre", name: "Arroz con leche", "price": 25},
  {id: 3, category: "Bebida", name: "Agua fresca de horchata", "price": 45},
  {id: 4, category: "Guarnición", name: "Ensalada fresca con apio y zanahoria", "price": 35},
  {id: 5, category: "Guarnición", name: "Ensalada de verduras al vapor", "price": 35},
  {id: 6, category: "Guarnición", name: "Ensalada de manzana con zanahoria", "price": 40},
  {id: 7, category: "Guarnición", name: "Crema de champiñón", "price": 45},
  {id: 8, category: "Guarnición", name: "Sopa aguada de pasta (caracol)", "price": 35},
  {id: 9, category: "Guarnición", name: "Sopa de verduras", "price": 45},
  {id: 10, category: "Guarnición", name: "Caldillo de habas", "price": 45},
  {id: 11, category: "Guarnición", name: "Frijoles fritos", "price": 45},
  {id: 12, category: "Guarnición", name: "Arroz verde", "price": 35},
  {id: 13, category: "Guarnición", name: "Spaghetti con crema", "price": 45},
  {id: 14, category: "Plato fuerte", name: "Flautas de pollo", "price": 88},
  {id: 15, category: "Plato fuerte", name: "Pastel de carne", "price": 88},
  {id: 16, category: "Plato fuerte", name: "Costilla en pipián verde", "price": 88},
  {id: 17, category: "Plato fuerte", name: "Pollo horneado a la BBQ", "price": 88},
  {id: 18, category: "Plato fuerte", name: "Ensalada de surimi", "price": 88},
  {id: 19, category: "Plato fuerte", name: "Especial de pollo", "price": 125},
  {id: 20, category: "Postre", name: "Flan napolitano", "price": 25},
  {id: 21, category: "Postre", name: "Fruta de temporada", "price": 25},
  {id: 22, category: "Bebida", name: "Agua fresca de jamaica", "price": 45},
  {id: 23, category: "Bebida", name: "Agua fresca de limón con chía", "price": 45},
  {id: 24, category: "Guarnición", name: "Ensalada de atún", "price": 40},
  {id: 25, category: "Guarnición", name: "Ensalada de pollo", "price": 40},
  {id: 26, category: "Guarnición", name: "Sopa de tortilla", "price": 45},
  {id: 27, category: "Guarnición", name: "Consomé de pollo", "price": 35},
  {id: 28, category: "Guarnición", name: "Arroz rojo", "price": 35},
  {id: 29, category: "Guarnición", name: "Puré de papa", "price": 45},
  {id: 30, category: "Plato fuerte", name: "Bistec a la mexicana", "price": 88},
  {id: 31, category: "Plato fuerte", name: "Pechuga de pollo empanizada", "price": 88},
  {id: 32, category: "Plato fuerte", name: "Milanesa de res", "price": 88},
  {id: 33, category: "Plato fuerte", name: "Chuleta ahumada", "price": 88},
  {id: 34, category: "Plato fuerte", name: "Filete de pescado empanizado", "price": 88}
];

export async function loadMenuItems(): Promise<MenuItem[]> {
  try {
    const savedItems = localStorage.getItem('menuItems')
    if (savedItems) {
      return JSON.parse(savedItems)
    }
    return []
  } catch (error) {
    console.error('Error loading menu items:', error)
    return []
  }
}

// This function saves data to localStorage
export async function saveMenuItems(items: MenuItem[]): Promise<void> {
  try {
    localStorage.setItem('menuItems', JSON.stringify(items))
    return Promise.resolve()
  } catch (error) {
    console.error('Error saving menu items:', error)
    return Promise.reject(new Error('No se pudo guardar los platillos'))
  }
}