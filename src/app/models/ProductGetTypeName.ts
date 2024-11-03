export interface ProductGetTypeName {
    id: number;
    productName: string;
    price: number;
    priceHasDecreased: number;
    description: string | null;
    image: string;
    typeName: string;
    brandNamer: string;
}

export interface ApiResponse<T> {
    success: boolean;
    httpStatusCode: number;
    message: string;
    data: {
        result: T[];
        totalCount: number;
    };
}
