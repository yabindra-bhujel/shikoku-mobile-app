import { ImageInterface } from "./PostInterface";

interface User {
    id: number;
    first_name?: string;
    last_name?: string;
    profile_picture?: string;
    username?: string;
}

interface Comment {
    id: number;
    content: string;
    created_at: string; // Assuming ISO 8601 format for date-time strings
    post_id: number;
    user: User;
}

export interface PostDetailInterface {
    id: number;
    content: string;
    images: ImageInterface[]; // Array of image URLs
    videos: string[]; // Array of video URLs
    files: string[]; // Array of file URLs
    created_at: string; // Assuming ISO 8601 format for date-time strings
    user: User;
    is_active: boolean;
    total_comments: number;
    total_likes: number;
    is_liked: boolean;
    replies: any;
    parent_comment_id: number;
    comment: any;
}

export interface CommentListInterface {
    comments: Comment[];
    replies: any;
    parent_comment_id: number;
    id: number;
    comment: any;
}
