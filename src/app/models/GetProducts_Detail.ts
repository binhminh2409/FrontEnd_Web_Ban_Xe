export interface GetProducts_Detail_Response {
    success: boolean;
    httpStatusCode: number;
    message: string;
    data: GetProducts_Detail;
    totalCount: number;
}

export interface GetProducts_Detail {
    id: number;
    productID: number;
    productName: string;
    price: number;
    priceHasDecreased: number;
    brandName: string;
    imgage: string; // Kiểm tra chính tả 'image'
    weight: number; // Cập nhật kiểu thành number
    other_Details: string;
}
