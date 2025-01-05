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
    client_contact: string;
    order_occasion: string;
    other_occasion: string;
};

export type CreateDraftType = {
    id: number;
    created_at: string;
    order_date: string;
    order_time: string;
    order_location: string;
    client_name: string;
    people_count: number;
    order_occasion: string;
    order_status: string;
    order_food_items: FoodItemData[];
  };
  
  type FoodItemData = {
    id: number;
    item_name: string;
    item_type: boolean;
    cutlery_type: string;
    serving_spoon: string;
  };
  
  export type ComponentPropType = {
    data: CreateDraftType
  }