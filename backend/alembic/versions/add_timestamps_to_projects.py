"""add timestamps to projects

Revision ID: add_timestamps_to_projects
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime

# revision identifiers, used by Alembic.
revision = 'add_timestamps_to_projects'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Add created_at and updated_at columns
    op.add_column('projects', sa.Column('created_at', sa.DateTime(), nullable=True))
    op.add_column('projects', sa.Column('updated_at', sa.DateTime(), nullable=True))
    
    # Set default values for existing rows
    op.execute("UPDATE projects SET created_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP")
    
    # Make columns non-nullable
    op.alter_column('projects', 'created_at', nullable=False)
    op.alter_column('projects', 'updated_at', nullable=False)

def downgrade():
    # Remove the columns
    op.drop_column('projects', 'updated_at')
    op.drop_column('projects', 'created_at') 