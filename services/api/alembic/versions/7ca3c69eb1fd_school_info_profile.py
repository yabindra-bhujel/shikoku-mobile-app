"""school_info_profile

Revision ID: 7ca3c69eb1fd
Revises: f5ae64bfdb6a
Create Date: 2024-07-25 17:05:00.820328

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7ca3c69eb1fd'
down_revision: Union[str, None] = 'f5ae64bfdb6a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user_profile', sa.Column('department', sa.String(), nullable=True))
    op.add_column('user_profile', sa.Column('is_student', sa.Boolean(), nullable=True))
    op.add_column('user_profile', sa.Column('is_international_student', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user_profile', 'is_international_student')
    op.drop_column('user_profile', 'is_student')
    op.drop_column('user_profile', 'department')
    # ### end Alembic commands ###