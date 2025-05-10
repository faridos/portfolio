from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
import os
import aiofiles
from datetime import datetime
from ..database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from ..models.models import Project, AdminUser
from sqlalchemy import select
from ..auth import authenticate_admin

router = APIRouter()

# Get absolute paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UPLOAD_DIR = os.path.join(BASE_DIR, "app", "static", "uploads")
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_file_extension(filename: str) -> str:
    return filename.rsplit(".", 1)[1].lower() if "." in filename else ""

@router.post("/image")
async def upload_image(
    request: Request,
    file: UploadFile = File(...),
    project_id: int = None,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(authenticate_admin)
):
    # Validate file extension
    if get_file_extension(file.filename) not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Validate file size
    file_size = 0
    chunk_size = 1024 * 1024  # 1MB chunks
    while chunk := await file.read(chunk_size):
        file_size += len(chunk)
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {MAX_FILE_SIZE/1024/1024}MB"
            )
    await file.seek(0)

    # Generate unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    extension = get_file_extension(file.filename)
    filename = f"{timestamp}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    # Save file
    async with aiofiles.open(filepath, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)

    # Get base URL from request
    base_url = str(request.base_url).rstrip('/')
    image_url = f"{base_url}/static/uploads/{filename}"

    # If project_id is provided, update the project's image_url
    if project_id:
        query = select(Project).where(Project.id == project_id)
        result = await db.execute(query)
        project = result.scalar_one_or_none()
        
        if not project:
            # Delete the uploaded file if project not found
            os.remove(filepath)
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Delete old image if exists
        if project.image_url:
            old_filepath = os.path.join(UPLOAD_DIR, os.path.basename(project.image_url))
            if os.path.exists(old_filepath):
                os.remove(old_filepath)
        
        # Update project with new image URL
        project.image_url = image_url
        await db.commit()

    return JSONResponse({
        "message": "File uploaded successfully",
        "filename": filename,
        "url": image_url
    }) 