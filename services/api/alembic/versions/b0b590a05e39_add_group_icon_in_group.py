"""add group icon in  group 

Revision ID: b0b590a05e39
Revises: 286df726983a
Create Date: 2024-07-02 10:31:31.625369

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b0b590a05e39'
down_revision: Union[str, None] = '286df726983a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('groups', sa.Column('group_image', sa.String(), nullable=True))
    op.drop_column('groups', 'group_images')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('groups', sa.Column('group_images', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_column('groups', 'group_image')
    # ### end Alembic commands ###