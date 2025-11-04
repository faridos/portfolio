
"""add photo_url to personal_data

Revision ID: ae399d4f8e4d
Revises: b83e45c8fd13
Create Date: 2025-11-04 23:41:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ae399d4f8e4d'
down_revision: Union[str, None] = 'd3b51d46905c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add photo_url column to personal_data table
    op.add_column('personal_data', sa.Column('photo_url', sa.String(255), nullable=True))


def downgrade() -> None:
    # Remove photo_url column from personal_data table
    op.drop_column('personal_data', 'photo_url')
