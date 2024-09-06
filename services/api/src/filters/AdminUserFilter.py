from typing import Optional
from fastapi_filter.contrib.sqlalchemy import Filter
from ..models.entity.users import User

class AdminUserFilter(Filter):
    is_student: Optional[bool] = None
    is_international_student: Optional[bool] = None
    department: Optional[str] = None
    is_staff: Optional[bool] = None
    is_teacher: Optional[bool] = None

    # ユーザ フィルターのクエリをフィルタリング

    def filter_query(self, query):
        if self.is_student is not None:
            # 学生
            query = query.where(User.role == 'student')
        
        if self.is_international_student is not None:
            # 留学生
            query = query.where(User.is_international_student == self.is_international_student)
        
        if self.department:
            # 学部
            query = query.where(User.department == self.department)
        
        if self.is_staff is not None:
            # スタッフ
            query = query.where(User.role == 'staff')

        if self.is_teacher is not None:
            # 教師
            query = query.where(User.role == 'teacher')

        if self.is_teacher is not None and self.department:
            # 教師と学部
            query = query.where(User.role == 'teacher').where(User.department == self.department)

        if self.is_student is not None and self.department:
            # 学生と学部
            query = query.where(User.role  == 'student').where(User.department == self.department)

        if self.is_international_student is not None and self.department:
            # 留学生と学部
            query = query.where(User.is_international_student == self.is_international_student).where(User.department == self.department)
        
        return query