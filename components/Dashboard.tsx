"use client"

import { useState, ChangeEvent, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ListOrderedIcon, XIcon } from "lucide-react"
import { db } from "../firebaseConfig"
import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from "firebase/firestore"

interface PantryItem {
  id: number;
  name: string;
  quantity: number;
  expirationDate: string;
  notificationType: string;
}

export function Dashboard() {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([])
  const [newItem, setNewItem] = useState<Omit<PantryItem, 'id'>>({
    name: "",
    quantity: 1,
    expirationDate: "",
    notificationType: "expiration",
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<keyof PantryItem>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const pantryCollection = collection(db, 'pantryItems')

  useEffect(() => {
    const fetchPantryItems = async () => {
      const querySnapshot = await getDocs(pantryCollection)
      const items: PantryItem[] = querySnapshot.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data() as Omit<PantryItem, 'id'>
      }))
      setPantryItems(items)
    }
    fetchPantryItems()
  }, [])

  const handleAddItem = async () => {
    if (newItem.name.trim() !== "") {
      try {
        const docRef = await addDoc(pantryCollection, newItem)
        const newItemWithId = { ...newItem, id: parseInt(docRef.id) }
        setPantryItems([...pantryItems, newItemWithId])
        setNewItem({ name: "", quantity: 1, expirationDate: "", notificationType: "expiration" })
        setShowAddForm(false)
      } catch (error) {
        console.error("Error adding item:", error)
      }
    }
  }

  const handleEditItem = async (id: number, updates: Partial<PantryItem>) => {
    try {
      const docRef = doc(db, 'pantryItems', id.toString())
      await updateDoc(docRef, updates)
      setPantryItems(pantryItems.map(item => item.id === id ? { ...item, ...updates } : item))
    } catch (error) {
      console.error("Error updating item:", error)
    }
  }

  const handleDeleteItem = async (id: number) => {
    try {
      const docRef = doc(db, 'pantryItems', id.toString())
      await deleteDoc(docRef)
      setPantryItems(pantryItems.filter(item => item.id !== id))
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSort = (column: keyof PantryItem) => {
    if (column === sortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDirection("asc")
    }
  }

  const filteredItems = pantryItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const sortedItems = filteredItems.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortDirection === "asc" ? -1 : 1
    if (a[sortBy] > b[sortBy]) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const totalItems = pantryItems.length
  const itemsExpiringSoon = pantryItems.filter(
    (item) => new Date(item.expirationDate) < new Date(Date.now() + 30 * 86400000),
  ).length
  const itemsLowQuantity = pantryItems.filter((item) => item.quantity <= 3).length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Pantry Management</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2">Add New Item</h2>
            {showAddForm && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleAddItem()
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 relative"
              >
                <button
                  type="button"
                  className="absolute top-2 right-2 text-muted-foreground hover:text-primary"
                  onClick={() => setShowAddForm(false)}
                >
                  <XIcon className="w-5 h-5" />
                </button>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  required
                />
                <Input
                  id="expirationDate"
                  type="date"
                  value={newItem.expirationDate}
                  onChange={(e) => setNewItem({ ...newItem, expirationDate: e.target.value })}
                  required
                />
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  required
                />
                <Button type="submit" className="w-full md:col-span-2">
                  Add Item
                </Button>
              </form>
            )}
            {!showAddForm && (
              <Button onClick={() => setShowAddForm(true)} className="w-full md:col-span-2">
                Add New Item
              </Button>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Dashboard</h2>
            <Card className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="text-lg font-bold">Total Items</h3>
                  <p className="text-4xl font-bold">{totalItems}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Expiring Soon</h3>
                  <p className="text-4xl font-bold">{itemsExpiringSoon}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Low Quantity</h3>
                  <p className="text-4xl font-bold">{itemsLowQuantity}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Pantry Items</h2>
        <div className="flex items-center justify-between mb-4">
          <Input placeholder="Search items..." value={searchTerm} onChange={handleSearch} className="w-full max-w-md" />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleSort("name")}>
              <ListOrderedIcon className="w-4 h-4 mr-2" />
              Sort by Name
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSort("expirationDate")}>
              <ListOrderedIcon className="w-4 h-4 mr-2" />
              Sort by Expiration
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSort("quantity")}>
              <ListOrderedIcon className="w-4 h-4 mr-2" />
              Sort by Quantity
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Expiration Date</TableHead>
              <TableHead>Notification Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Input value={item.name} onChange={(e) => handleEditItem(item.id, { name: e.target.value })} />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleEditItem(item.id, { quantity: Number(e.target.value) })}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="date"
                    value={item.expirationDate}
                    onChange={(e) => handleEditItem(item.id, { expirationDate: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={item.notificationType}
                    onValueChange={(value) => handleEditItem(item.id, { notificationType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expiration">Expiration</SelectItem>
                      <SelectItem value="quantity">Quantity</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => handleDeleteItem(item.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
