'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { MenuItem } from '@/types/menu'
import { loadMenuItems, saveMenuItems } from '@/lib/menu-data'

interface FormErrors {
  name?: string;
  price?: string;
  category?: string;
}

export function ManageDishes() {
  const [dishes, setDishes] = useState<MenuItem[]>([])
  const [newDish, setNewDish] = useState<Partial<MenuItem>>({
    category: '',
    name: '',
    price: 0
  })
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadDishes = async () => {
      const loadedDishes = await loadMenuItems()
      setDishes(loadedDishes)
    }
    loadDishes()
  }, [])

  const validateDish = (dish: Partial<MenuItem>): FormErrors => {
    const errors: FormErrors = {}
    if (!dish.name) errors.name = "El nombre es requerido"
    if (!dish.price || dish.price <= 0) errors.price = "El precio debe ser mayor que 0"
    if (!dish.category) errors.category = "La categoría es requerida"
    return errors
  }

  const addDish = async () => {
    const validationErrors = validateDish(newDish)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      const dish: MenuItem = {
        id: Date.now(),
        name: newDish.name!,
        price: newDish.price!,
        category: newDish.category!
      }
      const updatedDishes = [...dishes, dish]
      await saveMenuItems(updatedDishes)
      setDishes(updatedDishes)
      setNewDish({ category: '', name: '', price: 0 })
      setErrors({})
      toast({
        title: "Platillo agregado",
        description: "El platillo se ha agregado exitosamente.",
        variant: "success",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el platillo. Por favor, intente de nuevo.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const deleteDish = async (id: number) => {
    try {
      const updatedDishes = dishes.filter(dish => dish.id !== id)
      await saveMenuItems(updatedDishes)
      setDishes(updatedDishes)
      toast({
        title: "Platillo eliminado",
        description: "El platillo se ha eliminado exitosamente.",
        variant: "success",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el platillo. Por favor, intente de nuevo.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const editDish = (dish: MenuItem) => {
    setEditingDish(dish)
    setIsDialogOpen(true)
  }

  const saveDishEdit = async () => {
    if (editingDish) {
      const validationErrors = validateDish(editingDish)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      try {
        const updatedDishes = dishes.map(dish => 
          dish.id === editingDish.id ? editingDish : dish
        )
        await saveMenuItems(updatedDishes)
        setDishes(updatedDishes)
        setEditingDish(null)
        setErrors({})
        setIsDialogOpen(false)
        toast({
          title: "Platillo actualizado",
          description: "El platillo se ha actualizado exitosamente.",
          variant: "success",
          duration: 3000,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo actualizar el platillo. Por favor, intente de nuevo.",
          variant: "destructive",
          duration: 3000,
        })
      }
    }
  }

  const filteredDishes = dishes
    .filter(dish => filter === 'all' || dish.category === filter)
    .filter(dish => dish.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gestionar Platillos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Agregar Nuevo Platillo</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Select 
                onValueChange={(value) => setNewDish(prev => ({ ...prev, category: value }))}
                value={newDish.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Guarnición">Guarnición</SelectItem>
                  <SelectItem value="Plato fuerte">Plato fuerte</SelectItem>
                  <SelectItem value="Bebida">Bebida</SelectItem>
                  <SelectItem value="Postre">Postre</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
            <div>
              <Input
                placeholder="Nombre del platillo"
                value={newDish.name}
                onChange={(e) => setNewDish(prev => ({ ...prev, name: e.target.value }))}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <Input
                type="number"
                placeholder="Precio"
                value={newDish.price || ''}
                onChange={(e) => setNewDish(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            <Button onClick={addDish}>Agregar Platillo</Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Buscar y Filtrar Platillos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Buscar platillo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="Guarnición">Guarnición</SelectItem>
                <SelectItem value="Plato fuerte">Plato fuerte</SelectItem>
                <SelectItem value="Bebida">Bebida</SelectItem>
                <SelectItem value="Postre">Postre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Lista de Platillos</h3>
          <ul className="space-y-2">
            {filteredDishes.map(dish => (
              <li key={dish.id} className="flex justify-between items-center border-b pb-2">
                <span>{dish.name}</span>
                <div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="mr-2" onClick={() => editDish(dish)}>Editar</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Platillo</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Nombre
                          </Label>
                          <div className="col-span-3">
                            <Input
                              id="name"
                              value={editingDish?.name || ''}
                              onChange={(e) => setEditingDish(prev => ({ ...prev!, name: e.target.value }))}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="price" className="text-right">
                            Precio
                          </Label>
                          <div className="col-span-3">
                            <Input
                              id="price"
                              type="number"
                              value={editingDish?.price || 0}
                              onChange={(e) => setEditingDish(prev => ({ ...prev!, price: parseFloat(e.target.value) || 0 }))}
                            />
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="category" className="text-right">
                            Categoría
                          </Label>
                          <div className="col-span-3">
                            <Select
                              value={editingDish?.category}
                              onValueChange={(value) => setEditingDish(prev => ({ ...prev!, category: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar categoría" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Guarnición">Guarnición</SelectItem>
                                <SelectItem value="Plato fuerte">Plato fuerte</SelectItem>
                                <SelectItem value="Bebida">Bebida</SelectItem>
                                <SelectItem value="Postre">Postre</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                          </div>
                        </div>
                      </div>
                      <Button onClick={saveDishEdit}>Guardar Cambios</Button>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" onClick={() => deleteDish(dish.id)}>Eliminar</Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}