export type FoodItemType = {
    id: number;
    item_name: string;
    category: string;
};

export type FoodItemTypeMenu = {
    id: number;
    item_name: string;
    category: string;
    food_item_name:string
};

export type FoodItemProps = {
    selectedItems: FoodItemType[];
    setSelectedItems: React.Dispatch<React.SetStateAction<FoodItemType[]>>;
};

export type Option = {
    value: string;
    label: string;
};

export type FormModel = {
    order_date: Date | null;
    order_time: string;
    order_location: string;
    client_name: string;
    people_count: number;
    order_occasion: string;
};
