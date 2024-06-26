export interface PostInterface {
    id: number;
    content: string;
    images: string[];
    videos: string[];
    files: string[];
    created_at: string;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        profile_picture?: string;
    };
    is_active: boolean;
    total_comments: number;
    total_likes: number;
}
