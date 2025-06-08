import { mproduct } from "@/constants";
import { Card, Area, Begin } from "@/lib/by/Div";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/pattern/share/Tabs";
import { map } from "lodash";

export function ProductDetailsTabs({
  productData,
}: {
  productData: IProduct;
}) {
  return (
    <Card className="flex flex-col gap-2 shadow-md bg-white rounded-lg p-4 min-h-[400px] flex-1">
      <Tabs defaultValue="description">
        <Area>
          <Begin>
            <TabsList>
                {map(mproduct.tabs, (tab) => (
               
                  <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                  </TabsTrigger>
                ))}
            </TabsList>
          </Begin>
        </Area>

        <Area className="pt-2 text-sm text-gray-700">
          <TabsContent value="description">
            <p>{productData.description}</p>
          </TabsContent>
          <TabsContent value="ingredients">
            <p>{productData.ingredients ?? ""}</p>
          </TabsContent>
          <TabsContent value="how-to-use">
            <p>{productData.how_to_use}</p>
          </TabsContent>
          <TabsContent value="reviews">
            <p>No reviews yet.</p>
          </TabsContent>
        </Area>
      </Tabs>
    </Card>
  );
}
