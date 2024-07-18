export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    tourPath: string
    locale: string
    enableMock: boolean
}

const appConfig: AppConfig = {
    apiPrefix: '/api',
    authenticatedEntryPath: '/home',
    unAuthenticatedEntryPath: '/sign-in',
    tourPath: '/',
    locale: 'en',
    enableMock: true,
}

export  const menu = [
    {
      "food_id": '0001',
      "type": "non-veg",
      "name": "Chicken Biryani",
      "price": "600"
    },
    {
      "food_id": '0002',
      "type": "veg",
      "name": "Paneer Butter Masala",
      "price": "400"
    },
    {
      "food_id": '0003',
      "type": "non-veg",
      "name": "Mushroom Xacuti",
      "price": "700"
    },
    {
      "food_id": '0004',
      "type": "veg",
      "name": "Veg Pulao",
      "price": "350"
    },
    {
      "food_id": '0005',
      "type": "non-veg",
      "name": "Fish Curry",
      "price": "650"
    },
    {
      "food_id": '0006',
      "type": "veg",
      "name": "Gobi Manchurian",
      "price": "300"
    },
    {
      "food_id": '0007',
      "type": "non-veg",
      "name": "Butter Chicken",
      "price": "550"
    },
    {
      "food_id": '0008',
      "type": "veg",
      "name": "Custard",
      "price": "250"
    },
    {
      "food_id": '0009',
      "type": "non-veg",
      "name": "Prawn Masala",
      "price": "750"
    },
    {
      "food_id": '0010',
      "type": "veg",
      "name": "Palak Paneer",
      "price": "450"
    }
  ];


export default appConfig
