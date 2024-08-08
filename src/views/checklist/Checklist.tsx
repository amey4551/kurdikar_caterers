import React, { useState, useEffect } from 'react';
import { FaUndoAlt, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Checkbox } from '@/components/ui';
import { supabase } from '@/backend/supabaseClient';
import { useParams } from 'react-router-dom';

type Item = {
  id: string;
  text: string;
  count?: number;
};

const fetchOrderData = async (orderId: string) => {
  const { data, error } = await supabase
    .from('order_datetime_details')
    .select(`
      *,
      order_food_items:order_food_items (
        food_item_data:food_item_data (*)
      )
    `)
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('Error fetching order details:', error);
    return null;
  }

  return data;
};

const Checklist: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Item[]>([]);
  const [checkListItems, setCheckListItems] = useState<Item[]>([]);
  const { id: orderId } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchOrderData(orderId as string);
      console.log('ggg',data);
      if (data) {
        const items = [
          { id: "1", text: "plates", count: data.people_count },
          { id: "2", text: "spoon", count: data.people_count },
          { id: "3", text: "bowl", count: data.people_count },
          { id: "4", text: "chafing dish", count: data.order_food_items.filter((item: any) => item.food_item_data.cutlery_type === "chafing_dish").length },
          { id: "5", text: "platters", count: data.order_food_items.filter((item: any) => item.food_item_data.cutlery_type === "platter").length },
          { id: "6", text: "tong", count: data.order_food_items.filter((item: any) => item.food_item_data.serving_spoon === "tong").length },
          { id: "7", text: "round serving spoon", count: data.order_food_items.filter((item: any) => item.food_item_data.serving_spoon === "serving_spoon_round").length },
          { id: "8", text: "flat serving spoon", count: data.order_food_items.filter((item: any) => item.food_item_data.serving_spoon === "serving_spoon_flat").length },
          { id: "9", text: "small serving spoon", count: data.order_food_items.filter((item: any) => item.food_item_data.serving_spoon === "serving_spoon_small").length },
          { id: "10", text: "large serving spoon", count: data.order_food_items.filter((item: any) => item.food_item_data.serving_spoon === "serving_spoon_large").length },
          { id: "11", text: "water bottle", count: Math.floor(data.people_count / 100) },
          { id: "12", text: "table", count: Math.floor((data.order_food_items.length + 1) / 4 ) },
          { id: "13", text: "table cloth", count: Math.floor((data.order_food_items.length + 1) / 4 ) },
          { id: "14", text: "tissue paper", count: Math.floor((data.people_count + 120) / 60) },
          { id: "15", text: "name tag", count: '' },
          { id: "16", text: "water dispenser", count: Math.floor(data.people_count / 100) },
          { id: "17", text: "water bottle stand", count: Math.floor(data.people_count / 100) },
        ];
        const conditionalItems = [
          { id: "1", text: "sol curry", count: data.people_count },
          { id: "2", text: "scoop", count: data.people_count },
          { id: "3", text: "pickel container", count: data.people_count },
        ];
        setCheckListItems(items);
      }
    };

    fetchData();
  }, [orderId]);

  const toggleItem = (item: Item) => {
    setCheckedItems(prev =>
      prev.some(i => i.id === item.id)
        ? prev.filter(i => i.id !== item.id)
        : [...prev, item]
    );
  };

  const deselectAll = () => setCheckedItems([]);

  const uncheckedItems = checkListItems.filter(item => !checkedItems.some(i => i.id === item.id));
  const packedItems = checkListItems.filter(item => checkedItems.some(i => i.id === item.id));

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-2/3 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Catering Checklist</h2>
              <button
                onClick={deselectAll}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200"
              >
                <FaUndoAlt className="mr-2" />
                Deselect All
              </button>
            </div>
            <ul className="space-y-4">
  <AnimatePresence>
    {uncheckedItems.map(item => (
      <motion.li
        key={item.id}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={`flex items-center p-4 rounded-lg shadow-sm transition-all duration-200 ease-in-out cursor-pointer ${checkedItems.some(i => i.id === item.id) ? 'bg-blue-50 text-gray-500' : 'bg-white hover:bg-gray-50'}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleItem(item);
        }}
      >
        <Checkbox
          checked={checkedItems.some(i => i.id === item.id)}
          onChange={() => toggleItem(item)}
          className="flex-1"
        >
          <div className="flex justify-between items-center">
            <div className="text-base font-medium capitalize">{item.text}</div>
            <div className="text-sm font-semibold text-gray-600 ml-4"> {item.count}</div>
          </div>
        </Checkbox>
      </motion.li>
    ))}
  </AnimatePresence>
</ul>
          </div>
          <div className="w-full lg:w-1/3 p-6 lg:p-8 bg-gray-50">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Packed Items</h2>
            <ul className="space-y-3">
              <AnimatePresence>
                {packedItems.map(item => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between bg-white p-4 rounded-lg text-gray-600 shadow-sm"
                  >
                    <div className="flex items-center">
                      <span>{item.text}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleItem(item)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <FaTrash />
                    </motion.button>
                  </motion.li>
                ))}
              </AnimatePresence>
              {packedItems.length === 0 && (
                <p className="text-gray-500 italic">No items packed yet.</p>
              )}
            </ul>
            {checkedItems.length === checkListItems.length && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => alert('All items packed!')}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checklist;