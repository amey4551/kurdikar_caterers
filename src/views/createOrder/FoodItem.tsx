import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { supabase } from '@/backend/supabaseClient'
import { Notification, Spinner, toast } from '@/components/ui'
import { FoodItemType } from '@/@types/createOrder.type'
import { FaTrash } from 'react-icons/fa'

const foodCategories = ['Rice', 'Gravy', 'Bhaji', 'Dessert']

const openNotification = (type :  'success' | 'warning' | 'danger' | 'info',title : string) => {
    toast.push(
        <Notification
            title={type.charAt(0).toUpperCase() + type.slice(1)}
            type={type}
            width={500}
        >
            {title}
        </Notification>
    )
}

const FoodItem: React.FC<any> = ({ selectedItems, setSelectedItems }) => {
    const [activeCategory, setActiveCategory] = useState<string>(
        foodCategories[0]
    )
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [foodItems, setFoodItems] = useState<FoodItemType[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    // Toggle selected items by checking the item's id
    const toggleItem = (
        event: React.MouseEvent<HTMLDivElement>,
        item: FoodItemType
    ) => {
        event.preventDefault()
        setSelectedItems(
            (prev: FoodItemType[]) =>
                prev.some((i) => i.id === item.id)
                    ? prev.filter((i) => i.id !== item.id) // Remove if already selected
                    : [...prev, item] // Add if not selected
        )
    }

    // Fetch food items from Supabase
    const fetchFoodItems = async () => {
        const { data, error } = await supabase
            .from('food_item_data')
            .select('*')

        if (error) {
            openNotification('danger','Error fetching food items')
        } else {
            setFoodItems(data as FoodItemType[])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchFoodItems()
    }, [])

    // Filter items based on the search term
    const filteredItems = foodItems.filter((item) =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Sort items: first show selected items, then unselected items
    const sortedItems = [
        ...filteredItems.filter((item) =>
            selectedItems.some((selected : any) => selected.id === item.id)
        ),
        ...filteredItems.filter(
            (item) =>
                !selectedItems.some((selected : any) => selected.id === item.id)
        ),
    ]

    const deleteItem = (item: FoodItemType) => {
        setSelectedItems((prev: FoodItemType[]) => 
            prev.filter((selectedItem) => selectedItem.id !== item.id)
        )
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-full p-8">
                <div className="flex items-center mb-6 justify-between">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Food Menu
                    </h1>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="text-gray-400 p-2"
                        />
                        <input
                            type="text"
                            placeholder="Search food items..."
                            className="ml-1 p-2 border-none placeholder-gray-400 focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex mb-8 space-x-4 overflow-x-auto pb-2">
                    {foodCategories.map((category, index) => (
                        <motion.button
                            key={index}
                            className={`px-4 py-2 rounded-full ${
                                activeCategory === category
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-800'
                            }`}
                            onClick={() => setActiveCategory(category)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {category}
                        </motion.button>
                    ))}
                </div>

                <div className="my-6 flex flex-col space-y-4 h-4/6 overflow-y-auto scrollbar-thin scrollbar-thumb-scrollbar-thumb scrollbar-track-scrollbar-track">
                    {!loading &&
                        sortedItems.map((item, index) => (
                            <motion.div
                                key={index}
                                className={`bg-white ml-4 p-4 rounded-lg w-11/12 shadow-md cursor-pointer flex items-center space-x-4 ${
                                    selectedItems.some(
                                        (i : any) => i.id === item.id
                                    )
                                        ? 'ring-2 ring-blue-500'
                                        : ''
                                }`}
                                onClick={(event) => toggleItem(event, item)}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="w-11 h-11 bg-gray-300 rounded-md overflow-hidden">
                                    {/* Optional: Add image if you have it */}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl text-gray-800 capitalize">
                                        {item.item_name}
                                    </h3>
                                </div>
                                <div>
                                    {selectedItems.some(
                                        (i : any) => i.id === item.id
                                    ) && (
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            className="text-green-500 text-xl font-bold"
                                        />
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    {loading && (
                        <Spinner className="flex justify-center items-center" />
                    )}
                </div>
            </div>

            <div className="w-1/4 bg-white p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Selected Items
                </h2>
                {selectedItems.length === 0 ? (
                    <p className="text-gray-600">No items selected yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {selectedItems.map((item: FoodItemType, index: number) => (
                            <motion.li
                                key={index}
                                className="flex justify-between items-center bg-gray-100 p-2 rounded capitalize"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                            >
                                <span>{item.item_name}</span>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteItem(item);
                                    }}
                                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                >
                                    <FaTrash />
                                </motion.button>
                            </motion.li>
                        ))}
                    </ul>
                )}
                <div className="mt-4 pt-4 border-t"></div>
            </div>
        </div>
    )
}

export default FoodItem