import { jsPDF } from 'jspdf'
import { Card, Skeleton } from '@/components/ui'
import { useState } from 'react'

const NameTag: React.FC<any> = ({ data, loading }) => {
    const [itemWidth, setItemWidth] = useState(100) // Default item width
    const [itemHeight, setItemHeight] = useState(50) // Default item height
    const [useCustomSize, setUseCustomSize] = useState(false) // State for the checkbox
    const [customFontSize, setCustomFontSize] = useState(25) // State for the custom font size

    const handlePrint = () => {
        const doc = new jsPDF()
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()

        let x = 10 // Starting X position with a margin of 10 mm
        let y = 10 // Starting Y position with a margin of 10 mm

        data.forEach((item: any, index: number) => {
            const itemName = item.food_item_data.item_name.toUpperCase() // Convert item name to uppercase

            // Calculate available width on the current page
            const availableWidth = pageWidth - x

            // Check if item fits in the available width
            if (itemWidth > availableWidth) {
                // Move to the next page if item width exceeds available width
                doc.addPage()
                x = 10 // Reset X position to start with margin
                y = 10 // Reset Y position to start with margin
            }

            // Draw item background
            doc.setFillColor(227, 234, 255) // Set background color to light gray
            doc.rect(x, y, itemWidth, itemHeight, 'F') // Draw the background rectangle

            // Calculate maximum font size that fits within the item dimensions
            const maxFontSize = useCustomSize
                ? customFontSize
                : getMaxFontSize(doc, itemName, itemWidth, itemHeight)

            // Calculate the width of the text at the maximum font size
            const textWidth =
                (doc.getStringUnitWidth(itemName) * maxFontSize) /
                doc.internal.scaleFactor

            // Calculate the position to center the text horizontally within the item
            const textX = x + (itemWidth - textWidth) / 2 // Center text horizontally

            // Add item name with calculated font size and centered text position
            doc.setFontSize(maxFontSize)
            doc.text(itemName, textX, y + itemHeight / 2, {
                align: 'left',
                maxWidth: itemWidth,
            })

            // Move to the next position
            x += itemWidth + 10 // Add a horizontal gap of 10 mm between items
            if (x + itemWidth > pageWidth) {
                x = 10 // Reset X position to start with margin
                y += itemHeight + 10 // Add a vertical gap of 10 mm between rows

                // Check if next item fits on the current page; if not, add a new page
                if (y + itemHeight > pageHeight) {
                    doc.addPage()
                    x = 10 // Reset X position to start with margin
                    y = 10 // Reset Y position to start with margin
                }
            }
        })

        doc.save('menu.pdf')
    }

    // Function to calculate maximum font size that fits within the item dimensions
    function getFontSize(maxWidth: number, maxHeight: number) {
        const baseWidth = 120
        const baseHeight = 60
        const baseFontSize = 25

        const fontSizeForWidth = maxWidth * (baseFontSize / baseWidth)
        const fontSizeForHeight = maxHeight * (baseFontSize / baseHeight)

        return Math.min(fontSizeForWidth, fontSizeForHeight)
    }

    const getMaxFontSize = (
        doc: any,
        text: string,
        maxWidth: number,
        maxHeight: number
    ) => {
        const finalFontSize = getFontSize(maxWidth, maxHeight)
        return finalFontSize
    }

    // Preset size combinations
    const presetSizes = [
        { width: 100, height: 50, label: 'Default' },
        { width: 80, height: 40, label: 'Small' },
        { width: 120, height: 60, label: 'Medium' },
        { width: 150, height: 75, label: 'Large' },
    ]

    // Function to handle preset size selection
    const handlePresetSizeChange = (index: number) => {
        const selectedSize = presetSizes[index]
        setItemWidth(selectedSize.width)
        setItemHeight(selectedSize.height)
    }

    return (
        <div className=" bg-gray-100 flex items-center justify-center p-5 font-sans">
            {data.length ? (
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                        Menu
                    </h1>
                    {!loading ? (
                        <ul className="mb-6">
                            {data.map((item: any) => (
                                <li
                                    key={item.id}
                                    className="text-lg mb-2 text-gray-700"
                                >
                                    {item.food_item_data.item_name.toUpperCase()}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col gap-4 my-3">
                            <div className="flex items-center gap-4">
                                <div>
                                    <Skeleton variant="circle" />
                                </div>
                                <Skeleton />
                            </div>
                            <div className="flex items-center gap-4">
                                <div>
                                    <Skeleton variant="circle" />
                                </div>
                                <Skeleton />
                            </div>
                            <div className="flex items-center gap-4">
                                <div>
                                    <Skeleton variant="circle" />
                                </div>
                                <Skeleton />
                            </div>
                            <div className="flex items-center gap-4">
                                <div>
                                    <Skeleton variant="circle" />
                                </div>
                                <Skeleton />
                            </div>
                            <div className="flex items-center gap-4">
                                <div>
                                    <Skeleton variant="circle" />
                                </div>
                                <Skeleton />
                            </div>
                        </div>
                    )}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2">
                            Preset Sizes:
                        </label>
                        <div className="flex flex-col space-y-2 ">
                            {presetSizes.map((size, index) => (
                                <label
                                    key={index}
                                    className="flex items-center cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="presetSize"
                                        checked={
                                            itemWidth === size.width &&
                                            itemHeight === size.height
                                        }
                                        onChange={() =>
                                            handlePresetSizeChange(index)
                                        }
                                        className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out cursor-pointer"
                                    />
                                    <span className="ml-2 text-gray-700">
                                        {size.label} ({size.width}mm x{' '}
                                        {size.height}
                                        mm)
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="text-gray-700 font-bold mb-2 flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={useCustomSize}
                                onChange={() =>
                                    setUseCustomSize(!useCustomSize)
                                }
                                className="mr-2 form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out cursor-pointer"
                            />
                            Custom Size
                        </label>
                        {useCustomSize && (
                            <>
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-bold mb-2">
                                        Item Width (in mm):
                                    </label>
                                    <input
                                        type="number"
                                        value={itemWidth}
                                        onChange={(e) =>
                                            setItemWidth(
                                                parseInt(e.target.value)
                                            )
                                        }
                                        min="10"
                                        className="block w-full mt-1 bg-white border border-gray-300 rounded-lg py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-150"
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-bold mb-2">
                                        Item Height (in mm):
                                    </label>
                                    <input
                                        type="number"
                                        value={itemHeight}
                                        onChange={(e) =>
                                            setItemHeight(
                                                parseInt(e.target.value)
                                            )
                                        }
                                        min="10"
                                        className="block w-full mt-1 bg-white border border-gray-300 rounded-lg py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-150"
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-bold mb-2">
                                        Custom Font Size (in pt):
                                    </label>
                                    <input
                                        type="number"
                                        value={customFontSize}
                                        onChange={(e) =>
                                            setCustomFontSize(
                                                parseInt(e.target.value)
                                            )
                                        }
                                        min="10"
                                        className="block w-full mt-1 bg-white border border-gray-300 rounded-lg py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-150"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <button
                        disabled={!data || data.length === 0}
                        onClick={handlePrint}
                        className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded-lg shadow-md hover:from-green-500 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition ease-in-out duration-150"
                    >
                        Print
                    </button>
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
                            It seems you haven't chosen a menu. Please go back
                            to the <b>order details</b> tab.
                        </p>

                        {/* <button className="mt-6 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-300"
                                >
                                    Go Back to Menu
                                </button> */}
                    </div>
                </Card>
            )}
        </div>
    )
}

export default NameTag
