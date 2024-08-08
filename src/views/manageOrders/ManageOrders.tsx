
import Tabs from '@/components/ui/Tabs'
import NameTag from '../nameTags'
import Invoice from '../invoice'
import Checklist from '../checklist/Checklist'

const { TabNav, TabList, TabContent } = Tabs

const ManageOrders = () => {    
    return (
        <div>
            <Tabs defaultValue="tab1">
                <TabList>
                    <TabNav value="tab1">Order details</TabNav>
                    <TabNav value="tab2">Checklist</TabNav>
                    <TabNav value="tab3">Name tags</TabNav>
                    <TabNav value="tab4">Reciept</TabNav>
                </TabList>
                <div className="p-4">
                    <TabContent value="tab1">
                        <p>
                        Order details
                        </p>
                    </TabContent>
                    <TabContent value="tab2">
                        <Checklist/>
                    </TabContent>
                    <TabContent value="tab3">
                        <NameTag/>
                    </TabContent>
                    <TabContent value="tab4">
                       <Invoice/>
                    </TabContent>
                </div>
            </Tabs>
        </div>
    )
}

export default ManageOrders

