#!/usr/bin/env python3
"""
Script to create a new Alembic migration for the project model changes.
"""
import os
import sys
from alembic.config import Config
from alembic import command

def create_migration():
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Create Alembic configuration
    alembic_cfg = Config(os.path.join(script_dir, 'alembic.ini'))

    # Generate migration
    command.revision(
        alembic_cfg,
        message="update project model to support multiple images",
        autogenerate=True
    )

    print("Migration created successfully!")
    print("Run 'python3 run_migrations.py' to apply the migration.")

if __name__ == "__main__":
    create_migration()