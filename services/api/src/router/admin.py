from fastapi import APIRouter, Depends, HTTPException, status,  File, UploadFile, BackgroundTasks, Form, Request, Response
from sqlalchemy.orm import Session, joinedload
from fastapi_pagination import Page, Params
from fastapi_pagination.ext.sqlalchemy import paginate
from ..models.database import get_db
from ..models.entity.users import User
from ..auth.permissions import authenticate_admin
from ..models.entity.user_profile import UserProfile
from ..filters.AdminUserFilter import AdminUserFilter
from ..settings.auth import AuthSettings
from ..BusinessLogic.utils.EmailUtils import EmailUtils
from ..schemas.admin import UserSchema, UserInput
import random
import string
import csv
from io import StringIO
from ..BusinessLogic.AdminUserLogic import AdminUserLogic
from ..auth.logic import AuthLogic

router = APIRouter(prefix="/admin", tags=["Admin"])
db_dependency = Depends(get_db)
auth = AuthSettings()
logic = AdminUserLogic()
auth_logic = AuthLogic()



@router.post("/login", status_code=status.HTTP_200_OK)
def admin_login(
    response: Response,
    request: Request,
    username: str = Form(...),
    password: str = Form(...),
    db: Session = db_dependency, 
    
):
    """Login and return an access token."""
    try:

        user = auth_logic.authenticate_user(username, password, db)


        # check if user is admin
        if user.role != 'admin':
            # if not admin return unauthorized
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized access")
        
        
        access_token, refresh_token = auth_logic.login_token(db, user.username, password=password)


        # アクセストークンとリフレッシュトークンがない場合
        if access_token and refresh_token is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")

        # アクセストークンをクッキーにセット
        response.set_cookie(key="access_token", value=access_token)
        response.set_cookie(key="refresh_token", value=refresh_token)
        
        # リフレッシュトークンをresponse で返す
        return {"message": "Login successful", "refresh_token": refresh_token}
    

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/users", response_model=Page[UserSchema])
def get_users(
    db: Session = db_dependency, 
    user_filter: AdminUserFilter = Depends(AdminUserFilter),
    params: Params = Depends(),
    user = Depends(authenticate_admin)
):
    """Fetch and filter users with pagination."""
    try:

        users = logic.user_list(db, user_filter)
        return users

    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve users.")

@router.post("/users/", status_code=status.HTTP_201_CREATED)
def create_user(
    user_input: UserInput,
    db: Session = db_dependency
):
    """Create a new user with an auto-generated password."""
    try:
        new_user = logic.create(db, user_input)
        return new_user

    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User creation failed.")
    
@router.post("/user/upload_file", status_code=status.HTTP_201_CREATED, response_model=None)
async def create_user_from_csv(
    db: Session = db_dependency, 
    file: UploadFile = File(...), 
    user: User = Depends(authenticate_admin)
): 
    try:
        # ファイルを読み込む
        contents = await file.read()


        csv_reader = csv.DictReader(StringIO(contents.decode("utf-8")))

        # rules for csv file
        # if user is student then most have department 
        # if user is international student then role must be student
        #if user is admin and staff then department must be empty and is_student and is_international_student must be false



        for row in csv_reader:
            username = row.get('username')
            email = row.get('email')
            role = row.get('role')
            is_international_student = row.get('is_international_student') == 'True'
            department = row.get('department') or ""


            # CSVからの役割の検証
            if role not in ['admin', 'staff', 'student', 'teacher']:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")

            # 学生の場合、部門が必要
            if role == 'student' and department.strip() == "":
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Department is required for student")

            # 先生の場合、部門が必要
            if role == 'teacher' and department.strip() == "":
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Department is required for teacher")

            # インターナショナル学生の場合、役割が 'student' でなければならない
            if is_international_student and role != 'student':
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Role must be student for international student")

            # admin または staff の場合、部門が空でなければならない
            if role in ['admin', 'staff']:
                if department.strip() != "":
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Department must be empty for admin and staff")
                if is_international_student:
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="is_international_student must be false for admin and staff")

            
            first_name = row.get('first_name')
            last_name = row.get('last_name')

            user_input = UserInput(
                id=username,
                email=email,
                firstName=first_name,
                lastName=last_name,
                internationalStudent=is_international_student,
                role=role,
                department=department
            )

            new_user, password = create_new_user(user_input, db)
            send_user_creation_email(new_user.email, password)

        return {"message": "Users created successfully"}
    
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))



def create_new_user(user_input: UserInput, db: Session):
    """Helper function to create a new user and their profile."""
    user_password = GeneratePassword().generate_password()
    hashed_password = auth.hash_password(user_password)

    user = User(
        username=user_input.id,
        email=user_input.email,
        role=user_input.role,
        department=user_input.department,
        is_international_student=user_input.internationalStudent,
        hashed_password=hashed_password
    )

    user_profile = UserProfile(
        first_name=user_input.firstName,
        last_name=user_input.lastName,
        user_id=user_input.id
    )

    user.user_profile = user_profile

    db.add(user)
    db.commit()
    db.refresh(user)

    return user, user_password

def send_user_creation_email(email: str, password: str):
    """Helper function to send account creation email."""
    email_utils = EmailUtils()
    subject = "Account Created"
    body = f"Your account has been created. Your password is {password}. Please change it after your first login."
    email_utils.send_email(email, subject, body)


class GeneratePassword:
    
    def generate_password(self, length: int = 8) -> str:
        """Generate a secure password."""
        if length < 4:
            raise ValueError("Password length must be at least 4 characters.")
        
        # Character selection
        uppercase = random.choice(string.ascii_uppercase)
        lowercase = random.choice(string.ascii_lowercase)
        
        # Avoid using certain ambiguous characters
        special_characters = "!@#$%^&*()-_=+[]{};:,.<>?/`~"
        special = random.choice(special_characters)
        digit = random.choice(string.digits)
        
        # Combine all required character types
        all_characters = [uppercase, lowercase, special, digit]
        
        # Add random characters until the desired length
        if length > 4:
            all_characters += random.choices(
                string.ascii_letters + string.digits + special_characters, 
                k=length - 4
            )
        
        # Shuffle the characters to ensure randomness
        random.shuffle(all_characters)
        
        # Return the final password as a string
        password = ''.join(all_characters)
        return password




@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: str, db: Session = db_dependency):
    """Delete a user by ID."""
    try:
        logic.delete(db, user_id)
        return None

    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User deletion failed.")