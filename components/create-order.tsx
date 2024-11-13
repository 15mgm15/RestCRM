'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DailyMenu, MenuItem, Order } from '@/types/menu'

interface CreateOrderProps {
  menu: DailyMenu
}

export function CreateOrder({ menu }: CreateOrderProps) {
  const [order, setOrder] = useState<Order>({
    id: Date.now(),
    items: [],
    total: 0,
    notes: ''
  })

  const addToOrder = (item: MenuItem) => {
    setOrder(prev => ({
      ...prev,
      items: [...prev.items, item],
      total: prev.total + item.price
    }))
  }

  const removeFromOrder = (index: number) => {
    setOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
      total: prev.total - prev.items[index].price
    }))
  }

  const updateNotes = (notes: string) => {
    setOrder(prev => ({ ...prev, notes }))
  }

  const submitOrder = () => {
    console.log('Submitting order:', order)
    // Here you would typically send the order to a server
    setOrder({
      id: Date.now(),
      items: [],
      total: 0,
      notes: ''
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Order - {menu.date}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Menu</h3>
            {Object.entries(menu).map(([category, items]) => (
              category !== 'date' && (
                <div key={category}>
                  <h4 className="text-md font-semibold capitalize">{category}</h4>
                  <ul>
                    {(items as MenuItem[]).map(item => (
                      <li key={item.id} className="flex justify-between items-center">
                        <span>
                          {item.name} - ${item.price}
                          {item.isEconoplatillo && ' (Econoplatillo)'}
                        </span>
                        <Button onClick={() => addToOrder(item)}>Add</Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Order</h3>
            <ul>
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>
                    {item.name} - ${item.price}
                    {item.isEconoplatillo && ' (Econoplatillo)'}
                  </span>
                  <Button variant="destructive" onClick={() => removeFromOrder(index)}>Remove</Button>
                </li>
              ))}
            </ul>
            <div>
              <Label htmlFor="notes">Order Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special requests?"
                value={order.notes}
                onChange={(e) => updateNotes(e.target.value)}
              />
            </div>
            <div className="text-xl font-bold">
              Total: ${order.total}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={submitOrder} disabled={order.items.length === 0}>Submit Order</Button>
      </CardFooter>
    </Card>
  )
}