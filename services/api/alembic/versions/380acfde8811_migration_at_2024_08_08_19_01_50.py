"""Migration at 2024-08-08 19:01:50

Revision ID: 380acfde8811
Revises: dbf38ab51636
Create Date: 2024-08-08 19:01:51.685369

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '380acfde8811'
down_revision: Union[str, None] = 'dbf38ab51636'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user_otp',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('otp', sa.String(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_otp_id'), 'user_otp', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_user_otp_id'), table_name='user_otp')
    op.drop_table('user_otp')
    # ### end Alembic commands ###
