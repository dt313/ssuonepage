import axios from 'axios';

// Use the internal API routes
const INTERNAL_API_BASE_URL = '/api/kakao';

export type KakaoPlace = {
    id: string;
    place_name: string;
    category_name: string;
    category_group_code: string;
    category_group_name: string;
    phone: string;
    address_name: string;
    road_address_name: string;
    x: string;
    y: string;
    place_url: string;
    distance: string;
};

export type KakaoAddress = {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    mountain_yn: string;
    main_address_no: string;
    sub_address_no: string;
    zip_code: string;
};

export type KakaoRoadAddress = {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    road_name: string;
    underground_yn: string;
    main_building_no: string;
    sub_building_no: string;
    building_name: string;
    zone_no: string;
};

export const searchLocation = async (query: string, page = 1, size = 15) => {
    try {
        const response = await axios.get(`${INTERNAL_API_BASE_URL}/search`, {
            params: {
                query,
                page,
                size,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error searching location:', error);
        throw error;
    }
};

export const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
        const response = await axios.get(`${INTERNAL_API_BASE_URL}/address`, {
            params: {
                lat,
                lng,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error getting address from coords:', error);
        throw error;
    }
};
