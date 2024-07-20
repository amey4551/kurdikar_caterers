 import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { menu } from '@/configs/app.config';

const NameTag = () => {
  const [itemWidth, setItemWidth] = useState(100); // Default item width
  const [itemHeight, setItemHeight] = useState(50); // Default item height
  const [useCustomSize, setUseCustomSize] = useState(false); // State for the checkbox
  const [customFontSize, setCustomFontSize] = useState(25); // State for the custom font size

  const handlePrint = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let x = 10; // Starting X position with a margin of 10 mm
    let y = 10; // Starting Y position with a margin of 10 mm

    menu.forEach((item, index) => {
      const itemName = item.name.toUpperCase(); // Convert item name to uppercase

      // Calculate available width on the current page
      const availableWidth = pageWidth - x;

      // Check if item fits in the available width
      if (itemWidth > availableWidth) {
        // Move to the next page if item width exceeds available width
        doc.addPage();
        x = 10; // Reset X position to start with margin
        y = 10; // Reset Y position to start with margin
      }

      // Draw item background
      doc.setFillColor(200, 200, 200); // Set background color to light gray
      doc.rect(x, y, itemWidth, itemHeight, 'F'); // Draw the background rectangle

      // Calculate maximum font size that fits within the item dimensions
      const maxFontSize = useCustomSize ? customFontSize : getMaxFontSize(doc, itemName, itemWidth, itemHeight);

      // Calculate the width of the text at the maximum font size
      const textWidth = doc.getStringUnitWidth(itemName) * maxFontSize / doc.internal.scaleFactor;

      // Calculate the position to center the text horizontally within the item
      const textX = x + (itemWidth - textWidth) / 2; // Center text horizontally

      // Add item name with calculated font size and centered text position
      doc.setFontSize(maxFontSize);
      doc.text(itemName, textX, y + itemHeight / 2, { align: 'left', maxWidth: itemWidth });

      // Move to the next position
      x += itemWidth + 10; // Add a horizontal gap of 10 mm between items
      if (x + itemWidth > pageWidth) {
        x = 10; // Reset X position to start with margin
        y += itemHeight + 10; // Add a vertical gap of 10 mm between rows

        // Check if next item fits on the current page; if not, add a new page
        if (y + itemHeight > pageHeight) {
          doc.addPage();
          x = 10; // Reset X position to start with margin
          y = 10; // Reset Y position to start with margin
        }
      }
    });

    doc.save('menu.pdf');
  };

  // Function to calculate maximum font size that fits within the item dimensions
  function getFontSize(maxWidth : number, maxHeight : number) {
    const baseWidth = 120;
    const baseHeight = 60;
    const baseFontSize = 25;

    const fontSizeForWidth = maxWidth * (baseFontSize / baseWidth);
    const fontSizeForHeight = maxHeight * (baseFontSize / baseHeight);

    return Math.min(fontSizeForWidth, fontSizeForHeight);
  }

  const getMaxFontSize = (doc : any, text :string, maxWidth : number, maxHeight :number) => {
    const finalFontSize = getFontSize(maxWidth, maxHeight);
    return finalFontSize;
  };

  // Preset size combinations
  const presetSizes = [
    { width: 100, height: 50, label: 'Default' },
    { width: 80, height: 40, label: 'Small' },
    { width: 120, height: 60, label: 'Medium' },
    { width: 150, height: 75, label: 'Large' },
  ];

  // Function to handle preset size selection
  const handlePresetSizeChange = (index : number) => {
    const selectedSize = presetSizes[index];
    setItemWidth(selectedSize.width);
    setItemHeight(selectedSize.height);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Menu</h1>
        <ul className="mb-6">
          {menu.map(item => (
            <li key={item.food_id} className="text-lg mb-2 text-gray-700">
              {item.name.toUpperCase()}
            </li>
          ))}
        </ul>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">
            Preset Sizes:
          </label>
          <div className="flex flex-col space-y-2">
            {presetSizes.map((size, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name="presetSize"
                  checked={itemWidth === size.width && itemHeight === size.height}
                  onChange={() => handlePresetSizeChange(index)}
                  className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-gray-700">{size.label} ({size.width}mm x {size.height}mm)</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2 flex items-center">
            <input
              type="checkbox"
              checked={useCustomSize}
              onChange={() => setUseCustomSize(!useCustomSize)}
              className="mr-2 form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
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
                  onChange={(e) => setItemWidth(parseInt(e.target.value))}
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
                  onChange={(e) => setItemHeight(parseInt(e.target.value))}
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
                  onChange={(e) => setCustomFontSize(parseInt(e.target.value))}
                  min="10"
                  className="block w-full mt-1 bg-white border border-gray-300 rounded-lg py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-150"
                />
              </div>
            </>
          )}
        </div>
        <button
          onClick={handlePrint}
          className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded-lg shadow-md hover:from-green-500 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition ease-in-out duration-150"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default NameTag;
