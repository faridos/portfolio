from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import date, datetime

class ProjectBase(BaseModel):
    title: str
    description: str
    technologies: List[str]
    image_urls: Optional[List[str]] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    featured: bool = False

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    technologies: Optional[List[str]] = None
    image_urls: Optional[List[str]] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    featured: Optional[bool] = None

class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Project(ProjectResponse):
    pass

class ExperienceBase(BaseModel):
    company: str
    position: str
    start_date: date
    end_date: Optional[date] = None
    description: str
    location: Optional[str] = None
    current: bool = False

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    position: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = None
    location: Optional[str] = None
    current: Optional[bool] = None

class ExperienceResponse(ExperienceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Experience(ExperienceResponse):
    pass

class PersonalDataBase(BaseModel):
    name: str
    title: str
    bio: str
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    photo_url: Optional[str] = None
    social_links: Optional[Dict[str, str]] = None
    skills: Optional[List[str]] = None

class PersonalDataCreate(PersonalDataBase):
    pass

class PersonalDataUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    photo_url: Optional[str] = None
    social_links: Optional[Dict[str, str]] = None
    skills: Optional[List[str]] = None

class PersonalDataResponse(PersonalDataBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PersonalData(PersonalDataResponse):
    pass 