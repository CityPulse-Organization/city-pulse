export type Photo = {
    id: string;
    uri: string;
    width: number;
    height: number;
};

export type GridItem = Photo | { id: "camera-id" };