# Feature TDD: Hero Video Detection

## 1. Logic Implementation
We are looking for velocity. `v = (current_views - past_views) / time_diff`.

## 2. Worker Job (`data_processing/worker.py`)
```python
async def detect_hero_videos():
    # 1. Get recent snapshots (window function check)
    sql = """
    WITH stats AS (
      SELECT video_id, 
             MAX(views) - MIN(views) as view_diff, 
             EXTRACT(EPOCH FROM MAX(captured_at) - MIN(captured_at))/3600 as hours_diff
      FROM video_snapshots
      WHERE captured_at > NOW() - INTERVAL '24 hours'
      GROUP BY video_id
      HAVING count(*) > 1
    )
    SELECT * FROM stats WHERE (view_diff / hours_diff) > 1000 -- Threshold
    """
    
    rows = await db.fetch_all(sql)
    
    # 2. Update Flags
    for row in rows:
        await db.execute("UPDATE videos SET is_hero=True, hero_score=:score WHERE id=:id", ...)
        
    # 3. Emit
    if rows:
        await events.publish("HeroVideoDetected", {"count": len(rows)})
```
