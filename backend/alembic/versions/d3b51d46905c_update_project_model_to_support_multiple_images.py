
"""update project model to support multiple images

Revision ID: d3b51d46905c
Revises: b83e45c8fd13
Create Date: 2025-10-31 19:16:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd3b51d46905c'
down_revision: Union[str, None] = 'b83e45c8fd13'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add new image_urls column
    op.add_column('projects', sa.Column('image_urls', sa.JSON(), nullable=True))

    # Migrate data from image_url to image_urls
    # Convert string URLs to JSON arrays, handle NULL values
    op.execute("""
        UPDATE projects
        SET image_urls = CASE
            WHEN image_url IS NOT NULL AND image_url != ''
            THEN json_build_array(image_url)
            ELSE NULL
        END
    """)

    # Drop the old image_url column
    op.drop_column('projects', 'image_url')


def downgrade() -> None:
    # Add back the old image_url column
    op.add_column('projects', sa.Column('image_url', sa.String(255), nullable=True))

    # Migrate data from image_urls back to image_url
    # Extract first element from JSON array, handle NULL values
    op.execute("""
        UPDATE projects
        SET image_url = CASE
            WHEN image_urls IS NOT NULL AND json_array_length(image_urls) > 0
            THEN image_urls->>0
            ELSE NULL
        END
    """)

    # Drop the new image_urls column
    op.drop_column('projects', 'image_urls')
