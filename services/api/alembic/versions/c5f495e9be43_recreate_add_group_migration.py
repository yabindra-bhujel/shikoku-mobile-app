"""Recreate add group migration

Revision ID: c5f495e9be43
Revises: db9305a5062b
Create Date: 2025-01-24 21:20:38.497532

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c5f495e9be43'
down_revision: Union[str, None] = 'db9305a5062b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
