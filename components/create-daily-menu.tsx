'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DailyMenu, MenuItem } from '@/types/menu'
import { loadMenuItems } from '@/lib/menu-data'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CreateDailyMenuProps {
  onMenuCreated: (menu: DailyMenu) => void
}

export function CreateDailyMenu({ onMenuCreated }: CreateDailyMenuProps) {
  const [menu, setMenu] = useState<DailyMenu | null>(null)
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([])
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    category: '',
    name: '',
    price: 0,
    isEconoplatillo: false
  })
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const items = await loadMenuItems()
      setAllMenuItems(items)
    }
    loadData()

    const savedMenu = localStorage.getItem('dailyMenu')
    if (savedMenu) {
      setMenu(JSON.parse(savedMenu))
    } else {
      setMenu({
        date: new Date().toISOString().split('T')[0],
        appetizers: [],
        soups: [],
        sideDishes: [],
        mainCourses: [],
        drinks: [],
        desserts: []
      })
    }
  }, [])

  useEffect(() => {
    if (menu) {
      localStorage.setItem('dailyMenu', JSON.stringify(menu))
    }
  }, [menu])

  const handleItemSelect = (item: MenuItem) => {
    setNewItem({
      category: item.category,
      name: item.name,
      price: item.price,
      isEconoplatillo: item.category === 'mainCourses' ? false : undefined
    })
    setIsSearchOpen(false)
  }

  const addMenuItem = () => {
    if (!newItem.category || !newItem.name || !newItem.price) return

    const itemToAdd: MenuItem = {
      id: Date.now(),
      name: newItem.name,
      price: newItem.price,
      category: newItem.category,
      isEconoplatillo: newItem.category === 'mainCourses' ? !!newItem.isEconoplatillo : false
    }

    setMenu(prev => ({
      ...prev!,
      [newItem.category]: [...(prev![newItem.category as keyof DailyMenu] as MenuItem[]), itemToAdd]
    }))

    // Add to allMenuItems if it's a new item
    if (!allMenuItems.some(item => item.name === itemToAdd.name && item.category === itemToAdd.category)) {
      setAllMenuItems(prev => [...prev, itemToAdd])
    }

    setNewItem({
      category: '',
      name: '',
      price: 0,
      isEconoplatillo: false
    })
  }

  if (!menu) return null

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Menú del Día - {menu.date}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Agregar Platillo al Menú</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select 
                value={newItem.category} 
                onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appetizers">Entradas</SelectItem>
                  <SelectItem value="soups">Sopas</SelectItem>
                  <SelectItem value="sideDishes">Guarniciones</SelectItem>
                  <SelectItem value="mainCourses">Platos Principales</SelectItem>
                  <SelectItem value="drinks">Bebidas</SelectItem>
                  <SelectItem value="desserts">Postres</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="name">Nombre del Platillo</Label>
              <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <PopoverTrigger asChild>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Buscar o agregar nuevo platillo"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar platillo..." />
                    <CommandEmpty>No se encontraron platillos.</CommandEmpty>
                    <CommandGroup>
                      {allMenuItems
                        .filter(item => item.name.toLowerCase().includes(newItem.name.toLowerCase()))
                        .map((item) => (
                          <CommandItem
                            key={item.id}
                            onSelect={() => handleItemSelect(item)}
                          >
                            {item.name} - ${item.price}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="number"
                value={newItem.price || ''}
                onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="Precio"
              />
            </div>
          </div>

          {newItem.category === 'mainCourses' && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isEconoplatillo" 
                checked={newItem.isEconoplatillo}
                onCheckedChange={(checked) => 
                  setNewItem(prev => ({ ...prev, isEconoplatillo: checked as boolean }))
                }
              />
              <Label htmlFor="isEconoplatillo">Econoplatillo</Label>
            </div>
          )}
          
          <Button 
            onClick={addMenuItem}
            disabled={!newItem.category || !newItem.name || !newItem.price}
          >
            Agregar Platillo
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Menú Actual</h3>
          {Object.entries(menu).map(([category, items]) => (
            category !== 'date' && (
              <div key={category} className="space-y-2">
                <h4 className="text-md font-semibold capitalize">
                  {category === 'appetizers' && 'Entradas'}
                  {category === 'soups' && 'Sopas'}
                  {category === 'sideDishes' && 'Guarniciones'}
                  {category === 'mainCourses' && 'Platos Principales'}
                  {category === 'drinks' && 'Bebidas'}
                  {category === 'desserts' && 'Postres'}
                </h4>
                <ul className="space-y-1">
                  {(items as MenuItem[]).map(item => (
                    <li key={item.id} className="flex justify-between items-center">
                      <span>{item.name}</span>
                      <span className="text-muted-foreground">
                        ${item.price}
                        {item.isEconoplatillo && ' (Econoplatillo)'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onMenuCreated(menu)}>Guardar Menú</Button>
      </CardFooter>
    </Card>
  )
}