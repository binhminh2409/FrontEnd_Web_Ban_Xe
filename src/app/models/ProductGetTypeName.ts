export interface ProductGetTypeName{
    id: number;
    productName: string;
    price: number;
    priceHasDecreased: number;
    description: string | null;
    image: string;
    typeName: string;
    brandNamer: string;
}