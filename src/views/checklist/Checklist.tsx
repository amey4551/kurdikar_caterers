import React, { useState, useEffect } from 'react'
import { FaUndoAlt, FaTrash, FaPrint } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, Checkbox, Tag } from '@/components/ui'
import { FaCheck } from 'react-icons/fa'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

type Item = {
    id: string
    text: string
    count?: number
}

const Checklist: React.FC<any> = ({ data }) => {
    const [checkedItems, setCheckedItems] = useState<Item[]>([])
    const [checkListItems, setCheckListItems] = useState<Item[]>([])

    useEffect(() => {
        if (data) {
            const items = [
                { id: '1', text: 'plates', count: data.people_count },
                { id: '2', text: 'spoon', count: data.people_count },
                { id: '3', text: 'bowl', count: data.people_count },
                {
                    id: '4',
                    text: 'chafing dish',
                    count: data.order_food_items.filter(
                        (item: any) =>
                            item.food_item_data.cutlery_type === 'chafing_dish'
                    ).length,
                },
                {
                    id: '5',
                    text: 'platters',
                    count: data.order_food_items.filter(
                        (item: any) =>
                            item.food_item_data.cutlery_type === 'platter'
                    ).length,
                },
                {
                    id: '6',
                    text: 'tong',
                    count: data.order_food_items.filter(
                        (item: any) =>
                            item.food_item_data.serving_spoon === 'tong'
                    ).length,
                },
                {
                    id: '7',
                    text: 'round serving spoon',
                    count: data.order_food_items.filter(
                        (item: any) =>
                            item.food_item_data.serving_spoon ===
                            'serving_spoon_round'
                    ).length,
                },
                {
                    id: '8',
                    text: 'flat serving spoon',
                    count: data.order_food_items.filter(
                        (item: any) =>
                            item.food_item_data.serving_spoon ===
                            'serving_spoon_flat'
                    ).length,
                },
                {
                    id: '9',
                    text: 'small serving spoon',
                    count: data.order_food_items.filter(
                        (item: any) =>
                            item.food_item_data.serving_spoon ===
                            'serving_spoon_small'
                    ).length,
                },
                {
                    id: '10',
                    text: 'large serving spoon',
                    count: data.order_food_items.filter(
                        (item: any) =>
                            item.food_item_data.serving_spoon ===
                            'serving_spoon_large'
                    ).length,
                },
                {
                    id: '11',
                    text: 'water bottle',
                    count: Math.floor(data.people_count / 100),
                },
                {
                    id: '12',
                    text: 'table',
                    count: Math.floor((data.order_food_items.length + 1) / 4),
                },
                {
                    id: '13',
                    text: 'table cloth',
                    count: Math.floor((data.order_food_items.length + 1) / 4),
                },
                {
                    id: '14',
                    text: 'tissue paper',
                    count: Math.floor((data.people_count + 120) / 60),
                },
                { id: '15', text: 'name tag', count: undefined },
                {
                    id: '16',
                    text: 'water dispenser',
                    count: Math.floor(data.people_count / 100),
                },
                {
                    id: '17',
                    text: 'water bottle stand',
                    count: Math.floor(data.people_count / 100),
                },
            ]
            setCheckListItems(items)
        }
    }, [data])

    const toggleItem = (item: Item) => {
        setCheckedItems((prev) =>
            prev.some((i) => i.id === item.id)
                ? prev.filter((i) => i.id !== item.id)
                : [...prev, item]
        )
    }

    const deselectAll = () => setCheckedItems([])

    const uncheckedItems = checkListItems.filter(
        (item) => !checkedItems.some((i) => i.id === item.id)
    )
    const packedItems = checkListItems.filter((item) =>
        checkedItems.some((i) => i.id === item.id)
    )

    const printChecklist = () => {
        const doc: any = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        })

        // Add a subtle background color
        doc.setFillColor(250, 250, 250)
        doc.rect(
            0,
            0,
            doc.internal.pageSize.width,
            doc.internal.pageSize.height,
            'F'
        )

        // Add a compact header
        doc.setFillColor(41, 128, 185)
        doc.rect(0, 0, doc.internal.pageSize.width, 20, 'F')

        doc.setTextColor(255, 255, 255)
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text('Catering Checklist', 10, 13)

        // Improved order details layout
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')

        const detailsStartY = 25
        const columnWidth = doc.internal.pageSize.width / 3

        // Function to add a detail row
        const addDetailRow = (
            label: string,
            value: string,
            x: number,
            y: number
        ) => {
            doc.setFont('helvetica', 'normal')
            doc.text(label, x, y)
            doc.setFont('helvetica', 'bold')
            doc.text(value, x, y + 5)
        }

        // First row
        addDetailRow('Date:', data.order_date, 10, detailsStartY)
        addDetailRow('Time:', data.order_time, 10 + columnWidth, detailsStartY)
        addDetailRow(
            'Client:',
            data.client_name,
            10 + 2 * columnWidth,
            detailsStartY
        )

        // Second row
        addDetailRow('Location:', data.order_location, 10, detailsStartY + 15)
        addDetailRow(
            'Occasion:',
            data.order_occasion,
            10 + columnWidth,
            detailsStartY + 15
        )
        addDetailRow(
            'No. of People:',
            data.people_count.toString(),
            10 + 2 * columnWidth,
            detailsStartY + 15
        )

        // Add the checklist as a compact table
        doc.autoTable({
            startY: detailsStartY + 30,
            head: [['Item', 'Count', '✓']],
            body: uncheckedItems.map((item) => [
                item.text.charAt(0).toUpperCase() + item.text.slice(1),
                item.count || 'N/A',
                '', // Empty string for checkbox
            ]),
            styles: {
                cellPadding: 2,
                fontSize: 9,
                valign: 'middle',
                overflow: 'linebreak',
                cellWidth: 'wrap',
            },
            headStyles: {
                fillColor: [52, 152, 219],
                textColor: 255,
                fontStyle: 'bold',
            },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 25, halign: 'center' },
                2: { cellWidth: 15, halign: 'center' },
            },
            didDrawCell: (data: any) => {
                if (data.column.index === 2 && data.cell.section === 'body') {
                    const dim = data.cell.height - 3
                    const x = data.cell.x + 2
                    const y = data.cell.y + 2
                    doc.rect(x, y, dim, dim)
                }
            },
            margin: { left: 10, right: 10 },
        })

        // Add a compact footer
        doc.setFontSize(8)
        doc.text(
            `Page 1 of 1`,
            doc.internal.pageSize.width - 20,
            doc.internal.pageSize.height - 10,
            { align: 'right' }
        )

        // Save the PDF
        doc.save('catering_checklist.pdf')
    }

    return (
    <div className="min-h-screen bg-gray-100 p-4">
        <div className="mx-auto bg-white rounded-lg overflow-hidden">
            {data.order_food_items.length ? (
                <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-2/3 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Order Checklist
                            </h2>
                            <div className="flex items-center space-x-4">
                                <Button
                                    onClick={deselectAll}
                                    variant="default"
                                    size="sm"
                                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200"
                                >
                                    <FaUndoAlt className="mr-2" />
                                    Deselect All
                                </Button>
                                <Button
                                    variant="solid"
                                    size="sm"
                                    icon={<FaPrint className="mr-2" />}
                                    onClick={printChecklist}
                                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200"
                                >
                                    Print Checklist
                                </Button>
                            </div>
                        </div>
                        <div>
                            {uncheckedItems.length ? (
                                <div className="w-full">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="w-20 text-left py-3 px-4">&nbsp;*</th>
                                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Item</th>
                                            <th className=" text-right py-3 px-4 text-gray-600 font-medium">Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <AnimatePresence>
                                            {uncheckedItems.map((item, index) => (
                                                <motion.tr
                                                    key={item.id}
                                                    initial={{ opacity: 0, y: -10 }}        
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className={`border-b ${
                                                       index % 2 === 0 ? 'bg-slate-100' : ''
                                                    }`}
                                                >
                                                    <td className="py-3 px-4">
                                                        <div 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleItem(item);
                                                            }}
                                                            className="cursor-pointer"
                                                        >
                                                            <Checkbox
                                                                checked={checkedItems.some((i) => i.id === item.id)}
                                                                onChange={() => {}} // Empty onChange as we handle click in parent div
                                                            />
                                                        </div>
                                                    </td>
                                                    <td 
                                                        className="py-3 px-4 cursor-pointer"
                                                        onClick={() => toggleItem(item)}
                                                    >
                                                        <span className="text-base font-medium capitalize">
                                                            {item.text}
                                                        </span>
                                                    </td>
                                                    <td 
                                                        className="py-3 px-4 text-right cursor-pointer"
                                                        onClick={() => toggleItem(item)}
                                                    >
                                                        <span className="text-sm font-semibold text-gray-600">
                                                            {item.count}
                                                        </span>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                            ) : (
                                <div className="flex flex-row mt-96 justify-center items-center gap-3">
                                    <h2 className="text-gray-700">You are all packed up</h2>
                                    <FaCheck size={30} className="text-green-500" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-full lg:w-2/3 p-6 lg:p-8 bg-gray-50">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">
                            Packed Items
                        </h2>
                        <ul className="space-y-3">
                            <AnimatePresence>
                                {packedItems.map((item) => (
                                    <motion.li
                                        key={item.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center justify-between bg-white p-2 rounded-lg text-gray-600 shadow-sm"
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className="capitalize font-semibold">
                                                {item.text}
                                            </span>
                                            <div className="mr-5">
                                                <Tag prefixClass="bg-indigo-500">
                                                    <h6>{item.count}</h6>
                                                </Tag>
                                            </div>
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
                                <div className="text-center text-gray-500">
                                    No packed items
                                </div>
                            )}
                        </ul>
                    </div>
                </div>
            ) : (
                <Card className="h-full py-48 w-full flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <svg
                            className="mx-auto h-16 w-16 text-red-500 mb-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h1m0 4h1v-4h-1m1-4h1m-1 0H12m-1 0H9m4 0H9m-2 0H7m-4 0h4v4H7V8M12 8h-1V4h1v4zm0 4h1m-1-4h1"
                            />
                        </svg>  

                        <h2 className="text-2xl font-semibold text-gray-700">
                            Kindly select a menu to proceed further
                        </h2>

                        <p className="text-sm text-gray-500 mt-4">
                            It seems you haven't chosen a menu. Please
                            go back to the <b>order details</b> tab.
                        </p>
                    </div>
                </Card>
            )}
        </div>
    </div>
)
}

export default Checklist
