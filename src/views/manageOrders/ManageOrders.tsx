import Tabs from '@/components/ui/Tabs'
import NameTag from '../nameTags'
import Invoice from '../invoice'
import Checklist from '../checklist/Checklist'
import { supabase } from '@/backend/supabaseClient'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import UpdateOrders from '../updateOrders'

const { TabNav, TabList, TabContent } = Tabs

const ManageOrders = () => {
    const [response, setResponse] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [tabChange, setTabChange] = useState<boolean>(true)
    const params = useParams<{ id: string }>()

    const fetchOrderData = async (orderId: string) => {
        const { data, error } = await supabase
            .from('order_datetime_details')
            .select(
                `
            *,
            order_food_items:order_food_items (
              food_item_data:food_item_data (*)
            )
          `
            )
            .eq('id', orderId)
            .single()

        setResponse(data)

        if (error) {
            console.error('Error fetching order details:', error)
            return null
        }
        setLoading(false)
    }

    useEffect(() => {
        if (params) fetchOrderData(params.id as string)
    }, [params, tabChange])

    return (
        <div>
            <Tabs
                defaultValue="tab1"
                onChange={() => setTabChange((prev) => !prev)}
            >
                <TabList>
                    <TabNav value="tab1">Order details</TabNav>
                    <TabNav value="tab2">Checklist</TabNav>
                    <TabNav value="tab3">Name tags</TabNav>
                    {/* <TabNav value="tab4">Reciept</TabNav> */}
                </TabList>
                <div className="p-4">
                    <TabContent value="tab1">
                        <UpdateOrders data={response} />
                    </TabContent>
                    <TabContent value="tab2">
                        <Checklist data={response} />
                    </TabContent>
                    <TabContent value="tab3">
                        <NameTag
                            data={response.order_food_items}
                            loading={loading}
                        />
                    </TabContent>
                    {/* <TabContent value="tab4">
                        <Invoice />
                    </TabContent> */}
                </div>
            </Tabs>
        </div>
    )
}

export default ManageOrders
