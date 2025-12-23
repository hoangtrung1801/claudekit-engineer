# Feature TDD: Add Competitor

## 1. User Story Implementation
User pastes a URL -> System validates it -> Background worker crawls it.

## 2. API Endpoint
`POST /api/v1/projects/{id}/competitors`
*   **Request**: `{"url": "https://play.google.com/..."}`
*   **Response**: `200 OK` (Competitor Created).

## 3. Service Logic (`project_management/service.py`)
```python
async def add_competitor(project_id, url):
    # 1. Validate
    if not is_valid_store_url(url):
        raise ValidationError("Invalid URL")
    
    # 2. Extract Metadata (Sync Call to SearchAPI for name/icon)
    meta = await search_api.get_app_details(url)
    
    # 3. DB Insert
    comp = Competitor(project_id=project_id, name=meta.name, ...)
    session.add(comp)
    await session.commit()
    
    # 4. Emit Event
    await events.publish("CompetitorCreated", {"id": str(comp.id)})
    
    return comp
```
