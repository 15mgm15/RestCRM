import dishesData from './db.json'

export interface Dish {
  id: number
  category: string
  name: string
  price: number
}

export async function getDishes(): Promise<Dish[]> {
  // In a real application, this would be an API call
  // For now, we're just returning the data from the JSON file
  return dishesData.dishes
}