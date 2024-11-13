'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateDailyMenu } from '@/components/create-daily-menu'
import { CreateOrder } from '@/components/create-order'
import { ManageDishes } from '@/components/manage-dishes'
import { DailyMenu } from '@/types/menu'

export default function RestaurantManagementSystem() {
  const [currentMenu, setCurrentMenu] = useState<DailyMenu | null>(null)

  const handleMenuCreated = (menu: DailyMenu) => {
    setCurrentMenu(menu)
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">Sistema de Gestión de Restaurante</h1>
      <Tabs defaultValue="manage-dishes">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manage-dishes">Gestionar Platillos</TabsTrigger>
          <TabsTrigger value="create-menu">Crear Menú</TabsTrigger>
          <TabsTrigger value="create-order" disabled={!currentMenu}>Crear Pedido</TabsTrigger>
        </TabsList>
        <TabsContent value="manage-dishes">
          <ManageDishes />
        </TabsContent>
        <TabsContent value="create-menu">
          <CreateDailyMenu onMenuCreated={handleMenuCreated} />
        </TabsContent>
        <TabsContent value="create-order">
          {currentMenu && <CreateOrder menu={currentMenu} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}