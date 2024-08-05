from typing import Optional
from fastapi_filter.contrib.sqlalchemy import Filter
from ..models.entity.users import User

class UserFilter(Filter):
    is_student: Optional[bool] = None
    is_international_student: Optional[bool] = None
    department: Optional[str] = None

    # ユーザ フィルターのクエリをフィルタリング

    def filter_query(self, query):
        if self.is_student is not None:
            # 学生
            query = query.where(User.is_student == self.is_student)
        
        if self.is_international_student is not None:
            # 留学生
            query = query.where(User.is_international_student == self.is_international_student)
        
        if self.department:
            # 学部
            query = query.where(User.department == self.department)
        
        return query