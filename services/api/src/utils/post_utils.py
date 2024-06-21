import os
from datetime import datetime

class PostUtils:

    # Define the paths to save the post images, videos and files
    POST_IMAGE_PATH = "static/post/post_images"
    POST_VIDEO_PATH = "static/post/post_videos"
    POST_FILE_PATH = "static/post/post_files"

    # ファイル 写真 ビデオの保存先を定義
    @staticmethod
    def _create_save_dirs():
        os.makedirs(PostUtils.POST_IMAGE_PATH, exist_ok=True)
        os.makedirs(PostUtils.POST_VIDEO_PATH, exist_ok=True)
        os.makedirs(PostUtils.POST_FILE_PATH, exist_ok=True)

    # ポストの画像を保存
    @staticmethod
    def save_post_image(post_id: int, image: bytes) -> str:
        PostUtils._create_save_dirs()
        image_path = os.path.join(PostUtils.POST_IMAGE_PATH, f"{post_id}.jpg")
        with open(image_path, "wb") as file:
            file.write(image)
        return image_path

    #   ポストのビデオを保存
    @staticmethod
    def save_post_video(post_id: int, video: bytes, video_ext: str) -> str:
        PostUtils._create_save_dirs()
        video_path = os.path.join(PostUtils.POST_VIDEO_PATH, f"{post_id}.{video_ext}")
        with open(video_path, "wb") as file:
            file.write(video)
        return video_path

    # ポストのファイルを保存
    @staticmethod
    def save_post_file(post_id: int, file: bytes, filename: str) -> str:
        PostUtils._create_save_dirs()
        file_path = os.path.join(PostUtils.POST_FILE_PATH, f"{post_id}_{filename}")
        with open(file_path, "wb") as file_obj:
            file_obj.write(file)
        return file_path

    # 現在の時間を取得
    @staticmethod
    def get_current_time():
        return datetime.utcnow()